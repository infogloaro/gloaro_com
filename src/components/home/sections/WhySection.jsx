import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Layers, LayoutGrid, Pointer } from 'lucide-react'
import { transition, viewportOnce } from '../../../lib/motion'
import { useCanHover, useMediaQuery } from '../../../hooks/useMotionEnv'
import DrawIcon from '../../motion/DrawIcon'
import { TiltCard } from '../../motion/Interactive'
import { SectionEnter } from '../../motion/Scroll'
import { whyChoose } from '../homeData'
import SectionHeading from './SectionHeading'

const CARD_WIDTH = 340
const STAGGER = 0.055
// Finger hint timing: delay before the first press, then the gap between presses.
const HINT_FIRST_MS = 1500
const HINT_TAP_EVERY_MS = 3500
const deckSpring = { type: 'spring', stiffness: 170, damping: 22, mass: 0.9 }

function CardBody({ Icon, title, description, delay }) {
  return (
    <div className="flex items-start gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#ffae13]/15 text-[#e07b00] transition-transform duration-300 group-hover/tilt:rotate-12">
        <DrawIcon icon={Icon} className="h-6 w-6" delay={delay} />
      </span>
      <div>
        <h3 className="text-base font-extrabold text-[#0d4697]">{title}</h3>
        <p className="mt-1 text-sm font-medium leading-6 text-slate-600">{description}</p>
      </div>
    </div>
  )
}

// Spread: the cards split into one straight horizontal row (no arc, no tilt).
// When six full cards don't fit, they overlap evenly and the hovered or
// tapped card comes to the front.
function rowLayout(count, stageWidth) {
  const spacing = Math.min(CARD_WIDTH + 24, Math.max(60, (stageWidth - CARD_WIDTH) / Math.max(1, count - 1)))
  return Array.from({ length: count }, (_, i) => ({
    x: (i - (count - 1) / 2) * spacing,
    y: 0,
    rotate: 0,
  }))
}

// Collapsed: every card tucked behind the front one with a sliver showing.
function stackLayout(count) {
  return Array.from({ length: count }, (_, i) => {
    const depth = count - 1 - i
    return { x: 0, y: -depth * 6, rotate: depth % 2 ? -depth * 0.8 : depth * 0.8, scale: 1 - depth * 0.025 }
  })
}

