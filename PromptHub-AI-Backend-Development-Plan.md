# PromptHub AI 后端开发方案

## 1. 文档目标

本文档用于指导 PromptHub AI 后端服务开发，包括 API 服务、数据库设计、缓存、鉴权、RBAC、AI 模型适配、会员支付和 Docker 部署相关内容。

后端采用 Golang、Gin、Gorm 构建，数据库使用 MySQL 8，缓存和限流使用 Redis。系统对外提供 RESTful API，并为用户端和管理后台提供统一的数据服务。

## 2. 技术栈

- Golang
- Gin
- Gorm
- MySQL 8
- Redis
- JWT
- Docker
- Docker Compose
- Nginx

## 3. 后端项目结构

```txt
server/
├── cmd/
│   └── api/
│       └── main.go                  # API 服务入口
├── internal/
│   ├── config/                      # 配置加载
│   ├── router/                      # 路由注册
│   ├── middleware/                  # 中间件
│   ├── handler/                     # HTTP 控制器
│   ├── service/                     # 业务逻辑
│   ├── repository/                  # 数据访问
│   ├── model/                       # Gorm 模型
│   ├── dto/                         # 请求与响应 DTO
│   ├── response/                    # 统一响应
│   ├── ai/                          # AI Provider 适配
│   ├── payment/                     # 支付渠道适配
│   ├── rbac/                        # RBAC 权限模块
│   └── job/                         # 异步任务
├── pkg/
│   ├── jwt/                         # JWT 工具
│   ├── redis/                       # Redis 封装
│   ├── logger/                      # 日志
│   ├── validator/                   # 参数校验
│   └── snowflake/                   # ID 生成
├── migrations/                      # 数据库迁移
├── go.mod
└── Dockerfile
```

## 4. 架构分层

```txt
Router
  -> Middleware
  -> Handler
  -> Service
  -> Repository
  -> Model / DB
```

各层职责：

1. `router`：集中注册 API 路由和路由分组。
2. `middleware`：处理认证、权限、日志、限流、恢复、跨域。
3. `handler`：解析请求参数，调用 service，返回统一响应。
4. `service`：承载业务逻辑和事务编排。
5. `repository`：封装数据库查询和持久化操作。
6. `model`：定义 Gorm 数据模型。
7. `dto`：定义请求、响应和列表查询结构。

## 5. 后端模块划分

```txt
auth        注册、登录、刷新 Token、退出登录
user        用户资料、密码、安全设置
rbac        角色、权限、菜单、接口权限
prompt      Prompt 模板、版本、收藏、历史
category    分类管理
ai          Prompt 生成、优化、多模型对话
member      会员套餐、权益校验
payment     下单、支付回调、订单查询
admin       管理后台接口
system      配置、审计日志、模型配置
```

## 6. 数据库设计

### 6.1 用户与权限表

#### users

```txt
id
username
email
phone
password_hash
avatar
status
vip_level
vip_expired_at
last_login_at
created_at
updated_at
deleted_at
```

#### roles

```txt
id
name
code
description
status
created_at
updated_at
```

#### permissions

```txt
id
name
code
type
resource
action
created_at
updated_at
```

#### user_roles

```txt
user_id
role_id
```

#### role_permissions

```txt
role_id
permission_id
```

### 6.2 Prompt 表

#### prompt_categories

```txt
id
parent_id
name
slug
icon
sort
status
created_at
updated_at
```

#### prompt_templates

```txt
id
user_id
category_id
title
description
content
tags
variables_json
visibility
status
use_count
favorite_count
like_count
current_version_id
created_at
updated_at
deleted_at
```

#### prompt_versions

```txt
id
prompt_id
version
content
change_log
created_by
created_at
```

#### prompt_favorites

```txt
id
user_id
prompt_id
created_at
```

#### prompt_histories

```txt
id
user_id
prompt_id
input_json
output_text
model
tokens
created_at
```

### 6.3 AI 对话表

#### ai_conversations

```txt
id
user_id
title
model_provider
model_name
status
created_at
updated_at
```

