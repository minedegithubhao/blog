import React, { Component } from "react";

export default class Tags extends Component {
  state = {
    tags: [
      {
        id: 1,
        name: "区块链",
        href: "list.html",
        count: 2,
      },
      {
        id: 2,
        name: "农业",
        href: "list.html",
        count: 1,
      },
      {
        id: 3,
        name: "小米",
        href: "list.html",
        count: 3,
      },
      {
        id: 4,
        name: "iphone",
        href: "list.html",
        count: 2,
      },
      {
        id: 5,
        name: "苹果",
        href: "list.html",
        count: 3,
      },
      {
        id: 6,
        name: "华为",
        href: "list.html",
        count: 1,
      },
      {
        id: 7,
        name: "顺丰",
        href: "list.html",
        count: 1,
      },
      {
        id: 8,
        name: "直播",
        href: "list.html",
        count: 1,
      },
      {
        id: 9,
        name: "欧莱雅",
        href: "list.html",
        count: 1,
      },
      {
        id: 10,
        name: "ceo",
        href: "list.html",
        count: 1,
      },
      {
        id: 11,
        name: "智能柜",
        href: "list.html",
        count: 1,
      },
      {
        id: 12,
        name: "联想",
        href: "list.html",
        count: 1,
      },
      {
        id: 13,
        name: "比特币",
        href: "list.html",
        count: 1,
      },
      {
        id: 14,
        name: "网红",
        href: "list.html",
        count: 1,
      },
      {
        id: 15,
        name: "短视频",
        href: "list.html",
        count: 1,
      },
      {
        id: 16,
        name: "斗鱼",
        href: "list.html",
        count: 1,
      },
    ],
  };
  render() {
    return (
      <div>
        <section className="widget divTags">
          <h3>标签列表</h3>
          <ul>
            {this.state.tags.map((item) => (
              <li key={item.id}>
                <a href={item.href}>
                  {item.name}
                  <span className="tag-count"> ({item.count})</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }
}
