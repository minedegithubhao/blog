# canbe_blog_web 已完成任务

最后更新：2026-04-30

## 已完成

- 整理前端项目根目录文档：
  - 新增 `PROJECT_RULES.md`，沉淀 `canbe_blog_web` 专属规范。
  - 保留 `TASKS_DONE.md` 作为前端工作进展记录。
  - 与根目录 `COMMON_RULES.md` 形成“共同规范 + 前端规范 + 前端进展”三层文档结构。

- 创建前端项目根目录：`canbe_blog_web`。
- 创建 Next.js 15 + React 19 + TypeScript 前端脚手架。
- 创建基础配置文件：
  - `package.json`
  - `tsconfig.json`
  - `next.config.mjs`
  - `postcss.config.mjs`
  - `next-env.d.ts`
- 创建 App Router 基础目录：`src/app`。
- 创建全局样式入口：`src/app/globals.css`。
- 创建根布局：`src/app/layout.tsx`。
- 按《博客功能介绍.md》创建前台路由占位：
  - `/`
  - `/blog`
  - `/blog/posts`
  - `/blog/posts/[id]`
  - `/blog/agent`
  - `/blog/agent/[id]`
  - `/login`
  - `/register`
  - `/me`
- 按《博客功能介绍.md》创建后台路由占位：
  - `/dashboard`
  - `/dashboard/articles`
  - `/dashboard/categories`
  - `/dashboard/tags`
  - `/dashboard/users`
  - `/dashboard/roles`
  - `/dashboard/menus`
  - `/dashboard/dict`
  - `/dashboard/agents`
  - `/dashboard/quotas`
  - `/dashboard/agent-call-records`
  - `/dashboard/files`
  - `/dashboard/site-config`
- 创建前端业务模块目录：
  - `auth`
  - `dashboard`
  - `content`
  - `agent`
  - `quota`
  - `user`
  - `file`
  - `system`
- 为每个业务模块创建标准目录：
  - `api`
  - `components`
  - `hooks`
  - `types`
  - `schemas`
  - `utils`
  - `constants`
- 安装前端依赖。
- 执行 `pnpm build` 并验证构建通过。
- 编写 `/login` 登录页面。
- 登录页面已接入真实登录接口：`POST /api/v1/auth/login`。
- 新增登录 API 封装：`src/modules/auth/api/auth-api.ts`。
- 新增登录类型定义：`src/modules/auth/types/auth.ts`。
- 新增通用 API 响应类型：`src/types/api.ts`。
- 将登录表单拆为客户端组件：`src/modules/auth/components/login-form.tsx`。
- 登录成功后保存 `canbe_blog_token` 和 `canbe_blog_user` 到 `localStorage`。
- 登录成功后按角色跳转：`ADMIN` 跳转 `/dashboard`，其他用户跳转 `/me`。
- 登录失败时在页面内展示错误信息。
- 启动前端开发服务并验证 `/login` 可访问。
- 验证前端代理路径 `/api/v1/auth/login` 可登录成功。
- 参考旧项目 `blog_web/app/page.tsx`，将登录页调整为蓝白分屏风格。
- 保留真实登录、错误提示、token 保存和角色跳转逻辑。
- 新增密码显示/隐藏切换。
- 已核验菜单管理前端功能：
  - `/dashboard/menus` 路由存在并接入 `MenuManagementPage`。
  - 菜单管理页支持列表加载、按名称前缀查询、按状态筛选、新增、编辑、删除、分页。
  - 菜单 API 封装已包含 `listMenus`、`createMenu`、`updateMenu`、`deleteMenu`。
  - `pnpm build` 已通过，构建结果包含 `/dashboard/menus` 页面。

## 当前说明

- 当前登录页实现位于 `src/modules/auth/components/login-page-view.tsx`。
- 路由入口位于 `src/app/login/page.tsx`。
- 当前登录页已接入后端登录接口。
- 当前登录页视觉风格已对齐旧项目 `blog_web` 的登录页。
- 当前已实现前端登录态保存、当前用户查询、退出登录和受保护页面校验。
- 当前没有新增项目规划之外的依赖。
- 菜单管理前端实现位于 `src/modules/system/components/menu-management-page.tsx`。
- 菜单接口封装位于 `src/modules/system/api/menu-api.ts`。
- 菜单 CRUD 页面可用，并会携带登录 token 请求后端。
- 已新增后台整体导航壳，登录后可从侧边栏进入后台首页、用户管理、菜单管理。
- 当前已确认最终规范为：前端后续改为消费 `GET /api/v1/me/navigation` 返回的 `menus + permissions`，由菜单树渲染导航、面包屑与 tabs。
- `/dashboard` 已补登录保护和基础状态页，多数其它后台页面仍是 `return null` 占位页。
- `/dashboard/users` 已接入后台账号管理页面。

## 2026-04-25 登录功能补充

- 新增登录态存储工具：`src/modules/auth/utils/auth-storage.ts`。
- 扩展认证 API：
  - `POST /api/v1/auth/login`
  - `GET /api/v1/me`
  - `POST /api/v1/auth/logout`
- 新增 `AuthGuard`：用于校验登录态，未登录跳转 `/login?redirect=...`，后台页面要求 `ADMIN` 角色。
- 新增 `LogoutButton`：退出登录后清理本地 token 和用户信息。
- 新增 `/dashboard/layout.tsx`，统一保护后台路由。
- `/dashboard` 已从空占位改为基础后台首页。
- `/me` 已从空占位改为当前用户信息页，并接入登录保护。
- `/` 已从空占位改为跳转 `/login`，避免直接打开前端根路径时看到空白页。
- `next.config.mjs` 新增 `BLOG_API_BASE_URL` 支持，默认仍代理到 `http://localhost:8080`；本机 8080 被占用时可启动前端前设置为 `http://localhost:18080`。
- 菜单 API 改为复用认证请求头工具。
- 已验证 `pnpm build` 构建通过。
- 已验证前端代理 `http://127.0.0.1:3000/api/v1/auth/login` 可通过 `BLOG_API_BASE_URL=http://127.0.0.1:18080` 登录成功。

## 常用命令

```powershell
pnpm install
pnpm build
pnpm dev --hostname 127.0.0.1 --port 3000
```

## 2026-04-26 用户管理功能

- `/dashboard/users` 已从空占位改为 `AdminAccountManagementPage`。
- 新增后台导航壳：`src/modules/dashboard/components/dashboard-shell.tsx`。
- `/dashboard/layout.tsx` 已包裹 `DashboardShell`，登录后可看到用户管理和菜单管理入口。
- 新增后台账号类型：`src/modules/user/types/admin-account.ts`。
- 新增后台账号 API 封装：`src/modules/user/api/admin-account-api.ts`。
- 新增后台账号管理页面：`src/modules/user/components/admin-account-management-page.tsx`。
- 页面能力：
  - 分页加载账号列表。
  - 按用户名前缀查询。
  - 按启用/停用状态筛选。
  - 新增后台账号。
  - 编辑昵称、邮箱、角色标识和状态。
  - 删除后台账号。
- 当前前端角色选项按后端现有单字段模型固定为 `ADMIN` 和 `USER`；等角色表完成后再改为从角色接口动态加载。
- 已验证 `pnpm build` 构建通过，构建结果包含 `/dashboard/users` 页面。

## 2026-04-26 后台 UI 风格统一

- 按旧项目 `blog_web` 的后台风格调整 `canbe_blog_web` 后台 UI。
- 后台主色统一为 `#3F3FF3`， hover 主色为 `#3434d8`。
- 后台主背景统一为 `#f5f6fb`，容器统一白底、`gray-200` 边框、轻阴影。
- 后台导航激活态改为蓝底白字，与 `blog_web/components/admin-shell.tsx` 一致。
- 用户管理和菜单管理页面的按钮、输入框、筛选区、表单区、表格区已统一为蓝白灰风格和 8px 圆角。
- 状态字段保留语义色：启用使用绿色，停用/删除使用红色。
- 已验证 `pnpm build` 构建通过。

