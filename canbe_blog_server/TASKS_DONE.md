# canbe_blog_server 已完成任务

最后更新：2026-04-30

## 已完成

- 整理后端项目根目录文档：
  - 新增 `PROJECT_RULES.md`，沉淀 `canbe_blog_server` 专属规范。
  - 保留 `TASKS_DONE.md` 作为后端工作进展记录。
  - 与根目录 `COMMON_RULES.md` 形成“共同规范 + 后端规范 + 后端进展”三层文档结构。

- 创建后端项目根目录：`canbe_blog_server`。
- 创建 Spring Boot 3.x + JDK 17 后端脚手架。
- 创建后端启动类：`com.canbe.blog.BlogApplication`。
- 按《博客功能介绍.md》创建基础包结构：
  - `common`
  - `config`
  - `security`
  - `infrastructure`
  - `user`
  - `content`
  - `agent`
  - `quota`
  - `file`
  - `system`
- 为业务模块创建标准分层目录：
  - `controller`
  - `service/impl`
  - `mapper`
  - `entity`
  - `dto`
  - `vo`
  - `convert`
  - `enums`
- 创建后端 `pom.xml`，接入项目规划中的基础依赖：
  - Spring Boot Web
  - Spring Boot Validation
  - Spring Boot Data Redis
  - Spring Boot Actuator
  - MyBatis-Plus
  - MySQL Connector
  - Spring Boot Test
- 将 `canbe_blog_server` 加入根目录 Maven 聚合模块。
- 使用本地 Maven 和 JDK 17 完成后端打包验证。
- 根据 `D:\AAA_tools\docker-compose.yaml` 配置 MySQL 和 Redis 连接。
- 将 MySQL、Redis 配置改为环境变量可覆盖形式。
- 验证 Redis health 状态为 `UP`。
- 验证 MySQL health 状态为 `UP`。
- 确认当前实际可用 MySQL 数据库为 `canbe_blog`。
- 新增登录认证表脚本：`src/main/resources/sql/001_auth_account.sql`。
- 在 MySQL `canbe_blog` 库中创建 `blog_account` 表。
- 插入本地开发账号：`canbe`，角色为 `ADMIN`。
- 实现统一响应对象：`Result<T>`。
- 实现业务异常和全局异常处理。
- 实现密码校验服务，使用 JDK 自带 PBKDF2-HMAC-SHA256。
- 实现 Redis token 签发服务。
- 实现 `POST /api/v1/auth/login` 登录接口。
- 登录成功后写入 Redis token，并更新 `blog_account.last_login_at`。
- 验证正确账号密码登录返回 `code=200` 和 token。
- 验证错误密码返回业务错误 `code=2001`。
- 已核验菜单管理后端功能：
  - 新增菜单表脚本：`src/main/resources/sql/002_blog_menu.sql`。
  - 已存在 `blog_menu` 表结构设计和 `后台首页`、`菜单管理` 两条种子数据。
  - 已实现菜单 Entity、DTO、VO、Convert、Mapper、Service、Controller。
  - 已实现 `GET /api/v1/menus`、`POST /api/v1/menus`、`PUT /api/v1/menus/{id}`、`DELETE /api/v1/menus/{id}`。
  - 已验证 `mvn -DskipTests package` 构建通过。
  - 因本机 `8080` 被 `wslrelay.exe` 占用，临时使用 `--server.port=18080` 启动验证过 `GET /api/v1/menus?page=1&pageSize=10`，接口返回 `code=200`，并返回 `后台首页`、`菜单管理` 两条菜单数据。

## 当前说明

- `D:\AAA_tools\docker-compose.yaml` 中声明的 `MYSQL_DATABASE` 是 `resume_rag_db`，但当前 MySQL 持久化卷中实际存在的是 `canbe_blog`。
- 当前后端默认连接 `canbe_blog`，可通过 `BLOG_MYSQL_DATABASE` 环境变量覆盖。
- 当前已实现登录接口。
- 当前已实现退出登录、当前用户查询和登录拦截。
- 当前未实现注册；但已确认 V1 前台用户与后台账号临时共用 `blog_account` 一张表，后续如有必要再拆分。
- 当前只完成项目脚手架、依赖安装、配置接入、登录闭环和运行验证。
- 菜单管理 CRUD 已开发到可编译、可运行接口层级。
- 菜单接口已接入登录拦截，需要携带 `Authorization: Bearer <token>` 访问。
- 菜单权限标识目前只是字段保存与展示，尚未接入角色权限校验。
- 如果“菜单功能”只指后台菜单表维护 CRUD，可以视为基本完成；如果按《博客功能介绍.md》中“后台菜单和权限入口”的完整含义，目前只能算部分完成。
- 用户管理已按现有 `blog_account` 表实现后台账号 CRUD 接口；因为角色表尚未实现，当前使用 `role_code` 单字段保存 `ADMIN` 或 `USER`。

## 2026-04-25 登录功能补充

- 新增认证上下文：`security/AuthenticatedUser.java`、`security/CurrentUserContext.java`。
- 新增登录拦截器：`security/AuthInterceptor.java`。
- 新增 MVC 拦截器配置：`config/WebMvcConfig.java`，默认拦截 `/api/v1/**`，放行 `/api/v1/auth/login` 和 `/api/v1/auth/register`。
- 扩展 `AuthTokenService`：
  - 支持按 token 从 Redis 读取当前用户。
  - 支持退出登录时删除 token。
