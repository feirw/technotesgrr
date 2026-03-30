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
