---
title: 浏览器相关知识点
date: 2026-09-07
description: 浏览器组成、工作流程、CORS预检请求、HTTP状态码、缓存机制、HTTP/HTTPS、RESTful API等核心知识点总结
tags:
  - 浏览器
  - HTTP
  - 缓存
  - 网络
---

# 浏览器相关知识点

## 一、浏览器的组成

浏览器主要由以下几个部分组成：

| 模块 | 说明 |
|------|------|
| **UserInterface** | 用户界面，即我们平时看到的浏览器界面 |
| **BrowserEngine** | 浏览器引擎，负责协调各个部分的工作 |
| **RenderingEngine** | 渲染引擎，负责 HTML 和 CSS 的解析 |
| **Networking** | 网络模块，负责与服务器沟通交互 |
| **JavaScriptInterpreter** | JS 解释器，解释执行 JavaScript |
| **UI Backend** | UI 后端，负责浏览器自带的 UI 功能 |
| **DataPersistence** | 数据持久化，如 Cookie |

## 二、浏览器的工作流程

1. 用户界面获取到用户想要访问的目标地址
2. 网络模块向服务器发送请求，接收服务器返回的数据
3. 渲染引擎解析 HTML 和 CSS
4. 如果有 JS，由 JS 解释器解析执行
5. 渲染引擎将解析结果交给浏览器引擎
6. 浏览器引擎查看是否有数据持久化，如有则交给数据持久化模块执行
7. 最后由用户界面将页面展示给用户

## 三、CORS 预检请求

### 为什么需要预检请求？

浏览器的同源策略出于安全考虑，会限制从脚本发起的跨域 HTTP 请求。浏览器限制跨域请求一般有两种方式：

1. 浏览器限制发起跨域请求
2. 跨域请求可以正常发起，但返回结果被浏览器拦截

第二种方式中，请求已到达服务器并可能已对数据进行了操作，但返回结果被拦截，我们获取不到响应数据。

为了防止这种情况，规范要求对可能对服务器数据产生副作用的 HTTP 请求方法，浏览器必须先使用 **OPTIONS** 方法发起一个预检请求，从而获知服务器是否允许该跨域请求。

### 简单请求 vs 需预检的请求

**简单请求**（不触发预检）需满足所有条件：
- 使用 GET、HEAD 或 POST 方法
- POST 的 Content-Type 为 `text/plain`、`multipart/form-data` 或 `application/x-www-form-urlencoded`

**需预检的请求**满足任一条件：
- 使用 PUT、DELETE、CONNECT、OPTIONS、TRACE、PATCH 方法
- 人为设置了 CORS 安全首部字段之外的其他首部字段
- Content-Type 不属于上述三种简单类型

> **注意**：前端不能主动设置预检请求，预检请求是浏览器自动发送的。

## 四、HTTP 状态码

HTTP 状态码分为 5 大类：

| 类别 | 含义 | 常见状态码 |
|------|------|-----------|
| **1XX** | 消息状态码 | 100 Continue、101 Switching Protocols |
| **2XX** | 成功状态码 | 200 OK、201 Created、204 No Content |
| **3XX** | 重定向状态码 | 301 永久重定向、302 临时重定向、304 Not Modified |
| **4XX** | 客户端错误 | 400 Bad Request、401 Unauthorized、403 Forbidden、404 Not Found |
| **5XX** | 服务端错误 | 500 Internal Error、502 Bad Gateway、503 Service Unavailable、504 Gateway Timeout |

### 常用状态码详解

**2XX 成功：**
- `200` - 请求成功
- `201` - 已创建新资源
- `204` - 无内容返回

**3XX 重定向：**
- `301` - 永久移动，新请求应使用新 URI
- `302` - 临时移动，客户端应继续使用原有 URI
- `304` - 未修改，可使用缓存

**4XX 客户端错误：**
- `400` - 请求语法错误
- `401` - 需要身份认证
- `403` - 拒绝访问
- `404` - 资源未找到
- `405` - 请求方法被禁止

**5XX 服务端错误：**
- `500` - 服务器内部错误
- `502` - 网关错误
- `503` - 服务不可用
- `504` - 网关超时

### 用 Map 处理状态码

```javascript
const statusMap = new Map([
  [400, '参数错误'],
  [401, '需要身份认证'],
  [403, '拒绝访问'],
  [404, '请求错误,未找到该资源'],
  [405, '请求方法被禁止'],
  [500, '服务器端出错！'],
  [502, '线路繁忙'],
  [503, '系统升级维护中'],
  [504, '请求超时！请尝试刷新页面重试'],
])

function getStatusText(status) {
  return statusMap.get(status) || '未知状态码'
}
```

## 五、浏览器缓存

