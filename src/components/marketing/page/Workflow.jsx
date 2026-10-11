import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { ArrowRight, BarChart3, BellRing, Check, FileText, MessageCircle, Phone, Power } from 'lucide-react'
import { ease, transition } from '../../../lib/motion'
import SectionHeading from '../../home/sections/SectionHeading'
import { mediaUrl } from '../media'
import { workflow } from './content'

const rise = (i) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: ease.entrance, delay: 0.1 + i * 0.1 },
})
const card = 'rounded-2xl border border-[#08224B]/10 bg-white p-4 shadow-[0_18px_40px_-20px_rgba(8,34,75,0.35)]'

function BriefVisual() {
  return (
    <div className={card}>
      <p className="text-xs font-black uppercase tracking-wider text-[#08224B]/50">Business brief</p>
      {[['Industry', 'Furniture showroom'], ['Customers', 'Families within 10 km'], ['Goal', 'More showroom visits'], ['Challenge', 'Few enquiries from Instagram']].map(([k, v], i) => (
        <motion.p key={k} {...rise(i)} className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-xs">
          <span className="font-semibold text-slate-500">{k}</span>
          <span className="font-bold text-[#08224B]">{v}</span>
        </motion.p>
      ))}
    </div>
  )
}

function PlanVisual() {
  return (
    <div className={card}>
      <p className="text-xs font-black uppercase tracking-wider text-[#08224B]/50">Channel plan</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {['Instagram', 'Facebook', 'Google Business', 'WhatsApp'].map((c, i) => (
          <motion.span key={c} {...rise(i)} className="flex items-center gap-1.5 rounded-full bg-[#08224B] px-3 py-1.5 text-xs font-bold text-white"><Check className="h-3 w-3 text-[#ffae13]" />{c}</motion.span>
        ))}
      </div>
      <p className="mt-4 text-xs font-black uppercase tracking-wider text-[#08224B]/50">Monthly content mix</p>
      {[['Reels', 0.4, '#d6336c'], ['Posts & carousels', 0.4, '#1b6fe0'], ['Stories', 0.2, '#CB9015']].map(([label, share, color], i) => (
        <div key={label} className="mt-2 flex items-center gap-3 text-xs font-semibold text-slate-600">
          <span className="w-28">{label}</span>
          <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
            <motion.span className="block h-full origin-left rounded-full" style={{ background: color }} initial={{ scaleX: 0 }} animate={{ scaleX: share / 0.4 }} transition={{ duration: 0.8, ease: ease.entrance, delay: 0.3 + i * 0.12 }} />
          </span>
        </div>
      ))}
    </div>
  )
}

function CreateVisual() {
  const items = [['furniture/post.webp', -8, 'Post'], ['furniture/reel.webp', 0, 'Reel'], ['furniture/ad.webp', 8, 'Ad']]
  return (
    <div className={`${card} flex items-end justify-center gap-3 py-6`}>
      {items.map(([image, rotate, label], i) => (
        <motion.figure
          key={label}
          initial={{ opacity: 0, y: 30, rotate: 0 }}
          animate={{ opacity: 1, y: i === 1 ? -12 : 0, rotate }}
          transition={{ type: 'spring', stiffness: 140, damping: 16, delay: 0.1 + i * 0.12 }}
          className="w-[30%] overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5"
        >
          <img src={mediaUrl(image)} alt="" loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover" />
          <figcaption className="flex items-center justify-between px-2 py-1.5 text-[10px] font-bold text-[#08224B]">
            {label}<span className="rounded-full bg-emerald-100 px-1.5 text-[9px] text-emerald-700">Approved</span>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  )
}

function LaunchVisual() {
  return (
    <div className={card}>
      <p className="text-xs font-black uppercase tracking-wider text-[#08224B]/50">Campaigns</p>
      {[['Showroom visits · Leads', 'Meta Ads'], ['Festive offer · Reels', 'Instagram'], ['Profile posts', 'Google Business']].map(([name, where], i) => (
        <motion.div key={name} {...rise(i)} className="mt-2 flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5">
          <span>
            <span className="block text-xs font-bold text-[#08224B]">{name}</span>
            <span className="block text-[10px] font-semibold text-slate-400">{where} · approved by you</span>
          </span>
          <span className="flex items-center gap-2 text-[10px] font-bold text-emerald-600">
            <Power className="h-3.5 w-3.5" />
            <span className="relative h-5 w-9 rounded-full bg-emerald-500">
              <motion.span className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow" initial={{ left: 2 }} animate={{ left: 18 }} transition={{ delay: 0.4 + i * 0.15, ...transition.micro }} />
            </span>
          </span>
        </motion.div>
      ))}
    </div>
  )
}

function EnquiriesVisual() {
  const notes = [
    [MessageCircle, '#00a884', 'WhatsApp', '“Is the 3+2 sofa available in grey?”'],
    [Phone, '#1b6fe0', 'Call', 'Missed call → callback scheduled'],
    [FileText, '#CB9015', 'Website form', 'New lead: bedroom set enquiry'],
  ]
  return (
    <div className="space-y-2.5">
      {notes.map(([Icon, color, source, text], i) => (
        <motion.div key={source} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 180, damping: 20, delay: 0.1 + i * 0.25 }} className={`${card} flex items-center gap-3 p-3`}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white" style={{ background: color }}><Icon className="h-4 w-4" /></span>
          <span className="min-w-0">
            <span className="block text-[10px] font-black uppercase tracking-wider" style={{ color }}>{source}</span>
            <span className="block truncate text-xs font-semibold text-[#08224B]">{text}</span>
          </span>
          <BellRing className="ml-auto h-4 w-4 shrink-0 text-slate-300" />
        </motion.div>
      ))}
    </div>
  )
}

function MeasureVisual() {
  const bars = [0.35, 0.5, 0.45, 0.68, 0.8]
  return (
    <div className={card}>
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#08224B]/50"><BarChart3 className="h-3.5 w-3.5" />Monthly review</p>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-800">Sample</span>
      </div>
      <div className="mt-4 flex h-24 items-end gap-2">
        {bars.map((h, i) => (
          <motion.span key={i} className="flex-1 origin-bottom rounded-t-md bg-gradient-to-t from-[#0d4697] to-[#1b6fe0]" style={{ height: `${h * 100}%` }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.6, ease: ease.entrance, delay: 0.1 + i * 0.08 }} />
        ))}
      </div>
      <p className="mt-4 text-xs font-black uppercase tracking-wider text-[#08224B]/50">Improve next</p>
      {['Shift budget to the best-performing ad', 'New Reel hook for the festive offer', 'Add pricing FAQ to the landing page'].map((t, i) => (
        <motion.p key={t} {...rise(i + 3)} className="mt-1.5 flex items-center gap-2 text-xs font-semibold text-[#08224B]"><Check className="h-3.5 w-3.5 text-emerald-500" />{t}</motion.p>
      ))}
    </div>
  )
}

