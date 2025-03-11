import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./taskSlice"; // ✅ Corrected path
import authReducer from "./authSlice"; // ✅ Corrected path

const store = configureStore({
  reducer: {
    tasks: taskReducer,
    auth: authReducer,
  },
});

export default store;
