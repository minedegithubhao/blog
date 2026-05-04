import type { ApiResult } from "@/types/api";
import type { PageResult } from "@/types/page";
import { getAuthHeaders } from "@/modules/auth/utils/auth-storage";
import type {
  RoleAgentPolicy,
  RoleAgentPolicyPayload,
  RoleAgentPolicyQuery,
  UserAgentQuota,
  UserAgentQuotaPayload,
  UserAgentQuotaQuery
} from "../types/quota";

async function parseResult<T>(response: Response): Promise<T> {
  const result = (await response.json()) as ApiResult<T>;
  if (!response.ok || result.code !== 200) {
    throw new Error(result.message || "请求失败");
  }
  return result.data;
}

export async function listUserAgentQuotas(query: UserAgentQuotaQuery): Promise<PageResult<UserAgentQuota>> {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize)
  });
  if (query.userId) {
    params.set("userId", String(query.userId));
  }
  if (query.agentId) {
    params.set("agentId", String(query.agentId));
  }
  const response = await fetch(`/api/v1/quotas?${params.toString()}`, {
    headers: getAuthHeaders()
  });
  return parseResult<PageResult<UserAgentQuota>>(response);
}

export async function updateUserAgentQuota(id: number, payload: UserAgentQuotaPayload): Promise<void> {
  const response = await fetch(`/api/v1/quotas/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload)
  });
  await parseResult<null>(response);
}

export async function listRoleAgentPolicies(query: RoleAgentPolicyQuery): Promise<PageResult<RoleAgentPolicy>> {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize)
  });
  if (query.roleCode) {
    params.set("roleCode", query.roleCode);
  }
  if (query.agentId) {
    params.set("agentId", String(query.agentId));
  }
  const response = await fetch(`/api/v1/role-agent-policies?${params.toString()}`, {
    headers: getAuthHeaders()
  });
  return parseResult<PageResult<RoleAgentPolicy>>(response);
}

export async function updateRoleAgentPolicy(id: number, payload: RoleAgentPolicyPayload): Promise<void> {
  const response = await fetch(`/api/v1/role-agent-policies/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload)
  });
  await parseResult<null>(response);
}
