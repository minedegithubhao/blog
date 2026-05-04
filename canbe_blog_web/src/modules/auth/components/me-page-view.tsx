"use client";

import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { toast } from "sonner";
import { getCurrentUser } from "../api/auth-api";
import type { CurrentUser } from "../types/auth";
import { LogoutButton } from "./logout-button";

export function MePageView() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "请先登录");
      } finally {
        setLoading(false);
      }
    }

    void loadUser();
  }, []);

  return (
    <main className="min-h-svh bg-[#f5f7f4] text-[#1b2520]">
      <section className="border-b border-[#d7ded7] bg-white px-6 py-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#1d6b58]">Account</p>
            <h1 className="mt-2 text-3xl font-semibold">个人中心</h1>
          </div>
          <LogoutButton />
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-6 py-8">
        <div className="border border-[#d7ded7] bg-white p-6">
          {user ? (
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center bg-[#edf2ee]">
                <UserRound className="h-6 w-6 text-[#1d6b58]" aria-hidden="true" />
              </div>
              <div className="space-y-2 text-sm">
                <h2 className="text-lg font-semibold">{user.nickname || user.username}</h2>
                <p className="text-[#65736d]">账号：{user.username}</p>
                <p className="text-[#65736d]">角色：{user.roleCode}</p>
              </div>
            </div>
          ) : loading ? (
            <p className="text-sm text-[#65736d]">正在加载登录用户...</p>
          ) : (
            <p className="text-sm text-[#65736d]">未获取到用户信息</p>
          )}
        </div>
      </section>
    </main>
  );
}
