'use client';

import { useReportWebVitals } from 'next/web-vitals';

type Metric = { name: string; value: number; rating: string };
function reportMetric({ name, value, rating }: Metric) {
  const output = document.getElementById('cairos-performance');
  if (output) output.setAttribute(`data-${name.toLowerCase()}`, String(Math.round(value * 1000) / 1000));
  // Local integration point only. No identifiers, persistence or external requests.
  window.dispatchEvent(new CustomEvent('cairos:performance', { detail: { name, value, rating } }));
}

export function WebVitals() {
  useReportWebVitals(reportMetric);
  return <output id="cairos-performance" hidden aria-hidden="true"/>;
}
