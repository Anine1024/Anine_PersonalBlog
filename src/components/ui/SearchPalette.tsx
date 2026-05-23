import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import { cn } from '@/lib/utils';

export function SearchPalette() {
  const { isOpen, query, results, close, onQueryChange } = useSearch();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedRef = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      selectedRef.current = 0;
    }
  }, [isOpen]);

  const select = useCallback(
    (slug: string) => {
      close();
      navigate(`/blog/${slug}`);
    },
    [close, navigate],
  );

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedRef.current = Math.min(selectedRef.current + 1, results.length - 1);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedRef.current = Math.max(selectedRef.current - 1, 0);
      }
      if (e.key === 'Enter' && results[selectedRef.current]) {
        select(results[selectedRef.current].item.slug);
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, results, select]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg mx-4 bg-bg-secondary border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 border-b border-border">
              <Search size={16} className="text-text-secondary shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search articles..."
                className="flex-1 py-3.5 bg-transparent text-text-primary placeholder-text-secondary text-sm outline-none"
              />
              <kbd className="text-xs px-1.5 py-0.5 rounded bg-bg-card text-text-secondary">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 && query && (
                <p className="text-text-secondary text-sm text-center py-8">
                  No results found.
                </p>
              )}
              {results.length === 0 && !query && (
                <p className="text-text-secondary text-sm text-center py-8">
                  Type to search articles...
                </p>
              )}
              {results.map((r, i) => (
                <button
                  key={r.item.slug}
                  onClick={() => select(r.item.slug)}
                  className={cn(
                    'w-full text-left p-3 rounded-xl flex items-start gap-3 transition-colors',
                    i === selectedRef.current
                      ? 'bg-accent-purple/10'
                      : 'hover:bg-bg-card',
                  )}
                >
                  <FileText size={16} className="text-text-secondary mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {r.item.title}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">
                      {r.item.excerpt}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-medium uppercase text-accent-purple-light">
                      {r.item.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