const visuals = { brief: BriefVisual, plan: PlanVisual, create: CreateVisual, launch: LaunchVisual, enquiries: EnquiriesVisual, measure: MeasureVisual }

function StepCard({ step, index, onActive }) {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })
  useEffect(() => {
    if (inView) onActive(index)
  }, [inView, index, onActive])
  const Visual = visuals[step.visual]
  return (
    <li ref={ref} className="relative pl-14 lg:min-h-[52vh] lg:pl-16">
      <span className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full bg-[#08224B] font-outfit text-sm font-bold text-[#ffae13] shadow-lg lg:h-12 lg:w-12 lg:text-base">
        {String(index + 1).padStart(2, '0')}
      </span>
      <h3 className="font-outfit text-xl font-semibold tracking-tight text-[#08224B] sm:text-2xl">{step.title}</h3>
      <p className="mt-2 max-w-md text-[15px] font-medium leading-7 text-slate-600">{step.text}</p>
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#0d4697] shadow-sm ring-1 ring-[#08224B]/10">
        <Check aria-hidden="true" className="h-3.5 w-3.5 text-emerald-500" />
        {step.output}
      </p>
      <div aria-hidden="true" className="mt-5 lg:hidden">
        <Visual />
      </div>
    </li>
  )
}

// How an engagement runs, step by step. On desktop the visual on the left
// follows whichever step is in the middle of the viewport.
export default function Workflow({ onPlan }) {
  const [active, setActive] = useState(0)
  const Visual = visuals[workflow[active].visual]
  return (
    <section id="process" className="relative scroll-mt-28 bg-[#fdf9e9] px-5 py-16 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="How it works" title="From first conversation to a campaign that keeps improving" highlight="improving" />

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div aria-hidden="true" className="hidden lg:block">
            <div className="sticky top-32">
              <div className="mb-4 flex gap-1.5">
                {workflow.map((_, i) => (
                  <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${i <= active ? 'bg-[#CB9015]' : 'bg-[#08224B]/10'}`} />
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: transition.entrance }} exit={{ opacity: 0, y: -10, transition: transition.exit }}>
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#08224B]/45">Step {active + 1} · {workflow[active].title}</p>
                  <Visual />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <ol className="relative space-y-12 before:absolute before:bottom-6 before:left-5 before:top-6 before:w-px before:bg-[#08224B]/15 lg:space-y-0 lg:before:left-6">
            {workflow.map((step, i) => <StepCard key={step.title} step={step} index={i} onActive={setActive} />)}
          </ol>
        </div>

        <div className="mt-6 flex flex-col items-start gap-5 rounded-3xl border border-[#08224B]/10 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <p className="max-w-2xl text-sm font-medium leading-6 text-slate-600">
            Deliverables and results depend on the agreed scope, your business requirements, advertising budget and platform performance. We agree the scope with you in writing before work begins.
          </p>
          <button
            type="button"
            onClick={() => onPlan({})}
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#08224B] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#0d4697]"
          >
            Request a consultation
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  )
}
