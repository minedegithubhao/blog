# canbe_blog_web 项目规范

最后更新：2026-04-28

本文档只描述前端项目 `canbe_blog_web` 的专属规范。

阅读顺序：

1. 先读 [COMMON_RULES.md](D:/IdeaProjects/blog/COMMON_RULES.md)
2. 再读本文档
3. 最后读 [TASKS_DONE.md](D:/IdeaProjects/blog/canbe_blog_web/TASKS_DONE.md)

## 1. 技术栈

- Next.js 15
- React 19
- TypeScript
- App Router
- Tailwind CSS 4
- shadcn/ui
- Radix UI
- lucide-react
- react-hook-form
- zod
- sonner

## 2. 目录结构

推荐结构：

```text
src
├── app
├── modules
├── components
│   └── ui
├── lib
├── hooks
├── styles
└── types
```

职责：

- `app`：路由、布局、页面入口。
- `modules`：业务模块。
- `components/ui`：官方 UI 基座。
- `lib`：请求封装、工具、常量。
- `hooks`：通用 hook。
- `types`：通用类型。

## 3. 业务模块划分

```text
modules
├── auth
├── dashboard
├── content
├── agent
├── quota
├── user
├── file
└── system
```

模块内部统一结构：

```text
module
├── api
├── components
├── hooks
├── types
├── schemas
├── utils
└── constants
```

## 4. UI 组件规则

- 所有基础交互控件必须优先从 `src/components/ui` 使用。
- 已有官方组件时，业务目录禁止重复手写一套同职责组件。
- 当前至少统一以下控件：
  - `Button`
  - `Input`
  - `Textarea`
  - `Select`
  - `Checkbox`
  - `Dialog`
  - `Sheet`
  - `Tabs`
  - `Table`
  - `Pagination`
  - `Badge`
  - `Tooltip`
  - `Skeleton`
  - `Sidebar`
  - `Toaster`
- 如果缺少组件，先按 shadcn/ui 官方方式补到 `src/components/ui`，再供业务使用。
- 禁止引入第二套大型 UI 框架，例如 Ant Design、Element、MUI。

## 5. 样式规则

- 允许改主题色、间距、布局级样式。
- 不允许把官方组件行为替换成手写 DOM + 自定义交互。
- 不允许为了局部视觉差异，再造一套 look-alike 按钮、输入框、弹窗、表格、分页、Tabs。
- 图标统一优先使用 `lucide-react`。
- 可点击控件必须有明确交互光标：按钮、弹窗关闭、抽屉关闭、分页、下拉触发器、下拉选项、菜单项等可点击元素默认使用小手样式；禁用态保持不可点击语义。

## 6. 路由与页面规则

前台页面必须包含：

- `/`
- `/blog`
- `/blog/posts`
- `/blog/posts/[id]`
- `/blog/agent`
- `/blog/agent/[id]`
- `/login`
- `/register`
- `/me`

后台页面必须包含：

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

## 7. 组件职责划分

页面组件：

- 负责路由入口和模块组合。
- 禁止堆积复杂业务逻辑。

业务组件：

- 负责具体业务 UI。
- 可以调用本模块 hook。
- 禁止直接拼接后端 URL。

API 层：

- 只负责请求后端。
- 统一处理 `Result<T>`。
- 禁止包含 UI 逻辑。

Hook 层：

- 负责数据获取、交互状态、表单状态。
- 禁止写大型 JSX。

## 8. Server Component / Client Component

- 默认使用 Server Component。
- 以下场景才使用 Client Component：
  - 表单输入
  - 弹窗
  - 下拉菜单
  - SSE 连接
  - 浏览器事件
  - 本地状态
  - `useEffect` / `useState` / `useRef`
- `use client` 文件越小越好。

## 9. 提示信息与异常处理

全局提示规则：

- 非阻塞提示统一使用 `sonner`。
- 全局 `Toaster` 位置统一为 `top-center`。
- 提示样式统一采用 `sonner` 的实心色块风格（solid / richColors）。
- V1 不显示 toast 关闭叉号。
- 成功统一 `toast.success`。
- 错误统一 `toast.error`。
- 警告统一 `toast.warning`。
- 登录态 V1 统一按最简实现处理：token 默认有效期 1 个月，不做 refresh token，不做滑动续期。

分层规则：

- 页面级问题由页面承接，例如 `404`、`403`、全局崩溃。
- 操作结果由 toast 承接，例如保存成功、删除失败、批量部分成功。
- 字段错误由表单承接，例如必填、格式、长度错误。

必须覆盖的前端场景：

