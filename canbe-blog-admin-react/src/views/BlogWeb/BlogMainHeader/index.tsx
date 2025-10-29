import { Layout, Menu } from "antd";
import React from "react";
import type { MenuProps } from "antd";
type MenuItem = Required<MenuProps>["items"][number];
const { Header } = Layout;

interface MainHeaderProps {
  items: MenuItem[];
  selectedKey: string;
  setSelectedKey: (key: string) => void;
}

// 修复函数组件参数定义
const MainHeader: React.FC<MainHeaderProps> = ({
  items,
  selectedKey,
  setSelectedKey,
}) => {

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="demo-logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[selectedKey]}
        onClick={(e) => setSelectedKey(e.key)}
        items={items}
        style={{ flex: 1, minWidth: 0, margin: "0 300px" }}
      />
    </Header>
  );
};
export default MainHeader;
