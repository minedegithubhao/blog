export type Distribution = Record<string, number>;

export type EvalSetSummary = {
  total?: number;
};

export type EvalSet = {
  eval_set_id: string;
  name: string;
  source_path?: string;
  source_hash?: string;
  created_at?: string;
  created_by?: string;
  summary?: EvalSetSummary;
  config?: Record<string, unknown>;
};

export type EvalRunConfig = {
  configured_k: number;
  retrieval_top_n: number;
  similarity_threshold: number;
  rerank_enabled: boolean;
};

export type EvalRunSummary = {
  total: number;
  recall_at_k?: number;
  ndcg_at_k?: number;
  filtered_precision?: number;
  filtered_recall?: number;
  filtered_avg_k?: number;
  filtered_empty_context_rate?: number;
  success_rate?: number;
  error_count?: number;
  hit_at_k?: number;
  precision_at_configured_k?: number;
};

export type EvalRunProgress = {
  completed_cases: number;
  total_cases: number;
  percent: number;
  updated_at?: string;
};

export type EvalRunTiming = {
  total_ms: number;
  retrieve_ms: number;
  commit_ms: number;
  summary_ms: number;
  cases: number;
};

export type EvalRun = {
  run_id: string;
  eval_set_id: string;
  status?: "running" | "completed" | "failed";
  rag_config?: EvalRunConfig;
  created_at?: string;
  summary: EvalRunSummary;
  progress?: EvalRunProgress;
  started_at?: string;
  completed_at?: string;
  timing?: EvalRunTiming;
};

export type RetrievedContext = {
  chunk_id: string;
  parent_faq_id?: string;
  score?: number;
  matched?: boolean;
  content?: string;
  source_url?: string;
};

export type EvalRunDiagnostics = {
  configured_k: number;
  effective_k: number;
  similarity_threshold: number;
  expected_chunk_ids: string[];
  top_k_chunk_ids?: string[];
  retrieved_chunk_ids: string[];
  matched_chunk_ids: string[];
  top_k_matched_chunk_ids?: string[];
  retrieved_contexts?: RetrievedContext[];
  failure_reasons?: string[];
};

export type EvalCaseMetrics = {
  recall_at_k?: number;
  ndcg_at_k?: number;
  filtered_precision?: number;
  filtered_recall?: number;
  filtered_avg_k?: number;
  filtered_empty_context_rate?: number;
  success_rate?: number;
  error_count?: number;
  hit_at_k?: number;
  precision_at_configured_k?: number;
};

export type EvalRunResult = {
  case_id: string;
  question: string;
  eval_type: "single_chunk" | "multi_chunk";
  question_style: string;
  difficulty: string;
  category: string;
  metrics: EvalCaseMetrics;
  diagnostics: EvalRunDiagnostics;
  created_at?: string;
};

export type EvalSetGeneratePayload = {
  name: string;
  total_count: number;
  source_path: string;
  eval_type_distribution: Distribution;
  question_style_distribution: Distribution;
  difficulty_distribution: Distribution;
  category_distribution: Distribution;
};

export type EvalSetGenerateResponse = {
  ok: boolean;
  eval_set_id: string;
  summary: EvalSetSummary;
};

export type EvalSetDeleteResponse = {
  ok: boolean;
  eval_set_id: string;
  deleted_eval_sets: number;
  deleted_cases: number;
  deleted_runs: number;
  deleted_run_results: number;
};
