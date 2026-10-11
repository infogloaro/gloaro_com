import { getBusiness, isThemeLive } from './catalog'

const photo = (id, width = 480) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`

// Mobile app templates shown on the home page. Each one is tied to an industry
// in catalog.js: its live web prototype doubles as the app's demo until the
// native demos ship.
export const appTemplates = [
  { id: 'food-delivery', name: 'Food Delivery App', tagline: 'Menus, cart and live order tracking', industry: 'food', accent: '#e0793a', thumb: photo('photo-1565299624946-b28f40a0ae38') },
  { id: 'grocery', name: 'Grocery & Shopping App', tagline: 'Quick checkout for everyday orders', industry: 'retail', accent: '#c2417a', thumb: photo('photo-1542838132-92c53300491e') },
  { id: 'doctor-booking', name: 'Doctor Booking App', tagline: 'Appointments, reports and reminders', industry: 'healthcare', accent: '#1aa6b7', thumb: photo('photo-1576091160399-112ba8d25d1d') },
  { id: 'courier', name: 'Courier Tracking App', tagline: 'Pickups and deliveries in real time', industry: 'logistics', accent: '#e5a50a', thumb: photo('photo-1580674285054-bed31e145f59') },
  { id: 'property', name: 'Property Finder App', tagline: 'Listings, visits and enquiries', industry: 'realestate', accent: '#8a6d3b', thumb: photo('photo-1600596542815-ffad4c1539a9') },
  { id: 'billing', name: 'Billing & Inventory App', tagline: 'GST bills and stock on your phone', industry: 'pos', accent: '#17a589', thumb: photo('photo-1556742049-0cfed4f6a45d') },
  { id: 'e-learning', name: 'E-Learning App', tagline: 'Courses, classes and progress', industry: 'education', accent: '#3b6fd8', thumb: photo('photo-1501504905252-473c47e087f8') },
  { id: 'hotel-booking', name: 'Hotel Booking App', tagline: 'Rooms, stays and travel plans', industry: 'hospitality', accent: '#0e7490', thumb: photo('photo-1566073771259-6a8506099945') },
].map((app) => {
  const theme = getBusiness(app.industry)?.themes[0]
  const live = Boolean(theme) && isThemeLive(app.industry, theme.id)
  return { ...app, key: `app/${app.id}`, demo: live ? `/prototypes/${app.industry}/${theme.id}` : null }
})

// Enquiry keys look like "app/<id>"; returns the same shape as parseThemeKey.
export function parseAppKey(key) {
  const [prefix, id] = String(key || '').split('/')
  const app = prefix === 'app' ? appTemplates.find((item) => item.id === id) : null
  return app ? { business: { name: 'Mobile app' }, theme: { name: app.name }, key: app.key } : null
}
