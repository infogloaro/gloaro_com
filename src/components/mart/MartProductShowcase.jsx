import { motion } from 'framer-motion'
import { ShoppingBag, Store, TrendingUp } from 'lucide-react'
import { SectionHeading } from './primitives'
import { staggerChild, staggerParent } from './martData'

const pillars = [
  {
    no: '01',
    title: 'Shop',
    icon: ShoppingBag,
    text: 'Discover products across categories and sellers — from everyday essentials to the things you have been looking for.',
    points: ['Many categories', 'Many sellers', 'One cart'],
  },
  {
    no: '02',
    title: 'Sell',
    icon: Store,
    text: 'Give your business a digital storefront and reach customers beyond your street, your area and your city.',
    points: ['Digital storefront', 'Orders & inventory', 'Earnings wallet'],
  },
  {
    no: '03',
    title: 'Grow',
    icon: TrendingUp,
    text: 'Build repeat customers, manage your catalogue and scale digitally — with the tools growing businesses need.',
    points: ['Repeat customers', 'Coupons & offers', 'Business insights'],
  },
]

export default function MartProductShowcase() {
  return (
    <section id="overview" className="relative py-20 sm:py-28" aria-labelledby="mart-overview-title">
      <div className="pointer-events-none absolute left-1/2 top-24 -z-10 h-[360px] w-[760px] -translate-x-1/2 rounded-full bg-[#1b6fe0]/10 blur-[120px]" aria-hidden="true" />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading id="mart-overview-title" eyebrow="GLOARO MART" title="One Marketplace." accent="Multiple Ways to Grow.">
          GLOARO MART brings customers, vendors and businesses into one connected ecosystem — so buying, selling and growing all happen in the same place.
        </SectionHeading>

        <motion.ul
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {pillars.map((pillar) => {
            const Icon = pillar.icon
            return (
              <motion.li
                key={pillar.no}
                variants={staggerChild}
                className="group m-glass-gold relative overflow-hidden rounded-[28px] p-7 transition-transform duration-500 hover:-translate-y-2 sm:p-8"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#ffae13]/0 blur-3xl transition-colors duration-700 group-hover:bg-[#ffae13]/25" aria-hidden="true" />
                <div className="flex items-start justify-between">
                  <span className="m-display text-6xl text-transparent [-webkit-text-stroke:1.5px_rgba(11,70,158,0.25)]">{pillar.no}</span>
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[linear-gradient(145deg,#1f4590,#0b2451)] text-white shadow-[0_14px_28px_-12px_rgba(11,36,81,0.6)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="m-display mt-8 text-3xl uppercase tracking-[0.08em] text-[#0b2451]">{pillar.title}</h3>
                <p className="mt-3 leading-7 text-[#51627f]">{pillar.text}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {pillar.points.map((point) => (
                    <li key={point} className="rounded-full bg-[#0b469e]/[0.07] px-3 py-1 text-xs font-bold text-[#0b469e]">{point}</li>
                  ))}
                </ul>
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}
