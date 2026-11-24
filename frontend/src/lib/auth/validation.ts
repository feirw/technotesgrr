import { AUTH_STRINGS } from '@/data/authStrings';

const V = AUTH_STRINGS.validation;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type PasswordRule = keyof typeof AUTH_STRINGS.strength.rules;

export const PASSWORD_RULES: Record<PasswordRule, (pw: string) => boolean> = {
  length: (pw) => pw.length >= 8,
  lower: (pw) => /[a-zα-ω]/.test(pw),
  upper: (pw) => /[A-ZΑ-Ω]/.test(pw),
  digit: (pw) => /\d/.test(pw),
  symbol: (pw) => /[^A-Za-z0-9α-ωΑ-Ωά-ώΆ-Ώ\s]/.test(pw),
};

export function checkPassword(pw: string): Record<PasswordRule, boolean> {
  return Object.fromEntries(Object.entries(PASSWORD_RULES).map(([k, fn]) => [k, fn(pw)])) as Record<
    PasswordRule,
    boolean
  >;
}

/** 0–4 για το meter. */
export function passwordScore(pw: string): number {
  if (!pw) return 0;
  const met = Object.values(checkPassword(pw)).filter(Boolean).length;
  const bonus = pw.length >= 12 ? 1 : 0;
  return Math.max(0, Math.min(4, met - 2 + bonus));
}

export function validateEmail(v: string): string | undefined {
  if (!v.trim()) return V.required;
  if (!EMAIL_RE.test(v.trim())) return V.emailInvalid;
  return undefined;
}

export function validateRequired(v: string): string | undefined {
  return v ? undefined : V.required;
}

export function validateName(v: string): string | undefined {
  if (!v.trim()) return V.required;
  if (v.trim().length < 2) return V.nameShort;
  return undefined;
}

export function validateStrongPassword(v: string): string | undefined {
  if (!v) return V.required;
  return Object.values(checkPassword(v)).every(Boolean) ? undefined : V.passwordWeak;
}

export function validateConfirm(v: string, original: string): string | undefined {
  if (!v) return V.required;
  return v === original ? undefined : V.passwordMismatch;
}

/** Επιτρέπει μόνο εσωτερικά paths για το `?redirect=`. */
export function safeRedirect(raw: string | null, fallback = '/account'): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return fallback;
  return raw;
}
