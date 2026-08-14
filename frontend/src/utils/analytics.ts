import { getCookieConsent } from '@/utils/cookieConsent';

declare global {
  interface Window {
    __gaInitialized?: boolean;
    __ENV__?: Record<string, string | undefined>;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function getGaMeasurementId(): string | null {
  const fromRuntime = window.__ENV__?.VITE_GA_MEASUREMENT_ID?.trim();
  const fromBuild = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
  return fromRuntime || fromBuild || null;
}

export function hasAnalyticsConsent(): boolean {
  return getCookieConsent()?.status === 'accepted';
}

export function initGoogleAnalytics(): void {
  const id = getGaMeasurementId();
  if (!id || !hasAnalyticsConsent() || window.__gaInitialized) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', id, { anonymize_ip: true, send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  script.dataset.seoManaged = 'true';
  document.head.appendChild(script);

  window.__gaInitialized = true;
}

export function trackPageView(path: string): void {
  if (!window.__gaInitialized || !window.gtag) return;
  const id = getGaMeasurementId();
  if (!id) return;
  window.gtag('config', id, { page_path: path });
}
