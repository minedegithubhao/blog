import { Layout, Menu } from "antd";
import React from "react";
import useMenu from "@/hooks/useMenu";
import useStore from "@/stores";

const { Sider } = Layout;

const MainAside: React.FC = () => {
  const { menuList, menuClick, openKeys, onOpenChange, currentRouter } = useMenu();
  const { isCollapse } = useStore();

  return (
    <Sider
      collapsed={isCollapse}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "sticky",
        insetInlineStart: 0,
        top: 0,
        bottom: 0,
        scrollbarWidth: "thin",
        scrollbarGutter: "stable",
      }}
    >
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
