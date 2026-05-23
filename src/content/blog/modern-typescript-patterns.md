---
slug: "modern-typescript-patterns"
title: "2026 年现代 TypeScript 设计模式"
date: "2026-03-20"
category: "前端开发"
tags: ["TypeScript", "JavaScript", "设计模式", "类型系统"]
excerpt: "探索高级 TypeScript 模式：模板字面量类型、可辨识联合类型与构建器模式的实战应用。"
coverImage: "/images/blog/placeholder-cover.svg"
readingTime: 6
featured: false
---

## TypeScript 的进化

2026 年的 TypeScript 比几年前强大得多。让我们探索一些能充分利用类型系统的设计模式。

## 模板字面量类型

```typescript
type EventName = 'click' | 'focus' | 'blur';
type Handler = `on${Capitalize<EventName>}`;
// 结果: "onClick" | "onFocus" | "onBlur"

type CSSProperty = `--${string}`;
const prop: CSSProperty = '--color-primary'; // ✅ 通过
const bad: CSSProperty = 'color'; // ❌ 报错
```

## 可辨识联合类型

建模状态的标准方案：

```typescript
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function renderState<T>(state: RequestState<T>) {
  switch (state.status) {
    case 'idle':
      return <Placeholder />;
    case 'loading':
      return <Spinner />;
    case 'success':
      return <Data data={state.data} />; // ✅ 类型安全
    case 'error':
      return <ErrorMessage error={state.error} />; // ✅ 类型安全
  }
}
```

## 构建器模式

```typescript
class QueryBuilder<T extends Record<string, unknown>> {
  private filters: Partial<T> = {};

  where<K extends keyof T>(key: K, value: T[K]): this {
    this.filters[key] = value;
    return this;
  }

  build() {
    return { ...this.filters };
  }
}
```

> [!tip] 类型安全优先
> 始终优先使用可辨识联合类型而非可选属性。它们能让"不可能的状态"在编译期就被杜绝。

## 总结

TypeScript 的类型系统本身就是一门编程语言。投入时间学习这些模式，会在代码质量和开发体验上获得丰厚回报。
