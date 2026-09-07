---
title: ES6 核心知识点总结
date: 2026-09-07
description: ES6 新特性全面总结，包括 let/const、解构赋值、箭头函数、Set/Map、Promise、Class、模块化等核心知识点
tags:
  - JavaScript
  - ES6
  - 前端基础
---

# ES6 核心知识点总结

## 一、let 与 const

### let 特性

- **块级作用域**：只在声明的代码块内有效
- **不存在变量提升**：声明前使用会报错（暂时性死区）
- **不允许重复声明**：同一作用域内不能重复声明同名变量

```javascript
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
console.log(a) // ReferenceError
console.log(b) // 2
```

### const 特性

- **只读常量**：声明时必须赋值，之后不能改变
- **本质**：保证的是变量指向的内存地址不变，而非值不变

```javascript
const PI = 3.14159
// PI = 3 // 报错

// 对象的情况
const obj = { name: '张三' }
obj.name = '李四' // 可以修改属性
// obj = {} // 报错，不能改变地址
```

> ES6 开始，全局变量逐步与顶层对象属性脱钩：
> ```javascript
> let b = 1
> console.log(window.b) // undefined
> ```

## 二、解构赋值

### 数组解构

```javascript
let [a, b, c] = [1, 2, 3]
console.log(a, b, c) // 1, 2, 3

// 默认值
let [x, y = 10] = [5]
console.log(x, y) // 5, 10

// 字符串解构
const [h, e, l, l2, o] = 'hello'
```

### 对象解构

```javascript
let { name, age } = { name: '张三', age: 18 }
console.log(name, age) // 张三, 18

// 重命名
let { name: userName, age: userAge } = { name: '张三', age: 18 }

// 默认值
let { x = 1, y = 2 } = { x: 10 }
console.log(x, y) // 10, 2
```

### 解构的用途

```javascript
// 1. 交换变量
let a = 1, b = 2
[a, b] = [b, a]

// 2. 函数返回多个值
function getPosition() {
  return [100, 200]
}
let [x, y] = getPosition()

// 3. 提取 JSON 数据
let jsonData = { id: 1, name: 'test' }
let { id, name } = jsonData

// 4. 函数参数默认值
function foo(x = 0, y = 0) {
  return x + y
}
```

## 三、Set 与 Map

### Set

Set 是成员值唯一的有序集合。

```javascript
const set = new Set([1, 2, 3, 3, 4, 4])
console.log(set) // Set(4) {1, 2, 3, 4}

// 数组去重
const arr = [1, 1, 2, 2, 3, 3]
const unique = [...new Set(arr)] // [1, 2, 3]

// 常用方法
set.add(5)      // 添加
set.delete(1)   // 删除
set.has(2)      // 判断是否存在
set.clear()     // 清空
set.size        // 成员总数
```

### Map

Map 是键值对的集合，键可以是任意类型。

```javascript
const map = new Map()
map.set('name', '张三')
map.set(1, 'one')

console.log(map.get('name')) // 张三
console.log(map.has(1))      // true

// 初始化
const map2 = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three']
])

// 遍历
map.forEach((value, key) => {
  console.log(key, value)
})

// 转数组
[...map.keys()]     // 所有键
[...map.values()]   // 所有值
[...map.entries()]  // 所有键值对
```

## 四、箭头函数

### 基本语法

```javascript
// 传统函数
const add = function(a, b) {
  return a + b
}

// 箭头函数
const add = (a, b) => a + b

// 单参数可省略括号
const double = x => x * 2

// 多行需加大括号和 return
const calc = (a, b) => {
  const sum = a + b
  return sum * 2
}
```

### 注意事项

1. **this 指向固定**：箭头函数内的 this 指向定义时所在的对象，而非使用时
2. **不能当作构造函数**：不能使用 `new` 命令
3. **没有 arguments 对象**：可使用 rest 参数代替
4. **不能使用 yield**：不能用作 Generator 函数

```javascript
// this 指向示例
const obj = {
  name: '张三',
  // 传统函数，this 指向调用者
  sayHi: function() {
    setTimeout(function() {
      console.log(this.name) // undefined
    }, 100)
  },
  // 箭头函数，this 指向定义时的 obj
  sayHi2: function() {
    setTimeout(() => {
      console.log(this.name) // 张三
    }, 100)
  }
}
```

## 五、Rest 参数与扩展运算符

### Rest 参数

