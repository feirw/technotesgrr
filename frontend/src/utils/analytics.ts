import { getCookieConsent } from '@/utils/cookieConsent';

declare global {
  interface Window {
    __ENV__?: Record<string, string | undefined>;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_MEASUREMENT_ID = 'G-V5G4FP7F9Z';

export function hasAnalyticsConsent(): boolean {
  return getCookieConsent()?.status === 'accepted';
}

export function grantAnalyticsConsent(): void {
  window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
}

export function denyAnalyticsConsent(): void {
  window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
}

/** Kept for CookieConsent — tag is already in index.html. */
export function initGoogleAnalytics(): void {
  grantAnalyticsConsent();
}

export function trackPageView(path: string): void {
  if (!window.gtag || !hasAnalyticsConsent()) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}
