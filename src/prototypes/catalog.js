import { prototypes } from './registry'
import foodThumb from './food/default/media/burger-full.jpg'
import retailThumb from './retail/default/thumb.jpg'
import healthcareThumb from './healthcare/default/thumb.jpg'
import logisticsThumb from './logistics/default/thumb.jpg'
import posThumb from './pos/default/thumb.jpg'
import realestateThumb from './realestate/default/thumb.jpg'

// Stand-in thumbnails for themes whose prototype isn't built yet.
const photo = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=640&h=480&q=80`

// Public catalog shown in the GLOARO funnel. A theme is openable only when it is
// registered in registry.js; otherwise it shows as "Coming soon".
export const businesses = [
  { id: 'food', name: 'Food & Restaurant', tagline: 'Immersive commerce experience', accent: '#e0793a', themes: [{ id: 'default', name: 'Table to Doorstep', thumb: foodThumb, site: 'maisonember.in' }] },
  { id: 'education', name: 'Education', tagline: 'Digital campus experience', accent: '#3b6fd8', themes: [{ id: 'default', name: 'Floating Campus', thumb: photo('photo-1524178232363-1fb2b075b655') }] },
  { id: 'retail', name: 'Retail & E-Commerce', tagline: 'Build your product, then buy it', accent: '#c2417a', themes: [{ id: 'default', name: 'Build Your Product', thumb: retailThumb, site: 'gloaro.build' }] },
  { id: 'pos', name: 'Billing & POS', tagline: 'A smarter counter for Indian businesses', accent: '#17a589', themes: [{ id: 'default', name: 'CounterFlow POS', thumb: posThumb, site: 'counterflow.in' }] },
  { id: 'realestate', name: 'Real Estate & Rental', tagline: 'Spatial property experience', accent: '#8a6d3b', themes: [{ id: 'default', name: 'Tower Walkthrough', thumb: realestateThumb, site: 'prestigehorizon.in' }] },
  { id: 'crm', name: 'CRM & Business Management', tagline: 'Connected business network', accent: '#6c4de6', themes: [{ id: 'default', name: 'Relationship Graph', thumb: photo('photo-1460925895917-afdab827c52f') }] },
  { id: 'healthcare', name: 'Healthcare', tagline: 'Hospital care, clearly connected', accent: '#1aa6b7', themes: [{ id: 'default', name: 'Everwell Hospital', thumb: healthcareThumb, site: 'swasthyacare.in' }] },
  { id: 'logistics', name: 'Logistics & Delivery', tagline: 'India-wide delivery, clearly connected', accent: '#e5a50a', themes: [{ id: 'default', name: 'Route One Logistics', thumb: logisticsThumb, site: 'routeone.in' }] },
  { id: 'hospitality', name: 'Hospitality & Travel', tagline: 'Immersive travel environment', accent: '#0e7490', themes: [{ id: 'default', name: 'Resort Explorer', thumb: photo('photo-1542314831-068cd1dbfeeb') }] },
  { id: 'services', name: 'Professional Services', tagline: 'Editorial interactive studio', accent: '#111827', themes: [{ id: 'default', name: 'Kinetic Studio', thumb: photo('photo-1522071820081-009f0129c71c') }] },
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