// Tablets and desktops: the cards are a deck. Hover or tap spreads them into a
// straight row; click pins them open.
function CardDeck() {
  const stageRef = useRef(null)
  const canHover = useCanHover()
  const [stageWidth, setStageWidth] = useState(1200)
  const [hover, setHover] = useState(false)
  const [open, setOpen] = useState(false)
  const [hoverMuted, setHoverMuted] = useState(false)
  const [front, setFront] = useState(null)
  // The finger hint shows whenever the deck is stacked. It stays put and every
  // few seconds presses once (`tap` remounts the press and ripple so they play
  // a single time). The first press after the deck closes fires straight away.
  const [tap, setTap] = useState(0)
  const count = whyChoose.length
  const expanded = open || (hover && !hoverMuted)

  useEffect(() => {
    if (expanded) return undefined
    const timer = window.setTimeout(() => setTap((n) => n + 1), tap === 0 ? HINT_FIRST_MS : HINT_TAP_EVERY_MS)
    return () => window.clearTimeout(timer)
  }, [expanded, tap])

  useEffect(() => {
    const node = stageRef.current
    if (!node) return undefined
    const observer = new ResizeObserver(([entry]) => setStageWidth(entry.contentRect.width))
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const row = rowLayout(count, stageWidth)
  const stack = stackLayout(count)

  // First click pins the fan open (even if hover already spread it); the next
  // click collapses it although the pointer is still inside. Hover re-arms on leave.
  const toggle = () => {
    if (open) {
      setOpen(false)
      setHover(false)
      setHoverMuted(true)
      setFront(null)
      setTap((n) => n + 1)
    } else {
      setOpen(true)
    }
  }
  const onLeave = () => {
    setHover(false)
    setHoverMuted(false)
    setFront(null)
    if (!open) setTap((n) => n + 1)
  }

  return (
    <div
      ref={stageRef}
      onPointerLeave={canHover ? onLeave : undefined}
      className="relative mt-12 py-10"
      style={{ perspective: 1600 }}
    >
      {/* Table: a soft spotlight that widens with the fan, a faint dot grid and a floor shadow. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-visible">
        <motion.div
          animate={{ scaleX: expanded ? 1 : 0.42, opacity: expanded ? 1 : 0.7 }}
          transition={deckSpring}
          className="absolute left-1/2 top-1/2 h-[420px] w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,211,110,0.45)_0%,rgba(158,193,255,0.22)_45%,transparent_72%)] blur-2xl"
        />
        <div className="absolute inset-x-[10%] inset-y-0 bg-[radial-gradient(circle,rgba(13,70,151,0.14)_1px,transparent_1.5px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
        <motion.div
          animate={{ scaleX: expanded ? 1 : 0.35, opacity: expanded ? 0.5 : 0.35 }}
          transition={deckSpring}
          className="absolute bottom-[12%] left-1/2 h-10 w-[1000px] -translate-x-1/2 rounded-[100%] bg-[#0d4697] blur-2xl"
        />
      </div>

      <motion.div
        animate={expanded ? { y: 0 } : { y: [0, -10, 0] }}
        transition={expanded ? deckSpring : { duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="grid place-items-center"
      >
        {whyChoose.map(([Icon, title, description], i) => {
          const target = expanded ? row[i] : stack[i]
          const isFront = i === count - 1
          const order = count - 1 - i
          return (
            <motion.div
              key={title}
              onPointerEnter={canHover ? () => { setHover(true); if (expanded) setFront(i) } : undefined}
              onClick={() => {
                if (expanded && !canHover && front !== i) setFront(i)
                else toggle()
              }}
              role={isFront ? 'button' : undefined}
              aria-expanded={isFront ? expanded : undefined}
              aria-label={isFront ? (expanded ? 'Stack the cards' : 'Spread the cards') : undefined}
              tabIndex={isFront ? 0 : -1}
              onKeyDown={isFront ? (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle() } } : undefined}
              initial={false}
              animate={{
                x: target.x,
                y: target.y,
                rotate: target.rotate,
                scale: expanded ? (front === i ? 1.06 : 1.02) : target.scale,
                z: expanded ? order * 2 : 0,
                boxShadow: expanded
                  ? '0 30px 60px -20px rgba(13,70,151,0.35), 0 12px 24px -12px rgba(15,23,42,0.18)'
                  : `0 ${10 + order * 2}px ${30 + order * 4}px -${12 + order * 2}px rgba(13,70,151,0.28)`,
              }}
              whileHover={expanded ? { y: target.y - 14 } : undefined}
              transition={{
                ...deckSpring,
                delay: expanded ? (isFront ? 0 : 0.12 + order * STAGGER) : order * STAGGER * 0.6,
              }}
              style={{
                width: CARD_WIDTH,
                zIndex: front === i ? count + 1 : i,
                transformOrigin: '50% 100%',
                transformStyle: 'preserve-3d',
                cursor: expanded ? 'default' : 'pointer',
              }}
              className="relative col-start-1 row-start-1 rounded-2xl outline-none ring-[#ffae13] focus-visible:ring-2"
            >
              {isFront && (
                <AnimatePresence>
                  {!expanded && (
                    <motion.span
                      aria-hidden="true"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.25 } }}
                      className="pointer-events-none absolute -bottom-9 right-6 z-20 flex flex-col items-center"
                    >
                      {/* One press per `tap`: ripple rings on the card edge, finger dips in once. */}
                      <span className="relative block h-3 w-3">
                        {tap > 0 && [0, 1].map((ring) => (
                          <motion.span
                            key={`${tap}-${ring}`}
                            initial={{ scale: 0.4, opacity: 0.7 }}
                            animate={{ scale: 2.8, opacity: 0 }}
                            transition={{ duration: 1.1, delay: 0.35 + ring * 0.25, ease: 'easeOut' }}
                            className="absolute inset-0 rounded-full border-2 border-[#ffae13]"
                          />
                        ))}
                      </span>
                      <motion.span
                        key={tap}
                        initial={{ y: 8, rotate: -18, scale: 1 }}
                        animate={tap > 0 ? { y: [8, -6, 8], rotate: [-18, -8, -18], scale: [1, 0.9, 1] } : undefined}
                        transition={{ duration: 1.1, ease: 'easeInOut' }}
                        className="-mt-3 text-[#0d4697] drop-shadow-[0_6px_10px_rgba(13,70,151,0.35)]"
                      >
                        <Pointer className="h-9 w-9 fill-white" strokeWidth={1.75} />
                      </motion.span>
                    </motion.span>
                  )}
                </AnimatePresence>
              )}
              <TiltCard
                max={expanded ? 5 : 0}
                glow="rgba(255,174,19,0.2)"
                className="rounded-2xl bg-gradient-to-br from-white to-[#0d4697]/20"
                innerClassName="bg-[linear-gradient(160deg,#ffffff_0%,#fbfcff_55%,#f3f7ff_100%)] p-6"
              >
                <CardBody Icon={Icon} title={title} description={description} delay={200 + order * 60} />
              </TiltCard>
            </motion.div>
          )
        })}
      </motion.div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={toggle}
          className="inline-flex items-center gap-2 rounded-full border border-[#0d4697]/10 bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#0d4697] shadow-sm backdrop-blur transition-colors hover:bg-white"
        >
          {expanded ? <Layers className="h-3.5 w-3.5" /> : <LayoutGrid className="h-3.5 w-3.5" />}
          {expanded ? 'Stack cards' : 'Spread cards'}
        </button>
      </div>
    </div>
  )
}

