import type { Metadata } from "next";
import { RegisterPageView } from "@/modules/auth/components/register-page-view";

export const metadata: Metadata = {
  title: "注册 | Canbe Blog",
  description: "注册 Canbe Blog"
};

export default function RegisterPage() {
  return <RegisterPageView />;
}
