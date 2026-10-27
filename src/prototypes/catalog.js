import { prototypes } from './registry'
import foodThumb from './food/default/thumb.jpg'
import retailThumb from './retail/default/thumb.jpg'
import healthcareThumb from './healthcare/default/thumb.jpg'
import logisticsThumb from './logistics/default/thumb.jpg'
import posThumb from './pos/default/thumb.jpg'
import realestateThumb from './realestate/default/thumb.jpg'

// Hero imagery for themes whose prototype isn't built yet. Those themes have no
// `thumb` (a real screenshot); cards draw a website preview from `photo` instead.
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
// registered in registry.js; otherwise it is listed without a demo.
// `kind` is 'industry' (a business type) or 'software' (a product type).
export const businesses = [
  { id: 'food', kind: 'industry', software: ['management'], name: 'Food & Restaurant', tagline: 'Immersive commerce experience', accent: '#e0793a', themes: [{ id: 'default', name: 'Table to Doorstep', thumb: foodThumb, site: 'maisonember.in' }, { id: 'street-bites', name: 'Street Bites Café', photo: photo('photo-1601050690597-df0568f70950'), site: 'streetbites.in' }, { id: 'thali-house', name: 'Thali House', photo: photo('photo-1589778655375-3e622a9fc91c'), site: 'thalihouse.in' }, { id: 'tandoor-kitchen', name: 'Tandoor Kitchen', photo: photo('photo-1567337710282-00832b415979'), site: 'tandoorkitchen.in' }] },
  { id: 'education', kind: 'industry', software: ['management', 'saas'], name: 'Education', tagline: 'Digital campus experience', accent: '#3b6fd8', themes: [{ id: 'default', name: 'Floating Campus', photo: photo('photo-1524178232363-1fb2b075b655') }, { id: 'bright-minds', name: 'Bright Minds School', photo: photo('photo-1524069290683-0457abfe42c3'), site: 'brightminds.edu.in' }, { id: 'smart-classroom', name: 'Smart Classroom', photo: photo('photo-1709290749293-c6152a187b14'), site: 'smartclass.in' }, { id: 'little-scholars', name: 'Little Scholars', photo: photo('photo-1572847748080-bac263fae977'), site: 'littlescholars.in' }] },
  { id: 'retail', kind: 'industry', software: ['saas'], name: 'Retail & E-Commerce', tagline: 'Build your product, then buy it', accent: '#c2417a', themes: [{ id: 'default', name: 'Build Your Product', thumb: retailThumb, site: 'gloaro.build' }, { id: 'loft-boutique', name: 'Loft Boutique', photo: photo('photo-1441984904996-e0b6ba687e04'), site: 'loftboutique.in' }, { id: 'style-street', name: 'Style Street', photo: photo('photo-1483985988355-763728e1935b'), site: 'stylestreet.in' }, { id: 'linen-rack', name: 'Linen Rack', photo: photo('photo-1490481651871-ab68de25d43d'), site: 'linenrack.in' }] },
  { id: 'pos', kind: 'industry', software: ['management', 'saas'], name: 'Billing & POS', tagline: 'A smarter counter for Indian businesses', accent: '#17a589', themes: [{ id: 'default', name: 'CounterFlow POS', thumb: posThumb, site: 'counterflow.in' }, { id: 'supermart-checkout', name: 'SuperMart Checkout', photo: photo('photo-1780037190608-1d871be1fe41'), site: 'supermartpos.in' }, { id: 'cafe-counter', name: 'Café Counter', photo: photo('photo-1760432794122-fa000107a4bc'), site: 'cafecounter.in' }, { id: 'tablet-billing', name: 'Tablet Billing', photo: photo('photo-1787551415595-40cf928e1b08'), site: 'tabletbill.in' }] },
  { id: 'realestate', kind: 'industry', software: ['crm'], name: 'Real Estate & Rental', tagline: 'Spatial property experience', accent: '#8a6d3b', themes: [{ id: 'default', name: 'Tower Walkthrough', thumb: realestateThumb, site: 'prestigehorizon.in' }, { id: 'skyline-residences', name: 'Skyline Residences', photo: photo('photo-1624204386084-dd8c05e32226'), site: 'skylineresidences.in' }, { id: 'urban-nest', name: 'Urban Nest Rentals', photo: photo('photo-1460317442991-0ec209397118'), site: 'urbannest.in' }, { id: 'vertex-towers', name: 'Vertex Towers', photo: photo('photo-1525953776754-6c4b7ee655ab'), site: 'vertextowers.in' }] },
  { id: 'healthcare', kind: 'industry', software: ['management'], name: 'Healthcare', tagline: 'Hospital care, clearly connected', accent: '#1aa6b7', themes: [{ id: 'default', name: 'Everwell Hospital', thumb: healthcareThumb, site: 'swasthyacare.in' }, { id: 'family-clinic', name: 'Family Clinic', photo: photo('photo-1758691462878-6edc3d3da1be'), site: 'familyclinic.in' }, { id: 'cardio-care', name: 'CardioCare Centre', photo: photo('photo-1758691463582-11aea602cd4a'), site: 'cardiocare.in' }, { id: 'doctor-connect', name: 'Doctor Connect', photo: photo('photo-1612349317150-e413f6a5b16d'), site: 'doctorconnect.in' }] },
  { id: 'logistics', kind: 'industry', software: ['erp', 'management'], name: 'Logistics & Delivery', tagline: 'India-wide delivery, clearly connected', accent: '#e5a50a', themes: [{ id: 'default', name: 'Route One Logistics', thumb: logisticsThumb, site: 'routeone.in' }, { id: 'cargo-loaders', name: 'Cargo Loaders', photo: photo('photo-1786719664218-7ddbe13ac76c'), site: 'cargoloaders.in' }, { id: 'van-dispatch', name: 'Van Dispatch', photo: photo('photo-1784400620958-34bce78c0482'), site: 'vandispatch.in' }, { id: 'pallet-hub', name: 'Pallet Hub', photo: photo('photo-1536607278842-2e762f290252'), site: 'pallethub.in' }] },
  { id: 'hospitality', kind: 'industry', software: ['management', 'crm'], name: 'Hospitality & Travel', tagline: 'Immersive travel environment', accent: '#0e7490', themes: [{ id: 'default', name: 'Resort Explorer', photo: photo('photo-1542314831-068cd1dbfeeb') }, { id: 'palm-retreat', name: 'Palm Retreat', photo: photo('photo-1520250497591-112f2f40a3f4'), site: 'palmretreat.in' }, { id: 'ocean-bay', name: 'Ocean Bay Resort', photo: photo('photo-1540541338287-41700207dee6'), site: 'oceanbay.in' }, { id: 'sunset-villas', name: 'Sunset Villas', photo: photo('photo-1561501900-3701fa6a0864'), site: 'sunsetvillas.in' }] },
  { id: 'services', kind: 'industry', software: ['custom', 'crm'], name: 'Professional Services', tagline: 'Editorial interactive studio', accent: '#111827', themes: [{ id: 'default', name: 'Kinetic Studio', photo: photo('photo-1522071820081-009f0129c71c') }, { id: 'consult-hub', name: 'Consult Hub', photo: photo('photo-1542744173-8e7e53415bb0'), site: 'consulthub.in' }, { id: 'legal-partners', name: 'Legal Partners', photo: photo('photo-1521791136064-7986c2920216'), site: 'legalpartners.in' }, { id: 'ca-associates', name: 'CA Associates', photo: photo('photo-1758518730136-1bf4fa26ccbf'), site: 'caassociates.in' }] },
  { id: 'manufacturing', kind: 'industry', software: ['erp', 'custom'], name: 'Manufacturing', tagline: 'Shop floor to dispatch in one system', accent: '#1b6fe0', themes: [{ id: 'default', name: 'Factory Flow', photo: photo('photo-1581091226825-a6a2a5aee158') }, { id: 'assembly-line', name: 'Assembly Line', photo: photo('photo-1647427060118-4911c9821b82'), site: 'assemblyline.in' }, { id: 'textile-mills', name: 'Textile Mills', photo: photo('photo-1610891015188-5369212db097'), site: 'textilemills.in' }, { id: 'robo-works', name: 'RoboWorks', photo: photo('photo-1716191299980-a6e8827ba10b'), site: 'roboworks.in' }] },
  { id: 'salon', kind: 'industry', software: ['crm', 'management'], name: 'Salon & Spa', tagline: 'Bookings, stylists and loyalty', accent: '#d9467a', themes: [{ id: 'default', name: 'Glow Studio', photo: photo('photo-1560066984-138dadb4c035') }, { id: 'beauty-lounge', name: 'Beauty Lounge', photo: photo('photo-1595871151608-bc7abd1caca3'), site: 'beautylounge.in' }, { id: 'lotus-spa', name: 'Lotus Spa', photo: photo('photo-1559185590-879c66a55254'), site: 'lotusspa.in' }, { id: 'wellness-retreat', name: 'Wellness Retreat', photo: photo('photo-1559185590-fcf099ac62c5'), site: 'wellnessretreat.in' }] },
  { id: 'fitness', kind: 'industry', software: ['crm', 'management'], name: 'Gym & Fitness', tagline: 'Memberships, classes and trainers', accent: '#ef5a29', themes: [{ id: 'default', name: 'Pulse Fitness', photo: photo('photo-1534438327276-14e5300c3a48') }, { id: 'iron-house', name: 'Iron House Gym', photo: photo('photo-1517836357463-d25dfeac3438'), site: 'ironhouse.in' }, { id: 'fit-arena', name: 'Fit Arena', photo: photo('photo-1689877020200-403d8542d95d'), site: 'fitarena.in' }, { id: 'strong-studio', name: 'Strong Studio', photo: photo('photo-1541534741688-6078c6bfb5c5'), site: 'strongstudio.in' }] },
  { id: 'pharmacy', kind: 'industry', software: ['erp', 'management'], name: 'Pharmacy', tagline: 'Stock, batches and prescriptions', accent: '#16a34a', themes: [{ id: 'default', name: 'CareChem', photo: photo('photo-1631549916768-4119b2e5f926') }, { id: 'medi-plus', name: 'MediPlus Pharmacy', photo: photo('photo-1580281657527-47f249e8f4df'), site: 'mediplus.in' }, { id: 'pill-point', name: 'Pill Point', photo: photo('photo-1607619056574-7b8d3ee536b2'), site: 'pillpoint.in' }, { id: 'lab-rx', name: 'LabRx', photo: photo('photo-1576671081837-49000212a370'), site: 'labrx.in' }] },
  { id: 'automobile', kind: 'industry', software: ['crm', 'management'], name: 'Automobile', tagline: 'Showroom, service and spares', accent: '#475569', themes: [{ id: 'default', name: 'DriveLine', photo: photo('photo-1492144534655-ae79c964c9d7') }, { id: 'auto-gallery', name: 'Auto Gallery', photo: photo('photo-1692406069831-0bb7ea297645'), site: 'autogallery.in' }, { id: 'motor-hub', name: 'Motor Hub', photo: photo('photo-1643142314913-0cf633d9bbb5'), site: 'motorhub.in' }, { id: 'prime-wheels', name: 'Prime Wheels', photo: photo('photo-1647200527435-cc6b0e91e120'), site: 'primewheels.in' }] },
  { id: 'jewellery', kind: 'industry', software: ['erp', 'saas'], name: 'Jewellery', tagline: 'Catalogue, gold rates and orders', accent: '#b8860b', themes: [{ id: 'default', name: 'Aurum', photo: photo('photo-1515562141207-7a88fb7ce338') }, { id: 'tanishka-gold', name: 'Tanishka Gold', photo: photo('photo-1633934542430-0905ccb5f050'), site: 'tanishkagold.in' }, { id: 'solitaire', name: 'Solitaire Diamonds', photo: photo('photo-1605100804763-247f67b3557e'), site: 'solitaire.in' }, { id: 'heritage-jewels', name: 'Heritage Jewels', photo: photo('photo-1620656798579-1984d9e87df7'), site: 'heritagejewels.in' }] },
  { id: 'crm', kind: 'software', software: ['crm', 'saas'], name: 'CRM & Business Management', tagline: 'Connected business network', accent: '#6c4de6', themes: [{ id: 'default', name: 'Relationship Graph', photo: photo('photo-1460925895917-afdab827c52f') }] },
  { id: 'erp', kind: 'software', software: ['erp'], name: 'ERP Suite', tagline: 'Finance, stock, HR and purchase together', accent: '#0f766e', themes: [{ id: 'default', name: 'Unified ERP', photo: photo('photo-1454165804606-c3d57bc86b40') }] },
  { id: 'saas', kind: 'software', software: ['saas'], name: 'SaaS Product', tagline: 'Subscriptions, tenants and billing', accent: '#7c5cff', themes: [{ id: 'default', name: 'LaunchPad SaaS', photo: photo('photo-1498050108023-c5249f4df085') }] },
  { id: 'custom', kind: 'software', software: ['custom'], name: 'Custom Software', tagline: 'Built around your exact workflow', accent: '#0d4697', themes: [{ id: 'default', name: 'Tailor Made', photo: photo('photo-1555066931-4365d14bab8c') }] },
  { id: 'management', kind: 'software', software: ['management'], name: 'Management Software', tagline: 'Teams, tasks and approvals in one place', accent: '#e07b00', themes: [{ id: 'default', name: 'Command Desk', photo: photo('photo-1552664730-d307ca884978') }] },
]

export const isThemeLive = (businessId, themeId) => Boolean(prototypes[businessId]?.[themeId])

export const getBusiness = (id) => businesses.find((b) => b.id === id) || null

export const getThemeKey = (businessId, themeId) => `${businessId}/${themeId}`

// Which ThemePreview layout a screenshot-less theme uses; offset per business
// so neighbouring cards differ.
export const previewVariant = (businessId, themeIndex) => businesses.findIndex((b) => b.id === businessId) + themeIndex

export function parseThemeKey(key) {
  const [businessId, themeId] = String(key || '').split('/')
  const business = getBusiness(businessId)
  const theme = business?.themes.find((t) => t.id === themeId)
  return business && theme ? { business, theme, key: getThemeKey(businessId, themeId) } : null
}

export const allThemes = () =>
  businesses.flatMap((b) => b.themes.map((t) => ({ business: b, theme: t, key: getThemeKey(b.id, t.id) })))
