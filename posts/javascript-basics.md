---
title: JavaScript 基础知识点总结
date: 2026-09-07
description: JavaScript 核心基础知识，包括前端三层架构、浏览器工作原理、DOM操作、事件处理、闭包、this指向等核心概念
tags:
  - JavaScript
  - 前端基础
  - DOM
  - 事件
---

# JavaScript 基础知识点总结

## 一、前端三层架构

现代 Web 开发遵循关注点分离原则，分为三层：

| 层级 | 技术 | 职责 |
|------|------|------|
| **结构层** | HTML | 从语义角度描述页面结构 |
| **表现层** | CSS | 从审美角度美化页面 |
| **行为层** | JavaScript | 从交互角度提升用户体验 |

## 二、JavaScript 概述

### 什么是 JavaScript？

JavaScript 是一种**基于对象的客户端脚本语言**：

- **基于对象**：语言内部已存在很多对象，只需调用对象提供的方法
- **客户端**：运行在浏览器中，解释执行
- **弱类型**：对数据类型要求不严格，运行时才确定变量类型
- **动态语言**：可以在运行过程中动态给对象添加属性和方法

### JavaScript 的组成

ECMAScript + DOM + BOM

- **ECMAScript**：JavaScript 的核心语法规范
- **DOM**（Document Object Model）：文档对象模型，用于操作 HTML
- **BOM**（Browser Object Model）：浏览器对象模型，用于操作浏览器窗口

## 三、DOM 操作

### 获取元素

```javascript
// 通过 ID 获取（返回单个元素）
const box = document.getElementById('box')

// 通过标签名获取（返回集合）
const divs = document.getElementsByTagName('div')

// 通过类名获取（返回集合）
const items = document.getElementsByClassName('item')

// 通过选择器获取（返回第一个匹配的元素）
const first = document.querySelector('.item')

// 通过选择器获取所有匹配的元素
const all = document.querySelectorAll('.item')
```

### 创建和添加元素

```javascript
// 创建元素
const div = document.createElement('div')
div.textContent = '新创建的元素'
div.className = 'box'

// 添加到父元素末尾
document.body.appendChild(div)

// 添加到指定元素之前
const parent = document.getElementById('parent')
const child = document.getElementById('child')
const newElem = document.createElement('p')
parent.insertBefore(newElem, child)
```

### 修改元素

```javascript
const box = document.getElementById('box')

// 修改内容
box.textContent = '纯文本内容'
box.innerHTML = '<strong>HTML内容</strong>'

// 修改属性
box.id = 'newId'
box.className = 'newClass'
box.setAttribute('data-index', '1')

// 修改样式
box.style.color = 'red'
box.style.fontSize = '16px'
box.style.backgroundColor = '#f0f0f0'
```

### 删除元素

```javascript
const box = document.getElementById('box')
const parent = box.parentNode

// 方式1：通过父元素删除
parent.removeChild(box)

// 方式2：现代方法（推荐）
box.remove()
```

## 四、元素尺寸和位置

### offset 系列

```javascript
const box = document.getElementById('box')

// offsetWidth / offsetHeight：元素的整体尺寸
// = width + padding + border
console.log(box.offsetWidth)
console.log(box.offsetHeight)

// offsetLeft / offsetTop：元素相对于定位父元素的偏移
// 如果没有定位父元素，则相对于 body
console.log(box.offsetLeft)
console.log(box.offsetTop)

// offsetParent：返回定位父元素
console.log(box.offsetParent)
```

### scroll 系列

```javascript
// scrollWidth / scrollHeight：元素的实际内容尺寸
// = width + padding + 超出部分
console.log(box.scrollWidth)
console.log(box.scrollHeight)

// scrollLeft / scrollTop：元素滚动条滚动的距离
console.log(box.scrollLeft)
console.log(box.scrollTop)

// 获取页面滚动距离（兼容写法）
const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
```

### client 系列

```javascript
// clientWidth / clientHeight：元素的可视区域
// = width + padding（不包括 border 和滚动条）
console.log(box.clientWidth)
console.log(box.clientHeight)
```