### 缓存类型

| 类型 | 特点 | 应用场景 |
|------|------|---------|
| **HTTP 缓存** | 基于 HTTP 协议，分为强制缓存和协商缓存 | 静态资源（HTML、CSS、JS、图片等） |
| **Cookie** | 存储在客户端，大小受限，安全性较低 | 用户身份识别、Session 跟踪 |
| **LocalStorage** | 无过期时间，键值对存储 | 持久化数据，如 AJAX 返回数据 |
| **SessionStorage** | 浏览器关闭时删除 | 临时数据，如单次会话操作状态 |
| **IndexedDB** | 非关系型数据库，容量大，异步操作 | 大量结构化数据存储和检索 |
| **Service Worker** | 可编程缓存，支持离线 | PWA 应用、资源预加载 |

### 强制缓存

直接使用客户端缓存，不从服务器拉取新资源。

- `Expires`（HTTP/1.0）：绝对时间，如 `Mon, 10 Jun 2015 21:31:12 GMT`
- `Cache-Control: max-age=number`（HTTP/1.1）：相对值，单位秒

> `Cache-Control` 优先级高于 `Expires`

**Cache-Control 常用值：**
- `no-cache` - 不使用强缓存，走协商缓存
- `no-store` - 完全不缓存
- `public` - 所有用户和 CDN 都可缓存
- `private` - 仅终端用户浏览器可缓存
- `immutable` - 有效期内即使刷新也不请求服务器

### 协商缓存

通过服务器验证资源有效性，涉及两组 header：

**Last-Modified / If-Modified-Since：**
- 首次请求：服务器返回 `Last-Modified`（最后修改时间）
- 再次请求：浏览器携带 `If-Modified-Since`
- 服务器对比判断资源是否变化，未变化返回 304

**Etag / If-None-Match：**
- 首次请求：服务器返回 `Etag`（资源唯一标识）
- 再次请求：浏览器携带 `If-None-Match`
- 服务器对比判断，未变化返回 304

> 服务器优先验证 Etag，一致才继续比对 Last-Modified

**为什么需要 Etag？**
- 文件内容未变但修改时间变了
- 文件修改频繁（秒级以下）
- 服务器无法精确获取最后修改时间

## 六、浏览器渲染流程

1. **加载 HTML** - 浏览器向服务器请求 HTML 文件
2. **解析 HTML** - 构建 DOM 树
3. **加载并解析 CSS** - 构建 CSS 树（CSSOM）
4. **生成渲染树** - 合并 DOM 树和 CSS 树
5. **布局（Layout）** - 计算元素位置和尺寸
6. **绘制（Paint）** - 将渲染树转换为屏幕像素

### 控制脚本加载时机

```html
<!-- 异步加载，加载完立即执行，不阻塞解析 -->
<script src="script.js" async></script>

<!-- 延迟执行，等 DOM 解析完再执行 -->
<script src="script.js" defer></script>
```

```javascript
// 动态加载脚本
function loadScript(src) {
  const script = document.createElement('script')
  script.src = src
  document.head.append(script)
}
```

## 七、HTTP 与 HTTPS

| 特性 | HTTP | HTTPS |
|------|------|-------|
| 端口 | 80 | 443 |
| 安全性 | 明文传输 | SSL/TLS 加密传输 |
| 证书 | 不需要 | 需要 CA 证书 |
| 性能 | 较快 | 加解密有开销 |

### 对称加密 vs 非对称加密

**对称加密：**
- 使用相同密钥加密和解密
- 速度快，适合大量数据
- 缺点：密钥分发困难

**非对称加密：**
- 使用公钥加密、私钥解密
- 安全性高，适合身份验证
- 缺点：速度慢，不适合大量数据

> HTTPS 实际结合使用：先用非对称加密协商对称密钥，再用对称密钥加密数据

## 八、RESTful API 设计

RESTful API 基于 REST 原则，使用 HTTP 方法操作资源。

### 设计原则

1. **基于资源** - 用 URI 唯一标识资源，如 `/users/{id}`
2. **使用 HTTP 动词**：
   - `GET` - 获取资源
   - `POST` - 创建资源
   - `PUT` - 更新资源
   - `DELETE` - 删除资源
3. **无状态** - 每个请求独立，服务器不保存上下文
4. **统一接口** - 简化客户端与服务器交互
5. **可缓存** - 客户端可缓存响应
6. **使用 HTTP 状态码** - 表示请求结果
7. **使用 JSON/XML** - 数据格式通用可读

### 示例

```
GET    /users          # 获取用户列表
GET    /users/123      # 获取单个用户
POST   /users          # 创建用户
PUT    /users/123      # 更新用户
DELETE /users/123      # 删除用户
```
