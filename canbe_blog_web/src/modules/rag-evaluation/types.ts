export type EvalSetSummary = {
  total?: number;
  validated?: number;
  needs_review?: number;
  rejected?: number;
};

export type EvalSet = {
  eval_set_id: string;
  name: string;
  status?: string;
  source_path?: string;
  source_hash?: string;
  created_at?: string;
  summary?: EvalSetSummary;
};

export type EvalRunSummary = {
  total: number;
  passed: number;
  passRate: number;
  answerableHitRate: number;
  fallbackRate: number;
  sourceCompletenessRate: number;
  overreachViolations: number;
};

export type EvalRun = {
  run_id: string;
  eval_set_id: string;
  status: string;
  created_at?: string;
  summary: EvalRunSummary;
};

export type EvalRunResult = {
  case_id: string;
  case_type: string;
  query: string;
  ok: boolean;
  fallback: boolean;
  confidence: number;
  source_count: number;
  source_url_ok: boolean;
  overreach_violation: boolean;
  failure_reasons: string[];
  trace_id?: string;
};

export type EvalSetGeneratePayload = {
  name: string;
  total_count: number;
  seed: number;
};
