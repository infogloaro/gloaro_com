import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BellRing, Boxes, ClipboardList, Package, Store, Truck, Users, Wallet, BadgeIndianRupee, Building2 } from 'lucide-react'
import { BrowserFrame, Reveal, SectionHeading } from './primitives'
import { VendorDashboardScreen } from './mockups'
import { EASE, SELL_URL, staggerChild, staggerParent } from './martData'

const tools = [
  [Package, 'Product management'],
  [Boxes, 'Inventory & stock'],
  [ClipboardList, 'Order management'],
  [Building2, 'Business profile'],
  [Truck, 'Delivery settings'],
  [Wallet, 'Earnings & wallet'],
  [Users, 'Customer reach'],
  [Store, 'Digital storefront'],
]

const toasts = [
  { icon: BellRing, title: 'New order received', text: '#GM-20482 · 3 items', pos: 'left-[-6%] top-[-7%]', tone: 'text-[#0b469e]' },
  { icon: Boxes, title: 'Low stock alert', text: 'Organic Honey · 3 left', pos: 'right-[-3%] top-[46%]', tone: 'text-[#ff8a00]' },
  { icon: BadgeIndianRupee, title: 'Payout credited', text: 'Added to your wallet', pos: 'left-[8%] bottom-[-6%]', tone: 'text-emerald-600' },
]

export default function MartBusinessSection() {
  return (
    <section id="business" className="relative overflow-hidden py-20 sm:py-28" aria-labelledby="mart-business-title">
      <div className="pointer-events-none absolute right-[-10%] top-[10%] -z-10 h-[520px] w-[520px] rounded-full bg-[#1b6fe0]/12 blur-[130px]" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 left-[-10%] -z-10 h-[420px] w-[420px] rounded-full bg-[#ffae13]/14 blur-[120px]" aria-hidden="true" />
      <div className="mx-auto grid grid-cols-1 max-w-[1280px] items-center gap-16 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <SectionHeading id="mart-business-title" align="left" eyebrow="For sellers" eyebrowIcon={Store} title="Built for" accent="Businesses Too.">
            Turn your business into a digital storefront. List products, manage stock, fulfil orders and track earnings — from one simple seller dashboard.
          </SectionHeading>

          <motion.ul variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="mt-10 grid grid-cols-2 gap-3">
            {tools.map(([Icon, label]) => (
              <motion.li key={label} variants={staggerChild} className="group m-glass flex items-center gap-3 rounded-2xl px-3.5 py-3 transition hover:-translate-y-0.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#0b2451] text-[#ffd36e] transition-transform duration-500 group-hover:rotate-[-8deg]">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-bold text-[#0b2451]">{label}</span>
              </motion.li>
            ))}
          </motion.ul>

          <Reveal delay={0.2} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to={SELL_URL} className="m-btn m-btn-gold px-7 py-4 text-base">
              Start Selling <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <p className="text-sm text-[#51627f]">Register your business and set up your storefront.</p>
          </Reveal>
        </div>

        <Reveal y={50} amount={0.2} className="relative">
          <div className="relative">
            <BrowserFrame url="mart.gloaro.com/vendor" label="GLOARO MART seller dashboard showing orders, revenue, sales chart, low stock items and recent orders" className="shadow-[0_60px_120px_-50px_rgba(11,36,81,0.55)]">
              <div className="lg:[zoom:1.15]"><VendorDashboardScreen /></div>
            </BrowserFrame>
            {toasts.map((toast, i) => {
              const Icon = toast.icon
              return (
                <motion.div
                  key={toast.title}
                  initial={{ opacity: 0, scale: 0.85, y: 14 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ delay: 0.4 + i * 0.15, duration: 0.6, ease: EASE }}
                  className={`absolute hidden lg:block ${toast.pos}`}
                  aria-hidden="true"
                >
                  <div className="m-glass-gold m-float-sm flex items-center gap-3 rounded-2xl py-2.5 pl-2.5 pr-4" style={{ animationDelay: `${i * 0.9}s` }}>
                    <span className={`m-icon-well grid h-9 w-9 place-items-center rounded-xl ${toast.tone}`}><Icon className="h-4 w-4" /></span>
                    <span>
                      <span className="block text-[13px] font-extrabold text-[#0b2451]">{toast.title}</span>
                      <span className="block text-[11px] text-[#51627f]">{toast.text}</span>
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
