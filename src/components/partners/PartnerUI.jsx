import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, MessageCircle, Plus } from 'lucide-react'
import { Magnetic } from '../motion/Interactive'
import { spring, transition, variants, viewportOnce } from '../../lib/motion'
import { whatsappLink } from '../../lib/contact'
import { trackPartnerEvent } from '../../lib/partnerAnalytics'
import { gsap, ScrollTrigger } from './gsap'
import { isPending, paths, PENDING } from './partnerConfig'

const focusRing = 'focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#F5A900]'

// Amber chip for any business value that management has not approved yet.
export function Pending({ children = PENDING, className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full border border-[#F2D27A] bg-[#FFF4D6] px-3 py-1 text-xs font-semibold text-[#6B4200] ${className}`}>
      {children}
    </span>
  )
}

// Renders an approved value as text, or the placeholder chip while pending.
export function Value({ value, className = '' }) {
  return isPending(value) ? <Pending /> : <span className={className}>{value}</span>
}

export function DemoBadge({ className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full bg-[#FFF4D6] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#6B4200] ${className}`}>
      Demo Preview
    </span>
  )
}

const sectionTones = {
  light: 'bg-white text-[#14213D]',
  surface: 'bg-[#F7F9FC] text-[#14213D]',
  sky: 'bg-[#EAF2FD] text-[#14213D]',
  navy: 'bg-[#061A3A] text-white',
}

export function Section({ id, tone = 'light', className = '', children }) {
  return (
    <section id={id} className={`scroll-mt-36 px-4 py-16 font-work sm:px-6 sm:py-20 lg:px-8 lg:py-24 ${sectionTones[tone]} ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  )
}

export function SectionHeading({ eyebrow, title, intro, dark = false, center = false, as: Tag = 'h2' }) {
  return (
    <Reveal className={`max-w-3xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${dark ? 'text-[#F5A900]' : 'text-[#1558B0]'}`}>{eyebrow}</p>
      )}
      <Tag className={`mt-3 font-outfit text-3xl font-semibold leading-tight sm:text-4xl ${dark ? 'text-white' : 'text-[#061A3A]'}`}>{title}</Tag>
      {intro && <p className={`mt-4 text-base leading-7 sm:text-lg ${dark ? 'text-[#B8C5D9]' : 'text-[#4A5874]'}`}>{intro}</p>}
    </Reveal>
  )
}

// One-shot fade-up on first view.
export function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const Component = motion[as]
  const fadeUp = delay
    ? { ...variants.fadeUp, show: { ...variants.fadeUp.show, transition: { ...transition.entrance, delay } } }
    : variants.fadeUp
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={fadeUp}
    >
      {children}
    </Component>
  )
}

const buttonSizes = {
  md: 'min-h-12 px-6 text-sm',
  lg: 'min-h-14 px-8 text-base',
}

const solidByPath = {
  franchise: 'bg-[#F5A900] text-[#061A3A] hover:bg-[#FFBE2E] shadow-[0_12px_28px_rgba(245,169,0,0.28)]',
  channel: 'bg-[#1558B0] text-white hover:bg-[#0F4A99] shadow-[0_12px_28px_rgba(21,88,176,0.3)]',
}

// Magnetic Apply button that always names its path.
export function ApplyButton({ pathKey, size = 'md', location = 'page', className = '', children }) {
  const path = paths[pathKey]
  return (
    <Magnetic>
      <Link
        to={path.applyHref}
        onClick={() => trackPartnerEvent('apply_clicked', { path: path.key, location })}
        className={`group inline-flex items-center justify-center gap-2 rounded-full font-outfit font-semibold transition-colors ${buttonSizes[size]} ${solidByPath[pathKey]} ${focusRing} ${className}`}
      >
        {children ?? path.applyLabel}
        <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </Magnetic>
  )
}

export function GhostLink({ to, href, dark = false, children, onClick, className = '' }) {
  const classes = `inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-6 text-sm font-semibold transition-colors ${dark ? 'border-white/30 text-white hover:border-[#F5A900] hover:text-[#FFD36E]' : 'border-[#C3CEDD] text-[#14213D] hover:border-[#1558B0] hover:text-[#1558B0]'} ${focusRing} ${className}`
  if (href) {
    return <a href={href} target="_blank" rel="noreferrer" onClick={onClick} className={classes}>{children}</a>
  }
  // In-page anchors stay plain links so the smooth scroller can handle them.
  if (to?.startsWith('#')) {
    return <a href={to} onClick={onClick} className={classes}>{children}</a>
  }
  return <Link to={to} onClick={onClick} className={classes}>{children}</Link>
}

export function WhatsAppLink({ dark = false, message, label = 'Talk to us on WhatsApp', location = 'page' }) {
  return (
    <GhostLink dark={dark} href={whatsappLink(message)} onClick={() => trackPartnerEvent('whatsapp_clicked', { location })}>
      <MessageCircle aria-hidden="true" className="h-4 w-4" />
      {label}
    </GhostLink>
  )
}

// Sticky Franchise ⇄ Channel Partner switcher. The pill slides to whichever
// tab is hovered and settles back on the current page.
export function PathSwitcher({ active, sections = [] }) {
  const [hovered, setHovered] = useState(null)
  const highlight = hovered ?? active
  const dark = active === 'franchise'

  return (
    <div className={`sticky top-[84px] z-40 border-b backdrop-blur-xl ${dark ? 'border-white/10 bg-[#061A3A]/90' : 'border-[#D9E1EC] bg-white/90'}`}>
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <nav aria-label="Partnership paths" className={`flex rounded-full p-1 ${dark ? 'bg-white/10' : 'bg-[#EAF2FD]'}`} onPointerLeave={() => setHovered(null)}>
          {['franchise', 'channel'].map((key) => {
            const isCurrent = key === active
            return (
              <Link
                key={key}
                to={paths[key].href}
                aria-current={isCurrent ? 'page' : undefined}
                onPointerEnter={() => setHovered(key)}
                onFocus={() => setHovered(key)}
                onBlur={() => setHovered(null)}
                className={`relative rounded-full px-3 py-2 text-xs font-semibold sm:px-4 sm:text-sm ${focusRing} ${
                  highlight === key ? (dark ? 'text-[#061A3A]' : 'text-white') : dark ? 'text-white/80' : 'text-[#0B2451]'
                }`}
              >
                {highlight === key && (
                  <motion.span
                    layoutId={`path-pill-${active}`}
                    transition={spring.interactive}
                    className={`absolute inset-0 -z-0 rounded-full ${dark ? 'bg-[#F5A900]' : 'bg-[#1558B0]'}`}
                  />
                )}
                <span className="relative">{paths[key].short}</span>
              </Link>
            )
          })}
        </nav>
        <nav aria-label="On this page" className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {sections.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${dark ? 'text-[#B8C5D9] hover:text-white' : 'text-[#4A5874] hover:text-[#0B2451]'} ${focusRing}`}>
              {label}
            </a>
          ))}
        </nav>
        <div className="ml-auto">
          <ApplyButton pathKey={active} location="switcher" className="!min-h-10 !px-4 text-xs sm:!px-5 sm:text-sm">
            <span className="sm:hidden">Apply</span>
            <span className="hidden sm:inline">{paths[active].applyLabel}</span>
          </ApplyButton>
        </div>
      </div>
    </div>
  )
}

