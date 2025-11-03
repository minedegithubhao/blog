import { createSlice } from "@reduxjs/toolkit";

// 从localStorage获取初始token值
const getInitialToken = () => {
  try {
    return localStorage.getItem("token") || "";
  } catch {
    return "";
  }
};

export const tokenSlice = createSlice({
  name: "token",
  initialState: {
    token: getInitialToken(),
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      // 同时保存到localStorage
      try {
        localStorage.setItem("token", action.payload);
      } catch (e) {
        console.error("Failed to save token to localStorage:", e);
      }
    },
    removeToken: (state) => {
      state.token = "";
      // 同时从localStorage中移除
      try {
        localStorage.removeItem("token");
      } catch (e) {
        console.error("Failed to remove token from localStorage:", e);
      }
    },
  },
});
export const { setToken, removeToken } = tokenSlice.actions;
export default tokenSlice.reducer;
