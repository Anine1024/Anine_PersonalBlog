---
slug: "javascript-拷贝问题从浅拷贝到深拷贝的全面解析"
title: "JavaScript 拷贝问题：从浅拷贝到深拷贝的全面解析"
date: "2026-06-09"
category: "前端开发"
tags: ["深拷贝 浅拷贝"]
excerpt: "深入理解 JavaScript 中的浅拷贝与深拷贝概念，掌握常见实现方法及手写深拷贝技巧，避免引用类型数据修改带来的意外问题。"
readingTime: 8
featured: false
---

## 引言

在 JavaScript 开发中，拷贝（Clone）是一个看似简单却暗藏陷阱的基础问题。你是否遇到过这样的情况：将一个对象赋值给另一个变量后，修改其中一个却意外影响了另一个？这背后正是 JavaScript 引用类型数据拷贝的核心挑战。

本文将从浅拷贝与深拷贝的概念出发，逐步剖析它们的区别、常见实现方式以及手写深拷贝的完整过程。无论你是刚入门的开发者还是希望巩固基础的中级开发者，这篇文章都将帮你彻底理清拷贝问题。

---

## 浅拷贝：只复制一层，共享引用

### 什么是浅拷贝？

浅拷贝（Shallow Copy）是指创建一个新对象，这个新对象拥有原始对象属性值的精确拷贝。对于基本类型属性（如数字、字符串），拷贝的是值本身；对于引用类型属性（如对象、数组、函数），拷贝的是内存地址（引用）。

这意味着，如果原始对象或拷贝对象修改了某个引用类型属性的内部值，另一个对象也会受到影响。

### 常见实现方式

#### 1. Object.assign()

```javascript
const original = {
  name: 'Alice',
  age: 30,
  address: {
    city: 'Beijing',
    street: 'Main St'
  }
};

const shallowCopy = Object.assign({}, original);

// 修改基本类型属性
shallowCopy.name = 'Bob';
console.log(original.name); // 'Alice' —— 互不影响

// 修改引用类型属性
shallowCopy.address.city = 'Shanghai';
console.log(original.address.city); // 'Shanghai' —— 互相影响
```

#### 2. 展开运算符 (...)

```javascript
const original = { a: 1, b: { c: 2 } };
const shallowCopy = { ...original };

shallowCopy.a = 10;
console.log(original.a); // 1 —— 互不影响

shallowCopy.b.c = 20;
console.log(original.b.c); // 20 —— 互相影响
```

#### 3. Array.prototype.concat() 和 slice()

```javascript
const arr = [1, 2, { x: 10 }];
const shallowCopyArr = arr.concat();

shallowCopyArr[0] = 100;
console.log(arr[0]); // 1 —— 互不影响

shallowCopyArr[2].x = 999;
console.log(arr[2].x); // 999 —— 互相影响
```

### 浅拷贝的适用场景

- 当对象只有一层基本类型属性时，浅拷贝完全足够。
- 性能要求高，且不关心深层引用关系的场景。
- 临时备份或快速复制简单配置对象。

---

## 深拷贝：完全独立，互不干扰

### 什么是深拷贝？

深拷贝（Deep Copy）是指将一个对象从内存中完整地拷贝一份出来，新对象和原始对象在堆内存中拥有完全独立的存储空间。无论对象嵌套多少层，修改拷贝对象都不会影响原始对象。

### 常见实现方式

#### 1. JSON.parse(JSON.stringify())

这是最常用的深拷贝方法，但存在明显的局限性。

```javascript
const original = {
  name: 'Alice',
  age: 30,
  address: { city: 'Beijing' },
  date: new Date(),
  func: () => console.log('hello'),
  symbol: Symbol('test'),
  undefinedProp: undefined,
  nan: NaN,
  infinity: Infinity
};

const deepCopy = JSON.parse(JSON.stringify(original));

console.log(deepCopy.name); // 'Alice'
console.log(deepCopy.address.city); // 'Beijing'

// 修改不影响
deepCopy.address.city = 'Shanghai';
console.log(original.address.city); // 'Beijing'

// 但存在以下问题：
console.log(deepCopy.date); // 字符串，而非 Date 对象
console.log(deepCopy.func); // undefined —— 函数丢失
console.log(deepCopy.symbol); // undefined —— Symbol 丢失
console.log(deepCopy.undefinedProp); // undefined —— 但原对象有该属性
console.log(deepCopy.nan); // null —— NaN 变成了 null
console.log(deepCopy.infinity); // null —— Infinity 变成了 null
```

**局限性总结：**
- 无法处理函数、Symbol、undefined
- 会丢失特殊对象类型（如 Date、RegExp、Map、Set）
- 无法处理循环引用
- NaN 和 Infinity 会被转换为 null

#### 2. 结构化克隆算法（structuredClone）

现代浏览器和 Node.js 17+ 提供了原生的 `structuredClone()` 方法。