- 未登录访问受保护页面。
- token 过期、token 失效、旧 token 访问。
- 已登录但无权限。
- 页面路由不存在、详情资源不存在。
- 参数错误、字段校验失败、业务冲突。
- 网络断开、请求超时、服务不可用。
- Next.js 运行时异常、chunk 资源 404。
- SSE / Agent 连接失败、中断、超时、繁忙。

SSE / Agent 中断的 V1 最简实现：

- 保留已输出的半段内容。
- 消息状态从“生成中”切到“已中断”。
- 消息尾部展示中断原因。
- 统一提供“重新生成”动作。
- 半段内容与中断状态需要持久化，刷新页面后仍然可见。
- 不做自动续流，不做“继续生成”。

Agent 对话区视觉规则：

- 助手回答、推荐追问、参考来源是三种不同信息层级，不允许混成同一种卡片样式。
- `suggestedQuestions` 用于“你可以试试”追问区，紧跟当前助手消息，使用轻量 chip / pill 按钮样式，强调可继续提问。
- `sources` 用于“参考来源”资料区，紧跟命中的助手回答，使用列表卡片样式，强调来源编号、标题和外链入口。
- fallback / 未命中回答下方可以展示推荐追问，但不要展示空来源或伪来源。
- 正常命中回答下方可以同时展示参考来源和推荐追问，两者必须用标题、间距、边框强度区分。

## 10. 鉴权与跳转规则

- `401`：清理登录态，跳转登录页，并保留 `redirect`。
- `403`：进入无权限页或无权限态，不跳登录页。
- `404`：页面类问题进入站内 404；接口类问题按页面详情或操作提示分别处理。
- `500/502/503/504`：统一友好提示，并提供重试或刷新能力。
- V1 页面兜底最简实现：
  - 前台单独一套 `404`
  - 后台单独一套 `404`
  - 后台单独一套 `403`
  - `401` 不做独立页面，直接跳登录页
- Tabs 持久化最简实现：
  - 使用 `localStorage`
  - 存 `tabs + activeTabKey`
  - key 按项目和用户隔离
  - 登录恢复，退出清空
- 页面文案最简约定：
  - 前台 `404`：页面不存在；返回首页 / 去博客列表 / 去 Agent 专栏
  - 后台 `404`：页面不存在；返回仪表盘 / 返回上一页
  - 后台 `403`：无权限访问；返回仪表盘 / 返回上一页

## 11. 后台页面统一要求

后台 CRUD 页面统一包含：

- 标题
- 筛选区
- 操作区
- 表格
- 分页
- 新增弹窗或抽屉
- 编辑弹窗或抽屉
- 删除确认

表格规则：

- 列字段必须来自接口 VO。
- 禁止直接假设数据库字段名。
- 时间字段统一格式化。
- 状态字段使用 Badge。
- 删除操作必须二次确认。
- 列表表格只展示最关键的识别、状态、排序或时间等字段。
- 长 URL、长描述、正文、权限标识、错误详情等非关键字段必须放入“详情”弹窗，不直接铺在列表表格中。
- 表格宽度固定铺满当前主体区域，不允许因为内容过长撑出页面级横向滚动轴。
- 操作列固定放在表格最右侧，至少可承载“详情 / 编辑 / 删除”等操作。

新增 / 编辑弹窗规则：

- 后台 CRUD 新增 / 编辑弹窗必须限制在当前视口内，不能让确认按钮超出屏幕。
- 长表单统一采用弹窗内容区内部滚动，底部操作按钮固定留在弹窗可视范围内。
- 宽屏下表单字段可使用两列布局；URL、正文、摘要、描述、备注、权限标识、组件路径等长字段应独占整行。
- 不允许通过扩大页面高度或产生页面级滚动来兜底长表单。

## 12. 菜单与权限最简实现

- V1 采用“前端静态路由 + 后端菜单树与权限控制”模式。
- 页面组件和路由定义仍保留在前端代码中。
- 后端负责菜单树、菜单可见性、权限标识。
- 前端根据后端菜单树渲染侧边栏、tab、面包屑和按钮显隐。
- V1 纳入按钮级权限：
  - 前端根据权限集合控制按钮显示，无权限按钮直接隐藏
  - 后端关键接口继续做服务端权限校验

## 13. 注册、内容可见性与文件最简规则

- 注册规则：
  - 用户名唯一
  - 昵称可重复
  - 邮箱可为空
  - 密码最小长度 6 位
  - 前端有确认密码字段，后端只接收一个 `password`
- 前台可见性：
  - 草稿内容前台不可见
  - 下架内容前台不可见
  - 前台访问草稿或下架文章、Agent 时统一按 `404` 处理
- 文件：
  - V1 使用本地磁盘上传
  - 只允许常见图片
  - 单文件大小限制 5MB
  - 文件访问 URL 统一使用 `/uploads/...`
  - 删除文件不做引用检查
  - 被引用处由前端统一兜底默认图
