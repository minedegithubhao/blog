# 字典 / 配置体系重构设计稿

> 适用范围：`canbe_blog_server`、`canbe_agents`、`canbe_blog_web`
>
> 目标：为后续 RAG 评估、检索参数、Agent 运行参数和后台可维护配置建立一套边界清晰、可演进、可审计的设计，而不是继续把“字典”“配置”“业务实体字段”混在一起。

## 1. 先把概念讲清楚

“字典”和“配置”在中文项目里经常被混用，但它们本质上不是一回事。

- 字典更像“词典”。
  - 它回答的是：某个字段有哪些合法选项。
  - 例子：状态有“启用/停用”，Provider 有“CUSTOM/DIFY”。
- 配置更像“旋钮”。
  - 它回答的是：系统当前应该按什么参数运行。
  - 例子：`case_concurrency=5`，`commit_batch_size=10`，`retrieval_final_top_k=5`。
- 业务实体字段更像“对象自己的属性”。
  - 它回答的是：这个对象本身是什么。
  - 例子：某个 Agent 的 `name`、`runtimeUrl`、`apiUrl`、`apiKey`。

如果把三者混成一张“万能表”，短期看是省表，长期看会失去三个能力：

1. 失去语义边界：人不知道这是枚举、参数，还是对象属性。
2. 失去类型约束：数字、布尔、JSON、密钥、URL 都会被压扁成字符串。
3. 失去演进能力：一旦要做环境覆盖、版本回滚、审计、权限隔离，就会发现表结构不够表达。

这件事可以用一个很直观的类比：

- 字典是“菜单”。
- 配置是“灶台火力”。
- 业务实体字段是“这道菜本身的配方卡”。

菜单可以告诉人“能点什么”，但不能代替火力控制，更不能代替一整张配方卡。

## 2. 当前现状与核心问题

### 2.1 当前现状

基于现有代码，当前配置分布已经天然分成了三层：

1. **部署层配置**
   - `canbe_blog_server` 通过 `application-dev.yml` 持有：
     - `canbe.agent.runtime-url`
     - `canbe.agent.evaluation-base-url`
   - `canbe_agents` 通过 `pydantic-settings` + `.env` 持有：
     - Mongo / Redis / ES / Milvus / Embedding / Rerank
     - Retrieval 默认参数
2. **后台可维护数据**
   - `blog_dict_item`：当前字典表
   - `blog_site_config`：当前站点配置表
3. **业务实体内嵌配置**
   - `Agent` 表自身持有：
     - `providerType`
     - `runtimeUrl`
     - `apiUrl`
     - `apiKey`
     - `responseMode`

### 2.2 当前关键问题

#### 问题 A：`blog_dict_item` 是扁平字典，不适合承载系统配置

当前 `blog_dict_item` 同时保存：

- `type_code`
- `type_name`
- `item_label`
- `item_value`

这适合“某类型下有若干离散项”的场景，但不适合承载：

- 数值型配置
- 布尔型配置
- JSON 结构配置
- 环境覆盖
- 密钥引用
- 审计与版本

它的问题不只是“字段不够多”，而是表达模型本身不对。

#### 问题 B：`site-config` 已经在说明“配置不是一种东西”

`blog_site_config` 已经被单独建表，这其实已经证明了一个事实：

> 不是所有叫“配置”的东西都应该进字典。

站点标题、Hero 文案、头像、Footer，本质上更接近“单例内容聚合”，不是“字典项”。

#### 问题 C：跨服务配置边界不清晰

现在 `canbe_blog_server` 和 `canbe_agents` 都有配置，但来源不同：

- Server 偏 Spring Boot 外部化配置
- Agents 偏 Python `.env` / `BaseSettings`
- 后台又想做“可运营调整”的配置

如果没有统一边界，后面很容易出现三种坏味道：

1. 同一参数在 YAML、`.env`、数据库里各有一份
2. UI 改了一个值，但运行时没生效
3. `canbe_agents` 直接绕过 `canbe_blog_server` 去读另一套源，控制面失真

