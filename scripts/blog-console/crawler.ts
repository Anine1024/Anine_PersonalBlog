import axios from 'axios';

interface JuejinArticle {
  title: string;
  brief: string;
  url: string;
  tags: string[];
  author: string;
  likes: number;
}

// Generate broader search queries from title + tags
function buildQueries(title: string, tags: string[]): string[] {
  const queries: string[] = [];

  // Full title as one query (trim quotes and special chars)
  const cleanTitle = title.replace(/[《》""'']/g, ' ').replace(/\s+/g, ' ').trim();
  queries.push(cleanTitle);

  // Tag combinations
  if (tags.length >= 2) {
    queries.push(tags.slice(0, 2).join(' '));
  }
  if (tags.length >= 3) {
    queries.push(tags.slice(0, 3).join(' '));
  }

  // Each individual tag
  for (const tag of tags) {
    if (!queries.includes(tag)) {
      queries.push(tag);
    }
  }

  return [...new Set(queries)].slice(0, 6);
}

export async function crawlJuejin(
  title: string,
  tags: string[],
  count = 8,
): Promise<JuejinArticle[]> {
  const queries = buildQueries(title, tags);
  const allResults: JuejinArticle[] = [];
  const seen = new Set<string>();

  for (const query of queries) {
    try {
      const results = await searchJuejin(query);
      for (const r of results) {
        const key = r.url;
        if (!seen.has(key) && r.title) {
          seen.add(key);
          allResults.push(r);
        }
      }
    } catch {
      // Continue with next query
    }
  }

  // Sort by likes, return top results
  return allResults
    .sort((a, b) => b.likes - a.likes)
    .slice(0, count);
}

async function searchJuejin(query: string): Promise<JuejinArticle[]> {
  const results: JuejinArticle[] = [];

  // Approach 1: Juejin search suggest API (more lenient)
  try {
    const resp = await axios.get('https://api.juejin.cn/search_api/v1/search', {
      params: {
        query,
        limit: 10,
        offset: 0,
        sort_type: 0,
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://juejin.cn/',
        'Accept': 'application/json',
      },
      timeout: 8000,
    });

    const data = resp.data;
    if (data?.err_no === 0 && data?.data) {
      for (const item of data.data) {
        const entry = item.result_model || item.result || item;
        const info = entry?.article_info || entry?.article || entry;

        if (!info?.article_id) continue;
        if (!info?.title || info.title.length < 4) continue;

        results.push({
          title: String(info.title || '').replace(/<[^>]*>/g, ''),
          brief: String(info.brief_content || '').replace(/<[^>]*>/g, '').slice(0, 200),
          url: `https://juejin.cn/post/${info.article_id}`,
          tags: (info.tags || []).map((t: any) => t.tag_name || t.name || String(t)),
          author: info.author_user_info?.user_name || '',
          likes: info.digg_count || info.collect_count || 0,
        });
      }
    }
  } catch {
    // Fall through to web scraping
  }

  // Approach 2: Web page scraping fallback
  if (results.length === 0) {
    try {
      const encodedQuery = encodeURIComponent(query);
      const resp = await axios.get(
        `https://juejin.cn/search?query=${encodedQuery}&type=0`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html',
          },
          timeout: 8000,
        },
      );

      const html: string = resp.data;

      // Try to find __NEXT_DATA__ or embedded JSON
      const jsonMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
      if (jsonMatch) {
        try {
          const json = JSON.parse(jsonMatch[1]);
          const posts = json?.props?.initialState?.search?.result?.data || [];
          for (const item of posts) {
            const info = item?.result_model || item?.result || item;
            if (!info?.article_id || !info?.article_info?.title) continue;
            results.push({
              title: String(info.article_info.title).replace(/<[^>]*>/g, ''),
              brief: String(info.article_info.brief_content || '').replace(/<[^>]*>/g, '').slice(0, 200),
              url: `https://juejin.cn/post/${info.article_id}`,
              tags: [],
              author: info.author_user_info?.user_name || '',
              likes: info.article_info?.digg_count || 0,
            });
          }
        } catch {
          // JSON parse failed
        }
      }
    } catch {
      // Both approaches failed for this query
    }
  }

  return results;
}
