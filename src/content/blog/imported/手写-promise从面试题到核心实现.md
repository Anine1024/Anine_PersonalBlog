---
slug: "手写-promise从面试题到核心实现"
title: "手写 Promise：从面试题到核心实现"
date: "2026-06-02"
category: "前端开发"
tags: ["promise"]
excerpt: "通过分析经典面试题，深入拆解 Promise 的核心原理，并手写一个符合 Promises/A+ 规范的 Promise 实现，帮助你彻底掌握异步编程。"
readingTime: 8
featured: false
---

## 引言

在 JavaScript 异步编程中，Promise 几乎成了每个开发者绕不开的核心概念。无论是日常开发中的异步请求，还是面试中的手写题，Promise 都占据着重要地位。然而，许多人对 Promise 的理解停留在“会用”层面，一旦遇到复杂的嵌套、微任务顺序或并发控制，就容易陷入困惑。

比如下面这道面试题，曾让不少人失眠：

```javascript
Promise.resolve().then(() => {
  console.log(0);
  return Promise.resolve(4);
}).then((res) => {
  console.log(res);
});

Promise.resolve().then(() => {
  console.log(1);
}).then(() => {
  console.log(2);
}).then(() => {
  console.log(3);
}).then(() => {
  console.log(5);
});
```

输出结果是 `0, 1, 2, 3, 4, 5` —— 等等，为什么 `4` 会跑到 `3` 后面？这背后隐藏着 Promise 实现的深层细节。

本文将从这道题出发，带你手写一个符合 Promises/A+ 规范的 Promise，并深入分析其核心原理。

## 一、Promise 基础结构与状态机

### 1.1 为什么需要手写 Promise？

手写 Promise 不是为了重复造轮子，而是为了理解其内部机制。当面试官问“你能手写一个 Promise 吗”时，他真正想考察的是：你是否理解异步、回调、状态机、微任务、链式调用等底层概念。

一个标准的 Promise 对象具有三种状态：

- **Pending（等待态）**：初始状态，可以转变为 fulfilled 或 rejected。
- **Fulfilled（成功态）**：操作成功完成，不可再变。
- **Rejected（失败态）**：操作失败，不可再变。

一旦状态改变，就不会再变。这是 Promise 设计的核心原则。

### 1.2 基础结构代码

我们先定义一个基础的构造函数，并实现状态管理：

```javascript
const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

class MyPromise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;      // 成功时的值
    this.reason = undefined;     // 失败时的原因
    this.onFulfilledCallbacks = []; // 存储成功的回调
    this.onRejectedCallbacks = [];  // 存储失败的回调

    const resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        // 依次执行所有成功回调
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };

    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
}
```

这里的关键是：状态一旦改变，就不能再回退。同时，我们使用两个数组来存储回调，以支持 `then` 方法的多次调用。

## 二、实现 then 方法：链式调用的核心

### 2.1 基本 then 实现

`then` 方法接收两个参数：`onFulfilled` 和 `onRejected`，并返回一个新的 Promise。这是链式调用的基础。

```javascript
then(onFulfilled, onRejected) {
  // 参数可选，若不是函数则透传值
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
  onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

  const promise2 = new MyPromise((resolve, reject) => {
    if (this.status === FULFILLED) {
      // 注意：这里需要用 setTimeout 模拟微任务，但实际 Promise 使用微任务队列
      // 为了简化，我们用 queueMicrotask 或 Promise.resolve().then
      setTimeout(() => {
        try {
          const x = onFulfilled(this.value);
          resolvePromise(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }, 0);
    } else if (this.status === REJECTED) {
      setTimeout(() => {
        try {
          const x = onRejected(this.reason);
          resolvePromise(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }, 0);
    } else if (this.status === PENDING) {
      this.onFulfilledCallbacks.push(() => {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      });
      this.onRejectedCallbacks.push(() => {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      });
    }
  });

  return promise2;
}
```

### 2.2 resolvePromise：处理返回值的核心

`resolvePromise` 函数负责处理 `then` 回调返回的值 `x`。如果 `x` 是一个 Promise，则需要等待它完成；如果 `x` 是 thenable 对象，则需要提取它的 `then` 方法；否则直接 resolve。

