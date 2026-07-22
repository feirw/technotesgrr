import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getBackendUrl } from '@/utils/backendUrl';
import { apiFetch } from '@/utils/apiClient';

export interface AuthUser {
  id: number;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  /** True only while the initial session check on load is in flight. */
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'technotesgr_auth_token';

/**
 * Session token lives in local/session storage and rides on the Authorization
 * header — not a cookie. This app's frontend and API are on different domains
 * in production, and browsers (Safari's ITP in particular) block third-party/
 * cross-site cookies outright regardless of SameSite/Secure config, so a
 * cookie-based session silently never persists. A Bearer token has no such
 * restriction. "Remember me" maps directly to which storage holds it:
 * localStorage survives closing the browser, sessionStorage doesn't.
 */
function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

/** Read-only access to the current session token, for code outside the auth context (e.g. progress sync). */
export function getAuthToken(): string | null {
  return getStoredToken();
}

function storeToken(token: string, remember: boolean): void {
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token);
    sessionStorage.removeItem(TOKEN_KEY);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(TOKEN_KEY);
  }
}

function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    apiFetch<{ user: AuthUser }>(`${getBackendUrl()}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      retries: 0,
    })
      .then((data) => {
        if (!cancelled) setUser(data.user);
      })
      .catch(() => {
        if (!cancelled) clearStoredToken();
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean) => {
    const data = await apiFetch<{ user: AuthUser; token: string }>(
      `${getBackendUrl()}/api/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
        retries: 0,
      }
    );
    storeToken(data.token, rememberMe);
    setUser(data.user);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const data = await apiFetch<{ user: AuthUser; token: string }>(
      `${getBackendUrl()}/api/auth/register`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        retries: 0,
      }
    );
    storeToken(data.token, true);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    const token = getStoredToken();
    try {
      await apiFetch(`${getBackendUrl()}/api/auth/logout`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        retries: 0,
      });
    } finally {
      clearStoredToken();
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