// Phones: one card on top; a tap splits the deck into a horizontal row you can
// swipe through.
function PhoneDeck() {
  const [open, setOpen] = useState(false)
  const count = whyChoose.length
  const stack = stackLayout(count)

  return (
    <div className="mt-10">
      <AnimatePresence mode="wait" initial={false}>
        {!open ? (
          <motion.button
            key="stack"
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Spread the cards"
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
            className="relative mx-auto grid w-full max-w-[340px] place-items-center pb-12 pt-6 text-left"
          >
            {whyChoose.map(([Icon, title, description], i) => {
              const order = count - 1 - i
              return (
                <motion.div
                  key={title}
                  initial={false}
                  animate={{ y: stack[i].y, rotate: stack[i].rotate, scale: stack[i].scale }}
                  transition={deckSpring}
                  style={{ zIndex: i }}
                  className="col-start-1 row-start-1 w-full rounded-2xl bg-[linear-gradient(160deg,#ffffff_0%,#fbfcff_55%,#f3f7ff_100%)] p-5 shadow-[0_14px_30px_-14px_rgba(13,70,151,0.35)] ring-1 ring-[#0d4697]/10"
                >
                  <CardBody Icon={Icon} title={title} description={description} delay={200 + order * 60} />
                </motion.div>
              )
            })}
            <span className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-[#0d4697] shadow-sm">
              <Pointer aria-hidden="true" className="h-3.5 w-3.5" /> Tap to spread
            </span>
          </motion.button>
        ) : (
          <motion.div key="row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ul className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none]">
              {whyChoose.map(([Icon, title, description], i) => (
                <motion.li
                  key={title}
                  initial={{ opacity: 0, x: -i * 60, scale: 0.94 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ ...deckSpring, delay: i * STAGGER }}
                  className="w-[82%] shrink-0 snap-center"
                >
                  <div className="h-full rounded-2xl bg-[linear-gradient(160deg,#ffffff_0%,#fbfcff_55%,#f3f7ff_100%)] p-5 shadow-[0_14px_30px_-14px_rgba(13,70,151,0.35)] ring-1 ring-[#0d4697]/10">
                    <CardBody Icon={Icon} title={title} description={description} delay={200} />
                  </div>
                </motion.li>
              ))}
            </ul>
            <p className="mt-1 text-center text-xs font-semibold text-slate-500">Swipe to see all {count}</p>
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 rounded-full border border-[#0d4697]/10 bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#0d4697] shadow-sm"
              >
                <Layers className="h-3.5 w-3.5" /> Stack cards
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Reduced motion: the plain responsive grid.
function CardGrid() {
  return (
    <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {whyChoose.map(([Icon, title, description], index) => (
        <motion.li
          key={title}
          className="h-full"
          initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60, rotateY: index % 2 === 0 ? 12 : -12 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          viewport={viewportOnce}
          transition={{ ...transition.entranceLong, delay: (index % 3) * 0.08 }}
          style={{ transformPerspective: 1200 }}
        >
          <TiltCard glow="rgba(255,174,19,0.2)" className="rounded-2xl bg-[#0d4697]/10 shadow-sm" innerClassName="bg-white p-6">
            <CardBody Icon={Icon} title={title} description={description} delay={200 + (index % 3) * 80} />
          </TiltCard>
        </motion.li>
      ))}
    </ul>
  )
}

export default function WhySection() {
  const reduce = useReducedMotion()
  const wide = useMediaQuery('(min-width: 768px)')

  return (
    <section id="why" className="scroll-mt-28 overflow-x-clip bg-[#fdf9e9] px-5 py-16 sm:py-24 lg:px-8">
      <SectionEnter className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="The Gloaro difference" title="Why choose Gloaro" highlight="Gloaro" />
        {reduce ? <CardGrid /> : wide ? <CardDeck /> : <PhoneDeck />}
      </SectionEnter>
    </section>
  )
}
