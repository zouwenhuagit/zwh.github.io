---
layout: page
title: 个人简历
---

<style>
.resume-container {
  max-width: 820px;
  margin: 0 auto;
  padding: 10px 0 40px;
}

/* ===== Header ===== */
.resume-header {
  text-align: center;
  margin-bottom: 36px;
  padding: 36px 32px 28px;
  background: linear-gradient(135deg, var(--vp-c-brand-soft) 0%, var(--vp-c-bg-soft) 100%);
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
}
.resume-header h1 {
  font-size: 2.4em;
  margin: 0 0 6px;
  color: var(--vp-c-text-1);
  letter-spacing: 0.05em;
}
.resume-header .subtitle {
  font-size: 1.15em;
  color: var(--vp-c-brand-1);
  font-weight: 500;
  margin-bottom: 20px;
}
.resume-header .contact-info {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px 24px;
  font-size: 0.92em;
  color: var(--vp-c-text-2);
}
.resume-header .contact-info span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: var(--vp-c-bg);
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.2s ease;
}
.resume-header .contact-info span:hover {
  border-color: var(--vp-c-brand-2);
  color: var(--vp-c-brand-1);
}

/* ===== Section ===== */
.resume-section {
  margin-bottom: 32px;
}
.resume-section h2 {
  font-size: 1.3em;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--vp-c-brand-1);
}
.resume-section h2::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 22px;
  background: var(--vp-c-brand-1);
  border-radius: 3px;
  flex-shrink: 0;
}

/* ===== Summary ===== */
.resume-section blockquote {
  margin: 0;
  padding: 16px 20px;
  background: var(--vp-c-bg-soft);
  border-radius: 10px;
  border-left: 4px solid var(--vp-c-brand-1);
  color: var(--vp-c-text-2);
  line-height: 1.8;
  font-size: 0.95em;
}

/* ===== Timeline Items ===== */
.resume-item {
  position: relative;
  margin-bottom: 24px;
  padding: 18px 22px;
  background: var(--vp-c-bg-soft);
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.2s ease;
}
.resume-item:hover {
  border-color: var(--vp-c-brand-2);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}
.resume-item:last-child {
  margin-bottom: 0;
}
.resume-item h3 {
  font-size: 1.05em;
  margin: 0 0 6px;
  color: var(--vp-c-text-1);
}
.resume-item .meta {
  font-size: 0.88em;
  color: var(--vp-c-brand-1);
  font-weight: 500;
  margin-bottom: 10px;
  display: inline-block;
  padding: 2px 10px;
  background: var(--vp-c-brand-soft);
  border-radius: 12px;
}
.resume-item .description {
  color: var(--vp-c-text-2);
  line-height: 1.8;
  font-size: 0.93em;
}
.resume-item .description ul {
  margin: 4px 0 0;
  padding-left: 18px;
}
.resume-item .description li {
  margin-bottom: 4px;
}

/* ===== Skills ===== */
.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.skill-tag {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 0.9em;
  font-weight: 500;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border: 1px solid transparent;
  transition: all 0.2s ease;
}
.skill-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.skill-tag:nth-child(3n+1) { background: #e8f5e9; color: #2e7d32; }
.skill-tag:nth-child(3n+2) { background: #e3f2fd; color: #1565c0; }
.skill-tag:nth-child(3n+0) { background: #fff3e0; color: #e65100; }
.dark .skill-tag:nth-child(3n+1) { background: #1b3a1d; color: #66bb6a; }
.dark .skill-tag:nth-child(3n+2) { background: #0d2744; color: #64b5f6; }
.dark .skill-tag:nth-child(3n+0) { background: #3e1a00; color: #ffb74d; }

/* ===== Print ===== */
@media print {
  .resume-header { background: none; border: 1px solid #ddd; }
  .resume-item:hover { box-shadow: none; }
  .skill-tag:hover { transform: none; box-shadow: none; }
}
@media (max-width: 640px) {
  .resume-header { padding: 24px 16px 20px; }
  .resume-header h1 { font-size: 1.8em; }
  .resume-header .contact-info { flex-direction: column; align-items: center; }
  .resume-item { padding: 14px 16px; }
}
</style>

<div class="resume-container">

<div class="resume-header">

# 邹文辉

<div class="subtitle">前端开发工程师</div>

<div class="contact-info">
  <span>📧 zouwenhui@example.com</span>
  <span>📱 138-xxxx-xxxx</span>
  <span>📍 中国</span>
  <span>🔗 <a href="https://github.com/zouwenhuagit" target="_blank">GitHub</a></span>
</div>

</div>

<div class="resume-section">

## 个人简介

> 请在此处填写你的个人简介，例如：多年前端开发经验，熟悉 Vue、React 等主流框架，擅长小程序开发和性能优化。具备良好的团队协作能力和沟通表达能力。

</div>

<div class="resume-section">

## 专业技能

<div class="skill-tags">

<span class="skill-tag">Vue.js</span>
<span class="skill-tag">React</span>
<span class="skill-tag">微信小程序</span>
<span class="skill-tag">JavaScript</span>
<span class="skill-tag">TypeScript</span>
<span class="skill-tag">HTML/CSS</span>
<span class="skill-tag">Node.js</span>
<span class="skill-tag">Git</span>

</div>

</div>

<div class="resume-section">

## 工作经历

<div class="resume-item">

### 某某科技有限公司 — 前端开发工程师

<div class="meta">2022.01 - 至今</div>

<div class="description">

- 负责公司核心产品的前端开发与维护
- 参与小程序项目的架构设计与开发
- 优化页面性能，提升用户体验
- 与后端团队协作，完成接口对接与数据联调

</div>

</div>

<div class="resume-item">

### 某某互联网公司 — 前端开发

<div class="meta">2019.07 - 2021.12</div>

<div class="description">

- 负责 Web 端和移动端页面的开发
- 参与前端组件库的搭建与维护
- 协助团队进行技术选型和方案评审

</div>

</div>

</div>

<div class="resume-section">

## 项目经历

<div class="resume-item">

### 零售门店 iBeacon 客户绑定系统

<div class="meta">2024.01 - 2024.06 | 前端负责人</div>

<div class="description">

- 设计并实现基于 iBeacon 的三层架构方案（Manager / Behavior / Page）
- 实现蓝牙扫描的订阅者模式，支持多页面共享扫描实例
- 解决蓝牙初始化退避、前后台恢复、隐私协议授权等技术难点
- 项目上线后客户绑定效率提升 60%

</div>

</div>

</div>

<div class="resume-section">

## 教育背景

<div class="resume-item">

### 某某大学 — 计算机科学与技术（本科）

<div class="meta">2015.09 - 2019.06</div>

</div>

</div>

</div>
