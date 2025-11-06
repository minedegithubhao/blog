import { Layout, theme } from "antd";
import React from "react";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const MainContent: React.FC = () => {

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Content style={{ margin: "0 16px" }}>
          {/* <Breadcrumb
            style={{ margin: "16px 0" }}
            items={[{ title: "User" }, { title: "Bill" }]}
          /> */}
          <div style={{ margin: "16px 0",height:'22px' }}></div>
          <div
            style={{
              padding: 24,
              minHeight: "100%",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {/* 内容将在路由切换时自动显示在这里 */}
            <Outlet />
          </div>
        </Content>
  )
}

export default MainContent;
