const TOKEN_KEY = 'technotesgr_auth_token';

/** FastAPI Bearer token (progress sync). Better Auth sessions do not use this. */
export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}
