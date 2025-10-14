type Result<T = any> = {
  /** 状态码,0-成功,1-失败  */
  code: number;
  /** 提示信息 */
  message: string;
  /** 数据 */
  data: T;
};
