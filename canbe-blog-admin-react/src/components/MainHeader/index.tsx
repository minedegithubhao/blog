import React from "react";
import { Layout, theme, Avatar, Button, Dropdown, message } from "antd";
import type { MenuProps } from "antd";
import logoImage from "@/assets/images/image.png";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { changeCollapse } from "@/stores/reducers/tab";
import { useNavigate } from "react-router-dom";
import { removeToken } from "@/stores/reducers/token";

const { Header } = Layout;

interface MainHeaderProps {
  isCollapse: boolean;
}

const MainHeader: React.FC<MainHeaderProps> = ({ isCollapse }) => {
  //这是Ant Design的自定义主题功能，从中提取出colorBgContainer（容器背景色）这个具体的样式变量
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a target="_blank" rel="noopener noreferrer">
          个人中心
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a target="_blank" rel="noopener noreferrer">
          退出
        </a>
      ),
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    // 退出登录
    if (e.key === "2") {
      navigate("/login");
      dispatch(removeToken());
      message.success("退出成功");
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  

  return (
    <Header
      style={{
        background: colorBgContainer,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 16px",
      }}
    >
      <Button
        type="text"
        icon={isCollapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => dispatch(changeCollapse())}
        style={{
          fontSize: "24px",
          width: 64,
          height: 64,
        }}
      />
      <Dropdown menu={menuProps} placement="bottomRight">
        <Avatar size="large" src={<img src={logoImage} alt="logo" />} />
      </Dropdown>
    </Header>
  );
};

export default MainHeader;
