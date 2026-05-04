import type { Metadata } from "next";
import { AdminAccountManagementPage } from "@/modules/user/components/admin-account-management-page";

export const metadata: Metadata = {
  title: "用户管理 | Canbe Blog",
  description: "Canbe Blog 后台用户管理"
};

export default function DashboardUsersPage() {
  return <AdminAccountManagementPage />;
}
