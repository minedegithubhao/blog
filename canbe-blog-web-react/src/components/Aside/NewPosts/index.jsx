import React, { Component } from "react";

export default class NewPosts extends Component {
  state = {
    newPosts: [
      {
        id: 1,
        name: "资本抢滩区块链：泡沫还是技术？",
        url: "detail.html",
        time: "2024-09-02",
      },
      {
        id: 2,
        name: "房产中介电商平台“小败局”",
        url: "detail.html",
        time: "2024-09-02",
      },
      {
        id: 3,
        name: "区块链未死！2019区块链+农业或将浴火重生",
        url: "detail.html",
        time: "2024-09-02",
      },
      {
        id: 4,
        name: "雷军：天使投资人经历让我学会找风口 小米未来",
        url: "detail.html",
        time: "2024-09-02",
      },
      {
        id: 5,
        name: "iPhone6于5月停产，iPhone8将下放到4千元市场",
        url: "detail.html",
        time: "2024-09-02",
      },
      {
        id: 6,
        name: "苹果印度重走高端路线：砍掉最便宜iPhone 不再考",
        url: "detail.html",
        time: "2024-09-02",
      },
    ],
  };
  render() {
    return (
      <div>
        <section className="widget newpost">
          <h3>最新文章</h3>
          <ul>
            {this.state.newPosts.map((item) => (
              <li className="text" key={item.id}>
                <a href={item.url} title={item.name}>
                  {item.name}
                </a>
                <time dateTime={item.time}>
                  <i className="far fa-calendar-alt"></i> {item.time}
                </time>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }
}
