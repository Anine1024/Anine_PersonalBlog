import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface CategorySidebarProps {
  categories: Category[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export function CategorySidebar({ categories, activeCategory, onCategoryChange }: CategorySidebarProps) {
  return (
    <div className="lg:sticky lg:top-[100px]">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4">
        分类
      </h4>
      <nav className="space-y-1">
        <button
          onClick={() => onCategoryChange(null)}
          className={cn(
            'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            activeCategory === null
              ? 'bg-accent-purple/10 text-accent-purple-light'
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-card',
          )}
        >
          全部文章
          <span className="float-right text-xs text-text-secondary">
            {categories.reduce((sum, c) => sum + c.count, 0)}
          </span>
        </button>
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => onCategoryChange(cat.name)}
            className={cn(
              'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              activeCategory === cat.name
                ? 'bg-accent-purple/10 text-accent-purple-light'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-card',
            )}
          >
            {cat.name}
            <span className="float-right text-xs text-text-secondary">
              {cat.count}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
