import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, CalendarDays, Check, Users } from 'lucide-react'
import { transition, variants } from '../../../lib/motion'
import { businesses, isThemeLive } from '../../../prototypes/catalog'
import { products } from '../homeData'
import GloaroMartHeroVisual from '../mart/GloaroMartHeroVisual'
import SectionHeading from './SectionHeading'

const URLS = { prototypes: 'gloaro.com/solutions', network: 'gloaro.com/network' }

function PrototypesScreen() {
  const live = businesses.filter((b) => isThemeLive(b.id, b.themes[0].id)).slice(0, 4)
  return (
    <div className="grid h-full grid-cols-2 gap-2.5 bg-[#f3fbf9] p-4">
      {live.map((business) => (
        <div key={business.id} className="flex flex-col overflow-hidden rounded-xl border border-teal-100 bg-white shadow-sm">
          <img src={business.themes[0].thumb} alt="" loading="lazy" decoding="async" width="320" height="200" className="h-full min-h-0 w-full flex-1 object-cover" />
          <p className="truncate px-2 py-1.5 text-[10px] font-bold text-[#0b2451]">{business.name}</p>
        </div>
      ))}
    </div>
  )
}

function NetworkScreen() {
  const members = [['AK', 'Arun K.', 'Interiors', '#1b6fe0'], ['PR', 'Priya R.', 'Chartered Accountant', '#17a589'], ['SM', 'Suresh M.', 'Logistics', '#e07b00']]
  return (
    <div className="flex h-full flex-col gap-3 bg-[#f4f8ff] p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Chapter</p>
          <p className="text-sm font-extrabold text-[#0b2451]">Chennai Central</p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-[#1b6fe0]/10 px-2.5 py-1 text-[10px] font-bold text-[#1b6fe0]"><Users className="h-3 w-3" />42 members</span>
      </div>
      <div className="flex-1 space-y-2">
        {members.map(([initials, name, trade, color]) => (
          <div key={name} className="flex items-center gap-2.5 rounded-xl bg-white p-2 shadow-sm">
            <span className="grid h-7 w-7 place-items-center rounded-full text-[10px] font-black text-white" style={{ background: color }}>{initials}</span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-[#0b2451]">{name}</p>
              <p className="text-[10px] text-slate-500">{trade}</p>
            </div>
            <Check className="h-3.5 w-3.5 text-[#17a589]" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 rounded-xl bg-[#0b2451] px-3 py-2 text-[11px] font-bold text-white">
        <CalendarDays className="h-3.5 w-3.5 text-[#ffae13]" /> Weekly Connect · Thu 7:30 AM
      </div>
    </div>
  )
}

// Gloaro Mart gets the full 3D scene (GloaroMartHeroVisual); the others sit in a browser frame.
const SCREENS = { prototypes: PrototypesScreen, network: NetworkScreen }
const framed = products.filter(({ id }) => SCREENS[id])

function BrowserFrame({ url, children }) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(13,70,151,0.18)]">
      <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffd36e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#4ade80]" />
        <div className="ml-3 flex-1 overflow-hidden rounded-full bg-white px-3 py-1 font-mono text-[11px] text-slate-500">{url}</div>
      </div>
      <div className="relative aspect-[16/11]">{children}</div>
    </div>
  )
}

// One screen inside the pinned frame. Its opacity/scale come from the
// section's scroll progress so screens crossfade as the copy scrolls past.
function PinnedScreen({ progress, index, count, children }) {
  const reduce = useReducedMotion()
  const slot = 1 / count
  const start = index * slot
  const end = start + slot
  const fade = slot * 0.12
  const input = [start - fade, start + fade * 0.5, end - fade * 0.5, end + fade]
  const opacity = useTransform(progress, input, [index === 0 ? 1 : 0, 1, 1, index === count - 1 ? 1 : 0])
  const scale = useTransform(progress, input, [index === 0 ? 1 : 0.94, 1, 1, index === count - 1 ? 1 : 1.04])
  return (
    <motion.div style={reduce ? { opacity } : { opacity, scale }} className="absolute inset-0">
      {children}
    </motion.div>
  )
}

export default function ProductsSection() {
  const copyRef = useRef(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: copyRef, offset: ['start center', 'end center'] })
  // The browser frame holds slots 1..n; it fades in as the Mart scene (slot 0) hands over.
  const slot = 1 / products.length
  const frameOpacity = useTransform(scrollYProgress, [slot - slot * 0.12, slot + slot * 0.06], [0, 1])

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = Math.min(products.length - 1, Math.max(0, Math.floor(value * products.length)))
    setActive((current) => (current === next ? current : next))
  })

  return (
    <section id="products" className="scroll-mt-28 bg-white px-5 py-16 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Our products" title="Digital products we've built and run" highlight="run" />

        <div className="mt-10 grid gap-10 lg:mt-4 lg:grid-cols-2 lg:gap-16">
          <div ref={copyRef}>
            {products.map(({ id, Icon, title, eyebrow, description, points, action, href, accent }, index) => {
              const Screen = SCREENS[id]
              return (
                <motion.article
                  key={id}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ amount: 0.5 }}
                  variants={variants.container(0.08)}
                  className="flex flex-col justify-center py-8 lg:min-h-[78vh]"
                >
                  <motion.div variants={variants.fadeUp} className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl text-[#0b2451]" style={{ background: accent }}>
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                      0{index + 1} · {eyebrow}
                    </span>
                  </motion.div>
                  <motion.h3 variants={variants.fadeUp} className="mt-5 font-outfit text-3xl font-semibold tracking-tight text-[#0d4697] sm:text-4xl">{title}</motion.h3>
                  <motion.p variants={variants.fadeUp} className="mt-3 max-w-lg text-base font-medium leading-7 text-slate-600">{description}</motion.p>
                  <motion.ul variants={variants.fadeUp} className="mt-5 space-y-2">
                    {points.map((point) => (
                      <li key={point} className="flex items-center gap-2 text-sm font-semibold text-[#0b2451]">
                        <Check className="h-4 w-4" style={{ color: accent }} />
                        {point}
                      </li>
                    ))}
                  </motion.ul>
                  <motion.div variants={variants.fadeUp} className="mt-6">
                    <Link to={href} className="group inline-flex items-center gap-2 text-sm font-bold text-[#0d4697]">
                      <span className="link-wipe">{action}</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </motion.div>
                  <motion.div variants={variants.fadeUp} className="mt-8 lg:hidden">
                    {Screen ? <BrowserFrame url={URLS[id]}><Screen /></BrowserFrame> : <GloaroMartHeroVisual compact />}
                  </motion.div>
                </motion.article>
              )
            })}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-[16vh] flex h-[72vh] flex-col justify-center">
              <div className="relative min-h-0 flex-1">
                <PinnedScreen progress={scrollYProgress} index={0} count={products.length}>
                  <div className="flex h-full items-center justify-center"><GloaroMartHeroVisual className="max-h-full" /></div>
                </PinnedScreen>
                <motion.div style={{ opacity: frameOpacity }} className="absolute inset-0 flex flex-col justify-center">
                  <BrowserFrame
                    url={
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span key={active} className="block" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={transition.micro}>
                          {URLS[products[active].id] ?? URLS[framed[0].id]}
                        </motion.span>
                      </AnimatePresence>
                    }
                  >
                    {framed.map(({ id }) => {
                      const Screen = SCREENS[id]
                      const index = products.findIndex((product) => product.id === id)
                      return (
                        <PinnedScreen key={id} progress={scrollYProgress} index={index} count={products.length}>
                          <Screen />
                        </PinnedScreen>
                      )
                    })}
                  </BrowserFrame>
                </motion.div>
              </div>
              <div className="mt-6 flex justify-center gap-2" aria-hidden="true">
                {products.map(({ id }, index) => (
                  <span key={id} className="relative h-1.5 w-10 overflow-hidden rounded-full bg-slate-200">
                    {index === active && <motion.span layoutId="product-dot" transition={transition.entrance} className="absolute inset-0 rounded-full bg-[#ffae13]" />}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

