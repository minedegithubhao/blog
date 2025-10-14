import React, { Component } from "react";

export default class Category extends Component {
  state = {
    category: [
      {
        id: 1,
        name: "网站首页",
        url: "home",
      },
      {
        id: 2,
        name: "运营推广",
        url: "list",
      },
      {
        id: 3,
        name: "热点洞察",
        url: "list",
      },
      {
        id: 4,
        name: "广告运营",
        url: "list",
      },
      {
        id: 5,
        name: "营销推广",
        url: "list",
      },
      {
        id: 6,
        name: "电商运营",
        url: "list",
      },
      {
        id: 7,
        name: "创业指南",
        url: "list",
      },
      {
        id: 8,
        name: "在线留言",
        url: "list",
      },
    ],
  };
  render() {
    return (
      <div>
        <nav className="nav">
          <div className="inner">
            <ul>
              {this.state.category.map((item) => (
                <li className="navbar-item" key={item.id}>
                  <a href={item.url} title={item.name}>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}
