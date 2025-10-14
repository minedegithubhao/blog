import React, { Component } from "react";
import HotPosts from "./HotPosts";
import NewPosts from "./NewPosts";
import Tags from "./Tags";

export default class Aside extends Component {
  render() {
    return (
      <div>
        <aside className="sidebar">
          <HotPosts />
          {/* 广告
          <section className="widget cead">
            <img
              src="images/ad1.jpg"
              border="0"
              width="300"
              height="250"
              alt=""
            />
          </section> */}
          <NewPosts />
          <Tags />
          {/* 广告
          <section className="widget cead">
            <img
              src="images/ad2.jpg"
              border="0"
              width="300"
              height="250"
              alt=""
            />
          </section> */}
          {/* 友情链接
          <section className="widget divLinkage">
            <h3>友情链接</h3>
            <ul>
              <li className="link-item">
                <a
                  href="http://www.bootstrapmb.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  网站模板
                </a>{" "}
              </li>
              <li className="link-item">
                <a
                  href="http://www.bootstrapmb.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  HTML5模板
                </a>{" "}
              </li>
            </ul>
          </section> */}
        </aside>
      </div>
    );
  }
}
