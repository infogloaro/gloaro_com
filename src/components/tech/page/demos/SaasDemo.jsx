import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { Check, Database, Globe, LoaderCircle, Lock, Plus, TrendingUp, UserPlus, Users } from 'lucide-react'
import { ease, spring } from '../../../../lib/motion'

// Sample pricing for a made-up SaaS product.
const PLANS = [
  { id: 'starter', name: 'Starter', price: 1499, seats: 3 },
  { id: 'growth', name: 'Growth', price: 3999, seats: 15 },
  { id: 'scale', name: 'Scale', price: 9999, seats: 50 },
]

// [feature, lowest plan index that includes it]
const FEATURES = [
  ['Billing & GST invoices', 0],
  ['Customer portal', 0],
  ['Custom subdomain', 1],
  ['WhatsApp & email automations', 1],
  ['Usage analytics', 1],
  ['SSO & audit logs', 2],
  ['Dedicated database', 2],
]

const TENANTS = [
  { id: 'annapoorna', name: 'Annapoorna Sweets', color: '#f59e0b', users: 12, usage: 0.62, plan: 1, step: 3 },
  { id: 'kovai', name: 'Kovai Textiles', color: '#10b981', users: 34, usage: 0.81, plan: 2, step: 3 },
  { id: 'madurai', name: 'Madurai Mobiles', color: '#ec4899', users: 3, usage: 0.28, plan: 0, step: 3 },
]

const NEW_TENANTS = [
  { id: 'tirupur', name: 'Tirupur Knits', color: '#8b5cf6' },
  { id: 'chennai', name: 'Chennai Dental Care', color: '#ef4444' },
  { id: 'erode', name: 'Erode Agro Mart', color: '#0ea5e9' },
]

const STEPS = [
  [Database, 'Database'],
  [Globe, 'Subdomain'],
  [UserPlus, 'Admin user'],
]

const MRR_START = [42, 45, 44, 49, 53, 52, 58, 61, 64, 66, 71, 74] // ₹ thousands, sample
const FUNNEL_START = { trials: 24, activated: 15, paying: 9 }
const STEP_MS = 750

