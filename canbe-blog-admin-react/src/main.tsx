import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
/*  1、安装初始化样式：npm install reset-css。
    2、使用初始化样式。import 'reset-css'
    3、初始化样式一般放在最前面，确保其他UI框架样式、自定义样式能够正常覆盖。 
*/
// 样式初始化
import "reset-css";
import App from "./App.tsx";
// UI框架样式

// 全局样式
import "@/assets/styles/global.scss";

import { Provider } from "react-redux";
import store from "@/stores/index.ts";

// 路由
import { BrowserRouter } from "react-router-dom";

// 添加 antd 分页组件汉化配置
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";

// mock数据：2.在main.tsx中引入mock文件
// import '@/api/mock.ts'

createRoot(document.getElementById("root")!).render(
  // 使用toolkit 3.使用Provider包裹App组件
  <Provider store={store}>
    <StrictMode>
      <ConfigProvider locale={zhCN}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </StrictMode>
  </Provider>
);
