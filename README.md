# WebKiss Blog

基于 VitePress 构建的个人技术博客。

## 从 Hero + Features 到 VitePress

### 什么是 Hero + Features？

Hero + Features 是 VitePress 提供的首页布局模式，通过 frontmatter 配置即可生成现代化的落地页：

```yaml
---
layout: home
hero:
  name: WebKiss Blog
  text: 个人技术博客
  tagline: 记录技术成长，分享实践经验
  actions:
    - theme: brand
      text: 阅读文章
      link: /posts/
    - theme: alt
      text: 关于我
      link: /about

features:
  - icon: 📝
    title: 技术文章
    details: 分享前端、小程序、全栈开发等技术领域的实践经验和思考
  - icon: 💡
    title: 实践经验
    details: 记录项目开发中的踩坑总结和解决方案
  - icon: 🚀
    title: 持续更新
    details: 保持学习，持续输出有价值的内容
---
```

### 布局说明

**Hero 区域**：页面顶部大标题区域
- `name`: 品牌名称（显示在标题上方）
- `text`: 主标题文字
- `tagline`: 副标题/标语
- `actions`: 行动按钮组，支持 `brand`（主色调）和 `alt`（次要）两种主题

**Features 区域**：特性展示卡片
- `icon`: 图标（支持 emoji 或 SVG）
- `title`: 特性标题
- `details`: 特性描述

### VitePress 配置

项目核心配置在 `.vitepress/config.js`：

```javascript
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'WebKiss Blog',
  description: '个人技术博客',
  base: '/zwh.github.io/',
  
  themeConfig: {
    logo: '/logo.png',
    
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '简历', link: '/resume' },
      { text: '关于', link: '/about' }
    ],
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zouwenhuagit' }
    ],
    
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 WebKiss'
    },
    
    search: {
      provider: 'local'
    }
  }
})
```

## 项目结构

```
zwh.github.io/
├── .vitepress/
│   └── config.js          # VitePress 配置
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Pages 自动部署
├── posts/
│   ├── index.md           # 文章列表页
│   ├── browser-knowledge.md
│   ├── es6-knowledge.md
│   ├── javascript-basics.md
│   ├── ai-coding-guide.md
│   └── ibeacon-miniapp.md
├── index.md               # 首页（Hero + Features）
├── about.md               # 关于页
├── resume.md              # 个人简历
├── package.json
└── .gitignore
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

访问 http://localhost:5173/zwh.github.io/

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 部署

项目使用 GitHub Actions 自动部署到 GitHub Pages。

推送代码到 `main` 分支即可触发自动部署：

```bash
git add .
git commit -m "update content"
git push origin main
```

部署完成后访问：https://zouwenhuagit.github.io/zwh.github.io/

## 添加新文章

在 `posts/` 目录下创建新的 `.md` 文件：

```markdown
---
title: 文章标题
date: 2026-09-07
description: 文章描述
tags:
  - 标签1
  - 标签2
---

# 文章标题

文章内容...
```

然后在 `posts/index.md` 中添加文章链接：

```html
<li class="post-item">
  <a href="/zwh.github.io/posts/your-article.html">文章标题</a>
  <div class="post-meta">
    <span class="date">📅 2026-09-07</span>
    <div class="tags">
      <span class="tag">标签1</span>
      <span class="tag">标签2</span>
    </div>
  </div>
</li>
```

## 技术栈

- **VitePress** - 静态站点生成器
- **Vue 3** - 前端框架
- **GitHub Pages** - 托管服务
- **GitHub Actions** - CI/CD

## License

MIT
