# Agent Handoff

最后更新：2026-04-24  
工作目录：`D:\IdeaProjects\blog`

## 1. 当前目标与结论

本仓库当前真正要继续推进的前端，不再是 `canbe-blog-admin-react`，而是：

- `blog_web`：新的管理端与博客前台入口，基于 Next.js 15
- `blog-server`：Java 后端

当前阶段的核心结论：

- `/dashboard` 已经从 `AntD + @ant-design/icons + md-editor-rt` 迁移到 `shadcn/Radix + Tailwind + lucide-react`
- `/blog` 前台页面恢复为用户喜欢的 v0 设计布局
- 登录页恢复为 v0 设计，并接回真实登录接口
- 后台一级菜单已经支持折叠/展开，侧边栏整体也支持收起
- 性能优化的主要方向已经落实：去掉双 UI 体系，删除重型依赖，减小后台首包

## 2. 仓库结构与优先级

### 2.1 当前优先处理目录

- `blog_web`
- `blog-server`

### 2.2 低优先级或历史目录

- `canbe-blog-admin-react`
  这是旧 React 管理端，目录里存在历史改动，但当前不再作为主前端继续推进
- `shiyi-blog-master`
  用作布局、字段和菜单设计参考，不直接作为运行项目
- `canbe-blog-admin-web` / `canbe-blog-web`
  仓库里显示为大批删除状态，不要在未确认前擅自恢复或清理

## 3. 已完成改造

### 3.1 `blog_web` 已完成事项

#### 登录页

- 文件：`blog_web/app/page.tsx`
- 状态：已恢复 v0 风格分屏登录页
- 逻辑：真实调用 `POST /public/login`
- 说明：验证码仍沿用后端测试值 `123456`

#### 博客前台 `/blog`

- 文件：
  - `blog_web/app/blog/page.tsx`
  - `blog_web/app/blog/posts/page.tsx`
  - `blog_web/app/blog/posts/[id]/page.tsx`
  - `blog_web/app/blog/agent/page.tsx`
  - `blog_web/app/blog/agent/[id]/page.tsx`
- 状态：已恢复为 v0 原始视觉布局
- 备注：当前重点是保持布局；部分内容仍偏静态展示，这是刻意保留的结果

#### 后台管理 `/dashboard`

- 文件：
  - `blog_web/components/admin-shell.tsx`
  - `blog_web/components/resource-page.tsx`
  - `blog_web/app/dashboard/**`
- 状态：已全部迁移为 Tailwind/shadcn/lucide 体系
- 已移除：
  - `antd`
  - `@ant-design/icons`
  - `md-editor-rt`

#### 菜单折叠

- 文件：`blog_web/components/admin-shell.tsx`
- 功能：
  - 一级分组可折叠：`博客管理`、`系统管理`
  - 侧边栏整体可收起，只保留图标

### 3.2 `blog-server` 已处理事项

#### API 代理约定

- 文件：`blog_web/next.config.mjs`
- 规则：
  - `/api/:path*` -> `http://localhost:8080/:path*`
  - `/public/:path*` -> `http://localhost:8080/public/:path*`

#### 前端 API 封装

- 文件：`blog_web/lib/admin-api.ts`
- 已包含：
  - token 读写
  - 管理端接口
  - public 接口
  - 文件上传 `uploadFile`

#### 数据库兼容脚本

- 文件：`blog-server/src/main/resources/sql/shiyi_compat_migration.sql`
- 作用：
  - 给老库补齐兼容字段
  - 建立 `sys_article_tag`
- 注意：
  - 这个脚本是“补齐脚本”，不是必须每次都执行
  - 当前 `init.sql` 里多数核心字段其实已经存在
  - 未确认数据库状态前，不要直接执行

## 4. 性能优化的关键决策

这部分是后续智能体必须继承的约束。

### 4.1 为什么放弃 AntD

之前后台慢，主要不是接口慢，而是 Next dev 首次编译太重。根因：

- 前台 `/blog` 使用 v0/shadcn/Radix/Tailwind/lucide
- 后台 `/dashboard` 使用 AntD
- 文章页还额外引入 `md-editor-rt`

这是典型的“双 UI 栈 + 重型编辑器”问题。

### 4.2 已采取的性能优化

- 后台统一到 `Tailwind + shadcn/ui + lucide-react`
- 文章编辑器暂时退回到轻量 `textarea`
- 删除 `antd` / `@ant-design/icons` / `md-editor-rt`

### 4.3 优化效果

生产构建结果已经明显缩小。优化前最重页面大致是：

- `/dashboard/articles` 约 `326 kB`

优化后：

- `/dashboard/articles` 约 `4.1 kB`
- `/dashboard/dict` 约 `3.33 kB`
- `/dashboard` 约 `990 B`

说明统一 UI 栈是正确方向，后续不要再引回 AntD。

## 5. 运行方式

### 5.1 推荐命令

前端：

```powershell
cd D:\IdeaProjects\blog\blog_web
pnpm dev
```

生产模式：

```powershell
cd D:\IdeaProjects\blog\blog_web
pnpm build
pnpm start
```

后端：

- 保持 `blog-server` 运行在 `localhost:8080`

### 5.2 为什么优先用 `pnpm`

`blog_web` 当前锁文件是：

- `blog_web/pnpm-lock.yaml`

