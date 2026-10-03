import { createContext, useCallback, useContext, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { findProduct } from './data/catalog'

export const StoreContext = createContext(null)
export const useStore = () => useContext(StoreContext)

export const lineKey = (l) => [l.id, l.color ?? 0, l.size ?? '', l.extra ?? 0].join('|')

/** Price of a bag line, including paid variant upgrades (e.g. laptop memory). */
export function linePrice(l) {
  const p = findProduct(l.id)
  const delta = p?.variants?.extra?.options?.[l.extra ?? 0]?.priceDelta ?? 0
  return (p?.price ?? 0) + delta
}

export function initialState() {
  return { bag: [], wishlist: [], compare: [], address: null, pincode: '', delivery: 'standard', order: null, toast: null }
}

export function reducer(s, a) {
  switch (a.type) {
    case 'add': {
      const key = lineKey(a.line)
      const exists = s.bag.find((l) => lineKey(l) === key)
      const bag = exists
        ? s.bag.map((l) => (lineKey(l) === key ? { ...l, qty: Math.min(10, l.qty + (a.line.qty || 1)) } : l))
        : [...s.bag, { ...a.line, qty: a.line.qty || 1 }]
      return { ...s, bag }
    }
    case 'qty':
      return { ...s, bag: a.qty <= 0 ? s.bag.filter((l) => lineKey(l) !== a.key) : s.bag.map((l) => (lineKey(l) === a.key ? { ...l, qty: Math.min(10, a.qty) } : l)) }
    case 'remove':
      return { ...s, bag: s.bag.filter((l) => lineKey(l) !== a.key) }
    case 'wish':
      return { ...s, wishlist: s.wishlist.includes(a.id) ? s.wishlist.filter((x) => x !== a.id) : [...s.wishlist, a.id] }
    case 'compare': {
      if (s.compare.includes(a.id)) return { ...s, compare: s.compare.filter((x) => x !== a.id) }
      if (s.compare.length >= 3) return { ...s, toast: { text: 'You can compare up to 3 products', at: Date.now() } }
      return { ...s, compare: [...s.compare, a.id] }
    }
    case 'clearCompare':
      return { ...s, compare: [] }
    case 'address':
      return { ...s, address: a.address, pincode: a.address.pincode }
    case 'pincode':
      return { ...s, pincode: a.pincode }
    case 'delivery':
      return { ...s, delivery: a.delivery }
    case 'order':
      return { ...s, order: a.order, bag: [] }
    case 'toast':
      return { ...s, toast: a.text ? { text: a.text, at: Date.now() } : null }
    default:
      return s
  }
}

/**
 * View routing lives in the query string (?v=product&id=camera), so browser back and
 * forward move through the shopping journey like separate pages.
 */
export function useNav() {
  const [params, setParams] = useSearchParams()
  const view = params.get('v') || 'home'
  const go = useCallback((v, extra = {}, opts = {}) => {
    const next = new URLSearchParams()
    if (v !== 'home') next.set('v', v)
    for (const [k, val] of Object.entries(extra)) if (val !== undefined && val !== null && val !== '') next.set(k, String(val))
    setParams(next, { replace: Boolean(opts.replace) })
    if (!opts.keepScroll) window.scrollTo({ top: 0, behavior: 'auto' })
  }, [setParams])
  return useMemo(() => ({ view, params, go, back: () => window.history.back() }), [view, params, go])
}
