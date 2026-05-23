import type { ContentData } from '@/types';

let cachedData: ContentData | null = null;

export async function loadContent(): Promise<ContentData> {
  if (cachedData) return cachedData;

  try {
    const module = await import('@/generated/content.json');
    cachedData = module.default as ContentData;
    return cachedData;
  } catch {
    return { posts: [], snippets: [], searchIndex: [] };
  }
}

export function getContent(): ContentData {
  return cachedData || { posts: [], snippets: [], searchIndex: [] };
}

export function setContent(data: ContentData) {
  cachedData = data;
}
