interface SysUser {
  id: number;
  username: string;
  password: string;
  createTime: string;
  updateTime: string;
  status: number;
  ip: string;
  ipLocation: string;
  os: string;
  lastLoginTime: string;
  browser: string;
  nickname: string;
  avatar: string;
  mobile: string;
  email: null;
  sex: number;
  loginType: string;
  signature: null;
}

interface UserQueryParams extends PageParams {
  username?: string;
  state?: string;
};

