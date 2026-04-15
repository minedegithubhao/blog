import Home from "@/views/Home";
import Index from "@/views/Home/Index/index";
import User from "@/views/System/User";
import Role from "@/views/System/Role";
import Menu from "@/views/System/Menu";
import Dict from "@/views/System/Dict";
import Param from "@/views/System/Param";
import File from "@/views/System/File";
import Article from "@/views/Blog/Article";
import Tag from "@/views/Blog/Tag";
import Category from "@/views/Blog/Category";
import About from "@/views/About";
import type { FC } from "react";
import { Navigate, useLocation } from "react-router-dom";
import NotFoundPage from "@/views/404";
import Login from "@/views/Login";

import BlogWeb from "@/views/BlogWeb";
import AIHome from "@/views/BlogWeb/AIHome";
import BlogSection from "@/views/BlogWeb/BlogSection";
import BlogList from "@/views/BlogWeb/BlogSection/BlogList";
import BlogDetail from "@/views/BlogWeb/BlogSection/BlogDetail";

const LegacyWebRedirect: FC<{ to: string }> = ({ to }) => {
  const location = useLocation();

  return <Navigate to={{ pathname: to, search: location.search }} replace />;
};

const routes = [
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/",
        element: <Navigate to="/home" />,
      },
      {
        path: "/home",
        element: <Index />,
      },
      {
        path: "/system/user",
        element: <User />,
      },
      {
        path: "/system/role",
        element: <Role />,
      },
      {
        path: "/system/menu",
        element: <Menu />,
      },
      {
        path: "/system/dict",
        element: <Dict />,
      },
      {
        path: "/system/param",
        element: <Param />,
      },
      {
        path: "/system/file",
        element: <File />,
      },
      {
        path: "/blog/article",
        element: <Article />,
      },
      {
        path: "/blog",
        element: <Navigate to="/blog/article" />,
      },
      {
        path: "/blog/tag",
        element: <Tag />,
      },
      {
        path: "/blog/category",
        element: <Category />,
      },
      {
        path: "/about",
        element: <About />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/web",
    element: <BlogWeb />,
    children: [
      {
        index: true,
        element: <Navigate to="/web/ai" />,
      },
      {
        path: "ai",
        element: <AIHome />,
      },
      {
        path: "blog",
        element: <BlogSection />,
        children: [
          {
            index: true,
            element: <BlogList />,
          },
          {
            path: "detail",
            element: <BlogDetail />,
          },
        ],
      },
      {
        path: "category",
        element: <LegacyWebRedirect to="/web/blog" />,
      },
      {
        path: "detail",
        element: <LegacyWebRedirect to="/web/blog/detail" />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export default routes;
