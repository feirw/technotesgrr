import { useCallback, useEffect, useState } from 'react';
import { AUTH_CHANGE_EVENT, getCurrentUser, type MockUser } from '@/lib/auth/mockAuth';

export function useMockUser(): MockUser | null {
  const [user, setUser] = useState<MockUser | null>(() => getCurrentUser());

  useEffect(() => {
    const sync = () => setUser(getCurrentUser());
    window.addEventListener(AUTH_CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return user;
}

export function useCooldown(seconds = 30) {
  const [left, setLeft] = useState(0);

  useEffect(() => {
    if (left <= 0) return;
    const id = window.setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [left]);

  const start = useCallback(() => setLeft(seconds), [seconds]);
  return { left, active: left > 0, start };
}

type Validators<T> = { [K in keyof T]?: (value: T[K], all: T) => string | undefined };

/** Τιμές, touched και errors: τα σφάλματα εμφανίζονται στο blur και στο submit. */
type Widen<T> = { [K in keyof T]: T[K] extends boolean ? boolean : string };

export function useAuthForm<
  I extends Record<string, string | boolean>,
  T extends Widen<I> = Widen<I>,
>(initial: I, validators: Validators<T>) {
  const [values, setValues] = useState<T>(initial as unknown as T);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const errorFor = (key: keyof T, all: T = values) => validators[key]?.(all[key], all);

  const errors = Object.fromEntries(
    (Object.keys(values) as (keyof T)[]).map((k) => [k, touched[k] ? errorFor(k) : undefined])
  ) as Partial<Record<keyof T, string>>;

  const set = <K extends keyof T>(key: K, value: T[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const blur = (key: keyof T) => setTouched((prev) => ({ ...prev, [key]: true }));

  /** Σημαδεύει όλα ως touched και επιστρέφει το πρώτο πεδίο με σφάλμα. */
  const validateAll = (): keyof T | null => {
    const keys = Object.keys(values) as (keyof T)[];
    setTouched(Object.fromEntries(keys.map((k) => [k, true])) as Record<keyof T, boolean>);
    return keys.find((k) => errorFor(k)) ?? null;
  };

  return { values, errors, set, blur, validateAll };
}
