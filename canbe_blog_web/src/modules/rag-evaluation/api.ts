import type { ApiResult } from "@/types/api";
import { getAuthHeaders } from "@/modules/auth/utils/auth-storage";
import type { EvalRun, EvalRunConfig, EvalRunResult, EvalSet, EvalSetDeleteResponse, EvalSetGeneratePayload, EvalSetGenerateResponse } from "./types";

async function parseResult<T>(response: Response): Promise<T> {
  const result = (await response.json()) as ApiResult<T> | ({ code?: string; message?: string } & T);
  if (!response.ok) {
    const message = "message" in result && typeof result.message === "string" ? result.message : "请求失败";
    throw new Error(message);
  }
  if ("code" in result && typeof result.code === "number" && result.code !== 200) {
    throw new Error(result.message || "请求失败");
  }
  return "data" in result ? (result.data as T) : (result as T);
}

export async function listEvalSets(params: { limit?: number; skip?: number } = {}): Promise<EvalSet[]> {
  const searchParams = new URLSearchParams({
    limit: String(params.limit ?? 200),
    skip: String(params.skip ?? 0)
  });
  const response = await fetch(`/api/v1/rag-evaluation/eval-sets?${searchParams.toString()}`, {
    headers: getAuthHeaders()
  });
  const data = await parseResult<{ items: EvalSet[] }>(response);
  return data.items ?? [];
}

export async function generateEvalSet(payload: EvalSetGeneratePayload): Promise<EvalSetGenerateResponse> {
  const response = await fetch("/api/v1/rag-evaluation/eval-sets/generate", {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload)
  });
  return parseResult<EvalSetGenerateResponse>(response);
}

export async function deleteEvalSet(evalSetId: string): Promise<EvalSetDeleteResponse> {
  const response = await fetch(`/api/v1/rag-evaluation/eval-sets/${encodeURIComponent(evalSetId)}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  return parseResult<EvalSetDeleteResponse>(response);
}

export async function startEvalRun(evalSetId: string, config: EvalRunConfig): Promise<{ run_id: string; summary: EvalRun["summary"] }> {
  const response = await fetch(`/api/v1/rag-evaluation/eval-sets/${encodeURIComponent(evalSetId)}/runs/start`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(config)
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

export async function getEvalRun(runId: string): Promise<EvalRun> {
  const response = await fetch(`/api/v1/rag-evaluation/eval-runs/${encodeURIComponent(runId)}`, {
    headers: getAuthHeaders()
  });
  return parseResult<EvalRun>(response);
}

export async function listEvalRunResults(runId: string): Promise<EvalRunResult[]> {
  const response = await fetch(`/api/v1/rag-evaluation/eval-runs/${encodeURIComponent(runId)}/results?page=1&page_size=100`, {
    headers: getAuthHeaders()
  });
  const data = await parseResult<{ items: EvalRunResult[] }>(response);
  return data.items ?? [];
}
