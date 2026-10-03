import { prototypes } from './registry'
import foodThumb from './food/default/media/burger-full.jpg'
import retailThumb from './retail/default/thumb.jpg'

// Public catalog shown in the GLOARO funnel. A theme is openable only when it is
// registered in registry.js; otherwise it shows as "Coming soon".
export const businesses = [
  { id: 'food', name: 'Food & Restaurant', tagline: 'Immersive commerce experience', accent: '#e0793a', themes: [{ id: 'default', name: 'Table to Doorstep', thumb: foodThumb, site: 'maisonember.in' }] },
  { id: 'education', name: 'Education', tagline: 'Digital campus experience', accent: '#3b6fd8', themes: [{ id: 'default', name: 'Floating Campus' }] },
  { id: 'retail', name: 'Retail & E-Commerce', tagline: 'Build your product, then buy it', accent: '#c2417a', themes: [{ id: 'default', name: 'Build Your Product', thumb: retailThumb, site: 'gloaro.build' }] },
  { id: 'pos', name: 'Billing & POS', tagline: 'Digital transaction environment', accent: '#17a589', themes: [{ id: 'default', name: 'Checkout Counter' }] },
  { id: 'realestate', name: 'Real Estate & Rental', tagline: 'Spatial property experience', accent: '#8a6d3b', themes: [{ id: 'default', name: 'Tower Walkthrough' }] },
  { id: 'crm', name: 'CRM & Business Management', tagline: 'Connected business network', accent: '#6c4de6', themes: [{ id: 'default', name: 'Relationship Graph' }] },
  { id: 'healthcare', name: 'Healthcare', tagline: 'Digital clinical environment', accent: '#1aa6b7', themes: [{ id: 'default', name: 'Clinical Scan' }] },
  { id: 'logistics', name: 'Logistics & Delivery', tagline: 'Real-time operations map', accent: '#e5a50a', themes: [{ id: 'default', name: 'Fleet Command' }] },
  { id: 'hospitality', name: 'Hospitality & Travel', tagline: 'Immersive travel environment', accent: '#0e7490', themes: [{ id: 'default', name: 'Resort Explorer' }] },
  { id: 'services', name: 'Professional Services', tagline: 'Editorial interactive studio', accent: '#111827', themes: [{ id: 'default', name: 'Kinetic Studio' }] },
]

export const isThemeLive = (businessId, themeId) => Boolean(prototypes[businessId]?.[themeId])

export const getBusiness = (id) => businesses.find((b) => b.id === id) || null

export const getThemeKey = (businessId, themeId) => `${businessId}/${themeId}`

export function parseThemeKey(key) {
  const [businessId, themeId] = String(key || '').split('/')
  const business = getBusiness(businessId)
  const theme = business?.themes.find((t) => t.id === themeId)
  return business && theme ? { business, theme, key: getThemeKey(businessId, themeId) } : null
}

export const allThemes = () =>
  businesses.flatMap((b) => b.themes.map((t) => ({ business: b, theme: t, key: getThemeKey(b.id, t.id) })))