## 2026-04-26 登录态校验体验修正

- 调整 `AuthGuard`：
  - 本地没有 `canbe_blog_token` 时立即跳转 `/login?redirect=...`。
  - 校验期间不再显示“正在校验登录状态...”文案，避免后端异常时用户误以为页面卡死。
  - 当前用户校验失败时清理本地登录态并跳转登录页。
- 调整 `getCurrentUser`：
  - `/api/v1/me` 校验请求增加 4 秒超时。
  - 后端未启动或代理无响应时会尽快触发失败逻辑并跳转登录页。
- 已验证 `pnpm build` 构建通过。

## 2026-04-26 后台 UI 整体对齐 blog_web

- 按用户最新要求，将 `canbe_blog_web` 后台从“参考配色”调整为“整体参考 `blog_web` 后台 UI”。
- 重写后台壳组件 `src/modules/dashboard/components/dashboard-shell.tsx`：
  - 侧边栏改为与 `blog_web/components/admin-shell.tsx` 相同的折叠式结构。
  - 桌面端加入统一顶部标题栏、管理员信息区和退出按钮区。
  - 移动端加入横向导航 chips，避免只有侧栏版本的样式。
- 新增通用资源页组件 `src/modules/dashboard/components/admin-resource-page.tsx`：
  - 统一查询卡片、资源表格卡片、分页区、弹窗表单区。
  - 抽出 `StatusBadge`，统一状态标签视觉。
  - 支持 `disabledOnEdit` 和 `hiddenOnEdit`，保留业务字段差异。
- 用户管理页 `src/modules/user/components/admin-account-management-page.tsx` 已改为基于通用资源页实现：
  - 整体布局、按钮位置、表格层级、弹窗结构对齐 `blog_web` 用户管理页。
  - 保留当前 canbe 项目的账号字段：`username`、`nickname`、`email`、`roleCode`、`status`、`lastLoginAt`。
- 菜单管理页 `src/modules/system/components/menu-management-page.tsx` 已改为基于通用资源页实现：
  - 整体布局、按钮位置、表格层级、弹窗结构对齐 `blog_web` 菜单管理页。
  - 保留当前 canbe 项目的菜单字段：`parentId`、`name`、`title`、`path`、`component`、`permission`、`visible`、`status`。
- 后台首页 `src/app/dashboard/page.tsx` 改为与 `blog_web` 相同的信息卡片式首页结构。
- 已重新执行 `pnpm build`，构建通过。

## 2026-04-26 后台壳补充收缩、面包屑、Tabs

- 继续按用户截图要求调整 `src/modules/dashboard/components/dashboard-shell.tsx`。
- 桌面端顶部第一行新增：
  - 左侧汉堡按钮，用于控制侧边栏收起/展开。
  - 当前页面面包屑，格式为 `分组 / 页面名`，例如 `系统管理 / 用户管理`。
  - 右侧管理员信息和退出按钮。
- 桌面端顶部第二行新增可关闭 Tabs：
  - 打开后台页面时自动加入 tab。
  - 当前 tab 高亮。
  - 非 `/dashboard` tab 支持关闭。
  - 关闭当前 tab 时自动跳回上一个 tab，没有时回到 `/dashboard`。
- Tabs 使用 `localStorage` 键 `canbe_blog_dashboard_tabs` 做本地持久化，刷新页面后会保留已打开标签。
- 移动端头部同步补充面包屑和横向 tabs 展示，但不提供侧边栏收缩交互。
- 侧边栏底部原有“收起菜单”按钮已移除，收缩入口统一收敛到顶部汉堡按钮。
- 已重新执行 `pnpm build`，构建通过。

## 2026-04-26 侧边栏配色与资源页操作区对齐

- 继续参考用户提供的后台截图，调整 `src/modules/dashboard/components/dashboard-shell.tsx`：
  - 侧边栏激活子菜单改为浅蓝底 `#eef0ff` + 蓝字 `#3F3FF3`，不再使用整块深蓝底白字。
  - 非激活菜单改为深灰字，hover 时变蓝，更接近截图中的层级关系。
  - 分组标题与子菜单间距、缩进同步收紧，视觉更贴近截图。
- 调整通用资源页组件 `src/modules/dashboard/components/admin-resource-page.tsx`：
  - 新增表格首列勾选框，支持当前页全选/单选。
  - 新增“批量删除”按钮，前端按选中记录逐条调用现有删除接口执行批量删除。
  - “新增”按钮改为蓝描边白底样式，“批量删除”改为红描边白底样式。
  - 工具条右侧新增刷新图标按钮。
  - 操作列由文字按钮改为图标按钮，保留编辑和删除动作。
- 用户管理页与菜单管理页已自动继承以上通用样式和交互，无需分别单独改页。
- 已重新执行 `pnpm build`，构建通过；期间出现过一次 `/register` 页面数据收集异常，二次构建已恢复正常。

## 2026-04-26 后台圆角收口

- 按用户反馈继续压缩后台 UI 圆角，避免当前实现比参考图更“圆”。
- 主要调整：
  - 侧边栏菜单、分组标题、顶部 tabs、顶部汉堡按钮统一从 `rounded-lg` 收到 `rounded-md`。
  - 通用资源页的输入框、按钮、刷新按钮、分页按钮、提示条、操作列图标按钮统一从 `rounded-lg` 收到 `rounded-md`。
  - 卡片/容器类外框从 `rounded-xl` 收到 `rounded-lg`。
  - 弹窗外层从 `rounded-2xl` 收到 `rounded-lg`。
  - 后台首页统计卡片和图标块同步收口。
- 涉及文件：
  - `src/modules/dashboard/components/dashboard-shell.tsx`
  - `src/modules/dashboard/components/admin-resource-page.tsx`
  - `src/modules/auth/components/logout-button.tsx`
  - `src/app/dashboard/page.tsx`
- 已重新执行 `pnpm build`，构建通过。

## 2026-04-26 按截图复刻后台局部样式

- 根据用户提供的后台截图，继续向目标样式收敛，重点不是配色微调，而是直接复刻结构与比例关系。
- `src/modules/dashboard/components/dashboard-shell.tsx`：
  - 侧边栏菜单文字、内边距、激活态浅蓝块、分组头背景更贴近截图。
  - 顶部 tabs 改为更扁平的矩形标签样式，默认浅灰底、激活态白底蓝字。
  - 品牌栏高度和边框颜色同步微调。
- `src/modules/dashboard/components/admin-resource-page.tsx`：
  - 查询条改为与截图一致的“标签 + 输入框”横向结构。
  - 查询输入框宽度恢复到更接近截图的中宽尺寸，查询/重置按钮改为无图标文本按钮。
  - 新增、批量删除、刷新按钮尺寸和配色继续向截图靠拢。
- 本次改动目标是让用户管理和菜单管理页共同继承截图风格，不单独按页面做散改。
- 已重新执行 `pnpm build`，构建通过。

## 2026-04-26 参考 b_3otjmeRyp3y 源码做纯样式复刻

- 用户明确要求不引入 `antd`，避免项目出现两套前端框架。
- 已撤回误加依赖：
  - `antd`
  - `@ant-design/icons`
- 本次改为直接参考 `D:\IdeaProjects\blog\b_3otjmeRyp3y` 中后台源码结构，用现有 `Next.js + React + Tailwind + lucide-react` 做样式等形复刻。
- 重写 `src/modules/dashboard/components/dashboard-shell.tsx`：
  - 对齐参考项目的后台侧边栏宽度、品牌栏高度、分组结构、顶部 header、tab 样式和内容区留白。
  - 保留当前项目已有后台路由结构与登录保护。
- 重写 `src/modules/dashboard/components/admin-resource-page.tsx`：
  - 参考项目的查询卡片、工具条、表格、分页、弹窗结构全部用纯样式重建。
  - 保留当前项目自己的查询字段、表单字段和后端接口。
  - 保留批量删除、刷新、操作列图标按钮，但样式向参考项目对齐。
