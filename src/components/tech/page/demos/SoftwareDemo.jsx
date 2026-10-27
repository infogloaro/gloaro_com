import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import {
  Check,
  ClipboardCheck,
  Crown,
  FileSpreadsheet,
  History,
  LayoutDashboard,
  Lock,
  Package,
  Receipt,
  ScrollText,
  TriangleAlert,
  User,
  UserCog,
  X,
} from 'lucide-react'
import { ease, spring } from '../../../../lib/motion'

// Sample stock sheet: the same rows appear messy in the spreadsheet and clean in the system.
const ITEMS = [
  { id: 'rice', name: 'Basmati rice 25kg', messy: 'basmati Rice 25 KG ', qty: '14 bags', rate: 'Rs.1850', amt: '25,900', stock: 14, min: 10, price: 1850, cost: 1520 },
  { id: 'oil', name: 'Sunflower oil 15L', messy: 'SUNFLOWER OIL(15ltr)', qty: '4', rate: '2,240/-', amt: '8960', stock: 4, min: 8, price: 2240, cost: 1980 },
  { id: 'sugar', name: 'Sugar 50kg', messy: 'sugar 50 kg', qty: '22', rate: '₹2150', amt: '#REF!', stock: 22, min: 12, price: 2150, cost: 1890 },
  { id: 'dal', name: 'Toor dal 30kg', messy: 'Tur Dal - 30kg', qty: '3 (check)', rate: '4320', amt: '12960', stock: 3, min: 6, price: 4320, cost: 3700 },
  { id: 'atta', name: 'Wheat atta 10kg', messy: 'atta 10KG', qty: 'thirty one', rate: '465.00', amt: '14,415', stock: 31, min: 15, price: 465, cost: 395 },
]

const APPROVALS = [
  { id: 'disc', title: 'Discount 8% · Sri Murugan Traders', amount: 12400 },
  { id: 'po', title: 'Purchase order · Sugar 40 bags', amount: 75600 },
  { id: 'refund', title: 'Refund · INV-1042', amount: 2150 },
]

const ROLES = {
  owner: { label: 'Owner', Icon: Crown, cost: true, margin: true, limit: Infinity },
  manager: { label: 'Manager', Icon: UserCog, cost: false, margin: true, limit: 50000 },
  staff: { label: 'Staff', Icon: User, cost: false, margin: false, limit: 0 },
}

const NAV = [
  [LayoutDashboard, 'Dashboard'],
  [Receipt, 'Invoices'],
  [Package, 'Stock'],
  [ClipboardCheck, 'Approvals'],
  [ScrollText, 'Audit trail'],
]

