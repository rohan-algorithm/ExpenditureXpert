// globalSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  userId: "",
  isLoggedIn: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    login: (state, action) => {
      state.userId = action.payload.userId;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.userId = "";
      state.isLoggedIn = false;
    },
  },
});

export const { setMode, login, logout } = globalSlice.actions;

export default globalSlice.reducer;
