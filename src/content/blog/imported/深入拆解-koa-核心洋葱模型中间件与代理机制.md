---
slug: "深入拆解-koa-核心洋葱模型中间件与代理机制"
title: "深入拆解 Koa 核心：洋葱模型、中间件与代理机制"
date: "2026-06-02"
category: "前端开发"
tags: ["koa 原理解析"]
excerpt: "从零手写迷你 Koa，剖析洋葱模型、中间件组合与 request/response 代理的核心实现。"
readingTime: 8
featured: false
---

## 引言

Koa 作为 Node.js 生态中轻量级的 Web 框架，凭借其优雅的“洋葱模型”和简洁的 API 设计，俘获了大量开发者的心。相比 Express 的线性中间件处理，Koa 将控制权完全交给开发者，通过 async/await 实现了真正意义上的“请求-响应”全流程控制。

但很多人只停留在“会用”层面——知道 `app.use(fn)` 注册中间件，知道 `ctx.body` 返回响应，却不清楚内部到底如何运作。本文将带你从零手写一个迷你 Koa，拆解其核心三要素：**中间件组合（洋葱模型）**、**上下文（Context）代理**、**请求/响应封装**。

---

## 一、从零搭建 Koa 骨架：HTTP 服务器与上下文

Koa 本质上是对 Node.js 原生 `http` 模块的封装。我们先来看最简用法：

```javascript
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx) => {
  ctx.body = 'Hello Koa';
});

app.listen(3000);
```

这背后发生了什么？核心步骤只有三步：

1. 创建 `http.createServer` 实例。
2. 监听 `request` 事件，将 `req` 和 `res` 封装成 `ctx`。
3. 执行中间件组合。

### 手写迷你版本

```javascript
const http = require('http');

class MiniKoa {
  constructor() {
    this.middlewares = [];
  }

  use(fn) {
    this.middlewares.push(fn);
  }

  listen(...args) {
    const server = http.createServer((req, res) => {
      // 创建上下文
      const ctx = this.createContext(req, res);
      // 执行中间件
      this.handleRequest(ctx);
    });
    server.listen(...args);
  }

  createContext(req, res) {
    const ctx = {
      req,
      res,
      request: req,
      response: res,
    };
    return ctx;
  }

  handleRequest(ctx) {
    // 下一节实现
  }
}
```

这里的关键是 `createContext` 方法，它把原生 `req` 和 `res` 挂载到 `ctx` 上，后续中间件通过 `ctx.req` 和 `ctx.res` 访问原生对象。但 Koa 还做了更聪明的封装——自定义 `request` 和 `response` 对象。

> Koa 的 `request` 和 `response` 对象不是原生 `req/res` 的简单别名，而是经过 getter/setter 包装后的增强对象。我们会在第三节详细讨论。

---

## 二、洋葱模型：中间件组合的艺术

Koa 最迷人的特性就是“洋葱模型”。当一个请求进来，中间件会按照注册顺序依次“向内”执行，遇到 `next()` 就暂停当前中间件，执行下一个中间件，直到最后一个中间件执行完毕，再“向外”依次返回。

### 图示理解

```
请求进入 →
  middleware1 (开始) → next()
    middleware2 (开始) → next()
      middleware3 (开始) → 处理响应 → 返回
    middleware2 (结束) → 返回
  middleware1 (结束) → 返回
响应发出 ←
```

这种模式让前置中间件可以同时处理请求前和响应后的逻辑（比如日志、错误处理、计时）。

### 核心实现：compose 函数

Koa 内部通过 `koa-compose` 包实现中间件组合。原理是递归 + Promise 链：

```javascript
function compose(middlewares) {
  return function (ctx) {
    return dispatch(0);

    function dispatch(i) {
      const fn = middlewares[i];
      if (!fn) return Promise.resolve(); // 边界条件

      try {
        // 关键：将 next 指向下一个 dispatch，并返回 Promise
        return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}
```

### 完整示例

```javascript
class MiniKoa {
  // ... 省略前面代码

  handleRequest(ctx) {
    const composed = compose(this.middlewares);
    composed(ctx).then(() => {
      // 所有中间件执行完毕，发送响应
      ctx.res.end(ctx.body || 'Not Found');
    }).catch((err) => {
      ctx.res.statusCode = 500;
      ctx.res.end(err.message);
    });
  }
}

// 使用
const app = new MiniKoa();

app.use(async (ctx, next) => {
  console.log('1-进入');
  await next();
  console.log('1-离开');
});

app.use(async (ctx, next) => {
  console.log('2-进入');
  await next();
  console.log('2-离开');
});

app.use(async (ctx) => {
  ctx.body = 'Hello from mini koa';
});

app.listen(3000);
// 输出顺序：1-进入 → 2-进入 → 2-离开 → 1-离开
```

> 注意：每个中间件必须 `await next()` 才能进入下一个中间件。如果某个中间件没有调用 `next()`，后续中间件将永远不会执行。

### 错误处理的关键

由于 compose 返回的是 Promise，我们可以通过 `.catch()` 统一捕获任何中间件中抛出的异常。这也是 Koa 官方推荐用 `try/catch` 包裹 `next()` 的原因：

```javascript
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = 500;
    ctx.body = 'Server Error';
  }
});
```

---

## 三、属性代理：优雅的上下文封装

Koa 的 `ctx` 不仅包含 `req` 和 `res`，还提供了大量便捷属性，比如 `ctx.url`、`ctx.method`、`ctx.body` 等。这些属性其实是从 `request` 和 `response` 对象代理过来的。

