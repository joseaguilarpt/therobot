// app/hooks/useAnalytics.tsx
import { useEffect } from 'react';
import { useLocation } from '@remix-run/react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', window?.ENV?.GOOGLE_ID_ANALYTICS, {
        page_path: location.pathname,
      });
    }
  }, [location]);

  const trackClick = (eventCategory: string, eventAction: string, eventLabel: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventAction, {
        event_category: eventCategory,
        event_label: eventLabel,
      });
    }
  };

  return { trackClick };
}
