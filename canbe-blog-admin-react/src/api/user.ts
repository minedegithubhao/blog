import request from "@/utils/request";

export const getUserListService = (queryParams: UserQueryParams): Promise<Page<SysUser>> => {
  return request.get("/sys/sysUser/page", { params: queryParams });
};
