import { useState, useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, CalendarCheck, MonitorSmartphone, PlayCircle, Smartphone } from 'lucide-react'
import { spring } from '../../../lib/motion'
import { businesses, getBusiness, getThemeKey, isThemeLive, previewVariant, softwareTypes } from '../../../prototypes/catalog'
import { appTemplates } from '../../../prototypes/appCatalog'
import SectionHeading from './SectionHeading'
import ThemePreview from '../../common/ThemePreview'
import AppPreview from '../../common/AppPreview'

// Filters: 'all', a business type (`industry:<id>`) or a software type (`software:<id>`).
const INDUSTRY_FILTERS = businesses.filter((b) => b.kind === 'industry').map((b) => ({ value: `industry:${b.id}`, label: b.name }))
const SOFTWARE_FILTERS = softwareTypes.map((t) => ({ value: `software:${t.id}`, label: t.label }))
const matches = (business, filter) => {
  if (filter === 'all') return true
  const [kind, id] = filter.split(':')
  return kind === 'industry' ? business?.id === id : Boolean(business?.software?.includes(id))
}
// Each rolling row repeats its cards until one copy is at least this long, so
// the loop never shows a gap even when a filter leaves only a few cards.
const MIN_PER_COPY = 8
const SECONDS_PER_CARD = 5
const MIN_ROLLING = 3

// One card per theme. The unfiltered and software views show each business's
// lead theme; picking a business type shows all its themes, titled by theme.
const webApps = businesses.flatMap((business) => business.themes.map((theme, index) => {
  const live = isThemeLive(business.id, theme.id)
  return {
    id: getThemeKey(business.id, theme.id),
    lead: index === 0,
    name: business.name,
    tagline: business.tagline,
    themeName: theme.name,
    accent: business.accent,
    thumb: theme.thumb,
    theme,
    variant: previewVariant(business.id, index),
    href: `/solutions/${business.id}`,
    book: `/contact?theme=${encodeURIComponent(getThemeKey(business.id, theme.id))}`,
    demo: live ? `/prototypes/${business.id}/${theme.id}` : null,
    business,
  }
}))

const pickWeb = (filter) => filter.startsWith('industry:')
  ? webApps.filter((item) => matches(item.business, filter)).map((item) => ({ ...item, name: item.themeName, tagline: item.business.name }))
  : webApps.filter((item) => item.lead && matches(item.business, filter))

// Layout rotates within each business and is offset per business, so the
// ten apps of one type and the lead apps side by side all differ.
const INDUSTRY_ORDER = businesses.map((b) => b.id)
const apps = appTemplates.map((app, index) => ({
  ...app,
  variant: appTemplates.slice(0, index).filter((other) => other.industry === app.industry).length + INDUSTRY_ORDER.indexOf(app.industry),
  href: null,
  book: `/contact?theme=${encodeURIComponent(app.key)}`,
  business: getBusiness(app.industry),
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
          title="Demo not available yet"
          className="inline-flex cursor-not-allowed items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-400"
        >
          <PlayCircle className="h-3.5 w-3.5" /> Demo soon
        </span>
      )}
    </div>
  )
}

// Only live templates get a badge.
function StatusBadge({ live }) {
  if (!live) return null
  return (
    <span className="absolute left-3 top-3 z-10 rounded-full bg-[#17a589] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
      Live demo
    </span>
  )
}

