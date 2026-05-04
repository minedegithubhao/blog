export type DictItem = {
  id: number;
  typeCode: string;
  typeName: string;
  itemLabel: string;
  itemValue: string;
  sortOrder: number;
  status: number;
  remark: string;
  gmtCreate: string;
  gmtModified: string;
};

export type DictItemQuery = {
  page: number;
  pageSize: number;
  typeCode?: string;
  itemLabel?: string;
  status?: number;
};

export type DictItemPayload = {
  typeCode: string;
  typeName: string;
  itemLabel: string;
  itemValue: string;
  sortOrder: number;
  status: number;
  remark?: string;
};
