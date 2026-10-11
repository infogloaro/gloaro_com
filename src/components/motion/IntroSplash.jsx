import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import wordmark from '../../assets/logo-wordmark.webp'

const STORAGE_KEY = 'gloaro-intro-seen'
// When the assembled logo starts its flight to the navbar (seconds).
const HOLD = 1.6
const GOLD = '#DA9C25'
const NAVY = '#021D41'
const easeOut = [0.22, 1, 0.36, 1]
const easeInOut = [0.76, 0, 0.24, 1]

// The GloAro symbol is four figures (head + swoosh) around a globe, with
// four-fold rotational symmetry: one swoosh and one head, rotated 90° each
// time, alternating gold and navy. Coordinates are centred on the globe.
const SWOOSH = 'M -16 -35 L 14 -61 C 19 -66, 26 -67, 31 -62 L 63 -24 C 68 -18, 64 -12, 57 -15 C 38 -27, 14 -40, -16 -35 Z'
// Centre line of the swoosh; a thick stroke along it reveals the shape.
const SWOOSH_SPINE = 'M -18 -34 Q 24 -80 62 -18'
const FIGURES = [GOLD, NAVY, GOLD, NAVY]

// Where the symbol sits inside the full logo (526 × 404), so the assembled
// intro lines up exactly with the logo image in the navbar.
const MARK_BOX = { left: '25.95%', top: '-0.6%', width: '41.44%', height: '53.96%' }

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

function Mark() {
  return (
    <motion.div
      className="absolute"
      style={MARK_BOX}
      initial={{ rotate: -40, scale: 0.82 }}
      animate={{ rotate: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 55, damping: 12, delay: 0.05 }}
    >
      <svg viewBox="-100 -100 200 200" className="h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          {FIGURES.map((_, k) => (
            <mask key={k} id={`intro-swoosh-${k}`} maskUnits="userSpaceOnUse" x="-100" y="-100" width="200" height="200">
              <motion.path
                d={SWOOSH_SPINE}
                fill="none"
                stroke="#fff"
                strokeWidth="38"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease: easeOut, delay: 0.32 + k * 0.07 }}
              />
            </mask>
          ))}
        </defs>

        {/* The four figures walk in from the edges, then their arms reach out and join. */}
        {FIGURES.map((color, k) => (
          <g key={k} transform={`rotate(${k * 90})`}>
            <path d={SWOOSH} fill={color} mask={`url(#intro-swoosh-${k})`} />
            <motion.circle
              cx="4"
              r="11.5"
              fill={color}
              initial={{ cy: -190, opacity: 0 }}
              animate={{ cy: -83, opacity: 1 }}
              transition={{ cy: { duration: 0.62, ease: easeOut, delay: 0.04 + k * 0.07 }, opacity: { duration: 0.25, delay: 0.04 + k * 0.07 } }}
            />
          </g>
        ))}

        {/* The globe draws itself at the centre. */}
        <g fill="none" stroke={NAVY} strokeLinecap="round">
          <motion.circle r="28" strokeWidth="5.5" transform="rotate(-90)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease: easeOut, delay: 0.52 }} />
          <motion.ellipse rx="10" ry="28" strokeWidth="5" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.38, ease: easeOut, delay: 0.72 }} />
          {[-9.5, 9.5].map((y, i) => (
            <motion.line key={y} x1="-26.3" x2="26.3" y1={y} y2={y} strokeWidth="5" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.3, ease: easeOut, delay: 0.8 + i * 0.06 }} />
          ))}
        </g>
      </svg>
    </motion.div>
  )
}

// "The Gathering": on the first page view of a session, the four figures of
// the GloAro symbol come together around the globe, the wordmark opens from
// the centre, then the whole logo flies into its place in the navbar.
// About 2s in total; skippable by click or key; never shown with reduced motion.
export default function IntroSplash() {
  const [phase, setPhase] = useState(() => (shouldShow() ? 'in' : 'done'))
  const [flight, setFlight] = useState(null)
  const logoRef = useRef(null)

  useEffect(() => {
    if (phase !== 'in') return undefined
    remember()

    const leave = () => {
      const from = logoRef.current?.getBoundingClientRect()
      const to = document.querySelector('a[aria-label="Go to home page"] img')?.getBoundingClientRect()
      // Land exactly on the navbar logo when it's on screen; otherwise just recede.
      if (from && to && to.width > 0 && to.bottom > 0) {
        setFlight({
          x: to.left + to.width / 2 - (from.left + from.width / 2),
          y: to.top + to.height / 2 - (from.top + from.height / 2),
          scale: to.width / from.width,
        })
      } else {
        setFlight({ x: 0, y: -24, scale: 0.9 })
      }
      setPhase('out')
    }

    const timer = window.setTimeout(leave, HOLD * 1000)
    window.addEventListener('keydown', leave, { once: true })
    window.addEventListener('pointerdown', leave, { once: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', leave)
      window.removeEventListener('pointerdown', leave)
    }
  }, [phase])

  if (phase === 'done') return null
  const leaving = phase === 'out'

  return (
    <div role="presentation" className="pointer-events-auto fixed inset-0 z-[120] grid cursor-pointer place-items-center">
      {/* The stage lifts away like a curtain (with a gold leading edge) while the
          logo flies into the navbar, so the page is revealed by one movement. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, #ffffff 0%, #ffffff 35%, #eef3fb 100%)' }}
        animate={{ y: leaving ? '-101%' : '0%' }}
        transition={{ duration: 0.8, ease: easeInOut, delay: leaving ? 0.08 : 0 }}
      >
        <span className="absolute inset-x-0 bottom-0 h-[3px] bg-[linear-gradient(90deg,transparent,#DA9C25_20%,#DA9C25_80%,transparent)]" />
      </motion.div>

      <motion.div
        ref={logoRef}
        className="relative aspect-[526/404] w-[clamp(220px,46vw,340px)]"
        animate={leaving ? { ...flight, opacity: [1, 1, 0] } : { x: 0, y: 0, scale: 1, opacity: 1 }}
        transition={leaving ? { duration: 0.78, ease: easeInOut, opacity: { duration: 0.78, times: [0, 0.85, 1] } } : { duration: 0 }}
        onAnimationComplete={() => leaving && setPhase('done')}
      >
        <Mark />
        <motion.img
          src={wordmark}
          alt="Gloaro"
          width="526"
          height="194"
          className="absolute bottom-0 left-0 h-[48.02%] w-full"
          initial={{ clipPath: 'inset(0% 50% 0% 50%)', y: 6 }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)', y: 0 }}
          transition={{ duration: 0.65, ease: easeInOut, delay: 0.88 }}
        />
      </motion.div>

      <motion.button
        type="button"
        animate={{ opacity: leaving ? 0 : 1 }}
        className="absolute bottom-8 right-8 rounded-full border border-[#021D41]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#021D41]/60 hover:text-[#021D41]"
      >
        Skip
      </motion.button>
    </div>
  )
}