#### 问题 D：把 Agent 自身属性错误抽成“通用配置”会破坏聚合边界

例如某个 Agent 的 `apiUrl`、`apiKey`，并不是系统的全局配置，它是“这个 Agent 自己的 provider 属性”。

如果把这类字段强行抽到通用配置中心，会出现一个经典反模式：

> 本来应该挂在业务实体上的字段，被抽成全局 key-value，结果更新、审计、权限都变得模糊。

## 3. 设计目标

这次重构不是“做一个更大的配置表”，而是实现下面 6 个目标：

1. 字典、配置、业务实体属性三者彻底分层。
2. `canbe_blog_server` 成为**配置控制面**，`canbe_agents` 成为**配置消费面**。
3. 运行参数支持强类型，而不是一律字符串。
4. 支持默认值、环境覆盖、后台覆盖三层优先级。
5. 支持审计与回滚，不靠人工记忆“上次改了什么”。
6. 首次落地不引入 Nacos / Apollo / Consul 这类重型基础设施。

## 4. 方案比较

### 方案 A：继续沿用当前字典表，给它补字段

做法：

- 在 `blog_dict_item` 上继续加：
  - valueType
  - scope
  - env
  - jsonValue
  - secretFlag
  - description

优点：

- 改动表面最小。
- 现有 UI 最容易复用。

缺点：

- 本质模型仍然错误。
- “字典项”和“配置项”混表，语义继续污染。
- 很快会变成“能存一切，但没人敢动”的万能垃圾表。

结论：

- **不推荐**。这是把技术债包装成演进。

### 方案 B：字典与配置分仓，Server 做控制面，Agents 走只读配置 API

做法：

- 字典单独建模：
  - `dict_type`
  - `dict_item`
- 配置单独建模：
  - `config_definition`
  - `config_value`
  - `config_change_log`
- `canbe_blog_server` 负责：
  - 配置定义
  - 后台管理
  - 只读配置下发 API
- `canbe_agents` 负责：
  - 启动时加载本地 env
  - 运行期拉取可热更新配置
  - 本地缓存最后一次成功快照

优点：

- 语义最清楚。
- 能兼容当前 Spring Boot 和 Pydantic 的已有模式。
- 足够支撑下一阶段 RAG 参数化与运维化。

缺点：

- 比方案 A 多一轮迁移设计。
- 要定义配置 API 契约与生效策略。

结论：

- **推荐方案**。这是当前项目复杂度下性价比最高的做法。

### 方案 C：直接上外部配置中心（如 Nacos / Apollo / Consul）

做法：

- 全部运行参数接入独立配置中心。
- Server 与 Agents 都从配置中心读。

优点：

- 理论上能力最强。
- 多环境、多服务治理最标准。

缺点：

- 对当前项目阶段明显过重。
- 新增一套基础设施与运维面。
- 会把“模型还没想清楚”的问题提前放大成“平台接入问题”。

结论：

- **暂不推荐**。现在上这个，解决的是平台焦虑，不是当前设计问题。

## 5. 推荐设计

推荐采用 **方案 B：字典与配置分仓，Server 做控制面**。

### 5.1 核心原则

#### 原则 1：字典只做“枚举 / 参考数据”

字典只承载这些东西：

- 状态选项
- 分类选项
- 下拉可选项
- 人能看懂、能运营维护的参考项

字典不承载这些东西：

- 检索 topK
- 并发数
- 超时时间
- API Base URL
- 密钥
- JSON 结构参数

#### 原则 2：配置只做“机器运行参数”

配置只承载这些东西：

- 数值型、布尔型、字符串型、JSON 型运行参数
- 允许环境覆盖的参数
- 允许后台调整的参数
- 需要审计、回滚、灰度的参数

#### 原则 3：业务实体属性仍归业务实体

例如 `Agent` 的：

- `providerType`
- `runtimeUrl`
- `apiUrl`
- `apiKey`
- `responseMode`

仍然属于 `Agent` 聚合本身。

原因很简单：

