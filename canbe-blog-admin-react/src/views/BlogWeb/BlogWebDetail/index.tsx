import { getWebArticleByIdService } from "@/api/web/webArticle";
import { Card, Col, Divider, Row, Space } from "antd";
import { MdCatalog, MdPreview } from "md-editor-rt";
import "md-editor-rt/lib/preview.css";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./index.module.scss";

const editorId = "my-editor";
const BlogWebDetail: React.FC = () => {
  const location = useLocation();
  const [article, setArticle] = useState<SysArticle>({} as SysArticle);

  useEffect(() => {
    // 从url获取文章id
    const urlParams = new URLSearchParams(location.search);
    const id = urlParams.get("id");
    if (id) {
      getArticleById(parseInt(id));
    }
  }, [location]);


  const getArticleById = async (id: number) => {
    const result = await getWebArticleByIdService(id);
    setArticle(result.data);
  };

  return (
    <Row>
      <Col span={17}>
        <div>
          <div className={styles.article}>
            <div className={styles.articleHeader}>
              <h1>{article.title}</h1>
              <div className={styles.articleHeaderInfo}>
                <div
                  style={{
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  浏览:{article.quantity}次
                </div>
                <div>标签</div>
              </div>
            </div>
            <Divider style={{ margin: "0 0" }} />
            <div className={styles.articleContent}>
              <MdPreview
                id={editorId}
                value={article.contentMd}
                previewTheme="smart-blue"
              />
            </div>
          </div>
        </div>
      </Col>
      <Col span={7}>
        <div style={{ position: "sticky", top: 0 }}>
          <Space
            direction="vertical"
            size="middle"
            style={{ display: "flex", margin: `0 20px` }}
          >
            <Card>
              <h3>目录</h3>
              <MdCatalog
                editorId={editorId}
                scrollElement={document.documentElement}
                scrollElementOffsetTop={100}
              />
            </Card>
          </Space>
        </div>
      </Col>
    </Row>
  );
};

export default BlogWebDetail;
