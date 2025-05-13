import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";
import userReducer from "./UserSlice";
import systemReducer from "./SystemSlice";
import dataReducer from "./DataSlice";
import logReducer from "./LogSlice";

// Configure the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    system: systemReducer,
    data: dataReducer,
    log: logReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
