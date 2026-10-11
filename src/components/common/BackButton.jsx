import { useLayoutEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const GAP = 10
const EDGE = 16

// Floating "Back" pill pinned to the right, just under the page header. Any
// header marked `data-back-anchor` is tracked (it may scroll, shrink or hide),
// so the button always sits right below its bottom edge; pages without one get
// it in the top-right corner. Goes back in history when the visitor navigated
// here inside the app; otherwise (opened by link or refresh) falls back to `fallback`.
export default function BackButton({ fallback = '/' }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [top, setTop] = useState(EDGE)

  useLayoutEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const header = document.querySelector('[data-back-anchor]')
      const bottom = header ? header.getBoundingClientRect().bottom : 0
      setTop(Math.max(EDGE, Math.round(bottom) + GAP))
    }
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(measure) }
    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // Headers animate in or change height after mount; re-measure when they do.
    const observer = new ResizeObserver(schedule)
    const header = document.querySelector('[data-back-anchor]')
    if (header) observer.observe(header)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      observer.disconnect()
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [pathname])

  const goBack = () => {
    if ((window.history.state?.idx ?? 0) > 0) navigate(-1)
    else navigate(fallback, { replace: true })
  }

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label="Go back"
      style={{ top }}
      className="group fixed right-3 z-[60] inline-flex items-center gap-1.5 rounded-full border border-[#0d4697]/15 bg-white/90 py-2 pl-2.5 pr-3.5 text-xs font-black uppercase tracking-[0.16em] text-[#0d4697] shadow-[0_10px_28px_-10px_rgba(13,70,151,0.45)] backdrop-blur transition-[background-color,box-shadow,translate] hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_32px_-10px_rgba(13,70,151,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffae13] sm:right-5"
    >
      <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" strokeWidth={2.5} />
      Back
    </button>
  )
}