function WebCard({ item, inert }) {
  const { name, tagline, accent, thumb, href, demo, business, theme, variant } = item
  return (
    <article className="group h-full rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_14px_36px_rgba(15,23,42,0.08)] transition-shadow duration-300 hover:shadow-[0_24px_50px_rgba(13,70,151,0.16)]">
      <Link to={href} tabIndex={inert ? -1 : undefined} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]" style={{ background: `linear-gradient(135deg, ${accent}, #0b2451)` }}>
          {thumb ? (
            <img src={thumb} alt={`${name} web app template`} loading="lazy" decoding="async" width="640" height="480" draggable={false} className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110" />
          ) : (
            <ThemePreview business={business} theme={theme} variant={variant} className="h-full w-full origin-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" />
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

// App thumbnail: a phone frame showing the template's own app screen.
function PhoneThumb({ item }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]" style={{ background: `linear-gradient(135deg, ${item.accent}, #0b2451)` }}>
      <div aria-hidden="true" className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute bottom-[-30%] left-1/2 w-[46%] -translate-x-1/2 rounded-[24px] border-[5px] border-[#0b1220] bg-[#0b1220] shadow-[0_20px_40px_rgba(0,0,0,0.35)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-3">
        <div className="relative overflow-hidden rounded-[19px]">
          <AppPreview app={item} variant={item.variant} className="aspect-[9/19.5] w-full" />
          <span aria-hidden="true" className="absolute left-1/2 top-[1.2%] h-[2.6%] w-[30%] -translate-x-1/2 rounded-full bg-[#0b1220]" />
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

function FilterChip({ value, label, selected, onChange }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={(event) => {
        onChange(value)
        event.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }}
      className={`relative isolate min-h-10 shrink-0 snap-start whitespace-nowrap rounded-full border px-4 text-sm font-bold transition-colors ${selected ? 'border-transparent text-[#0b2451]' : 'border-slate-200 bg-white text-slate-600 hover:border-[#0d4697]/30 hover:text-[#0d4697]'}`}
    >
      {selected && <motion.span layoutId="work-filter" transition={spring.interactive} className="absolute inset-0 -z-10 rounded-full bg-[#ffae13] shadow-[0_8px_18px_-8px_rgba(224,123,0,0.6)]" />}
      {label}
    </button>
  )
}

const FILTER_GROUPS = [
  { id: 'industry', label: 'Business type', chips: INDUSTRY_FILTERS },
  { id: 'software', label: 'Software', chips: SOFTWARE_FILTERS },
]

// A "Business type | Software" switch, then one row of chips for that group
// (plus "All"). On phones the row swipes sideways; from `sm` up it wraps.
function Filters({ value, onChange }) {
  const [group, setGroup] = useState(value.startsWith('software:') ? 'software' : 'industry')
  const { chips } = FILTER_GROUPS.find((g) => g.id === group)
  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex justify-center">
        <div className="inline-flex rounded-full bg-slate-100 p-1">
          {FILTER_GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              aria-pressed={group === g.id}
              onClick={() => setGroup(g.id)}
              className={`min-h-9 rounded-full px-4 text-xs font-black uppercase tracking-[0.14em] transition ${group === g.id ? 'bg-white text-[#0d4697] shadow-sm' : 'text-slate-500 hover:text-[#0d4697]'}`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>
      <div
        role="tablist"
        aria-label={`Filter work by ${group === 'software' ? 'software' : 'business'} type`}
        className="-mx-5 mt-4 flex snap-x gap-2 overflow-x-auto scroll-px-5 px-5 pb-2 [mask-image:linear-gradient(90deg,transparent,black_20px,black_calc(100%-20px),transparent)] [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:[mask-image:none] [&::-webkit-scrollbar]:hidden"
      >
        {[{ value: 'all', label: 'All' }, ...chips].map((chip) => (
          <FilterChip key={chip.value} {...chip} selected={chip.value === value} onChange={onChange} />
        ))}
      </div>
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

const PHONE_QUERY = '(max-width: 639px)'
const subscribePhone = (callback) => {
  const media = window.matchMedia(PHONE_QUERY)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}
const useIsPhone = () => useSyncExternalStore(subscribePhone, () => window.matchMedia(PHONE_QUERY).matches, () => false)

function RollingRow({ row, items, reduce }) {
  const Card = row.id === 'apps' ? AppCard : WebCard
  const isPhone = useIsPhone()

  // Phones, reduced motion and short rows: a swipeable row that snaps card by
  // card, so the buttons are never a moving target and a filter that leaves one
  // or two cards never rolls the same thumbnail round and round.
  const few = items.length < MIN_ROLLING
  if (reduce || isPhone || few) {
    return (
      <ul aria-label={row.title} className={`flex snap-x ${few ? 'sm:justify-center ' : ''} snap-mandatory scroll-px-5 gap-4 overflow-x-auto overscroll-x-contain px-5 py-3 [scrollbar-width:none] sm:gap-6 lg:px-8 [&::-webkit-scrollbar]:hidden`}>
        {items.map((item) => (
          <li key={item.id} className="w-[82%] max-w-[340px] shrink-0 snap-start sm:w-[320px]"><Card item={item} /></li>
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
        {/* Two identical copies so the loop is seamless. The second is hidden from
            screen readers and the tab order but stays clickable: `inert` would
            block clicks, and the rolling row often shows only that copy. */}
        {[0, 1].map((half) => (
          <ul key={half} aria-hidden={half === 1 || undefined} aria-label={half === 0 ? row.title : undefined} className="flex shrink-0 gap-6 pr-6">
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
  const [filter, setFilter] = useState('all')
  const pick = (row) => {
    if (row.id === 'web-apps') return pickWeb(filter)
    // A business type shows all its app templates; other views show its lead app.
    return row.items.filter((item) => (filter.startsWith('industry:') || item.lead) && matches(item.business, filter))
  }

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
        const items = pick(row)
        const { Icon } = row
        return (
          <div key={row.id} id={row.id} className="mt-10 scroll-mt-32">
            <div className="mx-auto mb-3 flex max-w-7xl items-center gap-3 px-5 lg:px-8">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#ffae13]/15 text-[#e07b00]"><Icon className="h-5 w-5" /></span>
              <h3 className="font-outfit text-lg font-semibold text-[#0d4697]">{row.title}</h3>
              <span className="text-xs font-bold text-slate-400">{items.length}</span>
              {items.length > 1 && (
                <span aria-hidden="true" className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:hidden">
                  Swipe <ArrowRight className="h-3.5 w-3.5" />
                </span>
              )}
            </div>
            {items.length ? (
              <RollingRow key={filter} row={row} items={items} reduce={reduce} />
            ) : (
              <p className="mx-auto max-w-7xl px-5 text-sm font-medium text-slate-500 lg:px-8">
                No {row.label.toLowerCase()} template for this type yet.{' '}
                <Link to="/contact" className="font-bold text-[#0d4697] underline-offset-4 hover:underline">Ask us to build one</Link>
              </p>
            )}
          </div>
        )
      })}
    </section>
  )
}
