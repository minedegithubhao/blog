# canbe_blog_server 项目规范

最后更新：2026-04-28

本文档只描述后端项目 `canbe_blog_server` 的专属规范。

阅读顺序：

1. 先读 [COMMON_RULES.md](D:/IdeaProjects/blog/COMMON_RULES.md)
2. 再读本文档
3. 最后读 [TASKS_DONE.md](D:/IdeaProjects/blog/canbe_blog_server/TASKS_DONE.md)

## 1. 技术栈

- JDK 17
- Spring Boot 3.x
- MyBatis-Plus
- MySQL 8.x
- Redis 7.x
- Maven 3.9.6
- RESTful + SSE

## 2. 总包结构

```text
com.canbe.blog
├── BlogApplication.java
├── common
├── config
├── security
├── infrastructure
├── user
├── content
├── agent
├── quota
├── file
└── system
```

模块职责：

- `common`：通用结果、异常、常量、工具、校验。
- `config`：Spring、MyBatis-Plus、线程池、跨域等配置。
- `security`：认证、Token、当前用户上下文、登录拦截。
- `infrastructure`：外部系统适配器。
- `user`：前台用户、后台账号、角色。
- `content`：文章、分类、标签。
- `agent`：Agent 元数据、会话、消息、调用入口。
- `quota`：角色策略、用户额度、扣减、查询。
- `file`：文件上传、文件记录。
- `system`：菜单、字典、站点配置、后台看板。

## 3. 模块内部结构

每个业务模块必须统一为：

```text
module
├── controller
├── service
│   └── impl
├── mapper
├── entity
├── dto
├── vo
├── convert
└── enums
```

命名规则：

- Controller：`AdminXxxController`、`PublicXxxController`
- Service：`XxxService`
- ServiceImpl：`XxxServiceImpl`
- Mapper：`XxxMapper`
- Entity：`Xxx`
- DTO：`XxxCreateDTO`、`XxxUpdateDTO`、`XxxQueryDTO`
- VO：`XxxVO`、`XxxDetailVO`、`XxxPageVO`
- Convert：`XxxConvert`
- Enum：`XxxStatusEnum`、`XxxTypeEnum`

## 4. 分层职责

Controller 只允许：

- 接收 HTTP 请求
- 校验 DTO
- 获取当前用户上下文
- 调用本模块 Service
- 返回统一 `Result<T>`

Controller 禁止：

- 直接注入 Mapper
- 写业务规则
- 拼 SQL
- 直接调用外部系统
- 返回 Entity

Service 允许：

- 编排业务流程
- 判断业务规则
- 控制事务
- 调用本模块 Mapper
- 调用其他模块 Service
- 调用 `infrastructure` 适配器
- 处理 DTO / Entity / VO 转换

Service 禁止：

- 接收 `HttpServletRequest` 作为业务参数
- 返回 MyBatis-Plus 原始 `Page`
- 把 Entity 直接返回给 Controller
- 跨模块直接调其他模块 Mapper
- 直接解析 JWT

Mapper 只负责数据库访问，不写业务判断，不调 Service，不跨模块操作其他模块表。

Convert 只做对象转换，禁止注入 Service、Mapper，禁止查数据库。

## 5. 跨模块调用规则

允许：

```text
controller -> same module service
service -> same module mapper
service -> other module service
service -> infrastructure client
```

禁止：

```text
controller -> mapper
controller -> other module service
service -> other module mapper
mapper -> mapper
mapper -> service
entity -> service
convert -> service
```

## 6. 事务规则

- 写操作 Service 方法必须加 `@Transactional`。
- 只读查询方法加 `@Transactional(readOnly = true)` 或不加事务。
- 事务只加在最外层 Service 方法。
- Controller 禁止加 `@Transactional`。

## 7. 认证、权限与错误处理

- 所有受保护接口默认走登录拦截。
- 当前登录用户上下文统一从 `CurrentUserContext` 获取。
- 认证失败、token 缺失、token 失效应逐步使用 HTTP `401` 语义。
- 已登录但无权限应逐步使用 HTTP `403` 语义。
- 资源不存在应逐步使用 HTTP `404` 语义。
- 资源冲突应逐步使用 HTTP `409` 语义。
- 外部服务不可用、Agent Runtime 繁忙应逐步使用 `503`。
- 外部调用超时、Agent 响应超时应逐步使用 `504`。

同时保留统一业务响应体：

```json
{
  "code": 2000,
  "message": "业务文案",
  "data": null
}
```

要求：

- 不允许把所有异常都包成 HTTP `200`。
- 不允许把后端堆栈、SQL、内部类名直接返回给前端。
- 业务异常必须有明确语义和错误码。