### 为什么需要代理？

原生 `req` 和 `res` 的方法名比较冗长且分散，例如获取请求方法需要 `req.method`，设置响应状态码需要 `res.statusCode`。Koa 希望开发者只需要操作 `ctx` 一个对象。

### 实现思路

1. 创建自定义 `request` 对象，通过 getter/setter 映射到原生 `req`。
2. 创建自定义 `response` 对象，通过 getter/setter 映射到原生 `res`。
3. 将 `request` 和 `response` 上的属性代理到 `ctx`。

### 手写实现

```javascript
const http = require('http');

class MiniKoa {
  constructor() {
    this.middlewares = [];
  }

  createContext(req, res) {
    const request = {
      get url() { return req.url; },
      get method() { return req.method; },
    };

    const response = {
      _body: '',
      get body() { return this._body; },
      set body(val) { 
        this._body = val;
        res.statusCode = 200; // 设置 body 时默认状态码为 200
      },
    };

    const ctx = {
      req,
      res,
      request,
      response,
    };

    // 属性代理：将 request 和 response 的属性挂载到 ctx
    delegate(ctx, 'request', ['url', 'method']);
    delegate(ctx, 'response', ['body']);

    return ctx;
  }
}

// 简单的代理函数
function delegate(target, source, properties) {
  properties.forEach(prop => {
    Object.defineProperty(target, prop, {
      get() {
        return target[source][prop];
      },
      set(val) {
        target[source][prop] = val;
      },
    });
  });
}
```

现在，开发者可以这样使用：

```javascript
app.use(async (ctx) => {
  console.log(ctx.url);    // 实际读取 ctx.request.url
  ctx.body = 'Hello';      // 实际设置 ctx.response.body
});
```

> 这种代理模式让 Koa 的 API 非常干净。你不需要记住 `ctx.request.url` 还是 `ctx.req.url`，直接 `ctx.url` 即可。

### 扩展：自定义响应格式

Koa 的 `ctx.body` 非常智能，它会根据传入的类型自动设置 `Content-Type`：

```javascript
class MiniKoaResponse {
  set body(val) {
    this._body = val;
    if (typeof val === 'object') {
      this._contentType = 'application/json';
    } else if (typeof val === 'string') {
      this._contentType = 'text/html';
    }
  }

  get body() {
    return this._body;
  }
}
```

在实际的 `handleRequest` 方法中，我们可以根据 `ctx.response._contentType` 设置响应头：

```javascript
handleRequest(ctx) {
  const composed = compose(this.middlewares);
  composed(ctx).then(() => {
    const res = ctx.res;
    const body = ctx.response.body;
    const contentType = ctx.response._contentType || 'text/plain';

    if (body) {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(typeof body === 'object' ? JSON.stringify(body) : body);
    } else {
      res.statusCode = 204;
      res.end();
    }
  });
}
```

---

## 四、中间件中的异步控制：从回调到 async/await

早期的 Express 中间件使用回调函数，容易陷入“回调地狱”。Koa 1 基于 Generator 函数，Koa 2 全面拥抱 async/await，让异步流程变得像同步代码一样直观。

### 为什么 async/await 如此重要？

考虑一个场景：中间件 A 需要等待数据库查询结果后再决定是否继续：

```javascript
// 使用 async/await
app.use(async (ctx, next) => {
  const user = await db.findUser(ctx.query.id);
  if (!user) {
    ctx.status = 404;
    return; // 直接返回，不执行后续中间件
  }
  ctx.user = user;
  await next();
});
```

如果没有 async/await，我们需要手动处理 Promise 链，代码会变得支离破碎。

### compose 中的 await 链

回顾我们之前实现的 compose 函数，它返回的是一个 Promise 链。当中间件 `await next()` 时，实际上是在等待 `dispatch(i+1)` 返回的 Promise 完成。这个 Promise 的完成时机，就是后续所有中间件执行完毕的时刻。

```javascript
// 关键代码
return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)));
```

`fn` 执行后返回的值（可能是 Promise 或普通值）会被包裹成 Promise。如果中间件里写了 `await next()`，那么当前中间件会暂停，直到 `dispatch(i+1)` 返回的 Promise 决议。

### 边界情况处理

1. **中间件不调用 next()**：后续中间件永远不会执行，compose 会立即 resolve 当前 Promise。
2. **中间件抛出异常**：Promise 链会 reject，被外层 `.catch()` 捕获。
3. **中间件返回非 Promise**：`Promise.resolve()` 会将其包装成 Promise，不影响流程。

---

## 总结

通过本文的拆解，我们完成了从零到一的迷你 Koa 实现。回顾核心要点：

1. **HTTP 服务器**：Koa 是对 `http.createServer` 的封装，通过 `listen` 方法启动。
2. **洋葱模型**：通过 `compose` 函数将中间件组合成递归 Promise 链，实现“请求-响应”的全流程控制。
3. **上下文代理**：自定义 `request` 和 `response` 对象，通过 getter/setter 代理到 `ctx`，提供简洁统一的 API。
4. **异步控制**：async/await 让中间件可以优雅地处理异步操作，`await next()` 成为控制流的枢纽。

掌握了这些原理，你不仅能更好地使用 Koa，还能在遇到复杂场景时（比如自定义中间件、错误处理、性能优化）游刃有余。Koa 的设计哲学——**小而美、可扩展**——正是通过这几个核心机制实现的。

如果你对 Koa 的某个细节还有疑问，比如如何实现路由匹配、静态文件服务，欢迎在评论区留言讨论。