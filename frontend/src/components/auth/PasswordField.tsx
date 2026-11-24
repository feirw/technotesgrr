import React, { forwardRef, useState } from 'react';
import { Check, Eye, EyeOff, X } from 'lucide-react';
import TextField, { type TextFieldProps } from '@/components/auth/TextField';
import { AUTH_STRINGS } from '@/data/authStrings';
import { checkPassword, passwordScore, type PasswordRule } from '@/lib/auth/validation';

const F = AUTH_STRINGS.fields;
const S = AUTH_STRINGS.strength;

type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'trailing'> & {
  /** Εμφανίζει meter + checklist κάτω από το πεδίο. */
  showStrength?: boolean;
};

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ showStrength, value, ...rest }, ref) => {
    const [visible, setVisible] = useState(false);
    const pw = typeof value === 'string' ? value : '';

    return (
      <TextField
        ref={ref}
        type={visible ? 'text' : 'password'}
        value={value}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        hint={showStrength ? <PasswordStrength password={pw} /> : undefined}
        trailing={
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? F.hidePassword : F.showPassword}
            aria-pressed={visible}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-gray-500 hover:text-[#e06d88] hover:bg-coral-wash dark:text-gray-300 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f07f97]"
          >
            {visible ? (
              <EyeOff className="h-5 w-5" aria-hidden />
            ) : (
              <Eye className="h-5 w-5" aria-hidden />
            )}
          </button>
        }
        {...rest}
      />
    );
  }
);
PasswordField.displayName = 'PasswordField';

const BAR_COLORS = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-lime-600', 'bg-emerald-600'];

export const PasswordStrength: React.FC<{ password: string }> = ({ password }) => {
  const score = passwordScore(password);
  const checks = checkPassword(password);
  const filled = password ? score + 1 : 0;

  return (
    <div className="mt-1 space-y-2">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i < filled ? BAR_COLORS[score] : 'bg-gray-200 dark:bg-white/15'
              }`}
            />
          ))}
        </div>
        <span
          className="min-w-[6.5rem] text-right text-xs font-bold text-gray-700 dark:text-gray-200"
          aria-live="polite"
        >
          {password ? `${S.label}: ${S.levels[score]}` : ''}
        </span>
      </div>
      <p className="sr-only">{S.checklistTitle}</p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
        {(Object.keys(S.rules) as PasswordRule[]).map((rule) => (
          <li
            key={rule}
            className={`flex items-center gap-1.5 text-xs font-semibold ${
              checks[rule]
                ? 'text-emerald-700 dark:text-emerald-300'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            {checks[rule] ? (
              <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />
            ) : (
              <X className="h-3.5 w-3.5 shrink-0" aria-hidden />
            )}
            {S.rules[rule]}
            <span className="sr-only">({checks[rule] ? S.met : S.unmet})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordField;
