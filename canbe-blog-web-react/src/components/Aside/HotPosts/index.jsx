import React, { Component } from "react";

export default class HotPosts extends Component {
  state = {
    hotPosts: [
      {
        id: 1,
        name: "雷军：天使投资人经历让我学会找风口 小米未来",
        url: "detail.html",
        img: "/uploads/allimg/c191121/15J2bC93K30-KN6.jpg",
      },
      {
        id: 2,
        name: "中文互联网文化，从追逐流量到寻求质量的路还",
        url: "detail.html",
        img: "/uploads/allimg/c191121/15J2bA34S10-535B.jpg",
      },
      {
        id: 3,
        name: "共享单车发展受阻 共享电动滑板车能有机会吗",
        url: "detail.html",
        img: "/uploads/allimg/c191121/15J302341W950-4KH.jpg",
      },
      {
        id: 4,
        name: "区块链未死！2019区块链+农业或将浴火重生",
        url: "detail.html",
        img: "/uploads/allimg/c191121/15J2bC551W0-154J.jpg",
      },
      {
        id: 5,
        name: "寓见事件，正在成为银行和助贷机构合作的分水",
        url: "detail.html",
        img: "/uploads/allimg/c191121/15J2c4GMJ0-53444.jpg",
      },
      {
        id: 6,
        name: "五星级酒店又曝卫生乱象：喜来登、华尔道夫",
        url: "detail.html",
        img: "/uploads/allimg/c191121/15J2b631U050-Q953.jpg",
      },
    ],
  };
  render() {
    return (
      <div>
        <section className="widget hotpost">
          <h3>热门文章</h3>
          <ul>
            {this.state.hotPosts.map((item) => (
              <li className="pic" key={item.id}>
                <figure className="thumbnail">
                  <a href={item.url} title={item.name}>
                    <img src={item.img} alt={item.name} />
                  </a>
                </figure>
                <p>
                  <a href={item.url} title={item.name}>
                    {item.name}
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }
}
