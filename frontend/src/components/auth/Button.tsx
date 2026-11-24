import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AUTH_STRINGS } from '@/data/authStrings';

type Variant = 'primary' | 'secondary';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-[#e06d88] hover:bg-[#f07f97] text-white shadow-lg hover:shadow-xl',
  secondary:
    'border-2 border-[#f07f97]/40 bg-white text-gray-900 hover:bg-coral-wash dark:bg-transparent dark:text-[#faf5ef] dark:hover:bg-white/10',
};

export const buttonClass = (variant: Variant = 'primary', className?: string) =>
  cn(
    'inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-base font-extrabold transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f07f97] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#3a2658] disabled:cursor-not-allowed disabled:opacity-70',
    VARIANTS[variant],
    className
  );

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading,
  disabled,
  className,
  children,
  ...rest
}) => (
  <button
    className={buttonClass(variant, className)}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    {...rest}
  >
    {loading && <Loader2 className="h-5 w-5 animate-spin" aria-hidden />}
    {loading ? AUTH_STRINGS.common.loading : children}
  </button>
);

export const ButtonLink: React.FC<{ to: string; variant?: Variant; children: React.ReactNode }> = ({
  to,
  variant = 'primary',
  children,
}) => (
  <Link to={to} className={buttonClass(variant)}>
    {children}
  </Link>
);

export default Button;
