// businessId -> themeId -> { title, load }. Each prototype is its own lazy chunk
// and owns its entire visual identity (no shared components between prototypes).
export const prototypes = {
  _sandbox: {
    default: {
      title: 'Pipeline sandbox',
      load: () => import('./_sandbox/index.jsx'),
    },
  },
  retail: { default: { title: 'Retail & E-Commerce', load: () => import('./retail/default/index.jsx') } },
  food: { default: { title: 'Food & Restaurant', load: () => import('./food/default/index.jsx') } },
  healthcare: { default: { title: 'Everwell Hospital', load: () => import('./healthcare/default/index.jsx') } },
  logistics: { default: { title: 'Route One Logistics', load: () => import('./logistics/default/index.jsx') } },
  pos: { default: { title: 'CounterFlow POS', load: () => import('./pos/default/index.jsx') } },
  realestate: { default: { title: 'Prestige Horizon Real Estate', load: () => import('./realestate/default/index.jsx') } },
}

import { lazy } from 'react'

const components = new Map()

// Lazy components are created once per prototype, outside of render.
export function getPrototypeComponent(businessId, themeId) {
  const entry = findPrototype(businessId, themeId)
  if (!entry) return null
  const key = `${businessId}/${themeId}`
  if (!components.has(key)) components.set(key, lazy(entry.load))
  return components.get(key)
}

export function findPrototype(businessId, themeId) {
  return prototypes[businessId]?.[themeId] ?? null
}
