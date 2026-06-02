---
slug: "zustand-源码探秘从使用到实现手写一个迷你状态库"
title: "Zustand 源码探秘：从使用到实现，手写一个迷你状态库"
date: "2026-06-02"
category: "前端开发"
tags: ["zustand 原理解析"]
excerpt: "深入解析 Zustand 的核心源码实现，从 create 函数到订阅机制，手写一个迷你版 Zustand，让你彻底理解这个轻量级状态库的工作原理。"
readingTime: 8
featured: false
---

## 引言

在 React 状态管理领域，Zustand 凭借其极简的 API 和出色的性能，迅速成为开发者的新宠。相比 Redux 的繁琐样板代码，Zustand 用不到 1KB 的体积就实现了强大的状态管理能力。但你是否好奇过，这个看似简单的 `create` 函数背后，究竟隐藏着怎样的魔法？

本文将带你深入 Zustand 的源码核心，通过手写实现一个迷你版 Zustand，彻底搞懂它的工作原理。你将发现，原来状态管理库可以如此优雅而简洁。

## Zustand 的核心设计理念

Zustand 的设计哲学可以概括为三个关键词：**轻量**、**直观**、**无侵入**。

### 为什么 Zustand 如此受欢迎？

与 Redux 相比，Zustand 不需要 Provider 包裹、不需要 Action 和 Reducer 的分离、不需要 connect 或 useSelector 等装饰器。你只需要一个 `create` 函数，就能获得一个完整的响应式状态仓库。

```javascript
// Zustand 的使用方式
import { create } from 'zustand'

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))
```

这段代码中，`create` 接收一个函数，该函数接收 `set` 作为参数，返回初始状态和操作方法。生成的 `useStore` 是一个 React Hook，可以直接在组件中使用。

### 核心原理：发布订阅模式

Zustand 的核心是一个**发布-订阅模式**的实现。它维护了一个状态对象和一个监听器列表，当状态发生变化时，通知所有订阅的组件进行更新。

```javascript
// 核心数据结构
{
  state: { count: 0, increment: fn, decrement: fn },
  listeners: new Set(),
  subscribe: (listener) => { /* 添加监听器 */ },
  setState: (partial) => { /* 更新状态并通知 */ },
  getState: () => { /* 返回当前状态 */ },
  destroy: () => { /* 清理所有监听器 */ }
}
```

## 深入源码：create 函数的实现

让我们从 `create` 函数开始，一步步拆解 Zustand 的内部实现。

### 1. 创建仓库实例

Zustand 的 `create` 函数接收一个 `createState` 函数，返回一个 React Hook。其核心实现如下：

```javascript
function create(createState) {
  // 初始状态
  let state
  // 监听器集合
  const listeners = new Set()

  // 获取当前状态
  const getState = () => state

  // 更新状态
  const setState = (partial) => {
    // 支持函数式更新
    const nextState = typeof partial === 'function'
      ? partial(state)
      : partial
    
    // 浅比较，避免不必要的更新
    if (!Object.is(nextState, state)) {
      const previousState = state
      state = Object.assign({}, state, nextState)
      // 通知所有监听器
      listeners.forEach((listener) => listener(state, previousState))
    }
  }

  // 订阅状态变化
  const subscribe = (listener) => {
    listeners.add(listener)
    // 返回取消订阅的函数
    return () => listeners.delete(listener)
  }

  // 销毁仓库
  const destroy = () => {
    listeners.clear()
  }

  // 创建 API 对象
  const api = { setState, getState, subscribe, destroy }

  // 初始化状态，将 set、get、api 注入 createState
  state = createState(setState, getState, api)

  // 返回 React Hook
  return (selector, equalityFn) => {
    // ... 后续实现
  }
}
```

关键点解析：
- `setState` 支持传入对象或函数，函数形式允许基于旧状态计算新状态
- 使用 `Object.is` 进行浅比较，避免不必要的渲染
- `subscribe` 返回取消订阅函数，方便组件卸载时清理

### 2. 集成 React：useSyncExternalStore

在 React 18 中，Zustand 使用了 `useSyncExternalStore` 这个官方 Hook 来连接外部存储和 React 的并发特性。

```javascript
import { useSyncExternalStore, useCallback, useRef } from 'react'

function create(createState) {
  // ... 上面的仓库逻辑

  return (selector = (state) => state, equalityFn = Object.is) => {
    // 使用 useSyncExternalStore 订阅外部存储
    const slice = useSyncExternalStore(
      subscribe,  // 订阅函数
      getState,   // 获取当前快照
    )

    // 使用 useRef 缓存选择器结果
    const previousSliceRef = useRef()
    const currentSlice = selector(slice)

    // 如果选择器结果没有变化，返回缓存的值
    if (!equalityFn(currentSlice, previousSliceRef.current)) {
      previousSliceRef.current = currentSlice
    }

    return previousSliceRef.current
  }
}
```

这里的关键是 `useSyncExternalStore`，它保证了：
- 在 React 并发模式下，状态更新的一致性
- 避免 tearing（撕裂）问题，即不同组件看到不同版本的状态
- 自动处理订阅和取消订阅的生命周期

