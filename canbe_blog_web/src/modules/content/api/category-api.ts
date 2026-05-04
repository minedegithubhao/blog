import type { ApiResult } from "@/types/api";
import type { PageResult } from "@/types/page";
import { getAuthHeaders } from "@/modules/auth/utils/auth-storage";
import type { Category, CategoryPayload, CategoryQuery } from "../types/category";

async function parseResult<T>(response: Response): Promise<T> {
  const result = (await response.json()) as ApiResult<T>;
  if (!response.ok || result.code !== 200) {
    throw new Error(result.message || "请求失败");
  }
  return result.data;
}

export async function listCategories(query: CategoryQuery): Promise<PageResult<Category>> {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize)
  });
  if (query.name) {
    params.set("name", query.name);
  }
  if (query.status !== undefined) {
    params.set("status", String(query.status));
  }
  const response = await fetch(`/api/v1/categories?${params.toString()}`, {
    headers: getAuthHeaders()
  });
  return parseResult<PageResult<Category>>(response);
}

export async function createCategory(payload: CategoryPayload): Promise<number> {
  const response = await fetch("/api/v1/categories", {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload)
  });
  return parseResult<number>(response);
}

export async function updateCategory(id: number, payload: CategoryPayload): Promise<void> {
  const response = await fetch(`/api/v1/categories/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload)
  });
  await parseResult<null>(response);
}

export async function deleteCategory(id: number): Promise<void> {
  const response = await fetch(`/api/v1/categories/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  await parseResult<null>(response);
}
