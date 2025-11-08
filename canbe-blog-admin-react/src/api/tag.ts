import request from "@/utils/request";

export const getTagListService = (params: SysTagQueryParams): Promise<Page<SysTag>> => {
  return request.get("/sys/sysTag/list",{ params });
};

export const deleteTagService = (id: number): Promise<void> => {
  return request.delete(`/sys/sysTag/delete/${id}`);
};

export const saveTagService = (data: SysTag): Promise<Result<SysTag>> => {
  return request.post("/sys/sysTag/saveOrUpdate", data);
};
