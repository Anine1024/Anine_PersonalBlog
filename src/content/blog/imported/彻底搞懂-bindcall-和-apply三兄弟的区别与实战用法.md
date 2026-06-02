---
slug: "彻底搞懂-bindcall-和-apply三兄弟的区别与实战用法"
title: "彻底搞懂 bind、call 和 apply：三兄弟的区别与实战用法"
date: "2026-06-02"
category: "前端开发"
tags: ["javascript bind call apply"]
excerpt: "深入解析 JavaScript 中 call、apply 和 bind 三个方法的区别、使用场景及底层原理，助你轻松应对面试和日常开发。"
readingTime: 8
featured: false
---

## 引言

在 JavaScript 中，`this` 的指向问题一直是开发者绕不开的“坑”，也是面试中高频出现的考点。而 `call`、`apply` 和 `bind` 这三个方法，正是我们手动控制 `this` 指向的“三把利剑”。

很多初学者容易混淆它们：为什么要有三个？它们到底有什么区别？什么时候用哪一个？本文将从底层原理出发，结合丰富的代码示例，帮你彻底理清这三兄弟的“爱恨情仇”。

## 一、它们是谁？—— 作用与基本用法

首先，`call`、`apply` 和 `bind` 都是 **Function.prototype** 上的方法，也就是说，所有函数都可以调用它们。它们最核心的作用是：**改变函数执行时的 `this` 指向**。

### 1.1 call 方法

`call` 方法接受一个 `this` 指向的对象作为第一个参数，后面依次传入函数所需的参数。

```javascript
function greet(greeting, punctuation) {
  console.log(greeting + ', ' + this.name + punctuation);
}

const person = { name: 'Alice' };

greet.call(person, 'Hello', '!'); 
// 输出：Hello, Alice!
```

### 1.2 apply 方法

`apply` 与 `call` 几乎相同，唯一的区别是：它接受一个**数组（或类数组对象）**作为第二个参数，数组中的元素会被展开作为函数参数。

```javascript
function greet(greeting, punctuation) {
  console.log(greeting + ', ' + this.name + punctuation);
}

const person = { name: 'Bob' };

greet.apply(person, ['Hi', '?']); 
// 输出：Hi, Bob?
```

### 1.3 bind 方法

`bind` 与前两者不同：它不会立即执行函数，而是返回一个**绑定好 `this` 的新函数**，你可以稍后调用它。它也可以接受预设参数（柯里化）。

```javascript
function greet(greeting, punctuation) {
  console.log(greeting + ', ' + this.name + punctuation);
}

const person = { name: 'Charlie' };

const boundGreet = greet.bind(person, 'Hey');
boundGreet('!'); 
// 输出：Hey, Charlie!
```

## 二、核心区别对比

下面这张表可以帮你快速记忆三者的差异：

| 特性 | call | apply | bind |
|------|------|-------|------|
| 执行时机 | 立即执行 | 立即执行 | 返回新函数，不立即执行 |
| 参数传递 | 逐个传递 | 数组传递 | 逐个传递（支持柯里化） |
| 返回值 | 函数执行结果 | 函数执行结果 | 绑定 this 的新函数 |
| 应用场景 | 借用方法、类型判断 | 借用方法、展开数组 | 事件回调、定时器、柯里化 |

## 三、实战场景深度解析

### 3.1 借用其他对象的方法

这是 `call/apply` 最经典的应用：让一个对象“借用”另一个对象的方法。

```javascript
const calculator = {
  add: function(a, b) { return a + b + this.tax; }
};

const taxContext1 = { tax: 5 };
const taxContext2 = { tax: 10 };

// 借用同一个方法，但 this 不同
console.log(calculator.add.call(taxContext1, 10, 20)); // 35
console.log(calculator.add.call(taxContext2, 10, 20)); // 40
```

**真实场景**：类数组对象（如 `arguments`、DOM 节点列表）没有数组方法，但可以通过 `call` 借用：

```javascript
function printArgs() {
  // arguments 是类数组，没有 forEach 方法
  Array.prototype.forEach.call(arguments, (item) => {
    console.log(item);
  });
}

printArgs(1, 2, 3); // 1 2 3
```

### 3.2 类型判断 —— 更精确的 typeof

`typeof` 对于数组、对象、null 的区分不够精确。利用 `Object.prototype.toString` 配合 `call` 可以拿到准确类型：

```javascript
function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

console.log(getType([]));        // "Array"
console.log(getType({}));        // "Object"
console.log(getType(null));      // "Null"
console.log(getType(new Date()));// "Date"
```

### 3.3 事件处理中的 this 绑定

在 DOM 事件中，`this` 默认指向触发事件的元素，但有时我们需要指向外部对象。`bind` 是解决这个问题的利器：

```javascript
class Counter {
  constructor() {
    this.count = 0;
    // 如果不 bind，handleClick 中的 this 会指向按钮
    document.querySelector('#btn')
      .addEventListener('click', this.handleClick.bind(this));
  }

  handleClick() {
    this.count++;
    console.log(`点击了 ${this.count} 次`);
  }
}
```