const inr = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`
const monthly = (plan, yearly) => (yearly ? Math.round((plan.price * 10) / 12) : plan.price)
const initials = (name) => name.split(' ').slice(0, 2).map((w) => w[0]).join('')

export default function SaasDemo({ accent }) {
  const ref = useRef(null)
  const touched = useRef(false) // user took over, so stop the autoplay
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [planIndex, setPlanIndex] = useState(0)
  const [yearly, setYearly] = useState(false)
  const [tenants, setTenants] = useState(TENANTS)
  const [mrr, setMrr] = useState(MRR_START)
  const [funnel, setFunnel] = useState(FUNNEL_START)

  const plan = PLANS[planIndex]
  const added = tenants.length - TENANTS.length
  const provisioning = tenants.find((t) => t.step < STEPS.length)
  const canAdd = !provisioning && added < NEW_TENANTS.length

  // First run: pick Growth, then add a tenant.
  useEffect(() => {
    if (!inView) return undefined
    const a = window.setTimeout(() => {
      if (!touched.current) setPlanIndex(1)
    }, reduce ? 0 : 700)
    const b = window.setTimeout(() => {
      if (!touched.current) addTenant(1)
    }, reduce ? 0 : 1700)
    return () => {
      window.clearTimeout(a)
      window.clearTimeout(b)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  // Walk the newest tenant through provisioning; when ready it counts in the metrics.
  useEffect(() => {
    if (!provisioning) return undefined
    const id = window.setTimeout(() => {
      const next = provisioning.step + 1
      setTenants((list) => list.map((t) => (t.id === provisioning.id ? { ...t, step: next, usage: next === STEPS.length ? 0.08 : 0 } : t)))
      if (next === STEPS.length) {
        const price = monthly(PLANS[provisioning.plan], false) / 1000
        setMrr((m) => [...m.slice(1), Math.round((m[m.length - 1] + price) * 10) / 10])
        setFunnel((f) => ({ trials: f.trials + 1, activated: f.activated + 1, paying: f.paying + 1 }))
      }
    }, reduce ? 0 : STEP_MS)
    return () => window.clearTimeout(id)
  }, [provisioning, reduce])

  function addTenant(forPlan = planIndex) {
    setTenants((list) => {
      const fresh = NEW_TENANTS[list.length - TENANTS.length]
      if (!fresh || list.some((t) => t.step < STEPS.length)) return list
      return [{ ...fresh, users: 1, usage: 0, plan: forPlan, step: 0 }, ...list]
    })
  }

  function reset() {
    touched.current = true
    setTenants(TENANTS)
    setMrr(MRR_START)
    setFunnel(FUNNEL_START)
  }

  return (
    <MotionConfig reducedMotion="user">
      <div ref={ref} className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        {/* Product: plans on the left, tenants on the right */}
        <div className="grid min-w-0 overflow-hidden rounded-[28px] border border-[#08224B]/10 bg-white shadow-[0_30px_70px_-35px_rgba(8,34,75,0.55)] md:grid-cols-2">
          <div className="min-w-0 border-b border-slate-100 p-4 sm:p-5 md:border-b-0 md:border-r">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Pricing</p>
              <button
                type="button"
                role="switch"
                aria-checked={yearly}
                onClick={() => {
                  touched.current = true
                  setYearly((y) => !y)
                }}
                className="flex min-h-9 items-center gap-2 rounded-full px-1 text-xs font-bold text-[#08224B]"
              >
                <span className={yearly ? 'text-slate-400' : ''}>Monthly</span>
                <span className="relative h-6 w-11 rounded-full transition-colors" style={{ background: yearly ? accent : '#cbd5e1' }}>
                  <motion.span layout transition={spring.interactive} className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow ${yearly ? 'right-1' : 'left-1'}`} />
                </span>
                <span className={yearly ? '' : 'text-slate-400'}>Yearly</span>
              </button>
            </div>

            <div role="radiogroup" aria-label="Plan" className="mt-3 grid grid-cols-3 gap-1.5 rounded-2xl bg-slate-100 p-1">
              {PLANS.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={planIndex === i}
                  onClick={() => {
                    touched.current = true
                    setPlanIndex(i)
                  }}
                  className={`relative min-h-10 rounded-xl text-xs font-extrabold transition-colors ${planIndex === i ? 'text-[#08224B]' : 'text-slate-500 hover:text-[#08224B]'}`}
                >
                  {planIndex === i && <motion.span layoutId="saas-plan" transition={spring.interactive} className="absolute inset-0 rounded-xl bg-white shadow-sm" />}
                  <span className="relative">{p.name}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-end gap-1.5">
              <AnimatedNumber value={monthly(plan, yearly)} format={inr} reduce={reduce} className="font-outfit text-4xl font-extrabold tabular-nums text-[#08224B]" />
              <span className="pb-1.5 text-xs font-bold text-slate-400">/ month</span>
            </div>
            <p className="mt-1 min-h-4 text-[11px] font-bold" style={{ color: yearly ? '#059669' : '#94a3b8' }}>
              {yearly ? `Billed ${inr(plan.price * 10)} yearly · 2 months free` : `${plan.seats} team seats included`}
            </p>

            <ul className="mt-4 space-y-1.5">
              {FEATURES.map(([label, tier]) => {
                const on = planIndex >= tier
                return (
                  <li key={label} className={`flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors duration-300 ${on ? 'bg-emerald-50/70 text-[#08224B]' : 'text-slate-400'}`}>
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg transition-colors duration-300 ${on ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={on ? 'on' : 'off'}
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 90 }}
                          transition={{ duration: 0.18, ease: ease.entrance }}
                        >
                          {on ? <Check className="h-3.5 w-3.5" /> : <Lock className="h-3 w-3" />}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    {label}
                    {!on && <span className="ml-auto text-[9px] font-black uppercase tracking-wider text-slate-300">{PLANS[tier].name}</span>}
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="flex min-w-0 flex-col p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Tenants · {tenants.length}</p>
              {added < NEW_TENANTS.length || provisioning ? (
                <button
                  type="button"
                  disabled={!canAdd}
                  onClick={() => {
                    touched.current = true
                    addTenant()
                  }}
                  className="flex min-h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-extrabold text-white transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ background: accent }}
                >
                  <Plus className="h-3.5 w-3.5" /> Add tenant
                </button>
              ) : (
                <button type="button" onClick={reset} className="min-h-9 rounded-full border border-[#08224B]/15 px-3.5 text-xs font-bold text-[#08224B] transition hover:border-[#08224B]/40 active:scale-95">
                  Reset sample
                </button>
              )}
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-400">New tenants start on the {plan.name} plan.</p>

            <ul className="mt-3 max-h-[392px] space-y-2 overflow-y-auto pr-0.5">
              <AnimatePresence initial={false}>
                {tenants.map((t) => <TenantCard key={t.id} tenant={t} accent={accent} />)}
              </AnimatePresence>
            </ul>
          </div>
        </div>

        {/* Business metrics */}
        <div className="flex min-w-0 flex-col rounded-[28px] bg-[#061633] p-5 text-white shadow-[0_30px_70px_-35px_rgba(6,22,51,0.8)]">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ffd98a]">Monthly recurring revenue</p>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white/60">Sample data</span>
          </div>
          <div className="mt-2 flex items-end gap-2">
            <AnimatedNumber value={mrr[mrr.length - 1] * 1000} format={inr} reduce={reduce} className="font-outfit text-3xl font-extrabold tabular-nums" />
            <span className="mb-1 flex items-center gap-1 text-xs font-bold text-emerald-300">
              <TrendingUp className="h-3.5 w-3.5" /> {Math.round(((mrr[mrr.length - 1] - mrr[0]) / mrr[0]) * 100)}% in 12 mo
            </span>
          </div>
          <Sparkline values={mrr} />

          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.22em] text-white/50">Activation funnel</p>
          <div className="mt-3 space-y-3">
            {[
              ['Started a trial', funnel.trials, 'rgba(255,255,255,0.35)'],
              ['Activated a workspace', funnel.activated, '#ffd98a'],
              ['Paying customer', funnel.paying, '#ffae13'],
            ].map(([label, n, color]) => (
              <div key={label}>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white/75">{label}</span>
                  <span className="tabular-nums">{n}</span>
                </div>
                <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} animate={{ width: `${(n / funnel.trials) * 100}%` }} transition={spring.surface} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-auto pt-5 text-[11px] font-semibold leading-5 text-white/55">
            Each tenant gets its own database and subdomain, so one customer never sees another&apos;s data.
          </p>
        </div>
      </div>
    </MotionConfig>
  )
}

function TenantCard({ tenant, accent }) {
  const ready = tenant.step >= STEPS.length
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={spring.interactive}
      className={`rounded-2xl border p-3 transition-colors duration-500 ${ready ? 'border-slate-100 bg-white' : 'border-[#ffae13]/60 bg-[#fff8ea]'}`}
    >
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-black text-white" style={{ background: tenant.color }}>
          {initials(tenant.name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-extrabold text-[#08224B]">{tenant.name}</p>
          <p className="truncate text-[11px] font-semibold text-slate-400">{tenant.id}.yourapp.in · {PLANS[tenant.plan].name}</p>
        </div>
        {ready ? (
          <span className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-slate-500">
            <Users className="h-3.5 w-3.5" /> {tenant.users}
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-[#ffae13] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#061633]">Provisioning</span>
        )}
      </div>

      {ready ? (
        <div className="mt-2.5 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
            <motion.div className="h-full rounded-full" style={{ background: tenant.color }} initial={{ width: 0 }} animate={{ width: `${tenant.usage * 100}%` }} transition={{ duration: 0.8, ease: ease.entrance }} />
          </div>
          <span className="w-16 text-right text-[10px] font-bold text-slate-400">{Math.round(tenant.usage * 100)}% usage</span>
        </div>
      ) : (
        <ol className="mt-2.5 grid grid-cols-3 gap-1.5">
          {STEPS.map(([Icon, label], i) => {
            const done = tenant.step > i
            const running = tenant.step === i
            return (
              <li key={label} className={`flex items-center gap-1 rounded-lg px-1.5 py-1 text-[10px] font-bold transition-colors ${done ? 'bg-emerald-50 text-emerald-700' : running ? 'bg-white text-[#08224B]' : 'text-slate-400'}`}>
                {done ? <Check className="h-3 w-3 shrink-0" /> : running ? <LoaderCircle className="h-3 w-3 shrink-0 animate-spin motion-reduce:animate-none" style={{ color: accent }} /> : <Icon className="h-3 w-3 shrink-0" />}
                <span className="truncate">{label}</span>
              </li>
            )
          })}
        </ol>
      )}
    </motion.li>
  )
}

function AnimatedNumber({ value, format, reduce, className }) {
  const mv = useMotionValue(value)
  const text = useTransform(mv, (v) => format(v))
  useEffect(() => {
    const controls = animate(mv, value, { duration: reduce ? 0 : 0.6, ease: ease.entrance })
    return () => controls.stop()
  }, [mv, value, reduce])
  return <motion.span className={className}>{text}</motion.span>
}

// Line + soft area; redraws whenever a new month is added.
function Sparkline({ values }) {
  const gid = useId()
  const W = 300
  const H = 90
  const min = Math.min(...values) - 4
  const max = Math.max(...values) + 2
  const pts = values.map((v, i) => [(i / (values.length - 1)) * W, H - ((v - min) / (max - min)) * H])
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const area = `${line} L${W} ${H} L0 ${H} Z`
  const [lx, ly] = pts[pts.length - 1]
  const key = values.join('-')

  return (
    <div className="mt-3">
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-24 w-full overflow-visible" aria-label="Sample MRR trend over 12 months" role="img">
          <defs>
            <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffae13" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ffae13" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path key={`a-${key}`} d={area} fill={`url(#${gid})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }} />
          <motion.path
            key={`l-${key}`}
            d={line}
            fill="none"
            stroke="#ffae13"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: ease.entrance }}
          />
        </svg>
        <motion.span
          key={`d-${key}`}
          className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffae13] ring-4 ring-[#ffae13]/25"
          style={{ left: `${(lx / W) * 100}%`, top: `${(ly / H) * 100}%` }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, ...spring.interactive }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] font-bold text-white/35">
        <span>12 months ago</span>
        <span>Now</span>
      </div>
    </div>
  )
}