- 调整 `src/modules/user/components/admin-account-management-page.tsx`：
  - 去掉不在参考页中的说明文案。
  - 列结构更贴近参考列表页，不再显示 ID 列。
- 调整 `src/modules/system/components/menu-management-page.tsx`：
  - 去掉不在参考页中的说明文案。
- 重写 `src/app/dashboard/page.tsx`：
  - 按参考项目首页改为“博客 / Agent”两组统计卡片布局。
- 本次构建过程中出现过 `.next` chunk 缓存损坏，已清理 `canbe_blog_web/.next` 后重新构建。
- 已重新执行 `pnpm build`，构建通过。

## 2026-04-26 按开发手册同步后台层级

- 用户要求前后端同步开发，后台层级目录必须与《博客功能介绍.md》中的后台页面清单保持一致，而不是只在前端临时补几个菜单。
- 已调整 `src/modules/dashboard/components/dashboard-shell.tsx`：
  - 后台导航层级改为与开发手册一致：
    - `仪表盘`
    - `内容管理`：文章管理、标签管理、分类管理
    - `系统管理`：用户管理、角色管理、字典管理、文件管理、菜单管理、站点配置
    - `智能体管理`：Agent管理、额度管理、Agent调用记录
    - `乘风博客`
- 已新增统一占位页组件 `src/modules/dashboard/components/dashboard-placeholder-page.tsx`。
- 已将以下原本 `return null` 的后台页面改为标准占位页，避免导航结构补齐后点击还是空白：
  - `articles`
  - `categories`
  - `tags`
  - `roles`
  - `dict`
  - `agents`
  - `quotas`
  - `agent-call-records`
  - `files`
  - `site-config`
- 用户管理和菜单管理继续保留当前已接通后端接口的真实 CRUD 页面。
- 已重新执行 `pnpm build`，构建通过。

## 2026-04-26 真正补齐 shadcn/ui 基座

- 用户明确要求不再只是“仿官方样式”，而是要真正使用官方 `shadcn/ui` 组件库作为基座。
- 已补齐 `shadcn/ui` 基础依赖：
  - `class-variance-authority`
  - `clsx`
  - `tailwind-merge`
  - `tw-animate-css`
  - `@radix-ui/react-slot`
  - `@radix-ui/react-label`
  - `@radix-ui/react-select`
  - `@radix-ui/react-dialog`
  - `@radix-ui/react-tabs`
  - `@radix-ui/react-checkbox`
  - `@radix-ui/react-separator`
- 已新增 `components.json`，按 `shadcn/ui` 官方 schema 配置：
  - `style: new-york`
  - `iconLibrary: lucide`
  - CSS 路径指向 `src/app/globals.css`
- 已新增 `src/lib/utils.ts`，提供官方常用 `cn()` 合并工具。
- 已补齐 `src/components/ui` 基础组件文件：
  - `button.tsx`
  - `input.tsx`
  - `textarea.tsx`
  - `label.tsx`
  - `select.tsx`
  - `dialog.tsx`
  - `tabs.tsx`
  - `table.tsx`
  - `card.tsx`
  - `badge.tsx`
  - `checkbox.tsx`
  - `separator.tsx`
- 已重写 `src/app/globals.css`，补齐 `shadcn/ui` 官方默认风格所需的主题变量与 `tw-animate-css` 引用，主题主色继续保持项目当前蓝色。
- 当前状态说明：
  - `shadcn/ui` 基座已经真实存在于项目中。
  - 后台核心页面已经开始直接消费这些官方组件。
- 已重新执行 `pnpm build`，构建通过。

## 2026-04-26 后台核心页面切到官方组件

- 继续按用户要求推进，不再停留在“有基座但业务页还在自定义样式”的状态。
- 已新增官方组件文件：
  - `src/components/ui/pagination.tsx`
  - `src/components/ui/sidebar.tsx`
  - `src/components/ui/sheet.tsx`
  - `src/components/ui/tooltip.tsx`
  - `src/components/ui/skeleton.tsx`
  - `src/hooks/use-mobile.ts`
- 已新增对应依赖：
  - `@radix-ui/react-tooltip`
- 已将以下页面/组件改为直接使用官方 `shadcn/ui` 组件：
  - `src/modules/dashboard/components/admin-resource-page.tsx`
    - `Button`
    - `Input`
    - `Select`
    - `Dialog`
    - `Table`
    - `Checkbox`
    - `Badge`
    - `Card`
    - `Pagination`
  - `src/modules/dashboard/components/dashboard-shell.tsx`
    - `Button`
    - `Tabs`
    - `Sidebar`
  - `src/modules/auth/components/logout-button.tsx`
    - `Button`
  - `src/modules/auth/components/login-form.tsx`
    - `Button`
    - `Input`
    - `Checkbox`
    - `Label`
  - `src/modules/dashboard/components/dashboard-placeholder-page.tsx`
    - `Card`
  - `src/app/dashboard/page.tsx`
    - `Card`
- 当前说明：
  - 业务数据结构、接口和页面层级保持不变。
  - 主题主色仍保持项目当前蓝色。
  - 后台实际使用的核心控件已基本迁移到官方组件库，不再继续扩散手写按钮、输入框、下拉、弹窗、表格实现。
- 已重新执行 `pnpm build`，构建通过。

## 2026-04-26 统一接入 Sonner 提示

- 按用户要求，将项目内的成功/失败/警告提示统一切到 `sonner`：
  - 成功场景使用 `toast.success`
  - 失败场景使用 `toast.error`
  - 提醒场景使用 `toast.warning`
- 已新增官方基座组件：`src/components/ui/sonner.tsx`。
- 已在根布局 `src/app/layout.tsx` 挂载全局 `<Toaster />`，位置为顶部居中，并启用关闭按钮。
- 已改造登录页 `src/modules/auth/components/login-form.tsx`：
  - 登录成功弹出成功提示。
  - 登录失败改为 toast 错误提示。
  - 移除原来的页内红色错误块。
- 已改造退出登录按钮 `src/modules/auth/components/logout-button.tsx`：
  - 退出成功弹出成功提示。
  - 后端退出接口失败时弹出 warning，但仍清理本地登录态并跳回登录页。
- 已改造个人中心 `src/modules/auth/components/me-page-view.tsx`：
  - 获取当前用户失败时改为 toast 错误提示。
  - 页面保留简单加载/空状态文案，不再承载错误主提示。
- 已改造通用 CRUD 页 `src/modules/dashboard/components/admin-resource-page.tsx`：
  - 列表加载失败使用 `toast.error`
  - 新增/编辑成功使用 `toast.success`
  - 保存失败使用 `toast.error`
  - 单条删除成功/失败分别使用 `toast.success` / `toast.error`
  - 未勾选就批量删除时使用 `toast.warning`
  - 批量删除部分成功时使用 `toast.warning`
  - 移除原来页面顶部的 `notice` 内联提示条
- 已调整 `src/components/ui/sonner.tsx`：
  - 保留顶部居中 `top-center`
  - 提示改为实心色块风格
  - `richColors` 由 `sonner` 原生接管，不再用浅色背景覆盖成功/错误/警告配色
- 已关闭 `Toaster` 的关闭按钮入口，顶部提示不再显示右上角叉号：
  - `src/app/layout.tsx`
- 已重新执行 `pnpm build`，构建通过。

## 2026-04-26 开发手册前端规范补充

- 已更新根文档 `D:\IdeaProjects\blog\博客功能介绍.md`，补充前端 UI 与提示信息规范。
- 新增并明确以下规则：
  - 所有可复用基础交互控件必须优先使用 `src/components/ui` 中的官方组件基座。
  - 不允许在业务目录重复手写已有职责的按钮、输入框、下拉、弹窗、分页、表格、Tabs、Tooltip、Toast 等基础组件。
  - 若缺少组件，先按 `shadcn/ui` 官方方式补齐到 `src/components/ui`，再由业务页复用。
  - 全局非阻塞提示统一使用 `sonner`。
  - 成功、错误、警告分别统一为 `toast.success`、`toast.error`、`toast.warning`。
  - 全局提示位置统一为顶部居中 `top-center`。
  - 字段级表单校验提示保留在字段附近，危险操作确认必须使用原生确认类对话框，不用 toast 代替。