- 用户与默认图：
  - 用户名只允许字母、数字、下划线
  - 用户名长度 4 到 20 位
  - 昵称最大长度 20
  - 默认图统一放在前端静态资源目录
  - 头像统一通过 `AvatarFallback` 兜底
  - 普通图片统一通过 `AppImage` 或等价组件做 fallback
- 删除确认：
  - 统一使用 `AlertDialog`
  - 不再使用 `window.confirm`
- 上级菜单选择：
  - 统一采用 `Popover + Command + 树形缩进列表`
  - 提交值仍然是 `parentId`
  - 提供“顶级菜单”选项，对应 `parentId = 0`
  - 编辑时禁选自己和自己的子孙节点
- Remember Me：
  - V1 直接去掉
- 菜单树接口消费：
  - 接口路径：`GET /api/v1/me/navigation`
  - 后端返回 `menus + permissions`
  - 前端根据菜单树渲染导航 / 面包屑 / tabs
  - 后端已按权限预过滤菜单树
  - `icon` 使用 Lucide 图标名字符串，前端通过白名单 `iconMap` 映射
  - 后端允许保存任意图标字符串，前端未命中统一 fallback 默认图标
  - `component` 仅做元数据展示，不作为前端动态渲染依据
- 图片上传返回值使用：
  - 接口返回 `id/url/filename/size/contentType`
  - V1 业务表单字段直接保存 `url`
- 额度：
  - V1 按次扣减
  - 默认总计 10 次
  - 请求开始前先检查是否还有剩余额度
  - 只有剩余额度大于 0 才允许请求开始
  - 请求成功后扣减，请求失败不扣减
  - V1 不做流式过程中按次额度中断
  - 不做 token 级精细扣减
  - 额度字段模型统一按：
    - `totalQuota`
    - `usedQuota`
    - `remainingQuota`

## 14. 前台页面拆分规则

- 前台博客与 Agent 页面按用户访问路径拆任务。
- 推荐顺序：
  - 公共层：布局、公共卡片、默认图组件、分页 / 空态 / 404 组件
  - 博客线：`/blog`、`/blog/posts`、`/blog/posts/[id]`
  - Agent 线：`/blog/agent`、`/blog/agent/[id]`
  - 体验链路：Agent 登录拦截、会话区、SSE 中断 / 超时 / 失败 / 重试
- 前台页面参考 `blog_web` 时，交互、筛选、布局、卡片比例、详情页结构都尽量一致。
- 前台 Agent 详情页展示规则：
  - 前端统一使用项目内置聊天页。
  - 前端统一调用 `POST /api/v1/agents/{id}/chat`。
  - Dify 等第三方 Agent 必须由后端 provider 代理调用，前端不直接调用第三方 API，也不渲染 iframe。
  - V1 Dify 只支持 `responseMode = blocking`，前端暂不提供 Dify streaming 配置。
  - API Key 等第三方密钥禁止进入前端响应和前端存储。

## 15. 站点配置前端规则

- `/dashboard/site-config` 负责维护站点配置。
- 前台首页 `/blog` 必须优先读取 `GET /api/v1/site-config`，失败时使用前端默认配置兜底，不能让首页空白。
- 站点配置字段统一为：
  - `siteName`
  - `logoUrl`
  - `heroEyebrow`
  - `heroTitle`
  - `heroTitleHighlight`
  - `heroSubtitle`
  - `profileAvatarUrl`
  - `githubUrl`
  - `twitterUrl`
  - `contactUrl`
  - `totalViews`
  - `projectCount`
  - `footerYear`
  - `footerText`
- 首页文章数量必须从公开文章接口真实统计，不从站点配置读取。
- GitHub / Twitter / 联系方式链接为空时，前端按钮可展示为禁用态或不提供跳转，不能跳到无效地址。
- “关于”入口暂不做配置化，保持当前静态导航处理。

## 16. 明确禁止

- 前端直接调用 Python Runtime。
- 前端直接调用 MySQL、Redis。
- 组件里直接写 `fetch` 乱发请求。
- 在业务目录重复造基础 UI 轮子。
- 为了视觉需求引入第二套 UI 框架。

## 17. 常用命令

```powershell
pnpm install
pnpm build
pnpm dev --hostname 127.0.0.1 --port 3000
```

## 18. 验收与 smoke test

- 默认最低验收标准：`pnpm build`
- 以下高风险改动必须额外做手工 smoke test：
  - 登录 / 退出登录
  - 权限 / 菜单 / 路由
  - 文件上传
  - Agent / SSE
  - 额度扣减
