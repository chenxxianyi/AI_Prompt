# PromptHub AI 前端工程搭建进度记录

## 当前状态

**阶段**: 第一阶段 - 工程基础（进行中）

**完成时间**: 2026-05-08

---

## 已完成的工作

### 1. Monorepo 根目录初始化 ✅

创建了以下文件：

| 文件 | 说明 |
|------|------|
| `package.json` | npm workspaces 配置，含 `dev:web`、`build:web` 脚本 |
| `.gitignore` | 忽略 `node_modules`、`dist`、`.env.local` 等 |
| `.editorconfig` | 统一编辑器配置（缩进 2 空格、UTF-8、LF） |

### 2. apps/web 项目脚手架 ✅

创建了完整的 Vue 3 + TypeScript + Vite 项目结构：

```
apps/web/
├── index.html                    # 入口 HTML，引入 Inter 字体
├── package.json                  # 依赖配置
├── vite.config.ts               # Vite 配置（@别名、TailwindCSS 插件、端口 3000）
├── tsconfig.json                # TS 配置入口
├── tsconfig.app.json            # 应用 TS 配置
├── tsconfig.node.json           # Node 环境 TS 配置
└── src/
    ├── main.ts                  # 应用入口
    ├── App.vue                  # 根组件
    ├── env.d.ts                 # Vite 环境类型
    ├── vue-shims.d.ts           # Vue 组件类型声明
    ├── components/
    │   └── AmbientBackground.vue # 背景光球动画组件
    └── styles/
        ├── tailwind.css         # TailwindCSS 主题配置
        ├── variables.css        # CSS 自定义属性（渐变、glow）
        ├── naive-theme.ts       # Naive UI 主题覆盖
        └── transitions.css      # 页面过渡动画
```

**依赖清单**：
- Vue 3.5.13
- Naive UI 2.41.0
- TailwindCSS 4.1.6
- Pinia 3.0.2
- Vue Router 4.5.1
- Axios 1.9.0

### 3. CSS 变量迁移 ✅

采用三层策略迁移 H5 原型的 47 个 CSS 变量：

| 层级 | 文件 | 内容 |
|------|------|------|
| TailwindCSS @theme | `tailwind.css` | 颜色、圆角、阴影、字体 |
| CSS 自定义属性 | `variables.css` | 渐变、glow、transition |
| Naive UI 主题覆盖 | `naive-theme.ts` | 组件库 token 覆盖 |

**主要颜色映射**：
- `--color-primary`: #6366f1
- `--color-accent-cyan`: #0891b2
- `--color-accent-teal`: #0d9488
- `--color-accent-green`: #059669
- `--color-accent-amber`: #d97706
- `--color-accent-rose`: #e11d48
- `--color-accent-violet`: #7c3aed

### 4. 动画与视觉效果 ✅

- **AmbientBackground.vue**: 3 个光球 + `orbFloat` 动画，使用 scoped CSS
- **页面过渡**: `page-fade` 过渡效果定义在 `transitions.css`

---

## 待完成的工作

### 5. 布局架构（下一步）

- [ ] `WebLayout.vue` — 用户端布局骨架
- [ ] `AppHeader.vue` — 顶部导航栏

### 6. 路由配置

- [ ] `router/index.ts` — Vue Router 配置
- [ ] 路由守卫

### 7. TypeScript 类型定义

- [ ] `types/api.d.ts`
- [ ] `types/prompt.d.ts`
- [ ] `types/chat.d.ts`
- [ ] `types/member.d.ts`
- [ ] `types/auth.d.ts`

### 8. Axios 请求层

- [ ] `api/request.ts`
- [ ] 各模块 API 文件

### 9. Pinia Store

- [ ] `stores/auth.ts`
- [ ] `stores/category.ts`
- [ ] `stores/prompt.ts`
- [ ] `stores/chat.ts`
- [ ] `stores/app.ts`

### 10. 页面占位实现

- [ ] `views/home/index.vue`
- [ ] `views/generator/index.vue`
- [ ] `views/chat/index.vue`
- [ ] `views/member/index.vue`

### 11. 环境变量

- [ ] `.env`
- [ ] `.env.development`

### 12. 验证

- [ ] `npm run dev` 启动成功
- [ ] `npm run build` 构建成功

---

## 下一步操作

1. 运行 `npm install` 安装依赖
2. 实现 `WebLayout.vue` 和 `AppHeader.vue`
3. 配置路由
4. 实现页面占位视图
5. 验证项目可运行

---

## 技术决策记录

| 决策 | 选择 | 原因 |
|------|------|------|
| 包管理器 | npm | 用户选择，原生支持 workspaces |
| CSS 方案 | TailwindCSS v4 + CSS 变量 | v4 使用 @theme 语法，更简洁 |
| UI 组件库 | Naive UI | 符合开发文档要求，支持主题定制 |
| 动画方案 | scoped CSS + Vue Transition | 保持与 H5 原型一致的视觉效果 |
