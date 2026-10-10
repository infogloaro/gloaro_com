import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, BarChart3, Bell, CheckCircle2, IndianRupee, Package, ReceiptText, TrendingUp } from 'lucide-react'
import { ease, spring, variants, viewportOnce } from '../../../lib/motion'
import NeuralBackground from '../../motion/NeuralBackground'

const surface = { stiffness: spring.surface.stiffness, damping: spring.surface.damping }

function BrowserDashboard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/15 bg-white shadow-[0_30px_70px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2">
        {['#ff6b6b', '#ffd36e', '#4ade80'].map((c) => <span key={c} className="h-2 w-2 rounded-full" style={{ background: c }} />)}
        <span className="ml-2 rounded-full bg-white px-2 py-0.5 font-mono text-[9px] text-slate-500">admin.yourbrand.in/analytics</span>
      </div>
      <div className="grid grid-cols-3 gap-2 p-3">
        {[['Sales today', '₹1.24L', TrendingUp], ['Orders', '312', Package], ['Repeat buyers', '41%', BarChart3]].map(([label, value, Icon]) => (
          <div key={label} className="rounded-xl bg-slate-50 p-2.5">
            <p className="flex items-center gap-1 text-[9px] font-semibold text-slate-400"><Icon className="h-3 w-3" />{label}</p>
            <p className="text-sm font-extrabold text-[#08224B]">{value}</p>
          </div>
        ))}
        <svg viewBox="0 0 300 80" className="col-span-3 h-20 w-full" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="showcase-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#CB9015" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#CB9015" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 64 C40 58 60 40 100 44 S170 22 210 26 S270 10 300 8 L300 80 L0 80Z" fill="url(#showcase-area)" />
          <path d="M0 64 C40 58 60 40 100 44 S170 22 210 26 S270 10 300 8" fill="none" stroke="#CB9015" strokeWidth="2.5" />
        </svg>
      </div>
    </div>
  )
}

function InvoiceCard() {
  return (
    <div className="rounded-2xl border border-white/15 bg-white p-4 shadow-[0_24px_50px_rgba(0,0,0,0.3)]">
      <p className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#08224B]/60"><ReceiptText className="h-3.5 w-3.5" />GST invoice #1190</p>
      {[['Steel rods × 40', '₹48,000'], ['Cement × 120', '₹42,600']].map(([item, price]) => (
        <p key={item} className="mt-2 flex justify-between text-xs font-semibold text-[#08224B]"><span>{item}</span><span>{price}</span></p>
      ))}
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
        <span className="flex items-center gap-1 text-xs font-extrabold text-[#08224B]"><IndianRupee className="h-3.5 w-3.5" />1,06,908</span>
        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700"><CheckCircle2 className="h-3 w-3" />Paid via UPI</span>
      </div>
    </div>
  )
}

function PhoneApp() {
  return (
    <div className="rounded-[26px] border-[5px] border-[#0F172A] bg-white p-3 shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
      <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300" />
      <p className="text-[10px] font-semibold text-slate-400">Good morning, Priya</p>
      <p className="text-sm font-extrabold text-[#08224B]">3 deliveries today</p>
      {['Out for delivery', 'Packed', 'Confirmed'].map((status, i) => (
        <div key={status} className="mt-2 flex items-center gap-2 rounded-xl bg-slate-50 p-2">
          <span className={`h-6 w-6 rounded-lg ${i === 0 ? 'bg-[#CB9015]' : 'bg-[#08224B]/15'}`} />
          <span className="text-[10px] font-bold text-[#08224B]">{status}</span>
        </div>
      ))}
      <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-[#08224B] p-2 text-[10px] font-semibold text-white">
        <Bell className="h-3 w-3 text-[#CB9015]" /> Rider is 5 min away
      </div>
    </div>
  )
}

// Editorial section: copy on the left, layered product interfaces on the
// right that drift at three parallax speeds as the section scrolls by.
export default function ShowcaseSection() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const progress = useSpring(scrollYProgress, surface)
  const backY = useTransform(progress, [0, 1], [40, -40])
  const midY = useTransform(progress, [0, 1], [70, -70])
  const frontY = useTransform(progress, [0, 1], [110, -110])
  const layer = (y) => (reduce ? undefined : { y })

  const enter = (delay) => ({
    initial: { opacity: 0, y: 40, scale: 0.96 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: viewportOnce,
    transition: { duration: 0.8, ease: ease.entrance, delay },
  })

  return (
    <section ref={ref} id="showcase" className="relative isolate scroll-mt-28 overflow-hidden bg-[#061633] px-5 py-20 sm:py-28 lg:px-8">
      <NeuralBackground tone="night" priority={2} />
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={variants.container(0.1)}>
          <motion.p variants={variants.fadeUp} className="text-xs font-black uppercase tracking-[0.24em] text-[#e9b23e]">What we ship</motion.p>
          <motion.h2 variants={variants.fadeUp} className="mt-4 font-outfit text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl">
            Software your team <span className="text-[#e9b23e]">opens every morning</span>
          </motion.h2>
          <motion.p variants={variants.fadeUp} className="mt-5 max-w-md text-base font-medium leading-7 text-white/70">
            Dashboards for owners, apps for customers, billing for the counter — designed together so the whole business runs on one system.
          </motion.p>
          <motion.ul variants={variants.fadeUp} className="mt-7 space-y-3">
            {['Admin dashboards with live sales and stock', 'GST-ready billing, UPI and payment links', 'Customer and delivery apps on Android and iOS'].map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm font-semibold text-white/85">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#e9b23e]" />{point}
              </li>
            ))}
          </motion.ul>
          <motion.div variants={variants.fadeUp} className="mt-8">
            <Link to="/solutions" className="group inline-flex items-center gap-2 text-sm font-bold text-white">
              <span className="link-wipe">See live prototypes</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>

        <div aria-hidden="true" className="relative h-[420px] sm:h-[500px]">
          <motion.div style={layer(backY)} className="absolute left-0 top-0 w-[82%] sm:w-[72%]">
            <motion.div {...enter(0)}><BrowserDashboard /></motion.div>
          </motion.div>
          <motion.div style={layer(midY)} className="absolute bottom-[4%] left-[6%] w-[58%] sm:w-[44%]">
            <motion.div {...enter(0.15)}><InvoiceCard /></motion.div>
          </motion.div>
          <motion.div style={layer(frontY)} className="absolute right-0 top-[22%] w-[42%] sm:w-[30%]">
            <motion.div {...enter(0.3)}><PhoneApp /></motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