- 新增 `POST /api/v1/auth/logout`。
- 新增 `GET /api/v1/me`。
- 已验证：
  - `mvn -DskipTests package` 构建通过。
  - 未登录访问 `/api/v1/me` 返回 `code=2003`。
  - 使用 `canbe / cxd123` 登录返回 `code=200`。
  - 携带 token 访问 `/api/v1/me` 返回当前用户 `canbe`。
  - 携带 token 访问 `/api/v1/menus?page=1&pageSize=10` 返回 `code=200` 和 2 条种子菜单。
  - 退出登录返回 `code=200`。
  - 退出后使用旧 token 访问 `/api/v1/me` 返回 `code=2004`。

## 常用命令

```powershell
$env:JAVA_HOME='D:\AAA_tools\java\17.0.16-ms'
$env:Path="$env:JAVA_HOME\bin;D:\AAA_tools\maven\3.9.6\bin;$env:Path"
mvn -pl canbe_blog_server -DskipTests package
```

```powershell
wsl -d Ubuntu -u canbe -- bash -lc "cd /mnt/d/IdeaProjects/blog/canbe_blog_server && java -jar target/canbe_blog_server-1.0-SNAPSHOT.jar"
```

## 2026-04-26 用户管理功能

- 新增后台账号管理接口：
  - `GET /api/v1/admin/accounts`
  - `POST /api/v1/admin/accounts`
  - `PUT /api/v1/admin/accounts/{id}`
  - `DELETE /api/v1/admin/accounts/{id}`
- 新增后台账号 DTO、VO、Service、Controller。
- 扩展 `BlogAccountMapper`：
  - 支持分页查询、按用户名前缀查询、按状态筛选。
  - 支持创建、更新、软删除后台账号。
  - 支持用户名和邮箱唯一性检查。
- 扩展 `PasswordHashService.encode`，创建账号时继续使用 PBKDF2-HMAC-SHA256 保存密码。
- 后台账号接口要求当前登录用户 `roleCode=ADMIN`。
- 保护规则：
  - 不能删除当前登录账号。
  - 不能停用或降级当前登录账号。
- 已验证：
  - `mvn -DskipTests package` 构建通过。
  - 使用 `--server.port=18080` 临时启动后端，`canbe / cxd123` 登录返回 `code=200`。
  - 携带 token 访问 `GET /api/v1/admin/accounts?page=1&pageSize=10` 返回 `code=200`，当前返回账号 `canbe`。
- 未自动执行新增、编辑、删除接口的运行期写入验证，避免在未确认的情况下改动或删除本地账号数据。

## 2026-04-26 按开发手册同步后台菜单层级

- 用户要求前后端同步开发，后台菜单层级要与《博客功能介绍.md》中的后台页面清单保持一致，而不是只保留少量菜单种子数据。
- 已调整菜单初始化脚本 `src/main/resources/sql/002_blog_menu.sql`：
  - 顶级节点：
    - `后台首页`
    - `内容管理`
    - `系统管理`
    - `智能体管理`
  - 内容管理子菜单：
    - 文章管理
    - 分类管理
    - 标签管理
  - 系统管理子菜单：
    - 用户管理
    - 角色管理
    - 菜单管理
    - 字典管理
    - 文件管理
    - 站点配置
  - 智能体管理子菜单：
    - Agent管理
    - 额度管理
    - Agent调用记录
- 菜单种子数据改为固定 `id + parent_id` 层级形式，保证数据库层面也是树状结构，而不是前端自己拼的平铺导航。
- 本次只改了 SQL 初始化脚本，没有新增 Java 代码，因此未单独重跑后端打包；如需让本地数据库立即生效，需要执行该 SQL 脚本同步菜单种子数据。

## 2026-04-26 文档结构重组

- 根据当前协作方式，重新整理文档结构：
  - 根目录新增共同规范文档：`D:\IdeaProjects\blog\COMMON_RULES.md`
  - 后端根目录新增项目规范文档：`D:\IdeaProjects\blog\canbe_blog_server\PROJECT_RULES.md`
  - 后端根目录保留工作进展文档：`D:\IdeaProjects\blog\canbe_blog_server\TASKS_DONE.md`
- 后端后续任务开始前，建议阅读顺序：
  1. `COMMON_RULES.md`
  2. `canbe_blog_server/PROJECT_RULES.md`
  3. `canbe_blog_server/TASKS_DONE.md`

## 2026-04-26 规范补充落地

- 已继续把已确认规则写入文档体系：
  - 单角色模型
  - Agent 调用记录最简状态：`SUCCESS / FAILED / TIMEOUT / INTERRUPTED`
  - SSE 过程中额度不足立即中断
  - 文件上传 V1 使用本地磁盘
  - 菜单采用“前端静态路由 + 后端菜单树与权限控制”
  - 按钮级权限纳入 V1
