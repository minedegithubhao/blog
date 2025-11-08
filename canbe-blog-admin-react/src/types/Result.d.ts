type Result<T = unknown> = {
  /** 状态码,0-成功,1-失败  */
  code: number;
  /** 提示信息 */
  message: string;
  /** 数据 */
  data: T;
};

enum DelFlagStatus {
  /** 正常 */
  normal = 0,
  /** 已删除 */
  deleted = 1,
}

interface MenuItem {
  key: string;
  label: string;
  icon: string;
  children: MenuItem[];
}