### 对比总结

| 属性 | 说明 |
|------|------|
| `offsetWidth` | width + padding + border |
| `clientWidth` | width + padding |
| `scrollWidth` | width + padding + 超出内容 |
| `offsetLeft` | 相对于定位父元素的左偏移 |
| `scrollTop` | 滚动条滚动的距离 |

## 五、事件处理

### 事件三要素

1. **事件源**：触发事件的元素
2. **事件类型**：如 click、mouseover 等
3. **事件处理函数**：事件触发后执行的代码

```javascript
const btn = document.getElementById('btn')

btn.addEventListener('click', function(event) {
  console.log('按钮被点击了')
  console.log('事件对象：', event)
  console.log('事件源：', event.target)
})
```

### 事件流

事件流描述的是事件在页面中传播的顺序：

1. **事件捕获阶段**：从 window → document → html → body → ... → 目标元素
2. **目标阶段**：事件到达目标元素
3. **事件冒泡阶段**：从目标元素 → ... → body → html → document → window

```javascript
// 默认在冒泡阶段触发
element.addEventListener('click', handler)

// 在捕获阶段触发
element.addEventListener('click', handler, true)
```

### 阻止事件冒泡

```javascript
element.addEventListener('click', function(event) {
  // 标准浏览器
  event.stopPropagation()
  
  // IE 浏览器（已不常用）
  // event.cancelBubble = true
})
```

### 阻止默认行为

```javascript
// 方式1：在事件处理函数中
link.addEventListener('click', function(event) {
  event.preventDefault()
})

// 方式2：在 HTML 中
// <a href="..." onclick="return false">链接</a>
```

### 事件委托

利用事件冒泡，将事件处理函数绑定在父元素上：

```javascript
const ul = document.getElementById('list')

ul.addEventListener('click', function(event) {
  const target = event.target
  
  if (target.tagName === 'LI') {
    console.log('点击了：', target.textContent)
  }
})
```

**优点：**
- 减少事件绑定次数，提高性能
- 动态添加的子元素自动拥有事件处理能力

## 六、this 指向

### 普通函数

```javascript
function foo() {
  console.log(this)
}

// 直接调用，指向 window（严格模式下为 undefined）
foo()

// 作为对象方法调用，指向该对象
const obj = {
  name: '张三',
  sayHi: function() {
    console.log(this.name)
  }
}
obj.sayHi() // 张三
```

### 箭头函数

箭头函数的 this 指向**定义时所在的对象**，而不是调用时：

```javascript
const obj = {
  name: '张三',
  sayHi: function() {
    setTimeout(function() {
      console.log(this.name) // undefined（this 指向 window）
    }, 100)
  },
  sayHi2: function() {
    setTimeout(() => {
      console.log(this.name) // 张三（this 指向 obj）
    }, 100)
  }
}
```

### 改变 this 指向

```javascript
function greet(greeting, punctuation) {
  console.log(greeting + ', ' + this.name + punctuation)
}

const person = { name: '张三' }

// call：立即调用，参数逐个传递
greet.call(person, '你好', '！')

// apply：立即调用，参数以数组形式传递
greet.apply(person, ['你好', '！'])

// bind：返回新函数，不立即调用
const boundGreet = greet.bind(person)
boundGreet('你好', '！')
```

## 七、闭包

闭包是指有权访问另一个函数作用域中变量的函数。

### 基本示例

```javascript
function outer() {
  let count = 0
  
  return function inner() {
    count++
    console.log(count)
  }
}

const fn = outer()
fn() // 1
fn() // 2
fn() // 3
```

### 闭包的应用

**1. 实现私有变量**

```javascript
function createCounter() {
  let count = 0
  
  return {
    increment: function() { count++ },
    decrement: function() { count-- },
    getCount: function() { return count }
  }
}

const counter = createCounter()
counter.increment()
counter.increment()
console.log(counter.getCount()) // 2
```

**2. 在循环中使用**

