import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { CalendarCheck, MonitorSmartphone, PlayCircle, Smartphone } from 'lucide-react'
import { spring } from '../../../lib/motion'
import { businesses, getThemeKey, isThemeLive } from '../../../prototypes/catalog'
import { appTemplates } from '../../../prototypes/appCatalog'
import SectionHeading from './SectionHeading'

const GROUPS = {
  Commerce: ['food', 'retail', 'pos'],
  Services: ['healthcare', 'education', 'services', 'hospitality'],
  Operations: ['logistics', 'crm', 'realestate'],
}
const FILTERS = ['All', ...Object.keys(GROUPS)]
const groupOf = (industry) => Object.keys(GROUPS).find((group) => GROUPS[group].includes(industry))
// Each rolling row repeats its cards until one copy is at least this long, so
// the loop never shows a gap even when a filter leaves only a few cards.
const MIN_PER_COPY = 8
const SECONDS_PER_CARD = 5

const webApps = businesses.map((business) => {
  const theme = business.themes[0]
  const live = isThemeLive(business.id, theme.id)
  return {
    id: business.id,
    name: business.name,
    tagline: business.tagline,
    accent: business.accent,
    thumb: theme.thumb,
    href: `/solutions/${business.id}`,
    book: `/contact?theme=${encodeURIComponent(getThemeKey(business.id, theme.id))}`,
    demo: live ? `/prototypes/${business.id}/${theme.id}` : null,
    group: groupOf(business.id),
  }
})

const apps = appTemplates.map((app) => ({
  ...app,
  href: null,
  book: `/contact?theme=${encodeURIComponent(app.key)}`,
  group: groupOf(app.industry),
}))

const ROWS = [
  { id: 'web-apps', label: 'Web App', title: 'Web app templates', Icon: MonitorSmartphone, items: webApps, direction: 'right' },
  { id: 'apps', label: 'App', title: 'Mobile app templates', Icon: Smartphone, items: apps, direction: 'left' },
]

function CardActions({ item, inert }) {
  const tab = inert ? -1 : undefined
  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      <Link
        to={item.book}
        tabIndex={tab}
        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[linear-gradient(135deg,#0b469e,#1b6fe0)] px-3 py-2.5 text-xs font-bold text-white shadow-[0_8px_18px_rgba(11,70,158,0.25)] transition hover:-translate-y-0.5"
      >
        <CalendarCheck className="h-3.5 w-3.5" /> Book now
      </Link>
      {item.demo ? (
        <Link
          to={item.demo}
          tabIndex={tab}
          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#0d4697]/20 bg-white px-3 py-2.5 text-xs font-bold text-[#0d4697] transition hover:-translate-y-0.5 hover:border-[#ffae13] hover:bg-[#ffae13]/10"
        >
          <PlayCircle className="h-3.5 w-3.5" /> Use demo
        </Link>
      ) : (
        <span
          aria-disabled="true"
          title="Demo coming soon"
          className="inline-flex cursor-not-allowed items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-400"
        >
          <PlayCircle className="h-3.5 w-3.5" /> Demo soon
        </span>
      )}
    </div>
  )
}

function StatusBadge({ live }) {
  return (
    <span className={`absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${live ? 'bg-[#17a589] text-white' : 'bg-white/90 text-slate-600'}`}>
      {live ? 'Live demo' : 'Coming soon'}
    </span>
  )
}

function WebCard({ item, inert }) {
  const { name, tagline, accent, thumb, href, demo } = item
  return (
    <article className="group h-full rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_14px_36px_rgba(15,23,42,0.08)] transition-shadow duration-300 hover:shadow-[0_24px_50px_rgba(13,70,151,0.16)]">
      <Link to={href} tabIndex={inert ? -1 : undefined} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]" style={{ background: `linear-gradient(135deg, ${accent}, #0b2451)` }}>
          {thumb ? (
            <img src={thumb} alt={`${name} web app template`} loading="lazy" decoding="async" width="640" height="480" draggable={false} className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110" />
          ) : (
            <div className="grid h-full place-items-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110">
              <span className="font-outfit text-6xl font-semibold text-white/25">{name.charAt(0)}</span>
            </div>
          )}
          <StatusBadge live={Boolean(demo)} />
        </div>
        <div className="px-2 pt-4">
          <h3 className="font-extrabold text-[#0d4697]">{name}</h3>
          <p className="mt-0.5 line-clamp-1 text-sm font-medium text-slate-500">{tagline}</p>
        </div>
      </Link>
      <div className="px-2 pb-1">
        <CardActions item={item} inert={inert} />
      </div>
    </article>
  )
}

// App thumbnail: a phone frame with the template's photo and a sketched app UI.
function PhoneThumb({ item }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]" style={{ background: `linear-gradient(135deg, ${item.accent}, #0b2451)` }}>
      <div aria-hidden="true" className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute bottom-[-18%] left-1/2 w-[44%] -translate-x-1/2 rounded-[22px] border-[5px] border-[#0b1220] bg-white shadow-[0_20px_40px_rgba(0,0,0,0.35)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-3">
        <div className="mx-auto mt-1 h-1.5 w-8 rounded-full bg-[#0b1220]" />
        <div className="p-1.5">
          <img src={item.thumb} alt={`${item.name} template`} loading="lazy" decoding="async" draggable={false} className="aspect-[4/3] w-full rounded-lg object-cover" />
          <div className="mt-1.5 h-1.5 w-3/4 rounded-full bg-slate-300" />
          <div className="mt-1 h-1.5 w-1/2 rounded-full bg-slate-200" />
          <div className="mt-2 grid grid-cols-3 gap-1">
            {[0, 1, 2].map((cell) => <div key={cell} className="h-5 rounded-md" style={{ background: `${item.accent}22` }} />)}
          </div>
          <div className="mt-2 h-4 rounded-full" style={{ background: item.accent }} />
        </div>
      </div>
      <StatusBadge live={Boolean(item.demo)} />
    </div>
  )
}

