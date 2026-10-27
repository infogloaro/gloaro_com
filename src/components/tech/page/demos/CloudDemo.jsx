import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { Activity, Check, DatabaseBackup, FlaskConical, GitCommitHorizontal, HeartPulse, LoaderCircle, Package, Rocket, RotateCcw, Server, TriangleAlert, X } from 'lucide-react'
import { ease, spring } from '../../../../lib/motion'

const STAGES = [
  { icon: GitCommitHorizontal, label: 'Commit', time: '2s' },
  { icon: Package, label: 'Build', time: '41s' },
  { icon: FlaskConical, label: 'Test', time: '1m 08s' },
  { icon: Rocket, label: 'Deploy', time: '26s' },
  { icon: HeartPulse, label: 'Health check', time: '12s' },
]

// Sample log lines per stage: [while running, when done].
const LOGS = [
  ['$ git push origin main', '→ commit 8f3a2c1 "Add GST invoice export"'],
  ['Installing dependencies and building…', '✓ Build complete · bundle 412 KB'],
  ['Running 128 unit and API tests…', '✓ 128 passed · 0 failed'],
  ['Starting new containers (blue → green)…', '✓ Containers ready · traffic switched'],
  ['Checking /api/health and /api/orders…', '✓ All checks passing · p95 118 ms'],
]

const STAGE_MS = 700
const POINTS = 26
const BASE_SERIES = [112, 118, 109, 121, 115, 108, 117, 124, 113, 110, 119, 116, 111, 122, 114, 109, 118, 120, 112, 115, 117, 110, 121, 113, 116, 114]
const IDLE = STAGES.map(() => 'idle')

const latency = (incident) => (incident ? 680 + Math.random() * 280 : 104 + Math.random() * 22)

