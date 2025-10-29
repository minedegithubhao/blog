import MainFooter from "@/components/MainFooter";
import useBlogMainHeader from "@/hooks/useBlogMainHeader";
import { Layout, theme } from "antd";
import React from "react";
import { Outlet } from "react-router-dom";
import MainHeader from "./BlogMainHeader";
import { BlogWebProvider } from "@/context/BlogWebContext";

const { Content } = Layout;
const space = 20;

const BlogWeb: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { selectedKey, setSelectedKey, items } = useBlogMainHeader();

  return (
    <BlogWebProvider selectedKey={selectedKey} setSelectedKey={setSelectedKey}>
      <Layout>
        <MainHeader
          items={items}
          selectedKey={selectedKey}
          setSelectedKey={setSelectedKey}
        />
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
    </BlogWebProvider>
  );
};

export default BlogWeb;