/**
 * Canonical public origin for auth redirects (Supabase confirmation & password reset emails).
 *
 * Why: If signUp() omits emailRedirectTo, Supabase uses the project's "Site URL" from the dashboard
 * (often still http://localhost:5173) — confirmation links then point to localhost.
 *
 * Set VITE_SITE_URL at build time (Netlify env: https://www.technotes.gr) or at runtime via env.js (Docker).
 * Also set the same URL as Site URL + add redirect allow-list in Supabase → Authentication → URL Configuration.
 */

function configuredSiteUrl(): string {
  if (typeof window !== 'undefined') {
    const w = window.__ENV__?.VITE_SITE_URL;
    if (typeof w === 'string' && w.trim().length > 0) {
      return w.trim().replace(/\/+$/, '');
    }
  }
  const v = import.meta.env.VITE_SITE_URL;
  return typeof v === 'string' && v.trim().length > 0 ? v.trim().replace(/\/+$/, '') : '';
}

function parseSiteOrigin(raw: string): string {
  try {
    const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    return new URL(withScheme).origin.replace(/\/+$/, '');
  } catch {
    return raw.replace(/\/+$/, '');
  }
}

/** Build-time / env.js configured origin only (never window.location). */
export function getConfiguredSiteOrigin(): string {
  const raw = configuredSiteUrl();
  return raw ? parseSiteOrigin(raw) : '';
}

/** Production/deploy origin, or current browser origin when unset (OK for local dev). */
export function getSiteOrigin(): string {
  const configured = getConfiguredSiteOrigin();
  if (configured) return configured;
  if (import.meta.env.PROD) {
    return 'https://www.technotes.gr';
  }
  if (typeof window !== 'undefined') {
    return window.location.origin.replace(/\/+$/, '');
  }
  return '';
}

/** Absolute URL for Supabase emailRedirectTo / redirectTo (must be listed in Supabase redirect allow-list). */
export function authRedirectUrl(path: string): string {
  const base = getSiteOrigin();
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}
