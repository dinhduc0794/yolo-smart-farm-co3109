import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = `${import.meta.env.VITE_REACT_APP_BE_API_URL || "http://localhost:8085"}/api`;

// Function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token') || '';
};

// Async thunks for sensor data
export const fetchCurrentData = createAsyncThunk(
  "data/fetchCurrent",
  async (factor, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/${factor}/current`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch current data. HTTP status: ${response.status}`);
      }

      const data = await response.json();
      return { factor, data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const refreshData = createAsyncThunk(
  "data/refresh",
  async (factor, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/${factor}/refresh`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to refresh data. HTTP status: ${response.status}`);
      }

      const data = await response.json();
      return { factor, data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDataMode = createAsyncThunk(
  "data/fetchMode",
  async (factor, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/${factor}/mode`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch mode. HTTP status: ${response.status}`);
      }

      const mode = await response.json();
      return { factor, mode };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateDataMode = createAsyncThunk(
  "data/updateMode",
  async ({ factor, mode }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/${factor}/mode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ mode })
      });

      if (!response.ok) {
        throw new Error(`Failed to update mode. HTTP status: ${response.status}`);
      }

      const updatedMode = await response.json();
      return { factor, mode: updatedMode };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchThreshold = createAsyncThunk(
  "data/fetchThreshold",
  async (factor, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/${factor}/threshold`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch threshold. HTTP status: ${response.status}`);
      }

      const threshold = await response.json();
      return { factor, threshold };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateThreshold = createAsyncThunk(
  "data/updateThreshold",
  async ({ factor, threshold }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/${factor}/threshold`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ threshold })
      });

      if (!response.ok) {
        throw new Error(`Failed to update threshold. HTTP status: ${response.status}`);
      }

      const updatedThreshold = await response.json();
      return { factor, threshold: updatedThreshold };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  temperature: {
    current: null,
    mode: null,
    threshold: null,
    loading: false,
    error: null,
  },
  humidity: {
    current: null,
    mode: null,
    threshold: null,
    loading: false,
    error: null,
  },
  light: {
    current: null,
    mode: null,
    threshold: null,
    loading: false,
    error: null,
  },
  gas: {
    current: null,
    mode: null,
    threshold: null,
    loading: false,
    error: null,
  },
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    clearDataErrors: (state) => {
      state.temperature.error = null;
      state.humidity.error = null;
      state.light.error = null;
      state.gas.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchCurrentData
    builder
      .addCase(fetchCurrentData.pending, (state, action) => {
        const factor = action.meta.arg;
        state[factor].loading = true;
      })
      .addCase(fetchCurrentData.fulfilled, (state, action) => {
        const { factor, data } = action.payload;
        state[factor].current = data;
        state[factor].loading = false;
        state[factor].error = null;
      })
      .addCase(fetchCurrentData.rejected, (state, action) => {
        const factor = action.meta.arg;
        state[factor].loading = false;
        state[factor].error = action.payload || 'Failed to fetch current data';
      });

    // Handle refreshData
    builder
      .addCase(refreshData.pending, (state, action) => {
        const factor = action.meta.arg;
        state[factor].loading = true;
      })
      .addCase(refreshData.fulfilled, (state, action) => {
        const { factor, data } = action.payload;
        state[factor].current = data;
        state[factor].loading = false;
        state[factor].error = null;
      })
      .addCase(refreshData.rejected, (state, action) => {
        const factor = action.meta.arg;
        state[factor].loading = false;
        state[factor].error = action.payload || 'Failed to refresh data';
      });

    // Handle fetchDataMode
    builder
      .addCase(fetchDataMode.pending, (state, action) => {
        const factor = action.meta.arg;
        state[factor].loading = true;
      })
      .addCase(fetchDataMode.fulfilled, (state, action) => {
        const { factor, mode } = action.payload;
        state[factor].mode = mode;
        state[factor].loading = false;
        state[factor].error = null;
      })
      .addCase(fetchDataMode.rejected, (state, action) => {
        const factor = action.meta.arg;
        state[factor].loading = false;
        state[factor].error = action.payload || 'Failed to fetch mode';
      });

    // Handle updateDataMode
    builder
      .addCase(updateDataMode.pending, (state, action) => {
        const { factor } = action.meta.arg;
        state[factor].loading = true;
      })
      .addCase(updateDataMode.fulfilled, (state, action) => {
        const { factor, mode } = action.payload;
        state[factor].mode = mode;
        state[factor].loading = false;
        state[factor].error = null;
      })
      .addCase(updateDataMode.rejected, (state, action) => {
        const { factor } = action.meta.arg;
        state[factor].loading = false;
        state[factor].error = action.payload || 'Failed to update mode';
      });

    // Handle fetchThreshold
    builder
      .addCase(fetchThreshold.pending, (state, action) => {
        const factor = action.meta.arg;
        state[factor].loading = true;
      })
      .addCase(fetchThreshold.fulfilled, (state, action) => {
        const { factor, threshold } = action.payload;
        state[factor].threshold = threshold;
        state[factor].loading = false;
        state[factor].error = null;
      })
      .addCase(fetchThreshold.rejected, (state, action) => {
        const factor = action.meta.arg;
        state[factor].loading = false;
        state[factor].error = action.payload || 'Failed to fetch threshold';
      });

    // Handle updateThreshold
    builder
      .addCase(updateThreshold.pending, (state, action) => {
        const { factor } = action.meta.arg;
        state[factor].loading = true;
      })
      .addCase(updateThreshold.fulfilled, (state, action) => {
        const { factor, threshold } = action.payload;
        state[factor].threshold = threshold;
        state[factor].loading = false;
        state[factor].error = null;
      })
      .addCase(updateThreshold.rejected, (state, action) => {
        const { factor } = action.meta.arg;
        state[factor].loading = false;
        state[factor].error = action.payload || 'Failed to update threshold';
      });
  },
});

export const { clearDataErrors } = dataSlice.actions;
export default dataSlice.reducer;
