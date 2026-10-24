# personal-blog-vue

zouwenhuagit 的个人开发者博客，基于 Vue 3 + TypeScript + Vite 构建，部署于 GitHub Pages。包含文章、项目展示与 GitHub 数据统计，界面为深色开发者风格。

在线访问：https://zouwenhuagit.github.io/hello--world/

## 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Vue 3.5（`<script setup>` 组合式 API） |
| 语言 | TypeScript 5.6 |
| 构建 | Vite 5 |
| 路由 | Vue Router 4（history 模式） |
| 状态管理 | Pinia |
| 样式 | Tailwind CSS 3 + PostCSS + Autoprefixer |
| 文章渲染 | markdown-it + highlight.js |
| 图标 | lucide-vue-next |
| 字体 | JetBrains Mono + Noto Sans SC |

## 功能特性

- **文章系统**：本地 Markdown 文章数据（`src/data/articles.ts`），支持标签筛选、阅读时长估算、代码高亮
- **项目展示**：卡片式项目列表（`ProjectsView`）
- **GitHub 数据**：通过 GitHub REST API 实时拉取用户信息与仓库列表（`src/utils/api.ts`），展示于 `GitHubStats` 组件
- **SPA 路由回退**：部署时将构建产物 `dist/index.html` 复制为 `dist/404.html`，深链接刷新由其兜底加载应用
- **自动部署**：GitHub Actions 推送到 `main` / `master` 自动构建并发布到 GitHub Pages

## 快速开始

环境要求：Node.js 20+

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 本地预览构建产物
npm run preview
```

## 项目结构

```
personal-blog-vue/
├── .github/workflows/deploy.yml   # GitHub Pages 自动部署工作流
├── src/
│   ├── pages/                     # 页面组件
│   │   ├── HomeView.vue           # 首页
│   │   ├── ArticlesView.vue       # 文章列表（标签筛选）
│   │   ├── ArticleDetailView.vue  # 文章详情
│   │   ├── ProjectsView.vue       # 项目展示
│   │   └── AboutView.vue          # 关于
│   ├── components/                # 通用组件
│   │   ├── Navbar.vue / Footer.vue
│   │   ├── HeroSection.vue        # 首页 Hero
│   │   ├── ArticleCard.vue / ProjectCard.vue
│   │   ├── TagFilter.vue          # 标签筛选
│   │   ├── GitHubStats.vue        # GitHub 用户/仓库统计
│   │   └── MarkdownRenderer.vue   # Markdown 渲染（代码高亮）
│   ├── data/articles.ts           # 博客文章数据（元数据 + Markdown 正文）
│   ├── stores/blog.ts             # Pinia 博客状态
│   ├── router/index.ts            # 路由配置
│   ├── types/index.ts             # TS 类型定义
│   └── utils/                     # api.ts（GitHub API）、format.ts（格式化）
├── vite.config.ts                 # base: '/hello--world/'，@ 别名指向 src
└── tailwind.config.js
```

## 如何新增文章

编辑 `src/data/articles.ts`，按以下结构追加一篇即可（列表页、详情页、标签筛选自动生效）：

```ts
{
  slug: 'your-article-slug',      // 唯一标识，用于详情页路由 /articles/:slug
  title: '文章标题',
  excerpt: '摘要，显示在列表卡片中',
  date: '2026-10-23',
  tags: ['Vue', 'TypeScript'],
  readingTime: 10,                // 阅读时长（分钟）
  content: `# Markdown 正文`,     // 模板字符串中的反引号与 ${} 需转义
}
```

## 部署说明

- 部署由 [.github/workflows/deploy.yml](.github/workflows/deploy.yml) 完成：推送 `main` / `master` 分支或在 Actions 页面手动触发
- 构建产物上传至 GitHub Pages，首次运行会自动启用 Pages（`enablement: true`）
- 部署前需在仓库 Settings → Pages 中将 Source 设置为 **GitHub Actions**

## 相关链接

- 博客仓库：https://github.com/zouwenhuagit/hello--world
- GitHub 主页：https://github.com/zouwenhuagit


<!-- 
基于 VitePress 构建的个人技术博客。

## 从 Hero + Features 到 VitePress

### 什么是 Hero + Features？

Hero + Features 是 VitePress 提供的首页布局模式，通过 frontmatter 配置即可生成现代化的落地页：

## 部署

项目使用 GitHub Actions 自动部署到 GitHub Pages。

推送代码到 `main` 分支即可触发自动部署：

```bash
git add .
git commit -m "update content"
git push origin main
```

部署完成后访问：https://zouwenhuagit.github.io/zwh.github.io/

## 技术栈

- **VitePress** - 静态站点生成器
- **Vue 3** - 前端框架
- **GitHub Pages** - 托管服务
- **GitHub Actions** - CI/CD

## License
 -->
