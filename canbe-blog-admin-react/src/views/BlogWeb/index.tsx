import MainFooter from "@/views/Home/MainFooter";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

const navItems = [
  {
    key: "ai",
    label: "AI专栏",
    path: "/web/ai",
  },
  {
    key: "blog",
    label: "博客",
    path: "/web/blog",
  },
];

const resolveActiveKey = (pathname: string) => {
  if (pathname.startsWith("/web/blog")) {
    return "blog";
  }

  return "ai";
};

const BlogWeb: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeKey = resolveActiveKey(location.pathname);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brandBlock}>
          <span className={styles.brand}>Canbe Studio</span>
          <span className={styles.subtitle}>AI x Blog Workspace</span>
        </div>
        <nav className={styles.navigation}>
          {navItems.map((item) => (
            <button
              type="button"
              key={item.key}
              className={`${styles.navButton} ${
                activeKey === item.key ? styles.navButtonActive : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>
      <main className={styles.main}>
        <div className={styles.pageShell}>
          <Outlet />
        </div>
      </main>
      <MainFooter />
    </div>
  );
};

export default BlogWeb;