## 2026-04-26 开发手册异常场景规范补充

- 已继续更新根文档 `D:\IdeaProjects\blog\博客功能介绍.md`，补充“常见异常场景处理规范”和“HTTP 状态码与前端处理语义”。
- 手册已明确以下前后端协作规则：
  - 页面级问题、toast 提示、字段级校验三者分工。
  - `401`、`403`、`404`、`409`、`500/502/503/504` 等常见状态的推荐处理方式。
  - token 失效、权限不足、页面不存在、资源不存在、参数错误、批量部分成功、网络超时、服务不可用、chunk 资源 404、SSE/Agent 中断等场景的前端处理规范。
  - 后端不能再把所有异常都包成 HTTP `200`，必须逐步向正确的 HTTP 状态语义收敛。

## 2026-04-26 文档结构重组

- 根据当前协作方式，重新整理文档结构：
  - 根目录新增共同规范文档：`D:\IdeaProjects\blog\COMMON_RULES.md`
  - 前端根目录新增项目规范文档：`D:\IdeaProjects\blog\canbe_blog_web\PROJECT_RULES.md`
  - 前端根目录保留工作进展文档：`D:\IdeaProjects\blog\canbe_blog_web\TASKS_DONE.md`
- 前端后续任务开始前，建议阅读顺序：
  1. `COMMON_RULES.md`
  2. `canbe_blog_web/PROJECT_RULES.md`
  3. `canbe_blog_web/TASKS_DONE.md`

## 2026-04-26 规范补充落地

- 已继续把已确认规则写入文档体系：
  - SSE / Agent 中断时保留半段内容、切到“已中断”、展示原因、提供“重新生成”
  - 菜单采用“前端静态路由 + 后端菜单树与权限控制”
  - 按钮级权限纳入 V1
- 已继续补充并同步：
  - 无权限按钮前端直接隐藏
  - 文件访问 URL 使用 `/uploads/...`
  - 文件删除不做引用检查，被引用处前端兜底默认图
  - 草稿 / 下架文章与 Agent 前台按 `404` 处理
  - 注册规则：用户名唯一、昵称可重复、邮箱可空、密码最小长度 6 位、前端确认密码
  - Agent 中断消息持久化，刷新后仍可见
  - 登录态最简规则：token 默认有效期 1 个月，不做 refresh token，不做滑动续期
  - 额度最简规则：总计 10 次
  - 额度扣减时机：请求成功后扣减，请求失败不扣减
  - 请求开始前先检查剩余额度，只有大于 0 才允许开始
  - V1 不做流式过程中按次额度中断
  - 文件上传最简限制：只允许常见图片、单文件大小 5MB
  - 图片白名单固定为 `jpg/jpeg/png/webp`
  - 用户名规则：字母/数字/下划线，长度 4-20；昵称最大长度 20
  - 前台注册默认 `roleCode = USER`
  - 默认图统一使用前端静态资源
  - 前台单独 404、后台单独 404、后台单独 403、401 直接跳登录
  - 高风险改动强制 smoke test：登录、权限/菜单/路由、上传、Agent/SSE、额度
  - Tabs 持久化：`localStorage` + 用户隔离 key
  - 删除确认统一使用 `AlertDialog`
  - 上级菜单选择统一采用 `Popover + Command + 树形缩进列表`
  - 上级菜单选择补充：支持“顶级菜单”，编辑时禁选自己和子孙节点
  - Remember Me 在 V1 去掉
  - 默认图统一通过 `AvatarFallback` / `AppImage` 公共能力兜底
  - 默认图路径统一为 `/images/defaults/article-cover.png`、`/images/defaults/agent-cover.png`、`/images/defaults/avatar.png`
  - 菜单树接口返回统一为 `menus + permissions`
  - 菜单导航接口路径统一为 `GET /api/v1/me/navigation`
  - 后端允许保存任意 icon 字符串，前端未命中统一 fallback
  - `component` 仅做菜单元数据，后端校验规则：`CATALOG` 可空、`MENU` 必填、`BUTTON` 为空
  - 图片上传接口返回 `id/url/filename/size/contentType`，V1 业务表单直接保存 `url`
  - V1 前台用户与后台账号临时共用 `blog_account`
  - 额度字段模型统一为 `totalQuota / usedQuota / remainingQuota`
- 已同步更新：
  - `D:\IdeaProjects\blog\博客功能介绍.md`
  - `D:\IdeaProjects\blog\COMMON_RULES.md`
  - `D:\IdeaProjects\blog\canbe_blog_web\PROJECT_RULES.md`

## 2026-04-26 用户管理与菜单管理重构

- 按最新规范重构后台导航壳 `src/modules/dashboard/components/dashboard-shell.tsx`：
  - 前端开始消费 `GET /api/v1/me/navigation`
  - 侧边栏、面包屑、tabs 改为从后端菜单树生成
  - tabs 改为按 `userId` 隔离的 `localStorage` 持久化
- 新增后台导航上下文与接口：
  - `src/modules/dashboard/api/navigation-api.ts`
  - `src/modules/dashboard/types/navigation.ts`
  - `src/modules/dashboard/components/dashboard-access-context.tsx`
- 补齐官方基座组件并用于用户管理 / 菜单管理重构：
  - `src/components/ui/alert-dialog.tsx`
  - `src/components/ui/popover.tsx`
  - `src/components/ui/command.tsx`
- 重构通用 CRUD 页 `src/modules/dashboard/components/admin-resource-page.tsx`：
  - 删除确认和批量删除确认改为 `AlertDialog`
  - 新增基于权限集合的新增 / 编辑 / 删除按钮显隐控制
  - 新增表单字段自定义渲染能力，支持菜单树选择器
- 重构用户管理页 `src/modules/user/components/admin-account-management-page.tsx`：
  - 对齐最新用户名 / 昵称 / 密码 / 邮箱规则
  - 新增 / 编辑 / 删除按钮改为按权限显示
- 重构菜单管理页 `src/modules/system/components/menu-management-page.tsx`：
  - 上级菜单改为 `Popover + Command + 树形缩进列表`
  - 支持“顶级菜单”、禁选自己和子孙节点
  - 菜单类型改为前端按最新规则校验 `path` / `component`
  - 新增 / 编辑 / 删除按钮改为按权限显示
- 新增菜单树选择器组件：
  - `src/modules/system/components/menu-tree-select-field.tsx`
- 扩展菜单前端接口与类型：
  - `src/modules/system/api/menu-api.ts` 新增 `listMenuTree`
  - `src/modules/system/types/menu.ts` 新增 `MenuTreeNode`
- 登录页已去掉 `Remember Me` 复选框，与最新规范保持一致。
- 已验证：
  - `pnpm build` 构建通过

## 2026-04-26 注册与登录页面重构

- 按最新规范补齐认证前端：
  - 新增统一认证壳组件：`src/modules/auth/components/auth-page-shell.tsx`
  - 登录页改为基于统一认证壳渲染：`src/modules/auth/components/login-page-view.tsx`
  - 新增注册表单：`src/modules/auth/components/register-form.tsx`
  - 新增注册页视图：`src/modules/auth/components/register-page-view.tsx`
  - `/register` 路由不再是空壳，已接入真实页面：`src/app/register/page.tsx`
- 扩展认证前端 API：
  - `src/modules/auth/api/auth-api.ts` 新增 `register`
  - `src/modules/auth/types/auth.ts` 新增 `RegisterPayload`
- 登录 / 注册前端规则已落地：
  - 去掉 `Remember Me`
  - 用户名按 `4-20` 位字母 / 数字 / 下划线校验
  - 昵称最大长度 `20`
  - 密码最小长度 `6`
  - 注册页增加确认密码校验
