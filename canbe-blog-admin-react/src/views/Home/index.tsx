import React from "react";
import { Layout } from "antd";
// 导入路由
import MainAside from "@/components/MainAside";
import MainHeader from "@/components/MainHeader";
import MainContent from "@/components/MainContent";
import MainFooter from "@/components/MainFooter";
import { useSelector } from "react-redux";


const Home: React.FC = () => {
  // 使用toolkit 4.获取store中的数据
  const isCollapse = useSelector((state: RootStore) => state.tab.isCollapse);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <MainAside isCollapse={isCollapse} />
      <Layout>
        <MainHeader isCollapse={isCollapse} />
        <MainContent />
        <MainFooter />
      </Layout>
    </Layout>
  );
};

export default Home;
