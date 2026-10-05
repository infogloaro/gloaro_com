import { motion } from 'framer-motion'
import { Building2, Check, ShoppingBag } from 'lucide-react'
import { Emblem, SectionHeading } from './primitives'
import { EASE } from './martData'

const b2c = ['Everyday shopping across categories', 'Nearby stores and local favourites', 'Wishlist, reviews and order tracking']
const b2b = ['Source stock from multiple vendors', 'Bulk-friendly ordering on web', 'Grow with your own digital storefront']

export default function MartB2BSection() {
  return (
    <section id="b2b-b2c" className="relative py-20 sm:py-28" aria-labelledby="mart-b2b-title">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading id="mart-b2b-title" eyebrow="B2C + B2B" title="One Platform." accent="Two Ways to Win.">
          Whether you are buying for your home or for your business, GLOARO MART is built for you.
        </SectionHeading>

        <div className="relative mt-16 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-16">
          {/* connector */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 lg:block" aria-hidden="true">
            <div className="relative grid h-24 w-24 place-items-center rounded-full bg-white shadow-[0_20px_50px_-15px_rgba(11,36,81,0.45)] ring-8 ring-[#f7faff]">
              <div className="m-spin-slow absolute inset-[-14px] rounded-full border border-dashed border-[#ffae13]/60" />
              <Emblem className="h-14 w-14" />
            </div>
          </div>
          <svg className="pointer-events-none absolute left-[calc(50%-8rem)] top-1/2 z-10 hidden h-6 w-64 -translate-y-1/2 lg:block" viewBox="0 0 256 24" aria-hidden="true">
            <path d="M0 12 H256" stroke="#ffae13" strokeWidth="2" className="m-dash" fill="none" />
          </svg>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="group m-glass-gold relative overflow-hidden rounded-[32px] p-8 sm:p-10"
          >
            <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#ffae13]/20 blur-3xl transition-transform duration-700 group-hover:scale-125" aria-hidden="true" />
            <span className="relative inline-flex items-center gap-2 rounded-full bg-[#ffae13]/15 px-3 py-1 text-xs font-extrabold tracking-[0.2em] text-[#b45309]">B2C</span>
            <span className="relative mt-6 grid h-14 w-14 place-items-center rounded-2xl bg-[linear-gradient(180deg,#ffd36e,#ffae13)] text-[#0b2451] shadow-[0_14px_30px_-12px_rgba(255,140,0,0.6)]">
              <ShoppingBag className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="m-display relative mt-6 text-3xl text-[#0b2451] sm:text-4xl">Shop for What You Need</h3>
            <p className="relative mt-3 text-[#51627f]">For everyday customers who want choice, convenience and trusted local sellers.</p>
            <ul className="relative mt-6 space-y-3">
              {b2c.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-semibold text-[#0b2451]">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#ffae13]/20 text-[#b45309]"><Check className="h-3.5 w-3.5" aria-hidden="true" /></span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="group relative overflow-hidden rounded-[32px] bg-[linear-gradient(150deg,#0b2451,#0b3a86_60%,#0b469e)] p-8 text-white shadow-[0_40px_90px_-40px_rgba(11,36,81,0.7)] ring-1 ring-white/10 sm:p-10"
          >
            <div className="pointer-events-none absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-[#1b6fe0]/50 blur-3xl transition-transform duration-700 group-hover:scale-125" aria-hidden="true" />
            <div className="pointer-events-none absolute right-6 top-6 opacity-[0.07]" aria-hidden="true"><Emblem className="h-40 w-40" mono /></div>
            <span className="relative inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-extrabold tracking-[0.2em] text-[#ffd36e]">B2B</span>
            <span className="relative mt-6 grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-[#ffd36e] ring-1 ring-white/20">
              <Building2 className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="m-display relative mt-6 text-3xl text-white sm:text-4xl">Source &amp; Grow Your Business</h3>
            <p className="relative mt-3 text-white/70">For retailers, businesses and bulk buyers who need reliable suppliers and room to scale.</p>
            <ul className="relative mt-6 space-y-3">
              {b2b.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-semibold text-white/90">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#ffae13] text-[#0b2451]"><Check className="h-3.5 w-3.5" aria-hidden="true" /></span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
