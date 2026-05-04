export type Tag = {
  id: number;
  name: string;
  slug: string;
  gmtCreate: string;
  gmtModified: string;
};

export type TagQuery = {
  page: number;
  pageSize: number;
  name?: string;
};

export type TagPayload = {
  name: string;
  slug: string;
};
