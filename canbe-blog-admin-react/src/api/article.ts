import request from "@/utils/request";

export const getArtilePageService = (queryParams: SysArticleQueryParams): Promise<Page<SysArticle>> => {
  return request.get("/sys/sysArticle/page", { params: queryParams });
};

export const saveArticleService = (article: SysArticle): Promise<SysArticle> => {
  return request.post("/sys/sysArticle/saveOrUpdate", article);
};

export const deleteArticleService = (id: number): Promise<void> => {
  return request.delete(`/sys/sysArticle/delete/${id}`);
};

export const getArticleByIdService = (id: number): Promise<Result<SysArticle>> => {
  return request.get(`/sys/sysArticle/get/${id}`);
};
