import { FORMAT_DATE, formateDateTime } from "@/utils/time";
import { Card, Col, Divider, Image, Row, Space } from "antd";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePagination } from "@/hooks/usePagination";
import { getArtilePageService } from "@/api/article";
import styles from "./index.module.scss";
import { useBlogWebContext } from "@/context/BlogWebContext";

const space = 20;

const BlogWebList: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paginationParams } = usePagination();
  const [articlePage, setArticlePage] = React.useState<SysArticle[]>([]);
  const { selectedKey, setSelectedKey } = useBlogWebContext();

  // 监听 location 变化（处理浏览器前进/后退按钮）
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const categoryIdFromUrl = urlParams.get("categoryId");

    // 如果 URL 中的 categoryId 与当前 selectedKey 不同，则更新 selectedKey
    if (categoryIdFromUrl && categoryIdFromUrl !== selectedKey) {
      setSelectedKey(categoryIdFromUrl);
    }

    // 重新加载数据
    loadDataWithPagination();
  }, [location]); // 监听 location 变化

  // 当selectedKey改变时更新URL参数
  useEffect(() => {
    if (selectedKey) {
      const urlParams = new URLSearchParams();
      urlParams.set("categoryId", selectedKey);

      // 完全依赖React Router的路由配置，不进行任何路径判断
      // 直接使用当前路径，让React Router处理所有跳转逻辑
      navigate(`/web/category?${urlParams.toString()}`);
      loadDataWithPagination();
    }
  }, [selectedKey]);

  /**
   * 加载分页数据
   */
  const loadDataWithPagination = async () => {
    const queryParams = {
      categoryId: selectedKey,
      pageNum: paginationParams.current,
      pageSize: paginationParams.pageSize,
    } as SysArticleQueryParams;
    const res = await getArtilePageService(queryParams);
    setArticlePage(res.data.records);
  };

  const onClick = (id: number) => {
    const urlParams = new URLSearchParams();
    urlParams.set("id", id + "");
    navigate(`/web/detail?${urlParams.toString()}`);
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
                    src={`/file/download/${article.cover}`}
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
            {/* <Card hoverable>
              <p>个人信息</p>
              <p>个人信息</p>
              <p>个人信息</p>
              <p>个人信息</p>
              <p>个人信息</p>
              <p>个人信息</p>
              <p>个人信息</p>
            </Card> */}
          </Space>
        </Col>
      </Row>
    </>
  );
};

export default BlogWebList;
