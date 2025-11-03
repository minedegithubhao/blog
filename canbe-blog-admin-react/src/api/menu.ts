import request from "@/utils/request";

// 使用db.json中的mock数据

export const getMenuListService = (): Promise<Result> => {
  return request.get("/sys/sysMenu/getMenuList");
};
