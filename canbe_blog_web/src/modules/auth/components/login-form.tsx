"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { login } from "../api/auth-api";
import { saveLoginSession } from "../utils/auth-storage";

export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      const loginResponse = await login({
        username: String(formData.get("username") || "").trim(),
        password: String(formData.get("password") || ""),
        rememberMe: false
      });
      saveLoginSession(loginResponse);
      toast.success("登录成功");
      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get("redirect");
      const safeRedirect = redirect?.startsWith("/") ? redirect : "";
      router.push(safeRedirect || (loginResponse.user.roleCode === "ADMIN" ? "/dashboard" : "/me"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "登录失败");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="username">用户名</Label>
        <Input id="username" name="username" type="text" autoComplete="username" placeholder="请输入用户名" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">密码</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="请输入密码"
            className="pr-10"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={showPassword ? "隐藏密码" : "显示密码"}
            className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-primary"
            onClick={() => setShowPassword((current) => !current)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <Link href="/register" className="text-sm text-primary">
          注册账号
        </Link>
      </div>

      <Button type="submit" className="h-10 w-full cursor-pointer" disabled={isSubmitting}>
        {isSubmitting ? "登录中..." : "登录"}
      </Button>
    </form>
  );
}
