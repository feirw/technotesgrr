import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { hasAnalyticsConsent, trackPageView } from '@/utils/analytics';

/** Sends GA4 page views on client-side route changes. The gtag snippet lives in index.html. */
const AnalyticsTracker: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (hasAnalyticsConsent()) trackPageView(pathname);
  }, [pathname]);

  return null;
};

export default AnalyticsTracker;
