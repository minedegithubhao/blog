import type { Metadata } from "next";
import { LoginPageView } from "@/modules/auth/components/login-page-view";

export const metadata: Metadata = {
  title: "登录 | Canbe Blog",
  description: "登录 Canbe Blog"
};

export default function LoginPage() {
  return <LoginPageView />;
}
