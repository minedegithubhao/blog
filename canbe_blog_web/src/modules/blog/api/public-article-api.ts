import type { ApiResult } from "@/types/api";
import type { PageResult } from "@/types/page";
import type { PublicArticle } from "../types/public-article";
import type { AgentChatRequest, AgentChatResponse, PublicAgent } from "../types/public-agent";
import { getAuthHeaders } from "@/modules/auth/utils/auth-storage";

const apiBaseUrl = process.env.BLOG_API_BASE_URL || "http://localhost:18080";

async function parseResult<T>(response: Response): Promise<T> {
  const result = (await response.json()) as ApiResult<T>;
  if (!response.ok || result.code !== 200) {
    const error = new Error(result.message || "请求失败") as Error & { code?: number };
    error.code = result.code;
    throw error;
  }
  return result.data;
}

export async function listPublicArticles(query: {
  page: number;
  pageSize: number;
  title?: string;
  categoryId?: number;
  tagId?: number;
}): Promise<PageResult<PublicArticle>> {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize)
  });
  if (query.title) {
    params.set("title", query.title);
  }
  if (query.categoryId) {
    params.set("categoryId", String(query.categoryId));
  }
  if (query.tagId) {
    params.set("tagId", String(query.tagId));
  }
  const response = await fetch(`${apiBaseUrl}/api/v1/public/articles?${params.toString()}`, {
    cache: "no-store"
  });
  return parseResult<PageResult<PublicArticle>>(response);
}

export async function getPublicArticle(id: number): Promise<PublicArticle> {
  const response = await fetch(`${apiBaseUrl}/api/v1/public/articles/${id}`, {
    cache: "no-store"
  });
  return parseResult<PublicArticle>(response);
}

export async function listPublicAgents(query: {
  page: number;
  pageSize: number;
  name?: string;
}): Promise<PageResult<PublicAgent>> {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize)
  });
  if (query.name) {
    params.set("name", query.name);
  }
  const response = await fetch(`${apiBaseUrl}/api/v1/public/agents?${params.toString()}`, {
    cache: "no-store"
  });
  return parseResult<PageResult<PublicAgent>>(response);
}

export async function chatWithAgent(agentId: number, payload: AgentChatRequest): Promise<AgentChatResponse> {
  const response = await fetch(`/api/v1/agents/${agentId}/chat`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload)
  });
  return parseResult<AgentChatResponse>(response);
}
