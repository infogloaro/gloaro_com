import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { ArrowRight, Compass, X } from 'lucide-react'
import { Emblem } from '../mart/primitives'
import { ease } from '../../lib/motion'
import { useMediaQuery } from '../../hooks/useMotionEnv'
import { isExplorePath, platformForPath, platforms } from './exploreConfig'

const PANEL_TILT = 12 // degrees the desktop panel stays turned away from the viewer

// Desktop: the panel is hinged on the side nearest the tab and swings open,
// settling at a slight 3D turn (near edge taller, far edge receding).
// Mobile/tablet: a flat lift from the bottom pill.
const panelMotion = (tilted) => ({
  initial: tilted ? { opacity: 0, x: -14, rotateY: 38, transformPerspective: 1100 } : { opacity: 0, y: 12, scale: 0.97 },
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    ...(tilted ? { rotateY: PANEL_TILT, transformPerspective: 1100 } : {}),
    transition: { duration: tilted ? 0.5 : 0.32, ease: ease.entrance, staggerChildren: 0.05, delayChildren: 0.08 },
  },
  exit: { opacity: 0, ...(tilted ? { rotateY: 30, x: -10 } : { y: 8, scale: 0.98 }), transition: { duration: 0.18, ease: ease.exit } },
})

const itemMotion = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: ease.entrance } },
}