- 已继续补充并同步：
  - 额度按次扣减，默认总计 10 次
  - 额度扣减时机：请求成功后扣减，请求失败不扣减
  - 请求开始前先检查剩余额度，只有大于 0 才允许开始
  - V1 不做流式过程中按次额度中断
  - 文件访问 URL 使用 `/uploads/...`
  - 文件删除不做引用检查
  - 草稿 / 下架文章与 Agent 前台按 `404` 处理
  - 注册规则：用户名唯一、昵称可重复、邮箱可空、密码最小长度 6 位、后端只接收一个 `password`
  - 前台注册默认 `roleCode = USER`
  - Agent 中断消息持久化，状态标记为 `INTERRUPTED`
  - 登录态最简规则：token 默认有效期 1 个月，不做 refresh token，不做滑动续期
  - 文件上传最简限制：只允许 `jpg/jpeg/png/webp`、单文件大小 5MB
  - 用户名规则：字母/数字/下划线，长度 4-20；昵称最大长度 20
  - 前台单独 404、后台单独 404、后台单独 403、401 直接跳登录
  - 高风险改动强制 smoke test：登录、权限/菜单/路由、上传、Agent/SSE、额度
  - 前端 tabs 持久化采用 `localStorage` + 用户隔离 key
  - 前端删除确认统一使用 `AlertDialog`
  - 上级菜单选择统一采用 `Popover + Command + 树形缩进列表`
  - 上级菜单选择补充：支持“顶级菜单”，编辑时禁选自己和子孙节点
  - Remember Me 在 V1 去掉
  - 默认图由前端公共组件统一兜底
  - 默认图路径统一为 `/images/defaults/article-cover.png`、`/images/defaults/agent-cover.png`、`/images/defaults/avatar.png`
  - 菜单树接口返回统一为 `menus + permissions`
  - 菜单导航接口路径统一为 `GET /api/v1/me/navigation`
  - 后端允许保存任意 icon 字符串，前端未命中统一 fallback
  - `component` 校验规则：`CATALOG` 可空、`MENU` 必填、`BUTTON` 为空
  - 图片上传接口返回 `id/url/filename/size/contentType`，V1 业务表单直接保存 `url`
  - V1 前台用户与后台账号临时共用 `blog_account`
  - 额度字段模型统一为 `totalQuota / usedQuota / remainingQuota`
- 已同步更新：
  - `D:\IdeaProjects\blog\博客功能介绍.md`
  - `D:\IdeaProjects\blog\COMMON_RULES.md`
  - `D:\IdeaProjects\blog\canbe_blog_server\PROJECT_RULES.md`

## 2026-04-26 用户管理与菜单管理重构

- 按最新规范扩展菜单与导航后端：
  - 新增 `GET /api/v1/menus/tree`
  - 新增 `GET /api/v1/me/navigation`
- 新增导航与树形返回对象：
  - `src/main/java/com/canbe/blog/system/vo/MenuTreeVO.java`
  - `src/main/java/com/canbe/blog/user/vo/CurrentUserNavigationVO.java`
- 扩展菜单服务：
  - `MenuService` / `MenuServiceImpl` 新增菜单树与当前用户导航能力
  - 当前用户导航返回 `menus + permissions`
  - 导航菜单由后端按当前用户权限预过滤后返回
- 扩展菜单校验规则：
  - 上级菜单不能是按钮
  - 上级菜单不能选择自己
  - 上级菜单不能选择自己的子孙节点
  - `CATALOG` 类型 `component` 可空
  - `MENU` 类型 `component` 必填
  - `BUTTON` 类型 `component` 必须为空
- 扩展菜单 Mapper：
  - 新增全量菜单查询能力，支持构造菜单树与导航权限集合
- 更新菜单种子 SQL `src/main/resources/sql/002_blog_menu.sql`：
  - 修正 `Tag` 图标名
  - 补充用户管理和菜单管理按钮权限节点：
    - `adminAccount:create/update/delete`
    - `menu:create/update/delete`
- 更新当前用户接口控制器：
  - `CurrentUserController` 新增 `/navigation`
- 收紧用户管理 DTO 校验：
  - 用户名限制为字母 / 数字 / 下划线，长度 4-20
  - 昵称最大长度 20
- 已确认并在实现中遵守：
  - V1 前台用户与后台账号临时共用 `blog_account`
  - 额度按次，总计 10 次
  - 请求开始前检查剩余额度
  - 请求成功后扣减，失败不扣减
  - V1 不做流式过程中按次额度中断
- 已验证：
  - `mvn -pl canbe_blog_server -DskipTests package` 构建通过

## 2026-04-26 注册接口与菜单种子同步

- 按最新规范补齐前台注册后端：
  - 新增注册 DTO：`src/main/java/com/canbe/blog/user/dto/RegisterDTO.java`
  - `PublicAuthController` 新增 `POST /api/v1/auth/register`
  - `BlogAuthService` / `BlogAuthServiceImpl` 新增注册能力
  - `BlogAccountMapper` 新增前台注册账号写入方法
- 注册规则已落地：
  - 用户名 `4-20` 位字母 / 数字 / 下划线
  - 密码最小长度 `6`
  - 昵称最大长度 `20`
  - 前台注册默认 `roleCode = USER`
- 已将本地数据库菜单种子同步到最新 `src/main/resources/sql/002_blog_menu.sql`
- 已验证 smoke：
  - `POST /api/v1/auth/register` 返回 `code=200`
  - 新注册用户可登录
  - 管理员登录后访问 `/api/v1/me/navigation` 返回 `menus=5`
  - 管理员访问 `/api/v1/menus/tree` 返回 `treeCount=5`

## 2026-04-26 角色管理开发

- 按最新规范补齐后端角色管理：
  - 新增角色表脚本：`src/main/resources/sql/003_blog_role.sql`
  - 新增角色 Entity / DTO / VO / Convert / Mapper / Service / Controller
  - 新增接口：
    - `GET /api/v1/roles`
    - `POST /api/v1/roles`
    - `PUT /api/v1/roles/{id}`
    - `DELETE /api/v1/roles/{id}`
- 角色管理规则已落地：
  - 角色编码唯一，名称唯一
  - 编码格式为大写字母开头的 `A-Z0-9_`
  - 角色被账号使用时，不能删除
  - 角色被账号使用时，不能停用
  - 角色被账号使用时，不能修改角色编码
- 用户管理已与角色表联动：
  - 创建 / 更新账号时会校验 `roleCode` 必须存在于角色表