```javascript
// 替代 arguments
function sum(...args) {
  return args.reduce((a, b) => a + b, 0)
}
console.log(sum(1, 2, 3)) // 6
```

### 扩展运算符 `...`

```javascript
// 数组展开
const arr1 = [1, 2, 3]
const arr2 = [...arr1, 4, 5] // [1, 2, 3, 4, 5]

// 合并数组
const merged = [...arr1, ...arr2]

// 对象展开
const obj1 = { a: 1, b: 2 }
const obj2 = { ...obj1, c: 3 } // { a: 1, b: 2, c: 3 }

// 复制对象（浅拷贝）
const copy = { ...obj1 }
```

## 六、Object 新方法

### Object.assign()

用于对象的合并与复制。

```javascript
const target = { a: 1 }
const source = { b: 2, c: 3 }

Object.assign(target, source)
console.log(target) // { a: 1, b: 2, c: 3 }

// 常用于复制对象
const copy = Object.assign({}, source)
```

### Object.getPrototypeOf / setPrototypeOf

```javascript
const proto = { sayHi() { console.log('hi') } }
const obj = {}

Object.setPrototypeOf(obj, proto)
obj.sayHi() // hi

// 获取原型
Object.getPrototypeOf(obj) // proto
```

## 七、Class 类

### 基本语法

```javascript
class Person {
  // 构造函数
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  // 实例方法
  introduce() {
    return `我是${this.name}，今年${this.age}岁`
  }

  // 静态方法
  static create(name, age) {
    return new Person(name, age)
  }
}

const p = new Person('张三', 18)
console.log(p.introduce()) // 我是张三，今年18岁

// 静态方法直接通过类调用
const p2 = Person.create('李四', 20)
```

### 继承

```javascript
class Student extends Person {
  constructor(name, age, grade) {
    super(name, age) // 调用父类构造函数
    this.grade = grade
  }

  study() {
    console.log(`${this.name}在学习`)
  }
}

const s = new Student('小明', 15, '初三')
s.introduce() // 我是小明，今年15岁
s.study()     // 小明在学习
```

### Getter 和 Setter

```javascript
class User {
  constructor(name) {
    this._name = name
  }

  get name() {
    return this._name
  }

  set name(value) {
    this._name = value.toUpperCase()
  }
}

const u = new User('alice')
console.log(u.name) // ALICE
u.name = 'bob'
console.log(u.name) // BOB
```

## 八、Iterator 与 Generator

### Iterator 迭代器

```javascript
const arr = [1, 2, 3]
const iterator = arr[Symbol.iterator]()

console.log(iterator.next()) // { value: 1, done: false }
console.log(iterator.next()) // { value: 2, done: false }
console.log(iterator.next()) // { value: 3, done: false }
console.log(iterator.next()) // { value: undefined, done: true }
```

### Generator 生成器

```javascript
function* gen() {
  yield '苹果'
  yield '香蕉'
  yield '橙子'
}

const g = gen()
console.log(g.next()) // { value: '苹果', done: false }
console.log(g.next()) // { value: '香蕉', done: false }
console.log(g.next()) // { value: '橙子', done: false }
console.log(g.next()) // { value: undefined, done: true }
```

## 九、模块化

### export 导出

```javascript
// 命名导出
export const name = '张三'
export function add(a, b) { return a + b }

// 默认导出
export default class Person {
  constructor(name) {
    this.name = name
  }
}
```

### import 导入

```javascript
// 命名导入
import { name, add } from './module.js'

// 默认导入
import Person from './module.js'

// 整体导入
import * as utils from './utils.js'
```

## 十、模板字符串

```javascript
const name = '张三'
const age = 18

// 传统拼接
const str1 = '我叫' + name + '，今年' + age + '岁'

// 模板字符串
const str2 = `我叫${name}，今年${age}岁`

// 支持换行
const html = `
  <div>
    <h1>${name}</h1>
    <p>${age}岁</p>
  </div>
`
```

## 十一、事件循环与异步

### 同步与异步

```javascript
console.log(1)
setTimeout(() => {
  console.log(2)
}, 0)
console.log(3)
// 输出: 1, 3, 2
```

### Promise

```javascript
const promise = new Promise((resolve, reject) => {
  // 异步操作
  setTimeout(() => {
    const success = true
    if (success) {
      resolve('操作成功')
    } else {
      reject('操作失败')
    }
  }, 1000)
})

promise
  .then(result => console.log(result))
  .catch(error => console.error(error))
```

### async/await

```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data')
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
  }
}
```
