import request from "@/utils/request";

export const categoryPageService = (params: SysCategoryQueryParams): Promise<Page<SysCategory>> => {
  return request.get("/sysCategory/page", { params });
};

export const categoryListService = (): Promise<Result<SysCategory[]>> => {
  return request.get("/sysCategory/list");
};

export const saveCategoryService = (data: SysCategory): Promise<Result<SysCategory>> => {
  return request.post("/sysCategory/saveOrUpdate", data);
};

export const deleteCategoryService = (id: number): Promise<Result<string>> => {
  return request.delete(`/sysCategory/delete/${id}`);
};