- 已同步角色种子到本地数据库：
  - `ADMIN`
  - `USER`
  - smoke 过程中新增验证角色 `EDITOR`
- 已同步菜单种子 SQL：
  - 新增角色管理按钮权限节点
    - `role:create`
    - `role:update`
    - `role:delete`
- 已验证：
  - `mvn -pl canbe_blog_server -DskipTests package` 构建通过
  - `GET /api/v1/roles` 返回 `code=200`
  - `POST /api/v1/roles` 可创建角色
  - `/api/v1/me/navigation` 权限集合已包含 `role:create / role:update / role:delete`

## 2026-04-26 分类管理与标签管理开发

- 按最新规范补齐后端分类管理与标签管理：
  - 新增内容表脚本：`src/main/resources/sql/004_content_taxonomy.sql`
  - 新增分类 Entity / DTO / VO / Convert / Mapper / Service / Controller
  - 新增标签 Entity / DTO / VO / Convert / Mapper / Service / Controller
  - 新增接口：
    - `GET /api/v1/categories`
    - `POST /api/v1/categories`
    - `PUT /api/v1/categories/{id}`
    - `DELETE /api/v1/categories/{id}`
    - `GET /api/v1/tags`
    - `POST /api/v1/tags`
    - `PUT /api/v1/tags/{id}`
    - `DELETE /api/v1/tags/{id}`
- 分类管理规则已落地：
  - 分类名称唯一
  - 分类 slug 唯一
  - 支持排序、状态、描述
- 标签管理规则已落地：
  - 标签名称唯一
  - 标签 slug 唯一
- 已同步菜单种子 SQL：
  - 新增分类管理按钮权限节点
    - `category:create`
    - `category:update`
    - `category:delete`
  - 新增标签管理按钮权限节点
    - `tag:create`
    - `tag:update`
    - `tag:delete`
- 已同步本地数据库：
  - `002_blog_menu.sql`
  - `003_blog_role.sql`
  - `004_content_taxonomy.sql`
- 已验证：
  - `mvn -pl canbe_blog_server -DskipTests package` 构建通过
  - `GET /api/v1/categories` 返回 `code=200`
  - `GET /api/v1/tags` 返回 `code=200`
  - `/api/v1/me/navigation` 权限集合已包含 `category:create / tag:create`

## 2026-04-26 文章管理开发

- 按最新规范补齐后端文章管理：
  - 新增文章表脚本：`src/main/resources/sql/005_blog_article.sql`
  - 新增文章 Entity / DTO / VO / Convert / Mapper / Service / Controller
  - 新增接口：
    - `GET /api/v1/articles`
    - `GET /api/v1/articles/{id}`
    - `POST /api/v1/articles`
    - `PUT /api/v1/articles/{id}`
    - `DELETE /api/v1/articles/{id}`
- 文章管理规则已落地：
  - 文章标题必填
  - 正文内容必填
  - 分类必选
  - 至少选择一个标签
  - 支持封面地址 `coverUrl`
  - 支持状态：草稿 / 发布 / 下架
- 文章与标签关系最简实现：
  - 新增 `blog_article_tag` 关系表
  - 创建 / 更新文章时直接重建标签关联
- 已同步菜单种子 SQL：
  - 新增文章管理按钮权限节点
    - `article:create`
    - `article:update`
    - `article:delete`
- 已同步本地数据库：
  - `002_blog_menu.sql`
  - `005_blog_article.sql`
- 已验证：
  - `mvn -pl canbe_blog_server -DskipTests package` 构建通过
  - `GET /api/v1/articles` 返回 `code=200`
  - `/api/v1/me/navigation` 权限集合已包含 `article:create / category:create / tag:create`

## 2026-04-26 文件管理与字典管理开发

- 按最新规范补齐后端文件管理与字典管理：
  - 新增系统表脚本：`src/main/resources/sql/006_system_file_dict.sql`
  - 新增文件管理 Entity / DTO / VO / Convert / Mapper / Service / Controller
  - 新增字典管理 Entity / DTO / VO / Convert / Mapper / Service / Controller
  - 新增接口：
    - `POST /api/v1/files/upload`
    - `GET /api/v1/files`
    - `DELETE /api/v1/files/{id}`
    - `GET /api/v1/dicts`
    - `POST /api/v1/dicts`
    - `PUT /api/v1/dicts/{id}`
    - `DELETE /api/v1/dicts/{id}`
- 文件管理规则已落地：
  - 只允许 `jpg/jpeg/png/webp`
  - 单文件大小限制 5MB
  - 文件落盘到本地磁盘
  - 通过 `/uploads/**` 静态映射访问
  - 删除记录时同步删除物理文件，物理文件不存在不阻塞删除
- 字典管理规则已落地：
  - 采用最简字典项模型：`typeCode / typeName / itemLabel / itemValue / sortOrder / status / remark`
  - 同类型下 `itemValue` 唯一
- 已同步菜单种子 SQL：
  - 新增字典管理按钮权限节点
    - `dict:create`
    - `dict:update`
    - `dict:delete`
  - 新增文件管理按钮权限节点
    - `file:upload`
    - `file:delete`
- 已同步本地数据库：
  - `002_blog_menu.sql`
  - `006_system_file_dict.sql`
- 已验证：
  - `mvn -pl canbe_blog_server -DskipTests package` 构建通过
  - `GET /api/v1/dicts` 返回 `code=200`
  - `GET /api/v1/files` 返回 `code=200`
  - `POST /api/v1/files/upload` 返回 `code=200`
  - 上传后文件 URL 形如 `/uploads/2026/04/26/<uuid>.png`
  - `/api/v1/me/navigation` 权限集合已包含 `dict:create / file:upload`

