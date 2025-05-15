import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = `${import.meta.env.VITE_REACT_APP_BE_API_URL || "http://localhost:8085"}/api/user`;

// Function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token') || '';
};

// Helper function to get user from localStorage
export const getUserFromLocalStorage = () => {
  try {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

// Helper function to set user in localStorage
export const setUserInLocalStorage = (userData) => {
  try {
    const existingUser = getUserFromLocalStorage();
    const updatedUser = existingUser ? { ...existingUser, ...userData } : userData;
    localStorage.setItem('user', JSON.stringify(updatedUser));
  } catch (error) {
    console.error("Error saving user to localStorage:", error);
  }
};

// Sync action to load user profile from localStorage
export const loadUserProfile = createAsyncThunk(
  "user/loadProfile",
  async (_, { rejectWithValue }) => {
    try {
      const userData = getUserFromLocalStorage();
      if (!userData) {
        throw new Error('No user data found in localStorage');
      }
      return userData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update user profile in localStorage and backend
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      // userData should be in format: { name, email, address, phoneno }
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile. HTTP status: ${response.status}`);
      }

      const data = await response.json();
      // Update user data in localStorage
      setUserInLocalStorage(data);
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
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/updatePassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          curPassword: passwordData.curPassword,
          newPassword: passwordData.newPassword
        })
      });

      // Check if response is ok first
      if (!response.ok) {
        // Try to parse error response as JSON, but handle case where it's not valid JSON
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to update password. HTTP status: ${response.status}`);
        } catch (jsonError) {
          // If JSON parsing fails, use status text
          throw new Error(`Failed to update password. ${response.statusText || `HTTP status: ${response.status}`}`);
        }
      }

      // For successful responses, also handle potential empty responses
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          return data;
        } else {
          // If not JSON or empty response, return a success object
          return { success: true, message: "Password updated successfully" };
        }
      } catch (jsonError) {
        // If JSON parsing fails but response was ok, still return success
        return { success: true, message: "Password updated successfully" };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  profile: getUserFromLocalStorage(), // Initialize from localStorage
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
    // Handle loadUserProfile
    builder
      .addCase(loadUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(loadUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load user profile';
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
