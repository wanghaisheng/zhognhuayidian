// Analytics React Hook
import { useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';
import { analytics } from '@/lib/analytics';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    analytics.trackPageView(location.pathname + location.search, document.title);
  }, [location]);
};

export const useAnalytics = () => {
  return {
    trackDeviceView: analytics.trackDeviceView.bind(analytics),
    trackInquiry: analytics.trackInquiry.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
    trackDownload: analytics.trackDownload.bind(analytics)
  };
};

export default useAnalytics;
