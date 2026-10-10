import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ease } from '../../lib/motion'
import logo from '../../assets/logo-transparent.webp'

const STORAGE_KEY = 'gloaro-intro-seen'
const TOTAL_MS = 1100

function shouldShow() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    return !window.sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return false
  }
}

function remember() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // Storage blocked: the intro may show again next visit, which is harmless.
  }
}

// Branded intro on the first page view of a session: a ring draws around the
// logo, then the overlay lifts away. Under 1.2s, skippable by click or key.
export default function IntroSplash() {
  const [visible, setVisible] = useState(shouldShow)

  useEffect(() => {
    if (!visible) return undefined
    remember()
    const skip = () => setVisible(false)
    const timer = window.setTimeout(skip, TOTAL_MS)
    window.addEventListener('keydown', skip)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', skip)
    }
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          role="presentation"
          onClick={() => setVisible(false)}
          exit={{ opacity: 0, y: '-4%' }}
          transition={{ duration: 0.35, ease: ease.exit }}
          className="fixed inset-0 z-[120] grid cursor-pointer place-items-center bg-[#061633]"
        >
          <div className="relative grid h-40 w-40 place-items-center">
            <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
              <motion.circle
                cx="50"
                cy="50"
                r="47"
                fill="none"
                stroke="#ffae13"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, ease: ease.entrance }}
              />
            </svg>
            <motion.img
              src={logo}
              alt="Gloaro"
              width="526"
              height="404"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: ease.entrance, delay: 0.2 }}
              className="h-auto w-24"
            />
          </div>
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="absolute bottom-8 right-8 rounded-full border border-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white/70 hover:text-white"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
