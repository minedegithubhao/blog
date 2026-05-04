import type { ApiResult } from "@/types/api";
import type { PageResult } from "@/types/page";
import { getAuthHeaders } from "@/modules/auth/utils/auth-storage";
import type { Article, ArticlePayload, ArticleQuery } from "../types/article";

async function parseResult<T>(response: Response): Promise<T> {
  const result = (await response.json()) as ApiResult<T>;
  if (!response.ok || result.code !== 200) {
    throw new Error(result.message || "请求失败");
  }
  return result.data;
}

export async function listArticles(query: ArticleQuery): Promise<PageResult<Article>> {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize)
  });
  if (query.title) {
    params.set("title", query.title);
  }
  if (query.categoryId !== undefined) {
    params.set("categoryId", String(query.categoryId));
  }
  if (query.tagId !== undefined) {
    params.set("tagId", String(query.tagId));
  }
  if (query.status !== undefined) {
    params.set("status", String(query.status));
  }

  const response = await fetch(`/api/v1/articles?${params.toString()}`, {
    headers: getAuthHeaders()
  });
  return parseResult<PageResult<Article>>(response);
}

export async function createArticle(payload: ArticlePayload): Promise<number> {
  const response = await fetch("/api/v1/articles", {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload)
  });
  return parseResult<number>(response);
}

export async function updateArticle(id: number, payload: ArticlePayload): Promise<void> {
  const response = await fetch(`/api/v1/articles/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload)
  });
  await parseResult<null>(response);
}

export async function deleteArticle(id: number): Promise<void> {
  const response = await fetch(`/api/v1/articles/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  await parseResult<null>(response);
}
