import { prototypes } from './registry'
import foodThumb from './food/default/media/burger-full.jpg'
import retailThumb from './retail/default/thumb.jpg'
import healthcareThumb from './healthcare/default/thumb.jpg'
import logisticsThumb from './logistics/default/thumb.jpg'
import posThumb from './pos/default/thumb.jpg'
import realestateThumb from './realestate/default/thumb.jpg'

// Stand-in thumbnails for themes whose prototype isn't built yet.
const photo = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=640&h=480&q=80`

// Software types used by the "Our work" filters. Each business lists the ones it fits.
export const softwareTypes = [
  { id: 'crm', label: 'CRM' },
  { id: 'erp', label: 'ERP' },
  { id: 'saas', label: 'SaaS Product' },
  { id: 'custom', label: 'Custom Software' },
  { id: 'management', label: 'Management Software' },
]

// Public catalog shown in the GLOARO funnel. A theme is openable only when it is
// registered in registry.js; otherwise it shows as "Coming soon".
// `kind` is 'industry' (a business type) or 'software' (a product type).
export const businesses = [
  { id: 'food', kind: 'industry', software: ['management'], name: 'Food & Restaurant', tagline: 'Immersive commerce experience', accent: '#e0793a', themes: [{ id: 'default', name: 'Table to Doorstep', thumb: foodThumb, site: 'maisonember.in' }] },
  { id: 'education', kind: 'industry', software: ['management', 'saas'], name: 'Education', tagline: 'Digital campus experience', accent: '#3b6fd8', themes: [{ id: 'default', name: 'Floating Campus', thumb: photo('photo-1524178232363-1fb2b075b655') }] },
  { id: 'retail', kind: 'industry', software: ['saas'], name: 'Retail & E-Commerce', tagline: 'Build your product, then buy it', accent: '#c2417a', themes: [{ id: 'default', name: 'Build Your Product', thumb: retailThumb, site: 'gloaro.build' }] },
  { id: 'pos', kind: 'industry', software: ['management', 'saas'], name: 'Billing & POS', tagline: 'A smarter counter for Indian businesses', accent: '#17a589', themes: [{ id: 'default', name: 'CounterFlow POS', thumb: posThumb, site: 'counterflow.in' }] },
  { id: 'realestate', kind: 'industry', software: ['crm'], name: 'Real Estate & Rental', tagline: 'Spatial property experience', accent: '#8a6d3b', themes: [{ id: 'default', name: 'Tower Walkthrough', thumb: realestateThumb, site: 'prestigehorizon.in' }] },
  { id: 'healthcare', kind: 'industry', software: ['management'], name: 'Healthcare', tagline: 'Hospital care, clearly connected', accent: '#1aa6b7', themes: [{ id: 'default', name: 'Everwell Hospital', thumb: healthcareThumb, site: 'swasthyacare.in' }] },
  { id: 'logistics', kind: 'industry', software: ['erp', 'management'], name: 'Logistics & Delivery', tagline: 'India-wide delivery, clearly connected', accent: '#e5a50a', themes: [{ id: 'default', name: 'Route One Logistics', thumb: logisticsThumb, site: 'routeone.in' }] },
  { id: 'hospitality', kind: 'industry', software: ['management', 'crm'], name: 'Hospitality & Travel', tagline: 'Immersive travel environment', accent: '#0e7490', themes: [{ id: 'default', name: 'Resort Explorer', thumb: photo('photo-1542314831-068cd1dbfeeb') }] },
  { id: 'services', kind: 'industry', software: ['custom', 'crm'], name: 'Professional Services', tagline: 'Editorial interactive studio', accent: '#111827', themes: [{ id: 'default', name: 'Kinetic Studio', thumb: photo('photo-1522071820081-009f0129c71c') }] },
  { id: 'manufacturing', kind: 'industry', software: ['erp', 'custom'], name: 'Manufacturing', tagline: 'Shop floor to dispatch in one system', accent: '#1b6fe0', themes: [{ id: 'default', name: 'Factory Flow', thumb: photo('photo-1581091226825-a6a2a5aee158') }] },
  { id: 'salon', kind: 'industry', software: ['crm', 'management'], name: 'Salon & Spa', tagline: 'Bookings, stylists and loyalty', accent: '#d9467a', themes: [{ id: 'default', name: 'Glow Studio', thumb: photo('photo-1560066984-138dadb4c035') }] },
  { id: 'fitness', kind: 'industry', software: ['crm', 'management'], name: 'Gym & Fitness', tagline: 'Memberships, classes and trainers', accent: '#ef5a29', themes: [{ id: 'default', name: 'Pulse Fitness', thumb: photo('photo-1534438327276-14e5300c3a48') }] },
  { id: 'pharmacy', kind: 'industry', software: ['erp', 'management'], name: 'Pharmacy', tagline: 'Stock, batches and prescriptions', accent: '#16a34a', themes: [{ id: 'default', name: 'CareChem', thumb: photo('photo-1631549916768-4119b2e5f926') }] },
  { id: 'automobile', kind: 'industry', software: ['crm', 'management'], name: 'Automobile', tagline: 'Showroom, service and spares', accent: '#475569', themes: [{ id: 'default', name: 'DriveLine', thumb: photo('photo-1492144534655-ae79c964c9d7') }] },
  { id: 'jewellery', kind: 'industry', software: ['erp', 'saas'], name: 'Jewellery', tagline: 'Catalogue, gold rates and orders', accent: '#b8860b', themes: [{ id: 'default', name: 'Aurum', thumb: photo('photo-1515562141207-7a88fb7ce338') }] },
  { id: 'crm', kind: 'software', software: ['crm', 'saas'], name: 'CRM & Business Management', tagline: 'Connected business network', accent: '#6c4de6', themes: [{ id: 'default', name: 'Relationship Graph', thumb: photo('photo-1460925895917-afdab827c52f') }] },
  { id: 'erp', kind: 'software', software: ['erp'], name: 'ERP Suite', tagline: 'Finance, stock, HR and purchase together', accent: '#0f766e', themes: [{ id: 'default', name: 'Unified ERP', thumb: photo('photo-1454165804606-c3d57bc86b40') }] },
  { id: 'saas', kind: 'software', software: ['saas'], name: 'SaaS Product', tagline: 'Subscriptions, tenants and billing', accent: '#7c5cff', themes: [{ id: 'default', name: 'LaunchPad SaaS', thumb: photo('photo-1498050108023-c5249f4df085') }] },
  { id: 'custom', kind: 'software', software: ['custom'], name: 'Custom Software', tagline: 'Built around your exact workflow', accent: '#0d4697', themes: [{ id: 'default', name: 'Tailor Made', thumb: photo('photo-1555066931-4365d14bab8c') }] },
  { id: 'management', kind: 'software', software: ['management'], name: 'Management Software', tagline: 'Teams, tasks and approvals in one place', accent: '#e07b00', themes: [{ id: 'default', name: 'Command Desk', thumb: photo('photo-1552664730-d307ca884978') }] },
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
