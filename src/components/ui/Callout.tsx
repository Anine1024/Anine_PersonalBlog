import { cn } from '@/lib/utils';
import { Info, AlertTriangle, Lightbulb, AlertCircle } from 'lucide-react';
import type { ReactNode } from 'react';

type CalloutType = 'note' | 'warning' | 'tip' | 'danger';

interface CalloutProps {
  type: CalloutType;
  children: ReactNode;
}

const config: Record<CalloutType, { icon: typeof Info; border: string; bg: string }> = {
  note: {
    icon: Info,
    border: 'border-l-accent-purple',
    bg: 'bg-accent-purple/5',
  },
  warning: {
    icon: AlertTriangle,
    border: 'border-l-yellow-500',
    bg: 'bg-yellow-500/5',
  },
  tip: {
    icon: Lightbulb,
    border: 'border-l-accent-cyan',
    bg: 'bg-accent-cyan/5',
  },
  danger: {
    icon: AlertCircle,
    border: 'border-l-red-500',
    bg: 'bg-red-500/5',
  },
};

export function Callout({ type, children }: CalloutProps) {
  const { icon: Icon, border, bg } = config[type];

  return (
    <div className={cn('border-l-4 rounded-r-xl p-4 my-6', border, bg)}>
      <div className="flex items-start gap-3">
        <Icon size={18} className="text-text-secondary mt-0.5 shrink-0" />
        <div className="text-sm text-text-secondary [&>p]:my-0">
          {children}
        </div>
      </div>
    </div>
  );
}
