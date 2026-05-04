"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "../api/auth-api";

export function RegisterForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") || "").trim();
    const nickname = String(formData.get("nickname") || "").trim();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    try {
      if (!/^[A-Za-z0-9_]{4,20}$/.test(username)) {
        throw new Error("用户名只允许字母、数字、下划线，长度 4 到 20 位");
      }
      if (!nickname) {
        throw new Error("昵称不能为空");
      }
      if (nickname.length > 20) {
        throw new Error("昵称长度不能超过 20 位");
      }
      if (password.length < 6) {
        throw new Error("密码长度不能少于 6 位");
      }
      if (password !== confirmPassword) {
        throw new Error("两次输入的密码不一致");
      }

      await register({ username, password, nickname });
      toast.success("注册成功，请使用新账号登录");
      router.push("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "注册失败");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="username">用户名</Label>
        <Input id="username" name="username" type="text" autoComplete="username" placeholder="4-20位字母、数字或下划线" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nickname">昵称</Label>
        <Input id="nickname" name="nickname" type="text" placeholder="请输入昵称" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">密码</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="至少 6 位"
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">确认密码</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="请再次输入密码"
            className="pr-10"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={showConfirmPassword ? "隐藏确认密码" : "显示确认密码"}
            className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-primary"
            onClick={() => setShowConfirmPassword((current) => !current)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <Link href="/login" className="text-sm text-primary">
          已有账号？去登录
        </Link>
      </div>

      <Button type="submit" className="h-10 w-full cursor-pointer" disabled={isSubmitting}>
        {isSubmitting ? "注册中..." : "注册"}
      </Button>
    </form>
  );
}
