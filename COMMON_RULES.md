# 乘风博客前后端共同规范

最后更新：2026-04-28

本文档是 `canbe_blog_web` 与 `canbe_blog_server` 的共同规范提炼版。

阅读顺序：

1. 先读本文档。
2. 再读各项目根目录下的 `PROJECT_RULES.md`。
3. 最后读各项目根目录下的 `TASKS_DONE.md` 了解当前进展。

本文档来源于 [博客功能介绍.md](D:/IdeaProjects/blog/博客功能介绍.md)，用于把共同规则集中到一处，减少前后端重复阅读成本。

## 1. 项目定位

- 乘风博客 V1 是轻量级内容分发与 Agent 体验平台。
- 核心闭环是：内容发布、用户登录、角色控制、额度校验、Agent 体验、调用记录、后台管理。
- 一期优先单机部署和本地联调，不做复杂社区化、多租户、商业化能力。

## 2. V1 必做能力

- 后台登录、后台账号管理、角色管理、当前登录用户查询、后台基础看板。
- 文章、分类、标签、文件、站点配置。
- 前台首页、文章列表、文章详情、登录、注册、个人页。
- Agent 列表、详情、体验入口、会话、消息、SSE 流式响应、调用记录。
- 用户角色、默认额度、用户覆盖额度、后台额度查询与调整。

## 3. 当前明确不做

- 评论、点赞、收藏、打赏。
- 复杂审核流、多作者协作。
- 关注、私信、动态流、积分等级。
- 支付、会员订阅、订单系统。
- 多租户、微服务拆分、复杂权限矩阵、工作流引擎。
- 第三方登录、短信登录、邮箱验证、复杂找回密码。

## 4. 统一技术边界

- 前端只允许调用后端，不允许直接调用数据库、Redis、Python Runtime。
- 后端是唯一业务入口，负责认证、权限、额度、内容、Agent 网关、异常转换。
- Python Agent Runtime 只负责执行 Agent，不负责登录、权限、额度、博客业务库写入。
- 一期保持 Spring Boot 单体应用，不引入微服务框架，不引入 WebFlux。
- V1 前台用户与后台账号临时共用 `blog_account` 一张表，后续如有必要再拆分。

## 5. 统一请求链路

普通请求：

```text
Browser -> canbe_blog_web -> canbe_blog_server -> MySQL/Redis
```

Agent SSE：

```text
Browser -> canbe_blog_web -> canbe_blog_server -> agent-call-pool -> python-agent-runtime
```

## 6. 前后端接口共同约束

- 接口统一走 `/api/v1/**`。
- 统一响应结构：

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

- 分页统一使用：`page`、`pageSize`。
- 分页响应统一为：`list`、`total`、`page`、`pageSize`。
- 列表空值返回 `[]`，字符串空值返回 `""`，对象不存在返回 `null`。

## 7. HTTP 状态语义

后端不能把所有异常都包成 HTTP `200`。推荐逐步收敛到以下语义：

- `200`：成功。
- `400`：参数错误。
- `401`：未登录、token 缺失、token 无效、token 过期。
- `403`：已登录但无权限。
- `404`：页面不存在、接口不存在、资源不存在。
- `409`：资源冲突，例如用户名重复、编码重复。
- `422`：业务校验失败但请求语法正确，可按实际情况选用。
- `429`：限流、请求过于频繁。
- `500`：系统内部异常。
- `502`：上游服务异常。
- `503`：服务暂不可用、线程池繁忙、Agent Runtime 不可用。
- `504`：上游调用超时、Agent 响应超时。

## 8. 前端和后端错误协作规则

- `401`：前端清理登录态，跳登录页，并保留 `redirect`。
- `403`：前端进入无权限页或无权限态，不跳登录页。
- `404`：页面类问题由页面承接，接口类问题按详情页或操作型场景分别处理。
- `409`：前端优先展示冲突原因，必要时绑定到具体字段。
- `500/502/503/504`：前端统一展示友好错误提示，并提供刷新或重试能力。

