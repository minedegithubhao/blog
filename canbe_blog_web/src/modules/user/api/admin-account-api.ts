import type { ApiResult } from "@/types/api";
import type { PageResult } from "@/types/page";
import { getAuthHeaders } from "@/modules/auth/utils/auth-storage";
import type {
  AdminAccount,
  AdminAccountCreatePayload,
  AdminAccountQuery,
  AdminAccountUpdatePayload
} from "../types/admin-account";

async function parseResult<T>(response: Response): Promise<T> {
  const result = (await response.json()) as ApiResult<T>;
  if (!response.ok || result.code !== 200) {
    throw new Error(result.message || "请求失败");
  }
  return result.data;
}

export async function listAdminAccounts(query: AdminAccountQuery): Promise<PageResult<AdminAccount>> {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize)
  });
  if (query.username) {
    params.set("username", query.username);
  }
  if (query.status !== undefined) {
    params.set("status", String(query.status));
  }
  const response = await fetch(`/api/v1/admin/accounts?${params.toString()}`, {
    headers: getAuthHeaders()
  });
  return parseResult<PageResult<AdminAccount>>(response);
}

export async function createAdminAccount(payload: AdminAccountCreatePayload): Promise<number> {
  const response = await fetch("/api/v1/admin/accounts", {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload)
  });
  return parseResult<number>(response);
}

export async function updateAdminAccount(id: number, payload: AdminAccountUpdatePayload): Promise<void> {
  const response = await fetch(`/api/v1/admin/accounts/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload)
  });
  await parseResult<null>(response);
}

export async function deleteAdminAccount(id: number): Promise<void> {
  const response = await fetch(`/api/v1/admin/accounts/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  await parseResult<null>(response);
}
