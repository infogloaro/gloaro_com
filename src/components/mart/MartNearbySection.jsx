import { motion } from 'framer-motion'
import { Building2, LocateFixed, MapPin, PackageCheck, Route, Store, Truck } from 'lucide-react'
import { MIcon, Reveal, SectionHeading, Stars } from './primitives'
import { EASE, vendors } from './martData'

const points = [
  [Store, 'Nearby Vendors', 'See which sellers are around you right now.'],
  [Building2, 'Local Businesses', 'Shop from neighbourhood stores you already trust.'],
  [MapPin, 'Products Near You', 'Find items that are available close by.'],
  [Truck, 'Fast Delivery', 'Shorter distances mean quicker hand-offs.'],
  [Route, 'Service Areas', 'Sellers define where they deliver, so you see what reaches you.'],
]

// Card positions on the map (desktop) — percentages of the map box.
const placements = [
  { left: '6%', top: '14%', pin: { x: 30, y: 32 } },
  { left: '58%', top: '8%', pin: { x: 66, y: 27 } },
  { left: '62%', top: '64%', pin: { x: 72, y: 70 } },
  { left: '4%', top: '66%', pin: { x: 32, y: 72 } },
]

function VendorCard({ vendor, className = '', style }) {
  return (
    <div className={`m-glass-gold flex w-[210px] shrink-0 items-center gap-3 rounded-2xl p-3 ${className}`} style={style}>
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${vendor.tone}`}>
        <MIcon name={vendor.icon} className={`h-5 w-5 ${vendor.ink}`} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-extrabold text-[#0b2451]">{vendor.name}</span>
        <span className="block text-[11px] font-medium text-[#51627f]">{vendor.type}</span>
        <span className="mt-1 flex items-center gap-2 text-[11px]">
          <span className="inline-flex items-center gap-0.5 font-bold text-[#0b469e]"><MapPin className="h-3 w-3" aria-hidden="true" />{vendor.distance} away</span>
          <Stars value={vendor.rating} />
        </span>
      </span>
    </div>
  )
}

function MapCanvas() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="nb-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#1b6fe0" stopOpacity="0.22" />
          <stop offset="1" stopColor="#1b6fe0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="#eaf2ff" />
      {/* park & water */}
      <path d="M70 80 Q80 74 92 82 L100 100 L66 100 Z" fill="#d7efdc" />
      <path d="M0 40 Q18 46 22 60 T10 100 L0 100 Z" fill="#d6e7fb" />
      {/* blocks */}
      {[[28, 10, 14, 10], [46, 14, 12, 8], [76, 12, 14, 12], [40, 64, 12, 10], [56, 78, 10, 10], [80, 48, 12, 10], [30, 80, 12, 8]].map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="1.5" fill="#ffffff" opacity="0.8" />
      ))}
      {/* streets */}
      <g stroke="#ffffff" strokeLinecap="round" fill="none">
        <path d="M0 26 Q40 20 100 34" strokeWidth="2.6" />
        <path d="M0 58 Q50 50 100 62" strokeWidth="2.2" />
        <path d="M24 0 Q30 50 26 100" strokeWidth="2.2" />
        <path d="M62 0 Q58 46 70 100" strokeWidth="2.6" />
        <path d="M84 0 Q78 40 92 100" strokeWidth="1.4" />
      </g>
      <circle cx="50" cy="50" r="40" fill="url(#nb-glow)" />
      {/* delivery routes */}
      {placements.map(({ pin }) => (
        <path key={`${pin.x}-${pin.y}`} d={`M50 50 Q${(50 + pin.x) / 2 + 6} ${(50 + pin.y) / 2 - 6} ${pin.x} ${pin.y}`} stroke="#0b469e" strokeWidth="0.5" strokeOpacity="0.55" fill="none" className="m-dash" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 1.5 }} />
      ))}
    </svg>
  )
}

export default function MartNearbySection() {
  return (
    <section id="nearby" className="relative overflow-hidden py-20 sm:py-28" aria-labelledby="mart-nearby-title">
      <div className="mx-auto grid grid-cols-1 max-w-[1280px] items-center gap-14 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <SectionHeading id="mart-nearby-title" align="left" eyebrow="Local + Digital" eyebrowIcon={LocateFixed} title="Your Marketplace." accent="Right Around You.">
            GLOARO MART puts the businesses in your neighbourhood on your screen — so the shop down the road is as easy to reach as any website.
          </SectionHeading>
          <ul className="mt-10 grid gap-3">
            {points.map(([Icon, title, text], i) => (
              <Reveal as="li" key={title} delay={i * 0.06} className="group flex items-start gap-4 rounded-2xl p-3 transition hover:bg-white/70">
                <span className="m-icon-well grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[#0b469e] transition group-hover:bg-[#0b2451] group-hover:text-[#ffd36e]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-extrabold text-[#0b2451]">{title}</span>
                  <span className="block text-sm leading-6 text-[#51627f]">{text}</span>
                </span>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal y={40} amount={0.2}>
          <div
            className="relative aspect-[4/3.4] w-full overflow-hidden rounded-[32px] border border-white shadow-[0_40px_90px_-40px_rgba(11,36,81,0.45)]"
            role="img"
            aria-label="Illustrative map showing nearby vendors such as Fresh Mart 2.4 km away, Fashion Hub 1.8 km away, Tech Store 3.1 km away and Home Essentials 0.9 km away"
          >
            <MapCanvas />

            {/* pins */}
            {placements.map(({ pin }, i) => (
              <span key={i} className="absolute -translate-x-1/2 -translate-y-full" style={{ left: `${pin.x}%`, top: `${pin.y}%` }} aria-hidden="true">
                <MapPin className="h-7 w-7 fill-[#ffae13] text-[#0b2451] drop-shadow-md" strokeWidth={1.6} />
              </span>
            ))}

            {/* you are here */}
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
              <span className="m-ping absolute inset-0 rounded-full bg-[#1b6fe0]/40" />
              <span className="m-ping absolute inset-0 rounded-full bg-[#1b6fe0]/30 [animation-delay:1.3s]" />
              <span className="relative grid h-14 w-14 place-items-center rounded-full border-4 border-white bg-[linear-gradient(145deg,#1b6fe0,#0b2451)] text-white shadow-[0_10px_30px_rgba(11,70,158,0.5)]">
                <LocateFixed className="h-6 w-6" />
              </span>
            </span>
            <span className="absolute left-1/2 top-[calc(50%+40px)] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#0b2451] px-3 py-1 text-[11px] font-bold text-white shadow-lg" aria-hidden="true">You are here</span>

            {/* vendor cards (tablet/desktop) */}
            {vendors.map((vendor, i) => (
              <motion.div
                key={vendor.name}
                className="absolute hidden sm:block"
                style={{ left: placements[i].left, top: placements[i].top }}
                initial={{ opacity: 0, scale: 0.9, y: 16 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.12, ease: EASE }}
              >
                <VendorCard vendor={vendor} className="m-float-sm" style={{ animationDelay: `${i * 0.8}s` }} />
              </motion.div>
            ))}

            <div className="m-glass-strong absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-[#0b2451] md:flex" aria-hidden="true">
              <PackageCheck className="h-4 w-4 text-emerald-600" /> 4 sellers deliver to your area
            </div>
          </div>

          {/* vendor cards (mobile): horizontal scroll */}
          <ul className="m-no-scrollbar -mx-4 mt-5 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:hidden" aria-label="Nearby vendors">
            {vendors.map((vendor) => (
              <li key={vendor.name} className="snap-start">
                <VendorCard vendor={vendor} />
              </li>
            ))}
          </ul>
          <p className="mt-3 text-center text-xs text-[#7a8aa6]">Illustrative example. Vendors, distances and ratings shown are sample data.</p>
        </Reveal>
      </div>
    </section>
  )
}