## 9. 常见异常场景总规则

异常处理遵守三层分工：

- 页面级问题由页面承接，例如 `404`、`403`、全局崩溃。
- 操作结果由 toast 承接，例如保存成功、删除失败、批量操作部分成功。
- 字段错误由表单承接，例如必填缺失、格式错误、长度错误。

必须覆盖的场景：

- 未登录访问受保护页面。
- token 失效、token 过期、退出后旧 token 访问。
- 已登录但权限不足。
- 页面路由不存在、详情资源不存在。
- 表单校验失败、参数不合法。
- 业务冲突、额度不足、危险操作确认。
- 网络断开、请求超时、服务端异常、服务不可用。
- Next.js 运行时异常、chunk 资源 404。
- SSE / Agent 连接失败、中断、超时、繁忙。

SSE / Agent 中断的 V1 最简实现：

- 保留已经输出的半段内容，不清空。
- 消息状态从“生成中”切到“已中断”。
- 明确展示中断原因。
- 统一提供“重新生成”作为恢复动作。
- 半段内容与中断状态需要持久化，刷新后仍然可见。

## 10. V1 最简实现约定

- 角色模型统一使用单角色，即一个用户只绑定一个 `roleCode`。
- Agent 调用记录状态统一为：`SUCCESS`、`FAILED`、`TIMEOUT`、`INTERRUPTED`。
- 更细错误原因通过 `errorCode`、`errorMessage` 承接。
- Agent 元数据统一采用 provider 化后端代理调用：
  - `providerType = CUSTOM`：由后端使用 `runtimeUrl` 代理调用自定义 Agent Runtime。
  - `providerType = DIFY`：由后端使用 `apiUrl`、`apiKey`、`responseMode` 代理调用 Dify API。
- V1 Dify 只支持 `responseMode = blocking`，暂不接入 Dify streaming。
- 前端统一调用 `POST /api/v1/agents/{id}/chat`，不直接调用 Python Runtime、Dify API 或 iframe 地址。
- Dify API Key 只允许保存在后端或数据库，禁止返回给前端。
- iframe 嵌入方式不再作为 V1 受额度控制 Agent 的实现方式。
- 文件上传 V1 统一使用本地磁盘。
- 本地文件推荐落盘目录为 `storage/uploads/年/月/日/`。
- 文件访问 URL 统一使用静态暴露路径 `/uploads/...`。
- 文件删除不做引用检查，允许删除，被引用处由前端兜底默认图。
- 菜单系统采用“前端静态路由 + 后端菜单树与权限控制”的最简实现。
- V1 纳入按钮级权限，前端直接隐藏无权限按钮，后端接口保留服务端权限校验。
- 用户注册最简规则：用户名唯一、昵称可重复、邮箱可为空、密码最小长度 6 位、前端做确认密码、后端只接收一个 `password`。
- 草稿与下架内容前台统一不可见，按 `404` 处理。
- 额度 V1 按次扣减，默认总计 10 次，不按 token 扣减。
- 请求开始前先检查是否还有剩余额度。
- 只有剩余额度大于 0 才允许请求开始。
- 额度扣减时机统一为请求成功后扣减，请求失败不扣减。
- V1 不做流式过程中按次额度中断。
- 登录态 V1 统一按最简实现处理：token 默认有效期 1 个月，不做 refresh token，不做滑动续期。
- 文件上传 V1 最简限制：只允许 `jpg/jpeg/png/webp`，单文件大小限制 5MB。
- 用户名最简规则：只允许字母、数字、下划线，长度 4 到 20 位。
- 昵称最大长度统一为 20。
- 前台注册默认 `roleCode = USER`。
- 默认图统一放在前端静态资源目录。
- V1 页面兜底最简实现：
  - 前台单独一套 404
  - 后台单独一套 404
  - 后台单独一套 403
  - 401 不做独立页面，直接跳登录页
