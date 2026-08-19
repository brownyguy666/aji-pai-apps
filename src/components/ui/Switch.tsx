import React from 'react';
import { cn } from '../../lib/utils';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  description,
  className,
}) => {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-3 select-none cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={cn(
            'w-11 h-6 rounded-full transition-colors duration-200 ease-in-out',
            checked ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700'
          )}
        />
        <div
          className={cn(
            'absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out shadow-sm',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </div>
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</span>}
          {description && <span className="text-xs text-slate-500 dark:text-slate-400">{description}</span>}
        </div>
      )}
    </label>
  );
};
