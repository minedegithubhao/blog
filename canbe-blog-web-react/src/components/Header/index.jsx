import React, { Component } from "react";

export default function Header() {
  return (
    <div>
      <header>
        <div className="header">
          <div className="inner">
            <h1 id="logo">
              {" "}
              <a
                title="某某新闻资讯网"
                href="index.html"
                style={{
                  backgroundImage: "url(/images/logo.png)",
                }}
              >
                某某新闻资讯网
              </a>{" "}
            </h1>
            <div className="search">
              <div className="searchForm bgcolor">
                <form
                  onsubmit="return checkSearchForm()"
                  method="post"
                  name="searchform"
                  action="/plus/search.php"
                >
                  <input
                    type="text"
                    name="q"
                    id="edtSearch"
                    className="text"
                    value=""
                    placeholder="输入关键词搜索..."
                    x-webkit-speech=""
                  />
                  <button
                    type="submit"
                    id="btnPost"
                    name="submit"
                    className="submit"
                  >
                    <i className="fas fa-search"></i>
                  </button>
                </form>
              </div>
            </div>
            <div className="navBtn">
              {" "}
              <span></span>{" "}
            </div>
            <div className="schBtn">
              {" "}
              <i className="fas fa-search"></i>{" "}
            </div>
            <div className="clear"></div>
          </div>
        </div>
      </header>
    </div>
  );
}