const SALES_TODAY = 48250
const START_MIN = 10 * 60 + 42 // 10:42 AM, sample clock for the audit trail
const inr = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`

function clock(step) {
  const total = START_MIN + step * 2
  const h = Math.floor(total / 60)
  const m = String(total % 60).padStart(2, '0')
  return `${h > 12 ? h - 12 : h}:${m} ${h >= 12 ? 'PM' : 'AM'}`
}

export default function SoftwareDemo({ accent }) {
  const ref = useRef(null)
  const seq = useRef(0)
  const touched = useRef(false) // user took over, so skip the autoplay flip
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [mode, setMode] = useState('sheet') // 'sheet' | 'system'
  const [imported, setImported] = useState(false)
  const [role, setRole] = useState('owner')
  const [ordered, setOrdered] = useState([]) // item ids with a purchase order raised
  const [requested, setRequested] = useState([]) // item ids staff asked to restock
  const [approvals, setApprovals] = useState(APPROVALS)
  const [log, setLog] = useState([])

  function addLog(who, text, tone = 'info') {
    seq.current += 1
    const id = seq.current
    setLog((l) => [{ id, time: clock(id), who, text, tone }, ...l].slice(0, 6))
  }

  function switchTo(next) {
    if (next === mode) return
    setMode(next)
    if (next === 'system' && !imported) {
      setImported(true)
      addLog('System', 'Imported 5 items · merged 1 duplicate · fixed 1 broken formula', 'good')
    }
  }

  // First run: show the mess briefly, then flip to the structured system.
  useEffect(() => {
    if (!inView) return undefined
    const id = window.setTimeout(() => {
      if (!touched.current) switchTo('system')
    }, reduce ? 0 : 1600)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  function changeRole(next) {
    if (next === role) return
    setRole(next)
    const r = ROLES[next]
    addLog(r.label, r.margin ? `Signed in · ${r.cost ? 'full access' : 'cost hidden'}` : 'Signed in · cost and margin hidden')
  }

  function restock(item) {
    if (role === 'staff') {
      setRequested((q) => [...q, item.id])
      setApprovals((a) => [...a, { id: `req-${item.id}`, itemId: item.id, title: `Restock · ${item.name}`, amount: item.cost * item.min }])
      addLog('Staff', `Requested restock of ${item.name}`)
    } else {
      setOrdered((o) => [...o, item.id])
      addLog(ROLES[role].label, `Raised purchase order for ${item.name}`, 'good')
    }
  }

  function approve(item) {
    setApprovals((a) => a.filter((x) => x.id !== item.id))
    if (item.itemId) setOrdered((o) => [...o, item.itemId])
    addLog(ROLES[role].label, `Approved ${item.title} (${inr(item.amount)})`, 'good')
  }

  const r = ROLES[role]
  const lowStock = ITEMS.filter((i) => i.stock < i.min && !ordered.includes(i.id)).length

  return (
    <MotionConfig reducedMotion="user">
      <div ref={ref} className="grid gap-4 lg:grid-cols-[1.9fr_1fr]">
        {/* The business data, before and after */}
        <div className="flex min-h-[500px] min-w-0 flex-col overflow-hidden rounded-[28px] border border-[#08224B]/10 bg-white shadow-[0_30px_70px_-35px_rgba(8,34,75,0.55)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white transition-colors duration-500" style={{ background: mode === 'sheet' ? '#16a34a' : accent }}>
                {mode === 'sheet' ? <FileSpreadsheet className="h-4.5 w-4.5" /> : <LayoutDashboard className="h-4.5 w-4.5" />}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-[#08224B]">{mode === 'sheet' ? 'billing_stock_FINAL_v3.xlsx' : 'Store operations'}</p>
                <p className={`text-[11px] font-semibold ${mode === 'sheet' ? 'text-rose-500' : 'text-emerald-600'}`}>{mode === 'sheet' ? '4 people editing · no history' : 'Synced · every change logged'}</p>
              </div>
            </div>

            <div role="tablist" aria-label="View" className="relative flex rounded-full bg-slate-100 p-1">
              {[['sheet', 'Spreadsheet'], ['system', 'Your system']].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={mode === key}
                  onClick={() => {
                    touched.current = true
                    switchTo(key)
                  }}
                  className={`relative min-h-9 rounded-full px-3.5 text-xs font-extrabold transition-colors ${mode === key ? 'text-white' : 'text-[#08224B]/70 hover:text-[#08224B]'}`}
                >
                  {mode === key && <motion.span layoutId="sw-toggle" transition={spring.interactive} className="absolute inset-0 rounded-full" style={{ background: key === 'sheet' ? '#16a34a' : accent }} />}
                  <span className="relative">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {mode === 'sheet' ? (
            <Spreadsheet />
          ) : (
            <div className="flex min-h-0 flex-1">
              <nav className="hidden w-36 shrink-0 flex-col gap-1 border-r border-slate-100 bg-slate-50/70 p-2.5 sm:flex">
                {NAV.map(([Icon, label], i) => (
                  <motion.span
                    key={label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.35, ease: ease.entrance }}
                    className={`flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-bold ${i === 0 ? 'bg-white text-[#08224B] shadow-sm' : 'text-slate-500'}`}
                  >
                    <Icon className="h-3.5 w-3.5" style={i === 0 ? { color: accent } : undefined} />
                    {label}
                    {label === 'Approvals' && approvals.length > 0 && <span className="ml-auto rounded-full bg-[#ffae13] px-1.5 text-[10px] font-black text-[#061633]">{approvals.length}</span>}
                  </motion.span>
                ))}
              </nav>

              <div className="min-w-0 flex-1 space-y-3 p-3 sm:p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Viewing as</p>
                  <div className="flex gap-1">
                    {Object.entries(ROLES).map(([key, { label, Icon }]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => changeRole(key)}
                        aria-pressed={role === key}
                        className={`flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-bold transition active:scale-95 ${role === key ? 'border-transparent text-white' : 'border-[#08224B]/15 bg-white text-[#08224B] hover:border-[#08224B]/40'}`}
                        style={role === key ? { background: '#08224B' } : undefined}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Kpi label="Sales today" value={SALES_TODAY} format={inr} reduce={reduce} />
                  <Kpi label="Low stock" value={lowStock} reduce={reduce} warn={lowStock > 0} />
                  <Kpi label="Approvals" value={approvals.length} reduce={reduce} warn={approvals.length > 0} />
                </div>

                <StockTable role={r} ordered={ordered} requested={requested} onRestock={restock} accent={accent} />

                <div className="rounded-2xl border border-slate-100 p-2.5">
                  <p className="px-1 pb-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Pending approvals</p>
                  <ul className="space-y-1.5">
                    <AnimatePresence initial={false}>
                      {approvals.map((item) => {
                        const allowed = item.amount <= r.limit
                        return (
                          <motion.li
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 40, transition: { duration: 0.25, ease: ease.exit } }}
                            transition={spring.interactive}
                            className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 px-2.5 py-1.5"
                          >
                            <span className="min-w-0 flex-1 truncate text-xs font-bold text-[#08224B]">{item.title}</span>
                            <span className="text-xs font-extrabold text-[#08224B]">{inr(item.amount)}</span>
                            {allowed ? (
                              <button type="button" onClick={() => approve(item)} className="flex min-h-9 items-center gap-1 rounded-full bg-emerald-500 px-3 text-[11px] font-extrabold text-white transition hover:bg-emerald-600 active:scale-95">
                                <Check className="h-3.5 w-3.5" /> Approve
                              </button>
                            ) : (
                              <span className="flex min-h-9 items-center gap-1 rounded-full bg-slate-200/70 px-3 text-[11px] font-bold text-slate-500">
                                <Lock className="h-3 w-3" /> {r.limit ? 'Owner only' : 'View only'}
                              </span>
                            )}
                          </motion.li>
                        )
                      })}
                    </AnimatePresence>
                    {approvals.length === 0 && (
                      <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 px-1 py-1.5 text-xs font-bold text-emerald-600">
                        <Check className="h-4 w-4" /> All caught up
                      </motion.li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Audit trail */}
        <div className="flex min-w-0 flex-col rounded-[28px] bg-[#061633] p-5 text-white shadow-[0_30px_70px_-35px_rgba(6,22,51,0.8)]">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ffd98a]">Audit trail</p>
            <History className="h-4 w-4 text-white/40" />
          </div>

          {mode === 'sheet' && log.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-400/10 p-4">
              <TriangleAlert className="h-5 w-5 text-rose-300" />
              <p className="mt-2 text-sm font-extrabold">No history in a spreadsheet</p>
              <p className="mt-1 text-xs font-semibold leading-5 text-white/65">Anyone can overwrite any cell. Nobody knows who changed the sugar rate, or when.</p>
            </motion.div>
          ) : (
            <ul className="mt-4 space-y-2">
              <AnimatePresence initial={false}>
                {log.map((entry) => (
                  <motion.li
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, y: -10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={spring.interactive}
                    className={`rounded-2xl border px-3 py-2.5 ${entry.tone === 'good' ? 'border-emerald-400/25 bg-emerald-400/10' : 'border-white/10 bg-white/5'}`}
                  >
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider">
                      <span className="font-mono text-[#ffae13]">{entry.time}</span>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-white/80">{entry.who}</span>
                    </div>
                    <p className="mt-1 text-xs font-semibold leading-5 text-white/85">{entry.text}</p>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}

          <div className="mt-auto pt-5">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/50">{mode === 'sheet' ? 'Access today' : `What ${r.label} can do`}</p>
            <ul className="mt-2.5 grid grid-cols-2 gap-1.5 text-[11px] font-bold">
              {[
                ['See cost price', mode === 'sheet' || r.cost],
                ['See margins', mode === 'sheet' || r.margin],
                ['Approve up to ₹50k', mode === 'sheet' || r.limit >= 50000],
                ['Approve any amount', mode === 'sheet' || r.limit === Infinity],
              ].map(([label, ok]) => (
                <li key={label} className={`flex items-center gap-1.5 rounded-xl px-2 py-1.5 ${ok ? 'bg-white/10 text-white' : 'bg-white/5 text-white/40'}`}>
                  {ok ? <Check className="h-3.5 w-3.5 shrink-0 text-emerald-300" /> : <X className="h-3.5 w-3.5 shrink-0" />}
                  {label}
                </li>
              ))}
            </ul>
            {mode === 'sheet' && <p className="mt-2 text-[11px] font-semibold text-rose-300">Everyone can see and edit everything.</p>}
          </div>
        </div>
      </div>
    </MotionConfig>
  )
}

function Spreadsheet() {
  const cols = 'grid-cols-[28px_minmax(150px,1.6fr)_90px_80px_80px]'
  return (
    <div className="relative flex-1 overflow-x-auto bg-[#f8faf8] p-3">
      <div className="relative min-w-[460px] pb-8 font-mono text-[11px] text-slate-700">
        <div className={`grid ${cols} border-l border-t border-slate-300 bg-slate-200/70 text-center text-[10px] font-bold text-slate-500`}>
          {['', 'A', 'B', 'C', 'D'].map((c) => <span key={c || 'corner'} className="border-b border-r border-slate-300 py-1">{c}</span>)}
        </div>
        <div className={`grid ${cols} border-l border-slate-300 bg-white font-bold`}>
          {['1', 'Item name', 'Qty', 'rate', 'Amount'].map((c, i) => <span key={c} className={`truncate border-b border-r border-slate-300 px-1.5 py-1.5 ${i === 0 ? 'bg-slate-100 text-center text-slate-400' : ''}`}>{c}</span>)}
        </div>
        {ITEMS.map((item, i) => (
          <SheetRow key={item.id} id={item.id} n={i + 2} cols={cols} cells={[item.messy, item.qty, item.rate, item.amt]} />
        ))}
        <SheetRow n={7} cols={cols} cells={['basmati rice 25kg', '14', '1850', '25900']} duplicate />
        <div className={`grid ${cols} border-l border-slate-300 bg-white font-bold`}>
          <span className="border-b border-r border-slate-300 bg-slate-100 py-1.5 text-center text-slate-400">8</span>
          <span className="border-b border-r border-slate-300 px-1.5 py-1.5">TOTAL</span>
          <span className="border-b border-r border-slate-300" />
          <span className="border-b border-r border-slate-300" />
          <span className="border-b border-r border-slate-300 bg-rose-50 px-1.5 py-1.5 text-rose-600">#REF!</span>
        </div>

        <StickyNote className="right-0 top-[150px] rotate-3">Who changed the sugar rate?? – R</StickyNote>
        <StickyNote className="left-[120px] top-[196px] -rotate-2">Dal stock wrong, recount on Monday</StickyNote>
      </div>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-bold text-slate-500">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-amber-200" /> Duplicate row</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-rose-200" /> Broken formula</span>
        <span>Units typed 4 different ways</span>
      </p>
    </div>
  )
}

function SheetRow({ id, n, cols, cells, duplicate }) {
  return (
    <motion.div
      layoutId={id ? `sw-row-${id}` : undefined}
      transition={spring.surface}
      className={`grid ${cols} border-l border-slate-300 ${duplicate ? 'bg-amber-100' : 'bg-white'}`}
    >
      <span className="border-b border-r border-slate-300 bg-slate-100 py-1.5 text-center text-slate-400">{n}</span>
      {cells.map((c, i) => (
        <span
          key={i}
          className={`truncate border-b border-r border-slate-300 px-1.5 py-1.5 ${c === '#REF!' ? 'bg-rose-50 font-bold text-rose-600' : ''}`}
        >
          {c}
        </span>
      ))}
    </motion.div>
  )
}

function StickyNote({ className, children }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, ...spring.interactive }}
      className={`absolute z-10 w-32 rounded-sm bg-[#fff3a6] px-2 py-1.5 font-sans text-[10.5px] font-bold leading-4 text-amber-900 shadow-[0_8px_18px_-8px_rgba(120,80,0,0.5)] ${className}`}
    >
      {children}
    </motion.span>
  )
}

