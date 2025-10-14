import React, { Component } from "react";
import { Link, NavLink, Route, Routes, Navigate } from "react-router-dom";
import Home from "./views/Home";
import Header from "./components/Header";
import Category from "./components/Category";
import Footer from "./components/Footer";
import Aside from "./components/Aside";
import List from "./views/List";
import Detail from "./views/Detail";
import "./App.css";

export default class App extends Component {
  state = {
    category: [
      {
        id: 1,
        name: "网站首页",
        url: "/home",
      },
      {
        id: 2,
        name: "运营推广",
        url: "/list",
      },
      {
        id: 3,
        name: "热点洞察",
        url: "/list",
      },
      {
        id: 4,
        name: "广告运营",
        url: "/list",
      },
      {
        id: 5,
        name: "营销推广",
        url: "/list",
      },
      {
        id: 6,
        name: "电商运营",
        url: "/list",
      },
      {
        id: 7,
        name: "创业指南",
        url: "/list",
      },
      {
        id: 8,
        name: "在线留言",
        url: "/list",
      },
    ],
  };
  render() {
    return (
      <div className="App">
        <Header />
        <nav className="nav">
          <div className="inner">
            <ul>
              {this.state.category.map((item) => (
                <li className="navbar-item" key={item.id}>
                  {/* 1.使用路由器BrowserRouter，在App组件中包裹路由组件
                      2.路由链接，能引起路径变化 */}
                  {/* NavLink的activeClassName为选中的路由添加一个样式，默认样式名称为active */}
                  <NavLink activeClassName="active" to={item.url + "/" + item.name} title={item.name}>
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        <div style={{ marginTop: 25 }}></div>
        <div className="wrapper">
          <div className="inner">
            {/* 2.注册路由，根据路径匹配组件 */}
            <Routes>
              <Route path="/list/:categoryId" element={<List />} />
              <Route path="/detail/:id" element={<Detail />} />
              <Route path="/home" element={<Home />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
            <Aside />
            <div className="clear"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
