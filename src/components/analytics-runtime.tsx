'use client';

import { useEffect } from 'react';
import { trackEvent, type AnalyticsEvent } from '@/lib/analytics';

export function AnalyticsRuntime() {
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        trackEvent(element.dataset.analyticsView as AnalyticsEvent);
        observer.unobserve(element);
      });
    }, { threshold: .3 });
    document.querySelectorAll('[data-analytics-view]').forEach(element => observer.observe(element));
    const click = (event: MouseEvent) => {
      const element = (event.target as Element).closest<HTMLElement>('[data-analytics-event]');
      if (element) trackEvent(element.dataset.analyticsEvent as AnalyticsEvent, { source: element.dataset.analyticsSource });
    };
    document.addEventListener('click', click);
    return () => { observer.disconnect(); document.removeEventListener('click', click); };
  }, []);
  return null;
}
