import React, { useEffect, useRef } from 'react';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

type Tone = 'error' | 'success' | 'info';

const TONES: Record<Tone, string> = {
  error:
    'border-red-200 bg-red-50 text-red-800 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-200',
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200',
  info: 'border-[#f07f97]/35 bg-coral-wash text-gray-800 dark:border-white/15 dark:bg-white/5 dark:text-gray-100',
};

const ICONS = { error: AlertTriangle, success: CheckCircle2, info: Info };

/** Η περιοχή live μένει πάντα στο DOM ώστε οι screen readers να ανακοινώνουν αλλαγές. */
const FormAlert: React.FC<{ tone?: Tone; message?: string | null }> = ({
  tone = 'error',
  message,
}) => {
  const Icon = ICONS[tone];
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message) ref.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [message]);

  return (
    <div
      ref={ref}
      role={tone === 'error' ? 'alert' : 'status'}
      aria-live={tone === 'error' ? 'assertive' : 'polite'}
    >
      {message && (
        <div
          className={`mb-5 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-semibold ${TONES[tone]}`}
        >
          <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default FormAlert;
