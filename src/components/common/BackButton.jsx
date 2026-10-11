import { ArrowLeft } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

// Floating "Back" pill in the top-right corner. Each layout passes `className`
// with the top offset that clears its own header. Goes back in history when the
// visitor navigated here inside the app; otherwise (opened by link or refresh)
// falls back to `fallback`.
export default function BackButton({ className = 'top-4', fallback = '/' }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  if (pathname === '/') return null

  const goBack = () => {
    if ((window.history.state?.idx ?? 0) > 0) navigate(-1)
    else navigate(fallback, { replace: true })
  }

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label="Go back"
      className={`group fixed right-3 z-[60] inline-flex items-center gap-1.5 rounded-full border border-[#0d4697]/15 bg-white/90 py-2 pl-2.5 pr-3.5 text-xs font-black uppercase tracking-[0.16em] text-[#0d4697] shadow-[0_10px_28px_-10px_rgba(13,70,151,0.45)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_32px_-10px_rgba(13,70,151,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffae13] sm:right-5 ${className}`}
    >
      <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" strokeWidth={2.5} />
      Back
    </button>
  )
}
