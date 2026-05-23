import { cn } from '@/lib/utils';

interface BadgeProps {
  children: string;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-accent-purple/10 text-accent-purple-light border border-accent-purple/20',
        className,
      )}
    >
      {children}
    </span>
  );
}
