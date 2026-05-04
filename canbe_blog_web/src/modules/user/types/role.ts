export type Role = {
  id: number;
  name: string;
  code: string;
  description: string;
  status: number;
  gmtCreate: string;
  gmtModified: string;
};

export type RoleQuery = {
  page: number;
  pageSize: number;
  name?: string;
  status?: number;
};

export type RoleCreatePayload = {
  name: string;
  code: string;
  description?: string;
  status: number;
};

export type RoleUpdatePayload = RoleCreatePayload;
