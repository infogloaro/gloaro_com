import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowRight, BadgeCheck, Download, MapPin, Search, ShieldCheck, Truck } from 'lucide-react'
import { BrowserFrame, Clouds, Eyebrow, MIcon, PhoneFrame, Wave } from './primitives'
import { MobileHomeScreen, WebHomeScreen } from './mockups'
import { categories, EASE, MARKETPLACE_URL } from './martData'

const chips = [
  { icon: MapPin, title: 'Nearby Vendors', text: '4 stores within 3 km', pos: 'left-[-2%] top-[6%] sm:left-[2%] sm:top-[4%]', delay: 0.9, float: '0s' },
  { icon: Search, title: 'Smart Search', text: 'Understands what you mean', pos: 'right-[-2%] top-[38%] sm:right-[6%] sm:top-[0%] lg:right-[-2%]', delay: 1.0, float: '1.2s' },
  { icon: ShieldCheck, title: 'Secure Checkout', text: 'Protected payments', pos: 'left-[-3%] bottom-[14%] sm:left-[-2%] sm:bottom-[30%]', delay: 1.1, float: '2.1s' },
  { icon: Truck, title: 'Fast Delivery', text: 'Local sellers, quick dispatch', pos: 'hidden sm:flex left-[24%] bottom-[2%]', delay: 1.2, float: '0.6s' },
  { icon: BadgeCheck, title: 'Trusted Sellers', text: 'Verified businesses', pos: 'hidden md:flex right-[-2%] bottom-[38%] 2xl:right-[-6%]', delay: 1.3, float: '1.6s' },
]

const tags = ['B2C Shopping', 'B2B Sourcing', 'Local Vendors', 'Web + Mobile']

function FloatingChip({ chip }) {
  const Icon = chip.icon
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: chip.delay, ease: EASE }}
      className={`absolute z-30 flex ${chip.pos}`}
    >
      <div className="m-glass-gold m-float-sm flex items-center gap-2.5 rounded-2xl py-2 pl-2 pr-3.5" style={{ animationDelay: chip.float }}>
        <span className="m-icon-well grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[#0b469e]">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="leading-tight">
          <span className="block text-[13px] font-extrabold text-[#0b2451]">{chip.title}</span>
          <span className="block text-[11px] font-medium text-[#51627f]">{chip.text}</span>
        </span>
      </div>
    </motion.div>
  )
}

export default function MartHero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yBrowser = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 70])
  const yPhone = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -50])
  const yGlow = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120])

  const intro = (delay) => ({
    initial: { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  })

  return (
    <section id="top" ref={ref} className="m-sky relative isolate overflow-hidden pt-28 sm:pt-32 lg:pt-36" aria-labelledby="mart-hero-title">
      <Clouds />
      <div className="m-grid-fade pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <motion.div style={{ y: yGlow }} className="pointer-events-none absolute right-[8%] top-[18%] -z-10 h-[420px] w-[420px] rounded-full bg-[#ffae13]/20 blur-[110px]" aria-hidden="true" />

      <div className="relative mx-auto grid grid-cols-1 max-w-[1360px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-8 lg:px-8">
        <div className="relative z-10 max-w-2xl">
          <motion.div {...intro(0.1)}>
            <Eyebrow><span className="hidden sm:inline">GLOARO MART ·&nbsp;</span>B2B + B2C Marketplace</Eyebrow>
          </motion.div>

          <motion.h1 id="mart-hero-title" {...intro(0.2)} className="m-display mt-6 text-[2.85rem] text-[#0b2451] sm:text-6xl lg:text-[4.4rem] xl:text-[5rem]">
            <span className="block [text-wrap:balance]">Everything You Need.</span>
            <span className="relative mt-1 block [text-wrap:balance]">
              <span className="m-text-gradient">Closer Than You Think.</span>
              <svg viewBox="0 0 400 20" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-[78%] sm:-bottom-3 sm:h-4" aria-hidden="true">
                <motion.path
                  d="M4 14 C 120 2, 260 2, 396 10"
                  fill="none"
                  stroke="#ffae13"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.1, delay: 0.8, ease: EASE }}
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p {...intro(0.35)} className="mt-8 max-w-xl text-lg leading-8 text-[#51627f] sm:text-xl sm:leading-9">
            GLOARO MART brings products, trusted sellers and local businesses together in one connected marketplace — for everyday shoppers and growing businesses alike.
          </motion.p>

          <motion.ul {...intro(0.45)} className="mt-6 flex flex-wrap gap-2" aria-label="What GLOARO MART covers">
            {tags.map((tag) => (
              <li key={tag} className="m-glass rounded-full px-3.5 py-1.5 text-xs font-bold text-[#0b2451]">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#ffae13] align-middle" aria-hidden="true" />
                {tag}
              </li>
            ))}
          </motion.ul>

          <motion.div {...intro(0.55)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to={MARKETPLACE_URL} className="m-btn m-btn-navy px-7 py-4 text-base">
              Explore GLOARO MART
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <a href="#app" className="m-btn m-btn-glass px-7 py-4 text-base">
              <Download className="h-5 w-5 text-[#0b469e]" aria-hidden="true" />
              Download the App
            </a>
          </motion.div>

          <motion.a {...intro(0.65)} href="#how-it-works" className="group mt-6 inline-flex items-center gap-2 rounded-full text-sm font-bold text-[#0b469e]">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-[#0b469e]/20 bg-white/70 transition group-hover:translate-y-0.5">
              <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            See How It Works
          </motion.a>
        </div>

        {/* Product visual */}
        <div className="relative mx-auto h-[540px] w-full max-w-[660px] sm:h-[600px] lg:h-[640px]">
          <motion.div
            style={{ y: yBrowser }}
            initial={{ opacity: 0, x: 40, rotate: -1 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: EASE }}
            className="absolute left-0 top-[9%] hidden w-[88%] sm:block"
          >
            <BrowserFrame label="GLOARO MART web app home screen showing search, categories, nearby vendors and products">
              <WebHomeScreen />
            </BrowserFrame>
          </motion.div>

          <motion.div
            style={{ y: yPhone }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
            className="absolute bottom-[2%] left-1/2 z-20 -translate-x-1/2 sm:left-auto sm:right-[2%] sm:translate-x-0"
          >
            <div className="m-float">
              <PhoneFrame className="h-[500px] w-[244px] sm:h-[520px] sm:w-[254px]" label="GLOARO MART mobile app home screen">
                <MobileHomeScreen />
              </PhoneFrame>
            </div>
          </motion.div>

          {chips.map((chip) => <FloatingChip key={chip.title} chip={chip} />)}
        </div>
      </div>

      {/* Wave into the category band */}
      <div className="relative mt-10 lg:mt-4">
        <Wave className="h-16 sm:h-24 lg:h-32" />
        <div className="m-marquee-wrap relative -mt-px overflow-hidden bg-[#0b2451] py-5" aria-label="Shop across categories">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#0b2451] to-transparent" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#0b2451] to-transparent" aria-hidden="true" />
          <ul className="m-marquee flex w-max gap-3">
            {[...categories, ...categories].map((c, i) => (
              <li key={`${c.label}-${i}`} aria-hidden={i >= categories.length ? 'true' : undefined} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85">
                <MIcon name={c.icon} className="h-4 w-4 text-[#ffd36e]" />
                {c.label}
              </li>
            ))}
          </ul>
        </div>
        <Wave flip className="-mt-px h-8 bg-[#f7faff] sm:h-12" />
      </div>
    </section>
  )
}
