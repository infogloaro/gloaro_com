import { motion } from 'framer-motion'
import { Building, CreditCard, Package, ShoppingBag, Store, Tag, Truck, Users } from 'lucide-react'
import { Emblem, SectionHeading } from './primitives'
import { EASE } from './martData'

const nodes = [
  [Users, 'Customers'],
  [Store, 'Vendors'],
  [Tag, 'Brands'],
  [Building, 'Local Businesses'],
  [ShoppingBag, 'Orders'],
  [Package, 'Products'],
  [Truck, 'Delivery'],
  [CreditCard, 'Payments'],
]

const RADIUS = 40 // % of the square stage

export default function MartEcosystem() {
  const placed = nodes.map((node, i) => {
    const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2
    return { node, x: 50 + RADIUS * Math.cos(angle), y: 50 + RADIUS * Math.sin(angle) }
  })

  return (
    <section id="ecosystem" className="relative overflow-hidden py-20 sm:py-28" aria-labelledby="mart-eco-title">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading id="mart-eco-title" eyebrow="The ecosystem" title="One Connected" accent="Marketplace Ecosystem.">
          Customers, sellers, products, payments and delivery — every part of GLOARO MART works together, so nothing falls between the cracks.
        </SectionHeading>

        <div className="relative mx-auto mt-14 aspect-square w-full max-w-[640px]">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <radialGradient id="eco-core" cx="50%" cy="50%" r="50%">
                <stop offset="0" stopColor="#ffd36e" stopOpacity="0.45" />
                <stop offset="1" stopColor="#ffd36e" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="30" fill="url(#eco-core)" />
            <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="#0b469e" strokeOpacity="0.12" strokeWidth="0.3" />
            <circle cx="50" cy="50" r={RADIUS - 14} fill="none" stroke="#ffae13" strokeOpacity="0.35" strokeWidth="0.25" strokeDasharray="1 1.6" className="m-spin-slow" />
            {placed.map(({ x, y }, i) => (
              <g key={i}>
                <line x1="50" y1="50" x2={x} y2={y} stroke="#0b469e" strokeOpacity="0.18" strokeWidth="0.35" />
                <line x1="50" y1="50" x2={x} y2={y} stroke={i % 2 ? '#ffae13' : '#1b6fe0'} strokeWidth="0.5" strokeDasharray="1.2 2.4" className="m-dash" style={{ animationDuration: `${2 + (i % 3) * 0.6}s` }} />
              </g>
            ))}
            {placed.map(({ x, y }, i) => {
              const n = placed[(i + 1) % placed.length]
              return <path key={`arc-${i}`} d={`M${x} ${y} Q50 50 ${n.x} ${n.y}`} fill="none" stroke="#0b469e" strokeOpacity="0.06" strokeWidth="0.3" />
            })}
          </svg>

          {/* core */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="m-glass-gold grid h-32 w-32 place-items-center rounded-full sm:h-44 sm:w-44">
              <div className="flex flex-col items-center">
                <Emblem className="h-10 w-10 sm:h-14 sm:w-14" />
                <p className="mt-1 font-urbanist text-sm font-extrabold tracking-[0.06em] text-[#0b2451] sm:text-lg">GLOARO</p>
                <p className="font-urbanist text-[9px] font-extrabold tracking-[0.4em] text-[#ffae13] sm:text-[11px]">MART</p>
              </div>
            </div>
          </motion.div>

          {/* nodes */}
          <ul aria-label="Parts of the GLOARO MART ecosystem">
            {placed.map(({ node: [Icon, label], x, y }, i) => (
              <motion.li
                key={label}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.07, ease: EASE }}
              >
                <div className="group m-glass-strong flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-center transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-18px_rgba(11,36,81,0.5)] sm:flex-row sm:gap-2 sm:rounded-full sm:py-2 sm:pl-2 sm:pr-4">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[linear-gradient(145deg,#1f4590,#0b2451)] text-[#ffd36e] transition-transform duration-300 group-hover:scale-110 sm:h-9 sm:w-9">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="max-w-[72px] text-[10px] font-extrabold leading-tight text-[#0b2451] sm:max-w-none sm:whitespace-nowrap sm:text-sm">{label}</span>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
