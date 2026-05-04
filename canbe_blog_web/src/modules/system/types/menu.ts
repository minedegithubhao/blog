export type MenuItem = {
  id: number;
  parentId: number;
  name: string;
  title: string;
  path: string;
  component: string;
  icon: string;
  type: string;
  permission: string;
  sortOrder: number;
  visible: number;
  status: number;
  gmtCreate: string;
  gmtModified: string;
};

export type MenuTreeNode = MenuItem & {
  children: MenuTreeNode[];
};

export type MenuQuery = {
  page: number;
  pageSize: number;
  title?: string;
  status?: number;
};

export type MenuPayload = {
  parentId: number;
  name: string;
  title: string;
  path: string;
  component: string;
  icon: string;
  type: string;
  permission: string;
  sortOrder: number;
  visible: number;
  status: number;
};
