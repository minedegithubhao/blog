export type AdminAccount = {
  id: number;
  username: string;
  email: string | null;
  nickname: string;
  roleCode: "ADMIN" | "USER";
  status: number;
  lastLoginAt: string | null;
  gmtCreate: string;
  gmtModified: string;
};

export type AdminAccountQuery = {
  page: number;
  pageSize: number;
  username?: string;
  status?: number;
};

export type AdminAccountCreatePayload = {
  username: string;
  password: string;
  email?: string | null;
  nickname: string;
  roleCode: "ADMIN" | "USER";
  status: number;
};

export type AdminAccountUpdatePayload = {
  email?: string | null;
  nickname: string;
  roleCode: "ADMIN" | "USER";
  status: number;
};
