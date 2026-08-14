import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { hasAnalyticsConsent, initGoogleAnalytics, trackPageView } from '@/utils/analytics';

/** Loads GA after consent and sends page views on route change. */
const AnalyticsTracker: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (hasAnalyticsConsent()) initGoogleAnalytics();
  }, []);

  useEffect(() => {
    if (hasAnalyticsConsent()) {
      initGoogleAnalytics();
      trackPageView(pathname);
    }
  }, [pathname]);

  return null;
};

export default AnalyticsTracker;
