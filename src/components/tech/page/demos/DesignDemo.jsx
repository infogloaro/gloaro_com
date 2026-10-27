import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from 'framer-motion'
import {
  ArrowRight, Bell, CalendarDays, Check, ChevronsLeftRight, Clock, Copy, HeartPulse, House,
  MessageCircle, Moon, MousePointerClick, Search, Star, Stethoscope, Sun, UserRound,
} from 'lucide-react'
import { ease, spring } from '../../../../lib/motion'

// Design-system themes. "Brand" follows the service accent passed in.
const THEMES = [
  { id: 'brand', label: 'Brand', secondary: '#ffae13' },
  { id: 'ocean', label: 'Ocean', primary: '#0e7bd8', secondary: '#22d3ee' },
  { id: 'forest', label: 'Forest', primary: '#15803d', secondary: '#a3e635' },
]

const MODES = {
  light: { bg: '#f4f7fc', card: '#ffffff', ink: '#0f1b33', muted: '#64748b', line: '#e6ebf2' },
  dark: { bg: '#0b1220', card: '#141d30', ink: '#e8eef8', muted: '#8a97ad', line: '#233049' },
}

// Sample clinic data shown on the finished screen.
const DOCTORS = [
  { id: 'meera', name: 'Dr. Meera Iyer', role: 'General physician', rating: '4.9', initials: 'MI' },
  { id: 'arjun', name: 'Dr. Arjun Rao', role: 'Dermatologist', rating: '4.8', initials: 'AR' },
]

// Prototype links: which hotspot leads to which next screen.
const FLOWS = {
  cta: { label: 'Pick a time slot', kind: 'slots' },
  doctor: { label: 'Doctor profile', kind: 'profile' },
}

const TYPE_SCALE = [
  ['Display', 'text-2xl font-black', '24/32'],
  ['Title', 'text-lg font-extrabold', '18/26'],
  ['Body', 'text-sm font-medium', '14/22'],
  ['Caption', 'text-[11px] font-semibold', '11/16'],
]

const clamp = (v) => Math.min(100, Math.max(0, v))

