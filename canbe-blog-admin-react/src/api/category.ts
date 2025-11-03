import request from "@/utils/request";

export const categoryPageService = (params: SysCategoryQueryParams): Promise<Page<SysCategory>> => {
  return request.get("/sys/sysCategory/page", { params });
};

export const categoryListService = (): Promise<Result<SysCategory[]>> => {
  return request.get("/sys/sysCategory/list");
};

export const saveCategoryService = (data: SysCategory): Promise<Result<SysCategory>> => {
  return request.post("/sys/sysCategory/saveOrUpdate", data);
};

export const deleteCategoryService = (id: number): Promise<Result<string>> => {
  return request.delete(`/sys/sysCategory/delete/${id}`);
};
