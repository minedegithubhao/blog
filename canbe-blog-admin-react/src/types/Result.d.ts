type Result<T = unknown> = {
  /** 状态码,0-成功,1-失败  */
  code: number;
  /** 提示信息 */
  message: string;
  /** 数据 */
  data: T;
};

type Page<T> = {
  /** 状态码,0-成功,1-失败  */
  code: number;
  /** 提示信息 */
  message: string;
  data: {
    /** 数据 */
    records: T[];
    /** 当前页码 */
    current: number;
    /** 每页条数 */
    size: number;
    /** 总数 */
    total: number;
    /** 总页数 */
    pages: number;
  };
};

enum DelFlagStatus {
  /** 正常 */
  normal = 0,
  /** 已删除 */
  deleted = 1,
}

interface CommonField {
  /** 创建人ID */
  createUser: string;
  /** 创建人名称 */
  createUsername: string;
  /** 创建时间 */
  createTime: string;
  /** 更新人 */
  updateUser: string;
  /** 更新人名称 */
  updateUsername: string;
  /** 更新时间 */
  updateTime: string;
  /** 删除标记 */
  delFlag: DelFlagStatus;
}


/**
 * 登录模型
 */
interface LoginModel {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 确认密码 */
  rePassword?: string;
  /** 验证码 */
  captcha?: string;
  /** 验证码唯一标识 */
  uuid?: string;
}

interface MenuItem {
  key: string;
  label: string;
  icon: string;
  children: MenuItem[];
}

// 定义 store 类型
interface RootStore {
  tab: {
    isCollapse: boolean;
  };
}
