import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Slides() {
  const [slides, setSlides] = useState([
    {
      id: 1,
      title: "资本抢滩区块链：泡沫还是技术？",
      img: "/images/1-210Z215032Nb.jpg",
      href: "detail.html",
    },
    {
      id: 2,
      title: "房产中介电商平台“小败局”",
      img: "/images/1-210Z2150243208.jpg",
    },
  ]);

  return (
    <div>
      <div className="slides">
        <div id="slides" className="owl-carousel">
          {slides.map((item) => (
            <div
              key={item.id}
              className="item"
              style={{
                backgroundImage: "url(/images/1-210Z215032Nb.jpg)",
              }}
            >
              {" "}
              <Link
                to={`/detail/${item.id}`}
                title="资本抢滩区块链：泡沫还是技术？"
                target="_blank"
              >
                {" "}
                <i>资本抢滩区块链：泡沫还是技术？</i>{" "}
              </Link>{" "}
            </div>
          ))}
        </div>
        <div className="load">
          {" "}
          <span>加载中...</span>{" "}
        </div>
      </div>
    </div>
  );
}
