import request from "@/utils/request";

export const dictDataPageService = (params: SysDictDataQueryParams): Promise<Page<SysDictData>> => {
  return request.get("/sys/sysDictData/page", { params });
};

export const dickDataSaveService = (params: SysDictData): Promise<Result<SysDictData>> => {
  return request.post("/sys/sysDictData/saveOrUpdate", params);
};

export const dictDataDeleteService = (id: number): Promise<Result<string>> => {
  return request.delete(`/sys/sysDictData/delete/${id}`);
};
