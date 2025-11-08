interface SysTag {
  id: number;
  name: string;
  sort: number;
  createTime: string;
  updateTime: string;
}

interface SysCategoryQueryParams extends PageParams {
  name: string;
}
