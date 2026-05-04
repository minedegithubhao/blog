import type { Metadata } from "next";
import { MenuManagementPage } from "@/modules/system/components/menu-management-page";

export const metadata: Metadata = {
  title: "菜单管理 | Canbe Blog",
  description: "Canbe Blog 后台菜单管理"
};

export default function DashboardMenusPage() {
  return <MenuManagementPage />;
}
