import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { Bot, BrainCircuit, FileText, Headset, Search, ShieldCheck, Sparkles, UserRound } from 'lucide-react'
import { ease, spring } from '../../../../lib/motion'

// Sample business knowledge the assistant is allowed to use.
const DOCS = [
  { id: 'hours', title: 'Store timings.pdf' },
  { id: 'delivery', title: 'Delivery areas.xlsx' },
  { id: 'returns', title: 'Return policy.docx' },
]

const QUESTIONS = [
  { q: 'What time do you open on Sunday?', doc: 'hours', a: 'We are open on Sundays from 10:00 AM to 6:00 PM. Weekday timings are 9:00 AM to 9:00 PM.' },
  { q: 'Do you deliver to Salem?', doc: 'delivery', a: 'Yes, Salem is in our delivery area. Orders placed before 2 PM are usually dispatched the same day.' },
  { q: 'I need a bulk quote for 200 units', doc: null, a: 'Bulk orders need a custom quote, so I have passed your request to our sales team. They will contact you shortly.' },
]

const STEPS = [
  [BrainCircuit, 'Understand the question'],
  [Search, 'Search approved documents'],
  [ShieldCheck, 'Check it is within limits'],
  [Sparkles, 'Answer or hand over'],
]

const STEP_MS = 650

