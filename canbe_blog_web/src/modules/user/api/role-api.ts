import type { ApiResult } from "@/types/api";
import type { PageResult } from "@/types/page";
import { getAuthHeaders } from "@/modules/auth/utils/auth-storage";
import type { Role, RoleCreatePayload, RoleQuery, RoleUpdatePayload } from "../types/role";

async function parseResult<T>(response: Response): Promise<T> {
  const result = (await response.json()) as ApiResult<T>;
  if (!response.ok || result.code !== 200) {
    throw new Error(result.message || "请求失败");
  }
  return result.data;
}

export async function listRoles(query: RoleQuery): Promise<PageResult<Role>> {
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
  const response = await fetch(`/api/v1/roles?${params.toString()}`, {
    headers: getAuthHeaders()
  });
  return parseResult<PageResult<Role>>(response);
}

export async function createRole(payload: RoleCreatePayload): Promise<number> {
  const response = await fetch("/api/v1/roles", {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload)
  });
  return parseResult<number>(response);
}

export async function updateRole(id: number, payload: RoleUpdatePayload): Promise<void> {
  const response = await fetch(`/api/v1/roles/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload)
  });
  await parseResult<null>(response);
}

export async function deleteRole(id: number): Promise<void> {
  const response = await fetch(`/api/v1/roles/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  await parseResult<null>(response);
}
