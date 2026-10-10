import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { spring, transition } from '../../../lib/motion'
import { useMediaQuery } from '../../../hooks/useMotionEnv'
import { businesses, isThemeLive } from '../../../prototypes/catalog'
import SectionHeading from './SectionHeading'

const GROUPS = {
  Commerce: ['food', 'retail', 'pos'],
  Services: ['healthcare', 'education', 'services', 'hospitality'],
  Operations: ['logistics', 'crm', 'realestate'],
}
const FILTERS = ['All', ...Object.keys(GROUPS)]

const work = businesses.map((business) => {
  const theme = business.themes[0]
  return {
    ...business,
    theme,
    live: isThemeLive(business.id, theme.id),
    group: Object.keys(GROUPS).find((group) => GROUPS[group].includes(business.id)),
  }
})

function WorkCard({ item }) {
  const { id, name, tagline, accent, theme, live } = item
  return (
    <Link to={`/solutions/${id}`} className="group block h-full rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_14px_36px_rgba(15,23,42,0.08)] transition-shadow duration-300 hover:shadow-[0_24px_50px_rgba(13,70,151,0.16)]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]" style={{ background: `linear-gradient(135deg, ${accent}, #0b2451)` }}>
        {theme.thumb ? (
          <img
            src={theme.thumb}
            alt={`${name} prototype`}
            loading="lazy"
            decoding="async"
            width="640"
            height="480"
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
          />
        ) : (
          <div className="grid h-full place-items-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110">
            <span className="font-outfit text-6xl font-semibold text-white/25">{name.charAt(0)}</span>
          </div>
        )}
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${live ? 'bg-[#17a589] text-white' : 'bg-white/90 text-slate-600'}`}>
          {live ? 'Live demo' : 'Coming soon'}
        </span>
      </div>
      <div className="flex items-start justify-between gap-3 px-2 pb-1 pt-4">
        <div>
          <h3 className="font-extrabold text-[#0d4697]">{name}</h3>
          <p className="mt-0.5 text-sm font-medium text-slate-500">{tagline}</p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0d4697]/10 text-[#0d4697] transition-transform duration-300 group-hover:rotate-45 group-hover:bg-[#ffae13] group-hover:text-[#0b2451]">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

function Filters({ value, onChange }) {
  return (
    <div role="tablist" aria-label="Filter work by industry" className="flex flex-wrap justify-center gap-2">
      {FILTERS.map((filter) => {
        const selected = filter === value
        return (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(filter)}
            className={`relative rounded-full px-4 py-2 text-sm font-bold transition-colors ${selected ? 'text-[#0b2451]' : 'text-slate-500 hover:text-[#0d4697]'}`}
          >
            {selected && <motion.span layoutId="work-filter" transition={spring.interactive} className="absolute inset-0 -z-10 rounded-full bg-[#ffae13]" />}
            {filter}
          </button>
        )
      })}
    </div>
  )
}

// Desktop: the section pins and vertical scroll drives the track sideways.
// Touch/small screens and reduced motion get a native swipeable row instead.
export default function WorkSection() {
  const reduce = useReducedMotion()
  const wide = useMediaQuery('(min-width: 1024px)')
  const pinned = wide && !reduce
  const [filter, setFilter] = useState('All')
  const items = filter === 'All' ? work : work.filter((item) => item.group === filter)

  const sectionRef = useRef(null)
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const [distance, setDistance] = useState(0)

  useLayoutEffect(() => {
    if (!pinned) return undefined
    const measure = () => {
      const overflow = trackRef.current.scrollWidth - viewportRef.current.clientWidth
      setDistance(Math.max(0, overflow))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(trackRef.current)
    observer.observe(viewportRef.current)
    return () => observer.disconnect()
  }, [pinned, filter])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: spring.surface.stiffness, damping: spring.surface.damping, restDelta: 0.001 })
  const x = useTransform(smooth, [0, 1], [0, -distance])
  const isPinned = pinned && distance > 0

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      style={isPinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
      className="relative scroll-mt-28 border-y border-slate-200 bg-[linear-gradient(180deg,#fbfdff,#ffffff)]"
    >
      <div className={isPinned ? 'sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-20' : 'py-16 sm:py-24'}>
        <div className="px-5 lg:px-8">
          <SectionHeading eyebrow="Our work" title="Prototypes and platforms we've shipped" highlight="shipped" />
          <div className="mt-7">
            <LayoutGroup id="work-filters">
              <Filters value={filter} onChange={setFilter} />
            </LayoutGroup>
          </div>
        </div>

        <div ref={viewportRef} className={`mt-10 ${pinned ? 'overflow-visible' : 'overflow-x-auto overscroll-x-contain [scrollbar-width:none]'}`}>
          <motion.ul
            ref={trackRef}
            style={isPinned ? { x } : undefined}
            className={`flex w-max gap-6 px-5 pb-4 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))] ${pinned ? '' : 'snap-x snap-mandatory'}`}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {items.map((item) => (
                <motion.li
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: transition.exit }}
                  transition={spring.surface}
                  className="w-[78vw] max-w-[360px] shrink-0 snap-start sm:w-[340px]"
                >
                  <WorkCard item={item} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>
      </div>
    </section>
  )
}
