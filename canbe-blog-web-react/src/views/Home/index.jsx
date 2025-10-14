import { useState } from "react";
import Slides from "../../components/Slides";
import TopPosts from "../../components/TopPosts";
import { Link } from "react-router-dom";

export default function Home() {
  const [categories, setCategories] = useState([
    {
      category: "运营推广",
      posts: [
        {
          id: 1,
          name: "澳大利亚政府承诺向区块链开发投入10万美元，确",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J30142310N0-3c96.jpg",
          content:
            "澳大利亚工业、科学和技术部的卡伦安德鲁斯承诺为促进区块链开发投入10万美元。安德鲁斯在一份新闻稿表示：这是一个重要的步骤，将帮助推动区块链技术的发展。",
        },
        {
          id: 2,
          name: "区块链未死！2019区块链+农业或将浴火重生",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content:
            "2019年，区块链+农业将成为一个热门话题。根据《中国农业大学》发布的报告，2019年，区块链+农业将成为一个热门话题。根据《中国农业大学》发布的报告，2019年，区块链+农业将成为一个热门话题。",
        },
        {
          id: 3,
          name: "雷军：天使投资人经历让我学会找风口 小米未来",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content:
            "2019年，小米公司announced，将在2020年1月1日正式上市。根据《中国农业大学》发布的报告，2019年，区块链+农业将成为一个热门话题。根据《中国农业大学》发布的报告，2019年，区块链+农业将成为一个热门话题。",
        },
        {
          id: 4,
          name: "斗鱼“斗”不动了？",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "斗鱼“斗”不动了？",
        },
        {
          id: 5,
          name: "“熟人匿名社交”这条路可行吗？",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "“熟人匿名社交”这条路可行吗？",
        },
        {
          id: 6,
          name: "许家印、贾跃亭和解了，但FF发展态势仍不乐观",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "许家印、贾跃亭和解了，但FF发展态势仍不乐观",
        },
        {
          id: 7,
          name: "“共享单车发展受阻 共享电动滑板车能有机会吗",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "共享单车发展受阻 共享电动滑板车能有机会吗",
        },
      ],
    },
    {
      category: "热点洞察",
      posts: [
        {
          id: 1,
          name: "不谋而合的“云计划”，但时代的主题已不再是",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content:
            "赶了个晚集，但最终没有缺席，在腾讯和阿里先后进行组织架构调整过后，近日，百度创始人、董事长李彦宏发表内...",
        },
        {
          id: 2,
          name: "当网红本人成为网红毒瘤：Vtuber的纸片人模式能",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "当网红本人成为网红毒瘤：Vtuber的纸片人模式能",
        },
        {
          id: 3,
          name: "区块链领域第一大投资者 日本SBI成立一家区块链",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "区块链领域第一大投资者 日本SBI成立一家区块链",
        },
        {
          id: 4,
          name: "短视频下半场，版权争霸战打响，谁将首发“阵”？",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "短视频下半场，版权争霸战打响，谁将首发“阵”？",
        },
        {
          id: 5,
          name: "“熟人匿名社交”这条路可行吗？",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "“熟人匿名社交”这条路可行吗？",
        },
        {
          id: 6,
          name: "许家印、贾跃亭和解了，但FF发展态势仍不乐观",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "许家印、贾跃亭和解了，但FF发展态势仍不乐观",
        },
        {
          id: 7,
          name: "“共享单车发展受阻 共享电动滑板车能有机会吗",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "“共享单车发展受阻 共享电动滑板车能有机会吗",
        },
      ],
    },
    {
      category: "广告运营",
      posts: [
        {
          id: 1,
          name: "区块链+农业或将浴火重生",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "区块链+农业或将浴火重生",
        },
        {
          id: 2,
          name: "区块链未死！2019区块链+农业或将浴火重生",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "区块链未死！2019区块链+农业或将浴火重生",
        },
        {
          id: 3,
          name: "“共享单车发展受阻 共享电动滑板车能有机会吗",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "“共享单车发展受阻 共享电动滑板车能有机会吗",
        },
        {
          id: 4,
          name: "“熟人匿名社交”这条路可行吗？",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "“熟人匿名社交”这条路可行吗？",
        },
        {
          id: 5,
          name: "许家印、贾跃亭和解了，但FF发展态势仍不乐观",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "许家印、贾跃亭和解了，但FF发展态势仍不乐观",
        },
        {
          id: 6,
          name: "“共享单车发展受阻 共享电动滑板车能有机会吗",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "“共享单车发展受阻 共享电动滑板车能有机会吗",
        },
        {
          id: 7,
          name: "“共享单车发展受阻 共享电动滑板车能有机会吗",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "“共享单车发展受阻 共享电动滑板车能有机会吗",
        },
      ],
    },
    {
      category: "营销推广",
      posts: [
        {
          id: 1,
          name: "区块链+农业或将浴火重生",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "区块链+农业或将浴火重生",
        },
        {
          id: 2,
          name: "区块链未死！2019区块链+农业或将浴火重生",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "区块链未死！2019区块链+农业或将浴火重生",
        },
        {
          id: 3,
          name: "“共享单车发展受阻 共享电动滑板车能有机会吗",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "“共享单车发展受阻 共享电动滑板车能有机会吗",
        },
        {
          id: 4,
          name: "“熟人匿名社交”这条路可行吗？",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "“熟人匿名社交”这条路可行吗？",
        },
        {
          id: 5,
          name: "许家印、贾跃亭和解了，但FF发展态势仍不乐观",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "许家印、贾跃亭和解了，但FF发展态势仍不乐观",
        },
        {
          id: 6,
          name: "“共享单车发展受阻 共享电动滑板车能有机会吗",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "“共享单车发展受阻 共享电动滑板车能有机会吗",
        },
        {
          id: 7,
          name: "“共享单车发展受阻 共享电动滑板车能有机会吗",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "“共享单车发展受阻 共享电动滑板车能有机会吗",
        },
      ],
    },
    {
      category: "电商运营",
      posts: [
        {
          id: 1,
          name: "区块链+农业或将浴火重生",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "区块链+农业或将浴火重生",
        },
        {
          id: 2,
          name: "区块链未死！2019区块链+农业或将浴火重生",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "区块链未死！2019区块链+农业或将浴火重生",
        },
        {
          id: 3,
          name: "“共享单车发展受阻 共享电动滑板车能有机会吗",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "“共享单车发展受阻 共享电动滑板车能有机会吗",
        },
        {
          id: 4,
          name: "“熟人匿名社交”这条路可行吗？",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "“熟人匿名社交”这条路可行吗？",
        },
        {
          id: 5,
          name: "许家印、贾跃亭和解了，但FF发展态势仍不乐观",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "许家印、贾跃亭和解了，但FF发展态势仍不乐观",
        },
        {
          id: 6,
          name: "“共享单车发展受阻 共享电动滑板车能有机会吗",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "“共享单车发展受阻 共享电动滑板车能有机会吗",
        },
        {
          id: 7,
          name: "“熟人匿名社交”这条路可行吗？",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "“熟人匿名社交”这条路可行吗？",
        },
      ],
    },
    {
      category: "创业指南",
      posts: [
        {
          id: 1,
          name: "区块链+农业或将浴火重生",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "区块链+农业或将浴火重生",
        },
        {
          id: 2,
          name: "区块链未死！2019区块链+农业或将浴火重生",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "区块链未死！2019区块链+农业或将浴火重生",
        },
        {
          id: 3,
          name: "“共享单车发展受阻 共享电动滑板车能有机会吗",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "“共享单车发展受阻 共享电动滑板车能有机会吗",
        },
        {
          id: 4,
          name: "“熟人匿名社交”这条路可行吗？",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "“熟人匿名社交”这条路可行吗？",
        },
        {
          id: 5,
          name: "许家印、贾跃亭和解了，但FF发展态势仍不乐观",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "许家印、贾跃亭和解了，但FF发展态势仍不乐观",
        },
        {
          id: 6,
          name: "“共享单车发展受阻 共享电动滑板车能有机会吗",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "“共享单车发展受阻 共享电动滑板车能有机会吗",
        },
        {
          id: 7,
          name: "“熟人匿名社交”这条路可行吗？",
          url: "detail.html",
          img: "uploads/allimg/c191121/15J2cCR4430-2c91.jpg",
          content: "“熟人匿名社交”这条路可行吗？",
        },
      ],
    },
  ]);

  return (
    <div>
      <main className="main">
        <Slides />
        <TopPosts />
        <div className="hmBox">
          <div className="clear"></div>
          {categories.map((item) => (
            <section className="boxWrap" key={item.category}>
              <div className="box">
                <div className="top">
                  <span>
                    <Link to={`/list/${item.category}`} title={item.category}>
                      更多
                    </Link>
                  </span>
                  <h2>{item.category}</h2>
                </div>
                <ul>
                  {item.posts.map((post) => {
                    if (post.id === 1) {
                      return (
                        <li className="first" key={post.id}>
                          <figure className="thumbnail">
                            {" "}
                            <Link
                              to={`/detail/${post.id}`}
                              // target="_blank"
                              rel="noreferrer"
                            >
                              {" "}
                              <img src={post.img} alt={post.name} />{" "}
                            </Link>{" "}
                          </figure>
                          <div className="info">
                            <h4>
                              <Link
                                to={`/detail/${post.id}`}
                                // target="_blank"
                                rel="noreferrer"
                              >
                                {post.name}
                              </Link>
                            </h4>
                            <p>{post.content}</p>
                          </div>
                        </li>
                      );
                    } else {
                      return (
                        <li className="list" key={post.id}>
                          <h4>
                            <Link
                              to={`/detail/${post.id}`}
                              // target="_blank"
                              title={post.name}
                              rel="noreferrer"
                            >
                              {post.name}
                            </Link>
                          </h4>
                        </li>
                      );
                    }
                  })}
                </ul>
              </div>
            </section>
          ))}
          <div className="clear"></div>
        </div>
      </main>
    </div>
  );
}