V1 最小补充约定：

- 角色模型统一为单角色，一个用户只绑定一个 `roleCode`。
- V1 前台用户与后台账号临时共用 `blog_account` 一张表，后续如有必要再拆分。
- Agent 调用记录状态统一为：
  - `SUCCESS`
  - `FAILED`
  - `TIMEOUT`
  - `INTERRUPTED`
- 更细原因通过 `errorCode`、`errorMessage` 区分，例如：
  - `QUOTA_NOT_ENOUGH`
  - `AGENT_BUSY`
  - `NETWORK_ERROR`
  - `PROVIDER_ERROR`
  - `USER_CANCELLED`
- 额度 V1 按次扣减，不按 token 扣减，默认额度统一为总计 10 次。
- 请求开始前必须先检查是否还有剩余额度。
- 只有剩余额度大于 0 时，才允许本次请求开始。
- 额度扣减时机统一为请求成功后扣减，请求失败不扣减。
- V1 不做流式过程中按次额度中断。
- 额度字段模型统一为：
  - `totalQuota`
  - `usedQuota`
  - `remainingQuota`
- 登录态 V1 统一按最简实现处理：token 默认有效期 1 个月，不做 refresh token，不做滑动续期。
- 用户名规则：
  - 只允许字母、数字、下划线
  - 长度 4 到 20 位
- 昵称最大长度 20

## 8. 数据库与 SQL 规则

- 表名和字段名只使用小写字母、数字、下划线。
- 每张业务表必须有：`id`、`gmt_create`、`gmt_modified`、`is_deleted`。
- 状态字段统一用 `status`。
- 排序字段统一用 `sort_order`。
- 乐观锁字段统一用 `version`。
- 金额和精确小数统一用 `decimal`。
- 禁止 `select *`。
- 禁止无条件更新、无条件删除。
- 禁止 `${}` 拼接用户入参。
- 高频查询必须按真实场景建索引。

## 9. 编码规范

- 命名统一使用 Java 标准命名法。
- 禁止中文命名、拼音命名、拼音英文混用。
- 日志统一使用 `slf4j`。
- 记录异常时必须把异常对象作为最后一个参数传入。
- 禁止只打印 `e.getMessage()`。
- 禁止空 `catch`。
- 禁止直接抛裸 `RuntimeException`、`Exception`、`Throwable`。
- 能前置判断规避的异常，先判断再执行。

## 10. 并发与线程池

- 禁止手动 `new Thread`。
- 禁止使用 `Executors` 快捷工厂。
- 必须使用显式线程池配置。
- 线程池按业务隔离，例如：
  - `agent-call-pool`
  - `file-upload-pool`
  - `scheduled-task-pool`
- 外部 Agent 调用不能长期占用 Web 请求线程。

## 11. Agent Runtime 协作边界

Spring Boot 负责：

- Agent 元数据管理
- 登录与权限校验
- 额度校验
- 调用记录
- 会话和消息持久化
- SSE 转发
- 异常转换

Python Runtime 负责：

- 执行具体 Agent
- 调用 LLM、工具、知识库或外部 API
- 返回普通响应或流式响应

禁止：

- Python Runtime 判断博客用户权限
- Python Runtime 扣减额度
- Python Runtime 直接写博客业务表

V1 文件上传最简实现：

- 文件上传统一落地到本地磁盘。
- 只允许常见图片类型。
- 只允许 `jpg`、`jpeg`、`png`、`webp`。
- 单文件大小限制 5MB。
- 推荐存储目录结构：`storage/uploads/年/月/日/`
- 落盘文件名统一使用 `UUID + 原扩展名`
- 对外访问 URL 统一使用静态暴露路径 `/uploads/年/月/日/UUID.ext`
- 数据库存储原文件名、存储文件名、相对路径、访问 URL、文件大小、contentType
- 删除文件时，同步删除数据库记录和物理文件；如果物理文件不存在，不应导致接口整体失败
- V1 不做引用检查，允许删除；被引用处由前端兜底默认图

V1 菜单与权限最简实现：

- 采用“前端静态路由 + 后端菜单树与权限控制”模式
- 后端负责菜单树、菜单可见性、权限标识
- 按钮级权限纳入 V1
- 前端负责按钮显隐，无权限按钮直接隐藏；后端关键接口保留服务端权限校验

V1 注册与可见性最简实现：

- 用户注册最小规则：
  - 用户名唯一
  - 昵称可重复
  - 邮箱可为空
  - 密码最小长度 6 位
  - 前台注册默认 `roleCode = USER`
  - 后端只接收一个 `password`
