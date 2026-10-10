import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Check } from 'lucide-react'
import { ease, spring, stagger, transition, viewportOnce } from '../../../lib/motion'
import { businesses, isThemeLive } from '../../../prototypes/catalog'
import { useMediaQuery, usePageVisible, usePointerEffects } from '../../../hooks/useMotionEnv'
import { Aurora } from '../../motion/Ambient'
import { Magnetic, TiltCard } from '../../motion/Interactive'
import { SectionEnter } from '../../motion/Scroll'
import { LineReveal, SplitWords } from '../../motion/Text'
import { industries } from '../homeData'
import SectionHeading from './SectionHeading'

gsap.registerPlugin(ScrollTrigger)

const AUTO_CYCLE_SECONDS = 5
// Scroll distance per industry while the section is pinned (fraction of viewport height).
const PIN_STEP = 0.55

// Clip-path wipe in the direction of travel. All four shapes share a point
// count so framer-motion can interpolate between them.
const FULL = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
const clipEnter = (dir) => (dir > 0 ? 'polygon(92% 0%, 100% 0%, 100% 100%, 108% 100%)' : 'polygon(-8% 0%, 0% 0%, 0% 100%, 8% 100%)')
const clipExit = (dir) => (dir > 0 ? 'polygon(-8% 0%, 0% 0%, 0% 100%, 8% 100%)' : 'polygon(92% 0%, 100% 0%, 100% 100%, 108% 100%)')

function hasLiveDemo(prototypeId) {
  const business = prototypeId && businesses.find((b) => b.id === prototypeId)
  return Boolean(business?.themes.some((theme) => isThemeLive(business.id, theme.id)))
}

