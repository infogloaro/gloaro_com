import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { Check, Gauge, Menu, Monitor, Play, RotateCcw, ShoppingBag, Smartphone, Tablet } from 'lucide-react'
import { ease, spring } from '../../../../lib/motion'

// Frame widths (px caps; the frame never grows past its container) and card columns.
const DEVICES = [
  { id: 'phone', label: 'Phone', Icon: Smartphone, max: 230, cols: 1 },
  { id: 'tablet', label: 'Tablet', Icon: Tablet, max: 420, cols: 2 },
  { id: 'desktop', label: 'Desktop', Icon: Monitor, max: 2000, cols: 3 },
]

// Sample brand themes for a fictional bakery.
const THEMES = [
  { id: 'warm', label: 'Warm', primary: '#c2410c', soft: '#fff1e6', ink: '#431407' },
  { id: 'fresh', label: 'Fresh', primary: '#059669', soft: '#e7f8f1', ink: '#064e3b' },
  { id: 'royal', label: 'Royal', primary: '#4f46e5', soft: '#eef0ff', ink: '#1e1b4b' },
]

const PRODUCTS = [
  { name: 'Sourdough loaf', price: '₹180' },
  { name: 'Butter croissant', price: '₹90' },
  { name: 'Celebration cake', price: '₹650' },
]

// Sample scores for the illustrative check, not results from a real site.
const SCORES = [
  ['Performance', 97],
  ['Accessibility', 100],
  ['SEO', 100],
  ['Best practices', 96],
]

const CHECKS = ['Images compressed (WebP)', 'Below-the-fold images lazy loaded', 'Structured data added', 'Sitemap generated']

const CHECK_MS = 520

