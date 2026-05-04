export type LoginPayload = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export type RegisterPayload = {
  username: string;
  password: string;
  nickname: string;
};

export type CurrentUser = {
  id: number;
  username: string;
  nickname: string;
  roleCode: string;
};

export type LoginResponse = {
  token: string;
  expiresIn: number;
  user: CurrentUser;
};
