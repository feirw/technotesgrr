import React, { forwardRef, useId } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TextFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  label: string;
  error?: string;
  hint?: React.ReactNode;
  /** Στοιχείο στο δεξί μέρος του input (π.χ. toggle κωδικού). */
  trailing?: React.ReactNode;
  labelAside?: React.ReactNode;
};

export const inputClass =
  'block w-full min-h-12 rounded-xl border-2 bg-white dark:bg-[#2d1c48] px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 outline-none focus-visible:ring-2 focus-visible:ring-[#f07f97] focus-visible:ring-offset-0 disabled:opacity-60';

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, hint, trailing, labelAside, className, ...rest }, ref) => {
    const id = useId();
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;
    const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ');

    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor={id} className="text-sm font-bold text-gray-800 dark:text-gray-100">
            {label}
          </label>
          {labelAside}
        </div>
        <div className="relative">
          <input
            ref={ref}
            id={id}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy || undefined}
            className={cn(
              inputClass,
              error
                ? 'border-red-500 focus:border-red-500 dark:border-red-400'
                : 'border-gray-200 dark:border-white/15 focus:border-[#f07f97] hover:border-[#f07f97]/60',
              trailing && 'pr-14',
              className
            )}
            {...rest}
          />
          {trailing && (
            <div className="absolute inset-y-0 right-1 flex items-center">{trailing}</div>
          )}
        </div>
        {error && (
          <p
            id={errorId}
            className="flex items-start gap-1.5 text-sm font-semibold text-red-600 dark:text-red-300"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            {error}
          </p>
        )}
        {hint && (
          <div id={hintId} className="text-sm text-gray-600 dark:text-gray-300">
            {hint}
          </div>
        )}
      </div>
    );
  }
);
TextField.displayName = 'TextField';

export default TextField;
