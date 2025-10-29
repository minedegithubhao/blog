/**
 * 表单布局配置
 */
export const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

/**
 * 查询表单布局配置
 */
export const queryFormLayout = {
  ...formLayout,
  layout: "inline" as const,
};

/**
 * 性别映射
 * @param sex 性别代码
 * @returns 对应的性别标签和颜色
 */
export const getSexDisplay = (sex: number) => {
  switch (sex) {
    case 0:
      return { text: "男", color: "blue" };
    case 1:
      return { text: "女", color: "pink" };
    default:
      return { text: "未知", color: "default" };
  }
};

/**
 * 用户状态映射
 * @param state 状态代码
 * @returns 对应的状态文本
 */
export const getUserStateDisplay = (state: number) => {
  return state === 1 ? "正常" : "禁用";
};

/**
 * 删除状态映射
 * @param delFlag 删除状态代码
 * @returns 对应的删除状态文本
 */
export const getDelFlagDisplay = (delFlag: number) => {
  return delFlag === 1 ? "已删除" : "正常";
};

export const rowClassName = (record, index: number) => {
  // 斑马纹样式
  const baseClass = index % 2 === 0 ? "table-row-light" : "table-row-dark";
  // 添加垂直居中样式
  return `${baseClass} table-cell-vertical-center`;
};

/**
 * 表格公共属性配置
 */
export const tableCommonProps = {
  rowKey: "id",
  scroll: { y: 55 * 8, x: "max-content" }, // 设置表格高度，固定表头，x: 'max-content'隐藏横向滚动条
  rowClassName: (record: any, index: number) => rowClassName(record, index),
};
