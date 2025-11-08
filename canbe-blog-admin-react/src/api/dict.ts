import request from "@/utils/request";

export const dictPageService = ( params: SysTagQueryParams ): Promise<Page<SysDict>> => {
  return request.get("/sys/sysDict/page", { params });
};

export const dictSaveService = ( data: SysDict ): Promise<Result<SysDict>> => {
  return request.post("/sys/sysDict/saveOrUpdate", data);
};

export const dictDeleteService = ( id: number ): Promise<Result<string>> => {
  return request.delete(`/sys/sysDict/delete/${id}`);
};
