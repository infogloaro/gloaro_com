import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Bot, CheckCircle2, GitBranch, Rocket, Server, TestTube2 } from 'lucide-react'
import { ease, transition } from '../../../lib/motion'
import { useAmbient } from '../../../hooks/useMotionEnv'

// Compact CSS interface mockups, one per service, shown in the showcase panel.
// Each fills its parent; looping ones respect the shared ambient budget.

const LOOP = { duration: 4.2, ease: ease.entrance, repeat: Infinity, repeatDelay: 0.6 }
const bar = 'rounded-full bg-[#08224B]/10'

function SoftwarePreview() {
  return (
    <div className="flex h-full gap-3 bg-[#f5f8fd] p-4">
      <div className="hidden w-24 shrink-0 space-y-2 rounded-xl bg-[#08224B] p-3 sm:block">
        <div className="h-2 w-12 rounded-full bg-[#CB9015]" />
        {[0, 1, 2, 3].map((i) => <div key={i} className={`h-2 rounded-full ${i === 1 ? 'w-16 bg-white/70' : 'w-14 bg-white/25'}`} />)}
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <div className="grid grid-cols-3 gap-2">
          {[['Orders', '1,284'], ['Pending', '37'], ['Revenue', '₹8.2L']].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-white p-2.5 shadow-sm">
              <p className="text-[10px] font-semibold text-slate-400">{label}</p>
              <p className="text-sm font-extrabold text-[#08224B]">{value}</p>
            </div>
          ))}
        </div>
        <div className="flex-1 space-y-1.5 rounded-xl bg-white p-3 shadow-sm">
          {['Dispatch #4821', 'Invoice #1190', 'Stock audit', 'Vendor payout'].map((row, i) => (
            <div key={row} className="flex items-center justify-between border-b border-slate-100 pb-1.5 text-[11px] last:border-0">
              <span className="font-semibold text-[#08224B]">{row}</span>
              <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${i % 2 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{i % 2 ? 'Review' : 'Done'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DesignPreview() {
  const ref = useRef(null)
  const active = useAmbient(ref, { priority: 1, amount: 0.5 })
  const blocks = [['col-span-6 h-3', 0], ['col-span-4 h-20', 0.12], ['col-span-2 h-20', 0.2], ['col-span-2 h-12', 0.3], ['col-span-2 h-12', 0.36], ['col-span-2 h-12', 0.42], ['col-span-3 h-3', 0.5], ['col-span-2 h-3', 0.55]]
  const grid = (render) => <div className="grid grid-cols-6 gap-2">{blocks.map(render)}</div>
  return (
    <div ref={ref} className="relative h-full bg-[#fbf8ef] p-4">
      <div className="relative">
        {/* Faint skeleton stays visible so the frame is never empty between loops. */}
        {grid(([size], i) => <div key={i} className={`${size} rounded-md border border-dashed border-[#08224B]/15`} />)}
        <div className="absolute inset-0">
          {grid(([size, at], i) => (
            <motion.div
              key={i}
              className={`${size} origin-left rounded-md ${i === 1 ? 'bg-[#08224B]/85' : i === 0 ? 'bg-[#CB9015]' : 'bg-[#08224B]/15'}`}
              animate={active ? { scaleX: [0, 1, 1, 0], opacity: [0, 1, 1, 0] } : { scaleX: 1, opacity: 1 }}
              transition={active ? { ...LOOP, times: [at * 0.5, at * 0.5 + 0.18, 0.88, 1] } : transition.micro}
            />
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        {['#08224B', '#CB9015', '#1b6fe0', '#fbf8ef'].map((color) => <span key={color} className="h-5 w-5 rounded-full border border-black/10" style={{ background: color }} />)}
        <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-[#08224B]/50">Design system</span>
      </div>
      <motion.svg
        viewBox="0 0 24 24"
        className="absolute left-0 top-0 h-5 w-5 drop-shadow"
        animate={active ? { x: [40, 200, 130, 40], y: [30, 70, 120, 30] } : { x: 160, y: 80 }}
        transition={active ? { duration: 4.8, ease: 'easeInOut', repeat: Infinity } : transition.micro}
      >
        <path d="M4 2l16 9-7 2-3 7z" fill="#08224B" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      </motion.svg>
    </div>
  )
}

function WebPreview() {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-1.5 border-b border-slate-100 px-3 py-2">
        {['#ff6b6b', '#ffd36e', '#4ade80'].map((c) => <span key={c} className="h-2 w-2 rounded-full" style={{ background: c }} />)}
        <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[9px] text-slate-500">yourbrand.in</span>
        <span className="ml-auto flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
          <span className="grid h-3.5 w-3.5 place-items-center rounded-full border-2 border-emerald-500 text-[6px]">98</span> Performance
        </span>
      </div>
      <div className="grid flex-1 grid-cols-5 items-center gap-3 p-4">
        <div className="col-span-3 space-y-2">
          <div className="h-3 w-full rounded-full bg-[#08224B]" />
          <div className="h-3 w-4/5 rounded-full bg-[#08224B]" />
          <div className={`h-2 w-full ${bar}`} />
          <div className={`h-2 w-2/3 ${bar}`} />
          <div className="mt-2 h-6 w-24 rounded-full bg-[#CB9015]" />
        </div>
        <div className="col-span-2 h-full min-h-20 rounded-xl bg-gradient-to-br from-[#1b6fe0] to-[#08224B]" />
      </div>
      <div className="grid grid-cols-3 gap-2 px-4 pb-4">
        {[0, 1, 2].map((i) => <div key={i} className="h-10 rounded-lg bg-slate-50 ring-1 ring-slate-100" />)}
      </div>
    </div>
  )
}

function Phone({ children, offset = '' }) {
  return (
    <div className={`h-[92%] w-[38%] max-w-[130px] rounded-[18px] border-4 border-[#08224B] bg-white p-2 shadow-xl ${offset}`}>
      <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-[#08224B]/30" />
      {children}
    </div>
  )
}

function MobilePreview() {
  return (
    <div className="flex h-full items-center justify-center gap-4 bg-[#eefaf7] p-3">
      <Phone offset="-rotate-3">
        <div className="h-16 rounded-lg bg-gradient-to-br from-[#17a589] to-[#0e7490]" />
        <div className="mt-2 space-y-1.5">{[0, 1, 2].map((i) => <div key={i} className={`h-2 ${bar}`} />)}</div>
        <div className="mt-3 h-5 rounded-full bg-[#CB9015]" />
      </Phone>
      <Phone offset="translate-y-3 rotate-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="mb-1.5 flex items-center gap-1.5 rounded-md bg-slate-50 p-1">
            <span className="h-4 w-4 rounded bg-[#17a589]/30" />
            <span className={`h-1.5 flex-1 ${bar}`} />
          </div>
        ))}
      </Phone>
    </div>
  )
}

function SaasPreview() {
  return (
    <div className="flex h-full flex-col gap-3 bg-[#f6f4ff] p-4">
      <div className="rounded-xl bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold text-slate-400">Monthly recurring revenue</p>
          <p className="text-[10px] font-bold text-emerald-600">+18.4%</p>
        </div>
        <svg viewBox="0 0 200 40" className="mt-1 h-10 w-full" preserveAspectRatio="none">
          <path d="M0 34 L25 30 L50 31 L75 22 L100 24 L125 15 L150 16 L175 8 L200 4" fill="none" stroke="#6c4de6" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2">
        {[['Starter', '₹999'], ['Growth', '₹2,499'], ['Scale', '₹6,999']].map(([plan, price], i) => (
          <div key={plan} className={`rounded-xl p-2.5 ${i === 1 ? 'bg-[#6c4de6] text-white' : 'bg-white text-[#08224B] shadow-sm'}`}>
            <p className="text-[10px] font-bold opacity-70">{plan}</p>
            <p className="text-xs font-extrabold">{price}</p>
            {[0, 1].map((j) => <div key={j} className={`mt-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-white/40' : 'bg-[#08224B]/10'}`} />)}
          </div>
        ))}
      </div>
    </div>
  )
}

const NODES = [[20, 50], [80, 20], [80, 80], [150, 50], [220, 22], [220, 78], [280, 50]]
const EDGES = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6]]

function AiPreview() {
  const ref = useRef(null)
  const active = useAmbient(ref, { priority: 1, amount: 0.5 })
  return (
    <div ref={ref} className="flex h-full flex-col justify-around gap-3 bg-[#08224B] p-4 sm:p-6">
      <svg viewBox="0 0 300 100" className="h-20 w-full sm:h-28" aria-hidden="true">
        {EDGES.map(([from, to], index) => (
          <motion.line
            key={index}
            x1={NODES[from][0]} y1={NODES[from][1]} x2={NODES[to][0]} y2={NODES[to][1]}
            stroke="#7fa8f0" strokeWidth="1.5"
            animate={active ? { pathLength: [0, 1, 1, 0.2], opacity: [0.2, 1, 1, 0.3] } : { pathLength: 1, opacity: 0.6 }}
            transition={active ? { ...LOOP, times: [index * 0.06, index * 0.06 + 0.2, 0.85, 1] } : transition.micro}
          />
        ))}
        {NODES.map(([cx, cy], index) => (
          <circle key={index} cx={cx} cy={cy} r={index === 3 ? 9 : 6} fill={index === 3 ? '#CB9015' : '#1b6fe0'} stroke="white" strokeWidth="1.5" />
        ))}
      </svg>
      <div className="space-y-3">
        <p className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-sm bg-white/10 px-3 py-1.5 text-[11px] text-white/85">Which leads should we call today?</p>
        <p className="flex w-fit max-w-[85%] items-start gap-1.5 rounded-2xl rounded-bl-sm bg-[#CB9015] px-3 py-1.5 text-[11px] font-semibold text-[#08224B]">
          <Bot className="mt-0.5 h-3.5 w-3.5 shrink-0" /> 6 hot leads — 3 asked for a quote this week.
        </p>
      </div>
    </div>
  )
}

function CrmPreview() {
  const columns = [['New', ['Sharma Traders', 'Kovai Foods']], ['Qualified', ['Bluewave Tech', 'Arun Interiors']], ['Won', ['Vinayaga RMC']]]
  return (
    <div className="grid h-full grid-cols-3 gap-2 bg-[#fff7ec] p-3">
      {columns.map(([name, cards], i) => (
        <div key={name} className="rounded-xl bg-white/70 p-2">
          <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-[#08224B]/60">{name}</p>
          {cards.map((card) => (
            <div key={card} className="mb-1.5 rounded-lg bg-white p-2 shadow-sm">
              <p className="truncate text-[10px] font-bold text-[#08224B]">{card}</p>
              <div className={`mt-1 h-1 w-2/3 rounded-full ${i === 2 ? 'bg-emerald-400' : 'bg-[#e07b00]/40'}`} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function CloudPreview() {
  const steps = [[GitBranch, 'Commit'], [TestTube2, 'Test'], [Rocket, 'Deploy']]
  return (
    <div className="flex h-full flex-col gap-3 bg-[#eef7fa] p-4">
      <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm">
        {steps.map(([Icon, label], i) => (
          <div key={label} className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0e7490] text-white"><Icon className="h-4 w-4" /></span>
            <span className="text-[11px] font-bold text-[#08224B]">{label}</span>
            {i < steps.length - 1 && <span className="mx-1 hidden h-px w-6 bg-[#0e7490]/30 sm:block" />}
          </div>
        ))}
      </div>
      <div className="flex-1 space-y-1.5 rounded-xl bg-white p-3 shadow-sm">
        {['api-server', 'web-app', 'worker-queue'].map((name) => (
          <div key={name} className="flex items-center gap-2 text-[11px]">
            <Server className="h-3.5 w-3.5 text-[#0e7490]" />
            <span className="font-mono text-[#08224B]">{name}</span>
            <span className="ml-auto flex items-center gap-1 font-bold text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" />Healthy</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const PREVIEWS = {
  software: SoftwarePreview,
  design: DesignPreview,
  web: WebPreview,
  mobile: MobilePreview,
  saas: SaasPreview,
  ai: AiPreview,
  crm: CrmPreview,
  cloud: CloudPreview,
}

export default function ServicePreview({ id }) {
  const Preview = PREVIEWS[id]
  return <Preview />
}
