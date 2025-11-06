import { getWebArtilePageService } from "@/api/web/webArticle";
import { usePagination } from "@/hooks/usePagination";
import { FORMAT_DATE, formateDateTime } from "@/utils/time";
import type { PaginationProps } from "antd";
import { Card, Col, Divider, Image, Pagination, Row, Space } from "antd";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

const space = 20;

const BlogWebList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { paginationParams, setPaginationParams } = usePagination();
  const [articlePage, setArticlePage] = React.useState<SysArticle[]>([]);

  // 监听url变化，重新加载数据
  useEffect(() => {
    // 获取url参数
    const categoryId =
      new URLSearchParams(location.search).get("categoryId") || "";
    // 如果没有categoryId参数，不执行数据加载
    if (!categoryId) {
      return;
    }
    loadDataWithPagination(categoryId);
  }, [location]);

  /**
   * 加载分页数据
   */
  const loadDataWithPagination = async (categoryId?: string) => {
    const queryParams = {
      categoryId: categoryId,
      pageNum: paginationParams.current,
      pageSize: paginationParams.pageSize,
    } as SysArticleQueryParams;
    const res = await getWebArtilePageService(queryParams);
    setArticlePage(res.data.records);

    // 更新分页参数
    setPaginationParams({
      ...paginationParams,
      total: res.data.total,
    });
  };

  const onClick = (id: number) => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("categoryId", urlParams.get("categoryId") + "");
    urlParams.set("id", id + "");
    navigate(`/web/detail?${urlParams.toString()}`);
  };

  // 分页功能
  const onChange: PaginationProps["onChange"] = async (page, pageSize) => {
    const categoryId = new URLSearchParams(location.search).get("categoryId") || "";
    const queryParams = {
      categoryId: categoryId,
      pageNum: page,
      pageSize: pageSize,
    } as SysArticleQueryParams;
    const res = await getWebArtilePageService(queryParams);
    setArticlePage(res.data.records);
    // 更新分页参数
    setPaginationParams({
      ...paginationParams,
      current: page,
      pageSize: pageSize,
      total: res.data.total,
    });
  };

  return (
    <>
      <Row>
        <Col span={17}>
          <Space direction="vertical" size={space} style={{ display: "flex" }}>
            {/*  遍历赋值 */}
            {articlePage.map((article) => (
              <Card
                hoverable
                className={styles.postCard}
                key={article.id}
                onClick={() => onClick(article.id)}
              >
                <div className={styles.contentRow}>
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
                    {/* <el-tag disable-transitions="true">{{ article.categoryName }}</el-tag> */ }
                  </div>
                </div>
              </Card>
            ))}
          </Space>
          <Pagination
            align="center"
            current={paginationParams.current}
            pageSize={paginationParams.pageSize}
            total={paginationParams.total}
            onChange={onChange}
            style={{ marginTop: "20px" }}
          />
        </Col>
        <Col span={7}>
          <Space
            direction="vertical"
            size="middle"
            style={{ display: "flex", margin: `0 ${space}px` }}
          >
            <Card hoverable>
              <p>个人信息</p>
            </Card>
          </Space>
        </Col>
      </Row>
    </>
  );
};

export default BlogWebList;
