export type FileRecord = {
  id: number;
  filename: string;
  storedName: string;
  relativePath: string;
  url: string;
  size: number;
  contentType: string;
  gmtCreate: string;
  gmtModified: string;
};

export type FileQuery = {
  page: number;
  pageSize: number;
  filename?: string;
  contentType?: string;
};