- 已验证：
  - `pnpm build` 构建通过

## 2026-04-26 角色管理开发

- 按最新规范补齐前端角色管理：
  - 新增角色类型：`src/modules/user/types/role.ts`
  - 新增角色 API：`src/modules/user/api/role-api.ts`
  - 新增角色管理页面：`src/modules/user/components/role-management-page.tsx`
  - `/dashboard/roles` 路由已从占位页改为真实角色管理页：`src/app/dashboard/roles/page.tsx`
- 用户管理页已与角色管理联动：
  - 角色下拉改为从角色接口动态加载
  - 不再写死 `ADMIN/USER` 静态选项
- 角色管理页能力：
  - 分页加载角色列表
  - 按角色名称查询
  - 按状态筛选
  - 新增角色
  - 编辑角色
  - 删除角色
- 与权限系统联动：
  - 角色页新增 / 编辑 / 删除按钮依赖 `role:create / role:update / role:delete`
  - 已同步菜单按钮权限节点到后端菜单种子
- 已验证：
  - `pnpm build` 构建通过

## 2026-04-26 分类管理与标签管理开发

- 按最新规范补齐前端分类管理与标签管理：
  - 新增分类类型：`src/modules/content/types/category.ts`
  - 新增标签类型：`src/modules/content/types/tag.ts`
  - 新增分类 API：`src/modules/content/api/category-api.ts`
  - 新增标签 API：`src/modules/content/api/tag-api.ts`
  - 新增分类管理页面：`src/modules/content/components/category-management-page.tsx`
  - 新增标签管理页面：`src/modules/content/components/tag-management-page.tsx`
  - `/dashboard/categories` 路由已从占位页改为真实分类管理页
  - `/dashboard/tags` 路由已从占位页改为真实标签管理页
- 分类管理页能力：
  - 分页加载分类列表
  - 按名称查询
  - 按状态筛选
  - 新增分类
  - 编辑分类
  - 删除分类
- 标签管理页能力：
  - 分页加载标签列表
  - 按名称查询
  - 新增标签
  - 编辑标签
  - 删除标签
- 与权限系统联动：
  - 分类页按钮权限依赖 `category:create / category:update / category:delete`
  - 标签页按钮权限依赖 `tag:create / tag:update / tag:delete`
- 已验证：
  - `pnpm build` 构建通过

## 2026-04-26 文章管理开发

- 按最新规范补齐前端文章管理：
  - 新增文章类型：`src/modules/content/types/article.ts`
  - 新增文章 API：`src/modules/content/api/article-api.ts`
  - 新增标签多选字段组件：`src/modules/content/components/tag-multi-select-field.tsx`
  - 新增文章管理页面：`src/modules/content/components/article-management-page.tsx`
  - `/dashboard/articles` 路由已从占位页改为真实文章管理页
- 文章管理页能力：
  - 分页加载文章列表
  - 按标题查询
  - 按分类筛选
  - 按状态筛选
  - 新增文章
  - 编辑文章
  - 删除文章
- 文章表单最简规则已落地：
  - 封面先使用 `coverUrl` 文本输入
  - 分类单选
  - 标签多选
  - 状态支持：草稿 / 发布 / 下架
- 与权限系统联动：
  - 文章页按钮权限依赖 `article:create / article:update / article:delete`
  - 已同步菜单按钮权限节点到后端菜单种子
- 已验证：
  - `pnpm build` 构建通过

## 2026-04-26 文件管理与字典管理开发

- 按最新规范补齐前端文件管理与字典管理：
  - 新增文件类型：`src/modules/file/types/file-record.ts`
  - 新增文件 API：`src/modules/file/api/file-api.ts`
  - 新增文件管理页面：`src/modules/file/components/file-management-page.tsx`
  - 新增字典类型：`src/modules/system/types/dict-item.ts`
  - 新增字典 API：`src/modules/system/api/dict-api.ts`
  - 新增字典管理页面：`src/modules/system/components/dict-management-page.tsx`
  - `/dashboard/files` 路由已从占位页改为真实文件管理页
  - `/dashboard/dict` 路由已从占位页改为真实字典管理页
- 文件管理页能力：
  - 上传图片文件
  - 按文件名查询
  - 按 contentType 查询
  - 分页查看文件记录
  - 删除文件
- 字典管理页能力：
  - 分页加载字典项
  - 按类型编码查询
  - 按标签查询
  - 按状态筛选
  - 新增字典项
  - 编辑字典项
  - 删除字典项
- 与权限系统联动：
  - 文件页按钮权限依赖 `file:upload / file:delete`
  - 字典页按钮权限依赖 `dict:create / dict:update / dict:delete`
- 已验证：
  - `pnpm build` 构建通过

## 2026-04-26 P0 Agent、额度与调用记录后台页面开发

- 按最新规范补齐前端 Agent 管理：
  - 新增 Agent 类型：`src/modules/agent/types/agent.ts`
  - 新增 Agent API：`src/modules/agent/api/agent-api.ts`
  - 新增 Agent 管理页面：`src/modules/agent/components/agent-management-page.tsx`
  - `/dashboard/agents` 路由已从占位页改为真实管理页
- Agent 管理页能力：
  - 分页加载 Agent 列表
  - 按名称查询
  - 按状态筛选
  - 新增 Agent
  - 编辑 Agent
  - 删除 Agent
  - 测试 Runtime 连接
- 补齐额度管理页面：
  - 新增额度类型：`src/modules/quota/types/quota.ts`
  - 新增额度 API：`src/modules/quota/api/quota-api.ts`
  - 新增额度管理页面：`src/modules/quota/components/quota-management-page.tsx`
  - `/dashboard/quotas` 路由已从占位页改为真实管理页
- 额度管理页采用 Tabs 分区：
  - 用户额度：查询用户额度，调整 `totalQuota`
  - 角色策略：查询角色 Agent 策略，调整启用状态和默认额度
- 补齐 Agent 调用记录后台列表：
  - 新增调用记录类型：`src/modules/agent/types/agent-call-record.ts`
  - 新增调用记录页面：`src/modules/agent/components/agent-call-record-management-page.tsx`
  - `/dashboard/agent-call-records` 路由已从占位页改为真实只读列表
- 扩展通用后台资源页：
  - 支持 `allowCreate=false`
  - 支持 `allowEdit=false`
  - 支持无删除能力的只编辑 / 只读表格，避免额度和调用记录页重复造表格。
- 与权限系统联动：
  - Agent 页按钮权限依赖 `agent:create / agent:update / agent:delete`
  - Agent 测试连接依赖页面接口权限节点 `agent:testConnection`
  - 用户额度调整依赖 `quota:update`
  - 角色策略调整依赖 `roleAgentPolicy:update`
  - 调用记录列表依赖后台菜单节点 `agentCallRecord:list`
- 已验证：
  - `pnpm build` 构建通过。

## 2026-04-26 P0 前台博客页面开发

- 按主开发手册第一优先级补齐前台博客展示：
  - 根路径 `/` 不再跳转登录页，改为前台博客首页。
  - `/blog` 改为前台博客首页。
  - `/blog/posts` 改为真实文章列表页。
  - `/blog/posts/[id]` 改为真实文章详情页。
- 新增前台博客模块：
  - `src/modules/blog/types/public-article.ts`
  - `src/modules/blog/api/public-article-api.ts`
  - `src/modules/blog/components/blog-header.tsx`
  - `src/modules/blog/components/article-card.tsx`
  - `src/modules/blog/components/blog-home-page.tsx`
  - `src/modules/blog/components/blog-posts-page.tsx`
  - `src/modules/blog/components/blog-post-detail-page.tsx`
- 前台博客接口：
  - 使用 `GET /api/v1/public/articles`
  - 使用 `GET /api/v1/public/articles/{id}`
  - 不携带登录态，前台博客默认可访问。
