import request from "@/utils/request";

export const articleListService = (params : any) => {
  return request.get('/public/article/list', {params : params})
}

export const articleDetailService = (id : any) => {
  return request.get('/public/article/detail?id='+id)
}

export const articleCategoryService = () => {
  return request.get('/public/article/category')
}