所以推荐用 `pnpm`，不要混用 `npm` 和 `pnpm`。

## 6. 已验证内容

在当前状态下，以下命令已通过：

```powershell
cd D:\IdeaProjects\blog\blog_web
pnpm exec tsc --noEmit
pnpm build
```

## 7. 已知问题与处理经验

### 7.1 Next dev 缓存损坏

这是最近最常见的问题。

现象：

- 页面 HTML 正常返回 200
- 但 `/_next/static/css/...` 或 `/_next/static/chunks/...` 返回 404
- 浏览器表现为“样式丢失、JS 丢失”

本质：

- `.next` 缓存和当前运行的 `next dev` 进程不同步
- 常见于 dev server 运行时又大改页面、跑 build、或者热更新失败

稳定处理方式：

```powershell
cd D:\IdeaProjects\blog\blog_web
Remove-Item -LiteralPath .next -Recurse -Force
pnpm dev
```

如果怀疑有残留进程，先结束所有 `blog_web` 相关的 `node.exe` / `next dev`。

### 7.2 TypeScript 与 `.next/types`

如果并行执行：

- `pnpm build`
- `pnpm exec tsc --noEmit`

可能出现 `.next/types/**/*.ts` 缺失报错。  
原因不是源码错，而是 `build` 正在刷新 `.next/types`。

处理方式：

- 不要并行跑
- 先 `pnpm build`
- 再单独 `pnpm exec tsc --noEmit`

### 7.3 中文乱码

PowerShell 某些输出会显示中文乱码，但文件本身按 UTF-8 读取通常是正常的。  
不要仅凭 PowerShell 的显示结果判断源码编码损坏。

## 8. 当前页面状态

### 8.1 `/blog`

- 目标：保持 v0 视觉布局
- 当前：已经恢复
- 策略：如果后续接入真实数据，应“保留布局，只改数据来源”

### 8.2 `/dashboard`

当前已覆盖：

- 仪表盘
- 文章管理
- 标签管理
- 分类管理
- 用户管理
- 菜单管理
- 字典管理

这些页面都已经不依赖 AntD。

## 9. 当前功能边界与遗留事项

### 9.1 文章标签关联

当前状态：

- 前端仍保留了文章标签选择位
- 后端尚未完成 `sys_article_tag` 的保存与查询逻辑接入

也就是说：

- 文章保存时不会把 `tagIds` 强行提交到现有 `SysArticle` 实体
- 这是为了避免破坏当前接口

后续如果要补齐，需要同时改：

- 后端实体
- Mapper / Service
- 文章查询 DTO
- 保存逻辑

### 9.2 文章编辑体验

当前为了性能，文章内容编辑已从 Markdown 富编辑器降回 `textarea`。

如果后续要升级编辑体验，建议：

- 优先考虑按需动态加载编辑器
- 不要直接回退到全局静态引入的重型编辑器

### 9.3 字典页与文章页

这两个页面现在是“轻量可用版本”，重点是去依赖和保持功能闭环，不是最终视觉精修版。

## 10. 不要做的事

后续智能体接手时，默认不要做这些事：

- 不要重新引入 `antd`
- 不要重新引入 `@ant-design/icons`
- 不要在未确认前执行数据库兼容脚本
- 不要随意恢复 `canbe-blog-admin-web` / `canbe-blog-web`
- 不要对整个仓库执行破坏性 git 命令
  - 尤其不要用 `git reset --hard`
  - 不要清理用户已有改动

## 11. 建议的下一步

如果继续推进，建议优先顺序如下：

1. 保持 `/blog` 的 v0 布局不变，只把文章列表/详情切到真实 public API
2. 补齐文章标签关联表的后端保存和查询
3. 给后台表单补一些更轻量的交互体验
   - 例如 toast、确认弹窗、局部 loading
4. 根据实际使用频率，再决定是否引入按需加载的 Markdown 编辑器

## 12. 关键文件索引

### 前端

- `blog_web/app/page.tsx`
- `blog_web/app/blog/page.tsx`
- `blog_web/app/blog/posts/page.tsx`
- `blog_web/app/blog/posts/[id]/page.tsx`
- `blog_web/app/blog/agent/page.tsx`
- `blog_web/app/blog/agent/[id]/page.tsx`
- `blog_web/app/dashboard/page.tsx`
- `blog_web/app/dashboard/articles/page.tsx`
- `blog_web/app/dashboard/tags/page.tsx`
- `blog_web/app/dashboard/categories/page.tsx`
- `blog_web/app/dashboard/users/page.tsx`
- `blog_web/app/dashboard/menus/page.tsx`
- `blog_web/app/dashboard/dict/page.tsx`
- `blog_web/components/admin-shell.tsx`
- `blog_web/components/resource-page.tsx`
- `blog_web/lib/admin-api.ts`
- `blog_web/next.config.mjs`

### 后端

- `blog-server/init.sql`
- `blog-server/src/main/resources/application.yml`
- `blog-server/src/main/resources/sql/shiyi_compat_migration.sql`

## 13. 一句话交接结论

当前可继续演进的基线是：

- 前台 `/blog` 保持 v0 风格
- 后台 `/dashboard` 统一为轻量 Tailwind/shadcn/lucide 体系
- 后端继续沿用 `blog-server`
- 后续改造以“保留现有轻量体系、避免回退到双 UI 栈”为最高优先级
