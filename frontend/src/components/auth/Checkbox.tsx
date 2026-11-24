import React, { useId } from 'react';
import { AlertCircle, Check } from 'lucide-react';

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  onBlur?: () => void;
  children: React.ReactNode;
  error?: string;
  name?: string;
};

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  onBlur,
  children,
  error,
  name,
}) => {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="space-y-1">
      <div className="flex min-h-11 items-center gap-3">
        <span className="relative inline-flex h-6 w-6 shrink-0">
          <input
            id={id}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            onBlur={onBlur}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={`peer h-6 w-6 cursor-pointer appearance-none rounded-md border-2 bg-white dark:bg-[#2d1c48] checked:border-[#e06d88] checked:bg-[#e06d88] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f07f97] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#3a2658] ${
              error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-white/25'
            }`}
          />
          <Check
            className="pointer-events-none absolute inset-0 m-auto h-4 w-4 text-white opacity-0 peer-checked:opacity-100"
            strokeWidth={3}
            aria-hidden
          />
        </span>
        <label
          htmlFor={id}
          className="cursor-pointer text-sm font-semibold text-gray-700 dark:text-gray-200"
        >
          {children}
        </label>
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
    </div>
  );
};

export default Checkbox;
