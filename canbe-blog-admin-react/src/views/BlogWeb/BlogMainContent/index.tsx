import { Card, Col, Layout, Row, Space, theme, Image, Divider } from "antd";
import React from "react";
import styles from "./index.module.scss";
import { formateDateTime, FORMAT_DATE } from "@/utils/time";
const { Content } = Layout;

const space = 20;

interface BlogMainContentProps {
  articlePage: SysArticle[];
}
const BlogMainContent: React.FC<BlogMainContentProps> = ({ articlePage }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Content style={{ padding: "0 350px", marginTop: space }}>
      <div
        style={{
          minHeight: "80vh",
          background: colorBgContainer,
          backgroundColor: "rgb(245 245 245)",
          borderRadius: borderRadiusLG,
        }}
      >
        <Row>
          <Col span={17}>
            <Space
              direction="vertical"
              size={space}
              style={{ display: "flex" }}
            >
              {/*  遍历赋值 */}
              {articlePage.map((article) => (
                <Card hoverable className={styles.postCard} key={article.id}>
                  <div className={styles.contentRow} >
                    <div className={styles.textArea}>
                      <h3 className={styles.postTitle}>{article.title}</h3>
                      <p className={styles.postContent}>{article.contentMd}</p>
                    </div>
                    <Image
                      className={styles.postImage}
                      src={`/public/download/${article.cover}`}
                      preview={false}
                    />
                  </div>

                  <Divider style={{ margin: "10px 0" }} />

                  {/* 作者、浏览量、时间、分类 区域 */}
                  <div className={styles.postCardBottom}>
                    <div className={styles.leftInfo}>
                      <div className="author">作者:{article.userId}</div>
                      <div>浏览:{article.quantity}次</div>
                      <div>
                        发布时间:
                        {formateDateTime(article.createTime, FORMAT_DATE)}
                      </div>
                    </div>
                    <div className={styles.rightInfo}>
                      {/* <el-tag disable-transitions="true">{{ article.categoryName }}</el-tag> */}
                    </div>
                  </div>
                </Card>
              ))}
            </Space>
          </Col>
          <Col span={7}>
            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex", margin: `0 ${space}px` }}
            >
              <Card hoverable>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
            </Space>
          </Col>
        </Row>
      </div>
    </Content>
  );
};

export default BlogMainContent;
