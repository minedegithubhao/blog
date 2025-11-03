import request from "@/utils/request";

export const webCategoryListService = (): Promise<Result<SysCategory[]>> => {
  return request.get("/public/sysCategory/list");
};
