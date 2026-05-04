import { LoginForm } from "./login-form";
import { AuthPageShell } from "./auth-page-shell";

export function LoginPageView() {
  return (
    <AuthPageShell
      title="欢迎回来"
      description="输入账号和密码进入博客管理系统。"
      asideTitle="使用统一的轻量前端体系管理博客内容。"
      asideDescription="shadcn、Radix、Tailwind 和 lucide 作为统一 UI 基础，减少后台与前台的重复依赖。"
    >
      <LoginForm />
    </AuthPageShell>
  );
}