- 页面规则：
  - 仅展示后端公开接口返回的已发布文章。
  - 无文章时展示空态，不出现空白页。
  - 详情接口未命中时进入 Next.js 404。
  - 封面为空时使用 `/images/defaults/article-cover.png` 兜底路径。
- 已验证：
  - `pnpm build` 构建通过。

## 2026-04-28 `/blog` 首页对齐 blog_web 原结构

- 根据用户确认，`/blog` 前台展示页面必须与 `blog_web/app/blog/page.tsx` 保持一致，只替换数据来源。
- 已调整 `src/modules/blog/components/blog-home-page.tsx`：
  - 不再使用本项目自定义的 `BlogHeader`。
  - 移除之前额外加的右上角“后台”按钮。
  - Header 改为 `blog_web` 原页面结构：左侧“返回管理 + 乘风博客”，右侧“首页 / 博客 / Agent / 关于”。
  - Hero、统计区、精选文章、CTA、Footer 按 `blog_web` 原页面结构实现。
- 数据来源：
  - 精选文章从 `GET /api/v1/public/articles?page=1&pageSize=3` 获取。
  - 不再使用 `blog_web` 中的模拟文章数组。
  - 后端暂无浏览量字段，当前浏览量展示为 `0`。
- 静态资源：
  - 补齐 `/images/defaults/article-cover.png`，作为文章无封面时的兜底图。
- 已验证：
  - `pnpm build` 构建通过。

## 2026-04-28 `/blog/posts` 文章列表对齐 blog_web

- 根据用户确认，前台路由职责明确为：
  - `/blog`：博客前台首页，对齐 `blog_web/app/blog/page.tsx`
  - `/blog/posts`：文章列表，对齐 `blog_web/app/blog/posts/page.tsx`
  - `/blog/posts/[id]`：文章详情，对齐 `blog_web/app/blog/posts/[id]/page.tsx`
- 已重写 `/blog/posts`：
  - 删除之前的简化文章列表页结构。
  - 按 `blog_web/app/blog/posts/page.tsx` 保留 Header、页面标题、分类 Tabs、文章卡片列表、右侧分类、热门标签、博客统计、Footer。
  - 不使用本项目自定义 `BlogHeader`，不添加额外入口按钮。
- 数据来源：
  - 服务端组件 `blog-posts-page.tsx` 调用 `GET /api/v1/public/articles?page=1&pageSize=50`。
  - 客户端组件 `blog-posts-page-client.tsx` 负责分类 / 标签筛选交互。
  - 分类和标签计数从后端文章数据中派生。
  - 后端暂无浏览量、点赞、评论字段，当前按真实缺省值 `0` 展示。
- 已验证：
  - `pnpm build` 构建通过。

## 2026-04-28 `/blog/agent` Agent 列表对齐 blog_web

- 修复 `/blog/agent` 不展示 Agent 的问题：
  - 原因是 `src/app/blog/agent/page.tsx` 直接 `return null`，页面没有任何真实渲染逻辑。
- 按 `blog_web/app/blog/agent/page.tsx` 补齐前台 Agent 列表页：
  - 保留 Header、Hero、Agent 卡片网格、Footer。
  - 不使用本项目自定义 `BlogHeader`，不添加额外入口按钮。
  - UI 结构对齐 `blog_web`，只替换数据来源。
- 新增前台公开 Agent 类型与页面：
  - `src/modules/blog/types/public-agent.ts`
  - `src/modules/blog/components/blog-agent-page.tsx`
- 数据来源：
  - 新增前端 API 调用 `GET /api/v1/public/agents?page=1&pageSize=50`
  - Agent 卡片名称、描述、编码来自后端。
  - 后端暂无对话数字段，当前按真实缺省值 `0` 展示。
- 已验证：
  - `pnpm build` 构建通过。

## 2026-04-28 `/blog/agent/[id]` Agent 对话页开发

- 修复 `/blog/agent/[id]` 点击后没有对话页的问题：
  - 原因是 `src/app/blog/agent/[id]/page.tsx` 仍然是 `return null` 占位页。
- 按 `blog_web/app/blog/agent/[id]/page.tsx` 补齐 Agent 对话页结构：
  - 保留 Header、返回按钮、Agent 信息、消息区、输入区、重新开始按钮。
  - 保留用户消息右侧蓝色气泡、Agent 消息左侧白色气泡的原交互结构。
  - 不再使用模拟 `setTimeout` 回复。
- 新增真实 Agent 调用：
  - 前端调用 `POST /api/v1/agents/{id}/chat`。
  - 请求体使用 `{ query, sessionId, topK }`。
  - 前端不直接访问 `http://localhost:8010/faq/chat`。
  - 未登录时跳转 `/login?redirect=/blog/agent/{id}`。
  - token 失效时清理本地登录态并跳转登录页。
- 新增展示能力：
  - 展示 Agent 返回的 `answer`。
  - 支持展示 `sources` 参考来源。
  - 支持展示 `suggestedQuestions`，点击后可继续提问。
  - 调用失败时使用 `toast.error` 提示，并在消息区保留失败提示。
- 扩展前台 Agent 类型与 API：
  - `PublicAgent` 类型新增 `AgentChatRequest`、`AgentChatResponse`。
  - `public-article-api.ts` 新增 `chatWithAgent`。
- 已验证：
  - `pnpm build` 构建通过。

## 2026-04-28 Agent 推荐追问展示优化

- 根据 FAQ Runtime 响应体中的 `suggestedQuestions` 优化前台 Agent 对话页。
- 调整 `src/modules/blog/components/blog-agent-chat-page.tsx`：
  - 从最近一次助手响应中提取最多 4 个推荐追问。
  - 将推荐追问展示在输入框上方的对话操作区。
  - 推荐追问使用项目现有 `Button` 组件渲染，不新增 UI 依赖。
  - 用户点击推荐追问后，直接复用当前 `handleSend` 链路发起下一轮 Agent 调用。
  - 调用中禁用推荐追问按钮，避免重复发送。
- 已验证：
  - `pnpm build` 构建通过。

## 2026-04-28 前台上传图片访问代理修复

- 修复文章封面在前端页面不显示的问题。
- 问题原因：
  - 数据库中的文章封面 URL 使用 `/uploads/...` 相对路径。
  - 后端通过 `canbe_blog_server` 暴露 `/uploads/**` 静态文件。
  - 前端 `next.config.mjs` 之前只代理 `/api/**`，浏览器访问 `http://localhost:3000/uploads/...` 时会在 Next 前端服务上返回 404。
  - 默认图 `/images/defaults/article-cover.png` 位于前端 `public` 目录能显示，但新迁移封面和主题封面都在后端静态目录，因此不显示。
- 处理方式：
  - 在 `next.config.mjs` 增加 `/uploads/:path*` rewrite，转发到 `BLOG_API_BASE_URL` 对应后端服务。
  - 保持数据库中的 `/uploads/...` 相对路径不变。
- 已验证：
  - `pnpm build` 构建通过。

## 2026-04-28 博客详情页 Header 对齐文章列表页

- 按用户反馈修复 `/blog/posts/[id]` 详情页 Header 与 `/blog/posts` 列表页不一致的问题。
- 问题原因：
  - 详情页仍使用早期 `BlogHeader`，该组件带图标、额外 Agent / 后台按钮，与后来按 `blog_web` 对齐后的列表页 Header 不一致。
- 处理方式：
  - 调整 `src/modules/blog/components/blog-post-detail-page.tsx`。
  - 详情页 Header 改为列表页同款结构：
    - 左侧 `返回管理`
    - 分割线
    - `乘风博客`
    - 右侧 `首页 / 博客 / Agent / 关于`
  - 当前详情页高亮 `博客`。
- 已验证：
  - 首次 `pnpm build` 在收集页面数据阶段报 `/me` 模块找不到，经确认 `src/app/me/page.tsx` 存在，属于 `.next` 构建缓存异常。
  - 清理 `.next` 后重新执行 `pnpm build`，构建通过。

## 2026-04-28 删除未使用 BlogHeader 组件

