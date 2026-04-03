const LOCAL_FALLBACK = 'http://localhost:8001';

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
  const normalizedEnv = normalizedBackendEnv();

  if (normalizedEnv && envBackendUsableHere(normalizedEnv)) {
    return normalizedEnv;
  }

  if (typeof window !== 'undefined' && !pageIsOnLoopbackHost()) {
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

  if (normalizedEnv && envBackendUsableHere(normalizedEnv)) {
    candidates.push(normalizedEnv);
  }

  if (typeof window !== 'undefined') {
    const sameOrigin = window.location.origin.replace(/\/+$/, '');
    if (!candidates.includes(sameOrigin)) {
      candidates.push(sameOrigin);
    }
  }

  if (!candidates.includes(LOCAL_FALLBACK)) {
    candidates.push(LOCAL_FALLBACK);
  }

  return candidates;
};
