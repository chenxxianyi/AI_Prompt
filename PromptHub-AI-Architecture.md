# PromptHub AI 技术架构设计文档

## 1. 项目概述

PromptHub AI 是一个面向 AI Prompt 创作、管理、优化、对话和商业化运营的工具平台。

平台采用前后端分离架构，用户端、管理后台和后端 API 独立开发、独立构建、统一部署，便于后续模块扩展、团队协作和二次开发。

## 2. 技术栈

### 2.1 用户端前端

- Vue 3
- TypeScript
- Vite
- TailwindCSS
- Pinia
- Vue Router
- Naive UI

### 2.2 管理后台

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- Element Plus

### 2.3 后端

- Golang
- Gin
- Gorm

### 2.4 数据库与缓存

- MySQL 8
- Redis

### 2.5 部署

- Docker
- Docker Compose
- Nginx

## 3. 系统核心功能

1. 用户系统
2. Prompt 模板系统
3. Prompt 分类系统
4. Prompt 收藏系统
5. AI Prompt 生成器
6. AI Prompt 优化器
7. 多模型 AI 对话系统
8. Prompt 历史记录
9. Prompt 版本管理
10. 会员系统
11. 支付系统
12. 管理后台

## 4. 项目目录结构

```txt
prompthub-ai/
├── apps/
│   ├── web/                         # 用户端 Vue3 + Naive UI
│   │   ├── src/
│   │   │   ├── api/                 # API 请求封装
│   │   │   ├── assets/              # 静态资源
│   │   │   ├── components/          # 通用组件
│   │   │   ├── layouts/             # 布局组件
│   │   │   ├── router/              # 路由配置
│   │   │   ├── stores/              # Pinia 状态管理
│   │   │   ├── views/               # 页面
│   │   │   ├── utils/               # 工具函数
│   │   │   ├── types/               # TypeScript 类型
│   │   │   └── main.ts
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── admin/                       # 管理后台 Vue3 + Element Plus
│       ├── src/
│       │   ├── api/
│       │   ├── components/
│       │   ├── layouts/
│       │   ├── router/
│       │   ├── stores/
│       │   ├── views/
│       │   ├── permission/          # 后台权限控制
│       │   ├── types/
│       │   └── main.ts
│       ├── vite.config.ts
│       └── package.json
│
├── server/                          # Golang + Gin + Gorm
│   ├── cmd/
│   │   └── api/
│   │       └── main.go              # API 服务入口
│   ├── internal/
│   │   ├── config/                  # 配置加载
│   │   ├── router/                  # 路由注册
│   │   ├── middleware/              # 中间件
│   │   ├── handler/                 # HTTP 控制器
│   │   ├── service/                 # 业务逻辑
│   │   ├── repository/              # 数据访问
│   │   ├── model/                   # Gorm 模型
│   │   ├── dto/                     # 请求与响应 DTO
│   │   ├── response/                # 统一响应
│   │   ├── ai/                      # AI 模型适配
│   │   ├── payment/                 # 支付适配
│   │   ├── rbac/                    # 权限模块
│   │   └── job/                     # 异步任务
│   ├── pkg/
│   │   ├── jwt/                     # JWT 工具
│   │   ├── redis/                   # Redis 封装
│   │   ├── logger/                  # 日志
│   │   ├── validator/               # 参数校验
│   │   └── snowflake/               # ID 生成
│   ├── migrations/                  # 数据库迁移
│   ├── go.mod
│   └── Dockerfile
│
├── deploy/
│   ├── nginx/
│   │   └── nginx.conf
│   ├── mysql/
│   └── redis/
│
├── docker-compose.yml
├── .env.example
└── README.md
```

## 5. 数据库设计

### 5.1 用户与权限

#### users

| 字段 | 说明 |
| --- | --- |
| id | 用户 ID |
| username | 用户名 |
| email | 邮箱 |
| phone | 手机号 |
| password_hash | 密码哈希 |
| avatar | 头像 |
| status | 状态 |
| vip_level | 会员等级 |
| vip_expired_at | 会员过期时间 |
| last_login_at | 最后登录时间 |
| created_at | 创建时间 |
| updated_at | 更新时间 |
| deleted_at | 删除时间 |

