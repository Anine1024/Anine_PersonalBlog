import { CONFIG, TAG_TO_CATEGORY } from './config';

interface SourceArticle {
  title: string;
  brief: string;
  url: string;
  tags: string[];
  author: string;
}

export async function formatWithLLM(
  topicTitle: string,
  techTags: string[],
  sources: SourceArticle[],
  apiKey: string,
): Promise<string> {
  if (!apiKey) {
    return formatFallback(topicTitle, techTags, sources);
  }

  const sourceText = sources
    .map((s, i) => `${i + 1}. [${s.title}](${s.url}) — ${s.brief}`)
    .join('\n');

  const systemPrompt = `你是一个技术博客写手。根据参考文章摘要，撰写一篇原创技术文章。

必须严格遵守以下格式：
1. 开头必须包含 YAML frontmatter（用 --- 包裹），包含以下字段：
   title: "文章标题"
   date: "${new Date().toISOString().split('T')[0]}"
   category: "${inferCategory(techTags)}"
   tags: [${techTags.map((t) => `"${t}"`).join(', ')}]
   excerpt: "一句话文章摘要"
   readingTime: 8
   featured: false
2. 文章结构：引言 → 核心段落（带 ## 小标题，至少3个） → 总结
3. 语言专业但易读，适合中级开发者
4. 每个核心段落包含代码示例
5. 不要逐字搬运原文，融会贯通后重写
6. 字数 2000-4000`;

  const userPrompt = `文章标题：${topicTitle}
技术栈：${techTags.join(', ')}
参考文章摘要：
${sourceText}

请生成一篇原创技术文章。`;

  try {
    const resp = await fetch(`${CONFIG.deepseekBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 8192,
      }),
    });

    if (!resp.ok) {
      console.log(`  ⚠ LLM API error (${resp.status}), using fallback formatter`);
      return formatFallback(topicTitle, techTags, sources);
    }

    const json = await resp.json() as any;
    return json.choices?.[0]?.message?.content || formatFallback(topicTitle, techTags, sources);
  } catch {
    console.log('  ⚠ LLM unavailable, using fallback formatter');
    return formatFallback(topicTitle, techTags, sources);
  }
}

/** Fallback: assemble article without LLM */
function formatFallback(
  topicTitle: string,
  techTags: string[],
  sources: SourceArticle[],
): string {
  const slug = topicTitle
    .toLowerCase()
    .replace(/[^\w\s一-鿿-]/g, '')
    .replace(/\s+/g, '-');

  const today = new Date().toISOString().split('T')[0];
  const category = inferCategory(techTags);
  const readingTime = Math.max(5, Math.ceil(sources.length * 1.5));

  const frontmatter = `---
slug: "${slug}"
title: "${topicTitle}"
date: "${today}"
category: "${category}"
tags: [${techTags.map((t) => `"${t}"`).join(', ')}]
excerpt: "${topicTitle} —— 综合多篇技术文章整理，涵盖 ${techTags.join('、')} 等方向的深入分析与实践总结。"
readingTime: ${readingTime}
featured: false
---`;

  const body = sources
    .map((s, i) => {
      return `
## ${s.title}

${s.brief || '暂无摘要'}

> 原文链接：[${s.author || '未知作者'} - 掘金](${s.url})
`;
    })
    .join('\n');

  return `${frontmatter}

## 引言

本文围绕 **${topicTitle}** 展开，综合了 ${sources.length} 篇掘金社区优质文章的核心理念，结合 ${techTags.join('、')} 等技术栈的实际应用，进行了系统性的整理与分析。

${body}

## 总结

以上内容整理自掘金社区相关文章，涵盖了 ${topicTitle} 领域的关键知识点。建议读者通过原文链接深入阅读原文以获得更完整的上下文。
`;
}

function inferCategory(tags: string[]): string {
  for (const tag of tags) {
    const lower = tag.toLowerCase();
    if (TAG_TO_CATEGORY[lower]) return TAG_TO_CATEGORY[lower];
  }
  return '前端开发';
}
