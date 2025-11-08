import React from "react";
import { Layout } from "antd";
// 导入路由
import MainAside from "@/views/Home/MainAside";
import MainHeader from "@/views/Home/MainHeader";
import MainContent from "@/views/Home/MainContent";
import MainFooter from "@/views/Home/MainFooter";

const Home: React.FC = () => {
  // 使用toolkit 4.获取store中的数据

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <MainAside/>
      <Layout>
        <MainHeader/>
        <MainContent />
        <MainFooter />
      </Layout>
    </Layout>
  );
};

export default Home;
