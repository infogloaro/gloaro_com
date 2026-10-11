import { useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  FileText,
  Globe2,
  LifeBuoy,
  MessageSquare,
  MousePointerClick,
  Phone,
  Video,
} from 'lucide-react'
import { mediaUrl } from '../../marketing/media'
import { JOURNEY_CHIPS, JOURNEY_DELIVERABLES } from './journeyChips'

// Showcase-style visuals for the four journey steps, in the same language as
// the Gloaro Mart hero: one main mockup, a layered card behind it, and glass
// chips that name what the client gets at that step, in plain words.
// Sample content is tagged "Example" so it is never read as a real result.

// Scenes are drawn on a fixed 640×440 canvas and scaled to fit the card, so the
// layout is identical at every width (the same approach as the Mart hero).
const CANVAS = { width: 640, height: 440 }

function Stage({ step, children }) {
  const ref = useRef(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return undefined
    const fit = () => setScale(element.clientWidth / CANVAS.width)
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={ref}
      className="relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_70%_30%,#ffffff_0%,#eef3fb_55%,#e4ecf9_100%)]"
      initial="hidden"
      animate="show"
    >
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: CANVAS.width, height: CANVAS.height, transform: `scale(${scale})` }}>
        <span aria-hidden="true" className="absolute left-1/2 top-1/2 h-[118%] w-[118%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#08224B]/[0.06]" />
        <span aria-hidden="true" className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#CB9015]/25" />
        {children}
        {/* On phones the chips would be too small to read inside the scaled picture;
            the section shows them as tags under the picture instead. */}
        {JOURNEY_CHIPS[step].map((chip) => <Chip key={chip.label} {...chip} />)}
      </div>
    </motion.div>
  )
}

function ExampleTag() {
  return (
    <span className="absolute left-4 top-4 z-40 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#8a5f00] shadow-sm ring-1 ring-[#CB9015]/25 backdrop-blur">
      Example
    </span>
  )
}

// Glass chip that floats in mid-air, like the marketplace hero chips.
function Chip({ Icon, color, label, className, delay = 0, float = '7s' }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16, scale: 0.85 },
        show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 150, damping: 18, delay: 0.25 + delay } },
      }}
      className={`absolute z-30 max-sm:hidden ${className}`}
    >
      <div
        className="mart-float flex items-center gap-2 rounded-full border border-white/70 bg-white/80 py-1.5 pl-1.5 pr-3 text-[0.72rem] font-bold text-[#071a3d] shadow-[0_18px_40px_-16px_rgba(7,26,61,0.45)] backdrop-blur-md"
        style={{ '--dur': float, '--dist': '-7px', '--delay': `${-delay * 10}s` }}
      >
        <span className="grid h-7 w-7 place-items-center rounded-full text-white" style={{ background: color }}>
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className="whitespace-nowrap">{label}</span>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
      </div>
    </motion.div>
  )
}

const pop = (delay = 0) => ({
  hidden: { opacity: 0, y: 24, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 20, delay } },
})

function PhoneFrame({ children, className = '' }) {
  return (
    <div className={`rounded-[26px] border-[5px] border-[#0b1730] bg-[#0b1730] shadow-[0_30px_60px_-20px_rgba(7,26,61,0.55)] ${className}`}>
      <div className="relative h-full overflow-hidden rounded-[20px] bg-white">
        <span className="absolute left-1/2 top-1.5 z-10 h-3 w-14 -translate-x-1/2 rounded-full bg-[#0b1730]" />
        {children}
      </div>
    </div>
  )
}