- 草稿与下架文章、Agent 前台统一不可见
- 前台访问草稿或下架内容时统一按 `404` 处理

V1 页面兜底最简实现：

- 前台单独一套 `404`
- 后台单独一套 `404`
- 后台单独一套 `403`
- `401` 不做独立页面，直接跳登录页

与前端协作的最简实现补充：

- 后台 tabs 持久化由前端通过 `localStorage` 完成，按项目和用户隔离。
- 删除确认交互由前端统一使用 `AlertDialog`，后端不依赖浏览器原生确认框。
- 上级菜单选择由前端采用 `Popover + Command + 树形缩进列表`，提交值仍然是 `parentId`。
- 上级菜单选择需要支持：
  - “顶级菜单”选项，对应 `parentId = 0`
  - 编辑时禁选自己和自己的子孙节点
- V1 去掉 Remember Me。
- 默认图由前端公共组件统一兜底，后端只保证图片 URL 可访问或为空。
- 默认图资源路径统一为：
  - `/images/defaults/article-cover.png`
  - `/images/defaults/agent-cover.png`
  - `/images/defaults/avatar.png`
- 菜单树接口最简返回结构统一为：
  - 路径：`GET /api/v1/me/navigation`
  - `menus: MenuTreeNode[]`
  - `permissions: string[]`
- 后端允许保存任意图标字符串。
- `component` 字段最简校验规则：
  - `CATALOG`：可空
  - `MENU`：必填
  - `BUTTON`：为空
- 后端按当前用户权限预过滤菜单树后再返回前端。
- 图片上传接口统一返回：
  - `id`
  - `url`
  - `filename`
  - `size`
  - `contentType`
- V1 业务表单字段直接保存 `url`。
- Agent 元数据统一采用 provider 化后端代理调用：
  - `providerType = CUSTOM`：后端使用 `runtimeUrl` 代理调用自定义 Agent Runtime，参与登录、额度和调用记录。
  - `providerType = DIFY`：后端使用 `apiUrl`、`apiKey`、`responseMode` 代理调用 Dify API，参与登录、额度和调用记录。
- V1 Dify 只支持 `responseMode = blocking`，暂不接入 Dify streaming。
- 前端统一调用 `POST /api/v1/agents/{id}/chat`，不直接调用 Python Runtime、Dify API 或 iframe 地址。
- Dify API Key 只允许保存在后端或数据库，禁止返回给前端。
- iframe 嵌入方式不再作为 V1 受额度控制 Agent 的实现方式。
- 站点配置接口统一为：
  - `GET /api/v1/site-config`
  - `PUT /api/v1/site-config`
- `GET /api/v1/site-config` 为公开接口，前台首页可未登录访问。
- `PUT /api/v1/site-config` 为后台接口，必须登录且要求 `ADMIN` 权限。
- 站点配置表统一使用单行配置，当前固定 `id = 1`。
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
- 首页文章数量必须由公开文章接口真实统计，不写入站点配置。
- “关于”入口暂不做配置化，后续明确前台信息架构后再处理。

## 12. 接口规范重点

- 路径统一走 `/api/v1/**`
- 统一响应 `Result<T>`
- 分页统一 `page`、`pageSize`
- 分页返回统一 `list`、`total`、`page`、`pageSize`
- 列表空值返回 `[]`
- 字符串空值返回 `""`
- 对象不存在返回 `null`

错误码分段：

- `1000-1999`：通用错误
- `2000-2999`：认证和用户
- `3000-3999`：博客内容
- `4000-4999`：Agent
- `5000-5999`：额度
- `6000-6999`：文件
- `7000-7999`：系统配置

## 13. 明确禁止

- Controller 直调 Mapper
- Service 直调其他模块 Mapper
- 返回 Entity 给 Controller
- 无超时调用外部服务
- 无日志吞异常
- 无条件更新和删除数据库数据
- 为了快而绕过权限、额度、审计链路

## 14. 常用命令

```powershell
$env:JAVA_HOME='D:\AAA_tools\java\17.0.16-ms'
$env:Path="$env:JAVA_HOME\bin;D:\AAA_tools\maven\3.9.6\bin;$env:Path"
mvn -pl canbe_blog_server -DskipTests package
```

## 15. 验收与 smoke test

- 默认最低验收标准：`mvn -DskipTests package`
- 以下高风险改动必须额外做手工 smoke test：
  - 登录 / 退出登录
  - 权限 / 菜单 / 路由
  - 文件上传
  - Agent / SSE
  - 额度扣减
