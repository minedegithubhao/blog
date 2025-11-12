interface SysArticle {
  id: number;
  userId: number;
  categoryId: number;
  categoryName: string;
  title: string;
  cover: string;
  summary: string;
  content: string;
  contentMd: string;
  readType: number;
  isStick: number;
  status: number;
  isOriginal: number;
  isCarousel: number;
  isRecommend: number;
  originalUrl: null;
  quantity: number;
  keywords: null;
  aiDescribe: null;
  createTime: string;
  updateTime: string;
  userNickName: string;
}

interface SysArticleQueryParams extends PageParams {
  title: string;
  categoryId: string;
  tag: string;
}
