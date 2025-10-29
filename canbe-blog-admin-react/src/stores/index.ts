// import { legacy_createStore } from "redux";
// import reducer from "./reducer";

// 使用toolkit 2.创建Store
import { configureStore } from '@reduxjs/toolkit'
import tabSlice from "./reducers/tab";
import tokenSlice from "./reducers/token";
export default configureStore({
  reducer: {
    tab: tabSlice,
    tokenStore: tokenSlice
  }
})

// 创建数据仓库
// export const store = legacy_createStore(reducer);