## 进阶特性：中间件与状态持久化

Zustand 的强大之处还在于它的可扩展性。通过中间件机制，我们可以轻松添加日志、持久化、撤销/重做等功能。

### 1. 中间件实现原理

中间件本质上是一个高阶函数，它接收原始的 `set`、`get`、`api`，返回增强后的版本。

```javascript
// 日志中间件的实现
const logMiddleware = (config) => (set, get, api) => {
  return config(
    (args) => {
      console.log('prev state:', get())
      set(args)
      console.log('next state:', get())
    },
    get,
    api
  )
}

// 使用中间件
const useStore = create(logMiddleware((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
})))
```

### 2. 持久化中间件

持久化中间件允许将状态自动保存到 localStorage 或 sessionStorage：

```javascript
const persistMiddleware = (config, options) => (set, get, api) => {
  const { name, storage = localStorage } = options
  
  // 从存储中恢复状态
  const savedState = storage.getItem(name)
  const initialState = savedState ? JSON.parse(savedState) : {}
  
  return config(
    (args) => {
      set(args)
      // 每次更新后保存到存储
      storage.setItem(name, JSON.stringify(get()))
    },
    get,
    api
  )
}

// 使用持久化中间件
const useStore = create(
  persistMiddleware(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'app-settings' }
  )
)
```

### 3. 自定义中间件

你还可以创建自己的中间件，比如实现撤销功能：

```javascript
const undoMiddleware = (config) => (set, get, api) => {
  const history = []
  const maxHistory = 10
  
  return config(
    (args) => {
      history.push(get())
      if (history.length > maxHistory) {
        history.shift()
      }
      set(args)
    },
    get,
    {
      ...api,
      undo: () => {
        if (history.length > 0) {
          const previousState = history.pop()
          set(previousState)
        }
      },
    }
  )
}
```

## 性能优化：选择性订阅与浅比较

Zustand 的性能优势主要来自两个方面：选择性订阅和浅比较。

### 1. 选择性订阅

通过 `selector` 参数，组件只订阅它关心的状态片段：

```javascript
// 只订阅 count，当其他状态变化时不会重新渲染
const count = useStore((state) => state.count)

// 订阅多个值
const [count, increment] = useStore(
  (state) => [state.count, state.increment],
  shallow  // 使用浅比较避免不必要的渲染
)
```

### 2. 浅比较的实现

默认情况下，Zustand 使用 `Object.is` 进行相等性比较。对于对象类型的 selector 结果，可以使用 `shallow` 函数进行浅比较：

```javascript
function shallow(objA, objB) {
  if (Object.is(objA, objB)) return true
  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) return false
  
  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)
  if (keysA.length !== keysB.length) return false
  
  return keysA.every((key) => Object.is(objA[key], objB[key]))
}
```

## 手写迷你版 Zustand

现在，让我们将所有概念整合起来，实现一个完整的迷你版 Zustand：

```javascript
// mini-zustand.js
import { useSyncExternalStore, useRef } from 'react'

function createStore(createState) {
  let state
  const listeners = new Set()

  const getState = () => state
  const setState = (partial) => {
    const nextState = typeof partial === 'function'
      ? partial(state)
      : partial
    
    if (!Object.is(nextState, state)) {
      const prevState = state
      state = Object.assign({}, state, nextState)
      listeners.forEach((listener) => listener(state, prevState))
    }
  }

  const subscribe = (listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  const destroy = () => listeners.clear()

  const api = { getState, setState, subscribe, destroy }
  state = createState(setState, getState, api)

  return api
}

function useStore(store, selector = (state) => state, equalityFn = Object.is) {
  const state = useSyncExternalStore(store.subscribe, store.getState)
  const prevRef = useRef()
  const selected = selector(state)
  
  if (!equalityFn(selected, prevRef.current)) {
    prevRef.current = selected
  }
  
  return prevRef.current
}

// 使用示例
const store = createStore((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))

// 在组件中使用
function Counter() {
  const count = useStore(store, (state) => state.count)
  const increment = useStore(store, (state) => state.increment)
  
  return <button onClick={increment}>{count}</button>
}
```

## 总结

通过本文的源码分析，我们揭示了 Zustand 的核心原理：

1. **发布订阅模式**：维护状态和监听器列表，状态变化时通知所有订阅者
2. **React 集成**：利用 `useSyncExternalStore` 连接外部状态与 React 渲染
3. **选择性订阅**：通过 selector 函数实现细粒度的组件更新
4. **中间件机制**：通过高阶函数实现功能的灵活扩展
5. **性能优化**：浅比较和引用相等性检查避免不必要的渲染

Zustand 的成功告诉我们，优秀的设计往往是最简单的。它没有引入复杂的概念，而是充分利用了 React 已有的特性和 JavaScript 的原生能力。现在，你已经掌握了它的核心实现，可以更有信心地在项目中运用它，甚至根据需求进行定制和扩展。

下次当你使用 Zustand 时，不妨想想它背后那不到 1KB 的代码是如何优雅地解决状态管理问题的。这就是开源软件的魅力所在。