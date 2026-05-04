export type Agent = {
  id: number;
  name: string;
  code: string;
  description: string;
  avatarUrl: string;
  runtimeUrl: string;
  embedUrl: string;
  providerType: "CUSTOM" | "DIFY" | string;
  apiUrl: string;
  responseMode: string;
  apiKeyConfigured: boolean;
  status: number;
  sortOrder: number;
  gmtCreate: string | null;
  gmtModified: string | null;
};

export type AgentPayload = {
  name: string;
  code: string;
  description: string;
  avatarUrl: string;
  runtimeUrl: string;
  embedUrl: string;
  providerType: "CUSTOM" | "DIFY" | string;
  apiUrl: string;
  apiKey: string;
  responseMode: string;
  status: number;
  sortOrder: number;
};

export type AgentQuery = {
  page: number;
  pageSize: number;
  name?: string;
  status?: number;
};

export type ConnectionTestResult = {
  success: boolean;
  latencyMs: number | null;
  errorCode: string | null;
  errorMessage: string | null;
};
