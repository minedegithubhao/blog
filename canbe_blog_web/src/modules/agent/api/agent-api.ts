import type { ApiResult } from "@/types/api";
import type { PageResult } from "@/types/page";
import { getAuthHeaders } from "@/modules/auth/utils/auth-storage";
import type { Agent, AgentPayload, AgentQuery, ConnectionTestResult } from "../types/agent";
import type { AgentCallRecord, AgentCallRecordQuery } from "../types/agent-call-record";

async function parseResult<T>(response: Response): Promise<T> {
  const result = (await response.json()) as ApiResult<T>;
  if (!response.ok || result.code !== 200) {
    throw new Error(result.message || "请求失败");
  }
  return result.data;
}

export async function listAgents(query: AgentQuery): Promise<PageResult<Agent>> {
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
  const response = await fetch(`/api/v1/agents?${params.toString()}`, {
    headers: getAuthHeaders()
  });
  return parseResult<PageResult<Agent>>(response);
}

export async function createAgent(payload: AgentPayload): Promise<number> {
  const response = await fetch("/api/v1/agents", {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload)
  });
  return parseResult<number>(response);
}

export async function updateAgent(id: number, payload: AgentPayload): Promise<void> {
  const response = await fetch(`/api/v1/agents/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload)
  });
  await parseResult<null>(response);
}

export async function deleteAgent(id: number): Promise<void> {
  const response = await fetch(`/api/v1/agents/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  await parseResult<null>(response);
}

export async function testAgentConnection(id: number): Promise<ConnectionTestResult> {
  const response = await fetch(`/api/v1/agents/${id}/test-connection`, {
    method: "POST",
    headers: getAuthHeaders()
  });
  return parseResult<ConnectionTestResult>(response);
}

export async function listAgentCallRecords(query: AgentCallRecordQuery): Promise<PageResult<AgentCallRecord>> {
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
  if (query.status) {
    params.set("status", query.status);
  }
  const response = await fetch(`/api/v1/agent-call-records?${params.toString()}`, {
    headers: getAuthHeaders()
  });
  return parseResult<PageResult<AgentCallRecord>>(response);
}
