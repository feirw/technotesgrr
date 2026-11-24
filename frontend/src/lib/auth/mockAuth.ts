/**
 * Mock auth service — μόνο client-side, χωρίς δίκτυο.
 *
 * Magic inputs:
 *  - email `error@test.com`   → server_error
 *  - email `locked@test.com`  → too_many_attempts
 *  - email `wrong@test.com`   → invalid_credentials (login)
 *  - email `taken@test.com`   → email_taken (signup)
 *  - email `otp@test.com`     → το login απαιτεί OTP
 *  - OTP `000000`             → invalid_code
 *  - token `expired`          → expired_token, token `invalid` → invalid_token
 */

export type AuthErrorCode =
  | 'server_error'
  | 'too_many_attempts'
  | 'invalid_credentials'
  | 'email_taken'
  | 'invalid_code'
  | 'invalid_token'
  | 'expired_token'
  | 'unknown';

export class AuthError extends Error {
  readonly code: AuthErrorCode;

  constructor(code: AuthErrorCode) {
    super(code);
    this.name = 'AuthError';
    this.code = code;
  }
}

export type MockUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
};

export type LoginResult =
  { status: 'ok'; user: MockUser } | { status: 'otp_required'; email: string };

const LATENCY_MS = 800;
const STORAGE_KEY = 'technotes_mock_auth_user';
export const AUTH_CHANGE_EVENT = 'technotes:mock-auth-change';

const delay = (ms = LATENCY_MS) => new Promise((r) => setTimeout(r, ms));
const norm = (email: string) => email.trim().toLowerCase();

function guardEmail(email: string) {
  const e = norm(email);
  if (e === 'error@test.com') throw new AuthError('server_error');
  if (e === 'locked@test.com') throw new AuthError('too_many_attempts');
}

function guardToken(token: string | null | undefined) {
  if (!token || token === 'invalid') throw new AuthError('invalid_token');
  if (token === 'expired') throw new AuthError('expired_token');
}

function nameFromEmail(email: string) {
  const local = norm(email).split('@')[0] ?? '';
  return local ? local.charAt(0).toUpperCase() + local.slice(1) : 'Χρήστης';
}

function persist(user: MockUser | null, remember = true) {
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    if (user) (remember ? localStorage : sessionStorage).setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function getCurrentUser(): MockUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MockUser) : null;
  } catch {
    return null;
  }
}

export async function login(input: {
  email: string;
  password: string;
  remember: boolean;
}): Promise<LoginResult> {
  // TODO: connect real API
  await delay();
  guardEmail(input.email);
  const email = norm(input.email);
  if (email === 'wrong@test.com') throw new AuthError('invalid_credentials');
  if (email === 'otp@test.com') return { status: 'otp_required', email };
  const user: MockUser = {
    id: crypto.randomUUID(),
    name: nameFromEmail(email),
    email,
    emailVerified: true,
  };
  persist(user, input.remember);
  return { status: 'ok', user };
}

export async function signup(input: {
  name: string;
  email: string;
  password: string;
}): Promise<void> {
  // TODO: connect real API
  await delay();
  guardEmail(input.email);
  if (norm(input.email) === 'taken@test.com') throw new AuthError('email_taken');
}

export async function requestPasswordReset(email: string): Promise<void> {
  // TODO: connect real API
  await delay();
  guardEmail(email);
}

export async function resetPassword(input: { token: string; password: string }): Promise<void> {
  // TODO: connect real API
  await delay();
  guardToken(input.token);
}

/** Έλεγχος token χωρίς αλλαγή (για το αρχικό state της σελίδας reset). */
export async function checkResetToken(token: string | null): Promise<void> {
  // TODO: connect real API
  await delay(400);
  guardToken(token);
}

export async function verifyEmail(token: string): Promise<void> {
  // TODO: connect real API
  await delay();
  guardToken(token);
}

export async function verifyOtp(input: { email: string; code: string }): Promise<MockUser> {
  // TODO: connect real API
  await delay();
  if (input.email) guardEmail(input.email);
  if (input.code === '000000') throw new AuthError('invalid_code');
  const email = input.email ? norm(input.email) : 'user@technotes.gr';
  const user: MockUser = {
    id: crypto.randomUUID(),
    name: nameFromEmail(email),
    email,
    emailVerified: true,
  };
  persist(user);
  return user;
}

export async function resendCode(input: {
  email: string;
  kind: 'verify' | 'otp' | 'reset';
}): Promise<void> {
  // TODO: connect real API
  await delay();
  if (input.email) guardEmail(input.email);
}

export async function logout(): Promise<void> {
  // TODO: connect real API
  await delay(300);
  persist(null);
}

export function toAuthError(err: unknown): AuthError {
  return err instanceof AuthError ? err : new AuthError('unknown');
}
