import { useCallback, useEffect, useId, useSyncExternalStore } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { ambient } from '../lib/motion'

export function useMediaQuery(query) {
  const subscribe = useCallback((callback) => {
    const list = window.matchMedia(query)
    list.addEventListener('change', callback)
    return () => list.removeEventListener('change', callback)
  }, [query])
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false)
}

// True only on devices with a real hover-capable pointer (desktop mouse/trackpad).
// Tilt, magnetic buttons and the cursor follower are gated on this.
export function useCanHover() {
  return useMediaQuery('(hover: hover) and (pointer: fine)')
}

function subscribeVisibility(callback) {
  document.addEventListener('visibilitychange', callback)
  return () => document.removeEventListener('visibilitychange', callback)
}

export function usePageVisible() {
  return useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState !== 'hidden',
    () => true,
  )
}

// Hover-driven 3D/pointer effects: desktop pointer and motion allowed.
export function usePointerEffects() {
  const reduce = useReducedMotion()
  const canHover = useCanHover()
  return canHover && !reduce
}

// --- Ambient budget -------------------------------------------------------
// Continuous loops register here while they are on screen. Only the
// highest-priority `ambient.maxConcurrent` of them are allowed to run, so a
// viewport never has more than two ambient effects going at once.

const claims = new Map()
const listeners = new Set()
let sequence = 0
let allowed = new Set()

function recompute() {
  const ranked = [...claims.entries()]
    .sort(([, a], [, b]) => b.priority - a.priority || a.order - b.order)
    .slice(0, ambient.maxConcurrent)
    .map(([id]) => id)
  allowed = new Set(ranked)
  listeners.forEach((listener) => listener())
}

function subscribeBudget(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// Returns true when this ambient effect may animate: it is in view, the tab is
// visible, reduced motion is off, and it fits within the concurrency budget.
export function useAmbient(ref, { priority = 1, amount = 0.25 } = {}) {
  const id = useId()
  const reduce = useReducedMotion()
  const inView = useInView(ref, { amount })
  const visible = usePageVisible()
  const wants = inView && visible && !reduce

  useEffect(() => {
    if (!wants) return undefined
    claims.set(id, { priority, order: sequence++ })
    recompute()
    return () => {
      claims.delete(id)
      recompute()
    }
  }, [id, priority, wants])

  const granted = useSyncExternalStore(subscribeBudget, () => allowed.has(id), () => false)
  return wants && granted
}
