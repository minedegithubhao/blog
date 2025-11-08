interface SysMenu {
  id: number;
  parentId: string;
  path: string;
  component: string;
  title: string;
  sort: number;
  icon: string;
  type: string;
  createTime: string;
  updateTime: string;
  redirect: string;
  name: string;
  hidden: number;
  perm: string;
  isExternal: number;
}

interface SysMenuQueryParams extends PageParams {
  name?: string;
}
