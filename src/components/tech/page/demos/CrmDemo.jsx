import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight, BellRing, CalendarClock, FileText, Globe, Megaphone, MessageCircle, Plus, Receipt, RotateCcw, Trophy, UserPlus, Zap } from 'lucide-react'
import { ease, spring } from '../../../../lib/motion'

const STAGES = ['New', 'Contacted', 'Quotation', 'Won']

const SOURCES = {
  Website: { icon: Globe, cls: 'bg-sky-50 text-sky-700' },
  'Meta Ad': { icon: Megaphone, cls: 'bg-violet-50 text-violet-700' },
  WhatsApp: { icon: MessageCircle, cls: 'bg-emerald-50 text-emerald-700' },
}

// Sample leads. `hero` is the one the autoplay walks through the pipeline.
const START = [
  { id: 'hero', name: 'Sri Lakshmi Textiles', source: 'Website', value: 48000, stage: 0 },
  { id: 'l2', name: 'Kaveri Sweets', source: 'WhatsApp', value: 12500, stage: 0 },
  { id: 'l3', name: 'Arun Hardware', source: 'Meta Ad', value: 26000, stage: 1 },
  { id: 'l4', name: 'Nila Clinic', source: 'Website', value: 35000, stage: 2 },
  { id: 'l5', name: 'Velan Traders', source: 'WhatsApp', value: 61000, stage: 3 },
]

const INCOMING = [
  { name: 'Meena Boutique', source: 'Meta Ad', value: 18000 },
  { name: 'Ganesh Auto Parts', source: 'WhatsApp', value: 42000 },
  { name: 'Sakthi Bakery', source: 'Website', value: 9500 },
]

// Automations that fire when a lead enters each stage.
const AUTOMATIONS = [
  [[MessageCircle, 'WhatsApp: welcome message sent'], [UserPlus, 'Assigned to Ravi · Sales']],
  [[CalendarClock, 'Reminder set for tomorrow 10 AM'], [BellRing, 'Call notes saved to the lead']],
  [[FileText, 'Quotation PDF generated & sent'], [CalendarClock, 'Follow-up scheduled in 2 days']],
  [[Receipt, 'Invoice created in ERP · stock reserved'], [Trophy, 'Team notified on WhatsApp']],
]