```javascript
function resolvePromise(promise2, x, resolve, reject) {
  // 防止循环引用：如果 promise2 和 x 是同一个对象，则报错
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise'));
  }

  // 如果 x 是 MyPromise 实例
  if (x instanceof MyPromise) {
    // 等待 x 的状态改变
    x.then(resolve, reject);
  } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    // 可能是 thenable 对象
    let then;
    try {
      then = x.then;
    } catch (e) {
      return reject(e);
    }

    if (typeof then === 'function') {
      let called = false; // 防止多次调用
      try {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            // 递归处理，直到 x 不是 Promise
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } catch (e) {
        if (called) return;
        reject(e);
      }
    } else {
      // 普通对象，直接 resolve
      resolve(x);
    }
  } else {
    // 原始值，直接 resolve
    resolve(x);
  }
}
```

这个函数是 Promise 实现中最复杂的部分之一。它需要处理各种边界情况，包括循环引用、thenable 对象、多次调用等。

### 2.3 再探开头的面试题

有了上面的实现，我们就能理解为什么 `4` 会跑到 `3` 后面了。关键点在于 `return Promise.resolve(4)` 时，`resolvePromise` 会检测到返回值是一个 Promise，于是会 `x.then(resolve, reject)`，这实际上创建了一个新的微任务。而 `console.log(3)` 所在的链已经是第二个微任务了，所以 `4` 的 resolve 被放到了更后面的微任务队列中。

## 三、静态方法与并发控制

### 3.1 Promise.resolve 和 Promise.reject

这两个静态方法用于快速创建已成功或已失败的 Promise。

```javascript
static resolve(value) {
  if (value instanceof MyPromise) {
    return value;
  }
  return new MyPromise((resolve) => {
    resolve(value);
  });
}

static reject(reason) {
  return new MyPromise((_, reject) => {
    reject(reason);
  });
}
```

注意：`Promise.resolve` 如果接收一个 Promise，会直接返回它；如果接收一个 thenable，会将其转换为 Promise。

### 3.2 Promise.all：并发控制

`Promise.all` 接收一个可迭代对象，返回一个新的 Promise。只有当所有 Promise 都成功时，才 resolve；任何一个失败，则 reject。

```javascript
static all(promises) {
  return new MyPromise((resolve, reject) => {
    let result = [];
    let count = 0;
    let total = promises.length;

    if (total === 0) {
      resolve(result);
      return;
    }

    promises.forEach((p, index) => {
      // 确保 p 是 Promise 对象
      MyPromise.resolve(p).then(
        (value) => {
          result[index] = value;
          count++;
          if (count === total) {
            resolve(result);
          }
        },
        (reason) => {
          reject(reason);
        }
      );
    });
  });
}
```

### 3.3 控制并发数量

面试中常问：如果有 100 个请求，如何控制并发数？我们可以实现一个 `limit` 函数：

```javascript
function limitConcurrency(tasks, limit) {
  return new Promise((resolve, reject) => {
    let index = 0;
    let active = 0;
    let results = [];
    let completed = 0;
    const total = tasks.length;

    function next() {
      if (completed === total) {
        resolve(results);
        return;
      }

      while (active < limit && index < total) {
        const i = index;
        const task = tasks[index++];
        active++;

        Promise.resolve(task()).then(
          (value) => {
            results[i] = value;
            active--;
            completed++;
            next();
          },
          (error) => {
            reject(error);
          }
        );
      }
    }

    next();
  });
}

// 使用示例
const tasks = Array.from({ length: 100 }, (_, i) => () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(i), Math.random() * 1000);
  });
});

limitConcurrency(tasks, 5).then(console.log);
```

这个实现的核心是维护一个“活动请求数”计数器，每次启动新任务前检查是否达到上限。当某个任务完成时，立即启动下一个。

## 总结

手写 Promise 不仅是面试必备技能，更是深入理解 JavaScript 异步编程的绝佳途径。通过本文，我们：

1. **实现了 Promise 的状态机**：`PENDING` → `FULFILLED` / `REJECTED`，状态一旦改变不可逆。
2. **实现了链式调用的核心 `then` 方法**：返回新的 Promise，并通过 `resolvePromise` 处理各种返回值。
3. **理解了微任务与面试题**：当 `then` 返回一个 Promise 时，会额外插入一层微任务，导致输出顺序的“反常”现象。
4. **实现了静态方法和并发控制**：`resolve`、`reject`、`all` 以及自定义的并发限制函数。

当然，我们的实现做了简化（如使用 `setTimeout` 代替真正的微任务），但核心逻辑与 Promises/A+ 规范一致。如果你想深入 V8 源码，可以进一步研究其微任务队列的实现细节。

最后，记住 Promise 的核心哲学：**状态不可逆、链式调用、异步回调扁平化**。掌握了这些，你就能从容应对任何 Promise 面试题了。