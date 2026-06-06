---
slug: "understanding-react-server-components"
title: "深入理解 React Server Components（2026 版）"
date: "2026-05-10"
category: "前端开发"
tags: ["React", "Next.js", "RSC", "TypeScript"]
excerpt: "深入解析 React Server Components —— 它是什么、为什么重要，以及如何在你的应用中高效使用。"
readingTime: 10
featured: true
---

## 什么是 Server Components？

React Server Components（RSC）代表了 React 应用构建方式的根本性转变。它允许组件仅在服务端运行，只将渲染结果发送到客户端。

## RSC 解决了什么问题？

传统的 React 应用会将所有组件代码打包发送到浏览器，即使是纯数据获取型的组件也不例外。这意味着：

- JavaScript 包体积更大
- 页面加载更慢
- 数据获取产生瀑布式请求

## 服务端组件 vs 客户端组件

```tsx
// 服务端组件（App Router 中的默认模式）
async function BlogList() {
  const posts = await db.post.findMany();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

// 客户端组件（需要 'use client' 指令）
'use client';
import { useState } from 'react';

export function LikeButton() {
  const [liked, setLiked] = useState(false);
  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? '❤️' : '🤍'}
    </button>
  );
}
```

## 数据获取模式

使用 RSC 后，你可以在组件中直接获取数据：

```tsx
async function UserProfile({ userId }: { userId: string }) {
  const user = await fetch(`https://api.example.com/users/${userId}`);
  const data = await user.json();

  return <div>{data.name}</div>;
}
```

> [!note] 注意
> 服务端组件不能使用 Hooks、事件处理器或浏览器 API。交互式功能请使用客户端组件。

## 性能提升

关键指标对比：

| 指标 | 未使用 RSC | 使用 RSC | 提升幅度 |
|------|-----------|----------|---------|
| JS 包体积 | 245 KB | 89 KB | 减少 64% |
| 首次内容绘制 | 2.1s | 1.2s | 提升 43% |
| 可交互时间 | 3.8s | 2.1s | 提升 45% |

## 总结

React Server Components 不仅仅是一种性能优化手段 —— 它是构建 React 应用的新思维模型。先从识别哪些组件可以放在服务端开始，逐步引入这一模式。