## 2026-04-26 P0 Agent 与额度管理基础开发

- 按最新共同规范补齐后端 Agent 元数据管理：
  - 新增 `AgentServiceImpl`
  - 新增 `AdminAgentController`
  - 新增接口：
    - `GET /api/v1/agents`
    - `POST /api/v1/agents`
    - `PUT /api/v1/agents/{id}`
    - `DELETE /api/v1/agents/{id}`
    - `POST /api/v1/agents/{id}/test-connection`
- Agent 测试连接采用 V1 最简实现：
  - Java `HttpClient`
  - 连接超时 5 秒，请求超时 10 秒
  - 返回 `success / latencyMs / errorCode / errorMessage`
- 补齐额度管理基础接口：
  - `GET /api/v1/quotas`
  - `PUT /api/v1/quotas/{id}`
  - `GET /api/v1/role-agent-policies`
  - `PUT /api/v1/role-agent-policies/{id}`
- 补齐额度初始化逻辑：
  - 新增 Agent 时，为现有角色创建默认 Agent 策略，并为现有启用账号初始化用户额度。
  - 新增角色时，为现有 Agent 创建默认策略。
  - 后台创建账号、前台注册账号时，按角色策略初始化用户额度。
- 补齐 Agent 调用记录最简后台列表：
  - 新增表 `blog_agent_call_record`
  - 新增接口 `GET /api/v1/agent-call-records`
  - 当前先实现后台只读列表，后续 Agent/SSE 调用链路落地时写入记录。
- 更新 SQL：
  - `src/main/resources/sql/007_agent_quota.sql` 新增 Agent、角色策略、用户额度、调用记录表。
  - 已同步本地数据库 `007_agent_quota.sql`。
  - 已同步本地数据库 `002_blog_menu.sql`，确保 Agent/额度/调用记录权限节点可用。
- 修正后端规范：
  - 移除旧的“SSE 过程中额度不足立即中断”残留说明。
  - 当前统一按共同规范执行：请求开始前检查剩余额度，请求成功后扣减，V1 不做流式过程中按次额度中断。
- 已验证：
  - `mvn -pl canbe_blog_server -DskipTests package` 构建通过。
  - 临时启动后端到 `18080` 进行 smoke test，完成后已停止进程。
  - smoke 覆盖：
    - `POST /api/v1/auth/login`
    - `GET /api/v1/agents`
    - `GET /api/v1/quotas`
  - `GET /api/v1/role-agent-policies`
  - `GET /api/v1/agent-call-records`

## 2026-04-26 P0 前台文章公开接口开发

- 按主开发手册第一优先级补齐前台文章公开接口：
  - 新增 `PublicArticleService`
  - 新增 `PublicArticleServiceImpl`
  - 新增 `PublicArticleController`
  - 新增接口：
    - `GET /api/v1/public/articles`
    - `GET /api/v1/public/articles/{id}`
- 公开文章接口规则：
  - 不需要登录 token。
  - 只返回 `status = 1` 的已发布文章。
  - 草稿 / 下架 / 删除文章前台不可见，详情按文章不存在处理。
- 登录拦截器已放行：
  - `/api/v1/public/**`
- 修复一个历史 SQL 拼接隐患：
  - 多个 Mapper 的筛选条件后缺少尾部空格，带筛选时可能拼成 `?order by`。
  - 已统一修正 Agent、调用记录、文章、分类、标签、文件、额度、字典、菜单、账号、角色等 Mapper 的筛选 SQL 拼接。
- 全局异常处理补充服务端日志：
  - `GlobalExceptionHandler` 对未处理异常记录完整堆栈，避免接口只返回“系统异常”但后端无排查信息。
- 已验证：
  - `mvn -pl canbe_blog_server -DskipTests package` 构建通过。
  - 临时启动后端到 `18080` 进行 smoke test，完成后已停止进程。
  - smoke 覆盖：
    - 未登录访问 `GET /api/v1/public/articles?page=1&pageSize=10` 返回 `code=200`
    - 登录后访问带筛选条件的 `GET /api/v1/agents?page=1&pageSize=10&status=1` 返回 `code=200`

## 2026-04-28 前台 Agent 公开列表接口

- 补齐前台 Agent 公开列表接口：
  - 新增 `PublicAgentService`
  - 新增 `PublicAgentServiceImpl`
  - 新增 `PublicAgentController`
  - 新增接口 `GET /api/v1/public/agents`
- 公开 Agent 规则：
  - 不需要登录 token。
  - 只返回 `status = 1` 的启用 Agent。
  - 草稿 / 停用 / 删除 Agent 前台不可见。
- 扩展 `AgentMapper`：
  - `listPublished`
  - `countPublished`
- 已验证：
  - `mvn -pl canbe_blog_server -DskipTests package` 构建通过。
  - 使用临时端口 `18081` 启动新 jar 验证公开接口，完成后已停止进程。
  - `GET /api/v1/public/agents?page=1&pageSize=10` 返回 `code=200`。
  - 当前本地数据库启用 Agent 数量为 `0`，因此前台页面会显示空态，新增并启用 Agent 后会展示卡片。

## 2026-04-28 本地 FAQ Agent 配置

- 已在本地 MySQL `canbe_blog` 配置 FAQ Agent：
  - `name`：`FAQ Agent`
  - `code`：`FAQ_AGENT`
  - `runtime_url`：`http://localhost:8010/faq/chat`
  - `status`：启用
  - `sort_order`：`10`
