import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { ease, spring, transition, variants, viewportOnce } from '../../../lib/motion'
import NeuralBackground from '../../motion/NeuralBackground'
import { Magnetic } from '../../motion/Interactive'
import SectionHeading from './SectionHeading'
import { DeployVisual, DesignVisual, DevelopVisual, DiscoverVisual } from './JourneyVisuals'
import { JOURNEY_CHIPS } from './journeyChips'

const NAVY = '#08224B'

const STAGES = [
  { name: 'Discover', title: 'We understand your business first', copy: 'A call and a short meeting about how you work today. You get a written plan with your goals, the features, the timeline and the cost.', Visual: DiscoverVisual },
  { name: 'Design', title: 'You see your app before we build it', copy: 'We design the screens in your brand and share a version you can click through. You tell us what to change, and we update it.', Visual: DesignVisual },
  { name: 'Develop', title: 'We build it and show you progress', copy: 'While we build, you get a preview link to try it and regular demos. Each part is tested before it goes live.', Visual: DevelopVisual },
  { name: 'Deploy', title: 'Your app goes live, and we stay with you', copy: 'We launch it for your customers, keep an eye on it after launch, and help with changes and updates.', Visual: DeployVisual },
]

function StageVisual({ index }) {
  const { Visual } = STAGES[index]
  return <Visual />
}

// Desktop: the visual and progress rail pin while the four stages scroll past,
// then release with the section. Mobile: a simple stacked timeline.
export default function JourneySection() {
  const stepsRef = useRef(null)
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: stepsRef, offset: ['start center', 'end center'] })
  const line = useSpring(scrollYProgress, { stiffness: spring.surface.stiffness, damping: spring.surface.damping, restDelta: 0.001 })

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = Math.min(STAGES.length - 1, Math.max(0, Math.floor(value * STAGES.length)))
    setActive((current) => (current === next ? current : next))
  })

  return (
    <section id="journey" className="relative isolate scroll-mt-28 overflow-x-clip bg-[#f6f9ff] px-5 py-16 sm:py-24 lg:px-8">
      <NeuralBackground tone="sky" priority={2} />
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Your project journey" title="From first call to launch day" highlight="launch">
          Discover → Design → Develop → Deploy
        </SectionHeading>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* Pinned visual (desktop only) */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="relative mb-6 flex justify-between px-1" aria-hidden="true">
                <span className="absolute left-5 right-5 top-5 h-0.5 rounded-full bg-[#08224B]/10" />
                <motion.span style={{ scaleX: line }} className="absolute left-5 right-5 top-5 h-0.5 origin-left rounded-full bg-gradient-to-r from-[#CB9015] to-[#08224B]" />
                {STAGES.map(({ name }, i) => (
                  <div key={name} className="relative flex flex-col items-center gap-2">
                    <motion.span
                      animate={{ scale: i === active ? 1.12 : 1 }}
                      transition={spring.interactive}
                      className={`grid h-10 w-10 place-items-center rounded-full border-2 text-xs font-black transition-colors duration-300 ${i <= active ? 'border-[#CB9015] bg-[#08224B] text-white' : 'border-[#08224B]/15 bg-white text-[#08224B]/50'}`}
                    >
                      0{i + 1}
                    </motion.span>
                    <span className={`text-xs font-bold transition-colors ${i === active ? 'text-[#08224B]' : 'text-[#08224B]/40'}`}>{name}</span>
                  </div>
                ))}
              </div>
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
            </div>
          </div>

          {/* Stage copy: scrolls past the pinned visual */}
          <ol ref={stepsRef} className="relative border-l-2 border-[#08224B]/10 pl-6 lg:border-0 lg:pl-0">
            {STAGES.map(({ name, title, copy }, i) => (
              <motion.li
                key={name}
                aria-current={i === active ? 'step' : undefined}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                variants={variants.fadeUp}
                className="relative flex flex-col justify-center py-8 lg:min-h-[62vh] lg:py-0"
              >
                <span aria-hidden="true" className={`absolute -left-[33px] top-9 h-4 w-4 rounded-full border-2 border-white lg:hidden ${i <= active ? 'bg-[#CB9015]' : 'bg-[#08224B]/20'}`} />
                <motion.div animate={{ opacity: i === active ? 1 : 0.45 }} transition={transition.micro}>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-[#CB9015]">0{i + 1} · {name}</p>
                  <h3 className="mt-3 font-outfit text-2xl font-semibold tracking-tight sm:text-3xl" style={{ color: NAVY }}>{title}</h3>
                  <p className="mt-3 max-w-md text-base font-medium leading-7 text-slate-600">{copy}</p>
                </motion.div>
                <div className="mt-6 aspect-[16/11] overflow-hidden rounded-3xl border border-white bg-white shadow-[0_20px_50px_rgba(8,34,75,0.12)] lg:hidden">
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
        </div>

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
