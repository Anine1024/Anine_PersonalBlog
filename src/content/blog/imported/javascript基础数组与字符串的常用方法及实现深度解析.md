---
slug: "javascript基础数组与字符串的常用方法及实现深度解析"
title: "JavaScript基础：数组与字符串的常用方法及实现深度解析"
date: "2026-06-09"
category: "前端开发"
tags: ["数组常用方法及实现", "数组扁平化", "字符串常用方法及实现"]
excerpt: "深入解析JavaScript中数组和字符串的核心方法，从原理到手写实现，再到数组扁平化的多种方案，助你夯实JS基础。"
readingTime: 8
featured: false
---

## 引言

JavaScript作为一门轻量级、解释型或即时编译型的编程语言，其核心在于对数据的操作。在日常开发中，数组和字符串是最常用的数据结构。无论是处理API返回的嵌套数据，还是格式化用户输入的文本，都离不开对数组和字符串的灵活运用。

然而，很多开发者在使用`Array.prototype.map`或`String.prototype.slice`时，往往只停留在“会用”的层面，对其内部实现原理和边界情况了解不深。特别是在面试中，数组扁平化（Flatten）几乎成了必考题，它不仅考察递归思想，还考验对`reduce`、`concat`、`扩展运算符`等方法的综合掌握。

本文将带你系统梳理数组和字符串的常用方法，并深入手写实现，最后重点攻克数组扁平化的6种经典方案。读完本文，你不仅能熟练使用这些API，还能理解其底层逻辑，在面试和实战中游刃有余。

## 一、数组常用方法及手写实现

数组方法可以分为**改变原数组**（mutable）和**返回新数组**（immutable）两类。掌握它们的区别和实现，是写出健壮代码的基础。

### 1.1 遍历与映射：`forEach` 与 `map`

- **`forEach`**：对数组每个元素执行一次回调，无返回值。
- **`map`**：对数组每个元素执行回调，返回新数组。

**手写实现 `myMap`**：

```javascript
Array.prototype.myMap = function(callback, thisArg) {
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }
  const result = [];
  for (let i = 0; i < this.length; i++) {
    // 处理稀疏数组：跳过空位
    if (i in this) {
      result[i] = callback.call(thisArg, this[i], i, this);
    }
  }
  return result;
};

// 测试
const arr = [1, 2, , 3]; // 稀疏数组
console.log(arr.myMap(x => x * 2)); // [2, 4, empty, 6]
```

关键点：`map`会跳过稀疏数组的空位，且回调中的`this`可由第二个参数指定。

### 1.2 筛选与归并：`filter` 与 `reduce`

- **`filter`**：返回符合条件的元素组成的新数组。
- **`reduce`**：从左到右累加，可指定初始值。

**手写实现 `myReduce`**：

```javascript
Array.prototype.myReduce = function(callback, initialValue) {
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }
  const array = this;
  let accumulator = initialValue;
  let startIndex = 0;

  // 处理未传初始值的情况
  if (accumulator === undefined) {
    // 找到第一个非空元素作为初始值
    for (let i = 0; i < array.length; i++) {
      if (i in array) {
        accumulator = array[i];
        startIndex = i + 1;
        break;
      }
    }
    if (startIndex === 0) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
  }

  for (let i = startIndex; i < array.length; i++) {
    if (i in array) {
      accumulator = callback(accumulator, array[i], i, array);
    }
  }
  return accumulator;
};

// 测试
console.log([1, 2, 3].myReduce((acc, cur) => acc + cur, 0)); // 6
console.log([1, 2, 3].myReduce((acc, cur) => acc + cur)); // 6
```

`reduce`是很多高阶函数的底层，比如`flat`、`groupBy`都能用`reduce`实现。

### 1.3 查找与判断：`find`、`some`、`every`

- **`find`**：返回第一个满足条件的元素，否则`undefined`。
- **`some`**：只要有一个满足条件就返回`true`。
- **`every`**：所有元素满足条件才返回`true`。

**手写实现 `myFind`**：

```javascript
Array.prototype.myFind = function(callback, thisArg) {
  for (let i = 0; i < this.length; i++) {
    if (i in this && callback.call(thisArg, this[i], i, this)) {
      return this[i];
    }
  }
  return undefined;
};

// 测试
console.log([5, 12, 8, 130, 44].myFind(element => element > 10)); // 12
```

## 二、数组扁平化：从递归到一行代码

数组扁平化是将嵌套的多维数组转换为一维数组的过程。比如 `[1, [2, [3, 4]]]` 变成 `[1, 2, 3, 4]`。下面介绍6种实现方式，从基础到进阶。

### 2.1 递归 + `concat`

最直观的思路：遍历数组，如果元素是数组则递归展开，否则直接收集。

```javascript
function flatten1(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flatten1(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}

console.log(flatten1([1, [2, [3, 4]]])); // [1, 2, 3, 4]
```

### 2.2 `reduce` + 递归

利用`reduce`的累加特性，代码更简洁。

```javascript
function flatten2(arr) {
  return arr.reduce((acc, cur) => {
    return acc.concat(Array.isArray(cur) ? flatten2(cur) : cur);
  }, []);
}

console.log(flatten2([1, [2, [3, 4]]])); // [1, 2, 3, 4]
```