- 已同步初始化策略和额度：
  - 为现有角色 `ADMIN / USER / EDITOR` 创建 `role_agent_policy`，默认启用，默认总额度 `10`。
  - 为现有账号 `canbe / user_smoke_20260426 / canbe2` 创建 `user_agent_quota`，默认总额度 `10`，已用 `0`，剩余 `10`。
- 已验证数据库结果：
  - `blog_agent` 中 `FAQ_AGENT` 记录存在，当前 ID 为 `1`。
  - 角色策略和用户额度均已写入。
- 注意：
  - 本地调用 `POST http://localhost:8010/faq/chat` 两次均超时。
  - FAQ Agent 元数据已配置完成，但真实运行还需要确认 `8010` FAQ 服务当前可响应。

## 2026-04-28 Agent 非流式体验链路开发

- 按最新规范补齐后端 Agent 非流式聊天接口：
  - 新增 `POST /api/v1/agents/{id}/chat`
  - 新增 `AgentChatController`
  - 新增 `AgentChatServiceImpl`
- 接口规则：
  - 必须登录后调用。
  - 前端只调用 `canbe_blog_server`，不直接调用 Python Runtime。
  - 后端读取 `blog_agent.runtime_url` 后代理调用 Runtime。
  - 请求开始前检查用户 Agent 剩余额度。
  - Runtime 成功返回后扣减 1 次额度。
  - Runtime 调用失败、超时、返回非 2xx 时不扣减额度。
- 扩展额度能力：
  - `UserAgentQuotaService` 新增 `checkAvailable` 和 `consumeOne`。
  - `UserAgentQuotaMapper` 新增按 `userId + agentId` 条件扣减 1 次额度的方法。
- 扩展调用记录能力：
  - `AgentCallRecordMapper` 新增 `create`。
  - 成功记录 `SUCCESS`。
  - Runtime 非 2xx 记录 `FAILED / PROVIDER_ERROR`。
  - 超时记录 `TIMEOUT / AGENT_TIMEOUT`。
  - 中断记录 `INTERRUPTED / REQUEST_INTERRUPTED`。
- 修正 Java 调用 FAQ Runtime 的兼容问题：
  - `HttpClient` 显式使用 `HTTP_1_1`。
  - 请求体显式使用 UTF-8。
  - `Content-Type` 使用 `application/json`。
  - 该修正解决 FastAPI Runtime 在 Java 默认请求方式下返回 `422 body missing` 的问题。
- 已验证：
  - `mvn -pl canbe_blog_server -DskipTests package` 构建通过。
  - 使用临时端口 `18081` 启动新 jar 做 smoke，完成后已停止进程。
  - smoke 覆盖：
    - `POST /api/v1/auth/login`
    - `GET /api/v1/public/agents`
    - `POST /api/v1/agents/1/chat`
    - `GET /api/v1/quotas`
    - `GET /api/v1/agent-call-records`
  - smoke 结果：
    - 聊天接口返回 `code=200`
    - `quotaUsed=1`
    - 用户 Agent 剩余额度从 `10` 扣减为 `9`
    - 最新调用记录状态为 `SUCCESS`

## 2026-04-28 旧表 sys_article 内容迁移

- 按用户要求，将旧表 `sys_article` 中的博客内容迁移到新项目内容表。
- 迁移范围：
  - `sys_article`：200 篇文章。
  - `sys_category`：12 个旧分类。
  - `blog-server/upload`：37 张旧封面文件。
- 迁移处理：
  - 旧分类写入 `blog_category`，slug 使用 `legacy-category-{旧分类ID}`。
  - 旧文章写入 `blog_article`。
  - 旧状态 `sys_article.status = 0` 转换为新项目发布状态 `blog_article.status = 1`。
  - 文章内容优先使用 `content_md`，为空时回退 `content`，再为空时回退 `summary`。
  - 旧封面文件复制到 `storage/uploads/legacy/`。
  - 能找到物理文件的旧封面统一转换为 `/uploads/legacy/{filename}`。
  - 缺失物理文件的 3 张旧封面统一使用 `/images/defaults/article-cover.png`。
  - 旧表没有有效文章-标签关系，因此新增统一标签 `旧站迁移`，并挂到 200 篇迁移文章上。
- 数据修正：
  - 修复 PowerShell 管道执行 SQL 时中文字面量被写成 `????` 的编码问题。
  - 使用 UTF-8 十六进制字面量修正 `旧站迁移` 标签和旧分类迁移描述。
- 已验证：
  - `sys_article` 中 200 篇文章均已能在 `blog_article` 按标题匹配到。
  - 新项目公开文章总数为 `205`，包含此前手工添加的 5 篇文章和本次迁移的 200 篇文章。
  - 迁移文章中 197 篇使用 `/uploads/legacy/...` 封面。
  - 迁移文章中 3 篇使用默认封面。
  - 抽样访问 `/uploads/legacy/fa351cee-317e-4a41-93f1-2fad820d89e8.jpg` 可返回图片文件。
  - `GET /api/v1/public/articles?page=1&pageSize=10` 返回 `code=200`，`total=205`。
- 本次为本地数据库与文件迁移操作，没有修改 Java 源码，因此未重新执行 Maven 构建。

## 2026-04-28 文章分类重整与缺失封面替换

- 按用户要求，对 `blog_article` 已发布文章按标题、摘要和内容主题重新归类。
- 新增内容分类：
  - `区块链`，slug 为 `blockchain`，用于承接区块链 / 加密资产类文章。
