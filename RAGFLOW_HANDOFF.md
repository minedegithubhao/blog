# RAGFlow 交接文档

最后更新：2026-04-24  
工作目录：`D:\IdeaProjects\blog`

## 1. 本次目标

在用户的 WSL Ubuntu 环境中完成 RAGFlow 安装，并保证服务可访问、可登录。

## 2. 最终结果

RAGFlow 已成功安装并启动，当前可用入口如下：

- Web UI: `http://localhost:8880`
- HTTP API: `http://localhost:9380`
- Elasticsearch: `localhost:1200`
- MySQL: `localhost:5455`
- Redis: `localhost:7379`
- MinIO API: `localhost:9000`
- MinIO Console: `http://localhost:9001`

当前容器：

- `ragflow-server`
- `ragflow-mysql`
- `ragflow-redis`
- `ragflow-es-01`
- `ragflow-minio`

## 3. 已创建账号

RAGFlow 登录不是“用户名 + 密码”模型，而是“邮箱 + 密码”，昵称单独存在。

已创建账号：

- 昵称：`canbe`
- 登录邮箱：`canbe@ragflow.local`
- 登录密码：`cxd123`

说明：

- 这是按用户提供的 `canbe / cxd123` 落地的可登录账号。
- UI 登录时应填写邮箱 `canbe@ragflow.local`，不是只填 `canbe`。

## 4. 安装路径与配置位置

RAGFlow 使用的目录：

- `D:\AAA_tools\ragflow-main`
- `D:\AAA_tools\ragflow-main\docker`

本次实际修改了两个外部配置文件：

- [`.env`](D:/AAA_tools/ragflow-main/docker/.env)
- [`docker-compose-base.yml`](D:/AAA_tools/ragflow-main/docker/docker-compose-base.yml)

## 5. 为什么这样改

本机一开始并不是“RAGFlow 已安装”，而只是有一套手工拼的依赖栈：

- MySQL
- Redis
- MongoDB
- Elasticsearch
- etcd
- MinIO
- Milvus

那套文件在：

- [`docker-compose.yaml`](D:/AAA_tools/docker-compose.yaml)

它提供的是“底座”，不是官方 RAGFlow 服务本体，所以最开始并没有 `ragflow-server` 容器。

后来切换到官方 `ragflow-main/docker` 方案安装。

## 6. 关键改动

### 6.1 复用本机已有基础镜像

为了减少拉取失败概率，在 [`docker-compose-base.yml`](D:/AAA_tools/ragflow-main/docker/docker-compose-base.yml) 中做了兼容替换：

- `mysql:8.0.39` 改为 `mysql:8.0`
- `quay.io/minio/minio:RELEASE.2023-12-20T01-00-02Z` 改为 `minio/minio:RELEASE.2023-03-20T20-16-18Z`
- `valkey/valkey:8` 改为 `redis:7.4.8-bookworm`

原因：

- 本机缓存里已有这些镜像。
- 这样能绕开一部分外网镜像拉取失败问题。

### 6.2 将 RAGFlow 主镜像切到华为云镜像且使用 slim 版

在 [`.env`](D:/AAA_tools/ragflow-main/docker/.env) 中，将：

- `RAGFLOW_IMAGE=infiniflow/ragflow:v0.19.0`

改成了：

- `RAGFLOW_IMAGE=swr.cn-north-4.myhuaweicloud.com/infiniflow/ragflow:v0.19.0-slim`

原因：

- Docker 默认加速链路对 `infiniflow/ragflow:v0.19.0` 大镜像存在 TLS 超时。
- 华为云镜像仓库可访问。
- `slim` 版更小，更容易拉取成功，也足够先把平台跑起来。

## 7. 已验证项

已验证以下内容：

- `docker compose up -d` 成功
- `docker compose ps` 显示核心容器均为 `Up`
- `http://127.0.0.1:8880` 返回 `200`
- `http://127.0.0.1:9380` 返回 `200`
- 注册接口成功创建账号
- 登录接口成功返回 `Welcome back!`

## 8. 启停命令

启动：

```powershell
wsl.exe -e sh -lc "cd /mnt/d/AAA_tools/ragflow-main/docker && docker compose up -d"
```

停止：

```powershell
wsl.exe -e sh -lc "cd /mnt/d/AAA_tools/ragflow-main/docker && docker compose down"
```

查看状态：

```powershell
wsl.exe -e sh -lc "cd /mnt/d/AAA_tools/ragflow-main/docker && docker compose ps"
```

查看日志：

```powershell
wsl.exe -e sh -lc "docker logs -f ragflow-server"
```

## 9. 已知注意事项

### 9.1 当前版本

本次落地的是：

- `RAGFlow v0.19.0 slim`

不是最新版。原因不是功能问题，而是：

- 本机已有这一套源码目录和教程上下文；
- 先把能跑的版本稳定落地，比中途切最新版更稳。

### 9.2 slim 版含义

`slim` 版不内置 embedding 模型。

这不是故障，而是镜像裁剪策略。它的优点是：

- 拉取更快
- 安装更稳
- 更适合先搭平台

后续如果需要模型能力，可以在 RAGFlow 后台继续配置外部模型服务。

### 9.3 登录方式

用户如果直接输入 `canbe` 登录，很可能会以为密码错了。  
正确登录名是邮箱：

- `canbe@ragflow.local`

## 10. 后续建议

如果下一位智能体继续接手，优先顺序建议如下：

1. 先打开 `http://localhost:8880` 验证 UI 可正常进入。
2. 用 `canbe@ragflow.local / cxd123` 登录验证。
3. 再继续配置大模型、知识库、以及 Dify 对接。
4. 如果要给 Dify 对接检索接口，再重点检查 `9380` 端口和 RAGFlow 的 API Key 配置。

