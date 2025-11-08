import { webCategoryListService } from "@/api/web/webCategory";
import MainFooter from "@/views/Home/MainFooter";
import type { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const { Header, Content } = Layout;
const space = 20;

const headerStyle: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 1,
  width: "100%",
  alignItems: "center",
};

const BlogWeb: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();
  const navigate = useNavigate();
  // 分类列表
  const [categoryList, setCategoryList] = useState<SysTag[]>([]);
  // 选中项
  const [selectedKey, setSelectedKey] = useState<string>("");

  // 获取分类列表
  const list = async () => {
    const result = await webCategoryListService();
    setCategoryList(result.data);

    // 获取url参数
    const urlCategoryId =
      new URLSearchParams(location.search).get("categoryId") || "";
    const defaultCategoryId = result.data[0].id.toString();
    if (urlCategoryId) {
      setSelectedKey(urlCategoryId);
    } else {
      setSelectedKey(defaultCategoryId);
      // 只有在当前路径是/web或/web/category时才更新URL参数
      // 使用navigate而不是replaceState确保React Router感知到变化
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("categoryId", defaultCategoryId);
      navigate(`/web/category?${searchParams.toString()}`, {
        replace: true,
      });
    }
  };

  // 组装列表项
  const items = [
    ...categoryList.map((item) => ({
      key: item.id.toString(),
      label: item.name,
    })),
    // 添加后台管理
    {
      key: 'admin',
      label: '后台管理',
    }
  ];

  // 菜单点击
  const onClick: MenuProps["onClick"] = (e) => {
    // 跳转到后台管理
    if (e.key === 'admin') {
      navigate('/home');
      return;
    }
    
    setSelectedKey(e.key);
    // 更新URL参数
    const searchParams = new URLSearchParams();
    searchParams.set("categoryId", e.key);
    navigate(`/web/category?${searchParams.toString()}`, {
      replace: true,
    });
  };

  useEffect(() => {
    list();
  }, [location]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header /* style={headerStyle} */>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          onClick={onClick}
          items={items}
          style={{ margin: "0 300px" }}
        />
      </Header>
      <Content
        style={{
          padding: "0 350px",
          marginTop: space,
        }}
      >
        <div
          style={{
            minHeight: "100%",
            background: colorBgContainer,
            backgroundColor: "rgb(245 245 245)",
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
          <MainFooter />
        </div>
      </Content>
    </Layout>
  );
};

export default BlogWeb;
