import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { IndianRupee, MapPin, ScanSearch, Search, SlidersHorizontal, Sparkles, Tag } from 'lucide-react'
import { MIcon, SectionHeading, Stars } from './primitives'
import { EASE, formatINR, searchResults } from './martData'

const QUERY = 'Find wireless earbuds under ₹3,000 near me'

const understood = [
  [Tag, 'Wireless earbuds'],
  [IndianRupee, 'Under ₹3,000'],
  [MapPin, 'Near you'],
]

const points = [
  ['Ask naturally', 'Type the way you speak — product, budget and location in one line.'],
  ['See what matters', 'Price, ratings, distance and availability side by side.'],
  ['Decide faster', 'Compare sellers for the same product without opening ten tabs.'],
]

function useTypewriter(text, start, instant) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start || instant) return undefined
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          window.clearInterval(id)
          return c
        }
        return c + 1
      })
    }, 38)
    return () => window.clearInterval(id)
  }, [start, instant, text])
  const shown = instant ? text.length : count
  return [text.slice(0, shown), shown >= text.length]
}

export default function MartSmartSearch() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const reduce = useReducedMotion()
  const [typed, done] = useTypewriter(QUERY, inView, reduce)

  return (
    <section id="smart-search" className="relative overflow-hidden py-20 sm:py-28" aria-labelledby="mart-search-title">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent,#eaf2ff_40%,transparent)]" aria-hidden="true" />
      <div className="mx-auto grid grid-cols-1 max-w-[1280px] items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <div ref={ref} className="order-last lg:order-first">
          <div className="m-glass-gold relative rounded-[30px] p-4 sm:p-6">
            <div className="m-field flex items-center gap-3 rounded-full p-1.5 pl-4">
              <Search className="h-5 w-5 shrink-0 text-[#0b469e]" aria-hidden="true" />
              <p className="min-w-0 flex-1 truncate text-sm font-semibold text-[#0b2451] sm:text-base" aria-label={`Example search: ${QUERY}`}>
                {typed}
                {!done && <span className="m-caret ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-[#0b469e]" aria-hidden="true" />}
              </p>
              <span className="m-btn m-btn-navy hidden px-4 py-2 text-sm sm:inline-flex" aria-hidden="true">Search</span>
            </div>

            <AnimatePresence>
              {done && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
                  <div className="mt-4 flex flex-wrap items-center gap-2 px-1">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#51627f]"><Sparkles className="h-3.5 w-3.5 text-[#ffae13]" aria-hidden="true" />Understood:</span>
                    {understood.map(([Icon, label], i) => (
                      <motion.span
                        key={label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + i * 0.1, ease: EASE }}
                        className="inline-flex items-center gap-1 rounded-full bg-[#0b469e]/[0.08] px-2.5 py-1 text-xs font-bold text-[#0b469e]"
                      >
                        <Icon className="h-3 w-3" aria-hidden="true" />
                        {label}
                      </motion.span>
                    ))}
                    <span className="ml-auto hidden items-center gap-1 text-xs font-semibold text-[#51627f] sm:inline-flex"><SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />Sorted by distance</span>
                  </div>

                  <ul className="mt-4 grid gap-3">
                    {searchResults.map((r, i) => (
                      <motion.li
                        key={r.name}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + i * 0.12, duration: 0.5, ease: EASE }}
                        className="group flex items-center gap-3 rounded-2xl border border-white bg-white/85 p-3 transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgba(11,36,81,0.4)] sm:gap-4"
                      >
                        <span className={`grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br ${r.tone}`}>
                          <MIcon name={r.icon} className="h-7 w-7 text-[#0b469e] transition-transform duration-500 group-hover:scale-110" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-extrabold text-[#0b2451]">{r.name}</span>
                          <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[#51627f]">
                            <span>{r.seller}</span>
                            <span className="inline-flex items-center gap-0.5 font-semibold text-[#0b469e]"><MapPin className="h-3 w-3" aria-hidden="true" />{r.distance}</span>
                            <span className="inline-flex items-center gap-1"><Stars value={r.rating} /> ({r.reviews})</span>
                          </span>
                        </span>
                        <span className="text-right">
                          <span className="block font-urbanist text-lg font-extrabold text-[#0b2451]">{formatINR(r.price)}</span>
                          <span className={`block text-[11px] font-bold ${r.stock === 'In stock' ? 'text-emerald-600' : 'text-[#ff8a00]'}`}>{r.stock}</span>
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
            {!done && <div className="h-[330px]" aria-hidden="true" />}
          </div>
        </div>

        <div>
          <SectionHeading id="mart-search-title" align="left" eyebrow="Smart Search" eyebrowIcon={ScanSearch} title="Search Less." accent="Discover More.">
            Tell GLOARO MART what you are looking for in plain words. Smart Search reads the product, the budget and the place — and brings back what fits.
          </SectionHeading>
          <ol className="mt-10 grid gap-5">
            {points.map(([title, text], i) => (
              <li key={title} className="flex gap-4">
                <span className="m-display grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#0b2451] text-sm text-[#ffd36e]">{i + 1}</span>
                <span>
                  <span className="block font-extrabold text-[#0b2451]">{title}</span>
                  <span className="block text-sm leading-6 text-[#51627f]">{text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