export default function DesignDemo({ accent }) {
  const ref = useRef(null)
  const stageRef = useRef(null)
  const dragging = useRef(false)
  const sweep = useRef(null)
  const toastTimer = useRef(null)
  const rippleTimer = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.4 })

  const [themeId, setThemeId] = useState('brand')
  const [dark, setDark] = useState(false)
  const [value, setValue] = useState(50)
  const [copied, setCopied] = useState(null)
  const [ripple, setRipple] = useState(null) // { x, y, key }
  const [flow, setFlow] = useState(null) // key of FLOWS
  const [toggleOn, setToggleOn] = useState(true)

  // Handle position in % from the left: wireframe shows left of it, hi-fi right of it.
  const pos = useMotionValue(50)
  const clip = useTransform(pos, (v) => `inset(0 0 0 ${v}%)`)
  const handleLeft = useTransform(pos, (v) => `${v}%`)
  const wireLabel = useTransform(pos, [0, 18], [0, 1])
  const finalLabel = useTransform(pos, [82, 100], [1, 0])
  useMotionValueEvent(pos, 'change', (v) => setValue(Math.round(v)))

  // One sweep left → right → middle when the demo scrolls into view.
  useEffect(() => {
    if (!inView || reduce) return undefined
    const controls = animate(pos, [50, 6, 94, 50], { duration: 3.6, times: [0, 0.28, 0.72, 1], ease: 'easeInOut', delay: 0.4 })
    sweep.current = controls
    return () => controls.stop()
  }, [inView, reduce, pos])

  useEffect(() => () => {
    window.clearTimeout(toastTimer.current)
    window.clearTimeout(rippleTimer.current)
  }, [])

  const base = THEMES.find((t) => t.id === themeId)
  const theme = { ...base, primary: base.primary || accent }
  const mode = dark ? MODES.dark : MODES.light
  const vars = {
    '--p': theme.primary, '--s': theme.secondary, '--bg': mode.bg, '--card': mode.card,
    '--ink': mode.ink, '--muted': mode.muted, '--line': mode.line,
  }
  const tokens = [
    ['Primary', theme.primary],
    ['Secondary', theme.secondary],
    ['Surface', mode.card],
    ['Ink', mode.ink],
  ]

  function moveTo(clientX) {
    const r = stageRef.current?.getBoundingClientRect()
    if (!r || !r.width) return
    pos.set(clamp(((clientX - r.left) / r.width) * 100))
  }

  function onPointerDown(e) {
    sweep.current?.stop()
    dragging.current = true
    e.currentTarget.setPointerCapture?.(e.pointerId)
    moveTo(e.clientX)
  }

  function onKeyDown(e) {
    const step = e.shiftKey ? 20 : 5
    const map = { ArrowLeft: -step, ArrowDown: -step, ArrowRight: step, ArrowUp: step }
    let next = null
    if (e.key in map) next = clamp(pos.get() + map[e.key])
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = 100
    if (next === null) return
    e.preventDefault()
    sweep.current?.stop()
    pos.set(next)
  }

  function copy(hex) {
    navigator.clipboard?.writeText(hex).catch(() => {})
    setCopied(hex)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setCopied(null), 1400)
  }

  // Hotspot tap on the hi-fi screen: ripple where tapped, then link to the next screen.
  function tapHotspot(e, key) {
    const r = stageRef.current?.getBoundingClientRect()
    if (r) setRipple({ x: e.clientX - r.left, y: e.clientY - r.top, key: Date.now() })
    setFlow(key)
    window.clearTimeout(rippleTimer.current)
    rippleTimer.current = window.setTimeout(() => setRipple(null), reduce ? 0 : 700)
  }

  return (
    <div ref={ref} className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
      {/* Comparison card */}
      <div className="min-w-0 overflow-hidden rounded-[28px] border border-[#08224B]/10 bg-white shadow-[0_30px_70px_-35px_rgba(8,34,75,0.55)]">
        <div className="grid gap-5 p-4 sm:grid-cols-[minmax(0,300px)_1fr] sm:p-5">
          {/* Before / after screen */}
          <div className="mx-auto w-full max-w-[300px] min-w-0">
            <div
              ref={stageRef}
              style={vars}
              className="relative h-[412px] select-none overflow-hidden rounded-[26px] border-[5px] border-[#08224B] shadow-[0_24px_50px_-28px_rgba(8,34,75,0.7)]"
            >
              <Wireframe />
              <motion.div className="absolute inset-0" style={{ clipPath: clip, WebkitClipPath: clip }}>
                <HiFi onTap={tapHotspot} flow={flow} reduce={reduce} />
              </motion.div>

              <AnimatePresence>
                {ripple && !reduce && (
                  <motion.span
                    key={ripple.key}
                    initial={{ scale: 0, opacity: 0.55 }}
                    animate={{ scale: 1, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.65, ease: ease.entrance }}
                    className="pointer-events-none absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--s)]"
                    style={{ left: ripple.x, top: ripple.y }}
                  />
                )}
              </AnimatePresence>

              {/* Stage labels */}
              <motion.span style={{ opacity: wireLabel }} className="pointer-events-none absolute left-2 top-2 rounded-full bg-slate-700/85 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.16em] text-white">Wireframe</motion.span>
              <motion.span style={{ opacity: finalLabel }} className="pointer-events-none absolute right-2 top-2 rounded-full bg-[#ffae13] px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.16em] text-[#061633]">Final</motion.span>

              {/* Drag handle */}
              <motion.div
                role="slider"
                tabIndex={0}
                aria-label="Compare wireframe and finished design"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={value}
                aria-valuetext={`${value}% wireframe`}
                onPointerDown={onPointerDown}
                onPointerMove={(e) => dragging.current && moveTo(e.clientX)}
                onPointerUp={() => { dragging.current = false }}
                onPointerCancel={() => { dragging.current = false }}
                onKeyDown={onKeyDown}
                style={{ left: handleLeft, touchAction: 'none' }}
                className="group absolute inset-y-0 z-10 w-10 -translate-x-1/2 cursor-ew-resize outline-none"
              >
                <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(8,34,75,0.25)]" />
                <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-[#08224B] text-white shadow-lg transition-transform group-hover:scale-105 group-focus-visible:ring-4 group-focus-visible:ring-[#ffae13]/60 group-active:scale-95">
                  <ChevronsLeftRight className="h-4 w-4" />
                </span>
              </motion.div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex min-w-0 flex-col gap-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Theme</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {THEMES.map((t) => {
                  const on = t.id === themeId
                  const color = t.primary || accent
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setThemeId(t.id)}
                      aria-pressed={on}
                      className={`flex min-h-10 items-center gap-2 rounded-full border px-3 text-xs font-bold transition active:scale-95 ${on ? 'border-[#08224B] bg-[#08224B] text-white' : 'border-[#08224B]/15 bg-white text-[#08224B] hover:border-[#08224B]/40'}`}
                    >
                      <span className="flex -space-x-1">
                        <span className="h-3.5 w-3.5 rounded-full ring-2 ring-white" style={{ background: color }} />
                        <span className="h-3.5 w-3.5 rounded-full ring-2 ring-white" style={{ background: t.secondary }} />
                      </span>
                      {t.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Mode</p>
              <div className="mt-2 inline-flex rounded-full border border-[#08224B]/15 bg-slate-50 p-1">
                {[[false, Sun, 'Light'], [true, Moon, 'Dark']].map(([isDark, Icon, label]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setDark(isDark)}
                    aria-pressed={dark === isDark}
                    className={`relative flex min-h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-bold transition-colors ${dark === isDark ? 'text-white' : 'text-[#08224B]/70 hover:text-[#08224B]'}`}
                  >
                    {dark === isDark && <motion.span layoutId="design-mode-pill" transition={spring.interactive} className="absolute inset-0 rounded-full bg-[#08224B]" />}
                    <Icon className="relative h-3.5 w-3.5" />
                    <span className="relative">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Fidelity</p>
                <p className="font-outfit text-sm font-extrabold text-[#08224B]">{100 - value}% final</p>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-[linear-gradient(90deg,#ffd98a,#ffae13)]" style={{ width: `${100 - value}%` }} />
              </div>
              <p className="mt-2 text-xs font-medium leading-5 text-slate-500">
                Drag the handle or use the arrow keys. Same layout, two stages: structure first, then colour, type and imagery.
              </p>
            </div>

            <div className="mt-auto flex items-start gap-2.5 rounded-2xl border border-[#ffae13]/40 bg-[#ffae13]/10 px-3 py-2.5">
              <MousePointerClick className="mt-0.5 h-4 w-4 shrink-0 text-[#b77700]" />
              <p className="text-xs font-semibold leading-5 text-[#08224B]">
                Tap <span className="font-extrabold">Book appointment</span> or a doctor on the finished screen to follow the prototype link.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Design system panel */}
      <div className="relative min-w-0 rounded-[28px] bg-[#061633] p-5 text-white shadow-[0_30px_70px_-35px_rgba(6,22,51,0.8)]">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ffd98a]">Design system</p>

        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-white/50">Colour tokens</p>
        <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {tokens.map(([name, hex]) => (
            <li key={name}>
              <button
                type="button"
                onClick={() => copy(hex)}
                aria-label={`Copy ${name} ${hex}`}
                className="group flex min-h-10 w-full items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1.5 text-left transition hover:border-white/30 active:scale-95"
              >
                <span className="h-8 w-8 shrink-0 rounded-lg ring-1 ring-white/20 transition-colors duration-500" style={{ background: hex }} />
                <span className="min-w-0">
                  <span className="block text-[10px] font-bold text-white/60">{name}</span>
                  <span className="flex items-center gap-1 text-[11px] font-extrabold uppercase">
                    {hex}
                    {copied === hex ? <Check className="h-3 w-3 text-emerald-300" /> : <Copy className="h-3 w-3 text-white/30 group-hover:text-white/70" />}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-[10px] font-black uppercase tracking-[0.22em] text-white/50">Type scale</p>
        <ul className="mt-2 space-y-1">
          {TYPE_SCALE.map(([name, cls, size]) => (
            <li key={name} className="flex items-baseline gap-3">
              <span className={`font-outfit leading-tight ${cls}`}>Aa</span>
              <span className="text-xs font-bold text-white/80">{name}</span>
              <span className="ml-auto text-[10px] font-semibold tabular-nums text-white/40">{size}</span>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-[10px] font-black uppercase tracking-[0.22em] text-white/50">Components</p>
        <div className="mt-2 flex flex-wrap items-center gap-2" style={vars}>
          <span className="rounded-lg bg-[var(--p)] px-3 py-2 text-[11px] font-extrabold text-white transition-colors duration-500">Primary</span>
          <span className="rounded-lg border border-[var(--p)] px-3 py-2 text-[11px] font-extrabold text-white transition-colors duration-500">Outline</span>
          <span className="rounded-lg bg-[var(--s)] px-3 py-2 text-[11px] font-extrabold text-[#061633] transition-colors duration-500">Accent</span>
          <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-2 text-[11px] font-semibold text-white/50">
            <Search className="h-3 w-3 shrink-0" /> <span className="truncate">Search doctors</span>
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={toggleOn}
            aria-label="Sample toggle"
            onClick={() => setToggleOn((v) => !v)}
            className="grid min-h-10 place-items-center px-1"
          >
            <span className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors duration-500 ${toggleOn ? 'bg-[var(--p)]' : 'bg-white/20'}`}>
              <motion.span layout transition={spring.interactive} className={`h-5 w-5 rounded-full bg-white shadow ${toggleOn ? 'ml-auto' : ''}`} />
            </span>
          </button>
        </div>

        <p className="mt-5 text-[10px] font-black uppercase tracking-[0.22em] text-white/50">Prototype</p>
        <div className="mt-2 flex items-center gap-2" style={vars}>
          <Thumb kind="home" label="Home" />
          <svg viewBox="0 0 60 20" className="h-5 min-w-0 flex-1" aria-hidden="true">
            <line x1="2" y1="10" x2="54" y2="10" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="4 4" />
            {flow && (
              <motion.path
                key={flow}
                d="M2 10 H54 M48 4 L55 10 L48 16"
                fill="none"
                stroke="#ffae13"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: reduce ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease: ease.entrance }}
              />
            )}
          </svg>
          <AnimatePresence mode="wait">
            <motion.div
              key={flow || 'none'}
              initial={{ opacity: 0, x: reduce ? 0 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: ease.entrance, delay: flow && !reduce ? 0.3 : 0 }}
            >
              {flow ? <Thumb kind={FLOWS[flow].kind} label={FLOWS[flow].label} active /> : <Thumb kind="empty" label="Tap a hotspot" />}
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4 }}
              transition={spring.interactive}
              role="status"
              className="absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-emerald-400 px-3 py-1.5 text-[11px] font-extrabold text-[#061633] shadow-lg"
            >
              <Check className="h-3.5 w-3.5" /> Copied {copied}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Grey wireframe: same layout as the hi-fi screen, with annotations.
function Wireframe() {
  return (
    <div className="absolute inset-0 bg-[#f3f4f6] bg-[radial-gradient(#d4d8de_1px,transparent_1px)] [background-size:12px_12px] px-3 pt-3">
      <div className="flex h-10 items-center gap-2">
        <span className="h-8 w-8 rounded-full border-2 border-slate-300 bg-white" />
        <span className="flex-1 space-y-1.5">
          <span className="block h-2 w-16 rounded bg-slate-300" />
          <span className="block h-2.5 w-24 rounded bg-slate-400/70" />
        </span>
        <span className="h-7 w-7 rounded-lg border-2 border-slate-300 bg-white" />
      </div>
      <div className="relative mt-2 flex h-8 items-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-white px-2">
        <span className="h-3 w-3 rounded-full border-2 border-slate-300" />
        <span className="h-2 w-24 rounded bg-slate-200" />
        <Tag className="-top-2 right-2">Search</Tag>
      </div>
      <div className="relative mt-3 h-[92px]">
        <XBox className="h-full w-full rounded-xl" />
        <Tag className="left-2 top-2">Hero image</Tag>
      </div>
      <span className="mt-3 block h-2.5 w-24 rounded bg-slate-400/70" />
      <div className="relative mt-2 space-y-1.5">
        {[0, 1].map((i) => (
          <div key={i} className="flex h-10 items-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-2">
            <XBox className="h-7 w-7 rounded-full" />
            <span className="flex-1 space-y-1">
              <span className="block h-2 w-20 rounded bg-slate-300" />
              <span className="block h-1.5 w-14 rounded bg-slate-200" />
            </span>
            <span className="h-2 w-6 rounded bg-slate-200" />
          </div>
        ))}
        <Tag className="-top-2 right-2">List item</Tag>
      </div>
      <div className="relative mt-3 grid h-10 place-items-center rounded-lg bg-slate-400">
        <span className="h-2 w-24 rounded bg-white/80" />
        <Tag className="-top-2 left-2">Primary CTA</Tag>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex h-10 items-center justify-around border-t-2 border-slate-300 bg-white">
        {[0, 1, 2, 3].map((i) => <span key={i} className="h-4 w-4 rounded border-2 border-slate-300" />)}
        <Tag className="-top-2.5 right-2">Tab bar</Tag>
      </div>
    </div>
  )
}

function Tag({ className = '', children }) {
  return <span className={`absolute rounded border border-dashed border-sky-500 bg-sky-50 px-1.5 py-px text-[8px] font-black uppercase tracking-wider text-sky-700 ${className}`}>{children}</span>
}

function XBox({ className = '' }) {
  return (
    <span className={`relative block overflow-hidden border-2 border-slate-300 bg-slate-100 ${className}`}>
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden="true">
        <line x1="0" y1="0" x2="100" y2="100" stroke="#cbd5e1" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="#cbd5e1" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
    </span>
  )
}

// Finished screen, coloured entirely through the CSS variables on the stage.
function HiFi({ onTap, flow, reduce }) {
  const tint = (pct) => ({ background: `color-mix(in srgb, var(--p) ${pct}%, var(--card))` })
  const colors = 'transition-colors duration-500'
  return (
    <div className={`absolute inset-0 bg-[var(--bg)] px-3 pt-3 text-[var(--ink)] ${colors}`}>
      <div className="flex h-10 items-center gap-2">
        <span className={`grid h-8 w-8 place-items-center rounded-full text-[11px] font-black text-white ${colors}`} style={{ background: 'linear-gradient(135deg, var(--p), var(--s))' }}>PS</span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-[10px] font-semibold text-[var(--muted)]">Good morning</span>
          <span className="block truncate font-outfit text-sm font-extrabold">Priya Sharma</span>
        </span>
        <span className={`relative grid h-7 w-7 place-items-center rounded-lg bg-[var(--card)] text-[var(--ink)] shadow-sm ${colors}`}>
          <Bell className="h-3.5 w-3.5" />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[var(--s)]" />
        </span>
      </div>

      <div className={`mt-2 flex h-8 items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--card)] px-2.5 text-[11px] font-medium text-[var(--muted)] ${colors}`}>
        <Search className="h-3.5 w-3.5" /> Search doctors, clinics
      </div>

      {/* Hero card with CSS-gradient "imagery" */}
      <div className={`relative mt-3 h-[92px] overflow-hidden rounded-xl bg-[var(--p)] p-3 text-white ${colors}`}>
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.35),transparent_45%),linear-gradient(160deg,transparent_40%,rgba(0,0,0,0.25))]" />
        <span className={`pointer-events-none absolute -bottom-6 -right-4 h-20 w-20 rounded-full bg-[var(--s)] opacity-80 ${colors}`} />
        <span className="pointer-events-none absolute -bottom-2 right-9 h-10 w-10 rounded-full border-4 border-white/30" />
        <HeartPulse className="pointer-events-none absolute bottom-3 right-4 h-7 w-7 text-white/90" />
        <p className="relative text-[9px] font-black uppercase tracking-[0.18em] text-white/80">Health check-up</p>
        <p className="relative mt-1 max-w-[70%] font-outfit text-base font-extrabold leading-tight">Full body check, 20% off this week</p>
      </div>

      <p className="mt-3 flex h-3.5 items-center justify-between text-[11px] font-extrabold">
        Top doctors <span className="text-[10px] font-bold text-[var(--p)]">See all</span>
      </p>
      <div className="mt-2 space-y-1.5">
        {DOCTORS.map((d, i) => (
          <button
            key={d.id}
            type="button"
            onClick={(e) => onTap(e, 'doctor')}
            className={`flex h-10 w-full items-center gap-2 rounded-lg border bg-[var(--card)] px-2 text-left transition active:scale-[0.98] ${flow === 'doctor' && i === 0 ? 'border-[var(--p)]' : 'border-[var(--line)]'}`}
          >
            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-black text-[var(--p)] ${colors}`} style={tint(18)}>{d.initials}</span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-[11px] font-extrabold">{d.name}</span>
              <span className="flex items-center gap-1 text-[9px] font-semibold text-[var(--muted)]"><Stethoscope className="h-2.5 w-2.5" />{d.role}</span>
            </span>
            <span className="flex items-center gap-0.5 text-[10px] font-extrabold"><Star className="h-3 w-3 fill-[#ffae13] text-[#ffae13]" />{d.rating}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={(e) => onTap(e, 'cta')}
        className={`relative mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[var(--p)] text-xs font-extrabold text-white shadow-[0_10px_20px_-10px_var(--p)] transition active:scale-[0.98] ${colors}`}
      >
        <CalendarDays className="h-4 w-4" /> Book appointment
        {!flow && (
          <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center">
            {!reduce && <span className="absolute h-full w-full animate-ping rounded-full bg-[#ffae13] opacity-70" />}
            <span className="relative h-2.5 w-2.5 rounded-full bg-[#ffae13] ring-2 ring-white" />
          </span>
        )}
      </button>

      <div className={`absolute inset-x-0 bottom-0 flex h-10 items-center justify-around border-t border-[var(--line)] bg-[var(--card)] ${colors}`}>
        {[House, CalendarDays, MessageCircle, UserRound].map((Icon, i) => (
          <Icon key={i} className={`h-4 w-4 ${i === 0 ? 'text-[var(--p)]' : 'text-[var(--muted)]'} ${colors}`} />
        ))}
      </div>
    </div>
  )
}

// Mini screen thumbnails for the prototype flow.
function Thumb({ kind, label, active }) {
  return (
    <div className="flex w-[84px] shrink-0 flex-col items-center gap-1.5">
      <div className={`relative h-[92px] w-[60px] overflow-hidden rounded-xl border-2 p-1.5 transition-colors ${active ? 'border-[#ffae13]' : 'border-white/15'} ${kind === 'empty' ? 'border-dashed bg-white/5' : 'bg-white'}`}>
        {kind === 'home' && (
          <>
            <span className="block h-1.5 w-8 rounded bg-slate-300" />
            <span className="mt-1.5 block h-6 rounded bg-[var(--p)] transition-colors duration-500" />
            <span className="mt-1.5 block h-3 rounded bg-slate-100" />
            <span className="mt-1 block h-3 rounded bg-slate-100" />
            <span className="mt-1.5 block h-2.5 rounded bg-[var(--p)] transition-colors duration-500" />
          </>
        )}
        {kind === 'slots' && (
          <>
            <span className="flex items-center gap-1 text-[7px] font-black text-[#08224B]"><Clock className="h-2 w-2" />Slots</span>
            <span className="mt-1.5 grid grid-cols-3 gap-0.5">
              {Array.from({ length: 9 }, (_, i) => (
                <span key={i} className={`h-2.5 rounded-sm ${i === 4 ? 'bg-[var(--p)]' : 'bg-slate-100'} transition-colors duration-500`} />
              ))}
            </span>
            <span className="absolute inset-x-1.5 bottom-1.5 block h-2.5 rounded bg-[var(--p)] transition-colors duration-500" />
          </>
        )}
        {kind === 'profile' && (
          <>
            <span className="mx-auto mt-1 block h-6 w-6 rounded-full bg-[var(--p)] transition-colors duration-500" />
            <span className="mx-auto mt-1.5 block h-1.5 w-8 rounded bg-slate-300" />
            <span className="mx-auto mt-1 block h-1 w-6 rounded bg-slate-200" />
            <span className="mt-2 block h-3 rounded bg-slate-100" />
            <span className="absolute inset-x-1.5 bottom-1.5 block h-2.5 rounded bg-[var(--s)] transition-colors duration-500" />
          </>
        )}
        {kind === 'empty' && <ArrowRight className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-white/30" />}
      </div>
      <span className={`text-center text-[10px] font-bold leading-tight ${active ? 'text-[#ffd98a]' : 'text-white/50'}`}>{label}</span>
    </div>
  )
}
