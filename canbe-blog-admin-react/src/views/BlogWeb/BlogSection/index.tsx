import { webCategoryListService } from "@/api/web/webCategory";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

const BlogSection: React.FC = () => {
  const [categoryList, setCategoryList] = useState<SysTag[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const currentCategoryId = searchParams.get("categoryId") ?? "";

  useEffect(() => {
    const loadCategories = async () => {
      const result = await webCategoryListService();
      setCategoryList(result.data);
    };

    void loadCategories();
  }, []);

  useEffect(() => {
    if (
      location.pathname === "/web/blog" &&
      !currentCategoryId &&
      categoryList.length > 0
    ) {
      navigate(`/web/blog?categoryId=${categoryList[0].id}`, { replace: true });
    }
  }, [categoryList, currentCategoryId, location.pathname, navigate]);

  const currentCategoryName =
    categoryList.find((item) => item.id.toString() === currentCategoryId)?.name ??
    "博客内容";

  const goToCategory = (categoryId: number) => {
    navigate(`/web/blog?categoryId=${categoryId}`);
  };

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <span className={styles.eyebrow}>Editorial Blog</span>
        <h1>博客内容区</h1>
        <p>
          博客部分继续复用现有文章数据与详情页，入口只做一次重组：
          顶层只保留“AI专栏 / 博客”，分类筛选下沉到博客内部。
        </p>
      </div>

      <div className={styles.categoryPanel}>
        <div>
          <span className={styles.panelLabel}>当前栏目</span>
          <strong>{currentCategoryName}</strong>
        </div>
        <div className={styles.categoryList}>
          {categoryList.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`${styles.categoryButton} ${
                currentCategoryId === item.id.toString()
                  ? styles.categoryButtonActive
                  : ""
              }`}
              onClick={() => goToCategory(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        <Outlet />
      </div>
    </section>
  );
};

export default BlogSection;

