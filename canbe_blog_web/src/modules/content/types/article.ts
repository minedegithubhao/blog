export type Article = {
  id: number;
  title: string;
  summary: string;
  content: string;
  coverUrl: string;
  categoryId: number;
  categoryName: string;
  tagIds: number[];
  tagNames: string[];
  status: number;
  gmtCreate: string;
  gmtModified: string;
};

export type ArticleQuery = {
  page: number;
  pageSize: number;
  title?: string;
  categoryId?: number;
  tagId?: number;
  status?: number;
};

export type ArticlePayload = {
  title: string;
  summary?: string;
  content: string;
  coverUrl?: string;
  categoryId: number;
  tagIds: number[];
  status: number;
};
