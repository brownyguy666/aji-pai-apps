import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  hoverEffect = false,
  glass = false,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl border transition-all duration-300',
        glass
          ? 'glass-card'
          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm',
        hoverEffect &&
          'hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-brand-950/20 hover:-translate-y-1 hover:border-brand-300 dark:hover:border-brand-800',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
