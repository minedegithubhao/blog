import { AuthPageShell } from "./auth-page-shell";
import { RegisterForm } from "./register-form";

export function RegisterPageView() {
  return (
    <AuthPageShell
      title="创建账号"
      description="注册后即可登录前台，并体验 Agent 能力。"
      asideTitle="注册博客账号，管理你的内容与 AI 体验入口。"
      asideDescription="前台博客默认可匿名浏览，注册登录后可进入 Agent 专栏、查看个人信息，并逐步接入更多个性化能力。"
    >
      <RegisterForm />
    </AuthPageShell>
  );
}
