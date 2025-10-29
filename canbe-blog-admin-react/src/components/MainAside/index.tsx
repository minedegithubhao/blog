import { Layout, Menu } from "antd";
import React from "react";
import useMenu from "@/hooks/menu";

const { Sider } = Layout;

interface MainAsideProps {
  isCollapse: boolean;
}

const MainAside: React.FC<MainAsideProps> = ({ isCollapse }) => {

  const { menuList, menuClick, openKeys, onOpenChange, currentRouter } = useMenu();
  
  return (
    <Sider collapsed={isCollapse}>
      <h3
        style={{
          color: "white",
          textAlign: "center",
          fontSize: "20px",
          lineHeight: "64px",
        }}
      >
        {isCollapse ? "BMS" : "后台管理系统"}
      </h3>
      <Menu
        theme="dark"
        defaultSelectedKeys={[currentRouter.pathname]}
        mode="inline"
        items={menuList}
        onClick={menuClick}
        onOpenChange={onOpenChange}
        openKeys={openKeys}
      />
    </Sider>
  );
};
export default MainAside;