export function FaqAccordion({ items, idPrefix, dark = false }) {
  const [open, setOpen] = useState(0)
  const reduce = useReducedMotion()

  return (
    <div className={`divide-y rounded-3xl border ${dark ? 'divide-white/10 border-white/10 bg-white/5' : 'divide-[#D9E1EC] border-[#D9E1EC] bg-white'}`}>
      {items.map(([question, answer], index) => {
        const isOpen = open === index
        const buttonId = `${idPrefix}-q-${index}`
        const panelId = `${idPrefix}-a-${index}`
        return (
          <div key={question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : index)}
                className={`flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left font-outfit text-lg font-medium sm:px-6 ${dark ? 'text-white' : 'text-[#061A3A]'} ${focusRing}`}
              >
                {question}
                <motion.span
                  aria-hidden="true"
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={spring.interactive}
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${dark ? 'bg-white/10 text-[#F5A900]' : 'bg-[#EAF2FD] text-[#1558B0]'}`}
                >
                  <Plus className="h-4 w-4" />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className={`px-5 pb-5 text-base leading-7 sm:px-6 ${dark ? 'text-[#B8C5D9]' : 'text-[#4A5874]'}`}>
                    <Value value={answer} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

// Vertical journey timeline: a line fills as you scroll and each step lights up
// when the fill reaches it.
export function ScrollTimeline({ items, dark = false, accent = '#F5A900', onAccent = '#061A3A' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()

  useLayoutEffect(() => {
    if (reduce || !ref.current) return undefined
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-fill]', { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top 70%', end: 'bottom 65%', scrub: 0.5 },
      })
      gsap.utils.toArray('[data-step]').forEach((element) => {
        ScrollTrigger.create({
          trigger: element,
          start: 'top 68%',
          onEnter: () => { element.dataset.on = 'true' },
          onLeaveBack: () => { element.dataset.on = 'false' },
        })
      })
    }, ref)
    return () => ctx.revert()
  }, [reduce])

  return (
    <ol ref={ref} className="relative ml-1 space-y-8 sm:ml-4">
      <span aria-hidden="true" className={`absolute bottom-3 left-[19px] top-3 w-[3px] rounded-full ${dark ? 'bg-white/15' : 'bg-[#D9E1EC]'}`} />
      <span aria-hidden="true" data-fill style={{ background: accent }} className="absolute bottom-3 left-[19px] top-3 w-[3px] origin-top rounded-full" />
      {items.map(([title, text], index) => (
        <li key={title} data-step data-on={reduce ? 'true' : 'false'} className="group relative flex gap-5">
          <span
            className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 font-outfit text-sm font-semibold transition-colors duration-300 ${
              dark ? 'border-white/25 bg-[#061A3A] text-[#B8C5D9]' : 'border-[#C3CEDD] bg-white text-[#4A5874]'
            } group-data-[on=true]:border-transparent group-data-[on=true]:text-[var(--on-accent)]`}
            style={{ '--accent': accent, '--on-accent': onAccent }}
          >
            <span aria-hidden="true" className="absolute inset-0 rounded-full bg-[var(--accent)] opacity-0 transition-opacity duration-300 group-data-[on=true]:opacity-100" />
            <span className="relative">{String(index + 1).padStart(2, '0')}</span>
          </span>
          <div className="pt-1.5">
            <h3 className={`font-outfit text-lg font-semibold ${dark ? 'text-white' : 'text-[#061A3A]'}`}>{title}</h3>
            <p className={`mt-1 text-sm leading-6 ${dark ? 'text-[#B8C5D9]' : 'text-[#4A5874]'}`}>{text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

// Closing conversion band.
export function CtaBand({ pathKey, title, text, secondary }) {
  const dark = pathKey === 'franchise'
  return (
    <section className={`px-4 py-16 font-work sm:px-6 lg:px-8 ${dark ? 'bg-[#0B2451] text-white' : 'bg-[#1558B0] text-white'}`}>
      <Reveal className="mx-auto flex max-w-6xl flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-outfit text-3xl font-semibold leading-tight sm:text-4xl">{title}</h2>
          <p className="mt-3 text-base leading-7 text-white/85">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {pathKey === 'channel' ? (
            <Magnetic>
              <Link
                to={paths.channel.applyHref}
                onClick={() => trackPartnerEvent('apply_clicked', { path: 'channel', location: 'cta_band' })}
                className={`inline-flex min-h-14 items-center gap-2 rounded-full bg-white px-8 font-outfit text-base font-semibold text-[#0B2451] transition-colors hover:bg-[#EAF2FD] ${focusRing}`}
              >
                {paths.channel.applyLabel}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Magnetic>
          ) : (
            <ApplyButton pathKey="franchise" size="lg" location="cta_band" />
          )}
          {secondary ?? <WhatsAppLink dark location="cta_band" label="Talk to us first" message={`Hi GLOARO, I would like to know more about the ${paths[pathKey].name} programme.`} />}
        </div>
      </Reveal>
    </section>
  )
}
