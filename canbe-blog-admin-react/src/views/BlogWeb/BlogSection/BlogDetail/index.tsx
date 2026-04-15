import { getWebArticleByIdService } from "@/api/web/webArticle";
import { FORMAT_DATE, formateDateTime } from "@/utils/time";
import { Button, Card, Divider, Empty, Space, Tag } from "antd";
import { MdCatalog, MdPreview } from "md-editor-rt";
import "md-editor-rt/lib/preview.css";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

const editorId = "blog-web-detail-editor";

const BlogDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [article, setArticle] = useState<SysArticle>({} as SysArticle);
  const [loading, setLoading] = useState(false);
  const urlParams = new URLSearchParams(location.search);
  const articleId = urlParams.get("id");
  const categoryId = urlParams.get("categoryId");

  useEffect(() => {
    if (!articleId) {
      return;
    }

    const getArticleById = async (id: number) => {
      setLoading(true);
      try {
        const result = await getWebArticleByIdService(id);
        setArticle(result.data);
      } finally {
        setLoading(false);
      }
    };

    void getArticleById(Number.parseInt(articleId, 10));
  }, [articleId]);

  const goBack = () => {
    if (categoryId) {
      navigate(`/web/blog?categoryId=${categoryId}`);
      return;
    }

    navigate("/web/blog");
  };

  if (!articleId) {
    return <Empty description="没有找到文章参数" />;
  }

  return (
    <section className={styles.page}>
      <div className={styles.articleWrap}>
        <article className={styles.article}>
          <div className={styles.articleHeader}>
            <Button type="default" onClick={goBack}>
              返回博客列表
            </Button>
            <h1>{article.title}</h1>
            <div className={styles.articleMeta}>
              <Tag color="gold">{article.categoryName || "未分类"}</Tag>
              <span>{article.userNickName}</span>
              <span>
                {article.createTime
                  ? formateDateTime(article.createTime, FORMAT_DATE)
                  : ""}
              </span>
              <span>浏览 {article.quantity ?? 0}</span>
            </div>
          </div>

          <Divider className={styles.divider} />

          <div className={styles.articleContent}>
            {loading ? (
              <Card loading />
            ) : (
              <MdPreview
                id={editorId}
                value={article.contentMd}
                previewTheme="smart-blue"
              />
            )}
          </div>
        </article>

        <aside className={styles.catalogWrap}>
          <Space direction="vertical" size="middle" className={styles.catalogSpace}>
            <Card className={styles.catalogCard}>
              <h3>文章目录</h3>
              <MdCatalog
                editorId={editorId}
                scrollElement={
                  typeof document === "undefined"
                    ? undefined
                    : document.documentElement
                }
                scrollElementOffsetTop={100}
              />
            </Card>
          </Space>
        </aside>
      </div>
    </section>
  );
};

export default BlogDetail;