### 2.3 扩展运算符 + `some` + `concat`

核心思想：只要数组中还有嵌套数组，就用扩展运算符展开一层，直到全部展开。

```javascript
function flatten3(arr) {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}

console.log(flatten3([1, [2, [3, 4]]])); // [1, 2, 3, 4]
```

### 2.4 `flat()` 方法

ES2019原生方法，指定深度参数（默认1）。

```javascript
function flatten4(arr) {
  // Infinity 表示任意深度
  return arr.flat(Infinity);
}

console.log(flatten4([1, [2, [3, 4]]])); // [1, 2, 3, 4]
```

### 2.5 栈思想（迭代）

利用栈结构手动模拟递归，避免调用栈溢出。

```javascript
function flatten5(arr) {
  const stack = [...arr];
  const result = [];
  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) {
      stack.push(...item); // 把数组展开后重新入栈
    } else {
      result.push(item);
    }
  }
  return result.reverse(); // 因为pop是从后往前，需要反转
}

console.log(flatten5([1, [2, [3, 4]]])); // [1, 2, 3, 4]
```

### 2.6 `toString` 方法（仅适用于纯数字数组）

利用数组的`toString()`会自动展开嵌套的特性，但会丢失类型信息。

```javascript
function flatten6(arr) {
  return arr.toString().split(',').map(Number);
}

console.log(flatten6([1, [2, [3, 4]]])); // [1, 2, 3, 4]
// 注意：如果数组包含字符串或对象，结果可能不符合预期
console.log(flatten6([1, ['a', [3]]])); // [1, NaN, 3]
```

**总结**：推荐掌握`reduce + 递归`和`扩展运算符 + some`这两种手写方式，面试中既能展示递归思维，又能体现对ES6特性的熟悉。

## 三、字符串常用方法及手写实现

字符串方法大多返回新字符串，不会改变原字符串。我们挑几个高频且容易混淆的方法深入。

### 3.1 截取：`slice`、`substring`、`substr`

- **`slice(start, end)`**：从`start`到`end`（不含），支持负数。
- **`substring(start, end)`**：与`slice`类似，但负数会被当作0，且会自动交换参数。
- **`substr(start, length)`**：已废弃，不推荐。

**手写实现 `mySlice`**：

```javascript
String.prototype.mySlice = function(start, end) {
  const len = this.length;
  // 处理负数
  start = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
  end = end === undefined ? len : (end < 0 ? Math.max(len + end, 0) : Math.min(end, len));
  
  let result = '';
  for (let i = start; i < end; i++) {
    result += this[i];
  }
  return result;
};

console.log('Hello World'.mySlice(0, 5)); // 'Hello'
console.log('Hello World'.mySlice(-6));   // 'World'
```

### 3.2 查找：`indexOf`、`includes`、`startsWith`

- **`indexOf`**：返回子串首次出现的位置，找不到返回-1。
- **`includes`**：ES6新增，返回布尔值。
- **`startsWith`**：判断是否以指定子串开头。

**手写实现 `myIndexOf`**：

```javascript
String.prototype.myIndexOf = function(searchString, position = 0) {
  const str = this;
  const len = str.length;
  const searchLen = searchString.length;
  
  // 边界处理
  if (searchLen === 0) return 0;
  if (position >= len) return -1;
  
  // 从position开始逐字符匹配
  for (let i = position; i <= len - searchLen; i++) {
    let match = true;
    for (let j = 0; j < searchLen; j++) {
      if (str[i + j] !== searchString[j]) {
        match = false;
        break;
      }
    }
    if (match) return i;
  }
  return -1;
};

console.log('Hello World'.myIndexOf('World')); // 6
console.log('Hello World'.myIndexOf('world')); // -1（大小写敏感）
```

### 3.3 正则相关：`match`、`replace`、`split`

这些方法结合正则表达式能实现复杂的文本处理。

**手写实现 `myReplace`（简单版，不支持正则）**：

```javascript
String.prototype.myReplace = function(searchValue, replaceValue) {
  const str = this;
  const index = str.indexOf(searchValue);
  if (index === -1) return str;
  return str.slice(0, index) + replaceValue + str.slice(index + searchValue.length);
};

console.log('I love JavaScript'.myReplace('JavaScript', 'Python')); // 'I love Python'
```

实际`replace`支持正则和函数回调，这里仅演示核心逻辑。

## 总结

本文从数组和字符串的常用方法出发，不仅讲解了用法，还带你手写了核心实现。重点攻克了数组扁平化的6种方案，从递归到迭代，从原生`flat`到奇技淫巧的`toString`。掌握这些内容，你能更自信地处理日常开发中的数据处理问题，也能在面试中从容回答“请手写一个数组扁平化函数”这类经典问题。

**核心要点回顾**：
1. **数组方法**：区分是否改变原数组，理解`reduce`的累加器思想。
2. **数组扁平化**：推荐掌握`reduce + 递归`和`扩展运算符 + some`两种手写方式。
3. **字符串方法**：注意`slice`和`substring`的参数差异，手写实现能加深对边界条件的理解。

最后，建议你打开浏览器控制台，亲手敲一遍这些手写实现，只有真正动手，才能内化为自己的知识。