---
layout: page
title: 文章列表
---

<style>
.posts-container {
  max-width: 720px;
  margin: 0 auto;
  padding: 20px 0;
}
.post-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.post-item {
  padding: 20px 24px;
  margin-bottom: 16px;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.2s ease;
}
.post-item:hover {
  border-color: var(--vp-c-brand-2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}
.post-item a {
  font-size: 1.1em;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-decoration: none;
  display: block;
  margin-bottom: 8px;
}
.post-item a:hover {
  color: var(--vp-c-brand-1);
}
.post-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.88em;
  color: var(--vp-c-text-3);
}
.post-meta .date {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.post-meta .tags {
  display: flex;
  gap: 8px;
}
.post-meta .tag {
  padding: 2px 10px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-radius: 12px;
  font-size: 0.85em;
}
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--vp-c-text-3);
}
.empty-state .icon {
  font-size: 3em;
  margin-bottom: 16px;
}
@media (max-width: 640px) {
  .post-item { padding: 16px 18px; }
  .post-meta { flex-direction: column; align-items: flex-start; gap: 8px; }
}
</style>

<div class="posts-container">

<ul class="post-list">
  <li class="post-item">
    <a href="/zwh.github.io/posts/ai-coding-guide.html">AI 编码过程与理解</a>
    <div class="post-meta">
      <span class="date">📅 2026-09-07</span>
      <div class="tags">
        <span class="tag">AI</span>
        <span class="tag">持续更新</span>
        <span class="tag">MCP</span>
        <span class="tag">Agent</span>
      </div>
    </div>
  </li>
  <li class="post-item">
    <a href="/zwh.github.io/posts/browser-knowledge.html">浏览器相关知识点</a>
    <div class="post-meta">
      <span class="date">📅 2026-09-07</span>
      <div class="tags">
        <span class="tag">浏览器</span>
        <span class="tag">HTTP</span>
        <span class="tag">缓存</span>
        <span class="tag">网络</span>
      </div>
    </div>
  </li>
  <li class="post-item">
    <a href="/zwh.github.io/posts/es6-knowledge.html">ES6 核心知识点总结</a>
    <div class="post-meta">
      <span class="date">📅 2026-09-07</span>
      <div class="tags">
        <span class="tag">JavaScript</span>
        <span class="tag">ES6</span>
        <span class="tag">前端基础</span>
      </div>
    </div>
  </li>
  <li class="post-item">
    <a href="/zwh.github.io/posts/javascript-basics.html">JavaScript 基础知识点总结</a>
    <div class="post-meta">
      <span class="date">📅 2026-09-07</span>
      <div class="tags">
        <span class="tag">JavaScript</span>
        <span class="tag">DOM</span>
        <span class="tag">事件</span>
        <span class="tag">前端基础</span>
      </div>
    </div>
  </li>
  <li class="post-item">
    <a href="/zwh.github.io/posts/ibeacon-miniapp.html">小程序 iBeacon 对接实战：从架构设计到踩坑总结</a>
    <div class="post-meta">
      <span class="date">📅 2026-09-07</span>
      <div class="tags">
        <span class="tag">小程序</span>
        <span class="tag">iBeacon</span>
        <span class="tag">蓝牙</span>
      </div>
    </div>
  </li>
</ul>

</div>
