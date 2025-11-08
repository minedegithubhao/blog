interface Page<T> {
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
