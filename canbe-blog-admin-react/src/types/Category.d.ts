interface SysCategory {
  id: number;
  name: string;
  sort: number;
  createTime: string;
  updateTime: string;
}

interface SysCategoryQueryParams {
  name: string;
  pageNum: number;
  pageSize: number;
}