#### ai_messages

```txt
id
conversation_id
role
content
tokens
cost
created_at
```

### 6.4 会员与支付表

#### memberships

```txt
id
name
level
price
duration_days
benefits_json
status
created_at
updated_at
```

#### orders

```txt
id
user_id
order_no
type
amount
status
payment_channel
paid_at
expired_at
created_at
updated_at
```

#### payments

```txt
id
order_id
transaction_no
channel
amount
status
raw_notify_json
created_at
updated_at
```

### 6.5 系统表

#### ai_model_configs

```txt
id
provider
model_name
api_base
api_key_encrypted
max_tokens
enabled
sort
created_at
updated_at
```

#### system_configs

```txt
id
key
value
description
created_at
updated_at
```

#### audit_logs

```txt
id
user_id
action
resource
resource_id
ip
user_agent
created_at
```

### 6.6 索引设计

```txt
users:
- email unique
- phone unique

prompt_templates:
- category_id
- user_id
- status
- visibility
- created_at

prompt_favorites:
- user_id + prompt_id unique

prompt_histories:
- user_id
- prompt_id
- created_at

ai_messages:
- conversation_id
- created_at

orders:
- order_no unique
- user_id
- status

payments:
- transaction_no
- order_id
```

## 7. 统一响应设计

普通响应：

```json
{
  "code": 0,
  "message": "success",
  "data": {},
  "request_id": "req_xxx"
}
```

分页响应：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [],
    "pagination": {
      "page": 1,
      "page_size": 20,
      "total": 100
    }
  },
  "request_id": "req_xxx"
}
```

错误码建议：

```txt
0       success
40000   bad request
40100   unauthorized
40300   forbidden
40400   not found
40900   conflict
42900   too many requests
50000   internal server error
```

## 8. 中间件设计

```txt
RequestIDMiddleware    生成请求 ID
LoggerMiddleware       记录请求日志
RecoveryMiddleware     捕获 panic
CorsMiddleware         跨域处理
JWTAuthMiddleware      JWT 登录认证
RBACMiddleware         角色权限校验
RateLimitMiddleware    Redis 限流
```

中间件执行顺序建议：

```txt
Recovery -> RequestID -> Logger -> Cors -> RateLimit -> JWTAuth -> RBAC -> Handler
```

## 9. JWT 与 RBAC 设计

### 9.1 JWT

Token 中建议包含：

```txt
user_id
username
role_codes
token_type
expires_at
```

认证流程：

1. 用户登录成功后签发 Access Token。
2. 前端请求时通过 `Authorization: Bearer <token>` 传递。
3. 后端中间件解析 Token 并写入上下文。
4. Token 过期后通过刷新接口重新获取。
5. 退出登录时可将 Token 加入 Redis 黑名单。

### 9.2 RBAC

权限模型：

```txt
User -> UserRole -> Role -> RolePermission -> Permission
```

权限校验策略：

1. 普通用户接口只校验登录态。
2. 后台接口必须校验角色和权限。
3. 权限编码建议格式为 `resource:action`，例如 `prompt:review`。
4. 管理员权限可缓存到 Redis。
5. 角色权限变更后清理相关用户权限缓存。

## 10. API 接口设计

### 10.1 认证接口

```txt
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me
```

### 10.2 Prompt 接口

```txt
GET    /api/v1/prompts
POST   /api/v1/prompts
GET    /api/v1/prompts/:id
PUT    /api/v1/prompts/:id
DELETE /api/v1/prompts/:id

POST   /api/v1/prompts/:id/favorite
DELETE /api/v1/prompts/:id/favorite

GET    /api/v1/prompts/:id/versions
POST   /api/v1/prompts/:id/versions
POST   /api/v1/prompts/:id/versions/:version_id/rollback
```

### 10.3 分类接口

```txt
GET    /api/v1/categories
POST   /api/v1/admin/categories
PUT    /api/v1/admin/categories/:id
DELETE /api/v1/admin/categories/:id
```

### 10.4 AI 接口

```txt
GET    /api/v1/ai/models
POST   /api/v1/ai/generate
POST   /api/v1/ai/optimize
```

### 10.5 多模型对话接口

```txt
GET    /api/v1/conversations
POST   /api/v1/conversations
GET    /api/v1/conversations/:id
DELETE /api/v1/conversations/:id

