import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scroll to a #hash once its (possibly lazy) section has mounted.
export function useHashScroll() {
  const { hash } = useLocation()
  useEffect(() => {
    const id = hash.slice(1)
    if (!id) return undefined
    let frame
    const started = performance.now()
    const tryScroll = () => {
      const target = document.getElementById(id)
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      else if (performance.now() - started < 3000) frame = window.requestAnimationFrame(tryScroll)
    }
    frame = window.requestAnimationFrame(tryScroll)
    return () => window.cancelAnimationFrame(frame)
  }, [hash])
}
