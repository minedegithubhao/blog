import { getMenuTreeService } from "@/api/menu";
import * as Icon from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const iconToComponent = (iconName: string) => {
  return React.createElement(Icon[iconName]);
};
export default function useMenu() {
  useEffect(() => {
    getMenuList();
  }, []);

  const [menuList, setMenuList] = useState<MenuItem[]>([]);

  const getMenuList = async () => {
    const result = await getMenuTreeService();
    // 对 result.data 明确类型断言
    const data = result.data as MenuItem[];
    const menu = data.map((item) => {
      return {
        ...item,
        ...(item.icon && { icon: iconToComponent(item.icon) }), // 只有存在 icon 时才添加此属性
        children: item.children
          ? Array.isArray(item.children)
            ? item.children.map((child) => {
                return {
                  ...child,
                  ...(child.icon && { icon: iconToComponent(child.icon) }),
                };
              })
            : []
          : undefined,
      };
    });

    setMenuList(menu);
  };

  const currentRouter = useLocation();

  // 菜单点击事件
  const navigate = useNavigate();
  const menuClick = (e: { key: string }) => {
    // 点击跳转路由，编程式导航
    navigate(e.key);
  };

  // 刷新后将菜单展开项设置为当前路由的父级菜单的key值，这里使用截取获取父级菜单的key值
  const path = "/" + currentRouter.pathname.split("/")[1];
  const [openKeys, setOpenKeys] = useState<string[]>([path]);
  const onOpenChange = (openKeys: string[]) => {
    setOpenKeys(openKeys.slice(-1));
  };

  return {
    menuList,
    menuClick,
    openKeys,
    onOpenChange,
    currentRouter,
  };
}
