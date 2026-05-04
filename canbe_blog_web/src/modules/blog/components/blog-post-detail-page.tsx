import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Folder, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublicArticle } from "../api/public-article-api";

const defaultCover = "/images/defaults/article-cover.png";

export async function BlogPostDetailPage({ id }: { id: number }) {
  const article = await safeLoadArticle(id);
  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-foreground">乘风博客</h1>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/blog" className="text-sm font-medium text-gray-600 transition-colors hover:text-foreground">
              首页
            </Link>
            <Link href="/blog/posts" className="text-sm font-medium text-foreground transition-colors">
              博客
            </Link>
            <Link href="/blog/agent" className="text-sm font-medium text-gray-600 transition-colors hover:text-foreground">
              Agent
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-600 transition-colors hover:text-foreground">
              关于
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-gray-600 transition-colors hover:text-foreground">
              后台管理
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">
        <Button asChild variant="ghost" className="mb-6 cursor-pointer">
          <Link href="/blog/posts">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            返回文章列表
          </Link>
        </Button>
        <article className="overflow-hidden rounded-lg border bg-white">
          <div className="h-72 bg-muted">
            <img src={article.coverUrl || defaultCover} alt={article.title} className="h-full w-full object-cover" />
          </div>
          <div className="p-8">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Folder className="h-4 w-4" aria-hidden="true" />
                {article.categoryName || "未分类"}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                {formatDate(article.gmtModified)}
              </span>
            </div>
            <h1 className="text-3xl font-semibold leading-tight text-foreground">{article.title}</h1>
            {article.summary ? <p className="mt-4 text-base leading-7 text-muted-foreground">{article.summary}</p> : null}
            <div className="mt-5 flex flex-wrap gap-2">
              {article.tagNames.map((tagName) => (
                <Badge key={tagName} variant="secondary" className="gap-1">
                  <Tag className="h-3 w-3" aria-hidden="true" />
                  {tagName}
                </Badge>
              ))}
            </div>
            <div className="mt-8 border-t pt-8">
              <div className="whitespace-pre-wrap text-sm leading-8 text-foreground">{article.content}</div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}

async function safeLoadArticle(id: number) {
  try {
    return await getPublicArticle(id);
  } catch {
    return null;
  }
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }
  return value.replace("T", " ").slice(0, 10);
}
