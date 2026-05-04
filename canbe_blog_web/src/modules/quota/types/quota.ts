export type UserAgentQuota = {
  id: number;
  userId: number;
  username: string;
  agentId: number;
  agentName: string;
  totalQuota: number;
  usedQuota: number;
  remainingQuota: number;
  gmtCreate: string | null;
  gmtModified: string | null;
};

export type UserAgentQuotaQuery = {
  page: number;
  pageSize: number;
  userId?: number;
  agentId?: number;
};

export type UserAgentQuotaPayload = {
  totalQuota: number;
};

export type RoleAgentPolicy = {
  id: number;
  roleCode: string;
  agentId: number;
  agentName: string;
  enabled: number;
  totalQuota: number;
  gmtCreate: string | null;
  gmtModified: string | null;
};

export type RoleAgentPolicyQuery = {
  page: number;
  pageSize: number;
  roleCode?: string;
  agentId?: number;
};

export type RoleAgentPolicyPayload = {
  enabled: number;
  totalQuota: number;
};
