export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  status: number;
  gmtCreate: string;
  gmtModified: string;
};

export type CategoryQuery = {
  page: number;
  pageSize: number;
  name?: string;
  status?: number;
};

export type CategoryPayload = {
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
  status: number;
};
