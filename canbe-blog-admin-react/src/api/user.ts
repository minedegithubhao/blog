import request from "@/utils/request";

export const getUserListService = (queryParams: UserQueryParams): Promise<Page<SysUser>> => {
  return request.get("/sysUser/page", { params: queryParams });
};
