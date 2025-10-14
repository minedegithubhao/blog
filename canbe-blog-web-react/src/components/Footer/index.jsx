import React, { Component } from "react";

export default class Footer extends Component {
  render() {
    return (
      <div>
        <footer id="footer">
          <div className="inner">
            <div className="btm">
              <div className="copyright">
                <p>
                  Copyright &copy; 2024 新闻资讯博客类模板
                  版权所有&nbsp;&nbsp;ICP备案号：
                  <a href="https://beian.miit.gov.cn/" rel="nofollow">
                    ICP备666xxx8888
                  </a>
                  &nbsp;&nbsp;统计代码
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}