- 分类重整口径：
  - AI、Agent、RAG、Embedding、Transformer、Prompt、向量检索等归入 `AI与大模型`。
  - 决策树、KNN、聚类、回归、集成学习、误差指标、标准化、归一化等归入 `机器学习`。
  - Python 语法、数据结构、正则、闭包、面向对象、Python 操作外部系统等归入 `Python开发`。
  - MySQL、SQL、Binlog、Canal、Redis 等归入 `数据库`。
  - Linux、Vagrant、虚拟机、环境配置、软件安装等归入 `开发运维`。
  - Vue、React、前端工程、组件库相关内容归入 `前端开发`。
- 本次受限更新 `blog_article.category_id` 共 63 篇，不删除旧分类，不删除文章。
- 替换当前仍使用默认封面的 6 篇文章：
  - `从零搭建个人博客系统的核心取舍` -> `/uploads/theme-covers/blog-system-core.jpg`
  - `为什么后台管理要坚持统一组件库` -> `/uploads/theme-covers/ui-component-library.jpg`
  - `小项目也需要清晰的开发规范` -> `/uploads/theme-covers/development-guidelines.jpg`
  - `资本抢滩区块链：泡沫还是技术？` -> `/uploads/theme-covers/blockchain-capital.jpg`
  - `使用Vagrant搭建本地集群` -> `/uploads/theme-covers/vagrant-cluster.jpg`
  - `费曼学习法` -> `/uploads/theme-covers/feynman-learning.jpg`
- 新封面均落到本地磁盘 `storage/uploads/theme-covers/`，数据库保存 `/uploads/theme-covers/...` 访问路径。
- 已验证：
  - 当前公开文章分类分布为：`AI与大模型=100`、`机器学习=38`、`Python开发=24`、`知识整理=15`、`数据库=11`、`开发运维=5`、`项目实践=4`、`前端开发=3`、`Java后端=2`、`技术随笔=1`、`产品思考=1`、`区块链=1`。
  - `blog_article` 中默认封面数量为 `0`。
  - 所有 `/uploads/...` 封面对应的本地物理文件均存在，缺失数量为 `0`。
  - 抽样访问 `http://127.0.0.1:18080/uploads/theme-covers/blog-system-core.jpg` 返回 `200` 和 `image/jpeg`。
  - `GET http://127.0.0.1:18080/api/v1/public/articles?page=1&pageSize=10` 返回 `code=200`。
- 本次为本地数据库与静态图片资源整理，没有修改 Java 源码，因此未重新执行 Maven 构建。

## 2026-04-28 站点配置后端开发

- 按用户确认，将前台首页可维护信息纳入站点配置，“关于”入口暂不处理。
- 新增站点配置表脚本：
  - `src/main/resources/sql/008_site_config.sql`
  - 表名：`blog_site_config`
  - 当前采用单行配置，固定种子 `id = 1`。
- 新增站点配置后端分层代码：
  - `system/entity/SiteConfig.java`
  - `system/vo/SiteConfigVO.java`
  - `system/dto/SiteConfigUpdateDTO.java`
  - `system/convert/SiteConfigConvert.java`
  - `system/mapper/SiteConfigMapper.java`
  - `system/service/SiteConfigService.java`
  - `system/service/impl/SiteConfigServiceImpl.java`
  - `system/controller/SiteConfigController.java`
- 新增接口：
  - `GET /api/v1/site-config`：公开查询站点配置。
  - `PUT /api/v1/site-config`：后台更新站点配置，要求登录且 `roleCode = ADMIN`。
- 站点配置字段已覆盖：
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
- 已更新 `AuthInterceptor`：
  - 放行未登录访问 `GET /api/v1/site-config`。
  - 更新接口仍保持登录保护，并在 Service 层校验管理员权限。
- 已更新菜单种子 `src/main/resources/sql/002_blog_menu.sql`：
  - 新增 `siteConfig:update` 按钮权限节点。
- 已同步本地数据库：
  - `008_site_config.sql`
  - 最新 `002_blog_menu.sql`
- 已验证：
  - `mvn -pl canbe_blog_server -DskipTests package` 构建通过。
  - 临时端口启动后 smoke 覆盖 `GET /api/v1/site-config`、管理员登录、`PUT /api/v1/site-config`，完成后已停止临时进程。

## 2026-04-29 Dify 嵌入式 Agent 后端接入

- 按用户提供的 Dify iframe 地址，补齐 Agent 嵌入式体验字段。
- 扩展 Agent 数据模型：
  - `blog_agent` 新增 `embed_url`
  - `Agent` / `AgentCreateDTO` / `AgentVO` 新增 `embedUrl`
  - `AgentMapper` 新增 `embed_url` 查询、创建、更新和映射
  - `AgentConvert` 新增 `embedUrl` 返回
- 调整 Agent 管理规则：
  - `runtimeUrl` 和 `embedUrl` 至少填写一个。
  - 测试连接优先测试 `runtimeUrl`，为空时测试 `embedUrl`。
  - 纯 `embedUrl` Agent 调用 `/api/v1/agents/{id}/chat` 时返回“该Agent使用嵌入式页面体验”。
- 新增 SQL 脚本：
  - `src/main/resources/sql/009_dify_agent.sql`
  - 自动补充 `embed_url` 字段。
  - 写入启用状态的 `DIFY_AGENT`。
  - 同步初始化角色策略和用户额度记录。
- 已同步本地数据库：
  - `DIFY_AGENT`
  - `embed_url = http://192.168.11.21/chatbot/LQ9MAToieqjkmBiV`
- 已验证：
  - `mvn -pl canbe_blog_server -DskipTests package` 构建通过。
  - 临时端口 `18082` 启动新后端 smoke，`GET /api/v1/public/agents` 可返回 `DIFY_AGENT.embedUrl`，验证后已停止临时进程。

