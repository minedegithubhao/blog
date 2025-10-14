import React, { Component } from "react";

export default class TopPost extends Component {
  state = {
    topPosts: [
      {
        id: 1,
        name: "资本抢滩区块链：泡沫还是技术？",
        url: "detail.html",
        img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
      },
      {
        id: 2,
        name: "房产中介电商平台“小败局”",
        url: "detail.html",
        img: "uploads/allimg/c191121/15J30142310N0-3c96.jpg",
      },
      {
        id: 3,
        name: "苹果印度重走高端路线：砍掉最便宜iPhone 不再考",
        url: "detail.html",
        img: "uploads/allimg/c191121/15J2c4954L60-J404.jpg",
      },
      {
        id: 4,
        name: "澳大利亚政府承诺向区块链开发投入10万美元，确",
        url: "detail.html",
        img: "uploads/allimg/c191121/15J2c493D460-5M02.jpg",
      },
    ],
  };
  render() {
    return (
      <div>
        <section className="istop">
          <ul>
            {this.state.topPosts.map((item) => (
              <li key={item.id}>
                <figure className="thumbnail">
                  {" "}
                  <a
                    href={item.url}
                    target="_blank"
                    title={item.name}
                    rel="noreferrer"
                  >
                    <img src={item.img} alt={item.name} />
                  </a>
                </figure>
                <h3>
                  <a
                    href={item.url}
                    target="_blank"
                    title={item.name}
                    rel="noreferrer"
                  >
                    {item.name}
                  </a>
                </h3>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }
}
