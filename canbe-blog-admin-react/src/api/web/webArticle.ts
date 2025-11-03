import request from "@/utils/request";
export const getWebArtilePageService = (queryParams: SysArticleQueryParams): Promise<Page<SysArticle>> => {
  return request.get("/public/sysArticle/page", { params: queryParams });
};
export const getWebArticleByIdService = (id: number): Promise<Result<SysArticle>> => {
  return request.get(`/public/sysArticle/get/${id}`);
};