```javascript
const original = {
  name: 'Alice',
  address: { city: 'Beijing' },
  date: new Date(),
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3])
};

const deepCopy = structuredClone(original);

console.log(deepCopy.date instanceof Date); // true
console.log(deepCopy.map instanceof Map); // true
console.log(deepCopy.set instanceof Set); // true

// 但仍然无法克隆函数和 Symbol
```

---

## 手写深拷贝：从零到一实现完整方案

理解深拷贝的核心逻辑后，我们可以手写一个健壮的深拷贝函数，支持处理复杂场景。

### 基础版本

```javascript
function deepClone(obj) {
  // 处理基本类型和 null
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 处理数组
  if (Array.isArray(obj)) {
    const arrCopy = [];
    for (let i = 0; i < obj.length; i++) {
      arrCopy[i] = deepClone(obj[i]);
    }
    return arrCopy;
  }

  // 处理普通对象
  const objCopy = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      objCopy[key] = deepClone(obj[key]);
    }
  }
  return objCopy;
}
```

### 进阶版本：处理循环引用和特殊对象

```javascript
function deepClone(obj, hash = new WeakMap()) {
  // 处理 null 和基本类型
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 处理循环引用
  if (hash.has(obj)) {
    return hash.get(obj);
  }

  // 处理 Date
  if (obj instanceof Date) {
    const copy = new Date(obj);
    hash.set(obj, copy);
    return copy;
  }

  // 处理 RegExp
  if (obj instanceof RegExp) {
    const copy = new RegExp(obj.source, obj.flags);
    hash.set(obj, copy);
    return copy;
  }

  // 处理 Map
  if (obj instanceof Map) {
    const copy = new Map();
    hash.set(obj, copy);
    obj.forEach((value, key) => {
      copy.set(deepClone(key, hash), deepClone(value, hash));
    });
    return copy;
  }

  // 处理 Set
  if (obj instanceof Set) {
    const copy = new Set();
    hash.set(obj, copy);
    obj.forEach(value => {
      copy.add(deepClone(value, hash));
    });
    return copy;
  }

  // 处理数组
  if (Array.isArray(obj)) {
    const arrCopy = [];
    hash.set(obj, arrCopy);
    for (let i = 0; i < obj.length; i++) {
      arrCopy[i] = deepClone(obj[i], hash);
    }
    return arrCopy;
  }

  // 处理普通对象
  const objCopy = {};
  hash.set(obj, objCopy);
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      objCopy[key] = deepClone(obj[key], hash);
    }
  }
  return objCopy;
}

// 测试循环引用
const obj = { a: 1 };
obj.self = obj;

const cloned = deepClone(obj);
console.log(cloned.self === cloned); // true —— 保持循环引用结构
console.log(cloned === obj); // false —— 确实是新对象
```

### 性能优化与注意事项

1. **使用 WeakMap 处理循环引用**：WeakMap 的键是弱引用，不会阻止垃圾回收，避免内存泄漏。
2. **区分对象类型**：通过 instanceof 或 Object.prototype.toString.call() 判断对象类型。
3. **处理 Symbol 属性**：使用 Object.getOwnPropertySymbols() 获取 Symbol 键。
4. **处理原型链**：使用 Object.create(Object.getPrototypeOf(obj)) 保持原型。

```javascript
function enhancedDeepClone(obj, hash = new WeakMap()) {
  // ... 前面的处理逻辑相同 ...

  // 处理 Symbol 属性
  const symbols = Object.getOwnPropertySymbols(obj);
  if (symbols.length > 0) {
    for (const sym of symbols) {
      objCopy[sym] = deepClone(obj[sym], hash);
    }
  }

  // 保持原型链
  Object.setPrototypeOf(objCopy, Object.getPrototypeOf(obj));

  return objCopy;
}
```

---

## 总结

拷贝是 JavaScript 中一个基础但关键的概念，理解浅拷贝与深拷贝的区别对于编写健壮的代码至关重要。

**核心要点回顾：**

1. **浅拷贝**：只复制对象的第一层属性，引用类型属性共享内存地址。适用于简单对象或性能敏感场景。
2. **深拷贝**：递归复制所有层级，创建完全独立的对象。适用于复杂嵌套数据结构。
3. **常见实现**：
   - `Object.assign()` 和展开运算符 —— 浅拷贝
   - `JSON.parse(JSON.stringify())` —— 简单深拷贝，但有局限性
   - `structuredClone()` —— 现代浏览器原生支持，功能强大
   - 手写深拷贝 —— 灵活控制，可处理循环引用、特殊对象等复杂场景

**实践建议：**
- 对于大多数场景，优先使用 `structuredClone()`（如果你的运行环境支持）。
- 需要处理函数或 Symbol 时，必须手写深拷贝或使用成熟的库（如 lodash 的 `_.cloneDeep`）。
- 在团队中明确拷贝行为，避免因浅拷贝导致的隐蔽 bug。

掌握拷贝原理不仅能帮助你写出更可靠的代码，也是面试中常考的核心知识点。希望这篇文章能让你对 JavaScript 的拷贝问题有更清晰的认识。