#### roles

| 字段 | 说明 |
| --- | --- |
| id | 角色 ID |
| name | 角色名称 |
| code | 角色编码 |
| description | 描述 |
| status | 状态 |

#### permissions

| 字段 | 说明 |
| --- | --- |
| id | 权限 ID |
| name | 权限名称 |
| code | 权限编码 |
| type | 权限类型 |
| resource | 资源 |
| action | 操作 |

#### user_roles

| 字段 | 说明 |
| --- | --- |
| user_id | 用户 ID |
| role_id | 角色 ID |

#### role_permissions

| 字段 | 说明 |
| --- | --- |
| role_id | 角色 ID |
| permission_id | 权限 ID |

### 5.2 Prompt 模块

#### prompt_categories

| 字段 | 说明 |
| --- | --- |
| id | 分类 ID |
| parent_id | 父分类 ID |
| name | 分类名称 |
| slug | 分类标识 |
| icon | 图标 |
| sort | 排序 |
| status | 状态 |

#### prompt_templates

| 字段 | 说明 |
| --- | --- |
| id | Prompt ID |
| user_id | 创建用户 ID |
| category_id | 分类 ID |
| title | 标题 |
| description | 描述 |
| content | Prompt 内容 |
| tags | 标签 |
| variables_json | 变量配置 |
| visibility | 可见性 |
| status | 状态 |
| use_count | 使用次数 |
| favorite_count | 收藏数 |
| like_count | 点赞数 |
| current_version_id | 当前版本 ID |
| created_at | 创建时间 |
| updated_at | 更新时间 |

#### prompt_versions

| 字段 | 说明 |
| --- | --- |
| id | 版本 ID |
| prompt_id | Prompt ID |
| version | 版本号 |
| content | 版本内容 |
| change_log | 变更说明 |
| created_by | 创建人 |
| created_at | 创建时间 |

#### prompt_favorites

| 字段 | 说明 |
| --- | --- |
| id | 收藏 ID |
| user_id | 用户 ID |
| prompt_id | Prompt ID |
| created_at | 创建时间 |

#### prompt_histories

| 字段 | 说明 |
| --- | --- |
| id | 历史 ID |
| user_id | 用户 ID |
| prompt_id | Prompt ID |
| input_json | 输入参数 |
| output_text | 输出内容 |
| model | 使用模型 |
| tokens | Token 消耗 |
| created_at | 创建时间 |

### 5.3 AI 对话模块

#### ai_conversations

| 字段 | 说明 |
| --- | --- |
| id | 会话 ID |
| user_id | 用户 ID |
| title | 会话标题 |
| model_provider | 模型服务商 |
| model_name | 模型名称 |
| status | 状态 |
| created_at | 创建时间 |

#### ai_messages

| 字段 | 说明 |
| --- | --- |
| id | 消息 ID |
| conversation_id | 会话 ID |
| role | 消息角色 |
| content | 消息内容 |
| tokens | Token 消耗 |
| cost | 调用成本 |
| created_at | 创建时间 |

### 5.4 会员与支付

#### memberships

| 字段 | 说明 |
| --- | --- |
| id | 会员套餐 ID |
| name | 套餐名称 |
| level | 会员等级 |
| price | 价格 |
| duration_days | 有效天数 |
| benefits_json | 权益配置 |
| status | 状态 |

#### orders

| 字段 | 说明 |
| --- | --- |
| id | 订单 ID |
| user_id | 用户 ID |
| order_no | 订单号 |
| type | 订单类型 |
| amount | 金额 |
| status | 状态 |
| payment_channel | 支付渠道 |
| paid_at | 支付时间 |
| expired_at | 过期时间 |
| created_at | 创建时间 |

#### payments

| 字段 | 说明 |
| --- | --- |
| id | 支付记录 ID |
| order_id | 订单 ID |
| transaction_no | 第三方交易号 |
| channel | 支付渠道 |
| amount | 金额 |
| status | 状态 |
| raw_notify_json | 回调原始数据 |