export default function AiDemo({ accent }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [active, setActive] = useState(null) // index into QUESTIONS
  const [step, setStep] = useState(-1) // pipeline step reached; 4 = answered
  const [typed, setTyped] = useState('')
  const [history, setHistory] = useState([])

  // Ask the first question automatically when the demo scrolls into view.
  useEffect(() => {
    if (inView && active === null) ask(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  // Walk the pipeline, then stream the answer word by word.
  useEffect(() => {
    if (active === null) return undefined
    if (step < STEPS.length) {
      const id = window.setTimeout(() => setStep((s) => s + 1), reduce ? 0 : STEP_MS)
      return () => window.clearTimeout(id)
    }
    const answer = QUESTIONS[active].a
    if (typed.length >= answer.length) return undefined
    const words = answer.split(' ')
    const next = words.slice(0, typed ? typed.split(' ').length + 1 : 1).join(' ')
    const id = window.setTimeout(() => setTyped(next), reduce ? 0 : 55)
    return () => window.clearTimeout(id)
  }, [active, step, typed, reduce])

  function ask(index) {
    if (active !== null && QUESTIONS[active]) {
      const done = QUESTIONS[active]
      setHistory((h) => [...h, { q: done.q, a: done.a, handoff: !done.doc }].slice(-2))
    }
    setActive(index)
    setStep(0)
    setTyped('')
  }

  const current = active === null ? null : QUESTIONS[active]
  const answering = current && step >= STEPS.length
  const busy = current && (step < STEPS.length || typed.length < current.a.length)

  return (
    <div ref={ref} className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
      {/* Chat window */}
      <div className="flex min-h-[380px] flex-col lg:min-h-[460px] overflow-hidden rounded-[28px] border border-[#08224B]/10 bg-white shadow-[0_30px_70px_-35px_rgba(8,34,75,0.55)]">
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
          <span className="relative grid h-10 w-10 place-items-center rounded-full text-white" style={{ background: accent }}>
            <Bot className="h-5 w-5" />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
          </span>
          <div>
            <p className="text-sm font-extrabold text-[#08224B]">Store assistant</p>
            <p className="text-[11px] font-semibold text-emerald-600">{busy ? 'Thinking…' : 'Online · answers from your documents'}</p>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-hidden bg-slate-50/60 p-4">
          {history.map((item) => <Exchange key={item.q} q={item.q} a={item.a} handoff={item.handoff} accent={accent} faded />)}
          {current && (
            <>
              <Bubble side="user">{current.q}</Bubble>
              {!answering ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-16 items-center justify-center gap-1 rounded-2xl rounded-bl-md bg-white px-3 py-3 shadow-sm">
                  {[0, 1, 2].map((d) => (
                    <motion.span key={d} className="h-1.5 w-1.5 rounded-full bg-slate-400" animate={reduce ? undefined : { y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.12 }} />
                  ))}
                </motion.div>
              ) : (
                <Bubble side="bot" accent={accent}>
                  {typed}
                  {typed.length < current.a.length && <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse rounded-sm bg-slate-400 align-middle" />}
                </Bubble>
              )}
              {answering && !current.doc && typed.length >= current.a.length && <HandoffCard />}
            </>
          )}
        </div>

        <div className="border-t border-slate-100 p-3">
          <p className="px-1 pb-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Try a question</p>
          <div className="flex flex-wrap gap-2">
            {QUESTIONS.map((item, i) => (
              <button
                key={item.q}
                type="button"
                disabled={busy}
                onClick={() => ask(i)}
                className={`min-h-9 rounded-full border px-3 text-xs font-bold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${active === i ? 'border-transparent text-white' : 'border-[#08224B]/15 bg-white text-[#08224B] hover:border-[#08224B]/40'}`}
                style={active === i ? { background: accent } : undefined}
              >
                {item.q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* What happens behind the answer */}
      <div className="rounded-[28px] bg-[#061633] p-5 text-white shadow-[0_30px_70px_-35px_rgba(6,22,51,0.8)]">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ffd98a]">Behind the answer</p>
        <ol className="mt-4 space-y-2.5">
          {STEPS.map(([Icon, label], i) => {
            const done = current && step > i
            const running = current && step === i
            return (
              <li key={label} className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition-colors duration-300 ${done ? 'border-emerald-400/30 bg-emerald-400/10' : running ? 'border-[#ffae13]/50 bg-[#ffae13]/10' : 'border-white/10 bg-white/5'}`}>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${done ? 'bg-emerald-400 text-[#061633]' : running ? 'bg-[#ffae13] text-[#061633]' : 'bg-white/10 text-white/60'}`}>
                  <Icon className={`h-4 w-4 ${running && !reduce ? 'animate-pulse' : ''}`} />
                </span>
                <span className="text-sm font-bold">{label}</span>
                {done && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={spring.interactive} className="ml-auto text-[10px] font-black uppercase tracking-wider text-emerald-300">Done</motion.span>}
              </li>
            )
          })}
        </ol>

        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.22em] text-white/50">Your knowledge base</p>
        <ul className="mt-3 grid gap-2">
          {DOCS.map((doc) => {
            const hit = current && current.doc === doc.id && step >= 2
            return (
              <motion.li key={doc.id} animate={{ scale: hit ? 1.02 : 1 }} transition={spring.interactive} className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${hit ? 'border-[#ffae13] bg-[#ffae13]/15 text-white' : 'border-white/10 text-white/60'}`}>
                <FileText className={`h-4 w-4 ${hit ? 'text-[#ffae13]' : ''}`} />
                {doc.title}
                {hit && <span className="ml-auto rounded-full bg-[#ffae13] px-2 py-0.5 text-[9px] font-black uppercase text-[#061633]">Source</span>}
              </motion.li>
            )
          })}
        </ul>
        <AnimatePresence>
          {current && !current.doc && step >= 2 && (
            <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 rounded-xl bg-white/5 px-3 py-2 text-[11px] font-semibold text-white/70">
              No approved answer found, so the assistant hands over instead of guessing.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Bubble({ side, accent, children, faded }) {
  const user = side === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: faded ? 0.55 : 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: ease.entrance }}
      className={`flex items-end gap-2 ${user ? 'justify-end' : ''}`}
    >
      {!user && <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-white" style={{ background: accent }}><Bot className="h-3.5 w-3.5" /></span>}
      <p className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm font-medium leading-6 shadow-sm ${user ? 'rounded-br-md bg-[#08224B] text-white' : 'rounded-bl-md bg-white text-[#08224B]'}`}>{children}</p>
      {user && <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-200 text-slate-600"><UserRound className="h-3.5 w-3.5" /></span>}
    </motion.div>
  )
}

function Exchange({ q, a, handoff, accent, faded }) {
  return (
    <div className="space-y-2">
      <Bubble side="user" faded={faded}>{q}</Bubble>
      <Bubble side="bot" accent={accent} faded={faded}>{a}{handoff && ' (handed to sales)'}</Bubble>
    </div>
  )
}

function HandoffCard() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={spring.interactive} className="ml-9 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2.5">
      <Headset className="h-5 w-5 shrink-0 text-amber-600" />
      <div>
        <p className="text-xs font-extrabold text-amber-900">Handed to a human</p>
        <p className="text-[11px] font-semibold text-amber-800/80">Sales team notified on WhatsApp</p>
      </div>
    </motion.div>
  )
}