export default function CloudDemo({ accent }) {
  const ref = useRef(null)
  const termRef = useRef(null)
  const logId = useRef(0)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [run, setRun] = useState(null) // { steps, cursor }
  const [status, setStatus] = useState(IDLE)
  const [current, setCurrent] = useState(-1)
  const [logs, setLogs] = useState([{ id: 0, text: 'Pipeline ready · production on v1.4.2', tone: 'muted' }])
  const [patch, setPatch] = useState(2)
  const [failMode, setFailMode] = useState(false)
  const [incident, setIncident] = useState(false)
  const [rollback, setRollback] = useState(null) // null | 'run' | 'done'
  const [outcome, setOutcome] = useState(null) // null | 'shipped' | 'rolledback'
  const [errors, setErrors] = useState(0)
  const [uptime, setUptime] = useState(99.98)
  const [series, setSeries] = useState(BASE_SERIES)

  const running = !!run && run.cursor < run.steps.length

  // Ship the first release automatically when the demo scrolls into view.
  useEffect(() => {
    if (inView && !run) deploy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  // Play the scripted release one step at a time.
  useEffect(() => {
    if (!running) return undefined
    const step = run.steps[run.cursor]
    const id = window.setTimeout(() => {
      step.fn()
      setRun((r) => ({ ...r, cursor: r.cursor + 1 }))
    }, reduce ? 0 : step.delay)
    return () => window.clearTimeout(id)
  }, [run, running, reduce])

  // Live response-time feed while visible (skipped for reduced motion).
  useEffect(() => {
    if (!inView || reduce) return undefined
    const id = window.setInterval(() => {
      pushPoint(latency(incident))
      if (incident) setErrors((e) => e + 3)
    }, 900)
    return () => window.clearInterval(id)
  }, [inView, reduce, incident])

  // Keep the terminal pinned to the newest line without moving the page.
  useEffect(() => {
    const el = termRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [logs])

  function pushPoint(v) {
    setSeries((s) => [...s.slice(1 - POINTS), v])
  }

  function log(text, tone = 'plain') {
    setLogs((l) => [...l, { id: ++logId.current, text, tone }].slice(-40))
  }

  function mark(i, value) {
    setStatus((s) => s.map((v, j) => (j === i ? value : v)))
  }

  function deploy() {
    const from = `v1.4.${patch}`
    const to = `v1.4.${patch + 1}`
    const fail = failMode
    const steps = [{ delay: 0, fn: () => log(`▶ Release ${to} started`, 'accent') }]

    STAGES.forEach((_, i) => {
      const last = i === STAGES.length - 1
      steps.push({ delay: 250, fn: () => { setCurrent(i); mark(i, 'run'); log(i === 3 ? `Deploying ${to} to production…` : LOGS[i][0]) } })
      if (last && fail) {
        steps.push({ delay: STAGE_MS * 1.4, fn: () => { mark(i, 'fail'); setIncident(true); setErrors((e) => e + 12); pushPoint(910); log('✗ /api/orders returned 502 (3 of 3 retries)', 'error') } })
      } else {
        steps.push({ delay: STAGE_MS, fn: () => { mark(i, 'ok'); log(LOGS[i][1], 'ok') } })
      }
    })

    if (fail) {
      steps.push(
        { delay: 900, fn: () => { setRollback('run'); setCurrent(3); log(`↺ Auto-rollback to ${from} started`, 'warn') } },
        { delay: 900, fn: () => log(`Traffic switched back to ${from}`, 'warn') },
        { delay: 900, fn: () => { setIncident(false); setUptime(99.97); pushPoint(130); log(`✓ Health checks passing on ${from}`, 'ok') } },
        { delay: 500, fn: () => { setRollback('done'); setOutcome('rolledback'); log('Alert sent to on-call · incident logged', 'muted') } },
      )
    } else {
      steps.push({ delay: 400, fn: () => { setPatch((p) => p + 1); setOutcome('shipped'); log(`✓ ${to} is live · zero downtime`, 'accent') } })
    }

    setStatus(IDLE)
    setCurrent(0)
    setRollback(null)
    setOutcome(null)
    setRun({ steps, cursor: 0 })
  }

  const version = `v1.4.${patch}`
  const max = 1000
  const path = series.map((v, i) => `${(i / (POINTS - 1)) * 100},${40 - (Math.min(v, max) / max) * 36}`).join(' ')
  const latest = Math.round(series[series.length - 1])
  const progress = current < 0 ? 0 : (current / (STAGES.length - 1)) * 80
  const ring = 2 * Math.PI * 22

  return (
    <div ref={ref} className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
      {/* Pipeline + terminal */}
      <div className="flex min-h-[480px] min-w-0 flex-col overflow-hidden rounded-[28px] border border-[#08224B]/10 bg-white shadow-[0_30px_70px_-35px_rgba(8,34,75,0.55)]">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3">
          <span className="grid h-10 w-10 place-items-center rounded-full text-white" style={{ background: accent }}>
            <Server className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-outfit text-sm font-extrabold text-[#08224B]">Release pipeline</p>
            <p className={`text-[11px] font-semibold ${incident ? 'text-red-600' : rollback === 'run' ? 'text-amber-600' : 'text-emerald-600'}`}>
              {incident ? 'Health check failed' : rollback === 'run' ? 'Rolling back…' : running ? 'Release in progress…' : 'Production healthy'}
            </p>
          </div>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={version}
              initial={{ opacity: 0, y: -12, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
              transition={reduce ? { duration: 0 } : spring.interactive}
              className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-xs font-bold text-emerald-700"
            >
              {version}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Stages joined by a track with a travelling packet */}
        <div className="px-3 pb-2 pt-5 sm:px-5">
          <div className="relative">
          <div className="absolute left-[10%] right-[10%] top-4 h-1 rounded-full bg-slate-100 sm:top-[18px]" />
          <motion.div
            className="absolute left-[10%] top-4 h-1 rounded-full sm:top-[18px]"
            style={{ background: rollback ? '#f59e0b' : accent }}
            animate={{ width: `${progress}%` }}
            transition={reduce ? { duration: 0 } : { duration: 0.5, ease: ease.entrance }}
          />
          {current >= 0 && (
            <motion.span
              aria-hidden
              className={`absolute top-[11px] z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full ring-4 sm:top-[13px] ${rollback ? 'bg-amber-400 ring-amber-200' : incident ? 'bg-red-500 ring-red-200' : 'bg-[#ffae13] ring-[#ffd98a]'}`}
              animate={{ left: `${10 + progress}%` }}
              transition={reduce ? { duration: 0 } : spring.surface}
            />
          )}
          <ol className="relative grid grid-cols-5 gap-1">
            {STAGES.map((stage, i) => (
              <Stage key={stage.label} stage={stage} state={status[i]} rolledBack={i === 3 && rollback === 'done'} accent={accent} reduce={reduce} />
            ))}
          </ol>
          </div>
        </div>

        <AnimatePresence>
          {rollback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: reduce ? 0 : 0.3, ease: ease.entrance }}
              className="mx-3 overflow-hidden sm:mx-5"
            >
              <div className={`mb-2 flex items-center gap-3 rounded-2xl border px-3 py-2.5 ${rollback === 'done' ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
                {rollback === 'done' ? <Check className="h-5 w-5 shrink-0 text-emerald-600" /> : <RotateCcw className={`h-5 w-5 shrink-0 text-amber-600 ${reduce ? '' : 'animate-spin [animation-direction:reverse]'}`} />}
                <div className="min-w-0">
                  <p className={`text-xs font-extrabold ${rollback === 'done' ? 'text-emerald-900' : 'text-amber-900'}`}>
                    {rollback === 'done' ? `Recovered on ${version}` : `Rollback to ${version}`}
                  </p>
                  <p className={`text-[11px] font-semibold ${rollback === 'done' ? 'text-emerald-800/80' : 'text-amber-800/80'}`}>
                    {rollback === 'done' ? 'Customers kept working · the failed release was never kept live' : 'Failed release detected, switching traffic back automatically'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Terminal log */}
        <div className="mx-3 mb-3 flex-1 overflow-hidden rounded-2xl bg-[#0b1220] sm:mx-5">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-red-400/80" />
            <span className="h-2 w-2 rounded-full bg-amber-400/80" />
            <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
            <span className="ml-2 font-mono text-[10px] text-white/40">deploy.log</span>
          </div>
          <div ref={termRef} className="h-[150px] overflow-y-auto px-3 py-2 font-mono text-[11px] leading-5 sm:h-[170px]">
            {logs.map((line) => (
              <motion.p
                key={line.id}
                initial={reduce ? false : { opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className={`break-words ${TONES[line.tone]}`}
              >
                {line.text}
              </motion.p>
            ))}
            {running && <span className={`inline-block h-3 w-1.5 bg-white/60 align-middle ${reduce ? '' : 'animate-pulse'}`} />}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={deploy}
            disabled={running}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-xs font-bold text-white transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: accent }}
          >
            <Rocket className="h-3.5 w-3.5" /> Deploy release
          </button>
          <button
            type="button"
            role="switch"
            aria-checked={failMode}
            disabled={running}
            onClick={() => setFailMode((f) => !f)}
            className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3 text-xs font-bold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${failMode ? 'border-red-200 bg-red-50 text-red-700' : 'border-[#08224B]/15 bg-white text-[#08224B] hover:border-[#08224B]/40'}`}
          >
            <span className={`relative h-4 w-7 rounded-full transition-colors ${failMode ? 'bg-red-500' : 'bg-slate-300'}`}>
              <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-all ${failMode ? 'left-3.5' : 'left-0.5'}`} />
            </span>
            Simulate failure
          </button>
          {outcome && !running && (
            <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={spring.interactive} className={`text-[11px] font-black uppercase tracking-wider ${outcome === 'shipped' ? 'text-emerald-600' : 'text-amber-600'}`}>
              {outcome === 'shipped' ? `${version} shipped` : 'Rolled back safely'}
            </motion.span>
          )}
        </div>
      </div>

      {/* Monitoring */}
      <div className="min-w-0 rounded-[28px] bg-[#061633] p-5 text-white shadow-[0_30px_70px_-35px_rgba(6,22,51,0.8)]">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ffd98a]">Live monitoring</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
            <svg viewBox="0 0 52 52" className="h-12 w-12 shrink-0 -rotate-90">
              <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
              <motion.circle
                cx="26" cy="26" r="22" fill="none" strokeWidth="5" strokeLinecap="round"
                stroke={incident ? '#f87171' : '#34d399'}
                strokeDasharray={ring}
                animate={{ strokeDashoffset: ring * (1 - (uptime - 99)) }}
                transition={{ duration: reduce ? 0 : 0.6, ease: ease.entrance }}
              />
            </svg>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-wider text-white/50">Uptime</p>
              <p className="font-outfit text-base font-extrabold tabular-nums">{uptime.toFixed(2)}%</p>
            </div>
          </div>
          <div className={`rounded-2xl border p-3 transition-colors ${incident ? 'border-red-400/40 bg-red-500/10' : 'border-white/10 bg-white/5'}`}>
            <p className="text-[10px] font-black uppercase tracking-wider text-white/50">Errors (5 min)</p>
            <p className={`mt-1 flex items-center gap-1.5 font-outfit text-2xl font-extrabold tabular-nums ${errors ? 'text-red-300' : 'text-white'}`}>
              {incident && <TriangleAlert className="h-4 w-4" />}
              {errors}
            </p>
          </div>
        </div>

        <div className={`mt-2 rounded-2xl border p-3 transition-colors ${incident ? 'border-red-400/40 bg-red-500/10' : 'border-white/10 bg-white/5'}`}>
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-white/50"><Activity className="h-3.5 w-3.5" /> Response time</p>
            <p className={`font-mono text-xs font-bold tabular-nums ${incident ? 'text-red-300' : 'text-[#ffd98a]'}`}>{latest} ms</p>
          </div>
          <svg viewBox="0 0 100 42" preserveAspectRatio="none" className="mt-2 h-20 w-full overflow-visible">
            <line x1="0" x2="100" y1={40 - 0.3 * 36} y2={40 - 0.3 * 36} stroke="rgba(255,255,255,0.15)" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
            <polyline points={`0,42 ${path} 100,42`} fill={incident ? 'rgba(248,113,113,0.15)' : 'rgba(255,174,19,0.12)'} stroke="none" />
            <polyline points={path} fill="none" stroke={incident ? '#f87171' : '#ffae13'} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </svg>
          <p className="mt-1 text-[10px] font-semibold text-white/40">Alert threshold 300 ms</p>
        </div>

        <ul className="mt-2 grid gap-2">
          <li className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-emerald-400 text-[#061633]"><DatabaseBackup className="h-4 w-4" /></span>
            <div className="min-w-0">
              <p className="text-sm font-bold">Backup completed 02:00</p>
              <p className="text-[11px] font-semibold text-white/50">Database + uploads · kept 30 days</p>
            </div>
          </li>
          <li className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition-colors ${rollback === 'run' ? 'border-amber-400/40 bg-amber-400/10' : 'border-white/10 bg-white/5'}`}>
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${rollback === 'run' ? 'bg-amber-400 text-[#061633]' : 'bg-white/10 text-white/70'}`}><RotateCcw className="h-4 w-4" /></span>
            <div className="min-w-0">
              <p className="text-sm font-bold">Rollback {rollback === 'run' ? 'in progress' : 'ready'}</p>
              <p className="text-[11px] font-semibold text-white/50">Previous release kept warm</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

const TONES = {
  plain: 'text-white/80',
  muted: 'text-white/45',
  ok: 'text-emerald-300',
  warn: 'text-amber-300',
  error: 'text-red-400',
  accent: 'text-[#ffd98a]',
}

function Stage({ stage, state, rolledBack, accent, reduce }) {
  const Icon = stage.icon
  const fail = state === 'fail'
  const ok = state === 'ok'
  const run = state === 'run'
  return (
    <li className="flex min-w-0 flex-col items-center text-center">
      <motion.span
        animate={{ scale: run ? 1.08 : 1 }}
        transition={spring.interactive}
        className={`relative z-20 grid h-9 w-9 place-items-center rounded-xl border-2 sm:h-10 sm:w-10 ${
          fail ? 'border-red-500 bg-red-500 text-white'
            : rolledBack ? 'border-amber-400 bg-amber-400 text-[#061633]'
              : ok ? 'border-emerald-500 bg-emerald-500 text-white'
                : run ? 'bg-white' : 'border-slate-200 bg-white text-slate-400'
        }`}
        style={run ? { borderColor: accent, color: accent } : undefined}
      >
        {fail ? <X className="h-4 w-4" />
          : rolledBack ? <RotateCcw className="h-4 w-4" />
            : ok ? <Check className="h-4 w-4" />
              : run ? <LoaderCircle className={`h-4 w-4 ${reduce ? '' : 'animate-spin'}`} />
                : <Icon className="h-4 w-4" />}
      </motion.span>
      <p className="mt-2 text-[10px] font-extrabold leading-tight text-[#08224B] sm:text-[11px]">{stage.label}</p>
      <p className={`mt-0.5 font-mono text-[10px] font-semibold ${fail ? 'text-red-600' : rolledBack ? 'text-amber-600' : ok ? 'text-emerald-600' : 'text-slate-400'}`}>
        {fail ? 'failed' : rolledBack ? 'reverted' : ok ? stage.time : run ? 'running' : '–'}
      </p>
    </li>
  )
}
