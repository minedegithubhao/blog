import request from "@/utils/request";

// 管理端接口
export const articleCategoryService = () => {
  return request.get("/category");
};

export const articleCategoryAddService = (categoryModel: any) => {
  return request.post("/category", categoryModel);
};

export const aritcleCategoryUpdateService = (categoryModel: any) => {
  return request.put("/category", categoryModel);
};

export const articleCategoryDeleteService = (id: number) => {
  return request.delete("/category?id=" + id);
};

export const articleListService = (params: any) => {
  return request.get("/article", { params: params });
};

export const articleAddService = (articleModel: any) => {
  return request.post("/article", articleModel);
};

export const articleUpdateService = (articleModel: any) => {
  return request.put("/article", articleModel);
};

// web端接口
export const publicArticleListService = (params: any) => {
  return request.get("/public/article/list", { params: params });
};

export const publicArticleDetailService = (id: any) => {
  return request.get("/public/article/detail?id=" + id);
};

export const publicArticleCategoryService = () => {
  return request.get("/public/article/category");
};
