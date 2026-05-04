import type { MenuTreeNode } from "@/modules/system/types/menu";

export type CurrentUserNavigation = {
  menus: MenuTreeNode[];
  permissions: string[];
};
