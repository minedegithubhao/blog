interface SysTag {
  id: number;
  name: string;
  sort: number;
  createTime: string;
  updateTime: string;
}

interface SysTagQueryParams extends PageParams {
  name?: string;
}