function PlatformLink({ platform, active, onSelect }) {
  const { Icon, name, description, href, accent, tint } = platform
  return (
    <motion.li variants={itemMotion}>
      <Link
        to={href}
        onClick={onSelect}
        aria-current={active ? 'true' : undefined}
        data-explore-item
        className={`group relative flex items-center gap-3 rounded-2xl p-3 outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-[#0b5cff] focus-visible:ring-offset-2 ${
          active ? 'bg-[#f1f6ff] ring-1 ring-[#0b5cff]/20' : 'hover:bg-slate-50'
        }`}
      >
        {active && <span className="absolute inset-y-3 left-0 w-1 rounded-full" style={{ background: accent }} aria-hidden="true" />}
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${tint} shadow-[inset_0_1px_0_#fff,0_6px_14px_-8px_rgba(11,36,81,0.35)] transition-transform duration-200 group-hover:scale-105`}
          style={{ color: platform.id === 'mart' ? '#b86e00' : accent }}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#071a3d]">{name}</span>
            {active && <span className="rounded-full bg-[#0b5cff] px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-white">You're here</span>}
          </span>
          <span className="mt-0.5 block text-xs leading-5 text-slate-500">{description}</span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition duration-200 group-hover:translate-x-0.5 group-hover:text-[#0b5cff]" aria-hidden="true" />
      </Link>
    </motion.li>
  )
}

/**
 * Floating "Explore" tab for switching between Gloaro Tech, Network and Mart.
 * Mounted once at the app shell so it persists across client-side navigation;
 * it only renders on public-facing routes (see exploreConfig).
 */
export default function GlobalExplore() {
  const { pathname } = useLocation()
  const panelId = useId()
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  // Open state is tied to the path it was opened on, so any navigation closes it.
  const [openPath, setOpenPath] = useState(null)
  const open = openPath === pathname
  const current = platformForPath(pathname)
  // Matches the lg breakpoint where the edge tab replaces the bottom pill.
  const desktop = useMediaQuery('(min-width: 1024px)')

  const close = useCallback((restoreFocus = false) => {
    setOpenPath(null)
    if (restoreFocus) triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const items = () => [...(rootRef.current?.querySelectorAll('[data-explore-item]') ?? [])]
    const frame = window.requestAnimationFrame(() => {
      const list = items()
      ;(list.find((item) => item.getAttribute('aria-current')) ?? list[0])?.focus()
    })
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) close()
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close(true)
        return
      }
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
      const list = items()
      const index = list.indexOf(document.activeElement)
      if (index === -1) return
      event.preventDefault()
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? list.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length
      list[next]?.focus()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, close])

  if (!isExplorePath(pathname)) return null

  const currentPlatform = platforms.find((platform) => platform.id === current)

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={rootRef}
        className="explore-root fixed z-[70] font-jakarta max-lg:bottom-[calc(1rem+env(safe-area-inset-bottom))] max-lg:left-[calc(1rem+env(safe-area-inset-left))] lg:left-0 lg:top-1/2 lg:-translate-y-1/2"
        data-lenis-prevent
      >
        <button
          ref={triggerRef}
          type="button"
          onClick={() => (open ? close() : setOpenPath(pathname))}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? 'Close Gloaro platform switcher' : `Explore Gloaro platforms${currentPlatform ? `, currently on ${currentPlatform.name}` : ''}`}
          className={`group relative flex items-center justify-center text-white outline-none transition-transform duration-300 focus-visible:ring-2 focus-visible:ring-[#ffb000] focus-visible:ring-offset-2
            max-lg:h-14 max-lg:gap-2 max-lg:rounded-full max-lg:pl-2 max-lg:pr-4
            max-lg:bg-[linear-gradient(160deg,#0b2451_0%,#071a3d_100%)] max-lg:shadow-[0_18px_40px_-14px_rgba(7,26,61,0.6),0_0_0_1.5px_rgba(255,176,0,0.85),inset_0_1px_0_rgba(255,255,255,0.12)]
            lg:h-[200px] lg:w-[50px] lg:flex-col lg:gap-1.5 lg:focus-visible:rounded-r-2xl lg:hover:translate-x-1 ${open ? 'lg:translate-x-1' : ''}`}
        >
          {/* Desktop handle: tall where it meets the screen edge, tapering to a
              edge and narrowing to a shorter flat face. */}
          <svg viewBox="0 0 50 200" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible max-lg:hidden" aria-hidden="true">
            <defs>
              <linearGradient id="explore-tab-fill" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#0f2d63" />
                <stop offset="0.55" stopColor="#0b2451" />
                <stop offset="1" stopColor="#071a3d" />
              </linearGradient>
              <filter id="explore-tab-shadow" x="-40%" y="-20%" width="200%" height="140%">
                <feDropShadow dx="4" dy="10" stdDeviation="8" floodColor="#071a3d" floodOpacity="0.35" />
              </filter>
            </defs>
            <path
              d="M0 0 L38 30 Q48 37 48 49 L48 151 Q48 163 38 170 L0 200 Z"
              fill="url(#explore-tab-fill)"
              filter="url(#explore-tab-shadow)"
            />
            <path
              d="M0 0 L38 30 Q48 37 48 49 L48 151 Q48 163 38 170 L0 200"
              fill="none"
              stroke="#ffb000"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
            
          </svg>
          <span className={`relative grid h-10 w-10 place-items-center rounded-full bg-white/8 ring-1 ring-white/15 transition-transform duration-500 lg:h-7 lg:w-7 ${open ? 'rotate-[135deg]' : 'group-hover:rotate-45'}`}>
            <Compass className="h-5 w-5 text-[#ffb000] lg:h-4 lg:w-4" aria-hidden="true" />
          </span>
          <span className="relative text-[9px] font-bold tracking-wide max-lg:text-sm">Explore</span>
          {currentPlatform && (
            <span className="relative h-1.5 w-1.5 rounded-full max-lg:hidden" style={{ background: currentPlatform.accent }} aria-hidden="true" />
          )}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              id={panelId}
              key="explore-panel"
              {...panelMotion(desktop)}
              style={desktop ? { transformOrigin: 'left center' } : undefined}
              role="dialog"
              aria-label="Explore Gloaro platforms"
              className="absolute w-[min(340px,calc(100vw-2rem))] origin-left overflow-hidden rounded-3xl border border-white/80 bg-white/[0.97] shadow-[0_30px_70px_-24px_rgba(7,26,61,0.45),0_2px_8px_rgba(7,26,61,0.06)] backdrop-blur-xl
                max-lg:bottom-[calc(100%+0.75rem)] max-lg:left-0 max-lg:origin-bottom-left
                lg:left-[calc(100%+0.75rem)] lg:top-1/2 lg:-translate-y-1/2"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <p className="flex items-center gap-2 text-sm font-bold text-[#071a3d]">
                  <Compass className="h-4 w-4 text-[#0b5cff]" aria-hidden="true" />
                  Explore Gloaro
                </p>
                <button
                  type="button"
                  onClick={() => close(true)}
                  aria-label="Close"
                  className="grid h-8 w-8 place-items-center rounded-full text-slate-400 outline-none transition hover:bg-slate-100 hover:text-[#071a3d] focus-visible:ring-2 focus-visible:ring-[#0b5cff]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <nav aria-label="Gloaro platforms">
                <ul className="space-y-1 p-2">
                  {platforms.map((platform) => (
                    <PlatformLink key={platform.id} platform={platform} active={platform.id === current} onSelect={() => close()} />
                  ))}
                </ul>
              </nav>
              <p className="flex items-center gap-2 border-t border-slate-100 bg-slate-50/70 px-4 py-2.5 text-[11px] font-medium text-slate-500">
                <Emblem className="h-4 w-4" />
                One ecosystem · Endless opportunities
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
