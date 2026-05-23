---
slug: "prompt-engineering-patterns"
title: "真正有效的 Prompt Engineering 模式"
date: "2026-04-15"
category: "人工智能"
tags: ["Prompt Engineering", "LLM", "GPT", "最佳实践"]
excerpt: "经过实战检验的 Prompt Engineering 模式集合 —— 从思维链到思维树，以及更高阶的技巧。"
coverImage: "/images/blog/placeholder-cover.svg"
readingTime: 9
featured: false
---

## Prompt Engineering 的崛起

Prompt Engineering 已经从简单的"系统提示词"演变为一门精密的学科。以下是一些经过大量实验验证、持续产出更好结果的模式。

## 思维链提示（Chain-of-Thought）

最简单也最有效的技巧：

```text
问：商店有 15 个苹果。卖出 4 个，又收到 10 个新货。
还剩多少个苹果？让我们一步步思考：
1. 初始有 15 个苹果
2. 卖出 4 个 → 15 - 4 = 11 个
3. 收到 10 个 → 11 + 10 = 21 个
答案：21 个
```

## 少样本学习（Few-Shot）

在提问题之前先提供示例：

```text
任务：判断以下电影评论的情感倾向。

评论："太棒了，每一分钟都令人享受"
情感：正面

评论："浪费时间，演技糟糕"
情感：负面

评论："还行吧，没什么特别的"
情感：中性

评论："摄影手法堪称绝妙"
情感：
```

> [!note] 核心洞察
> 少样本示例在多样化且包含边界情况时效果最佳，而不仅仅是最常见的场景。

## 角色扮演式提示

赋予模型特定角色能显著提升输出质量：

- "你是一位资深 Python 开发者..."
- "请以用户体验研究员的身份进行用户访谈..."
- "你是一名技术编辑，正在审阅文档..."

## 总结

最优秀的 Prompt 工程师将提示词设计视为一个迭代设计过程，而非一次性任务。不断测试、优化和衡量。
