import Fuse from 'fuse.js';
import type { SearchIndexEntry } from '@/types';

let fuseInstance: Fuse<SearchIndexEntry> | null = null;

export function initSearch(index: SearchIndexEntry[]) {
  fuseInstance = new Fuse(index, {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'tags', weight: 0.3 },
      { name: 'excerpt', weight: 0.2 },
      { name: 'category', weight: 0.1 },
    ],
    threshold: 0.4,
    includeScore: true,
  });
}

export function search(query: string) {
  if (!fuseInstance) return [];
  if (!query.trim()) return [];
  return fuseInstance.search(query).slice(0, 8);
}
