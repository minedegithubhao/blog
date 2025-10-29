import React, { useEffect, useState } from "react";
import { Divider } from "antd";
import styles from "./index.module.scss";
import { getArticleByIdService } from "@/api/article";
import { useLocation } from "react-router-dom";
import { MdPreview } from "md-editor-rt";
import "md-editor-rt/lib/preview.css";

const BlogWebDetail: React.FC = () => {
  const location = useLocation();
  const [article, setArticle] = useState<SysArticle>({} as SysArticle);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const id = urlParams.get("id");
    if (id) {
      getArticleById(parseInt(id));
    }
  }, [location]);

  const getArticleById = async (id: number) => {
    const result = await getArticleByIdService(id);
    setArticle(result.data);
  };

  return (
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
          <MdPreview value={article.contentMd} />
        </div>
      </div>
    </div>
  );
};

export default BlogWebDetail;
