import React from 'react';
import { cn } from '../../lib/utils';

export const Switch = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label?: string }>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className={cn("flex items-center gap-2 cursor-pointer", className)}>
        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 dark:bg-slate-700 transition-colors focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2">
          <input
            type="checkbox"
            className="peer sr-only"
            ref={ref}
            {...props}
          />
          <div className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform peer-checked:translate-x-5 peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500 shadow-sm" />
        </div>
        {label && <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>}
      </label>
    );
  }
);
Switch.displayName = "Switch";
