import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Maps scroll position of `triggerRef` to a 0..1 value stored in a ref, so a
 * three.js `useFrame` loop can read it without re-rendering React.
 * Usage: const { triggerRef, progress } = useScrollProgress(); camera.z = lerp(..., progress.current)
 */
export function useScrollProgress({ start = 'top top', end = 'bottom bottom', scrub = 1 } = {}) {
  const triggerRef = useRef(null)
  const progress = useRef(0)

  useLayoutEffect(() => {
    if (!triggerRef.current) return undefined
    const st = ScrollTrigger.create({
      trigger: triggerRef.current,
      start,
      end,
      scrub,
      onUpdate: (self) => {
        progress.current = self.progress
      },
    })
    return () => st.kill()
  }, [start, end, scrub])

  return { triggerRef, progress }
}
