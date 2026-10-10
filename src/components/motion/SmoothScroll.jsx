import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import 'lenis/dist/lenis.css'
import { useCanHover } from '../../hooks/useMotionEnv'

// Inertia scrolling for the public site. Desktop pointer only: touch devices
// keep their native scroll, and reduced-motion users get the browser default.
// Lenis is driven from GSAP's ticker so ScrollTrigger pins stay in lockstep.
// GSAP + Lenis are loaded on demand so mobile visitors never download them.
export default function SmoothScroll() {
  const { pathname } = useLocation()
  const reduce = useReducedMotion()
  const canHover = useCanHover()
  const enabled = canHover && !reduce

  useEffect(() => {
    if (!enabled) return undefined
    let cancelled = false
    let cleanup
    Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('lenis')]).then(
      ([{ default: gsap }, { ScrollTrigger }, { default: Lenis }]) => {
        if (cancelled) return
        gsap.registerPlugin(ScrollTrigger)
        const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: { offset: -112 } })
        const tick = (time) => lenis.raf(time * 1000)
        lenis.on('scroll', ScrollTrigger.update)
        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)
        window.__lenis = lenis
        cleanup = () => {
          gsap.ticker.remove(tick)
          lenis.destroy()
          delete window.__lenis
        }
      },
    )
    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [enabled])

  // Route changes land at the top instantly, matching the app's ScrollToTop.
  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true })
  }, [pathname])

  return null
}
