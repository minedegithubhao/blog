import { listPublicArticles } from "../api/public-article-api";
import { BlogPostsPageClient, type BlogPostListItem } from "./blog-posts-page-client";

export async function BlogPostsPage() {
  const articles = await safeLoadArticles();
  const posts = articles.list.map<BlogPostListItem>((article) => ({
    id: article.id,
    title: article.title,
    excerpt: article.summary || article.content,
    date: formatDate(article.gmtModified || article.gmtCreate),
    views: 0,
    likes: 0,
    comments: 0,
    tags: article.tagNames,
    category: article.categoryName || "未分类",
    cover: article.coverUrl || "/images/defaults/article-cover.png"
  }));

  return <BlogPostsPageClient posts={posts} total={articles.total} />;
}

async function safeLoadArticles() {
  try {
    return await listPublicArticles({ page: 1, pageSize: 50 });
  } catch {
    return { list: [], total: 0, page: 1, pageSize: 50 };
  }
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }
  return value.replace("T", " ").slice(0, 10);
}
