import { createSlice } from "@reduxjs/toolkit";

// 使用toolkit 1.创建Slice
const tabSlice = createSlice({
  name: "tab",
  initialState: {
    isCollapse: false,
  },
  reducers: {
    changeCollapse: (state) => {
      state.isCollapse = !state.isCollapse;
    },
    
  },
});

export const { changeCollapse } = tabSlice.actions;
export default tabSlice.reducer;
