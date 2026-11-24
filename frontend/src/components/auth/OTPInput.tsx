import React, { useEffect, useRef } from 'react';
import { AUTH_STRINGS } from '@/data/authStrings';
import { cn } from '@/lib/utils';

const LENGTH = 6;
const S = AUTH_STRINGS.otp;

type OTPInputProps = {
  value: string;
  onChange: (value: string) => void;
  /** Καλείται όταν συμπληρωθούν όλα τα ψηφία. */
  onComplete?: (value: string) => void;
  error?: string;
  errorId?: string;
  disabled?: boolean;
  /** Κάθε αλλαγή εστιάζει το πρώτο κενό ψηφίο (και στο mount). */
  focusSignal?: number;
};

const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  onComplete,
  error,
  errorId,
  disabled,
  focusSignal = 0,
}) => {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    refs.current[Math.min(value.length, LENGTH - 1)]?.focus();
  }, [focusSignal]);
  const digits = Array.from({ length: LENGTH }, (_, i) => value[i] ?? '');

  const focus = (i: number) => refs.current[Math.max(0, Math.min(LENGTH - 1, i))]?.focus();

  const commit = (next: string[]) => {
    const joined = next.join('').slice(0, LENGTH);
    onChange(joined);
    if (joined.length === LENGTH && !next.includes('')) onComplete?.(joined);
  };

  const fillFrom = (start: number, chars: string) => {
    const next = [...digits];
    let i = start;
    for (const c of chars) {
      if (i >= LENGTH) break;
      next[i++] = c;
    }
    commit(next);
    focus(i);
  };

  const handleChange = (i: number, raw: string) => {
    const chars = raw.replace(/\D/g, '');
    if (!chars) return;
    if (chars.length >= LENGTH) return fillFrom(0, chars);
    const prev = digits[i];
    if (prev && chars.length === 2)
      return fillFrom(i, chars.startsWith(prev) ? chars[1] : chars[0]);
    fillFrom(i, chars);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = [...digits];
      if (next[i]) {
        next[i] = '';
        commit(next);
      } else if (i > 0) {
        next[i - 1] = '';
        commit(next);
        focus(i - 1);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focus(i - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focus(i + 1);
    }
  };

  const handlePaste = (i: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    const chars = e.clipboardData.getData('text').replace(/\D/g, '');
    if (!chars) return;
    e.preventDefault();
    fillFrom(chars.length >= LENGTH ? 0 : i, chars);
  };

  return (
    <div role="group" aria-label={S.groupLabel} className="flex justify-between gap-2 sm:gap-3">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={LENGTH}
          aria-label={S.digitLabel(i + 1)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'h-14 w-11 sm:h-16 sm:w-14 rounded-xl border-2 bg-white dark:bg-[#2d1c48] text-center text-2xl font-black text-gray-900 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#f07f97] disabled:opacity-60',
            error
              ? 'border-red-500 dark:border-red-400'
              : d
                ? 'border-[#f07f97]'
                : 'border-gray-200 dark:border-white/15 focus:border-[#f07f97]'
          )}
        />
      ))}
    </div>
  );
};

export default OTPInput;