```javascript
// 问题：var 没有块级作用域
for (var i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(i) // 全部输出 5
  }, 100)
}

// 解决1：使用闭包（IIFE）
for (var i = 0; i < 5; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j) // 0, 1, 2, 3, 4
    }, 100)
  })(i)
}

// 解决2：使用 let（推荐）
for (let i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(i) // 0, 1, 2, 3, 4
  }, 100)
}
```

### 闭包的缺点

- 占用内存，不及时清除会导致内存泄漏
- 使用完毕后应将引用设为 null

## 八、回调函数

回调函数是作为参数传递给另一个函数的函数。

### 基本示例

```javascript
function fetchData(callback) {
  setTimeout(function() {
    const data = { id: 1, name: '张三' }
    callback(data)
  }, 1000)
}

fetchData(function(data) {
  console.log('获取到数据：', data)
})
```

### 回调地狱

```javascript
// 多层嵌套，代码难以维护
getUser(function(user) {
  getOrders(user, function(orders) {
    getOrderDetails(orders[0], function(details) {
      console.log(details)
    })
  })
})
```

**解决方案：使用 Promise**

```javascript
getUser()
  .then(user => getOrders(user))
  .then(orders => getOrderDetails(orders[0]))
  .then(details => console.log(details))
  .catch(error => console.error(error))
```

## 九、执行上下文与作用域

### 执行上下文

当 JavaScript 代码执行时，会创建执行上下文：

1. **全局执行上下文**：程序启动时创建
2. **函数执行上下文**：函数调用时创建
3. **eval 执行上下文**：eval 函数中执行

每个执行上下文包含：
- **变量对象**：存储变量、函数声明
- **作用域链**：用于查找变量
- **this 指向**

### 作用域链

```javascript
let a = 1

function outer() {
  let b = 2
  
  function inner() {
    let c = 3
    console.log(a) // 1（访问全局变量）
    console.log(b) // 2（访问外层函数变量）
    console.log(c) // 3（访问自身变量）
  }
  
  inner()
}

outer()
```

## 十、值类型与引用类型

### 值类型（基本类型）

```javascript
let a = 10
let b = a
b = 20
console.log(a) // 10（互不影响）
```

**特点：**
- 存储在栈内存中
- 赋值时复制值
- 包括：Number、String、Boolean、Undefined、Null、Symbol

### 引用类型

```javascript
let obj1 = { name: '张三' }
let obj2 = obj1
obj2.name = '李四'
console.log(obj1.name) // 李四（指向同一对象）
```

**特点：**
- 存储在堆内存中，栈中存储引用地址
- 赋值时复制引用地址
- 包括：Object、Array、Function 等

## 十一、常用 API

### 数组方法

```javascript
const arr = [1, 2, 3, 4, 5]

// map：返回新数组
const doubled = arr.map(item => item * 2)

// filter：过滤
const even = arr.filter(item => item % 2 === 0)

// reduce：累加
const sum = arr.reduce((acc, cur) => acc + cur, 0)

// forEach：遍历（无返回值）
arr.forEach(item => console.log(item))

// find：查找第一个符合条件的元素
const found = arr.find(item => item > 3)

// some：是否至少有一个符合
const hasEven = arr.some(item => item % 2 === 0)

// every：是否全部符合
const allEven = arr.every(item => item % 2 === 0)
```

### 字符串方法

```javascript
const str = 'Hello, World!'

str.indexOf('World')     // 7
str.includes('World')    // true
str.startsWith('Hello')  // true
str.endsWith('!')        // true
str.slice(0, 5)          // 'Hello'
str.split(',')           // ['Hello', ' World!']
str.trim()               // 去除两端空格
str.replace('World', 'JavaScript') // 'Hello, JavaScript!'
```

### 对象方法

```javascript
const obj = { a: 1, b: 2, c: 3 }

Object.keys(obj)    // ['a', 'b', 'c']
Object.values(obj)  // [1, 2, 3]
Object.entries(obj) // [['a', 1], ['b', 2], ['c', 3]]

// 合并对象
const merged = Object.assign({}, obj1, obj2)
// 或使用扩展运算符
const merged2 = { ...obj1, ...obj2 }
```
