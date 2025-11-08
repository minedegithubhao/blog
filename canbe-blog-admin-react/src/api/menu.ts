import request from "@/utils/request";

export const getMenuTreeService = (): Promise<Result> => {
  return request.get("/sys/sysMenu/getMenuTree");
};

export const getMenuPageService = (params: SysMenuQueryParams): Promise<Page<SysMenu>> => {
  return request.get("/sys/sysMenu/page", { params });
};

export const deleteMenuService = (id: number): Promise<SysMenu> => {
  return request.delete(`/sys/sysMenu/delete/${id}`);
};

export const saveMenuService = (params: SysMenu): Promise<SysMenu> => {
  return request.post("/sys/sysMenu/saveOrUpdate", params);
};
