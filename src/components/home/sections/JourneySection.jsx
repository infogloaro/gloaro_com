import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { ease, spring, transition, variants, viewportOnce } from '../../../lib/motion'
import NeuralBackground from '../../motion/NeuralBackground'
import { Magnetic } from '../../motion/Interactive'
import SectionHeading from './SectionHeading'
import { DeliverableTiles, DeployVisual, DesignVisual, DevelopVisual, DiscoverVisual } from './JourneyVisuals'
import { JOURNEY_CHIPS } from './journeyChips'

const NAVY = '#08224B'

const STAGES = [
  { name: 'Discover', short: 'We understand your business', title: 'We understand your business first', copy: 'A call and a short meeting about how you work today. You get a written plan with your goals, the features, the timeline and the cost.', Visual: DiscoverVisual },
  { name: 'Design', short: 'You see it before we build', title: 'You see your app before we build it', copy: 'We design the screens in your brand and share a version you can click through. You tell us what to change, and we update it.', Visual: DesignVisual },
  { name: 'Develop', short: 'We build and show progress', title: 'We build it and show you progress', copy: 'While we build, you get a preview link to try it and regular demos. Each part is tested before it goes live.', Visual: DevelopVisual },
  { name: 'Deploy', short: 'Live, and we stay with you', title: 'Your app goes live, and we stay with you', copy: 'We launch it for your customers, keep an eye on it after launch, and help with changes and updates.', Visual: DeployVisual },
]

function StageVisual({ index }) {
  const { Visual } = STAGES[index]
  return <Visual />
}