function BrowserFrame({ url, children, className = '' }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_30px_60px_-24px_rgba(7,26,61,0.45)] ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        {url && (
          <span className="ml-2 flex min-w-0 flex-1 items-center gap-1 truncate rounded-md bg-white px-2 py-0.5 font-mono text-[9px] text-slate-500 ring-1 ring-slate-200">
            <Globe2 className="h-2.5 w-2.5 shrink-0" /> {url}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

// 1 · Discover: a kick-off call that turns into a written plan and quote.
export function DiscoverVisual() {
  return (
    <Stage step="Discover">
      <ExampleTag />
      {/* Video call card (behind) */}
      <motion.div variants={pop(0.05)} className="absolute left-[8%] top-[16%] w-[44%] -rotate-3 overflow-hidden rounded-2xl bg-[#08224B] p-3 text-white shadow-2xl">
        <p className="flex items-center gap-1.5 text-[10px] font-bold text-white/70"><Video className="h-3.5 w-3.5 text-[#ffd36e]" /> Kick-off call</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {[['You', 'from-[#ffb347] to-[#CB9015]'], ['GLOARO', 'from-[#5aa2ff] to-[#1b6fe0]']].map(([who, tone]) => (
            <div key={who} className="grid aspect-[4/3] place-items-center rounded-xl bg-white/10">
              <span className={`grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br ${tone} text-xs font-black`}>{who === 'You' ? 'Y' : 'G'}</span>
              <span className="text-[9px] font-semibold text-white/80">{who}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-center gap-1.5">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-white/15"><Phone className="h-3 w-3" /></span>
          <span className="grid h-6 w-6 place-items-center rounded-full bg-white/15"><MessageSquare className="h-3 w-3" /></span>
        </div>
      </motion.div>

      {/* Project plan document (front) */}
      <motion.div variants={pop(0.18)} className="absolute right-[10%] top-[12%] w-[46%] rotate-2 rounded-2xl bg-white p-4 shadow-[0_30px_60px_-20px_rgba(7,26,61,0.45)] ring-1 ring-slate-100">
        <p className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#08224B]"><FileText className="h-4 w-4 text-[#CB9015]" /> Your project plan</p>
        {[
          ['Your goals', 'Online orders, fewer phone calls'],
          ['Features', 'Ordering · Invoices · Delivery updates'],
          ['Timeline', 'Agreed together'],
          ['Quote', 'Clear, written cost'],
        ].map(([label, value]) => (
          <div key={label} className="mt-2.5 flex gap-2">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
              <p className="text-[11px] font-semibold text-[#08224B]">{value}</p>
            </div>
          </div>
        ))}
      </motion.div>

    </Stage>
  )
}

// 2 · Design: clickable screens in your brand, before any code is written.
export function DesignVisual() {
  const shot = mediaUrl('restaurant/post.webp')
  return (
    <Stage step="Design">
      <ExampleTag />
      {/* Laptop-size design board (behind) */}
      <motion.div variants={pop(0.05)} className="absolute left-[7%] top-[15%] w-[56%]">
        <BrowserFrame url="design preview">
          <div className="grid grid-cols-[1fr_1.2fr] gap-2 p-3">
            <div className="space-y-1.5">
              <div className="h-2.5 w-3/4 rounded bg-[#08224B]" />
              <div className="h-2 w-full rounded bg-slate-200" />
              <div className="h-2 w-5/6 rounded bg-slate-200" />
              <div className="mt-2 h-5 w-20 rounded-full bg-[#CB9015]" />
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br from-[#1b6fe0] to-[#08224B]">
              {shot && <img src={shot} alt="" className="h-full w-full object-cover" />}
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-slate-100 px-3 py-2">
            {['#08224B', '#CB9015', '#1b6fe0', '#f6f9ff'].map((color) => (
              <span key={color} className="h-4 w-4 rounded-full ring-1 ring-slate-200" style={{ background: color }} />
            ))}
            <span className="ml-1 text-[9px] font-bold text-slate-500">Your brand colours</span>
          </div>
        </BrowserFrame>
      </motion.div>

      {/* Phone prototype (front) */}
      <motion.div variants={pop(0.18)} className="absolute right-[11%] top-[9%] h-[78%] w-[27%] rotate-3">
        <PhoneFrame className="h-full">
          <div className="h-[44%] bg-gradient-to-br from-[#CB9015] to-[#ffd36e]">
            {shot && <img src={shot} alt="" className="h-full w-full object-cover" />}
          </div>
          <div className="space-y-1.5 p-2.5">
            <div className="h-2.5 w-2/3 rounded bg-[#08224B]" />
            <div className="h-2 w-full rounded bg-slate-200" />
            <div className="h-2 w-4/5 rounded bg-slate-200" />
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              <div className="h-8 rounded-lg bg-[#eef3fb]" />
              <div className="h-8 rounded-lg bg-[#eef3fb]" />
            </div>
            <div className="mt-1 flex h-6 items-center justify-center rounded-full bg-[#08224B] text-[8px] font-bold text-white">Order now</div>
          </div>
          <span className="mart-float absolute bottom-[14%] right-[18%] grid h-7 w-7 place-items-center rounded-full bg-white shadow-lg ring-2 ring-[#CB9015]" style={{ '--dur': '3.5s', '--dist': '-5px' }}>
            <MousePointerClick className="h-3.5 w-3.5 text-[#CB9015]" />
          </span>
        </PhoneFrame>
      </motion.div>

    </Stage>
  )
}

// 3 · Develop: a preview link you can open, with progress you can see.
export function DevelopVisual() {
  const shot = mediaUrl('school/post.webp')
  const tasks = [['Login & accounts', 'done'], ['Online orders', 'done'], ['Invoices', 'done'], ['Payments', 'now'], ['Delivery updates', 'next']]
  return (
    <Stage step="Develop">
      <ExampleTag />
      {/* Preview link browser (front) */}
      <motion.div variants={pop(0.05)} className="absolute left-[8%] top-[14%] w-[58%]">
        <BrowserFrame url="preview.yourbrand.in">
          <div className="grid grid-cols-[64px_1fr] gap-2 p-3">
            <div className="space-y-1.5 rounded-lg bg-[#08224B] p-2">
              {[0, 1, 2, 3].map((i) => <div key={i} className={`h-1.5 rounded ${i === 1 ? 'bg-[#ffd36e]' : 'bg-white/25'}`} />)}
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-1.5">
                {['#1b6fe0', '#CB9015', '#17a589'].map((color) => (
                  <div key={color} className="rounded-lg bg-slate-50 p-1.5 ring-1 ring-slate-100">
                    <div className="h-1.5 w-1/2 rounded" style={{ background: color }} />
                    <div className="mt-1 h-3 w-3/4 rounded bg-slate-200" />
                  </div>
                ))}
              </div>
              <div className="aspect-[16/7] overflow-hidden rounded-lg bg-gradient-to-br from-[#1b6fe0] to-[#08224B]">
                {shot && <img src={shot} alt="" className="h-full w-full object-cover" />}
              </div>
            </div>
          </div>
        </BrowserFrame>
      </motion.div>

      {/* Progress card (side) */}
      <motion.div variants={pop(0.18)} className="absolute right-[7%] top-[20%] w-[34%] rounded-2xl bg-white p-3.5 shadow-[0_30px_60px_-20px_rgba(7,26,61,0.45)] ring-1 ring-slate-100">
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Build progress</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-[#CB9015] to-[#1b6fe0]" variants={{ hidden: { width: '0%' }, show: { width: '62%', transition: { duration: 1, delay: 0.4, ease: 'easeOut' } } }} />
        </div>
        <div className="mt-2.5 space-y-1.5">
          {tasks.map(([task, state]) => (
            <p key={task} className={`flex items-center gap-1.5 text-[10px] font-semibold ${state === 'next' ? 'text-slate-400' : 'text-[#08224B]'}`}>
              {state === 'done' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : state === 'now' ? <span className="h-3.5 w-3.5 animate-pulse rounded-full border-2 border-[#CB9015] motion-reduce:animate-none" /> : <span className="h-3.5 w-3.5 rounded-full border-2 border-slate-200" />}
              {task}
            </p>
          ))}
        </div>
      </motion.div>

    </Stage>
  )
}

// 4 · Deploy: live for your customers, and we stay to support it.
export function DeployVisual() {
  const shot = mediaUrl('restaurant/reel.webp') || mediaUrl('restaurant/post.webp')
  return (
    <Stage step="Deploy">
      <ExampleTag />
      {/* Live site (behind) */}
      <motion.div variants={pop(0.05)} className="absolute left-[7%] top-[16%] w-[52%]">
        <BrowserFrame url="www.yourbrand.in">
          <div className="relative aspect-[16/9] bg-gradient-to-br from-[#1b6fe0] to-[#08224B]">
            {shot && <img src={shot} alt="" className="h-full w-full object-cover" />}
            <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" /> Live
            </span>
          </div>
        </BrowserFrame>
      </motion.div>

      {/* Phone with the launch notification (front) */}
      <motion.div variants={pop(0.18)} className="absolute right-[12%] top-[10%] h-[76%] w-[26%] -rotate-2">
        <PhoneFrame className="h-full">
          <div className="h-full bg-gradient-to-b from-[#eef3fb] to-white p-2 pt-6">
            <motion.div
              variants={{ hidden: { opacity: 0, y: -14 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 160, damping: 16, delay: 0.7 } } }}
              className="rounded-xl bg-[#08224B] p-2 text-white shadow-lg"
            >
              <p className="flex items-center gap-1 text-[8px] font-bold text-white/70"><Bell className="h-2.5 w-2.5 text-[#ffd36e]" /> YOUR APP</p>
              <p className="mt-0.5 text-[10px] font-bold leading-tight">You are live! First orders are coming in.</p>
            </motion.div>
            <div className="mt-2 space-y-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-1.5 rounded-lg bg-white p-1.5 shadow-sm">
                  <span className="h-5 w-5 rounded-md bg-[#CB9015]/20" />
                  <span className="h-1.5 flex-1 rounded bg-slate-200" />
                </div>
              ))}
            </div>
          </div>
        </PhoneFrame>
      </motion.div>

      {/* Support message */}
      <motion.div variants={pop(0.3)} className="absolute bottom-[22%] left-[22%] z-20 max-w-[44%] rounded-2xl rounded-bl-sm bg-white p-2.5 text-[10px] font-semibold text-[#08224B] shadow-xl ring-1 ring-slate-100">
        <p className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wide text-[#17a589]"><LifeBuoy className="h-3 w-3" /> GLOARO support</p>
        Need a change after launch? Just message us.
      </motion.div>

    </Stage>
  )
}

const DEPTH_LAYERS = [7, 6, 5, 4, 3, 2, 1]

// "What you get" as three 3D tiles under the step text: an isometric block
// built from stacked layers (real depth via preserve-3d), an icon badge
// hovering above it and a soft ground shadow. Desktop only; phones show the
// step picture and tags instead.
export function DeliverableTiles({ step }) {
  return (
    <ul className="mt-10 hidden gap-8 lg:flex" aria-label="What you get at this step">
      {JOURNEY_DELIVERABLES[step].map(({ Icon, label, from, to }, index) => (
        <motion.li
          key={label}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: 'spring', stiffness: 140, damping: 18, delay: 0.1 + index * 0.12 }}
          whileHover={{ y: -6 }}
          className="flex w-32 flex-col items-center text-center"
        >
          <div className="mart-float relative h-32 w-32" style={{ '--dur': `${6 + index}s`, '--dist': '-6px', '--delay': `${-index * 1.3}s` }} aria-hidden="true">
            <span className="absolute bottom-2 left-1/2 h-5 w-24 -translate-x-1/2 rounded-[50%] bg-[#08224B]/20 blur-md" />
            <div
              className="absolute left-1/2 top-[58%] -ml-9 -mt-9 h-[72px] w-[72px]"
              style={{ transformStyle: 'preserve-3d', transform: 'rotateX(56deg) rotateZ(-45deg)' }}
            >
              {DEPTH_LAYERS.map((depth) => (
                <span
                  key={depth}
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: to, filter: `brightness(${0.62 + (7 - depth) * 0.03})`, transform: `translateZ(${-depth * 2.6}px)` }}
                />
              ))}
              <span className="absolute inset-0 overflow-hidden rounded-2xl ring-1 ring-white/50" style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
                <span className="absolute inset-2 rounded-xl border border-white/35" />
                <span className="absolute -left-4 top-0 h-full w-8 rotate-12 bg-white/25 blur-sm" />
              </span>
            </div>
            <span className="absolute left-1/2 top-[14%] -ml-6 grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-[0_16px_26px_-10px_rgba(8,34,75,0.55)] ring-1 ring-slate-100">
              <Icon className="h-6 w-6" style={{ color: to }} />
            </span>
          </div>
          <span className="mt-1 text-sm font-bold leading-tight text-[#08224B]">{label}</span>
        </motion.li>
      ))}
    </ul>
  )
}
