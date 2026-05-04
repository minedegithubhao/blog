export type AgentCallRecord = {
  id: number;
  userId: number;
  agentId: number;
  username: string;
  agentName: string;
  prompt: string;
  responseText: string | null;
  status: "SUCCESS" | "FAILED" | "TIMEOUT" | "INTERRUPTED" | string;
  errorCode: string;
  errorMessage: string;
  durationMs: number;
  gmtCreate: string | null;
  gmtModified: string | null;
};

export type AgentCallRecordQuery = {
  page: number;
  pageSize: number;
  userId?: number;
  agentId?: number;
  status?: string;
};
