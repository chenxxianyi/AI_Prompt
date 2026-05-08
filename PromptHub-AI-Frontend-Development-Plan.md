# PromptHub AI 前端开发方案

## 1. 文档目标

本文档用于指导 PromptHub AI 前端部分的开发，包括用户端 `apps/web` 和管理后台 `apps/admin` 两个独立应用。

前端采用前后端分离模式，通过 RESTful API 与后端交互。用户端面向普通用户，重点提供 Prompt 浏览、创建、收藏、AI 生成、AI 优化、多模型对话和会员中心能力；管理后台面向运营和管理员，重点提供用户、Prompt、分类、权限、订单、模型配置和系统配置管理能力。

## 2. 技术栈

### 2.1 用户端

- Vue 3
- TypeScript
- Vite
- TailwindCSS
- Pinia
- Vue Router
- Naive UI
- Axios

### 2.2 管理后台

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- Element Plus
- Axios

## 3. 前端项目结构

```txt
apps/
├── web/
│   ├── src/
│   │   ├── api/                 # 用户端 API 模块
│   │   ├── assets/              # 静态资源
│   │   ├── components/          # 通用组件
│   │   ├── layouts/             # 用户端布局
│   │   ├── router/              # 用户端路由
│   │   ├── stores/              # Pinia 状态
│   │   ├── styles/              # 全局样式
│   │   ├── types/               # TypeScript 类型
│   │   ├── utils/               # 工具函数
│   │   ├── views/               # 页面
│   │   ├── App.vue
│   │   └── main.ts
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── admin/
    ├── src/
    │   ├── api/                 # 后台 API 模块
    │   ├── assets/
    │   ├── components/
    │   ├── layouts/             # 后台布局
    │   ├── permission/          # 路由权限、按钮权限
    │   ├── router/
    │   ├── stores/
    │   ├── styles/
    │   ├── types/
    │   ├── utils/
    │   ├── views/
    │   ├── App.vue
    │   └── main.ts
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

## 4. 用户端功能模块

### 4.1 页面规划

```txt
views/
├── home/                 首页、热门 Prompt、推荐分类
├── auth/                 登录、注册、找回密码
├── prompts/              Prompt 广场、详情、创建、编辑
├── generator/            AI Prompt 生成器
├── optimizer/            AI Prompt 优化器
├── chat/                 多模型 AI 对话
├── favorites/            我的收藏
├── history/              Prompt 使用历史
├── member/               会员中心、套餐列表
├── order/                订单列表、支付状态
└── user/                 个人中心、账号设置
```

### 4.2 核心用户流程

1. 用户注册或登录。
2. 进入 Prompt 广场浏览模板。
3. 按分类、关键词、标签筛选 Prompt。
4. 查看 Prompt 详情并复制、使用或收藏。
5. 创建自己的 Prompt 模板。
6. 使用 AI Prompt 生成器生成新 Prompt。
7. 使用 AI Prompt 优化器优化已有 Prompt。
8. 在多模型对话页选择模型并进行对话。
9. 在个人中心查看收藏、历史、订单和会员状态。

### 4.3 用户端组件建议

```txt
components/
├── AppHeader.vue
├── AppFooter.vue
├── PromptCard.vue
├── PromptEditor.vue
├── PromptVariableForm.vue
├── CategoryTree.vue
├── ModelSelect.vue
├── ChatMessageList.vue
├── ChatInput.vue
├── EmptyState.vue
├── PaginationBar.vue
└── UserAvatarMenu.vue
```

## 5. 管理后台功能模块

### 5.1 页面规划

```txt
views/
├── login/                后台登录
├── dashboard/            数据看板
├── users/                用户管理
├── roles/                角色管理
├── permissions/          权限管理
├── prompts/              Prompt 审核与管理
├── categories/           分类管理
├── ai-models/            AI 模型配置
├── members/              会员套餐管理
├── orders/               订单管理
├── payments/             支付记录
├── system-config/        系统配置
└── audit-logs/           审计日志
```

### 5.2 后台核心能力

1. 管理员登录和 JWT 鉴权。
2. 动态路由和菜单权限。
3. 用户启用、禁用、查询。
4. 角色、权限、角色授权。
5. Prompt 审核、下架、推荐。
6. 分类新增、编辑、排序、禁用。
7. AI 模型配置管理。
8. 会员套餐、订单、支付记录管理。
9. 系统配置和审计日志查询。

### 5.3 管理后台组件建议

```txt
components/
├── AdminLayout.vue
├── SidebarMenu.vue
├── TopBar.vue
├── PermissionButton.vue
├── SearchForm.vue
├── DataTable.vue
├── StatusTag.vue
├── ConfirmAction.vue
└── JsonViewer.vue
```

## 6. API 模块设计

### 6.1 Axios 封装

统一封装请求实例：

```txt
api/
├── request.ts            # Axios 实例、拦截器、错误处理
├── auth.ts
├── user.ts
├── prompt.ts
├── category.ts
├── ai.ts
├── conversation.ts
├── member.ts
├── order.ts
└── admin.ts
```

请求拦截器职责：

1. 自动携带 `Authorization: Bearer <token>`。
2. 自动注入请求 ID，便于排查问题。
3. 统一处理 `401`，跳转登录页。
4. 统一处理后端业务错误码。
5. 对 AI 流式接口单独封装。

### 6.2 前端统一响应类型

```ts
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  request_id: string
}