export default function WebDemo({ accent }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [device, setDevice] = useState('desktop')
  const [theme, setTheme] = useState(THEMES[0])
  const [runKey, setRunKey] = useState(0) // 0 = never run
  const [checked, setChecked] = useState(0)
  const tour = useRef([])

  const stopTour = () => {
    tour.current.forEach((id) => window.clearTimeout(id))
    tour.current = []
  }

  // First run: tour the three screen sizes and run the speed check once.
  useEffect(() => {
    if (!inView) return undefined
    const t = (ms, fn) => tour.current.push(window.setTimeout(fn, reduce ? 0 : ms))
    t(0, () => setDevice('phone'))
    t(1500, () => setDevice('tablet'))
    t(3000, () => setDevice('desktop'))
    t(3600, () => setTheme(THEMES[1]))
    t(400, () => setRunKey(1))
    return stopTour
  }, [inView, reduce])

  // Tick the checklist one item at a time after each run starts.
  useEffect(() => {
    if (!runKey || checked >= CHECKS.length) return undefined
    const id = window.setTimeout(() => setChecked((c) => c + 1), reduce ? 0 : CHECK_MS)
    return () => window.clearTimeout(id)
  }, [runKey, checked, reduce])

  const run = () => {
    setChecked(0)
    setRunKey((k) => k + 1)
  }

  const current = DEVICES.find((d) => d.id === device)
  const running = runKey > 0 && checked < CHECKS.length

  return (
    <div ref={ref} className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      {/* Responsive preview */}
      <div className="flex min-w-0 flex-col overflow-hidden rounded-[28px] border border-[#08224B]/10 bg-white shadow-[0_30px_70px_-35px_rgba(8,34,75,0.55)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div className="flex rounded-full bg-slate-100 p-1" role="group" aria-label="Screen size">
            {DEVICES.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                aria-pressed={device === id}
                onClick={() => { stopTour(); setDevice(id) }}
                className="relative flex min-h-9 items-center gap-1.5 rounded-full px-3 text-xs font-bold text-[#08224B] transition active:scale-95"
              >
                {device === id && <motion.span layoutId="web-device-pill" transition={spring.interactive} className="absolute inset-0 rounded-full bg-white shadow-sm" />}
                <Icon className="relative h-3.5 w-3.5" />
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2" role="group" aria-label="Brand theme">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Theme</span>
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-label={`${t.label} theme`}
                aria-pressed={theme.id === t.id}
                onClick={() => { stopTour(); setTheme(t) }}
                className={`grid h-9 w-9 place-items-center rounded-full border-2 transition active:scale-90 ${theme.id === t.id ? 'border-[#08224B]' : 'border-transparent'}`}
              >
                <span className="h-6 w-6 rounded-full" style={{ background: t.primary }} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-1 items-start justify-center p-4 sm:p-6" style={{ background: `radial-gradient(circle at 50% 0%, ${accent}1f, transparent 70%)` }}>
          <motion.div
            initial={false}
            animate={{ maxWidth: current.max }}
            transition={reduce ? { duration: 0 } : spring.surface}
            className={`w-full overflow-hidden border-[#08224B]/80 bg-[#08224B] shadow-[0_24px_50px_-28px_rgba(8,34,75,0.7)] ${device === 'desktop' ? 'rounded-2xl border-2' : 'rounded-[26px] border-[6px]'}`}
          >
            {device === 'desktop' ? (
              <div className="flex items-center gap-1.5 bg-[#08224B] px-3 py-2">
                {['#f87171', '#fbbf24', '#34d399'].map((c) => <span key={c} className="h-2 w-2 rounded-full" style={{ background: c }} />)}
                <span className="ml-2 min-w-0 flex-1 truncate rounded-md bg-white/10 px-2 py-0.5 text-[9px] font-semibold text-white/70">bloombakery.example</span>
              </div>
            ) : (
              <div className="flex justify-center bg-[#08224B] pb-1"><span className="h-1.5 w-12 rounded-full bg-white/20" /></div>
            )}
            <SiteMock theme={theme} cols={current.cols} compact={device === 'phone'} reduce={reduce} />
          </motion.div>
        </div>
      </div>

      {/* Page speed check */}
      <div className="min-w-0 rounded-[28px] bg-[#061633] p-5 text-white shadow-[0_30px_70px_-35px_rgba(6,22,51,0.8)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ffd98a]">Page speed check</p>
            <p className="mt-1 text-[11px] font-semibold text-white/50">Sample run before every release</p>
          </div>
          <button
            type="button"
            onClick={run}
            disabled={running}
            className="flex min-h-10 items-center gap-2 rounded-full bg-[#ffae13] px-4 text-xs font-extrabold text-[#061633] transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {runKey ? <RotateCcw className={`h-3.5 w-3.5 ${running && !reduce ? 'animate-spin' : ''}`} /> : <Play className="h-3.5 w-3.5" />}
            {running ? 'Checking…' : runKey ? 'Run again' : 'Run check'}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
          {SCORES.map(([label, score], i) => (
            <ScoreGauge key={`${label}-${runKey}`} label={label} score={score} runKey={runKey} delay={i * 0.12} reduce={reduce} />
          ))}
        </div>

        <ul className="mt-5 space-y-2">
          {CHECKS.map((item, i) => {
            const done = runKey > 0 && checked > i
            const active = running && checked === i
            return (
              <li key={item} className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors duration-300 ${done ? 'border-emerald-400/30 bg-emerald-400/10 text-white' : active ? 'border-[#ffae13]/50 bg-[#ffae13]/10 text-white' : 'border-white/10 text-white/55'}`}>
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg ${done ? 'bg-emerald-400 text-[#061633]' : active ? 'bg-[#ffae13] text-[#061633]' : 'bg-white/10 text-white/50'}`}>
                  {done ? (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={spring.interactive}><Check className="h-3.5 w-3.5" /></motion.span>
                  ) : (
                    <Gauge className={`h-3.5 w-3.5 ${active && !reduce ? 'animate-pulse' : ''}`} />
                  )}
                </span>
                {item}
              </li>
            )
          })}
        </ul>
        <p className="mt-4 text-[10px] font-semibold text-white/40">Illustrative sample scores, not a real client report.</p>
      </div>
    </div>
  )
}

