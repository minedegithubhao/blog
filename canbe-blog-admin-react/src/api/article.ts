import request from "@/utils/request";

export const getArtilePageService = (queryParams: SysArticleQueryParams): Promise<Page<SysArticle>> => {
  return request.get("/sysArticle/page", { params: queryParams });
};

export const saveArticleService = (article: SysArticle): Promise<SysArticle> => {
  return request.post("/sysArticle/saveOrUpdate", article);
};

export const deleteArticleService = (id: number): Promise<void> => {
  return request.delete(`/sysArticle/delete/${id}`);
};

export const getArticleByIdService = (id: number): Promise<Result<SysArticle>> => {
  return request.get(`/sysArticle/get/${id}`);
};
