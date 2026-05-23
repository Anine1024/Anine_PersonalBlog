import { cn } from '@/lib/utils';
import { useTableOfContents } from '@/hooks/useTableOfContents';
import type { PostHeading } from '@/types';

interface TableOfContentsProps {
  headings: PostHeading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const headingIds = headings.map((h) => h.id);
  const activeId = useTableOfContents(headingIds);

  if (headings.length === 0) return null;

  return (
    <nav className="space-y-1">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4">
        目录
      </h4>
      {headings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          className={cn(
            'block text-sm py-1.5 transition-colors duration-200 border-l-2',
            heading.level === 2 ? 'pl-3' : 'pl-6',
            activeId === heading.id
              ? 'text-accent-purple-light border-accent-purple'
              : 'text-text-secondary border-transparent hover:text-text-primary hover:border-border-hover',
          )}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  );
}