### 5.5 系统配置

#### ai_model_configs

| 字段 | 说明 |
| --- | --- |
| id | 模型配置 ID |
| provider | 服务商 |
| model_name | 模型名称 |
| api_base | API 地址 |
| api_key_encrypted | 加密后的 API Key |
| max_tokens | 最大 Token |
| enabled | 是否启用 |
| sort | 排序 |

#### system_configs

| 字段 | 说明 |
| --- | --- |
| id | 配置 ID |
| key | 配置键 |
| value | 配置值 |
| description | 描述 |

#### audit_logs

| 字段 | 说明 |
| --- | --- |
| id | 日志 ID |
| user_id | 操作用户 ID |
| action | 操作 |
| resource | 资源 |
| resource_id | 资源 ID |
| ip | IP 地址 |
| user_agent | User Agent |
| created_at | 创建时间 |

### 5.6 索引设计

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
```

## 6. 后端架构设计

### 6.1 分层架构

```txt
Router
  -> Middleware
  -> Handler
  -> Service
  -> Repository
  -> Model / DB
```

### 6.2 模块划分

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

### 6.3 统一响应格式

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

### 6.4 中间件设计

```txt
JWTAuthMiddleware      登录认证
RBACMiddleware         权限校验
RateLimitMiddleware    限流
RequestIDMiddleware    请求追踪
LoggerMiddleware       请求日志
RecoveryMiddleware     异常恢复
CorsMiddleware         跨域
```

### 6.5 高并发设计

1. 使用 Redis 缓存热门 Prompt、分类、系统配置。
2. 使用 Redis 对登录、AI 调用、支付查询等高频接口做限流。
3. AI 请求支持流式响应，长任务预留异步队列能力。
4. MySQL 连接池、Redis 连接池、HTTP Client 连接池统一配置。
5. 热门 Prompt 榜单使用缓存加定时刷新。
6. 支付回调必须做幂等处理。
7. 订单号、支付流水号、Prompt ID 建议使用雪花 ID 或类似全局唯一 ID。
8. 后续可扩展 MySQL 读写分离、消息队列和对象存储。

## 7. 前端架构设计

### 7.1 用户端页面

```txt
views/
├── home/                 首页
├── auth/                 登录注册
├── prompts/              Prompt 广场、详情、编辑
├── generator/            AI Prompt 生成器
├── optimizer/            AI Prompt 优化器
├── chat/                 多模型 AI 对话
├── favorites/            我的收藏
├── history/              使用历史
├── member/               会员中心
├── order/                支付订单
└── user/                 个人中心
```

### 7.2 管理后台页面

```txt
views/
├── login/
├── dashboard/
├── users/
├── roles/
├── permissions/
├── prompts/
├── categories/
├── ai-models/
├── members/
├── orders/
├── payments/
├── system-config/
└── audit-logs/
```

### 7.3 前端基础模块

```txt
api/          Axios 请求封装
stores/       Pinia 状态管理
router/       路由与权限守卫
layouts/      页面布局
components/   通用组件
utils/        工具函数
types/        TypeScript 类型
```

### 7.4 Pinia Store 设计

```txt
useAuthStore          Token、登录状态、当前用户
useUserStore          用户资料
usePromptStore        Prompt 状态
useChatStore          对话状态
useMemberStore        会员权益
usePermissionStore    后台权限、菜单、按钮权限
```

## 8. API 接口设计

### 8.1 认证接口

```txt
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me
```

### 8.2 Prompt 接口

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

### 8.3 分类接口

```txt
GET    /api/v1/categories

POST   /api/v1/admin/categories
PUT    /api/v1/admin/categories/:id
DELETE /api/v1/admin/categories/:id
```

### 8.4 AI 接口

```txt
POST   /api/v1/ai/generate
POST   /api/v1/ai/optimize
GET    /api/v1/ai/models
```

### 8.5 多模型对话接口

```txt
GET    /api/v1/conversations
POST   /api/v1/conversations
GET    /api/v1/conversations/:id
DELETE /api/v1/conversations/:id

