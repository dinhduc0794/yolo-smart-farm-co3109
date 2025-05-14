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
      // Validate factor to ensure it's one of the allowed values
      if (!["humidity", "temperature", "moisture", "light"].includes(factor)) {
        throw new Error(`Invalid factor: ${factor}`);
      }
      
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
        throw new Error(`Failed to fetch current ${factor} data. HTTP status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Fetched ${factor} data:`, data);
      return { factor, data };
    } catch (error) {
      console.error(`Error fetching ${factor} data:`, error);
      return rejectWithValue(error.message);
    }
  }
);

// Fetch data for all factors at once
export const fetchAllCurrentData = createAsyncThunk(
  "data/fetchAllCurrent",
  async (_, { dispatch }) => {
    const factors = ["humidity", "temperature", "moisture", "light"];
    const results = {};
    
    try {
      // Create an array of promises
      const promises = factors.map(factor => 
        dispatch(fetchCurrentData(factor))
          .then(result => {
            if (!result.error) {
              results[factor] = result.payload.data;
            }
            return result;
          })
      );
      
      // Wait for all promises to resolve
      await Promise.all(promises);
      
      return results;
    } catch (error) {
      console.error("Error fetching all sensor data:", error);
      throw error;
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
      // Validate factor to ensure it's one of the allowed values
      if (!["humidity", "temperature", "moisture", "light"].includes(factor)) {
        throw new Error(`Invalid factor: ${factor}`);
      }
      
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
        throw new Error(`Failed to fetch threshold for ${factor}. HTTP status: ${response.status}`);
      }

      const threshold = await response.json();
      return { factor, threshold };
    } catch (error) {
      console.error(`Error fetching ${factor} threshold:`, error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateThreshold = createAsyncThunk(
  "data/updateThreshold",
  async ({ factor, threshold }, { rejectWithValue, dispatch }) => {
    try {
      // Validate factor to ensure it's one of the allowed values
      if (!["humidity", "temperature", "moisture", "light"].includes(factor)) {
        throw new Error(`Invalid factor: ${factor}`);
      }
      
      // Validate that threshold has the expected format
      if (!threshold || typeof threshold.upperbound !== 'number' || typeof threshold.lowerbound !== 'number') {
        throw new Error('Invalid threshold format. Expected: { upperbound: number, lowerbound: number }');
      }
      
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/${factor}/threshold`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(threshold)
      });

      if (!response.ok) {
        throw new Error(`Failed to update threshold for ${factor}. HTTP status: ${response.status}`);
      }

      const updatedThreshold = await response.json();
      
      return { factor, threshold: updatedThreshold };
    } catch (error) {
      console.error(`Error updating ${factor} threshold:`, error);
      return rejectWithValue(error.message);
    }
  }
);

// Fetch thresholds for all factors
export const fetchAllThresholds = createAsyncThunk(
  "data/fetchAllThresholds",
  async (_, { dispatch }) => {
    const factors = ["humidity", "temperature", "moisture", "light"];
    const results = {};
    
    try {
      // Create an array of promises
      const promises = factors.map(factor => 
        dispatch(fetchThreshold(factor))
          .then(result => {
            if (!result.error) {
              results[factor] = result.payload.threshold;
            }
            return result;
          })
      );
      
      // Wait for all promises to resolve
      await Promise.all(promises);
      
      return results;
    } catch (error) {
      console.error("Error fetching all thresholds:", error);
      throw error;
    }
  }
);

// Fetch device modes (on/off status for fan, light, pump)
export const fetchDeviceModes = createAsyncThunk(
  "data/fetchDeviceModes",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/mode`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch device modes. HTTP status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching device modes:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Update device mode (turn on/off)
export const updateDeviceMode = createAsyncThunk(
  "data/updateDeviceMode",
  async ({ device, state }, { rejectWithValue, getState }) => {
    try {
      const token = getAuthToken();
      
      const payload = {
        mode: "Manual",  // Default to Manual mode
        reqdevice: device,
        state: state ? 1 : 0  // Convert boolean to 1/0
      };
            
      // Submit the update
      const response = await fetch(`${BASE_URL}/mode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to update device mode. HTTP status: ${response.status}`);
      }

      // API may return the updated state, but to be safe we'll use our requested state
      // and update the Redux store accordingly
      const currentDevicesState = getState().data.devices;
      
      return {
        ...currentDevicesState,
        [device]: !!state, // Ensure boolean value
        loading: false,
        error: null
      };
    } catch (error) {
      console.error("Error updating device mode:", error);
      return rejectWithValue(error.message);
    }
  }
);

// New function to update system mode (Auto/Manual)
export const updateSystemMode = createAsyncThunk(
  "data/updateSystemMode",
  async (mode, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      
      // Create payload for system mode change
      const payload = {
        mode: mode // "Auto" or "Manual"
      };
      
      const response = await fetch(`${BASE_URL}/mode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to update system mode. HTTP status: ${response.status}`);
      }

      const data = await response.json();
      return { systemMode: mode, data };
    } catch (error) {
      console.error("Error updating system mode:", error);
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
  moisture: {
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
  devices: {
    fan: false,
    fan2: false,
    light: false,
    pump: false,
    loading: false,
    error: null,
  },
  systemMode: "Manual", // Add system mode tracking (Auto/Manual)
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    clearDataErrors: (state) => {
      state.temperature.error = null;
      state.humidity.error = null;
      state.moisture.error = null;
      state.light.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchCurrentData
    builder
      .addCase(fetchCurrentData.pending, (state, action) => {
        const factor = action.meta.arg;
        if (state[factor]) {
          state[factor].loading = true;
        }
      })
      .addCase(fetchCurrentData.fulfilled, (state, action) => {
        const { factor, data } = action.payload;
        if (state[factor]) {
          state[factor].current = data;
          state[factor].loading = false;
          state[factor].error = null;
        }
      })
      .addCase(fetchCurrentData.rejected, (state, action) => {
        const factor = action.meta.arg;
        if (state[factor]) {
          state[factor].loading = false;
          state[factor].error = action.payload || `Failed to fetch current ${factor} data`;
        }
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
        if (state[factor]) {
          state[factor].loading = true;
        }
      })
      .addCase(fetchThreshold.fulfilled, (state, action) => {
        const { factor, threshold } = action.payload;
        if (state[factor]) {
          state[factor].threshold = threshold;
          state[factor].loading = false;
          state[factor].error = null;
        }
      })
      .addCase(fetchThreshold.rejected, (state, action) => {
        const factor = action.meta.arg;
        if (state[factor]) {
          state[factor].loading = false;
          state[factor].error = action.payload || `Failed to fetch ${factor} threshold`;
        }
      });

    // Handle updateThreshold
    builder
      .addCase(updateThreshold.pending, (state, action) => {
        const { factor } = action.meta.arg;
        if (state[factor]) {
          state[factor].loading = true;
        }
      })
      .addCase(updateThreshold.fulfilled, (state, action) => {
        const { factor, threshold } = action.payload;
        if (state[factor]) {
          // Ensure we're updating the threshold with the exact response from the server
          state[factor].threshold = threshold;
          state[factor].loading = false;
          state[factor].error = null;
        }
      })
      .addCase(updateThreshold.rejected, (state, action) => {
        const { factor } = action.meta.arg;
        if (state[factor]) {
          state[factor].loading = false;
          state[factor].error = action.payload || `Failed to update ${factor} threshold`;
        }
      });

    // Handle fetchDeviceModes
    builder
      .addCase(fetchDeviceModes.pending, (state) => {
        state.devices.loading = true;
      })
      .addCase(fetchDeviceModes.fulfilled, (state, action) => {
        state.devices.loading = false;
        state.devices = {
          ...state.devices,
          ...action.payload,
          error: null
        };
      })
      .addCase(fetchDeviceModes.rejected, (state, action) => {
        state.devices.loading = false;
        state.devices.error = action.payload || 'Failed to fetch device modes';
      });

    // Handle updateDeviceMode
    builder
      .addCase(updateDeviceMode.pending, (state) => {
        state.devices.loading = true;
      })
      .addCase(updateDeviceMode.fulfilled, (state, action) => {
        state.devices.loading = false;
        state.devices = {
          ...state.devices,
          ...action.payload,
          error: null
        };
      })
      .addCase(updateDeviceMode.rejected, (state, action) => {
        state.devices.loading = false;
        state.devices.error = action.payload || 'Failed to update device mode';
      });

    // Handle updateSystemMode
    builder
      .addCase(updateSystemMode.pending, (state) => {
        state.devices.loading = true;
      })
      .addCase(updateSystemMode.fulfilled, (state, action) => {
        state.devices.loading = false;
        state.systemMode = action.payload.systemMode;
      })
      .addCase(updateSystemMode.rejected, (state, action) => {
        state.devices.loading = false;
        state.devices.error = action.payload || 'Failed to update system mode';
      });
  },
});

export const { clearDataErrors } = dataSlice.actions;
export default dataSlice.reducer;
