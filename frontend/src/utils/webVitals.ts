import { getBackendUrl } from '@/utils/backendUrl';

type VitalName = 'LCP' | 'CLS' | 'INP';
type VitalRating = 'good' | 'needs-improvement' | 'poor';
type EventPerformanceObserverInit = PerformanceObserverInit & { durationThreshold?: number };

const BACKEND_URL = getBackendUrl();
const ANALYTICS_URL = `${BACKEND_URL}/api/metrics/web-vitals`;

const getRating = (name: VitalName, value: number): VitalRating => {
  if (name === 'LCP') {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  }
  if (name === 'CLS') {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  }
  // INP thresholds in ms
  if (value <= 200) return 'good';
  if (value <= 500) return 'needs-improvement';
  return 'poor';
};

const reportMetric = (name: VitalName, value: number) => {
  const payload = {
    name,
    value,
    rating: getRating(name, value),
    path: window.location.pathname,
    ts: Date.now(),
  };

  if (payload.rating !== 'good') {
    console.warn(`[WebVitals] ${name}=${value} (${payload.rating})`, payload.path);
  }

  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    navigator.sendBeacon(ANALYTICS_URL, body);
    return;
  }

  void fetch(ANALYTICS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  });
};

export const initWebVitalsTracking = () => {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') {
    return;
  }

  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        reportMetric('LCP', lastEntry.startTime);
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {
    // Browser does not support this metric observer.
  }

  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as Array<
        PerformanceEntry & { value?: number; hadRecentInput?: boolean }
      >) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value || 0;
        }
      }
      reportMetric('CLS', clsValue);
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch {
    // Browser does not support this metric observer.
  }

  try {
    const inpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries() as Array<PerformanceEntry & { duration?: number }>;
      let maxDuration = 0;
      for (const entry of entries) {
        maxDuration = Math.max(maxDuration, entry.duration || 0);
      }
      if (maxDuration > 0) {
        reportMetric('INP', maxDuration);
      }
    });
    inpObserver.observe({
      type: 'event',
      buffered: true,
      durationThreshold: 40,
    } as EventPerformanceObserverInit);
  } catch {
    // Browser does not support this metric observer.
  }
};
