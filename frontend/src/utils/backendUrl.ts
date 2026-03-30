const LOCAL_FALLBACK = 'http://localhost:8001';

export const getBackendUrl = (): string => {
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  if (envUrl && String(envUrl).trim().length > 0) {
    return String(envUrl).replace(/\/+$/, '');
  }

  // In production, default to same-origin to avoid hard-failing to localhost.
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return window.location.origin.replace(/\/+$/, '');
  }

  return LOCAL_FALLBACK;
};

export const getBackendUrlCandidates = (): string[] => {
  const candidates: string[] = [];
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  const normalizedEnv = envUrl ? String(envUrl).replace(/\/+$/, '') : '';

  if (normalizedEnv) candidates.push(normalizedEnv);

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
