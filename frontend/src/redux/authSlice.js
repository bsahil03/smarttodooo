import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  email: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.isAuthenticated = true;
    },
    logoutUser: (state) => {
      state.userId = null;
      state.email = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