GET    /api/v1/conversations/:id/messages
POST   /api/v1/conversations/:id/messages
```

### 8.6 用户中心接口

```txt
GET    /api/v1/user/profile
PUT    /api/v1/user/profile
GET    /api/v1/user/favorites
GET    /api/v1/user/prompt-histories
GET    /api/v1/user/orders
```

### 8.7 会员与支付接口

```txt
GET    /api/v1/memberships
POST   /api/v1/orders
GET    /api/v1/orders/:order_no
POST   /api/v1/payments/notify/:channel
```

### 8.8 管理后台接口

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

## 9. Docker 部署方案

### 9.1 服务组成

```txt
nginx       反向代理、静态资源服务
web         用户端前端
admin       管理后台前端
api         Golang 后端服务
mysql       MySQL 8
redis       Redis
```

### 9.2 docker-compose.yml 示例

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

  nginx:
    image: nginx:stable
    container_name: prompthub-nginx
    ports:
      - "80:80"
    volumes:
      - ./deploy/nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./apps/web/dist:/usr/share/nginx/html/web
      - ./apps/admin/dist:/usr/share/nginx/html/admin
    depends_on:
      - api
```

### 9.3 环境变量示例

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

## 10. MVP 开发顺序

### 第一阶段：基础工程与核心闭环

1. 初始化项目结构。
2. 搭建 Docker Compose、MySQL、Redis、Nginx。
3. 搭建后端 Gin 基础框架。
4. 实现统一响应、错误处理、日志、配置加载。
5. 实现用户注册、登录、JWT 认证。
6. 实现用户端和后台端基础布局。
7. 实现 Prompt 分类、Prompt 模板 CRUD。
8. 实现 Prompt 广场、详情页、创建与编辑页。

### 第二阶段：Prompt 能力增强

1. 实现 Prompt 收藏。
2. 实现 Prompt 使用历史。
3. 实现 Prompt 版本管理。
4. 实现 Prompt 搜索、筛选、分页。
5. 实现热门 Prompt 缓存。

### 第三阶段：AI 能力

1. 实现 AI 模型配置。
2. 实现 AI Prompt 生成器。
3. 实现 AI Prompt 优化器。
4. 实现多模型对话。
5. 实现 AI 调用历史和 Token 消耗记录。
6. 支持流式响应。

### 第四阶段：管理后台

1. 实现后台登录。
2. 实现 RBAC 权限管理。
3. 实现用户管理。
4. 实现角色与权限管理。
5. 实现 Prompt 审核。
6. 实现分类管理。
7. 实现 AI 模型配置管理。
8. 实现系统配置与审计日志。

### 第五阶段：商业化

1. 实现会员套餐。
2. 实现会员权益校验。
3. 实现订单创建。
4. 实现支付回调。
5. 实现订单状态流转。
6. 实现支付回调幂等处理。

### 第六阶段：部署与优化

1. 完善 Dockerfile 和 docker-compose.yml。
2. 配置 Nginx 反向代理。
3. 增加 Redis 缓存策略。
4. 增加接口限流。
5. 优化数据库索引和慢查询。
6. 增加日志、监控和告警预留。

## 11. MVP 推荐范围

第一版 MVP 建议优先完成以下功能：

1. 用户注册与登录。
2. JWT 认证。
3. Prompt 分类。
4. Prompt 模板 CRUD。
5. Prompt 收藏。
6. AI Prompt 生成器。
7. AI Prompt 优化器。
8. 基础管理后台。

暂缓到后续版本的功能：

1. 支付系统。
2. 完整会员权益系统。
3. 多模型复杂上下文对话。
4. Prompt 高级版本回滚。
5. 复杂运营数据看板。

## 12. 后续扩展建议

1. 支持 Prompt 市场和作者收益分成。
2. 支持团队空间和企业账号。
3. 支持 Prompt 运行效果评分。
4. 支持 AI 模型调用成本统计。
5. 支持插件化 AI Provider。
6. 支持对象存储保存附件和头像。
7. 支持消息队列处理异步 AI 任务。
8. 支持 OpenAPI 文档自动生成。