- 它们不是“全局系统旋钮”
- 而是“某个 Agent 对象的定义属性”

这和商品表里的 `price` 不该被搬去“通用价格配置中心”是一个道理。

### 5.2 配置优先级模型

推荐采用三层优先级：

\[
V_{\text{effective}} = V_{\text{env}} \triangleright V_{\text{db}} \triangleright V_{\text{default}}
\]

其中：

- \(V_{\text{default}}\)：代码定义默认值
- \(V_{\text{db}}\)：后台配置中心值
- \(V_{\text{env}}\)：部署环境强制覆盖值
- \(\triangleright\)：表示“若左值存在，则覆盖右值”

这套顺序的含义是：

1. **代码默认值**保证本地开发能启动。
2. **数据库配置**负责后台运营可调。
3. **环境变量**保留最终兜底控制权，适合运维和敏感场景。

这也符合 Spring Boot 外部化配置和 Twelve-Factor 对环境配置分离的基本方向。

### 5.3 边界划分

#### `canbe_blog_server` 负责什么

- 配置定义与后台管理
- 字典管理
- 对 `canbe_agents` 暴露只读配置 API
- 对 Web 前端暴露管理 API
- 记录配置变更审计

#### `canbe_agents` 负责什么

- 启动时加载本地 `.env`
- 运行时读取“可远程覆盖”的配置快照
- 在远程配置不可用时继续使用本地 / 默认值
- 不直接读 `canbe_blog_server` 的数据库

#### `canbe_blog_web` 负责什么

- 只消费 Server 暴露的后台管理 API
- 不直接理解配置优先级计算逻辑
- 不直接操作 Agents 配置源

## 6. 目标数据模型

### 6.1 字典模型

#### 表 1：`blog_dict_type`

建议字段：

- `id`
- `type_code`
- `type_name`
- `description`
- `status`
- `sort_order`
- `gmt_create`
- `gmt_modified`
- `is_deleted`

职责：

- 表示“这一类字典是什么”
- 例如：
  - `agent_provider_type`
  - `record_status`
  - `quota_status`

#### 表 2：`blog_dict_item`

建议字段：

- `id`
- `type_id`
- `item_label`
- `item_value`
- `extra_json`
- `status`
- `sort_order`
- `remark`
- `gmt_create`
- `gmt_modified`
- `is_deleted`

职责：

- 表示某个字典类型下的离散项

相比当前设计，最大的变化是：

- `type_name` 不再每行重复存
- 字典类型与字典项变成真正父子关系

### 6.2 配置模型

#### 表 3：`blog_config_definition`

建议字段：

- `id`
- `config_key`
- `config_name`
- `scope_code`
- `value_type`
- `default_value`
- `schema_json`
- `is_sensitive`
- `is_required`
- `allow_runtime_override`
- `description`
- `status`
- `gmt_create`
- `gmt_modified`
- `is_deleted`

字段解释：

- `config_key`
  - 全局唯一键，例如：
    - `rag.evaluation.case_concurrency`
    - `rag.evaluation.commit_batch_size`
    - `rag.retrieval.final_top_k`
- `scope_code`
  - 归属域，例如：
    - `rag_evaluation`
    - `rag_retrieval`
    - `agent_gateway`
- `value_type`
  - `STRING | INT | FLOAT | BOOL | JSON`
- `schema_json`
  - 用于描述 JSON 结构、范围校验、枚举约束

#### 表 4：`blog_config_value`

建议字段：

- `id`
- `definition_id`
- `environment`
- `target_service`
- `value_text`
- `enabled`
- `version`
- `gmt_create`
- `gmt_modified`
- `is_deleted`

字段解释：

- `environment`
  - 例如 `dev / test / preprod / prod`
- `target_service`
  - 例如 `blog_server / canbe_agents / all`
- `value_text`
  - 落库统一存文本，读取时按 `value_type` 反序列化
- `version`
  - 单配置值版本号，用于回滚与审计

#### 表 5：`blog_config_change_log`

建议字段：

