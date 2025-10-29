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
import { Navigate } from "react-router-dom";
import NotFoundPage from "@/views/404";
import Login from "@/views/Login";

import BlogWeb from "@/views/BlogWeb";
import BlogWebList from "@/views/BlogWeb/BlogWebList";
import BlogWebDetail from "@/views/BlogWeb/BlogWebDetail";

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
        path: "/web",
        element: <Navigate to="/web/category" />,
      },
      {
        path: "/web/category",
        element: <BlogWebList />,
      },
      {
        path: "/web/detail",
        element: <BlogWebDetail />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export default routes;