export interface Pagination {
  page: number
  page_size: number
  total: number
}

export interface PageResult<T> {
  list: T[]
  pagination: Pagination
}
```

## 7. 状态管理设计

```txt
stores/
├── auth.ts               # Token、登录状态、当前用户
├── user.ts               # 用户资料
├── prompt.ts             # Prompt 列表、详情、筛选条件
├── category.ts           # 分类树
├── chat.ts               # 当前会话、消息列表、流式输出状态
├── member.ts             # 会员权益和套餐
├── permission.ts         # 后台菜单、角色、按钮权限
└── app.ts                # 主题、布局、全局加载状态
```

状态管理原则：

1. 页面临时状态放在组件内。
2. 跨页面共享状态放在 Pinia。
3. Token 持久化到本地存储。
4. 用户信息在登录后拉取并缓存。
5. 后台菜单根据权限接口动态生成。
6. AI 对话消息需要支持增量更新。

## 8. 路由设计

### 8.1 用户端路由

```txt
/
/login
/register
/prompts
/prompts/:id
/prompts/create
/prompts/:id/edit
/generator
/optimizer
/chat
/favorites
/history
/member
/orders
/user/profile
```

### 8.2 管理后台路由

```txt
/admin/login
/admin/dashboard
/admin/users
/admin/roles
/admin/permissions
/admin/prompts
/admin/categories
/admin/ai-models
/admin/members
/admin/orders
/admin/payments
/admin/system-config
/admin/audit-logs
```

### 8.3 路由守卫

1. 未登录访问受保护页面时跳转登录页。
2. 已登录访问登录页时跳转首页或后台首页。
3. 后台路由根据权限动态校验。
4. 页面标题根据路由元信息设置。
5. Token 过期后清空登录状态。

## 9. UI 与交互规范

### 9.1 用户端

1. 使用 Naive UI 作为基础组件库。
2. 使用 TailwindCSS 负责布局、间距和少量定制样式。
3. Prompt 广场以列表和卡片结合展示，重点突出标题、简介、标签、分类、使用次数和收藏数。
4. Prompt 编辑器需要支持变量标记、预览和版本提示。
5. AI 生成器和优化器需要提供明确的输入区、结果区和复制按钮。
6. 多模型对话需要支持模型选择、会话列表、消息流式输出和中断生成。

### 9.2 管理后台

1. 使用 Element Plus 作为基础组件库。
2. 以表格、筛选表单、弹窗、抽屉为主要交互形态。
3. 高风险操作需要二次确认。
4. 状态字段使用统一颜色标签。
5. 列表页默认支持分页、搜索和刷新。
6. 后台按钮根据权限控制显隐。

## 10. 主要接口依赖

### 10.1 认证

```txt
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me
```

### 10.2 Prompt

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

### 10.3 AI 与对话

```txt
GET    /api/v1/ai/models
POST   /api/v1/ai/generate
POST   /api/v1/ai/optimize
GET    /api/v1/conversations
POST   /api/v1/conversations
GET    /api/v1/conversations/:id/messages
POST   /api/v1/conversations/:id/messages
```

### 10.4 后台管理

```txt
GET    /api/v1/admin/dashboard
GET    /api/v1/admin/users
GET    /api/v1/admin/roles
GET    /api/v1/admin/permissions
GET    /api/v1/admin/prompts
GET    /api/v1/admin/categories
GET    /api/v1/admin/ai-models
GET    /api/v1/admin/orders
GET    /api/v1/admin/payments
GET    /api/v1/admin/system-configs
GET    /api/v1/admin/audit-logs
```

## 11. 前端开发顺序

### 第一阶段：工程基础

1. 初始化 `apps/web` 和 `apps/admin`。
2. 配置 Vue 3、TypeScript、Vite。
3. 配置 TailwindCSS、Naive UI、Element Plus。
4. 配置 Pinia、Vue Router、Axios。
5. 建立统一类型、请求封装和错误处理。

### 第二阶段：认证与布局

1. 用户端登录、注册、个人信息。
2. 管理后台登录。
3. 用户端基础布局。
4. 管理后台侧边栏、顶部栏、标签页或面包屑。
5. 路由守卫和 Token 持久化。

### 第三阶段：Prompt MVP

1. 分类列表和分类筛选。
2. Prompt 广场。
3. Prompt 详情。
4. Prompt 创建和编辑。
5. Prompt 收藏。
6. 我的收藏和历史记录。

### 第四阶段：AI 功能

1. AI 模型列表。
2. Prompt 生成器。
3. Prompt 优化器。
4. 多模型对话页面。
5. 流式输出和停止生成。

### 第五阶段：管理后台

1. 用户管理。
2. Prompt 管理和审核。
3. 分类管理。
4. 角色权限管理。
5. AI 模型配置。
6. 订单、支付、会员管理。
7. 系统配置和审计日志。

### 第六阶段：优化与交付

1. 页面加载态、空状态、错误状态补全。
2. 表单校验和异常提示补全。
3. 路由懒加载和构建优化。
4. 移动端适配用户端核心页面。
5. 生产环境打包和 Nginx 静态资源部署验证。

## 12. 前端交付物

1. 用户端 Web 应用。
2. 管理后台应用。
3. 统一 API SDK 封装。
4. TypeScript 类型定义。
5. 路由和权限控制。
6. 可部署的前端构建产物。
7. 前端环境变量示例。