- `id`
- `definition_id`
- `environment`
- `target_service`
- `before_value`
- `after_value`
- `operator_id`
- `operator_name`
- `change_reason`
- `gmt_create`

职责：

- 做配置审计，而不是靠业务日志“顺带记一下”

### 6.3 为什么不建议第一阶段就把 `site-config` 并进通用配置表

`site-config` 看起来叫“配置”，但它更像一个站点内容聚合：

- 文案
- Logo
- Hero 展示
- Footer

这类数据的结构是稳定的、页面导向的、内容导向的。

所以推荐：

- **第一阶段保留 `blog_site_config` 独立存在**
- 先把“运行参数配置中心”做对
- 后续如果真的出现：
  - 多环境站点内容
  - 版本切换
  - 模板化站点主题

再评估是否把它迁入结构化配置中心

这一步是刻意控制抽象范围，避免一上来就把“所有叫配置的东西”统一成一个大框架。

## 7. 配置 API 契约

### 7.1 后台管理 API

由 `canbe_blog_server` 提供：

- `GET /api/v1/config-definitions`
- `POST /api/v1/config-definitions`
- `PUT /api/v1/config-definitions/{id}`
- `GET /api/v1/config-values`
- `PUT /api/v1/config-values/{id}`
- `GET /api/v1/config-change-logs`

职责：

- 给后台管理页使用
- 做配置定义、配置值、审计查询

### 7.2 Agents 只读配置 API

由 `canbe_blog_server` 提供给 `canbe_agents`：

- `GET /internal/config-snapshot?targetService=canbe_agents&environment=dev`

返回结构建议：

```json
{
  "version": "2026-05-14T10:30:00Z",
  "environment": "dev",
  "targetService": "canbe_agents",
  "items": {
    "rag.evaluation.case_concurrency": 5,
    "rag.evaluation.commit_batch_size": 10,
    "rag.retrieval.final_top_k": 5,
    "rag.retrieval.rrf_k": 60
  }
}
```

设计要点：

- 不是让 Agents 一次次查单 key
- 而是拉一份“当前有效快照”
- 这样更适合缓存，也更适合版本感知

### 7.3 生效策略

推荐：

- `canbe_agents` 启动时拉一次快照
- 后续按固定周期刷新，例如 60 秒
- 刷新失败时继续使用上次成功快照
- 首次启动如果 Server 不可达，则退回本地 `.env + 默认值`

这相当于把远程配置当成“可选增强层”，而不是“单点生死依赖”。

## 8. 哪些参数该进入配置中心，哪些不该

### 8.1 建议进入配置中心

#### RAG 检索参数

- `rag.retrieval.dense_top_k`
- `rag.retrieval.sparse_top_k`
- `rag.retrieval.keyword_top_k`
- `rag.retrieval.final_top_k`
- `rag.retrieval.rrf_k`
- `rag.retrieval.medium_confidence_threshold`
- `rag.retrieval.rerank_candidate_multiplier`

#### RAG 评估参数

- `rag.evaluation.case_concurrency`
- `rag.evaluation.commit_batch_size`
- 默认分页大小
- 默认结果过滤开关

#### 运行级非敏感参数

- 调试开关
- 某些 provider 的超时阈值
- 前后台共识的分页上限

### 8.2 不建议进入配置中心

#### 基础设施连接信息

- Mongo URI
- Redis URL
- ES URL
- Milvus Host/Port

原因：

- 这些属于部署层配置
- 更适合 `.env` / `application-*.yml`
- 也更符合 Twelve-Factor 的环境隔离思路

#### 密钥本体

- Dify API Key
- DeepSeek API Key
- DashScope / Bailian API Key

原因：

- 第一阶段不要把密钥明文塞进后台通用配置中心
- 最多只做“密钥引用名”或“是否已配置”状态管理

#### Agent 业务实体字段

- 每个 Agent 的 `runtimeUrl`
- 每个 Agent 的 `providerType`
- 每个 Agent 的 `apiUrl`
- 每个 Agent 的 `responseMode`

原因：

- 它们归属 `Agent` 聚合，不是全局配置