function StockTable({ role, ordered, requested, onRestock, accent }) {
  const cols = [
    ['Item', 'minmax(118px,1.6fr)'],
    ['Stock', '44px'],
    ['Price', '68px'],
    ...(role.cost ? [['Cost', '68px']] : []),
    ...(role.margin ? [['Margin', '54px']] : []),
    ['Status', '86px'],
    ['', '76px'],
  ]
  const template = cols.map((c) => c[1]).join(' ')

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100">
      <div className="w-max min-w-full text-xs">
        <div className="grid gap-2 bg-slate-50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400" style={{ gridTemplateColumns: template }}>
          {cols.map(([label], i) => <span key={label || i} className={i > 0 && i < cols.length - 2 ? 'text-right' : ''}>{label}</span>)}
        </div>
        {ITEMS.map((item) => {
          const isOrdered = ordered.includes(item.id)
          const low = item.stock < item.min
          const isRequested = requested.includes(item.id) && !isOrdered
          const status = isOrdered ? ['Ordered', 'bg-sky-50 text-sky-700'] : isRequested ? ['Requested', 'bg-violet-50 text-violet-700'] : low ? ['Low stock', 'bg-amber-50 text-amber-700'] : ['In stock', 'bg-emerald-50 text-emerald-700']
          return (
            <motion.div
              key={item.id}
              layoutId={`sw-row-${item.id}`}
              transition={spring.surface}
              className="grid items-center gap-2 border-t border-slate-100 bg-white px-3 py-1.5 font-semibold text-[#08224B]"
              style={{ gridTemplateColumns: template }}
            >
              <span className="truncate font-bold">{item.name}</span>
              <span className="text-right tabular-nums">{item.stock}</span>
              <span className="text-right tabular-nums">{inr(item.price)}</span>
              <AnimatePresence initial={false}>
                {role.cost && <Cell key="cost">{inr(item.cost)}</Cell>}
                {role.margin && <Cell key="margin">{Math.round(((item.price - item.cost) / item.price) * 100)}%</Cell>}
              </AnimatePresence>
              <span className={`justify-self-start whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${status[1]}`}>{status[0]}</span>
              {low && !isOrdered && !isRequested ? (
                <button type="button" onClick={() => onRestock(item)} className="min-h-8 rounded-full px-2.5 text-[11px] font-extrabold text-white transition active:scale-95" style={{ background: accent }}>
                  {role.limit ? 'Reorder' : 'Request'}
                </button>
              ) : (
                <span className="text-center text-slate-300">—</span>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function Cell({ children }) {
  return (
    <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="text-right tabular-nums text-slate-500">
      {children}
    </motion.span>
  )
}

// Counts up from zero on mount, then animates between values.
function Kpi({ label, value, format = (n) => String(Math.round(n)), reduce, warn }) {
  const mv = useMotionValue(0)
  const text = useTransform(mv, (v) => format(v))
  useEffect(() => {
    const controls = animate(mv, value, { duration: reduce ? 0 : 0.9, ease: ease.entrance })
    return () => controls.stop()
  }, [mv, value, reduce])

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: ease.entrance }} className="min-w-0 rounded-2xl border border-slate-100 bg-slate-50/60 px-2.5 py-2 sm:px-3">
      <p className="truncate text-[9.5px] font-black uppercase tracking-[0.12em] text-slate-400 sm:text-[10px]">{label}</p>
      <p className={`mt-0.5 flex items-center font-outfit text-base font-extrabold tabular-nums sm:text-xl ${warn ? 'text-amber-600' : 'text-[#08224B]'}`}>
        <motion.span>{text}</motion.span>
      </p>
    </motion.div>
  )
}
