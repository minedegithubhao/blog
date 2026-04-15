import coverFallback from "@/assets/images/image.png";
import { getWebArtilePageService } from "@/api/web/webArticle";
import { usePagination } from "@/hooks/usePagination";
import { FORMAT_DATE, formateDateTime } from "@/utils/time";
import { Card, Empty, Image, Pagination, Spin, Tag } from "antd";
import type { PaginationProps } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

const BlogList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { paginationParams, setPaginationParams } = usePagination();
  const [articlePage, setArticlePage] = useState<SysArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const categoryId = new URLSearchParams(location.search).get("categoryId") ?? "";

  const loadDataWithPagination = async (
    currentCategoryId: string,
    page: number,
    pageSize = paginationParams.pageSize,
  ) => {
    setLoading(true);
    try {
      const queryParams = {
        categoryId: currentCategoryId,
        pageNum: page,
        pageSize,
      } as SysArticleQueryParams;
      const res = await getWebArtilePageService(queryParams);
      setArticlePage(res.data.records);
      setPaginationParams({
        ...paginationParams,
        current: page,
        pageSize,
        total: res.data.total,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!categoryId) {
      return;
    }

    void loadDataWithPagination(categoryId, 1);
  }, [categoryId]);

  const openDetail = (id: number) => {
    const urlParams = new URLSearchParams();
    urlParams.set("categoryId", categoryId);
    urlParams.set("id", `${id}`);
    navigate(`/web/blog/detail?${urlParams.toString()}`);
  };

  const onChange: PaginationProps["onChange"] = (page, pageSize) => {
    if (!categoryId) {
      return;
    }

    void loadDataWithPagination(categoryId, page, pageSize);
  };

  return (
    <section className={styles.page}>
      <Spin spinning={loading}>
        <div className={styles.list}>
          {articlePage.length === 0 ? (
            <div className={styles.emptyWrap}>
              <Empty description="当前栏目还没有文章" />
            </div>
          ) : (
            articlePage.map((article) => (
              <Card
                hoverable
                className={styles.postCard}
                key={article.id}
                onClick={() => openDetail(article.id)}
              >
                <div className={styles.cardInner}>
                  <div className={styles.textArea}>
                    <div className={styles.metaRow}>
                      <Tag color="gold">{article.categoryName || "未分类"}</Tag>
                      <span>{article.userNickName}</span>
                      <span>
                        {formateDateTime(article.createTime, FORMAT_DATE)}
                      </span>
                    </div>
                    <h2 className={styles.postTitle}>{article.title}</h2>
                    <p className={styles.postContent}>
                      {article.summary || article.contentMd}
                    </p>
                  </div>
                  <Image
                    className={styles.postImage}
                    src={`/public/download/${article.cover}`}
                    fallback={coverFallback}
                    preview={false}
                  />
                </div>
              </Card>
            ))
          )}
        </div>
      </Spin>

      <Pagination
        align="center"
        current={paginationParams.current}
        pageSize={paginationParams.pageSize}
        total={paginationParams.total}
        onChange={onChange}
        className={styles.pagination}
      />
    </section>
  );
};

export default BlogList;