## 9. 迁移策略

### Phase 0：冻结概念边界

先达成统一约束：

- 不再把运行参数新塞进 `blog_dict_item`
- 不再把业务实体字段假装成通用配置

这一阶段不改库，只改规则与设计口径。

### Phase 1：字典拆型

目标：

- 引入 `blog_dict_type`
- 让 `blog_dict_item` 改为引用 `type_id`

收益：

- 先把“字典自身”建模做对
- 不让字典继续扮演配置表

### Phase 2：建立配置定义与配置值表

目标：

- 新增：
  - `blog_config_definition`
  - `blog_config_value`
  - `blog_config_change_log`

第一批配置只迁移 RAG 评估与检索相关参数，不要一口气全迁。

### Phase 3：Server 暴露配置快照 API

目标：

- `canbe_blog_server` 成为配置控制面
- `canbe_agents` 不直接碰 MySQL

### Phase 4：Agents 增加“远程配置 + 本地兜底”能力

目标：

- 本地 `.env` 继续保留
- 远程配置作为可覆盖层
- 引入最近一次成功快照缓存

### Phase 5：逐步迁移参数

迁移顺序建议：

1. `rag.evaluation.*`
2. `rag.retrieval.*`
3. 少量非敏感运行参数
4. 观察稳定性后，再决定是否扩大范围

## 10. 风险与反向概念

设计一套配置系统，最怕的不是“字段少”，而是两个反方向的错误。

### 错误 1：过度抽象

表现：

- 什么都想进配置中心
- 什么都抽成 key-value

后果：

- 聚合边界被打碎
- 配置中心变成垃圾桶

### 错误 2：过度保守

表现：

- 所有参数继续散落在 YAML、`.env`、代码默认值里
- 后台永远只能改展示文案，不能改运行参数

后果：

- 每次调优都要发版
- RAG 实验效率会越来越差

所以这次设计的目标，不是全收，也不是全放，而是做**中间那条最稳的边界线**。

## 11. 推荐决策

明确推荐如下：

1. **字典与配置分仓，不再共表。**
2. **`canbe_blog_server` 做配置控制面，`canbe_agents` 做配置消费面。**
3. **部署类配置和密钥继续留在 env / YAML，不进第一阶段数据库配置中心。**
4. **`Agent` 的 provider 属性继续挂在 `Agent` 实体，不抽成全局配置。**
5. **`site-config` 第一阶段保持独立，不强并入通用配置中心。**

这是最符合当前项目阶段的方案。

它解决的不是“表怎么改得更漂亮”，而是把系统里三种本来就不同的东西重新归位：

- 字典归字典
- 配置归配置
- 实体归实体

## 12. 非目标

这份设计稿**不包含**以下内容：

- 第一阶段接入 Nacos / Apollo / Consul
- 第一阶段把所有后台展示类配置统一迁移
- 第一阶段把所有 Agent provider 细节抽成配置中心
- 第一阶段做配置灰度发布平台

这些都可能是未来方向，但不是当前最值当的第一步。

## 13. 下一步落地建议

如果按这份设计继续往下走，建议下一份文档改写成“实现计划”，顺序如下：

1. 先写数据库重构计划：
   - `dict_type + dict_item`
   - `config_definition + config_value + change_log`
2. 再写 Server API 计划：
   - 后台管理 API
   - Agents 配置快照 API
3. 最后写 Agents 接入计划：
   - 本地默认值
   - 远程覆盖
   - 快照缓存

这样拆的好处是每一段都能独立验收，不会变成一次跨三仓的大爆改。

## 14. 外部参考

这份设计的外部校验主要参考了三类一手资料：

- Spring Boot 官方关于外部化配置与优先级的说明：
  - https://docs.spring.io/spring-boot/reference/features/external-config.html
- Pydantic 官方关于 Settings / `.env` 加载的说明：
  - https://docs.pydantic.dev/usage/settings/
- Twelve-Factor 关于“配置与代码分离”的经典原则：
  - https://12factor.net/config
