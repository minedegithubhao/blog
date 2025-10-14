import React, { useState } from "react";
import {useParams} from "react-router-dom";

export default function List() {
  const {categoryId} = useParams();
  const [articles] = useState([
    {
      id: 1,
      title: "资本抢滩区块链：泡沫还是技术？",
      time: "2024-09-02",
      cat: "营销推广",
      img: "/images/1-210Z215032Nb.jpg",
      url: "detail.html",
      content:
        "随着越来越多的上市公司将区块链作为转型的方向，具有区块链概念的上市公司持续增加。根据同花顺(42.920,-0.95,-0.95)",
      fire: 0,
      comment: 0,
    },
    {
      id: 2,
      title: "欧莱雅中国CEO：美妆业未来两年变化要大于过去",
      time: "2020-12-10",
      cat: "营销推广",
      img: "/uploads/allimg/c191121/15J302a392W0-X030.jpg",
      url: "detail.html",
      content:
        "时间倒回2015年，整个房产行业沉浸在转型困惑与对互联网+的憧憬之中，无论是地产大佬还是普通的经纪人，他们为... ",
      fire: 0,
      comment: 0,
    },
    {
      id: 3,
      title: "房产中介电商平台“小败局”",
      time: "2024-09-02",
      cat: "营销推广",
      img: "/images/1-210Z2150243208.jpg",
      url: "detail.html",
      content:
        "时间倒回2015年，整个房产行业沉浸在转型困惑与对互联网+的憧憬之中，无论是地产大佬还是普通的经纪人，他们为... ",
      fire: 0,
      comment: 0,
    },
    {
      id: 4,
      title: "苹果印度重走高端路线：砍掉最便宜iPhone 不再考",
      time: "2024-09-02",
      cat: "营销推广",
      img: "/images/1-210Z2150243208.jpg",
      url: "detail.html",
      content:
        "时间倒回2015年，整个房产行业沉浸在转型困惑与对互联网+的憧憬之中，无论是地产大佬还是普通的经纪人，他们为... ",
      fire: 0,
      comment: 0,
    },
    {
      id: 5,
      title: "中国“小马”：如何从“小马”升级为“大马”？",
      time: "2024-09-02",
      cat: "营销推广",
      img: "/images/1-210Z2150243208.jpg",
      url: "detail.html",
      content:
        "时间倒回2015年，整个房产行业沉浸在转型困惑与对互联网+的憧憬之中，无论是地产大佬还是普通的经纪人，他们为... ",
      fire: 0,
      comment: 0,
    },
    {
      id: 6,
      title: "中国“小马”：如何从“小马”升级为“大马”？",
      time: "2024-09-02",
      cat: "营销推广",
      img: "/images/1-210Z2150243208.jpg",
      url: "detail.html",
      content:
        "时间倒回2015年，整个房产行业沉浸在转型困惑与对互联网+的憧憬之中，无论是地产大佬还是普通的经纪人，他们为... ",
      fire: 0,
      comment: 0,
    },
    {
      id: 7,
      title: "中国“小马”：如何从“小马”升级为“大马”？",
      time: "2024-09-02",
      cat: "营销推广",
      img: "/images/1-210Z2150243208.jpg",
      url: "detail.html",
      content:
        "时间倒回2015年，整个房产行业沉浸在转型困惑与对互联网+的憧憬之中，无论是地产大佬还是普通的经纪人，他们为... ",
      fire: 0,
      comment: 0,
    },
    {
      id: 8,
      title: "中国“小马”：如何从“小马”升级为“大马”？",
      time: "2024-09-02",
      cat: "营销推广",
      img: "/images/1-210Z2150243208.jpg",
      url: "detail.html",
      content:
        "时间倒回2015年，整个房产行业沉浸在转型困惑与对互联网+的憧憬之中，无论是地产大佬还是普通的经纪人，他们为... ",
      fire: 0,
      comment: 0,
    },
    {
      id: 9,
      title: "中国“小马”：如何从“小马”升级为“大马”？",
      time: "2024-09-02",
      cat: "营销推广",
      img: "/images/1-210Z2150243208.jpg",
      url: "detail.html",
      content:
        "时间倒回2015年，整个房产行业沉浸在转型困惑与对互联网+的憧憬之中，无论是地产大佬还是普通的经纪人，他们为... ",
      fire: 0,
      comment: 0,
    },
  ]);
  return (
    <main className="main">
      {articles.map((item) => (
        <article className="newsitem">
          <figure className="thumbnail">
            {" "}
            <a href={item.url} title={item.title}>
              {" "}
              <img src={item.img} alt={item.title} />{" "}
            </a>{" "}
          </figure>
          <div className="info">
            <h2>
              <a href={item.url} title={item.title}>
                {item.title}
              </a>
            </h2>
            <div className="meta">
              <span>
                <time datetime={item.time}>
                  <i className="far fa-calendar-alt"></i> {item.time}
                </time>
              </span>{" "}
              <span className="cat">
                <i className="fas fa-columns"></i>{" "}
                <a
                  href={`list.html?cat=${item.cat}`}
                  title={item.cat}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.cat}
                </a>
              </span>{" "}
              <span>
                <i className="fas fa-fire"></i> {item.fire}℃
              </span>{" "}
              <span>
                <i className="fas fa-comments"></i> {item.comment}
              </span>
            </div>
            <p>{item.content}</p>
          </div>
        </article>
      ))}

      <div className="pagenavi">
        <span className="now-page">首页</span>
        <span className="now-page">1</span>
        <a className="sb br page-numbers" href="detail.html">
          2
        </a>
        <a className="sb br page-numbers" href="detail.html">
          3
        </a>
        <a className="sb br page-numbers" href="detail.html">
          下一页
        </a>
        <a className="sb br page-numbers" href="detail.html">
          末页
        </a>
      </div>
    </main>
  );
}