function AppCard({ item, inert }) {
  return (
    <article className="group h-full rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_14px_36px_rgba(15,23,42,0.08)] transition-shadow duration-300 hover:shadow-[0_24px_50px_rgba(13,70,151,0.16)]">
      <PhoneThumb item={item} />
      <div className="px-2 pb-1 pt-4">
        <h3 className="font-extrabold text-[#0d4697]">{item.name}</h3>
        <p className="mt-0.5 line-clamp-1 text-sm font-medium text-slate-500">{item.tagline}</p>
        <CardActions item={item} inert={inert} />
      </div>
    </article>
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

// "App | Web App" switch above the heading; each half jumps to its row.
function KindSwitch() {
  const jump = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  return (
    <div className="mb-6 flex justify-center">
      <div className="inline-flex items-center rounded-full border border-[#0d4697]/10 bg-white p-1 shadow-[0_10px_28px_-12px_rgba(13,70,151,0.35)]">
        {[ROWS[1], ROWS[0]].map(({ id, label, Icon }, index) => (
          <span key={id} className="flex items-center">
            {index > 0 && <span aria-hidden="true" className="mx-1 h-5 w-px bg-[#0d4697]/15" />}
            <button
              type="button"
              onClick={() => jump(id)}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black uppercase tracking-[0.14em] text-[#0d4697] transition hover:bg-[#ffae13]/15"
            >
              <Icon className="h-4 w-4 text-[#e07b00]" /> {label}
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}

function RollingRow({ row, items, reduce }) {
  const Card = row.id === 'apps' ? AppCard : WebCard

  // Reduced motion: one plain swipeable row, no animation.
  if (reduce) {
    return (
      <ul className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 [scrollbar-width:none] lg:px-8">
        {items.map((item) => (
          <li key={item.id} className="w-[78vw] max-w-[340px] shrink-0 snap-start sm:w-[320px]"><Card item={item} /></li>
        ))}
      </ul>
    )
  }

  const repeats = Math.max(1, Math.ceil(MIN_PER_COPY / Math.max(1, items.length)))
  const copy = Array.from({ length: repeats }, () => items).flat()
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
      <div
        className="work-roll flex w-max"
        data-direction={row.direction}
        style={{ animationDuration: `${copy.length * SECONDS_PER_CARD}s` }}
      >
        {/* Two identical copies; the second is decorative so the loop is seamless. */}
        {[0, 1].map((half) => (
          <ul key={half} aria-hidden={half === 1 || undefined} inert={half === 1 || undefined} aria-label={half === 0 ? row.title : undefined} className="flex shrink-0 gap-6 pr-6">
            {copy.map((item, index) => (
              <li key={`${item.id}-${index}`} className="w-[78vw] max-w-[320px] shrink-0 py-3 sm:w-[320px]">
                <Card item={item} inert={half === 1 || index >= items.length} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

// Two template rows rolling in opposite directions: web apps left to right,
// mobile apps right to left. Hover or keyboard focus pauses a row.
export default function WorkSection() {
  const reduce = useReducedMotion()
  const [filter, setFilter] = useState('All')
  const pick = (items) => (filter === 'All' ? items : items.filter((item) => item.group === filter))

  return (
    <section id="portfolio" className="relative scroll-mt-28 overflow-x-clip border-y border-slate-200 bg-[linear-gradient(180deg,#fbfdff,#ffffff)] py-16 sm:py-24">
      <div className="px-5 lg:px-8">
        <KindSwitch />
        <SectionHeading eyebrow="Our work" title="Prototypes and platforms we've shipped" highlight="shipped" />
        <div className="mt-7">
          <LayoutGroup id="work-filters">
            <Filters value={filter} onChange={setFilter} />
          </LayoutGroup>
        </div>
      </div>

      {ROWS.map((row) => {
        const items = pick(row.items)
        const { Icon } = row
        return (
          <div key={row.id} id={row.id} className="mt-10 scroll-mt-32">
            <div className="mx-auto mb-3 flex max-w-7xl items-center gap-3 px-5 lg:px-8">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#ffae13]/15 text-[#e07b00]"><Icon className="h-5 w-5" /></span>
              <h3 className="font-outfit text-lg font-semibold text-[#0d4697]">{row.title}</h3>
              <span className="text-xs font-bold text-slate-400">{items.length}</span>
            </div>
            {items.length ? (
              <RollingRow key={filter} row={row} items={items} reduce={reduce} />
            ) : (
              <p className="px-5 text-sm font-medium text-slate-500 lg:px-8">No {row.label.toLowerCase()} templates in this group yet.</p>
            )}
          </div>
        )
      })}
    </section>
  )
}