// A small business homepage that reflows with the frame width.
function SiteMock({ theme, cols, compact, reduce }) {
  const tr = reduce ? { duration: 0 } : { duration: 0.4, ease: ease.entrance }
  return (
    <div className="bg-white transition-colors duration-500" style={{ color: theme.ink }}>
      <nav className="flex items-center justify-between px-3 py-2">
        <span className="flex items-center gap-1.5 text-[11px] font-black">
          <span className="h-4 w-4 rounded-md transition-colors duration-500" style={{ background: theme.primary }} />
          Bloom Bakery
        </span>
        {compact ? (
          <Menu className="h-4 w-4" />
        ) : (
          <span className="flex items-center gap-3 text-[9px] font-bold opacity-70">
            <span>Menu</span><span>Order</span><span>Visit</span>
            <ShoppingBag className="h-3.5 w-3.5" />
          </span>
        )}
      </nav>

      <motion.div layout transition={tr} className={`mx-2 flex gap-3 rounded-xl p-3 transition-colors duration-500 ${compact ? 'flex-col' : 'items-center'}`} style={{ background: theme.soft }}>
        <motion.div layout="position" transition={tr} className="min-w-0 flex-1">
          <p className="text-[8px] font-black uppercase tracking-[0.18em] opacity-60">Baked fresh daily</p>
          <p className={`mt-1 font-outfit font-extrabold leading-tight ${compact ? 'text-sm' : 'text-base'}`}>Bread worth waking up for</p>
          <span className="mt-2 inline-block rounded-full px-2.5 py-1 text-[9px] font-bold text-white transition-colors duration-500" style={{ background: theme.primary }}>Order online</span>
        </motion.div>
        <motion.div
          layout
          transition={tr}
          className={`shrink-0 rounded-lg transition-colors duration-500 ${compact ? 'h-14 w-full' : 'h-20 w-2/5'}`}
          style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primary}55)` }}
        />
      </motion.div>

      <p className="px-3 pb-1.5 pt-3 text-[9px] font-black uppercase tracking-[0.16em] opacity-60">Best sellers</p>
      <div className="grid gap-2 px-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {PRODUCTS.map((p) => (
          <motion.div layout transition={tr} key={p.name} className={`flex min-w-0 gap-2 rounded-lg border border-slate-100 p-1.5 ${cols === 1 ? 'items-center' : 'flex-col'}`}>
            <div className={`shrink-0 rounded-md transition-colors duration-500 ${cols === 1 ? 'h-8 w-8' : 'h-10 w-full'}`} style={{ background: theme.soft }} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[9px] font-bold">{p.name}</p>
              <p className="text-[9px] font-black transition-colors duration-500" style={{ color: theme.primary }}>{p.price}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="m-2 mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-white transition-colors duration-500" style={{ background: theme.ink }}>
        <p className="text-[10px] font-bold">Free delivery over ₹499</p>
        <span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-black" style={{ color: theme.ink }}>Shop now</span>
      </div>
    </div>
  )
}

const R = 26
const CIRC = 2 * Math.PI * R

// Circular score that fills and counts up; remounted (keyed) on every run.
function ScoreGauge({ label, score, runKey, delay, reduce }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!runKey) return undefined
    const controls = animate(0, score, { duration: reduce ? 0 : 1.4, delay: reduce ? 0 : delay, ease: ease.entrance, onUpdate: (v) => setValue(Math.round(v)) })
    return () => controls.stop()
  }, [runKey, score, delay, reduce])

  const colour = value >= 90 ? '#34d399' : value >= 50 ? '#ffae13' : '#f87171'
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-2 py-3">
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
          <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
          <circle
            cx="32"
            cy="32"
            r={R}
            fill="none"
            stroke={colour}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - value / 100)}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center font-outfit text-base font-extrabold tabular-nums" style={{ color: runKey ? colour : 'rgba(255,255,255,0.4)' }}>
          {runKey ? value : '–'}
        </span>
      </div>
      <p className="text-center text-[10px] font-bold leading-tight text-white/70">{label}</p>
    </div>
  )
}