GET    /api/v1/conversations/:id/messages
POST   /api/v1/conversations/:id/messages
```

### 10.6 用户中心接口

```txt
GET    /api/v1/user/profile
PUT    /api/v1/user/profile
GET    /api/v1/user/favorites
GET    /api/v1/user/prompt-histories
GET    /api/v1/user/orders
```

### 10.7 会员与支付接口

```txt
GET    /api/v1/memberships
POST   /api/v1/orders
GET    /api/v1/orders/:order_no
POST   /api/v1/payments/notify/:channel
```

### 10.8 管理后台接口

```txt
GET    /api/v1/admin/dashboard

GET    /api/v1/admin/users
GET    /api/v1/admin/users/:id
PUT    /api/v1/admin/users/:id/status

GET    /api/v1/admin/roles
POST   /api/v1/admin/roles
PUT    /api/v1/admin/roles/:id
DELETE /api/v1/admin/roles/:id

GET    /api/v1/admin/permissions

GET    /api/v1/admin/prompts
PUT    /api/v1/admin/prompts/:id/status

GET    /api/v1/admin/orders
GET    /api/v1/admin/payments

GET    /api/v1/admin/ai-models
POST   /api/v1/admin/ai-models
PUT    /api/v1/admin/ai-models/:id
DELETE /api/v1/admin/ai-models/:id

GET    /api/v1/admin/system-configs
PUT    /api/v1/admin/system-configs/:key

GET    /api/v1/admin/audit-logs
```

## 11. AI 模块设计

### 11.1 Provider 抽象

AI 模块需要对不同模型服务商做统一抽象：

```txt
Provider
- GeneratePrompt
- OptimizePrompt
- Chat
- StreamChat
```

建议支持：

1. 模型配置从 `ai_model_configs` 表读取。
2. API Key 加密存储。
3. 对话支持普通响应和流式响应。
4. 记录 Token 消耗和调用成本。
5. 支持模型启用、禁用和排序。

### 11.2 AI 调用流程

1. 校验用户登录态。
2. 校验会员权益或调用额度。
3. 读取模型配置。
4. 组装 Prompt 或对话上下文。
5. 调用模型服务。
6. 写入历史记录或消息记录。
7. 更新 Token 消耗统计。

## 12. 会员与支付设计

### 12.1 会员系统

会员权益建议存储在 `benefits_json` 中：

```json
{
  "daily_ai_calls": 100,
  "max_context_messages": 20,
  "allowed_models": ["gpt-4.1", "gpt-4.1-mini"],
  "private_prompts": true
}
```

权益校验场景：

1. AI Prompt 生成。
2. AI Prompt 优化。
3. 多模型对话。
4. 私有 Prompt 数量。
5. 高级模型访问权限。

### 12.2 支付系统

支付流程：

1. 用户选择会员套餐。
2. 创建订单。
3. 调用支付渠道生成支付参数。
4. 用户完成支付。
5. 支付渠道回调后端。
6. 后端校验签名。
7. 幂等更新订单和支付记录。
8. 发放会员权益。

支付回调必须保证幂等，订单状态变更需要在事务中完成。

## 13. Redis 使用方案

Redis 使用场景：

1. 登录 Token 黑名单。
2. 用户权限缓存。
3. 热门 Prompt 缓存。
4. 分类树缓存。
5. 系统配置缓存。
6. AI 调用频率限制。
7. 登录失败次数限制。
8. 支付状态短期缓存。

Key 命名建议：

```txt
auth:blacklist:{token_id}
rbac:user:{user_id}
prompt:hot:list
category:tree
system:config:{key}
rate:ai:{user_id}:{date}
rate:login:{ip}
```

## 14. 高并发与稳定性设计

1. MySQL、Redis、HTTP Client 使用连接池。
2. 热点数据使用 Redis 缓存。
3. AI 接口使用限流和会员额度控制。
4. 长耗时 AI 请求支持流式返回。
5. 支付回调必须幂等。
6. 列表查询必须分页。
7. 后台导出等长任务预留异步任务能力。
8. 常用查询字段建立索引。
9. 所有外部服务调用设置超时时间。
10. 统一记录请求日志、错误日志和审计日志。

## 15. Docker 部署方案

### 15.1 服务组成

```txt
nginx       反向代理、静态资源
api         Golang API 服务
mysql       MySQL 8
redis       Redis
```

### 15.2 docker-compose.yml 示例

```yaml
services:
  mysql:
    image: mysql:8.0
    container_name: prompthub-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: prompthub
      TZ: Asia/Shanghai
    ports:
      - "3306:3306"
    volumes:
      - ./deploy/mysql/data:/var/lib/mysql
    command:
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci

  redis:
    image: redis:7
    container_name: prompthub-redis
    ports:
      - "6379:6379"
    volumes:
      - ./deploy/redis/data:/data

  api:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: prompthub-api
    env_file:
      - .env
    depends_on:
      - mysql
      - redis
    ports:
      - "8080:8080"
