"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { logout } from "../api/auth-api";
import { clearLoginSession, getStoredUser } from "../utils/auth-storage";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();

  async function handleLogout() {
    const currentUser = getStoredUser();
    try {
      await logout();
      toast.success("已退出登录");
    } catch (error) {
      toast.warning(error instanceof Error ? error.message : "退出请求失败，已清理本地登录状态");
    } finally {
      if (currentUser?.id) {
        window.localStorage.removeItem(`canbe_blog_tabs_${currentUser.id}`);
      }
      clearLoginSession();
      router.replace("/login");
    }
  }

  return (
    <Button type="button" variant="outline" size={compact ? "sm" : "default"} className="cursor-pointer gap-2" onClick={handleLogout}>
      <LogOut className="h-4 w-4" aria-hidden="true" />
      退出
    </Button>
  );
}
