import type { ApiResult } from "@/types/api";
import { getAuthHeaders } from "@/modules/auth/utils/auth-storage";
import type { EvalRun, EvalRunResult, EvalSet, EvalSetGeneratePayload } from "./types";

async function parseResult<T>(response: Response): Promise<T> {
  const result = (await response.json()) as ApiResult<T>;
  if (!response.ok || result.code !== 200) {
    throw new Error(result.message || "请求失败");
  }
  return result.data;
}

export async function listEvalSets(): Promise<EvalSet[]> {
  const response = await fetch("/api/v1/rag-evaluation/eval-sets?limit=50", {
    headers: getAuthHeaders()
  });
  const data = await parseResult<{ items: EvalSet[] }>(response);
  return data.items ?? [];
}

export async function generateEvalSet(payload: EvalSetGeneratePayload): Promise<{ eval_set_id: string; summary: Record<string, number> }> {
  const response = await fetch("/api/v1/rag-evaluation/eval-sets/generate", {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload)
  });
  return parseResult<{ eval_set_id: string; summary: Record<string, number> }>(response);
}

export async function checkStale(evalSetId: string): Promise<{ summary: Record<string, number> }> {
  const response = await fetch(`/api/v1/rag-evaluation/eval-sets/${encodeURIComponent(evalSetId)}/check-stale`, {
    method: "POST",
    headers: getAuthHeaders()
  });
  return parseResult<{ summary: Record<string, number> }>(response);
}

export async function startEvalRun(evalSetId: string): Promise<{ run_id: string; summary: EvalRun["summary"] }> {
  const response = await fetch(`/api/v1/rag-evaluation/eval-sets/${encodeURIComponent(evalSetId)}/runs/start`, {
    method: "POST",
    headers: getAuthHeaders()
  });
  return parseResult<{ run_id: string; summary: EvalRun["summary"] }>(response);
}

export async function listEvalRuns(evalSetId: string): Promise<EvalRun[]> {
  const response = await fetch(`/api/v1/rag-evaluation/eval-sets/${encodeURIComponent(evalSetId)}/runs?limit=20`, {
    headers: getAuthHeaders()
  });
  const data = await parseResult<{ items: EvalRun[] }>(response);
  return data.items ?? [];
}

export async function listEvalRunResults(runId: string): Promise<EvalRunResult[]> {
  const response = await fetch(`/api/v1/rag-evaluation/runs/${encodeURIComponent(runId)}/results?page=1&page_size=50`, {
    headers: getAuthHeaders()
  });
  const data = await parseResult<{ items: EvalRunResult[] }>(response);
  return data.items ?? [];
}
