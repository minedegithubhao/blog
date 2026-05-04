import type { ApiResult } from "@/types/api";
import type { PageResult } from "@/types/page";
import { getAuthHeaders } from "@/modules/auth/utils/auth-storage";
import type { Tag, TagPayload, TagQuery } from "../types/tag";

async function parseResult<T>(response: Response): Promise<T> {
  const result = (await response.json()) as ApiResult<T>;
  if (!response.ok || result.code !== 200) {
    throw new Error(result.message || "请求失败");
  }
  return result.data;
}

export async function listTags(query: TagQuery): Promise<PageResult<Tag>> {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize)
  });
  if (query.name) {
    params.set("name", query.name);
  }
  const response = await fetch(`/api/v1/tags?${params.toString()}`, {
    headers: getAuthHeaders()
  });
  return parseResult<PageResult<Tag>>(response);
}

export async function createTag(payload: TagPayload): Promise<number> {
  const response = await fetch("/api/v1/tags", {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload)
  });
  return parseResult<number>(response);
}

export async function updateTag(id: number, payload: TagPayload): Promise<void> {
  const response = await fetch(`/api/v1/tags/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload)
  });
  await parseResult<null>(response);
}

export async function deleteTag(id: number): Promise<void> {
  const response = await fetch(`/api/v1/tags/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  await parseResult<null>(response);
}