- Tabs 持久化统一使用 `localStorage`，按项目和用户隔离 key，保存 `tabs` 与 `activeTabKey`，登录恢复，退出清空。
- 删除确认统一使用 `AlertDialog`，不使用 `window.confirm`。
- 上级菜单选择统一采用 `Popover + Command + 树形缩进列表`。
- 上级菜单选择统一提供“顶级菜单”，编辑时禁选自己和自己的子孙节点。
- Remember Me 在 V1 直接去掉。
- 全局提示统一采用 `sonner` 顶部居中、实心色块（solid / richColors）风格。
- V1 不显示 toast 关闭叉号。
- 默认图统一通过业务公共组件处理：
  - 头像走 `AvatarFallback`
  - 普通图片走 `AppImage` 或等价 fallback 组件
- 默认图资源路径统一为：
  - `/images/defaults/article-cover.png`
  - `/images/defaults/agent-cover.png`
  - `/images/defaults/avatar.png`
- 后端菜单树接口最简返回结构统一为：
  - 路径：`GET /api/v1/me/navigation`
  - `menus: MenuTreeNode[]`
  - `permissions: string[]`
- 后端允许保存任意图标字符串。
- 图片上传接口统一返回：
  - `id`
  - `url`
  - `filename`
  - `size`
  - `contentType`
- V1 业务表单字段直接保存 `url`。
- `component` 字段最简校验规则：
  - `CATALOG`：可空
  - `MENU`：必填
  - `BUTTON`：为空
- 额度模型统一为：
  - `totalQuota`
  - `usedQuota`
  - `remainingQuota`
- 站点配置 V1 统一承接以下前台首页可人工维护内容：
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
- 首页文章数量必须从真实公开文章接口统计得出，不写入站点配置。
- “关于”入口暂不纳入站点配置，后续明确前台信息架构后再处理。

## 11. 目录与文档协作约束

- 根目录保留本共同规范文档。
- 前端根目录必须包含：
  - `PROJECT_RULES.md`
  - `TASKS_DONE.md`
- 后端根目录必须包含：
  - `PROJECT_RULES.md`
  - `TASKS_DONE.md`
- 做任务前先读规范文档，再读进展文档。
- 完成重要改动后更新对应项目的 `TASKS_DONE.md`。

## 12. 实施优先级

第一优先级：

- 后端基础工程。
- MySQL 表结构。
- 后台登录。
- 文章、分类、标签、文件。
- 前台首页、文章列表、文章详情。

第二优先级：

- Agent 元数据管理。
- Agent 前台列表和详情。
- Agent Runtime 调用。
- SSE 流式响应。
- 调用记录。

第三优先级：

- 前台用户注册登录。
- 角色 Agent 策略。
- 用户额度。
- 额度扣减。
- 后台额度管理。

第四优先级：

- 站点配置。
- 后台看板。
- 监控指标。
- 部署脚本完善。

## 13. 开发行为约束

- 用最简单直接的方式实现功能，不做过度抽象。
- 不新增技术栈外依赖，确需新增时先说明理由并等待确认。
- 所有外部调用必须有超时、日志和错误码。
- 所有配置项必须外化到配置文件或环境变量。
- 禁止硬编码密码、token、密钥、外部服务地址。
- 改代码前先理解现有实现，不要破坏已有接口契约、路径、字段名和数据库字段名。
- 测试能跑就跑；如果没跑，要明确说明原因。
- 默认按最低验收标准执行：
  - 前端至少执行 `pnpm build`
  - 后端至少执行 `mvn -DskipTests package`
- 以下高风险改动必须额外补手工 smoke test：
  - 登录 / 退出登录
  - 权限 / 菜单 / 路由
  - 文件上传
  - Agent / SSE
  - 额度扣减
