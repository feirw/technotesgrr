// 127.0.0.1, not localhost — Node/browsers can resolve "localhost" to the IPv6
// ::1 loopback, which the backend (bound to 0.0.0.0, IPv4-only) refuses.
const LOCAL_FALLBACK = 'http://127.0.0.1:8001';

function normalizedBackendEnv(): string {
  if (typeof window !== 'undefined') {
    const w = window.__ENV__?.VITE_BACKEND_URL;
    if (typeof w === 'string' && w.trim().length > 0) {
      return w.trim().replace(/\/+$/, '');
    }
  }
  const raw = import.meta.env.VITE_BACKEND_URL;
  if (raw == null || String(raw).trim().length === 0) return '';
  return String(raw).trim().replace(/\/+$/, '');
}

/** True for http(s) URLs whose host is this machine only (wrong target on phones / LAN / production). */
function isLoopbackHttpUrl(baseUrl: string): boolean {
  try {
    const u = new URL(baseUrl);
    return u.hostname === 'localhost' || u.hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

function pageIsOnLoopbackHost(): boolean {
  if (typeof window === 'undefined') return false;
  const h = window.location.hostname;
  return h === 'localhost' || h === '127.0.0.1';
}

/**
 * Use VITE_BACKEND_URL only when it can reach the real API from this browser:
 * - On localhost/127.0.0.1, loopback env is correct.
 * - On a phone (LAN IP) or a public domain, loopback env points at the device, not the dev server — ignore it.
 */
function envBackendUsableHere(normalizedEnv: string): boolean {
  if (!normalizedEnv) return false;
  if (pageIsOnLoopbackHost()) return true;
  return !isLoopbackHttpUrl(normalizedEnv);
}

export const getBackendUrl = (): string => {
  // On localhost, always prefer the Vite dev proxy (same origin, relative /api
  // path) over VITE_BACKEND_URL — even when that env var is set (e.g. to the
  // production API for phone/LAN testing), local dev should hit the local
  // backend, not silently call production. This matches the priority already
  // used by getBackendUrlCandidates() below.
  if (pageIsOnLoopbackHost()) {
    return '';
  }

  const normalizedEnv = normalizedBackendEnv();

  if (normalizedEnv && envBackendUsableHere(normalizedEnv)) {
    return normalizedEnv;
  }

  if (typeof window !== 'undefined') {
    return window.location.origin.replace(/\/+$/, '');
  }

  if (normalizedEnv) {
    return normalizedEnv;
  }

  return LOCAL_FALLBACK;
};

export const getBackendUrlCandidates = (): string[] => {
  const candidates: string[] = [];
  const normalizedEnv = normalizedBackendEnv();
  const sameOrigin =
    typeof window !== 'undefined' ? window.location.origin.replace(/\/+$/, '') : '';

  /**
   * Netlify (και άλλα static hosts): το ίδιο origin ΔΕΝ έχει FastAPI — το SPA fallback δίνει HTML στο /api.
   * Σε αυτή την περίπτωση πρέπει πρώτα το VITE_BACKEND_URL (π.χ. Render), όχι το technotesgr.com.
   * Σε localhost το Vite proxy `/api` → backend: ίδιο origin πρώτα.
   */
  const externalBackendFirst =
    Boolean(sameOrigin) &&
    !pageIsOnLoopbackHost() &&
    Boolean(normalizedEnv) &&
    envBackendUsableHere(normalizedEnv) &&
    (() => {
      try {
        return new URL(normalizedEnv).origin !== new URL(sameOrigin).origin;
      } catch {
        return false;
      }
    })();

  if (externalBackendFirst && normalizedEnv) {
    candidates.push(normalizedEnv);
  }

  if (sameOrigin && !candidates.includes(sameOrigin)) {
    candidates.push(sameOrigin);
  }

  if (normalizedEnv && envBackendUsableHere(normalizedEnv) && !candidates.includes(normalizedEnv)) {
    candidates.push(normalizedEnv);
  }

  // Avoid localhost fallback on public domains; it adds long failed attempts before real errors.
  if (pageIsOnLoopbackHost() && !candidates.includes(LOCAL_FALLBACK)) {
    candidates.push(LOCAL_FALLBACK);
  }

  return candidates;
};