// Desktop: a horizontal timeline of all four steps sits above the step's
// picture and a details panel; the block pins while you scroll through the
// steps (or click one). Phones: a simple stacked list.
export default function JourneySection() {
  const pinRef = useRef(null)
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: pinRef, offset: ['start start', 'end end'] })
  const line = useSpring(scrollYProgress, { stiffness: spring.surface.stiffness, damping: spring.surface.damping, restDelta: 0.001 })
  const count = STAGES.length

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = Math.min(count - 1, Math.max(0, Math.floor(value * count)))
    setActive((current) => (current === next ? current : next))
  })

  // Scroll to the middle of a step's slice of the pinned area.
  const goTo = (index) => {
    const element = pinRef.current
    if (!element) return
    const top = element.getBoundingClientRect().top + window.scrollY
    const target = top + ((index + 0.5) / count) * (element.offsetHeight - window.innerHeight)
    if (window.__lenis) window.__lenis.scrollTo(target)
    else window.scrollTo({ top: target, behavior: reduce ? 'auto' : 'smooth' })
  }

  const stage = STAGES[active]

  return (
    <section id="journey" className="relative isolate scroll-mt-28 overflow-x-clip bg-[#f6f9ff] px-5 py-16 sm:py-24 lg:px-8">
      <NeuralBackground tone="sky" priority={2} />
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Your project journey" title="From first call to launch day" highlight="launch">
          Discover → Design → Develop → Deploy
        </SectionHeading>

        {/* Desktop: pinned timeline + picture + details panel */}
        <div ref={pinRef} className="relative mt-12 hidden lg:block" style={{ height: `${count * 75 + 25}vh` }}>
          {/* Screen readers get every step at once; the pinned view is visual. */}
          <ol className="sr-only">
            {STAGES.map(({ name, title, copy }, i) => <li key={name}>Step {i + 1}, {name}: {title}. {copy}</li>)}
          </ol>

          <div className="sticky top-24" aria-hidden="true">
            {/* Horizontal timeline */}
            <div className="relative grid grid-cols-4 gap-4">
              <span className="absolute left-[12.5%] right-[12.5%] top-6 h-1 rounded-full bg-[#08224B]/10" />
              <motion.span style={{ scaleX: line }} className="absolute left-[12.5%] right-[12.5%] top-6 h-1 origin-left rounded-full bg-gradient-to-r from-[#CB9015] to-[#08224B]" />
              {STAGES.map(({ name, short }, i) => {
                const isActive = i === active
                const done = i < active
                return (
                  <button
                    key={name}
                    type="button"
                    tabIndex={-1}
                    onClick={() => goTo(i)}
                    className="group relative flex flex-col items-center text-center"
                  >
                    <motion.span
                      animate={{ scale: isActive ? 1.15 : 1 }}
                      transition={spring.interactive}
                      className={`relative z-10 grid h-12 w-12 place-items-center rounded-full border-2 text-sm font-black transition-colors duration-300 ${isActive ? 'border-[#CB9015] bg-[#08224B] text-white shadow-[0_10px_24px_rgba(8,34,75,0.3)]' : done ? 'border-[#CB9015] bg-[#08224B] text-white' : 'border-[#08224B]/15 bg-white text-[#08224B]/50 group-hover:border-[#08224B]/40'}`}
                    >
                      0{i + 1}
                    </motion.span>
                    <span className={`mt-3 text-xs font-black uppercase tracking-[0.2em] transition-colors ${isActive ? 'text-[#CB9015]' : 'text-[#08224B]/40'}`}>{name}</span>
                    <span className={`mt-1 text-sm font-semibold transition-colors ${isActive ? 'text-[#08224B]' : 'text-[#08224B]/45 group-hover:text-[#08224B]/70'}`}>{short}</span>
                  </button>
                )
              })}
            </div>

            <div className="mt-8 grid grid-cols-[1.1fr_1fr] items-center gap-10 xl:gap-14">
              {/* Step picture */}
              <div className="relative aspect-[16/11] overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_30px_70px_rgba(8,34,75,0.14)]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active}
                    className="absolute inset-0"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: ease.entrance } }}
                    exit={{ opacity: 0, transition: transition.exit }}
                  >
                    <StageVisual index={active} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Details panel */}
              <div className="relative">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0, transition: { duration: 0.45, ease: ease.entrance } }}
                    exit={{ opacity: 0, x: reduce ? 0 : -16, transition: transition.exit }}
                  >
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#CB9015] shadow-sm ring-1 ring-[#08224B]/5">
                      Step 0{active + 1} of 0{count} · {stage.name}
                    </span>
                    <h3 className="mt-4 font-outfit text-3xl font-semibold tracking-tight xl:text-4xl" style={{ color: NAVY }}>{stage.title}</h3>
                    <p className="mt-3 max-w-lg text-base font-medium leading-7 text-slate-600">{stage.copy}</p>
                    <p className="mt-7 text-xs font-black uppercase tracking-[0.2em] text-[#08224B]/45">What you get</p>
                    <DeliverableTiles step={stage.name} />
                  </motion.div>
                </AnimatePresence>
                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => goTo(Math.max(0, active - 1))}
                    disabled={active === 0}
                    className="grid h-11 w-11 place-items-center rounded-full border border-[#08224B]/15 bg-white text-[#08224B] transition hover:border-[#08224B]/40 disabled:opacity-35"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => goTo(Math.min(count - 1, active + 1))}
                    disabled={active === count - 1}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-[#08224B] px-5 text-sm font-bold text-white transition hover:bg-[#0d4697] disabled:opacity-35"
                  >
                    {active === count - 1 ? 'All steps done' : `Next: ${STAGES[active + 1].name}`}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phones and tablets: stacked steps */}
        <ol className="relative mt-12 border-l-2 border-[#08224B]/10 pl-6 lg:hidden">
          {STAGES.map(({ name, title, copy }, i) => (
            <motion.li
              key={name}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={variants.fadeUp}
              className="relative py-8"
            >
              <span aria-hidden="true" className="absolute -left-[33px] top-9 h-4 w-4 rounded-full border-2 border-white bg-[#CB9015]" />
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#CB9015]">0{i + 1} · {name}</p>
              <h3 className="mt-3 font-outfit text-2xl font-semibold tracking-tight sm:text-3xl" style={{ color: NAVY }}>{title}</h3>
              <p className="mt-3 max-w-md text-base font-medium leading-7 text-slate-600">{copy}</p>
              <div className="mt-6 aspect-[16/11] overflow-hidden rounded-3xl border border-white bg-white shadow-[0_20px_50px_rgba(8,34,75,0.12)]">
                <StageVisual index={i} />
              </div>
              {/* Phones: what you get at this step, as readable tags under the picture. */}
              <ul className="mt-3 flex flex-wrap gap-2 sm:hidden">
                {JOURNEY_CHIPS[name].map(({ Icon, color, label }) => (
                  <li key={label} className="flex items-center gap-1.5 rounded-full bg-white py-1 pl-1 pr-3 text-xs font-bold text-[#071a3d] shadow-sm ring-1 ring-slate-100">
                    <span className="grid h-6 w-6 place-items-center rounded-full text-white" style={{ background: color }}><Icon aria-hidden="true" className="h-3 w-3" /></span>
                    {label}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ol>

        {/* One clear next step once the journey makes sense. */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={variants.fadeUp}
          className="mt-14 flex flex-col items-center gap-5 rounded-[28px] border border-[#08224B]/10 bg-white px-6 py-8 text-center shadow-[0_20px_50px_rgba(8,34,75,0.08)] sm:flex-row sm:justify-between sm:px-10 sm:text-left"
        >
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#CB9015]">Ready to start?</p>
            <p className="mt-2 font-outfit text-2xl font-semibold" style={{ color: NAVY }}>Step 1 is a conversation about your business.</p>
          </div>
          <Magnetic>
            <Link to="/contact" className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#08224B] px-7 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(8,34,75,0.25)] transition hover:bg-[#0d4697]">
              Book a discovery call
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  )
}
