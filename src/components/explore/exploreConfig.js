// Platforms reachable from the global Explore tab, and the routes where the tab
// is shown. Destinations are the existing landing pages for each platform.

import { Code2, Network, ShoppingBag } from 'lucide-react'

export const platforms = [
  {
    id: 'tech',
    name: 'Gloaro Tech',
    description: 'Technology, software development and digital solutions.',
    href: '/',
    Icon: Code2,
    accent: '#0b5cff',
    tint: 'from-[#e6efff] to-[#f4f8ff]',
  },
  {
    id: 'network',
    name: 'Gloaro Network',
    description: 'Business networking, digital services and business connections.',
    href: '/network',
    Icon: Network,
    accent: '#0b469e',
    tint: 'from-[#e3ecfb] to-[#f3f7fd]',
  },
  {
    id: 'mart',
    name: 'Gloaro Mart',
    description: 'B2B and B2C marketplace for products, vendors and local shopping.',
    href: '/mart',
    Icon: ShoppingBag,
    accent: '#ffb000',
    tint: 'from-[#fff3d6] to-[#fffaf0]',
  },
]

const matches = (pathname, prefixes) => prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))

// The live marketplace (shop, listings, cart, orders) belongs to Mart.
const MART_ROUTES = ['/mart', '/products', '/nearby', '/categories', '/vendors', '/services', '/cart', '/wishlist', '/checkout', '/orders', '/reviews']
// Membership and community pages belong to Network.
const NETWORK_ROUTES = ['/network', '/membership-agreement', '/membership-application', '/membership-applications', '/membership-qualification', '/events']
// Company pages that belong to Tech (the home page is matched exactly).
const TECH_ROUTES = ['/solutions', '/contact', '/about', '/terms-and-conditions', '/privacy-policy', '/shipping-policy', '/cancellation-refund-policy']

export function platformForPath(pathname) {
  if (matches(pathname, MART_ROUTES)) return 'mart'
  if (matches(pathname, NETWORK_ROUTES)) return 'network'
  if (pathname === '/' || matches(pathname, TECH_ROUTES)) return 'tech'
  return null
}

// Public-facing pages only: auth screens, dashboards, admin consoles and the
// full-screen prototype viewer never show the tab.
export function isExplorePath(pathname) {
  return platformForPath(pathname) !== null
}
