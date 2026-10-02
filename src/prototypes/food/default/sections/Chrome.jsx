import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { gsap, useMotion } from '../motion'
import { BRAND } from '../data'

// White canvas that feels alive: drifting light, flowing hairlines, grain and a few motes.
export function LiveBackground() {
  const root = useRef(null)
  useMotion(root, () => {
    const blobs = gsap.utils.toArray('.me-blob')
    const movers = blobs.map((b, i) => ({
      x: gsap.quickTo(b, 'x', { duration: 2.4 + i * 0.6, ease: 'power3.out' }),
      y: gsap.quickTo(b, 'y', { duration: 2.4 + i * 0.6, ease: 'power3.out' }),
    }))
    const onMove = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      movers.forEach((m, i) => { m.x(nx * (60 + i * 40)); m.y(ny * (40 + i * 30)) })
    }
    window.addEventListener('pointermove', onMove)
    gsap.to('.me-lines', { yPercent: -18, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } })
    return () => window.removeEventListener('pointermove', onMove)
  })

  return (
    <div ref={root} className="me-bg" aria-hidden="true">
      <div className="me-blob b1" />
      <div className="me-blob b2" />
      <div className="me-blob b3" />
      <div className="me-sheen" />
      <svg className="me-lines" viewBox="0 0 1440 2400" preserveAspectRatio="none">
        <path d="M-50 300 C 300 180, 520 520, 860 380 S 1300 160, 1500 320" />
        <path d="M-50 1100 C 260 980, 620 1300, 980 1120 S 1340 980, 1500 1080" />
        <path d="M-50 1900 C 380 1760, 700 2080, 1040 1900 S 1360 1800, 1500 1860" />
      </svg>
      {Array.from({ length: 14 }, (_, i) => <i key={i} className="me-mote" style={{ '--i': i }} />)}
      <div className="me-grain" />
    </div>
  )
}

const NAV_LINKS = [
  ['signature', 'Signature'],
  ['story', 'The Fire'],
  ['menu', 'Menu'],
  ['reserve', 'Reserve'],
  ['chef', 'The Chef'],
  ['visit', 'Visit'],
]

export function Nav({ go, listCount }) {
  const [open, setOpen] = useState(false)
  const progress = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const jump = (id) => {
    setOpen(false)
    // let the overlay start closing before the page moves
    setTimeout(() => go(id), 250)
  }

  return (
    <>
      <div className="me-progress" ref={progress} />
      <header className="me-nav">
        <button className="me-wordmark" onClick={() => go('top')} aria-label="Back to top">
          Maison <em>Ember</em>
        </button>
        <span className="me-nav-mid">Oak fire · {BRAND.city}</span>
        <div className="me-nav-right">
          <button className="me-nav-link" onClick={() => setOpen(true)} aria-expanded={open}>Menu</button>
          <button className="me-pill" onClick={() => go('reserve')}>
            Reserve{listCount > 0 && <span className="me-pill-count">{listCount}</span>}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="me-overlay"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(100% 0 0 0)' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <button className="me-overlay-close" onClick={() => setOpen(false)}>Close</button>
            <nav>
              {NAV_LINKS.map(([id, label], i) => (
                <div key={id} className="me-overlay-mask">
                  <motion.button
                    className="me-overlay-link"
                    onClick={() => jump(id)}
                    initial={{ x: i % 2 ? '60%' : '-60%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.25 + i * 0.06, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="me-overlay-num">0{i + 1}</span>{label}
                  </motion.button>
                </div>
              ))}
            </nav>
            <div className="me-overlay-foot">
              <span>{BRAND.address.join(', ')}</span>
              <a href={`tel:${BRAND.phone.replace(/\s/g, '')}`}>{BRAND.phone}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Soft follower ring for fine pointers. It labels media ("Play", "View") via data-cursor.
export function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 400, damping: 35 })
  const sy = useSpring(y, { stiffness: 400, damping: 35 })
  const [label, setLabel] = useState('')
  const [enabled] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches)

  useEffect(() => {
    if (!enabled) return undefined
    const move = (e) => { x.set(e.clientX); y.set(e.clientY) }
    const over = (e) => setLabel(e.target.closest?.('[data-cursor]')?.dataset.cursor || '')
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
    }
  }, [enabled, x, y])

  if (!enabled) return null
  return (
    <motion.div className={`me-cursor ${label ? 'has-label' : ''}`} style={{ x: sx, y: sy }} aria-hidden="true">
      <span>{label}</span>
    </motion.div>
  )
}
