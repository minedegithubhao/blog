import type { ApiResult } from "@/types/api";
import type { PageResult } from "@/types/page";
import { getAuthHeaders } from "@/modules/auth/utils/auth-storage";
import type { DictItem, DictItemPayload, DictItemQuery } from "../types/dict-item";

async function parseResult<T>(response: Response): Promise<T> {
  const result = (await response.json()) as ApiResult<T>;
  if (!response.ok || result.code !== 200) {
    throw new Error(result.message || "请求失败");
  }
  return result.data;
}

export async function listDictItems(query: DictItemQuery): Promise<PageResult<DictItem>> {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize)
  });
  if (query.typeCode) {
    params.set("typeCode", query.typeCode);
  }
  if (query.itemLabel) {
    params.set("itemLabel", query.itemLabel);
  }
  if (query.status !== undefined) {
    params.set("status", String(query.status));
  }

  const response = await fetch(`/api/v1/dicts?${params.toString()}`, {
    headers: getAuthHeaders()
  });
  return parseResult<PageResult<DictItem>>(response);
}

export async function createDictItem(payload: DictItemPayload): Promise<number> {
  const response = await fetch("/api/v1/dicts", {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload)
  });
  return parseResult<number>(response);
}

export async function updateDictItem(id: number, payload: DictItemPayload): Promise<void> {
  const response = await fetch(`/api/v1/dicts/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload)
  });
  await parseResult<null>(response);
}

export async function deleteDictItem(id: number): Promise<void> {
  const response = await fetch(`/api/v1/dicts/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  await parseResult<null>(response);
}
