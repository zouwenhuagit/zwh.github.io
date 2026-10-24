// 本地 mock 博客文章数据：6 篇，元数据 + 完整 markdown 正文
// 注意：模板字符串中的反引号与 ${} 均已转义
import type { Article } from '@/types'

export const articles: Article[] = [
  {
    slug: 'vue3-composition-api',
    title: 'Vue 3 组合式 API 实战：从 Options API 到组合式 API',
    excerpt:
      '深入理解 Vue 3 组合式 API 的设计思想：setup 语法糖、响应式系统、组合式函数复用逻辑，以及大型项目中的最佳实践。',
    date: '2026-09-21',
    tags: ['Vue', '前端框架', 'TypeScript'],
    readingTime: 12,
    content: `# Vue 3 组合式 API 实战

Vue 3 带来的最大变化就是组合式 API（Composition API）。它不是为了替代 Options API，而是为了解决「逻辑组织」与「逻辑复用」两大痛点。这篇文章结合我在实际项目中的迁移经验，梳理核心概念与踩坑记录。

## 一、为什么需要组合式 API

Options API 按选项组织代码：data、methods、computed 各自为营。当组件复杂后，同一个业务逻辑会被拆散到多个选项里，上下翻跳着看代码。

组合式 API 允许我们按「逻辑功能」组织代码，相关的状态、计算属性、方法放在一起，内聚性大幅提升。

\`\`\`vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 计数逻辑：状态与行为内聚在一处
const count = ref(0)
const double = computed(() => count.value * 2)

function increment() {
  count.value++
}

onMounted(() => {
  console.log('初始计数:', count.value)
})
</script>

<template>
  <button @click="increment">{{ count }} -> {{ double }}</button>
</template>
\`\`\`

## 二、响应式系统：ref 与 reactive

### ref

\`ref\` 可以包装任意类型的值（包括基本类型），通过 \`.value\` 访问：

\`\`\`ts
import { ref } from 'vue'

const num = ref(0)
const user = ref({ name: '张三' })

num.value++
user.value.name = '李四'
\`\`\`

### reactive

\`reactive\` 只能包装对象类型，直接访问属性，无需 \`.value\`：

\`\`\`ts
import { reactive } from 'vue'

const state = reactive({
  loading: false,
  list: [] as string[],
})

state.loading = true
state.list.push('item')
\`\`\`

### 选择建议

我的实践原则：**基本类型用 ref，对象类型也优先 ref**。理由是 ref 解构、传参、整体替换都更直观，而 reactive 有丢失响应式的坑（解构、重新赋值）。

## 三、组合式函数（Composables）：逻辑复用

组合式函数是组合式 API 最大的价值。把有状态的逻辑抽成 \`use\` 开头的函数，多个组件共享：

\`\`\`ts
// useFetch.ts —— 通用请求逻辑
import { ref, onMounted } from 'vue'

export function useFetch<T>(url: string) {
  const data = ref<T | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  async function load() {
    loading.value = true
    try {
      const res = await fetch(url)
      data.value = await res.json()
    } catch (e) {
      error.value = String(e)
    } finally {
      loading.value = false
    }
  }

  onMounted(load)
  return { data, loading, error, reload: load }
}
\`\`\`

对比 Vue 2 时代的 mixin：组合式函数来源清晰、无命名冲突、类型推导友好，彻底解决了 mixin 的三大顽疾。

## 四、与 Pinia 配合管理全局状态

跨组件共享的状态交给 Pinia，组件内部的局部状态用组合式 API。两者配合的典型模式：

\`\`\`ts
// stores/blog.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBlogStore = defineStore('blog', () => {
  const articles = ref<string[]>([])

  async function loadArticles() {
    articles.value = await Promise.resolve(['文章一', '文章二'])
  }

  return { articles, loadArticles }
})
\`\`\`

组件里直接调用 store 暴露的状态与方法，天然获得完整类型推导：

\`\`\`vue
<script setup lang="ts">
import { useBlogStore } from '@/stores/blog'
import { onMounted } from 'vue'

const blog = useBlogStore()
onMounted(() => blog.loadArticles())
</script>
\`\`\`

## 五、迁移踩坑记录

1. **\`this\` 不存在了**：setup 中没有 \`this\`，事件回调里的 \`this.xxx\` 要彻底改成闭包变量。
2. **watch 监听 reactive 对象**：直接传对象会隐式深层监听，监听单个属性要用 getter 函数：\`watch(() => state.key, cb)\`。
3. **v-model 双向绑定组件**：Vue 3 用 \`defineModel\` 或 \`modelValue\` prop + \`update:modelValue\` 事件，替代了 Vue 2 的 \`value\` + \`input\`。
4. **生命周期命名变化**：\`beforeDestroy\` 改为 \`onBeforeUnmount\`，\`destroyed\` 改为 \`onUnmounted\`。

## 总结

组合式 API 的本质是「用函数组织逻辑」：

- **按功能聚合**：相关代码写在一起，可读性更高
- **逻辑复用**：组合式函数替代 mixin，来源清晰、类型安全
- **TS 友好**：全程类型推导，几乎不需要手写类型标注

新项目直接用 \`<script setup>\` + 组合式 API + Pinia + TypeScript，是目前 Vue 生态最舒服的开发体验。`,
  },
  {
    slug: 'javascript-basics',
    title: 'JavaScript 基础知识点总结',
    excerpt:
      'JavaScript 核心基础知识：前端三层架构、DOM 操作、事件处理、闭包、this 指向、原型链等核心概念一文讲透。',
    date: '2026-08-15',
    tags: ['JavaScript', '前端基础'],
    readingTime: 15,
    content: `# JavaScript 基础知识点总结

基础不牢，地动山摇。这篇文章系统梳理 JavaScript 核心基础：DOM、事件、闭包、this、原型链，既是笔记也是面试复习提纲。

## 一、前端三层架构

现代 Web 开发遵循关注点分离原则，分为三层：

| 层级 | 技术 | 职责 |
|------|------|------|
| 结构层 | HTML | 从语义角度描述页面结构 |
| 表现层 | CSS | 从审美角度美化页面 |
| 行为层 | JavaScript | 从交互角度提升用户体验 |

JavaScript 由三部分组成：**ECMAScript**（核心语法）、**DOM**（文档对象模型）、**BOM**（浏览器对象模型）。

## 二、DOM 操作

### 获取元素

\`\`\`javascript
// 通过 ID 获取（返回单个元素）
const box = document.getElementById('box')

// 通过选择器获取（返回第一个匹配元素）
const first = document.querySelector('.item')

// 通过选择器获取所有匹配元素（NodeList）
const all = document.querySelectorAll('.item')
\`\`\`

### 增删改元素

\`\`\`javascript
// 创建并插入
const div = document.createElement('div')
div.textContent = '动态创建的元素'
div.className = 'box'
document.body.appendChild(div)

// 删除元素
div.remove()
\`\`\`

## 三、事件处理

### 事件监听

\`\`\`javascript
const btn = document.querySelector('#btn')

btn.addEventListener('click', function (e) {
  console.log('按钮被点击', e.target)
})
\`\`\`

### 事件流与事件委托

事件流分三个阶段：**捕获 → 目标 → 冒泡**。利用冒泡机制可以把子元素事件统一委托给父元素处理，节省内存：

\`\`\`javascript
// 事件委托：父元素统一处理子元素点击
const list = document.querySelector('#list')

list.addEventListener('click', function (e) {
  if (e.target.tagName === 'LI') {
    console.log('点击了', e.target.textContent)
  }
})
\`\`\`

## 四、闭包

闭包 = 函数 + 其词法作用域的引用。内部函数可以访问外部函数的变量，即使外部函数已经执行完毕：

\`\`\`javascript
function createCounter() {
  let count = 0 // 被闭包持有，外部无法直接修改
  return function () {
    return ++count
  }
}

const counter = createCounter()
counter() // 1
counter() // 2
\`\`\`

**应用场景**：数据私有化、防抖、节流、柯里化。

**注意事项**：闭包会延长变量生命周期，滥用可能导致内存泄漏。

## 五、this 指向

this 的指向由调用方式决定，优先级从低到高：

1. **默认绑定**：独立调用，非严格模式指向 window
2. **隐式绑定**：\`obj.fn()\` 指向 obj
3. **显式绑定**：\`call / apply / bind\` 指定
4. **new 绑定**：指向新创建的实例
5. **箭头函数**：没有自己的 this，沿用词法作用域的 this

\`\`\`javascript
const obj = {
  name: '张三',
  sayHi() {
    console.log(this.name)
  },
  sayHiArrow: () => {
    console.log(this.name) // undefined：箭头函数的 this 在定义时就确定
  },
}

obj.sayHi() // '张三'
const fn = obj.sayHi
fn() // undefined：默认绑定丢失了 this
\`\`\`

## 六、原型与原型链

每个对象都有一个隐藏属性 \`__proto__\`，指向构造函数的 \`prototype\`。访问属性时若自身没有，就沿原型链向上查找：

\`\`\`javascript
function Person(name) {
  this.name = name
}

Person.prototype.sayHi = function () {
  console.log('我是' + this.name)
}

const p = new Person('张三')
p.sayHi() // 方法来自原型，所有实例共享

// 原型链：p -> Person.prototype -> Object.prototype -> null
console.log(p.__proto__ === Person.prototype) // true
\`\`\`

## 总结

- DOM 操作优先用 \`querySelector\` 系列现代 API
- 事件委托利用冒泡，减少监听器数量
- 闭包实现数据私有，注意内存泄漏
- this 看调用方式，箭头函数没有自己的 this
- 原型链是 JS 继承的根基，实例方法放 prototype 上共享

基础是所有框架的地基，值得反复咀嚼。`,
  },
  {
    slug: 'es6-knowledge',
    title: 'ES6 核心知识点总结',
    excerpt:
      'ES6 新特性全面总结：let/const、解构赋值、箭头函数、Set/Map、Promise、async/await、Class 与模块化。',
    date: '2026-07-02',
    tags: ['JavaScript', 'ES6', '前端基础'],
    readingTime: 14,
    content: `# ES6 核心知识点总结

ES6（ECMAScript 2015）是 JavaScript 历史上最重要的一次升级，之后每年的小版本都是在此基础上缝缝补补。这篇总结核心特性与易错点。

## 一、let 与 const

### let 特性

- **块级作用域**：只在声明的代码块内有效
- **不存在变量提升**：声明前使用会报错（暂时性死区）
- **不允许重复声明**：同一作用域内不能重复声明同名变量

\`\`\`javascript
// 暂时性死区示例
if (true) {
  console.log(x) // ReferenceError
  let x = 10
}

// 块级作用域
{
  let a = 1
  var b = 2
}
console.log(b) // 2
console.log(a) // ReferenceError
\`\`\`

### const 特性

- **只读常量**：声明时必须赋值，之后不能重新赋值
- **本质**：保证变量指向的内存地址不变，而非值不可变

\`\`\`javascript
const PI = 3.14159

const obj = { name: '张三' }
obj.name = '李四' // 允许：修改属性不改变地址
// obj = {} // 报错：不能重新赋值
\`\`\`

## 二、解构赋值

\`\`\`javascript
// 数组解构
const [first, second, ...rest] = [1, 2, 3, 4]
console.log(first, second, rest) // 1 2 [3, 4]

// 对象解构 + 重命名 + 默认值
const { name, age = 18, city: cityName } = { name: '张三', city: '北京' }
console.log(name, age, cityName) // 张三 18 北京

// 函数参数解构：调用处一眼看出传了什么
function createUser({ name, role = 'developer' }) {
  console.log(name + ' / ' + role)
}
createUser({ name: '张三' })
\`\`\`

## 三、箭头函数

\`\`\`javascript
// 语法糖演变
const add = (a, b) => a + b

// 没有 this、arguments，不能作为构造函数
const timer = {
  seconds: 0,
  start() {
    setInterval(() => {
      this.seconds++ // 箭头函数沿用 start 的 this
    }, 1000)
  },
}
\`\`\`

**适用场景**：回调函数、需要沿用外层 this 的场合。
**不适用**：对象方法（this 不指向对象本身）、原型方法、需要 arguments 的场景。

## 四、Set 与 Map

\`\`\`javascript
// Set：去重利器
const arr = [1, 2, 2, 3, 3, 3]
const unique = [...new Set(arr)]
console.log(unique) // [1, 2, 3]

// Map：任意类型作键
const map = new Map()
map.set({ id: 1 }, '对象也能当键')
map.set('count', 42)
console.log(map.get('count')) // 42
\`\`\`

## 五、Promise 与异步

### Promise 三状态

\`pending\`（进行中）→ \`fulfilled\`（成功）或 \`rejected\`（失败），状态一旦改变不可逆。

\`\`\`javascript
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

delay(1000).then(() => console.log('1 秒后执行'))
\`\`\`

### async/await：同步写法写异步

\`\`\`javascript
async function loadUser() {
  try {
    const res = await fetch('https://api.github.com/users/zouwenhuagit')
    const user = await res.json()
    console.log(user.login)
  } catch (e) {
    console.error('请求失败', e)
  }
}
\`\`\`

### 并行请求

\`\`\`javascript
// 串行：总耗时 = 各请求之和
// 并行：总耗时 = 最慢的那个
const [user, repos] = await Promise.all([
  fetch('/api/user').then((r) => r.json()),
  fetch('/api/repos').then((r) => r.json()),
])
\`\`\`

## 六、Class 与模块化

\`\`\`javascript
class Animal {
  #secret = '私有字段' // # 开头为私有属性

  constructor(name) {
    this.name = name
  }

  sayHi() {
    console.log('我是 ' + this.name)
  }

  static create(name) {
    return new Animal(name) // 静态方法
  }
}

class Dog extends Animal {
  sayHi() {
    super.sayHi()
    console.log('汪汪')
  }
}

new Dog('旺财').sayHi()
\`\`\`

模块化方面，ESM 用 \`import / export\` 取代 CommonJS：

\`\`\`javascript
// utils.js —— 按需导出
export function formatDate(d) { return d.toISOString() }
export default class Store {}

// main.js —— 按需导入
import Store, { formatDate } from './utils.js'
\`\`\`

## 总结

- let/const 替代 var，块级作用域减少隐蔽 bug
- 解构让数据提取更简洁，参数语义更清晰
- 箭头函数没有 this，回调场景首选
- Promise + async/await 是异步编程的标准范式
- Class 是原型继承的语法糖，ESM 是官方模块标准

这些特性是现代前端框架代码的通用语言，必须熟练到肌肉记忆。`,
  },
  {
    slug: 'browser-knowledge',
    title: '浏览器工作原理与网络知识点',
    excerpt:
      '浏览器组成与渲染流程、CORS 预检请求、HTTP 状态码、强缓存与协商缓存、HTTP/HTTPS、RESTful API 设计规范。',
    date: '2026-05-18',
    tags: ['浏览器', 'HTTP', '网络'],
    readingTime: 13,
    content: `# 浏览器工作原理与网络知识点

前端每天和浏览器打交道，但对它的工作原理未必了然。这篇从输入 URL 到页面渲染，再到缓存与安全，串一遍核心知识。

## 一、浏览器的组成

| 组件 | 职责 |
|------|------|
| 用户界面 | 地址栏、前进后退、书签菜单 |
| 渲染引擎 | 解析 HTML/CSS，构建页面（Chrome 为 Blink） |
| JS 引擎 | 解释执行 JavaScript（V8） |
| 网络模块 | 处理 HTTP 请求 |
| 存储模块 | Cookie、localStorage、IndexedDB |

**渲染流程**：解析 HTML 构建 DOM 树 → 解析 CSS 构建 CSSOM → 合成渲染树 → 布局（Layout）→ 绘制（Paint）→ 合成（Composite）。

## 二、从输入 URL 到页面展示

1. **DNS 解析**：域名 → IP（浏览器缓存 → 系统缓存 → 运营商 → 根服务器）
2. **TCP 连接**：三次握手；HTTPS 还要 TLS 握手
3. **发送 HTTP 请求**
4. **服务器响应**，返回 HTML
5. **渲染引擎解析渲染**（JS 可能阻塞 DOM 解析，所以 script 常放 body 底部或加 defer/async）

\`\`\`html
<!-- defer：下载后按序执行，DOM 构建完成后 -->
<script defer src="./app.js"></script>

<!-- async：下载完立即执行，顺序不确定 -->
<script async src="./analytics.js"></script>
\`\`\`

## 三、HTTP 状态码

| 状态码 | 含义 | 场景 |
|--------|------|------|
| 200 | 成功 | 正常响应 |
| 301 / 302 | 永久/临时重定向 | 域名迁移、登录跳转 |
| 304 | Not Modified | 协商缓存命中 |
| 400 | 请求参数错误 | 客户端问题 |
| 401 / 403 | 未认证 / 无权限 | token 失效、权限不足 |
| 404 | 资源不存在 | 路径错误 |
| 500 | 服务器内部错误 | 服务端异常 |

## 四、缓存机制

### 强缓存

浏览器直接用本地副本，不发请求：

\`\`\`
Cache-Control: max-age=31536000
\`\`\`

适合带 hash 的静态资源（JS/CSS/图片），文件一变 hash 就变，可以放心长缓存。

### 协商缓存

强缓存过期后，浏览器带上标识问服务器资源是否变化：

\`\`\`
// 请求头
If-None-Match: "abc123"

// 资源未变，服务器返回 304，继续用本地缓存
ETag: "abc123"
\`\`\`

**典型策略**：HTML 用协商缓存，JS/CSS/图片用强缓存 + 内容 hash 文件名。

## 五、CORS 跨域

浏览器同源策略要求协议、域名、端口三者一致。跨域请求分两类：

### 简单请求

直接发送，服务器返回 \`Access-Control-Allow-Origin\` 即可。

### 预检请求（Preflight）

非简单请求（如带自定义头的 PUT/DELETE）先发 OPTIONS 询问：

\`\`\`
// 预检请求
OPTIONS /api/data HTTP/1.1
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: Content-Type, Authorization

// 服务器响应
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
\`\`\`

**踩坑提醒**：预检结果可被 \`Max-Age\` 缓存，但某些浏览器上限强制 10 分钟；带 cookie 时 \`Allow-Origin\` 不能为 \`*\`，必须写明确域名。

## 六、RESTful API 设计

用 URL 表达资源，用 HTTP 方法表达操作：

\`\`\`
GET    /articles        列表
GET    /articles/42     详情
POST   /articles        创建
PUT    /articles/42     全量更新
PATCH  /articles/42     局部更新
DELETE /articles/42     删除
\`\`\`

**规范要点**：名词复数、层级不超过两层、过滤用查询参数（\`?page=2&size=10\`）、状态码语义正确。

## 总结

- 渲染流程：DOM → CSSOM → 渲染树 → 布局 → 绘制
- script 用 defer/async 避免阻塞解析
- 静态资源强缓存 + hash，HTML 协商缓存
- 跨域本质是浏览器行为，预检请求要理解
- RESTful 用资源 + 方法表达语义

理解浏览器，才能写出它喜欢的代码。`,
  },
  {
    slug: 'ai-coding-guide',
    title: 'AI 编码实践：从 Prompt 到 Agent 工作流',
    excerpt:
      'AI 辅助编程的系统方法论：Prompt 设计原则、上下文工程、Agent 自主工作流、MCP 协议，以及在 IDE 中高效使用 AI。',
    date: '2026-04-10',
    tags: ['AI', 'MCP', 'Agent', 'Prompt'],
    readingTime: 11,
    content: `# AI 编码实践：从 Prompt 到 Agent 工作流

AI 辅助编程已经从「补全代码」进化到「自主完成任务」。这一年我在日常开发中深度使用 AI，总结出一套可复用的方法论。

## 一、Prompt 设计四原则

好的 Prompt 不是玄学，有明确的结构规律：

1. **角色**：告诉 AI 它是谁——「你是一位资深 Vue 前端工程师」
2. **任务**：目标要具体、可验证——「把 React 组件迁移为 Vue 3 等价实现」
3. **约束**：明确边界——「只用组合式 API，保持现有类名不变，注释用中文」
4. **格式**：说明期望输出——「只输出完整文件内容，不要解释」

\`\`\`text
【角色】你是资深前端工程师
【任务】将下面的 React 组件迁移为 Vue 3
【约束】
- 使用 <script setup lang="ts">
- 样式类名保持不变
- 所有注释翻译为中文
【输出】只输出完整的 .vue 文件
\`\`\`

## 二、上下文工程比 Prompt 更重要

模型能力天花板很高，多数「AI 不聪明」的案例其实是**上下文没给够**：

- **给代码结构**：先让 AI 通读目录结构和关键文件，再动手
- **给反面教材**：明确「不要做什么」，比如「不要引入新依赖」「不要重构无关代码」
- **给验收标准**：build 必须通过、测试必须绿，AI 会自我修正

\`\`\`text
先阅读以下文件理解现有模式（只读不写）：
- src/router/index.ts
- src/stores/blog.ts
然后按同样的风格新增 stores/user.ts
\`\`\`

## 三、Agent 工作流：从问答到自主执行

单轮问答适合小问题，复杂任务应该交给 Agent 自主循环：

1. **规划**：Agent 拆解任务为待办清单
2. **执行**：逐项完成，边做边验证
3. **修正**：编译失败/测试不过就自动修复，直到达标
4. **汇报**：输出变更清单与结果

人类的角色从「写代码」变成「定标准 + 审结果」。

\`\`\`text
【任务】把 React 博客迁移为 Vue 3，功能与视觉 1:1 对等
【硬性规则】
- 禁止修改原 React 项目
- npm run build 必须成功，有错修到成功
- 完成后报告文件清单与差异点
\`\`\`

## 四、MCP：AI 的 USB 接口

MCP（Model Context Protocol）是连接 AI 与外部工具的标准协议，可以理解为 AI 世界的 USB：

- **统一接口**：数据库、浏览器、设计稿、飞书文档，都通过 MCP Server 暴露给模型
- **即插即用**：配置一个 Figma MCP，AI 就能读取设计稿生成代码
- **能力组合**：文件系统 + 终端 + 浏览器组合起来，就是完整的开发环境

\`\`\`json
{
  "mcpServers": {
    "figma": { "command": "npx", "args": ["-y", "figma-mcp"] },
    "browser": { "command": "npx", "args": ["-y", "browser-mcp"] }
  }
}
\`\`\`

## 五、实用技巧清单

- **小步快跑**：一次只给一个明确任务，完成后再下一个
- **让 AI 先读后写**：动手前先通读相关代码，避免破坏现有模式
- **测试兜底**：有测试用例的任务，AI 的正确率显著更高
- **警惕幻觉**：AI 会自信地写出不存在的 API，关键代码要核对文档
- **安全红线**：密钥、内网地址不要进上下文

## 总结

AI 编码的上限取决于使用者的工程素养：

- Prompt 有结构：角色 + 任务 + 约束 + 格式
- 上下文工程是核心竞争力
- 复杂任务交给 Agent 循环，人负责定标准和验收
- MCP 让 AI 连接一切外部工具

工具在进化，方法论沉淀下来就是你的壁垒。`,
  },
  {
    slug: 'ibeacon-miniapp',
    title: '小程序 iBeacon 对接实战：从架构设计到踩坑总结',
    excerpt:
      '微信小程序 iBeacon 蓝牙信标对接全流程：在场证明方案设计、API 封装、iOS/Android 差异、信号稳定性踩坑记录。',
    date: '2026-03-05',
    tags: ['小程序', 'iBeacon', '蓝牙'],
    readingTime: 10,
    content: `# 小程序 iBeacon 对接实战

零售门店里，客户扫码进小程序，想把自己和企业身份绑定起来。传统做法是让客户手动输入客户编码、客户名称，再对接企业业务员审核——客户根本记不住编码，一单绑定搞半天。

iBeacon 解决的核心问题是**「在场证明」**：门店放一个蓝牙信标，客户进店后小程序自动扫描到信标，确认客户确实在店里，只需输入手机号即可自动完成绑定。

## 一、整体架构

\`\`\`
门店 iBeacon 信标
      ↓ 广播 UUID
微信小程序（wx.startBeaconDiscovery）
      ↓ 扫描到信标
后端校验 UUID 绑定的门店 → 自动带出客户信息
      ↓
客户输入手机号 → 完成绑定
\`\`\`

每个信标有唯一的 UUID + Major + Minor 三元组，后台维护「信标 ↔ 门店」映射表，扫到哪个信标就知道客户在哪家店。

## 二、小程序端 API 流程

\`\`\`javascript
// 1. 初始化蓝牙适配器
wx.openBluetoothAdapter({
  success: () => startDiscovery(),
  fail: (err) => handleBTError(err),
})

// 2. 开始搜索 iBeacon 设备
function startDiscovery() {
  wx.startBeaconDiscovery({
    uuids: ['FDA50693-A4E2-4FB1-AFCF-C6EB07647825'],
    success: () => {
      // 3. 监听信标更新
      wx.onBeaconUpdate((res) => {
        const beacons = res.beacons.filter((b) => b.accuracy > 0)
        if (beacons.length > 0) {
          handleNearest(beacons.sort((a, b) => a.accuracy - b.accuracy)[0])
        }
      })
    },
  })
}
\`\`\`

关键参数说明：

- \`accuracy\`：估算距离（米），用来判断远近
- \`rssi\`：信号强度，负值，越大越近
- \`proximity\`：0-3，分别表示未知/极近/近/远

## 三、距离判断与防抖

信号是波动的，直接取单次采样会抖动。实践中用**滑动窗口 + 多数投票**：

\`\`\`javascript
// 保留最近 5 次采样，取出现最多的信标作为当前门店
const WINDOW_SIZE = 5
const samples = []

function recordSample(minorId) {
  samples.push(minorId)
  if (samples.length > WINDOW_SIZE) samples.shift()

  const counts = {}
  samples.forEach((id) => (counts[id] = (counts[id] || 0) + 1))

  const winner = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0]
  // 连续多数才切换门店，避免边界抖动
  if (counts[winner] >= 3 && winner !== currentStore) {
    switchStore(winner)
  }
}
\`\`\`

## 四、iOS 与 Android 的差异坑

| 问题 | iOS | Android |
|------|-----|---------|
| UUID 过滤 | 严格按传入 UUID 过滤 | 部分机型返回所有设备 |
| 后台扫描 | 退后台后停止更新 | 可持续（需权限） |
| 首次权限 | 需引导开启蓝牙权限 | 需定位权限才能扫描 BLE |
| rssi 更新频率 | 约 1 秒一次 | 机型差异大，部分 250ms |

**最典型的坑**：Android 部分机型必须同时授予定位权限，蓝牙扫描才有返回；iOS 一定要在 \`info.plist\`（对应小程序宿主配置）声明蓝牙用途，否则回调直接失败。

## 五、异常兜底

真实门店环境复杂，必须全链路兜底：

\`\`\`javascript
// 蓝牙状态监听：用户半路关蓝牙的场景
wx.onBluetoothAdapterStateChange((res) => {
  if (!res.available) {
    showTips('蓝牙已关闭，请开启后重试')
  }
})

// 扫描失败重试：最多 3 次，间隔递增
async function scanWithRetry(retries = 3) {
  for (let i = 0; i < retries; i++) {
    const ok = await tryScan()
    if (ok) return true
    await sleep(1000 * (i + 1))
  }
  // 兜底：降级为手动选择门店
  fallbackToManualSelect()
  return false
}
\`\`\`

- **扫描不到**：引导用户检查蓝牙/定位权限
- **信号漂移**：滑动窗口防抖 + 人工修正入口
- **信标没电**：后台监控信标上报心跳，及时更换

## 总结

- iBeacon 的本质是「在场证明」，三元组映射门店
- 距离判断必须防抖：滑动窗口 + 多数投票
- iOS/Android 差异大，权限模型要分别处理
- 兜底永远要有：手动选择门店是最后防线

硬件对接项目的难点从来不在 API，而在真实环境的脏数据与边界情况。`,
  },
]
