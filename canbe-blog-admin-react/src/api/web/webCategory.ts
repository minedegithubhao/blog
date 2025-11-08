import request from "@/utils/request";

export const webCategoryListService = (): Promise<Result<SysTag[]>> => {
  return request.get("/public/sysCategory/list");
};
