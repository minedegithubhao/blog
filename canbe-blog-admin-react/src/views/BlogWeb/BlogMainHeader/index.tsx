import { webCategoryListService } from "@/api/web/webCategory";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const { Header } = Layout;

// 修复函数组件参数定义
const MainHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // 分类列表
  const [categoryList, setCategoryList] = React.useState<SysCategory[]>([]);
  // 选中项
  const [selectedKey, setSelectedKey] = React.useState<string>("");

  // 获取分类列表
  const list = async () => {
    const result = await webCategoryListService();
    setCategoryList(result.data);

    // 获取url参数
    const urlCategoryId = new URLSearchParams(location.search).get("categoryId") || "";
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
  const items = categoryList.map((item) => ({
    key: item.id.toString(),
    label: item.name,
  }));

  // 菜单点击
  const onClick: MenuProps["onClick"] = (e) => {
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
        onClick={onClick}
        items={items}
        style={{ flex: 1, minWidth: 0, margin: "0 300px" }}
      />
    </Header>
  );
};
export default MainHeader;
