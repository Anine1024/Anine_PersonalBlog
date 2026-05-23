import { cn } from '@/lib/utils';

interface TagProps {
  children: string;
  className?: string;
  active?: boolean;
  onClick?: () => void;
}

export function Tag({ children, className, active, onClick }: TagProps) {
  return (
    <span
      onClick={onClick}
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200',
        active
          ? 'bg-accent-purple/10 border-accent-purple/30 text-accent-purple-light'
          : 'bg-bg-card border-border text-text-secondary hover:text-text-primary hover:border-border-hover hover:shadow-[0_0_12px_var(--color-accent-purple-glow)]',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </span>
  );
}
