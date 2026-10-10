import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

/**
 * Runs GSAP setup scoped to `scope`, only when the visitor allows motion.
 * CSS holds every element's final state, so reduced-motion visitors see a complete static page.
 */
export function useMotion(scope, setup, deps = []) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(scope)
    mm.add(
      { motion: '(prefers-reduced-motion: no-preference)', mobile: '(max-width: 860px)' },
      (ctx) => (ctx.conditions.motion ? setup(ctx.conditions) : undefined),
    )
    return () => mm.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export const scrollToId = (id, reduced) => {
  const el = document.getElementById(id)
  if (!el) return
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: reduced ? 'auto' : 'smooth' })
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
