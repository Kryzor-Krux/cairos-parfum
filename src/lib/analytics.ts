/** Allowlisted, anonymous product events. No messages, phone numbers or identifiers. */
export type AnalyticsEvent =
  | 'hero_view' | 'collection_view' | 'perfume_view' | 'perfume_cta_click'
  | 'atelier_start' | 'atelier_step' | 'atelier_complete'
  | 'whatsapp_click' | 'instagram_click';

export type EventProperties = {
  perfume_id?: string;
  source?: string;
  step?: number | string;
  choice?: string;
};

export function trackEvent(name: AnalyticsEvent, properties: EventProperties = {}) {
  if (typeof window === 'undefined') return;
  const clean: EventProperties = {};
  for (const key of ['perfume_id', 'source', 'step', 'choice'] as const) {
    const value = properties[key];
    if (typeof value === 'string' && /^[a-z0-9_-]{1,48}$/i.test(value)) Object.assign(clean, { [key]: value });
    if (key === 'step' && typeof value === 'number' && Number.isInteger(value)) clean.step = value;
  }
  // Prepared integration point. No network transmission or persistence by default.
  window.dispatchEvent(new CustomEvent('cairos:analytics', { detail: { name, properties: clean } }));
}
