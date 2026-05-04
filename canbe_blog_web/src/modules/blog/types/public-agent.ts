export type PublicAgent = {
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

export type AgentChatRequest = {
  query: string;
  sessionId: string;
  topK: number;
};

export type AgentChatResponse = {
  sessionId: string;
  answer: string;
  confidence?: number;
  sources?: Array<{
    id?: string;
    title?: string;
    category?: string;
    source?: string;
    sourceUrl?: string;
    score?: number;
  }>;
  suggestedQuestions?: string[];
  fallback?: boolean;
  traceId?: string;
  quotaUsed?: number;
};