- 按用户要求删除未使用的旧博客头部组件：
  - `src/modules/blog/components/blog-header.tsx`
- 删除前已确认：
  - `BlogHeader` 只剩组件定义本身，没有业务页面引用。
- 已验证：
  - `rg "BlogHeader|blog-header" src` 无残留引用。
  - `pnpm build` 构建通过。

## 2026-04-28 前台博客 Header 后台入口调整

- 按用户要求统一调整前台博客 Header 中的后台入口。
- 调整范围：
  - `/blog`
  - `/blog/posts`
  - `/blog/posts/[id]`
  - `/blog/agent`
- 处理方式：
  - 移除左侧 `返回管理` 按钮和分割线。
  - 左侧只保留 `乘风博客`。
  - 右侧导航末尾新增普通文本导航项 `后台管理`，链接到 `/dashboard`。
  - `后台管理` 与 `首页 / 博客 / Agent / 关于` 保持同一层级和同一视觉样式。
- 已验证：
  - `rg "返回管理" src/modules/blog` 无残留。
  - `pnpm build` 构建通过。

## 2026-04-28 文章列表卡片 Hover 图片缩放

- 按用户要求调整 `/blog/posts` 文章列表卡片 hover 效果。
- 处理方式：
  - 列表卡片增加 `group`。
  - 图片容器增加 `overflow-hidden`。
  - 图片增加 `transition-transform duration-300 group-hover:scale-105`。
  - 卡片阴影从 `hover:shadow-md` 调整为 `hover:shadow-lg`，与 `/blog` 首页精选文章保持一致。
- 已验证：
  - `pnpm build` 构建通过。

## 2026-04-28 首页 Hero 头像替换

- 按用户提供的图片替换 `/blog` 首页 Hero 右侧头像区域。
- 新增前端静态资源：
  - `public/images/profile/home-avatar.jpg`
- 调整 `src/modules/blog/components/blog-home-page.tsx`：
  - 将原来的圆形渐变背景 + `乘` 字占位头像改为真实图片。
  - 保留原有 64x64 圆形尺寸、白色边框和阴影。
  - 图片使用 `object-cover` 适配圆形头像区域。
- 已验证：
  - `pnpm build` 构建通过。
  - 构建过程中曾遇到 `.next` trace / 页面模块缓存异常，清理 `.next` 后重跑通过。

## 2026-04-28 站点配置前端接入

- 按用户确认，将前台首页可维护信息纳入后台站点配置，“关于”入口暂不处理。
- 新增站点配置类型与 API：
  - `src/modules/system/types/site-config.ts`
  - `src/modules/system/api/site-config-api.ts`
- `/dashboard/site-config` 已从占位页改为真实站点配置页面：
  - `src/modules/system/components/site-config-management-page.tsx`
  - 支持维护站点名称、Logo、首页提示语、首页标题、强调文字、首页简介、首页头像、GitHub / Twitter / 联系方式链接、总浏览量、开源项目数量、页脚年份和页脚文案。
  - 保存按钮按 `siteConfig:update` 权限控制。
- `/blog` 首页已接入 `GET /api/v1/site-config`：
  - Header 使用配置中的站点名称和 Logo。
  - Hero 使用配置中的文案和头像。
  - 社交按钮使用配置中的链接，链接为空时禁用跳转。
  - 首页统计中“文章”数量仍从公开文章接口真实统计，“总浏览量”和“开源项目”读取站点配置。
  - Footer 使用配置中的年份和文案。
- 已验证：
  - `pnpm build` 构建通过。

## 2026-04-29 Dify 嵌入式 Agent 前端接入

- 按用户提供的 Dify iframe 地址，补齐前台 Agent iframe 展示能力。
- 扩展 Agent 前端类型：
  - `src/modules/agent/types/agent.ts` 新增 `embedUrl`
  - `src/modules/blog/types/public-agent.ts` 新增 `embedUrl`
- 调整后台 Agent 管理页：
  - `src/modules/agent/components/agent-management-page.tsx`
  - 新增“嵌入地址”字段与表格列。
  - 创建 / 编辑 Agent 时允许 `runtimeUrl` 或 `embedUrl` 二选一，至少填写一个。
- 调整前台 Agent 详情页：
  - `src/modules/blog/components/blog-agent-chat-page.tsx`
  - `embedUrl` 不为空时，优先渲染 iframe，并允许 `microphone`。
  - `embedUrl` 为空时，继续使用原有项目内置聊天页面。
- 本次 Dify Agent iframe 地址：
  - `http://192.168.11.21/chatbot/LQ9MAToieqjkmBiV`
- 已验证：
  - `pnpm build` 构建通过。

## 2026-04-29 Dify 嵌入页宽度对齐

- 按用户反馈调整 Dify 嵌入式 Agent 详情页宽度。
- 调整 `src/modules/blog/components/blog-agent-chat-page.tsx`：
  - Dify iframe 页 header 从 `max-w-6xl` 改为 `max-w-4xl`。
  - iframe 外层增加 `max-w-4xl mx-auto px-6 py-6` 容器。
  - 现在 Dify 嵌入页宽度与普通自定义 Agent 对话页保持一致。
- 已验证：
  - `pnpm build` 构建通过。

## 2026-04-29 撤销 Dify iframe 并改为后端代理

- 按用户确认，撤销上次 Dify iframe 接入方式，Dify 不再绕过后端。
- 调整前台 Agent 详情页：
  - `src/modules/blog/components/blog-agent-chat-page.tsx`
  - 删除 `embedUrl` 优先渲染 iframe 的分支。
  - `/blog/agent/[id]` 统一进入项目内置对话页，并继续调用 `POST /api/v1/agents/{id}/chat`。
- 调整后台 Agent 管理页：
  - `src/modules/agent/components/agent-management-page.tsx`
  - 表格和表单改为 provider 配置：`providerType`、`runtimeUrl`、`apiUrl`、`apiKey`、`responseMode`。
  - V1 Dify 响应模式只提供 `blocking`。
  - API Key 仅用于提交，不展示明文；列表只展示是否已配置。
  - 不再配置“嵌入地址”作为前台体验入口。
- 更新前端类型：
  - `src/modules/agent/types/agent.ts`
  - `src/modules/blog/types/public-agent.ts`
- 已同步规范：
  - `PROJECT_RULES.md` 明确 Dify 等第三方 Agent 必须由后端 provider 代理调用，前端不直接调用第三方 API，也不渲染 iframe。
- 已验证：
  - `pnpm build` 构建通过。

## 2026-04-29 页面主体与表格自适应宽度

- 按用户要求调整所有页面主体区域，避免出现页面级横向滚动轴。
- 调整公共布局：
  - `src/app/globals.css`：限制 `html/body` 页面级横向溢出。
  - `src/components/ui/sidebar.tsx`：为后台整体壳和主体区域增加 `min-w-0 / max-w-full`，避免 sidebar + content 把页面撑宽。
  - `src/modules/dashboard/components/dashboard-shell.tsx`：header、tabs、main 主体增加自适应收缩边界。
- 调整表格策略：
  - `src/components/ui/table.tsx`：表格固定 `w-full table-fixed`，不再通过表格自身产生横向滚动。
  - 表头和单元格内容在固定宽度内截断，不再撑开主体页面。
  - `src/modules/dashboard/components/admin-resource-page.tsx` 和 `src/modules/file/components/file-management-page.tsx` 补齐单元格内容截断。
- 调整前台移动端自适应：
  - `/blog` 精选文章网格改为 `1 / 2 / 3` 列响应式。
  - `/blog/agent` Agent 卡片网格改为 `1 / 2 / 3` 列响应式。
  - `/blog/posts` 列表卡片小屏从横排改为上下布局。
- 已验证：
  - 首次 `pnpm build` 遇到 Next `.next` 缓存异常 `Cannot find module for page: /_document`。
  - 清理 `.next` 后重跑 `pnpm build` 构建通过。

## 2026-04-29 表格关键列与详情弹窗

