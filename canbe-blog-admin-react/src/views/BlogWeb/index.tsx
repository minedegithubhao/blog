import MainFooter from "@/components/MainFooter";
import { Layout, theme } from "antd";
import React from "react";
import { Outlet } from "react-router-dom";
import MainHeader from "./BlogMainHeader";

const { Content } = Layout;
const space = 20;

const BlogWeb: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <MainHeader/>
      <Content style={{ padding: "0 350px", marginTop: space }}>
        <div
          style={{
            minHeight: "80vh",
            background: colorBgContainer,
            backgroundColor: "rgb(245 245 245)",
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </div>
      </Content>
      <MainFooter />
    </Layout>
  );
};

export default BlogWeb;
