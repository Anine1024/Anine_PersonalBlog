import { cn } from '@/lib/utils';

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
};

export function Avatar({ size = 'md', className }: AvatarProps) {
  return (
    <img
      src="/images/avatar.jpg"
      alt="Avatar"
      className={cn('rounded-full object-cover shrink-0', sizes[size], className)}
    />
  );
}
