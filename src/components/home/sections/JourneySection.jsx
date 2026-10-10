import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { CheckCircle2, ClipboardList, Code2, Globe2, PenTool, Rocket, Search, Users } from 'lucide-react'
import { ease, spring, transition, variants, viewportOnce } from '../../../lib/motion'
import NeuralBackground from '../../motion/NeuralBackground'
import SectionHeading from './SectionHeading'

const NAVY = '#08224B'

function DiscoverVisual() {
  return (
    <div className="grid h-full grid-cols-2 gap-3 p-5">
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#08224B]/60"><ClipboardList className="h-3.5 w-3.5" />Requirements</p>
        {['Online ordering', 'GST invoices', 'Delivery tracking', 'WhatsApp alerts'].map((item, i) => (
          <p key={item} className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-[#08224B]">
            <CheckCircle2 className={`h-4 w-4 ${i < 3 ? 'text-emerald-500' : 'text-slate-300'}`} />{item}
          </p>
        ))}
      </div>
      <div className="space-y-3">
        <div className="rounded-2xl bg-[#08224B] p-4 text-white">
          <p className="flex items-center gap-1.5 text-[11px] font-bold text-white/60"><Users className="h-3.5 w-3.5" />Primary user</p>
          <p className="mt-1 text-sm font-bold">Store manager, Coimbatore</p>
          <p className="mt-1 text-[11px] text-white/70">Needs stock + orders on one screen.</p>
        </div>
        <div className="rounded-2xl bg-[#CB9015]/15 p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-bold text-[#8a5f00]"><Search className="h-3.5 w-3.5" />Goal</p>
          <p className="mt-1 text-sm font-bold text-[#08224B]">Cut order handling time by 40%</p>
        </div>
      </div>
    </div>
  )
}

function DesignVisual() {
  return (
    <div className="flex h-full items-center justify-center gap-4 p-5">
      <div className="h-[85%] w-[42%] space-y-2 rounded-2xl border-2 border-dashed border-[#08224B]/20 p-3">
        <div className="h-3 w-1/2 rounded bg-[#08224B]/15" />
        <div className="h-16 rounded-lg bg-[#08224B]/10" />
        {[0, 1, 2].map((i) => <div key={i} className="h-2 rounded bg-[#08224B]/10" />)}
      </div>
      <PenTool className="h-6 w-6 shrink-0 text-[#CB9015]" />
      <div className="h-[85%] w-[42%] space-y-2 rounded-2xl bg-white p-3 shadow-lg">
        <div className="h-3 w-1/2 rounded bg-[#08224B]" />
        <div className="h-16 rounded-lg bg-gradient-to-br from-[#1b6fe0] to-[#08224B]" />
        <div className="h-2 rounded bg-[#08224B]/20" />
        <div className="h-2 w-2/3 rounded bg-[#08224B]/20" />
        <div className="h-5 w-20 rounded-full bg-[#CB9015]" />
      </div>
    </div>
  )
}

function DevelopVisual() {
  const lines = [['export async function', '#ff9ac1'], ['  createOrder(cart) {', '#ffd36e'], ['  const invoice = gst(cart)', '#9cdcfe'], ['  await notify(customer)', '#6ee7d7'], ['  return invoice', '#ffffff']]
  return (
    <div className="flex h-full flex-col gap-3 p-5">
      <div className="flex-1 rounded-2xl bg-[#08224B] p-4 font-mono text-xs">
        {lines.map(([text, color], i) => (
          <p key={i} className="whitespace-pre leading-6" style={{ color }}><span className="mr-3 text-white/25">{i + 1}</span>{text}</p>
        ))}
      </div>
      <div className="flex items-center gap-2 rounded-xl bg-white p-3 text-xs font-bold text-[#08224B] shadow-sm">
        <Code2 className="h-4 w-4 text-[#1b6fe0]" /> PR #214 · Order flow
        <span className="ml-auto flex items-center gap-1 text-emerald-600"><CheckCircle2 className="h-4 w-4" />All checks passed</span>
      </div>
    </div>
  )
}

function DeployVisual() {
  return (
    <div className="flex h-full flex-col gap-3 p-5">
      <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500 text-white"><Rocket className="h-5 w-5" /></span>
        <div>
          <p className="text-sm font-extrabold text-[#08224B]">Live in production</p>
          <p className="flex items-center gap-1 font-mono text-[11px] text-slate-500"><Globe2 className="h-3 w-3" />orders.yourbrand.in</p>
        </div>
        <span className="ml-auto rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">99.98% uptime</span>
      </div>
      <div className="flex flex-1 items-end gap-1.5 rounded-2xl bg-[#08224B] p-4">
        {[30, 42, 38, 55, 61, 58, 72, 80, 77, 92].map((h, i) => (
          <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-[#CB9015] to-[#ffd98a]" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  )
}

const STAGES = [
  { name: 'Discover', title: 'We learn how your business actually runs', copy: 'Workshops with your team, a walkthrough of current tools, and a written scope with goals we can measure.', Visual: DiscoverVisual },
  { name: 'Design', title: 'You see it before we build it', copy: 'Wireframes become a clickable, branded prototype. You review real screens, not a slide deck.', Visual: DesignVisual },
  { name: 'Develop', title: 'Built in short, visible sprints', copy: 'Reviewed, tested code shipped to a staging link every sprint, so progress is something you can click.', Visual: DevelopVisual },
  { name: 'Deploy', title: 'Launched, monitored, supported', copy: 'Zero-downtime release, uptime monitoring and a support plan that keeps the product healthy after launch.', Visual: DeployVisual },
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
              <div className="relative aspect-[16/11] overflow-hidden rounded-[28px] border border-[#08224B]/10 bg-[#eef3fb] shadow-[0_30px_70px_rgba(8,34,75,0.14)]">
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
                <div className="mt-6 aspect-[16/11] overflow-hidden rounded-3xl border border-[#08224B]/10 bg-[#eef3fb] lg:hidden">
                  <StageVisual index={i} />
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