### 3.4 函数柯里化（预置参数）

`bind` 的第二个及后续参数可以实现“部分应用”（Partial Application），也就是预先固定一些参数：

```javascript
function multiply(a, b) {
  return a * b;
}

// 预置第一个参数为 2
const double = multiply.bind(null, 2);
console.log(double(5)); // 10
console.log(double(8)); // 16

// 预置第一个参数为 3
const triple = multiply.bind(null, 3);
console.log(triple(5)); // 15
```

## 四、面试高频题：模拟实现

为了检验你是否真正理解底层原理，面试官常会让你手动实现这三个方法。下面给出简化版实现：

### 4.1 模拟 call

```javascript
Function.prototype.myCall = function(context, ...args) {
  // 处理 null/undefined 时指向 window（严格模式下为 undefined）
  context = context || window;
  
  // 创建一个唯一 key，避免属性覆盖
  const fnKey = Symbol('fn');
  
  // 将当前函数（this）作为 context 的方法
  context[fnKey] = this;
  
  // 执行函数并获取结果
  const result = context[fnKey](...args);
  
  // 删除临时属性
  delete context[fnKey];
  
  return result;
};
```

### 4.2 模拟 apply

```javascript
Function.prototype.myApply = function(context, argsArray) {
  context = context || window;
  const fnKey = Symbol('fn');
  context[fnKey] = this;
  
  // apply 必须接受数组或类数组，这里简化处理
  const args = argsArray ? [...argsArray] : [];
  const result = context[fnKey](...args);
  
  delete context[fnKey];
  return result;
};
```

### 4.3 模拟 bind

```javascript
Function.prototype.myBind = function(context, ...bindArgs) {
  const originalFn = this;
  
  return function(...callArgs) {
    // 合并预置参数和调用时传入的参数
    return originalFn.apply(context, [...bindArgs, ...callArgs]);
  };
};
```

**注意**：真正的 `bind` 还支持使用 `new` 操作符（此时 `this` 被忽略），完整实现更复杂，但上述版本足以应对大部分面试场景。

## 五、性能与选择建议

### 5.1 性能对比

- `call` 和 `apply` 性能接近，但 `call` 在参数已知时略快（无需处理数组）。
- `bind` 因为会创建新函数，并涉及闭包，**性能开销稍大**。在频繁调用的场景（如 requestAnimationFrame）中，应避免在循环内使用 `bind`，可以提前绑定好。

### 5.2 选择原则

| 场景 | 推荐方法 |
|------|---------|
| 参数数量固定且较少 | `call` |
| 参数数量不固定或已是数组 | `apply` |
| 需要延迟执行或事件回调 | `bind` |
| 需要预置部分参数（柯里化） | `bind` |
| 借用方法且参数少 | `call` |
| 借用方法且参数多/动态 | `apply` |

## 六、常见误区与注意事项

### 6.1 箭头函数无法被绑定

箭头函数没有自己的 `this`，它继承外层作用域的 `this`。因此 `call`、`apply`、`bind` 对箭头函数**无效**。

```javascript
const obj = {
  name: 'obj',
  arrowFn: () => {
    console.log(this.name); // 这里的 this 是全局对象
  }
};

obj.arrowFn.call({ name: 'newObj' }); // 输出 undefined（或 window.name）
```

### 6.2 bind 返回的函数可以被 new

这是面试中的“坑”：用 `bind` 返回的函数如果通过 `new` 调用，`this` 会指向新创建的对象，而忽略绑定的 `this`。

```javascript
function Person(name) {
  this.name = name;
}

const BoundPerson = Person.bind({ x: 1 });
const p = new BoundPerson('Alice');
console.log(p.name); // "Alice"（不是 {x:1}）
console.log(p.x);    // undefined
```

### 6.3 多次 bind 只有第一次有效

```javascript
function foo() {
  console.log(this.a);
}

const obj1 = { a: 1 };
const obj2 = { a: 2 };

const bound = foo.bind(obj1);
const boundAgain = bound.bind(obj2);

boundAgain(); // 输出 1，不是 2！因为 bind 的绑定一旦生效就无法再改变
```

## 总结

`call`、`apply` 和 `bind` 是 JavaScript 中控制 `this` 指向的核心工具，理解它们的区别与适用场景是进阶前端开发的必修课。

- **call/apply**：立即执行函数，区别仅在于参数传递方式。适合借用方法、类型判断等场景。
- **bind**：返回新函数，支持柯里化和延迟执行。适合事件回调、定时器等场景。
- **底层原理**：本质上都是通过将函数作为对象的临时属性来改变 `this` 指向。

掌握这三兄弟，你不仅能写出更灵活的代码，还能在面试中从容应对相关题目。建议动手实现一遍模拟函数，理解会更加深刻。