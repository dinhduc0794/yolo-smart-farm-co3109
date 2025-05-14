import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = `${import.meta.env.VITE_REACT_APP_BE_API_URL || "http://localhost:8085"}/api`;

// Function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token') || '';
};

// Async thunks for system
export const fetchSystemStats = createAsyncThunk(
  "system/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${BASE_URL}/system/stat`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSystemMode = createAsyncThunk(
  "system/fetchMode",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${BASE_URL}/system/systemmode`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateSystemMode = createAsyncThunk(
  "system/updateMode",
  async (mode, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/system/systemmode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ mode })
      });

      if (!response.ok) {
        throw new Error(`Failed to update system mode. HTTP status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOperationMode = createAsyncThunk(
  "system/fetchOperationMode",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${BASE_URL}/mode`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateOperationMode = createAsyncThunk(
  "system/updateOperationMode",
  async (mode, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(`${BASE_URL}/mode`, { mode }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  stats: null,
  systemMode: null,
  operationMode: null,
  loading: false,
  error: null,
};

const systemSlice = createSlice({
  name: "system",
  initialState,
  reducers: {
    clearSystemErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchSystemStats
    builder
      .addCase(fetchSystemStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSystemStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchSystemStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch system stats';
      });

    // Handle fetchSystemMode
    builder
      .addCase(fetchSystemMode.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSystemMode.fulfilled, (state, action) => {
        state.loading = false;
        state.systemMode = action.payload;
        state.error = null;
      })
      .addCase(fetchSystemMode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch system mode';
      });

    // Handle updateSystemMode
    builder
      .addCase(updateSystemMode.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSystemMode.fulfilled, (state, action) => {
        state.loading = false;
        state.systemMode = action.payload;
        state.error = null;
      })
      .addCase(updateSystemMode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update system mode';
      });

    // Handle fetchOperationMode
    builder
      .addCase(fetchOperationMode.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOperationMode.fulfilled, (state, action) => {
        state.loading = false;
        state.operationMode = action.payload;
        state.error = null;
      })
      .addCase(fetchOperationMode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch operation mode';
      });

    // Handle updateOperationMode
    builder
      .addCase(updateOperationMode.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOperationMode.fulfilled, (state, action) => {
        state.loading = false;
        state.operationMode = action.payload;
        state.error = null;
      })
      .addCase(updateOperationMode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update operation mode';
      });
  },
});

export const { clearSystemErrors } = systemSlice.actions;
export default systemSlice.reducer;
