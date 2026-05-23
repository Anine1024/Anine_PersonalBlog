import { useState, useEffect, useCallback } from 'react';
import { search } from '@/lib/search';

export function useSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ReturnType<typeof search>>([]);

  const open = useCallback(() => {
    setIsOpen(true);
    setQuery('');
    setResults([]);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
  }, []);

  const onQueryChange = useCallback((q: string) => {
    setQuery(q);
    setResults(search(q));
  }, []);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        open();
      }
      if (e.key === 'Escape') {
        close();
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, close]);

  return { isOpen, query, results, open, close, onQueryChange };
}