// Check mark whose stroke draws itself in shortly after the chip lands.
function DrawCheck({ delay = 0, color }) {
  const ref = useRef(null)
  const [drawn, setDrawn] = useState(false)
  useLayoutEffect(() => {
    ref.current?.querySelectorAll('path, polyline').forEach((shape) => shape.setAttribute('pathLength', '1'))
    const frame = window.requestAnimationFrame(() => setDrawn(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])
  return (
    <span ref={ref} data-drawn={drawn} style={{ '--draw-delay': `${delay}ms`, color }} className="draw-icon inline-flex">
      <Check aria-hidden="true" className="h-4 w-4" />
    </span>
  )
}

export default function IndustriesSection() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)
  const [bursts, setBursts] = useState([])
  const { Icon, title, description, services, prototypeId, accent } = industries[index]
  const live = hasLiveDemo(prototypeId)

  const sectionRef = useRef(null)
  const gridRef = useRef(null)
  const reduce = useReducedMotion()
  const pointer = usePointerEffects()
  const desktop = useMediaQuery('(min-width: 1024px)')
  const inView = useInView(sectionRef, { amount: 0.35 })
  const visible = usePageVisible()
  // Desktop and motion allowed: the section pins and scroll walks the industries.
  const pinned = desktop && !reduce

  // Pointer position across the section: drives the spotlight and the
  // watermark parallax.
  const lightX = useMotionValue(-1000)
  const lightY = useMotionValue(-1000)
  const [lit, setLit] = useState(false)
  const px = useSpring(0, { stiffness: 60, damping: 20 })
  const py = useSpring(0, { stiffness: 60, damping: 20 })
  const markX = useTransform(px, [-0.5, 0.5], [-28, 28])
  const markY = useTransform(py, [-0.5, 0.5], [-20, 20])

  const onPointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    lightX.set(event.clientX - rect.left)
    lightY.set(event.clientY - rect.top)
    px.set((event.clientX - rect.left) / rect.width - 0.5)
    py.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  // Blurred blob in the industry's accent that bursts out of its tab and fades.
  const burstFrom = (tab) => {
    if (reduce) return
    const button = document.getElementById(`industry-tab-${tab}`)
    const grid = gridRef.current
    if (!button || !grid) return
    const b = button.getBoundingClientRect()
    const g = grid.getBoundingClientRect()
    setBursts((list) => [...list, { id: Date.now() + tab, x: b.left - g.left + b.width / 2, y: b.top - g.top + b.height / 2, color: industries[tab].accent }])
  }

  const indexRef = useRef(index)
  useEffect(() => {
    indexRef.current = index
  }, [index])
  const goTo = (next) => {
    if (next === indexRef.current) return
    setDirection(next > indexRef.current ? 1 : -1)
    indexRef.current = next
    setIndex(next)
    burstFrom(next)
  }

  // --- Pinned scroll story (desktop) ----------------------------------------
  const triggerRef = useRef(null)
  const progress = useMotionValue(0)
  useEffect(() => {
    if (!pinned) return undefined
    const steps = industries.length - 1
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: () => `+=${steps * PIN_STEP * window.innerHeight}`,
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const position = self.progress * steps
        const step = Math.min(steps, Math.round(position))
        progress.set(step === steps ? 1 : Math.max(0, position - step + 0.5))
        goTo(step)
      },
    })
    triggerRef.current = trigger
    return () => {
      trigger.kill()
      triggerRef.current = null
    }
    // goTo reads the latest index through a ref, so it is stable enough to omit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinned, progress])

  const select = (next) => {
    const trigger = triggerRef.current
    if (trigger) {
      // Jump the scroll position to that step. The section is pinned, so the
      // viewport does not visibly move; only the panel changes.
      const steps = industries.length - 1
      const top = trigger.start + ((trigger.end - trigger.start) * next) / steps
      window.scrollTo({ top, behavior: 'instant' })
    }
    goTo(next)
  }

  // --- Auto-cycle (mobile / reduced motion fallback) ---------------------------
  const autoCycle = !pinned && !reduce && inView && visible && !paused
  useEffect(() => {
    if (!pinned) progress.set(0)
  }, [index, pinned, progress])
  useEffect(() => {
    if (!autoCycle) return undefined
    const remaining = AUTO_CYCLE_SECONDS * (1 - progress.get())
    const controls = animate(progress, 1, {
      duration: remaining,
      ease: 'linear',
      onComplete: () => goTo((indexRef.current + 1) % industries.length),
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCycle, index, progress])

  const onKeyDown = (event) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
    if (!step) return
    event.preventDefault()
    const next = (index + step + industries.length) % industries.length
    select(next)
    document.getElementById(`industry-tab-${next}`)?.focus()
  }

  return (
    <section
      id="industries"
      ref={sectionRef}
      onPointerMove={pointer ? onPointerMove : undefined}
      onPointerEnter={pointer ? () => setLit(true) : undefined}
      onPointerLeave={pointer ? () => setLit(false) : undefined}
      className={`relative scroll-mt-28 overflow-hidden bg-[#fdf9e9] px-5 py-16 sm:py-24 lg:px-8 ${pinned ? 'lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:py-12' : ''}`}
    >
      <Aurora tone="industries" priority={1} />
      {pointer && (
        <motion.span
          aria-hidden="true"
          animate={{ '--spot': accent }}
          style={{ x: lightX, y: lightY, opacity: lit ? 1 : 0, backgroundImage: 'radial-gradient(closest-side, color-mix(in srgb, var(--spot, #ffae13) 16%, transparent), transparent)' }}
          className="pointer-events-none absolute left-[-300px] top-[-300px] h-[600px] w-[600px] rounded-full transition-opacity duration-500"
        />
      )}

      <SectionEnter className="relative mx-auto w-full max-w-6xl">
        <SectionHeading eyebrow="Industries we serve" title="Built for businesses across sectors" highlight="sectors" underline />

        <div
          ref={gridRef}
          className="relative mt-10 grid gap-6 lg:grid-cols-[260px_1fr]"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false) }}
        >
          {/* Accent colour bleed on select. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-visible">
            <AnimatePresence>
              {bursts.map((burst) => (
                <motion.span
                  key={burst.id}
                  style={{ left: burst.x, top: burst.y, backgroundColor: burst.color }}
                  className="absolute h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                  initial={{ scale: 0.2, opacity: 0.55 }}
                  animate={{ scale: 7, opacity: 0, transition: { duration: 1.1, ease: ease.entrance } }}
                  onAnimationComplete={() => setBursts((list) => list.filter((b) => b.id !== burst.id))}
                />
              ))}
            </AnimatePresence>
          </div>

          <motion.div
            role="tablist"
            aria-label="Industries"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }}
            className="-mx-5 flex gap-1 overflow-x-auto px-5 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
          >
            {industries.map((industry, tab) => {
              const selected = tab === index
              const TabIcon = industry.Icon
              return (
                <motion.div
                  key={industry.title}
                  variants={{
                    hidden: { opacity: 0, x: -24, filter: 'blur(6px)' },
                    show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: transition.entrance },
                  }}
                  className="shrink-0 lg:w-full"
                >
                  <Magnetic strength={0.12} className="lg:w-full">
                    <button
                      id={`industry-tab-${tab}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="industry-panel"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => select(tab)}
                      className={`relative flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition-colors ${selected ? 'text-white' : 'text-[#0d4697] hover:bg-white/70'}`}
                    >
                      {selected && (
                        <motion.span layoutId="industry-tab" transition={spring.interactive} className="absolute inset-0 -z-10 overflow-hidden rounded-2xl bg-[#0d4697] shadow-[0_12px_28px_rgba(13,70,151,0.28)]">
                          {!reduce && (
                            <motion.span aria-hidden="true" style={{ scaleX: progress, backgroundColor: industry.accent }} className="absolute inset-x-4 bottom-1 h-[2px] origin-left rounded-full opacity-90" />
                          )}
                        </motion.span>
                      )}
                      <motion.span animate={{ color: selected ? industry.accent : '#0d4697', scale: selected ? 1.15 : 1 }} transition={spring.interactive} className="inline-flex shrink-0">
                        <TabIcon className="h-4 w-4" />
                      </motion.span>
                      {industry.title}
                    </button>
                  </Magnetic>
                </motion.div>
              )
            })}
          </motion.div>

          <TiltCard
            max={3}
            glow={`color-mix(in srgb, ${accent} 20%, transparent)`}
            conic={`conic-gradient(from 0deg, transparent 0 60%, ${accent} 75%, #ffae13 88%, transparent 100%)`}
            className="rounded-[28px] bg-[#0d4697]/10 shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
            innerClassName="min-h-[320px] bg-white p-7 sm:p-10"
          >
            {/* Giant industry glyph behind the content: drifts with the pointer and crossfades on change. */}
            <motion.div aria-hidden="true" style={pointer ? { x: markX, y: markY } : undefined} className="pointer-events-none absolute -bottom-10 -right-6 -z-10">
              <AnimatePresence initial={false}>
                <motion.span
                  key={title}
                  style={{ color: accent }}
                  className="absolute bottom-0 right-0 block"
                  initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
                  animate={{ opacity: 0.07, scale: 1, rotate: 0, transition: { duration: 0.9, ease: ease.entrance } }}
                  exit={{ opacity: 0, scale: 1.1, rotate: 6, transition: { duration: 0.4, ease: ease.exit } }}
                >
                  <Icon className="h-[300px] w-[300px]" strokeWidth={1.25} />
                </motion.span>
              </AnimatePresence>
            </motion.div>

            <div id="industry-panel" role="tabpanel" aria-labelledby={`industry-tab-${index}`} className="relative">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={title}
                  custom={direction}
                  variants={{
                    enter: (dir) => ({ opacity: 0, x: dir * 24, clipPath: clipEnter(dir) }),
                    center: {
                      opacity: 1,
                      x: 0,
                      clipPath: FULL,
                      transition: { duration: 0.6, ease: ease.entrance, staggerChildren: stagger.children, delayChildren: 0.1 },
                    },
                    exit: (dir) => ({ opacity: 0, x: dir * -24, clipPath: clipExit(dir), transition: { duration: 0.3, ease: ease.exit } }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <div className="flex items-center gap-4" style={{ perspective: 800 }}>
                    <motion.span
                      variants={{
                        enter: { rotateY: 90, opacity: 0 },
                        center: { rotateY: 0, opacity: 1, transition: spring.surface },
                      }}
                      style={{ backgroundColor: accent, boxShadow: `0 10px 24px color-mix(in srgb, ${accent} 40%, transparent)` }}
                      className="relative grid h-14 w-14 place-items-center overflow-hidden rounded-2xl text-white"
                    >
                      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-white/35 via-transparent to-black/10" />
                      <motion.span variants={{ enter: { scale: 0.5 }, center: { scale: 1, transition: { ...spring.interactive, delay: 0.15 } } }} className="relative inline-flex">
                        <Icon className="h-7 w-7" />
                      </motion.span>
                    </motion.span>
                    <SplitWords
                      as="h3"
                      text={title}
                      trigger="mount"
                      gap={0.08}
                      wordDuration={0.6}
                      className="font-outfit text-2xl font-semibold tracking-tight text-[#0d4697] sm:text-3xl"
                    />
                  </div>
                  <LineReveal text={description} className="mt-5 max-w-2xl text-base font-medium leading-7 text-slate-600" />
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {services.map((service, i) => (
                      <motion.li
                        key={service}
                        variants={{ enter: { opacity: 0, y: 14 }, center: { opacity: 1, y: 0, transition: transition.entrance } }}
                        whileHover={pointer ? { y: -2 } : undefined}
                        style={{ '--chip-hover': `color-mix(in srgb, ${accent} 10%, white)` }}
                        className="flex items-center gap-2.5 rounded-xl bg-[#f4f8ff] px-4 py-3 text-sm font-semibold text-[#0b2451] transition-colors hover:bg-[var(--chip-hover)]"
                      >
                        <DrawCheck delay={250 + i * 90} color={accent} />
                        {service}
                      </motion.li>
                    ))}
                  </ul>
                  <motion.div variants={{ enter: { opacity: 0, y: 10 }, center: { opacity: 1, y: 0, transition: transition.entrance } }} className="mt-7 flex flex-wrap gap-4">
                    {live && (
                      <Link to={`/solutions/${prototypeId}`} className="group inline-flex items-center gap-2 rounded-full bg-[#17a589] px-5 py-2.5 text-sm font-bold text-white">
                        See the live demo
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    )}
                    <Link to="/contact" className="group inline-flex items-center gap-2 px-1 py-2.5 text-sm font-bold text-[#0d4697]">
                      <span className="link-wipe">Discuss your project</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </TiltCard>
        </div>

        {pinned && (
          <p aria-hidden="true" className="mt-6 hidden items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#0d4697]/50 lg:flex">
            <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} className="inline-block">↓</motion.span>
            Scroll to explore {index + 1} / {industries.length}
          </p>
        )}
      </SectionEnter>
    </section>
  )
}
