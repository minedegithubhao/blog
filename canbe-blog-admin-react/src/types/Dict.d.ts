interface SysDict {
  id: number;
  name: string;
  type: string;
  status: number;
  remark: string;
  createTime: string;
  updateTime: string;
  sort: number;
}

interface SysDictQueryParams extends PageParams {
  name?: string;
  type?: string;
}