const STEP_MS = 1500
const inr = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`

export default function CrmDemo({ accent }) {
  const ref = useRef(null)
  const boardRef = useRef(null)
  const eventId = useRef(0)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [leads, setLeads] = useState(START)
  const [events, setEvents] = useState([])
  const [fired, setFired] = useState(0)
  const [auto, setAuto] = useState(false)
  const [fresh, setFresh] = useState(null)
  const [incoming, setIncoming] = useState(0)

  const hero = leads.find((l) => l.id === 'hero')

  // Autoplay: once in view, walk the highlighted lead to Won, then stop.
  useEffect(() => {
    if (inView) {
      const id = window.setTimeout(() => setAuto(true), reduce ? 0 : 600)
      return () => window.clearTimeout(id)
    }
    return undefined
  }, [inView, reduce])

  useEffect(() => {
    if (!auto) return undefined
    const id = window.setTimeout(() => {
      if (hero.stage >= STAGES.length - 1) setAuto(false)
      else advance('hero')
    }, reduce ? 0 : STEP_MS)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, hero.stage, reduce])

  function log(stage, name) {
    const items = AUTOMATIONS[stage].map(([icon, text]) => ({ id: ++eventId.current, icon, text, name, stage }))
    setEvents((e) => [...items.reverse(), ...e].slice(0, 6))
    setFired((n) => n + items.length)
  }

  function scrollToStage(stage) {
    const board = boardRef.current
    const col = board?.children[stage]
    if (!board || !col) return
    board.scrollTo({ left: col.offsetLeft - board.offsetLeft - 8, behavior: reduce ? 'auto' : 'smooth' })
  }

  function advance(id) {
    const lead = leads.find((l) => l.id === id)
    if (!lead || lead.stage >= STAGES.length - 1) return
    const next = lead.stage + 1
    setFresh(null)
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, stage: next } : l)))
    log(next, lead.name)
    scrollToStage(next)
  }

  function userAdvance(id) {
    setAuto(false)
    advance(id)
  }

  function addLead() {
    if (incoming >= INCOMING.length) return
    setAuto(false)
    const lead = { ...INCOMING[incoming], id: `n${incoming}`, stage: 0 }
    setIncoming((n) => n + 1)
    setLeads((ls) => [lead, ...ls])
    setFresh(lead.id)
    log(0, lead.name)
    scrollToStage(0)
  }

  function reset() {
    setAuto(false)
    setLeads(START)
    setEvents([])
    setFired(0)
    setIncoming(0)
    setFresh(null)
    scrollToStage(0)
  }

  const wonValue = leads.filter((l) => l.stage === 3).reduce((s, l) => s + l.value, 0)

  return (
    <div ref={ref} className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
      {/* Pipeline board */}
      <div className="flex min-h-[480px] min-w-0 flex-col overflow-hidden rounded-[28px] border border-[#08224B]/10 bg-white shadow-[0_30px_70px_-35px_rgba(8,34,75,0.55)]">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3">
          <span className="grid h-10 w-10 place-items-center rounded-full text-white" style={{ background: accent }}>
            <Zap className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="font-outfit text-sm font-extrabold text-[#08224B]">Sales pipeline</p>
            <p className="text-[11px] font-semibold text-emerald-600">{auto ? 'Moving the highlighted lead…' : 'Tap a card to advance it'}</p>
          </div>
        </div>

        <LayoutGroup>
          <div ref={boardRef} className="grid flex-1 snap-x snap-mandatory auto-cols-[minmax(148px,1fr)] grid-flow-col gap-2.5 overflow-x-auto bg-slate-50/60 p-3 [scrollbar-width:thin]">
            {STAGES.map((stage, s) => {
              const inStage = leads.filter((l) => l.stage === s)
              return (
                <div key={stage} className="flex min-w-0 snap-start flex-col rounded-2xl border border-slate-200/70 bg-white/70 p-2">
                  <div className="px-1 pb-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{stage}</p>
                      <span className="rounded-full bg-slate-100 px-1.5 text-[10px] font-black text-slate-500">{inStage.length}</span>
                    </div>
                    <p className={`mt-0.5 text-sm font-extrabold ${s === 3 ? 'text-emerald-600' : 'text-[#08224B]'}`}>
                      <AnimatedNumber value={inStage.reduce((sum, l) => sum + l.value, 0)} reduce={reduce} />
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {inStage.map((lead) => (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        accent={accent}
                        reduce={reduce}
                        highlight={lead.id === 'hero'}
                        fresh={fresh === lead.id}
                        onAdvance={() => userAdvance(lead.id)}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </LayoutGroup>

        <div className="flex flex-wrap gap-2 border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={() => userAdvance('hero')}
            disabled={hero.stage >= 3}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-xs font-bold text-white transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: accent }}
          >
            Advance highlighted lead <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={addLead}
            disabled={incoming >= INCOMING.length}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[#08224B]/15 bg-white px-4 text-xs font-bold text-[#08224B] transition hover:border-[#08224B]/40 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" /> New lead arrives
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-xs font-bold text-slate-500 transition hover:text-[#08224B] active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Automations firing behind the board */}
      <div className="flex min-w-0 flex-col rounded-[28px] bg-[#061633] p-5 text-white shadow-[0_30px_70px_-35px_rgba(6,22,51,0.8)]">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ffd98a]">Automations firing</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
            <p className="text-[10px] font-black uppercase tracking-wider text-white/50">Won value</p>
            <p className="mt-1 font-outfit text-lg font-extrabold text-emerald-300"><AnimatedNumber value={wonValue} reduce={reduce} /></p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
            <p className="text-[10px] font-black uppercase tracking-wider text-white/50">Actions run</p>
            <p className="mt-1 font-outfit text-lg font-extrabold text-[#ffd98a]"><AnimatedNumber value={fired} reduce={reduce} plain /></p>
          </div>
        </div>

        <ul className="mt-4 flex-1 space-y-2 overflow-hidden">
          <AnimatePresence initial={false}>
            {events.map((ev, i) => {
              const Icon = ev.icon
              return (
                <motion.li
                  key={ev.id}
                  layout={!reduce}
                  initial={{ opacity: 0, x: 24, scale: 0.96 }}
                  animate={{ opacity: i > 3 ? 0.45 : 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={reduce ? { duration: 0 } : { ...spring.interactive, delay: i < 2 ? (1 - i) * 0.25 : 0 }}
                  className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 ${i < 2 ? 'border-[#ffae13]/40 bg-[#ffae13]/10' : 'border-white/10 bg-white/5'}`}
                >
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${ev.stage === 3 ? 'bg-emerald-400 text-[#061633]' : 'bg-[#ffae13] text-[#061633]'}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold leading-5">{ev.text}</p>
                    <p className="truncate text-[11px] font-semibold text-white/50">{ev.name} · {STAGES[ev.stage]}</p>
                  </div>
                </motion.li>
              )
            })}
          </AnimatePresence>
          {events.length === 0 && (
            <li className="rounded-2xl border border-dashed border-white/15 px-3 py-6 text-center text-xs font-semibold text-white/50">
              Move a lead and the follow-ups run on their own.
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

function LeadCard({ lead, accent, reduce, highlight, fresh, onAdvance }) {
  const source = SOURCES[lead.source]
  const SourceIcon = source.icon
  const won = lead.stage === 3
  return (
    <motion.button
      type="button"
      layoutId={lead.id}
      onClick={onAdvance}
      disabled={won}
      initial={fresh ? { opacity: 0, y: -16, scale: 0.9 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={reduce ? { duration: 0 } : { layout: spring.surface, default: { duration: 0.4, ease: ease.entrance } }}
      className={`relative w-full rounded-xl border bg-white p-2.5 text-left shadow-sm transition-colors enabled:hover:border-[#08224B]/30 disabled:cursor-default ${highlight ? 'border-transparent ring-2' : 'border-slate-200'}`}
      style={highlight ? { '--tw-ring-color': accent } : undefined}
      aria-label={won ? `${lead.name}, won` : `Advance ${lead.name} to ${STAGES[lead.stage + 1]}`}
    >
      {fresh && !reduce && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-[#ffae13]"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 1.12 }}
          transition={{ duration: 0.9, repeat: 2, ease: 'easeOut' }}
        />
      )}
      <p className="truncate text-[13px] font-extrabold text-[#08224B]">{lead.name}</p>
      <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1">
        <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide ${source.cls}`}>
          <SourceIcon className="h-2.5 w-2.5" /> {lead.source}
        </span>
        <span className="text-xs font-bold text-slate-600">{inr(lead.value)}</span>
      </div>
      {highlight && !won && (
        <span className="mt-2 flex min-h-7 items-center justify-center gap-1 rounded-lg text-[11px] font-black text-white" style={{ background: accent }}>
          Advance <ArrowRight className="h-3 w-3" />
        </span>
      )}
      {won && (
        <span className="mt-2 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-600">
          <Trophy className="h-3 w-3" /> Won
        </span>
      )}
    </motion.button>
  )
}

// Tweens between rupee totals so column sums visibly count up or down.
function AnimatedNumber({ value, reduce, plain }) {
  const [shown, setShown] = useState(value)
  const from = useRef(value)

  useEffect(() => {
    const controls = animate(from.current, value, {
      duration: reduce ? 0 : 0.7,
      ease: ease.entrance,
      onUpdate: (v) => {
        from.current = v
        setShown(v)
      },
    })
    return () => controls.stop()
  }, [value, reduce])

  return <span className="tabular-nums">{plain ? Math.round(shown) : inr(shown)}</span>
}
