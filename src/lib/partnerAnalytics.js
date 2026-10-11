// Partnership funnel events. Privacy rule: only the whitelisted, non-personal
// fields below ever leave this function — never names, emails, phones or answers.
// No analytics provider is installed yet, so events go to window.dataLayer only
// if a consent-aware tag manager has created it, plus a DOM event for debugging.
const ALLOWED = ['path', 'step', 'result', 'field', 'location', 'status']

export function trackPartnerEvent(name, data = {}) {
  if (typeof window === 'undefined') return
  const detail = { event: `partners_${name}` }
  ALLOWED.forEach((key) => {
    const value = data[key]
    if (typeof value === 'string' || typeof value === 'number') detail[key] = value
  })
  if (Array.isArray(window.dataLayer)) window.dataLayer.push(detail)
  window.dispatchEvent(new CustomEvent('gloaro:analytics', { detail }))
}
