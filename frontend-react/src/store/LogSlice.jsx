import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = `${import.meta.env.VITE_REACT_APP_BE_API_URL || "http://localhost:8085"}/api/log`;

// Function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token') || '';
};

// Async thunks for logs
export const fetchLogs = createAsyncThunk(
  "log/fetchLogs",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/log`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch logs. HTTP status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchNotifications = createAsyncThunk(
  "log/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/notification`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch notifications. HTTP status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  logs: [],
  notifications: [],
  loading: false,
  error: null,
};

const logSlice = createSlice({
  name: "log",
  initialState,
  reducers: {
    clearLogErrors: (state) => {
      state.error = null;
    },
    addLocalLog: (state, action) => {
      state.logs.unshift(action.payload);
    },
    addLocalNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    // Handle fetchLogs
    builder
      .addCase(fetchLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
        state.error = null;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch logs';
      });

    // Handle fetchNotifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.error = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch notifications';
      });
  },
});

export const { clearLogErrors, addLocalLog, addLocalNotification, clearNotifications } = logSlice.actions;
export default logSlice.reducer;
