export const COOKIE_CONSENT_KEY = 'technotesgr_cookie_consent_v1';

export type CookieConsentStatus = 'accepted' | 'essential';

export type CookieConsentRecord = {
  status: CookieConsentStatus;
  at: string;
};

export function getCookieConsent(): CookieConsentRecord | null {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsentRecord;
    if (parsed?.status === 'accepted' || parsed?.status === 'essential') {
      return parsed;
    }
  } catch {
    /* ignore corrupt storage */
  }
  return null;
}

export function hasCookieConsent(): boolean {
  return getCookieConsent() !== null;
}

export function setCookieConsent(status: CookieConsentStatus): void {
  const record: CookieConsentRecord = {
    status,
    at: new Date().toISOString(),
  };
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(record));
}
