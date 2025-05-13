import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_REACT_APP_BE_API_URL || "http://localhost:8085/api/user";

// Async thunks for user
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user profile. HTTP status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile. HTTP status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserPassword = createAsyncThunk(
  "user/updatePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/updatePassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(passwordData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update password. HTTP status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  profile: null,
  loading: false,
  error: null,
  passwordUpdateSuccess: false,
  profileUpdateSuccess: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserErrors: (state) => {
      state.error = null;
    },
    resetUpdateStatus: (state) => {
      state.passwordUpdateSuccess = false;
      state.profileUpdateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchUserProfile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user profile';
      });

    // Handle updateUserProfile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.profileUpdateSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
        state.profileUpdateSuccess = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update profile';
        state.profileUpdateSuccess = false;
      });

    // Handle updateUserPassword
    builder
      .addCase(updateUserPassword.pending, (state) => {
        state.loading = true;
        state.passwordUpdateSuccess = false;
      })
      .addCase(updateUserPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.passwordUpdateSuccess = true;
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update password';
        state.passwordUpdateSuccess = false;
      });
  },
});

export const { clearUserErrors, resetUpdateStatus } = userSlice.actions;
export default userSlice.reducer;