- 按用户反馈进一步调整后台表格：表格只展示关键讯息，长内容不再占用列表宽度。
- 通用后台表格能力：
  - `src/modules/dashboard/components/admin-resource-page.tsx`
  - 新增 `detailFields` 配置。
  - 操作列新增“详情”按钮，点击后使用 shadcn `Dialog` 展示完整字段。
  - 操作列固定为 132px，承载详情、编辑、删除。
- 已收敛列表列宽和列数：
  - `src/modules/agent/components/agent-management-page.tsx`
  - `src/modules/content/components/article-management-page.tsx`
  - `src/modules/system/components/menu-management-page.tsx`
  - `src/modules/user/components/admin-account-management-page.tsx`
  - `src/modules/agent/components/agent-call-record-management-page.tsx`
  - `src/modules/user/components/role-management-page.tsx`
  - `src/modules/content/components/category-management-page.tsx`
  - `src/modules/system/components/dict-management-page.tsx`
  - `src/modules/content/components/tag-management-page.tsx`
- 文件管理页单独补齐详情弹窗：
  - `src/modules/file/components/file-management-page.tsx`
- 已同步规范：
  - `PROJECT_RULES.md` 补充表格只展示关键字段、长内容进入详情弹窗、表格不撑出页面横向滚动轴。
- 已验证：
  - 首次 `pnpm build` 仍遇到 Next `.next` 缓存异常 `Cannot find module for page: /_document`。
  - 清理 `.next` 后重跑 `pnpm build` 构建通过。

## 2026-04-29 后台编辑弹窗高度修正

- 按用户反馈修复 Agent 编辑页面表单过长、确认按钮超出屏幕的问题。
- 调整通用后台资源页：
  - `src/modules/dashboard/components/admin-resource-page.tsx`
  - 新增 / 编辑弹窗最大高度限制为当前视口内。
  - 表单字段区域改为弹窗内部滚动。
  - 底部“取消 / 确定”操作区固定保留在弹窗可视范围内。
  - 宽屏下表单字段改为两列展示，URL、描述、正文、摘要、权限标识、组件路径等长字段独占整行。
- Agent 管理、文章管理、菜单管理等复用通用资源页的长表单会一起继承该修正。
- 已同步前端规范：
  - `PROJECT_RULES.md` 增加后台 CRUD 弹窗高度、滚动和长字段布局规则。

## 2026-04-29 交互控件小手光标统一

- 按用户反馈修复详情弹窗右上角关闭按钮不是小手的问题。
- 在 `src/components/ui` 基座层统一可点击控件光标：
  - `button.tsx`：官方 Button 默认增加 `cursor-pointer`。
  - `dialog.tsx`：Dialog 右上角关闭按钮和 `DialogClose` 默认增加 `cursor-pointer`。
  - `sheet.tsx`：Sheet 右上角关闭按钮和 `SheetClose` 默认增加 `cursor-pointer`。
  - `select.tsx`：Select 触发器和下拉选项默认增加 `cursor-pointer`。
- 复用 `buttonVariants` 的 AlertDialog 确认 / 取消、分页按钮、业务 Button 会一起继承小手样式。
- 已同步前端规范：
  - `PROJECT_RULES.md` 增加可点击控件必须有明确交互光标的规则。

## 2026-04-30 Agent 对话 Markdown 渲染兼容

- 修复大模型返回 Markdown 内容在 Agent 对话框中原样显示的问题，例如 `**加粗**`、`- 列表` 无法按格式展示。
- 新增轻量安全渲染组件：
  - `src/modules/blog/components/markdown-message.tsx`
- 渲染策略：
  - 不新增第三方 Markdown 依赖，避免扩大前端技术栈。
  - 不使用 `dangerouslySetInnerHTML`，通过 React 节点渲染降低 XSS 风险。
  - 支持常见大模型输出格式：标题、段落、无序列表、有序列表、引用、代码块、行内代码、加粗、安全链接。
  - 链接只允许 `http://`、`https://`、`mailto:`，其它协议按普通文本处理。
  - 助手消息按 Markdown 渲染，用户消息继续按普通文本展示。
- 调整 Agent 对话页：
  - `src/modules/blog/components/blog-agent-chat-page.tsx`
  - 助手气泡接入 `MarkdownMessage`。
  - 长文本启用自动换行，避免撑出对话框。
- 已验证：
  - `pnpm build` 构建通过。

## 2026-04-30 Agent 参考来源视觉归组

- 按用户确认的业界通用样式，调整 Agent 对话页的 `sources` 展示方式。
- 调整文件：
  - `src/modules/blog/components/blog-agent-chat-page.tsx`
- 视觉规则：
  - 参考来源不塞进 Markdown 正文气泡内部。
  - 参考来源紧跟助手回答气泡下方，作为同一条助手消息的附属区域展示。
  - 来源区增加“参考来源”弱标题，左侧短分割线辅助归组。
  - 来源卡片使用更小字号、更轻边框、更紧凑高度，降低视觉重量。
  - 有 `sourceUrl` 的来源使用可点击链接并显示外链图标。
  - 无 `sourceUrl` 的来源展示为普通信息卡片，不给错误点击态。
  - 默认最多展示 3 条来源，多余来源通过“查看更多来源”展开，支持收起。
- 已验证：
  - `pnpm build` 构建通过。

## 2026-04-30 Agent 参考来源前台简化

- 按用户确认的方案 A，继续精简前台 Agent 参考来源展示。
- 调整文件：
  - `src/modules/blog/components/blog-agent-chat-page.tsx`
- 展示规则：
  - 前台参考来源只展示编号、来源标题和外链图标。
  - 不再展示 `source.source` / `source.category` 这类来源类型文本。
  - 不再展示 `score` 匹配度，匹配度作为内部检索指标保留在接口数据中，不面向普通用户展示。
  - 仍保留默认展示 3 条、更多来源展开 / 收起逻辑。
- 已验证：
  - `pnpm build` 构建通过。

## 2026-04-30 Agent fallback 前端临时兼容撤回

- 用户确认 fallback 文案属于后端 Agent 网关职责后，前端撤回临时业务判断。
- 调整文件：
  - `src/modules/blog/components/blog-agent-chat-page.tsx`
- 当前规则：
  - 前端不再根据 `fallback` 或回答文本识别并替换文案。
  - 前端只展示后端返回的 `answer`。
- 仅在后端返回空 `answer` 时保留最低兜底：`Agent 暂未返回内容`。
- 无命中 / fallback 的客服化文案统一由 `canbe_blog_server` 负责。
- 正常回答、参考来源和推荐追问逻辑不受影响。

## 2026-04-30 Agent 推荐追问跟随消息展示

- 根据用户反馈，修正推荐追问不在 fallback 回答附近展示的问题。
- 调整文件：
  - `src/modules/blog/components/blog-agent-chat-page.tsx`
- 处理方式：
  - 推荐追问从输入框上方的全局区域移到当前助手消息下方。
  - 每条助手消息如果带 `suggestedQuestions`，就在该条回答下展示“你可以试试”。
  - 默认最多展示 4 个推荐问题。
  - 点击推荐问题继续复用当前 Agent 发送链路。
  - 发送中禁用推荐问题按钮，避免重复请求。
- 已验证：
  - `pnpm build` 构建通过。

## 2026-04-30 Agent 推荐追问与参考来源视觉规则补充

- 按用户截图反馈，明确 Agent 对话区中推荐追问和参考来源不是同一种样式。
- 已同步前端规范：
  - `PROJECT_RULES.md`
- 规则说明：
  - `suggestedQuestions` 展示为“你可以试试”的轻量 chip / pill 追问按钮。
  - `sources` 展示为“参考来源”的列表卡片，包含编号、标题和外链入口。
  - fallback / 未命中回答下方可以展示推荐追问，但不要展示空来源或伪来源。
  - 正常命中回答下方如果同时有参考来源和推荐追问，必须通过标题、间距、边框强度区分层级。
