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
  return state === 0 ? { text: "正常", color: "success" } : { text: "禁用", color: "warning" };
};

/**
 * 文章状态映射
 * @param state 状态代码
 * @returns 对应的状态文本
 */
export const getArticleStateDisplay = (state: number) => {
  return state === 0 ?  { text: "发布", color: "success" } : { text: "草稿", color: "warning" };
};

export const rowClassName = (record, index: number) => {
  // 斑马纹样式
  const baseClass = index % 2 === 0 ? "table-row-light" : "table-row-dark";
  // 添加垂直居中样式
  return `${baseClass} table-cell-vertical-center`;
};