```

### 15.3 环境变量

```txt
APP_ENV=production
APP_PORT=8080

MYSQL_DSN=root:root@tcp(mysql:3306)/prompthub?charset=utf8mb4&parseTime=True&loc=Local

REDIS_ADDR=redis:6379
REDIS_PASSWORD=
REDIS_DB=0

JWT_SECRET=change_me
JWT_EXPIRE_HOURS=24

AI_OPENAI_API_KEY=
AI_OPENAI_BASE_URL=

PAYMENT_NOTIFY_URL=
```

## 16. 后端开发顺序

### 第一阶段：工程基础

1. 初始化 Go Module。
2. 搭建 Gin 服务入口。
3. 配置加载和环境变量。
4. 初始化 Gorm、MySQL、Redis。
5. 实现统一响应和错误码。
6. 实现日志、请求 ID、异常恢复、跨域。

### 第二阶段：认证与权限

1. 用户注册。
2. 用户登录。
3. JWT 签发和解析。
4. 当前用户信息接口。
5. RBAC 数据模型。
6. 管理后台权限中间件。

### 第三阶段：Prompt MVP

1. 分类 CRUD。
2. Prompt 模板 CRUD。
3. Prompt 列表、详情、搜索、分页。
4. Prompt 收藏。
5. Prompt 使用历史。
6. Prompt 版本创建和查看。

### 第四阶段：AI 能力

1. AI 模型配置表。
2. AI Provider 抽象。
3. Prompt 生成接口。
4. Prompt 优化接口。
5. 多模型对话接口。
6. 流式响应。
7. Token 消耗记录。

### 第五阶段：管理后台

1. 用户管理接口。
2. 角色权限管理接口。
3. Prompt 审核接口。
4. 分类管理接口。
5. AI 模型配置接口。
6. 系统配置接口。
7. 审计日志接口。

### 第六阶段：会员与支付

1. 会员套餐接口。
2. 会员权益校验。
3. 订单创建。
4. 支付渠道适配。
5. 支付回调。
6. 订单状态流转。
7. 支付幂等处理。

### 第七阶段：部署与优化

1. 编写 Dockerfile。
2. 完善 docker-compose.yml。
3. 增加数据库迁移脚本。
4. 增加 Redis 缓存策略。
5. 增加接口限流。
6. 优化慢查询和索引。
7. 补充接口文档和基础测试。

## 17. 后端交付物

1. Golang API 服务。
2. MySQL 数据表和迁移脚本。
3. Redis 缓存与限流能力。
4. JWT 鉴权和 RBAC 权限管理。
5. Prompt、AI、会员、支付核心 API。
6. Dockerfile 和部署配置。
7. `.env.example` 环境变量示例。
8. API 文档或 OpenAPI 说明。