## 2026-04-29 撤销 Dify iframe 并改为后端代理

- 按用户确认，撤销上次 Dify iframe 体验方式，Dify 统一纳入后端 Agent 调用链路。
- 扩展 Agent provider 数据模型：
  - `blog_agent` 新增 / 补齐 `provider_type`、`api_url`、`api_key`、`response_mode`。
  - `Agent` / `AgentCreateDTO` / `AgentVO` 增加 provider 相关字段。
  - `AgentVO` 不返回 `apiKey` 明文，只返回 `apiKeyConfigured`。
  - `AgentMapper` 支持 provider 字段查询、创建、更新和映射。
- 调整 Agent 管理校验：
  - `providerType = CUSTOM` 时必须填写 `runtimeUrl`。
  - `providerType = DIFY` 时必须填写 `apiUrl`。
  - V1 Dify 响应模式只允许 `blocking`。
  - 编辑 Dify Agent 时，如果 `apiKey` 为空则保留旧密钥，避免列表编辑时误清空密钥。
- 调整 Agent 调用：
  - `CUSTOM` 继续代理调用 `runtimeUrl`。
  - `DIFY` 使用 `apiUrl` + `Authorization: Bearer {apiKey}` 调用 Dify `chat-messages` blocking API。
  - 前端仍统一调用 `POST /api/v1/agents/{id}/chat`。
  - Dify 调用继续参与登录校验、额度检查、成功后扣减和调用记录。
- 更新 SQL：
  - `src/main/resources/sql/007_agent_quota.sql`
  - `src/main/resources/sql/009_dify_agent.sql`
  - `DIFY_AGENT` 改为 `provider_type = DIFY`、`embed_url = ''`、`api_url = http://192.168.11.21/v1/chat-messages`、`response_mode = blocking`。
  - `api_key` 默认留空，需要管理员在后台配置。
- 已同步本地数据库：
  - 执行最新 `009_dify_agent.sql`。
  - 当前 `DIFY_AGENT.api_key_configured = 0`。
- 已同步规范：
  - 根目录 `博客功能介绍.md`
  - 根目录 `COMMON_RULES.md`
  - `canbe_blog_server/PROJECT_RULES.md`
- 已验证：
  - `mvn -pl canbe_blog_server -DskipTests package` 构建通过。

## 2026-04-30 Agent fallback 回答后端统一规整

- 按用户确认，将 Agent 无命中 / fallback 场景的用户可见文案从前端临时兼容下沉到后端 Agent 网关层。
- 调整文件：
  - `src/main/java/com/canbe/blog/agent/service/impl/AgentChatServiceImpl.java`
- 处理规则：
  - Runtime 返回空回答时，后端统一返回客服化 fallback 文案。
  - Runtime 返回 `fallback = true` 时，后端统一返回客服化 fallback 文案。
  - Runtime 返回包含“暂未找到 + 高度相关 / 公开 FAQ / FAQ”的技术化无命中文案时，后端统一替换为客服化 fallback 文案。
  - fallback 场景统一设置 `fallback = true`。
  - fallback 场景统一将 `sources` 置为空数组，避免前台继续展示无意义来源。
  - 调用记录保存规整后的最终 `answer`，保证后台记录与用户实际看到的内容一致。
- 当前统一文案：
  - `我暂时没有找到可以直接回答这个问题的资料。`
  - `你可以换个关键词再问一次，或者告诉我更具体的场景，我再帮你查。`
- 已验证：
  - `mvn -pl canbe_blog_server -DskipTests package` 构建通过。

## 2026-04-30 Agent fallback 默认推荐问题

- 按用户要求，为 Agent 无命中 / fallback 场景补充默认推荐追问。
- 调整文件：
  - `src/main/java/com/canbe/blog/agent/service/impl/AgentChatServiceImpl.java`
- 处理规则：
  - fallback 场景下，如果 Runtime 没有返回有效 `suggestedQuestions`，后端自动补默认推荐问题。
  - 如果 Runtime 已返回有效 `suggestedQuestions`，后端保留 Runtime 的结果，不覆盖更贴近当前问题的追问。
  - 前端无需新增逻辑，继续展示接口返回的 `suggestedQuestions`。
- 当前默认推荐问题：
  - `收货地址怎么改？`
  - `怎么开发票？`
  - `商品降价可以价保吗？`
- 已验证：
  - `mvn -pl canbe_blog_server -DskipTests package` 构建通过。

## 2026-04-30 Agent fallback 推荐问题候选优先

- 按用户要求，支持 Runtime 新增返回字段 `suggestedQuestionCandidates`。
- 调整文件：
  - `src/main/java/com/canbe/blog/agent/vo/AgentChatVO.java`
  - `src/main/java/com/canbe/blog/agent/service/impl/AgentChatServiceImpl.java`
- 处理规则：
  - Runtime 已返回有效 `suggestedQuestions` 时，后端继续保留原值。
  - fallback / 未命中场景下，如果 `suggestedQuestions` 为空，则优先从 `suggestedQuestionCandidates` 提取候选问题作为 `suggestedQuestions` 返回前端。
  - `suggestedQuestionCandidates` 支持字符串数组，也兼容对象数组中的 `question` / `title` 字段。
  - `suggestedQuestionCandidates` 只作为后端规整内部字段，不随接口响应返回前端。
  - 只有候选问题也为空时，才使用固定兜底推荐问题。
- 已验证：
  - 使用 JDK 17 执行 `mvn -pl canbe_blog_server -DskipTests package` 构建通过。
