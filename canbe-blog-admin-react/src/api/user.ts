import request from "@/utils/request";

export const getUserListService = (queryParams: UserQueryParams): Promise<Page<SysUser>> => {
  return request.get("/sys/sysUser/page", { params: queryParams });
};

export const deleteUserService = (id: number): Promise<Result> => {
  return request.delete(`/sys/sysUser/delete/${id}`);
};

export const saveUserService = (user: SysUser): Promise<Result<string>> => {
  return request.post("/sys/sysUser/saveOrUpdate", user);
};
