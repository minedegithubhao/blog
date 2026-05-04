export type PublicArticle = {
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
  gmtCreate: string | null;
  gmtModified: string | null;
};
