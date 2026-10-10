import { useEffect, useRef, useState } from 'react'

// Shared scroll-reveal styling primitive. Keeps every section's entrance
// consistent (fade + rise) without repeating IntersectionObserver wiring.
export function useInViewOnce(threshold = 0.05) {
  const ref = useRef(null)
  const [inView, setInView] = useState(() => typeof window === 'undefined' || !('IntersectionObserver' in window))
  useEffect(() => {
    if (inView) return undefined
    const el = ref.current
    if (!el) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        observer.disconnect()
      }
    }, { threshold })
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, inView])
  return [ref, inView]
}
