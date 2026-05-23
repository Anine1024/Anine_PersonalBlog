import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  href?: string;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-accent-purple hover:bg-accent-purple-light text-white shadow-lg shadow-accent-purple-glow hover:shadow-xl hover:shadow-accent-purple-glow/50',
  secondary:
    'bg-bg-card hover:bg-bg-card-hover text-text-primary border border-border hover:border-border-hover',
  ghost:
    'text-text-secondary hover:text-text-primary hover:bg-bg-card',
};

export function Button({ variant = 'primary', href, className, children, ...props }: ButtonProps) {
  const base = cn(
    'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200',
    variantStyles[variant],
    className,
  );

  if (href) {
    if (href.startsWith('http')) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
          {children}
        </a>
      );
    }
    return (
      <Link to={href} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <button className={base} {...props}>
      {children}
    </button>
  );
}
