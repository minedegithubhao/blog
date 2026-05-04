import type { ApiResult } from "@/types/api";
import type { PageResult } from "@/types/page";
import { getAuthHeaders } from "@/modules/auth/utils/auth-storage";
import type { MenuItem, MenuPayload, MenuQuery, MenuTreeNode } from "../types/menu";

async function parseResult<T>(response: Response): Promise<T> {
  const result = (await response.json()) as ApiResult<T>;
  if (!response.ok || result.code !== 200) {
    throw new Error(result.message || "请求失败");
  }
  return result.data;
}

export async function listMenus(query: MenuQuery): Promise<PageResult<MenuItem>> {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize)
  });
  if (query.title) {
    params.set("title", query.title);
  }
  if (query.status !== undefined) {
    params.set("status", String(query.status));
  }
  const response = await fetch(`/api/v1/menus?${params.toString()}`, {
    headers: getAuthHeaders()
  });
  return parseResult<PageResult<MenuItem>>(response);
}

export async function createMenu(payload: MenuPayload): Promise<number> {
  const response = await fetch("/api/v1/menus", {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload)
  });
  return parseResult<number>(response);
}

export async function listMenuTree(): Promise<MenuTreeNode[]> {
  const response = await fetch("/api/v1/menus/tree", {
    headers: getAuthHeaders()
  });
  return parseResult<MenuTreeNode[]>(response);
}

export async function updateMenu(id: number, payload: MenuPayload): Promise<void> {
  const response = await fetch(`/api/v1/menus/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload)
  });
  await parseResult<null>(response);
}

export async function deleteMenu(id: number): Promise<void> {
  const response = await fetch(`/api/v1/menus/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  await parseResult<null>(response);
}
