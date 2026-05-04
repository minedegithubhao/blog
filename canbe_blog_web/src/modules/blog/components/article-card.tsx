import Link from "next/link";
import { Calendar, Folder, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { PublicArticle } from "../types/public-article";

const defaultCover = "/images/defaults/article-cover.png";

export function ArticleCard({ article }: { article: PublicArticle }) {
  const coverUrl = article.coverUrl || defaultCover;

  return (
    <Link href={`/blog/posts/${article.id}`} className="block">
      <Card className="overflow-hidden border-gray-200 transition-shadow hover:shadow-md">
        <div className="grid gap-0 md:grid-cols-[220px_1fr]">
          <div className="h-44 bg-muted md:h-full">
            <img src={coverUrl} alt={article.title} className="h-full w-full object-cover" />
          </div>
          <CardContent className="p-5">
            <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Folder className="h-4 w-4" aria-hidden="true" />
                {article.categoryName || "未分类"}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                {formatDate(article.gmtModified)}
              </span>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-foreground">{article.title}</h2>
            <p className="mb-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {article.summary || article.content}
            </p>
            <div className="flex flex-wrap gap-2">
              {article.tagNames.map((tagName) => (
                <Badge key={tagName} variant="secondary" className="gap-1">
                  <Tag className="h-3 w-3" aria-hidden="true" />
                  {tagName}
                </Badge>
              ))}
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }
  return value.replace("T", " ").slice(0, 10);
}
