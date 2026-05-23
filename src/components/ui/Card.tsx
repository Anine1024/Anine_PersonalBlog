import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  const Comp = hover ? motion.div : 'div';
  const hoverProps = hover
    ? {
        whileHover: { y: -4 },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <Comp
      className={cn('card-base overflow-hidden', className)}
      {...hoverProps}
    >
      {children}
    </Comp>
  );
}
