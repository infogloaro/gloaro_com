import { lazy, Suspense, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { ArrowRight, Check, ChevronDown, Move3d, PhoneCall, Plus } from 'lucide-react'
import { ease, spring, variants, viewportOnce } from '../../../lib/motion'
import { SplitWords } from '../../motion/Text'
import SectionHeading from '../../home/sections/SectionHeading'

const TechScene = lazy(() => import('./TechScene'))

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: ease.entrance, delay },
})

// Shown while the 3D scene loads and on devices that get no WebGL (reduced
// motion, no webgl2): a rendered still of the scene when the service has one,
// otherwise a glowing orb with the service icon.
function SceneFallback({ Icon, accent, poster, posterFit = 'cover' }) {
  if (poster) {
    return <img src={poster} alt="" decoding="async" className={`absolute inset-0 h-full w-full ${posterFit === 'contain' ? 'object-contain' : 'object-cover'}`} />
  }
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="absolute h-56 w-56 rounded-full opacity-60 blur-3xl" style={{ background: accent }} />
      <span className="relative grid h-28 w-28 place-items-center rounded-[32px] border border-white/20 bg-white/10 text-white shadow-2xl backdrop-blur">
        <Icon className="h-12 w-12" />
      </span>
    </div>
  )
}

function GlassCard({ label, value, className, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...spring.surface, delay }}
      className={`pointer-events-none absolute z-10 rounded-2xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-white shadow-[0_18px_40px_-14px_rgba(0,0,0,0.6)] backdrop-blur-md ${className}`}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#ffd98a]">{label}</p>
      <p className="mt-0.5 text-xs font-bold">{value}</p>
    </motion.div>
  )
}

export function TechHero({ service, accent, Icon, content }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#061633] px-5 pb-16 pt-6 text-white sm:pb-24 sm:pt-12 lg:px-8">
      {/* Grid backdrop and accent glows */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div aria-hidden="true" className="aurora-blob -left-32 top-10 -z-10 h-80 w-80 opacity-40" style={{ background: accent }} />
      <div aria-hidden="true" className="aurora-blob -right-24 bottom-0 -z-10 h-72 w-72 bg-[#1b6fe0] opacity-30" />

      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        <div className="min-w-0">
          <motion.nav {...fadeUp(0)} aria-label="Breadcrumb" className="text-xs font-semibold text-white/55">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link to="/#services" className="hover:text-white">Services</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-[#ffd98a]">{service.name}</li>
            </ol>
          </motion.nav>

          <motion.div {...fadeUp(0.08)} className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 py-1.5 pl-1.5 pr-4 backdrop-blur">
            <span className="grid h-8 w-8 place-items-center rounded-full text-white" style={{ background: accent }}><Icon className="h-4 w-4" /></span>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/85"><span className="hidden sm:inline">Gloaro Tech · </span>{service.name}</span>
          </motion.div>

          <SplitWords
            as="h1"
            trigger="mount"
            delay={0.15}
            text={service.headline}
            highlight={content.highlight}
            tone="dark"
            className="mt-5 font-outfit text-[2.1rem] font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]"
          />
          <motion.p {...fadeUp(0.5)} className="mt-5 max-w-xl font-work text-base font-medium leading-7 text-white/70 sm:text-lg">{service.intro}</motion.p>

          <motion.ul initial="hidden" animate="show" variants={variants.container(0.08, 0.7)} className="mt-6 flex flex-wrap gap-2">
            {content.chips.map((chip) => (
              <motion.li key={chip} variants={variants.fadeUp} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white/90">
                <Check className="h-3.5 w-3.5 text-[#2ee6a6]" />{chip}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div {...fadeUp(0.9)} className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className="group inline-flex items-center gap-2 rounded-full bg-[#ffae13] px-6 py-3 text-sm font-bold text-[#08142b] shadow-[0_14px_30px_-10px_rgba(255,174,19,0.7)] transition hover:-translate-y-0.5 hover:bg-[#ffc04a]">
              Get a free quote <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="tel:+917200073704" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white transition hover:border-[#ffae13] hover:bg-white/5">
              <PhoneCall className="h-4 w-4 text-[#ffae13]" /> +91 72000 73704
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: ease.entrance, delay: 0.2 }}
          className="relative order-first h-[280px] overflow-hidden rounded-[32px] sm:h-[440px] lg:order-none lg:h-[520px] border border-white/10 bg-[radial-gradient(circle_at_50%_45%,rgba(27,111,224,0.25),transparent_65%)]"
        >
          <Suspense fallback={<SceneFallback Icon={Icon} accent={accent} poster={content.poster} posterFit={content.posterFit} />}>
            <TechScene id={service.id} accent={accent} fallback={<SceneFallback Icon={Icon} accent={accent} poster={content.poster} posterFit={content.posterFit} />} />
          </Suspense>
          {content.cards && (
            <>
              <GlassCard label={content.cards[0][0]} value={content.cards[0][1]} className="left-3 top-3 sm:left-5 sm:top-5" delay={0.9} />
              <GlassCard label={content.cards[1][0]} value={content.cards[1][1]} className="bottom-3 right-3 sm:bottom-5 sm:right-5" delay={1.1} />
            </>
          )}
          <span className="pointer-events-none absolute bottom-3 left-3 hidden items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45 sm:bottom-5 sm:left-5 sm:flex">
            <Move3d className="h-3.5 w-3.5" /> Move your pointer
          </span>
        </motion.div>
      </div>
    </section>
  )
}

// Card whose border and background light up where the pointer is.
function SpotlightCard({ index, title, text, accent }) {
  const ref = useRef(null)
  const move = (event) => {
    const rect = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--x', `${event.clientX - rect.left}px`)
    ref.current.style.setProperty('--y', `${event.clientY - rect.top}px`)
  }
  return (
    <motion.li
      ref={ref}
      onPointerMove={move}
      variants={variants.fadeUp}
      style={{ '--accent': accent }}
      className="group relative overflow-hidden rounded-3xl border border-[#08224B]/10 bg-white p-6 shadow-[0_14px_34px_-18px_rgba(8,34,75,0.3)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_26px_50px_-20px_rgba(8,34,75,0.4)]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(260px_circle_at_var(--x)_var(--y),color-mix(in_srgb,var(--accent)_16%,transparent),transparent_70%)]" />
      <div className="relative flex items-start justify-between">
        <span className="font-outfit text-4xl font-semibold text-[#08224B]/10 transition-colors duration-300 group-hover:text-[color:var(--accent)]">{String(index + 1).padStart(2, '0')}</span>
        <span className="grid h-9 w-9 place-items-center rounded-full border border-[#08224B]/10 text-[#08224B]/40 transition duration-300 group-hover:rotate-90 group-hover:border-transparent group-hover:bg-[color:var(--accent)] group-hover:text-white">
          <Plus className="h-4 w-4" />
        </span>
      </div>
      <h3 className="relative mt-4 font-outfit text-lg font-semibold text-[#08224B]">{title}</h3>
      <p className="relative mt-2 text-sm font-medium leading-6 text-slate-600">{text}</p>
      <span aria-hidden="true" className="absolute inset-x-6 bottom-0 h-[3px] origin-left scale-x-0 rounded-full transition-transform duration-500 group-hover:scale-x-100" style={{ background: accent }} />
    </motion.li>
  )
}

export function Capabilities({ service, accent }) {
  return (
    <section className="relative bg-white px-5 py-16 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="What we build" title="Everything that is included" highlight="included">{service.name}</SectionHeading>
        <motion.ul initial="hidden" whileInView="show" viewport={viewportOnce} variants={variants.container(0.08)} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {service.deliverables.map(([title, text], i) => <SpotlightCard key={title} index={i} title={title} text={text} accent={accent} />)}
        </motion.ul>
      </div>
    </section>
  )
}

function Marquee({ items, direction, dark }) {
  const copy = [...items, ...items, ...items]
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <div className="work-roll flex w-max" data-direction={direction} style={{ animationDuration: `${copy.length * 2.2}s` }}>
        {[0, 1].map((half) => (
          <ul key={half} aria-hidden={half === 1 || undefined} className="flex shrink-0 gap-3 pr-3">
            {copy.map((item, i) => (
              <li key={`${item}-${i}`} className={`flex items-center gap-2.5 whitespace-nowrap rounded-2xl border px-4 py-3 text-sm font-bold ${dark ? 'border-white/10 bg-white/5 text-white' : 'border-[#08224B]/10 bg-white text-[#08224B]'}`}>
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[#ffae13] to-[#e07b00] font-outfit text-xs font-bold text-[#08142b]">{item.charAt(0)}</span>
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

export function StackBand({ service, accent }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#061633] py-16 text-white sm:py-24">
      <div aria-hidden="true" className="aurora-blob left-1/3 top-0 -z-10 h-72 w-72 opacity-25" style={{ background: accent }} />
      <div className="px-5 lg:px-8">
        <SectionHeading eyebrow="Tech stack" title="Proven tools, chosen for your project" highlight="Proven" dark />
      </div>
      <div className="mt-10 space-y-3">
        <Marquee items={service.tech} direction="left" dark />
        <Marquee items={service.tech.slice().reverse()} direction="right" dark />
      </div>
      <div className="mx-auto mt-14 max-w-5xl px-5 text-center lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-white/50">Who it’s for</p>
        <motion.ul initial="hidden" whileInView="show" viewport={viewportOnce} variants={variants.container(0.06)} className="mt-5 flex flex-wrap justify-center gap-2">
          {service.audiences.map((item) => (
            <motion.li key={item} variants={variants.fadeUp} whileHover={{ y: -3, scale: 1.04 }} transition={spring.interactive} className="cursor-default rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 hover:border-[#ffae13]/60 hover:text-white">
              {item}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

// Steps sit on a rail that fills in as the section scrolls past.
export function ProcessTimeline({ steps, accent }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  return (
    <section className="bg-[#fdf9e9] px-5 py-16 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow="How we work" title="A clear path from idea to launch" highlight="launch" />
        <ol ref={ref} className="relative mt-12 space-y-5 pl-12 sm:pl-16">
          <span aria-hidden="true" className="absolute bottom-2 left-[19px] top-2 w-[3px] rounded-full bg-[#08224B]/10 sm:left-[27px]" />
          <motion.span aria-hidden="true" style={{ scaleY: reduce ? 1 : fill, background: `linear-gradient(${accent}, #ffae13)` }} className="absolute bottom-2 left-[19px] top-2 w-[3px] origin-top rounded-full sm:left-[27px]" />
          {steps.map(([num, title, text], i) => (
            <motion.li
              key={num}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, ease: ease.entrance, delay: i * 0.03 }}
              className="relative rounded-2xl border border-[#08224B]/10 bg-white p-4 shadow-[0_10px_26px_-16px_rgba(8,34,75,0.35)] sm:p-5"
            >
              <span className="absolute -left-12 top-4 grid h-10 w-10 place-items-center rounded-full bg-[#08224B] font-outfit text-sm font-bold text-[#ffae13] shadow-lg ring-4 ring-[#fdf9e9] sm:-left-16 sm:h-14 sm:w-14 sm:text-base">{num}</span>
              <h3 className="font-outfit text-lg font-semibold text-[#08224B]">{title}</h3>
              <p className="mt-1 text-sm font-medium leading-6 text-slate-600">{text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function Faq({ faqs, accent }) {
  const [open, setOpen] = useState(0)
  return (
    <section className="bg-white px-5 py-16 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Questions we hear often" highlight="often" />
        <div className="mt-10 space-y-3">
          {faqs.map(([question, answer], i) => {
            const isOpen = open === i
            return (
              <div key={question} className={`overflow-hidden rounded-2xl border bg-white transition-shadow ${isOpen ? 'border-transparent shadow-[0_18px_40px_-20px_rgba(8,34,75,0.45)] ring-1 ring-[#08224B]/10' : 'border-[#08224B]/10'}`}>
                <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left text-base font-bold text-[#08224B]">
                  {question}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors" style={{ background: isOpen ? accent : '#f1f5f9', color: isOpen ? '#fff' : '#08224B' }}>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: ease.entrance }}>
                      <p className="px-5 pb-5 text-sm font-medium leading-6 text-slate-600">{answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function RelatedCta({ related, iconFor }) {
  return (
    <section className="bg-white px-5 pb-16 sm:pb-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-outfit text-2xl font-semibold tracking-tight text-[#0d4697]">Explore other services</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => {
            const { Icon, accent } = iconFor(item.id)
            return (
              <li key={item.slug}>
                <Link to={`/tech/${item.slug}`} className="group flex h-full items-center gap-3 rounded-2xl border border-[#08224B]/10 bg-white p-3.5 text-sm font-bold text-[#08224B] transition hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_16px_34px_-18px_rgba(8,34,75,0.45)]">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" style={{ background: accent }}><Icon className="h-5 w-5" /></span>
                  <span className="flex-1 leading-snug">{item.name}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#08224B]/40 transition-transform group-hover:translate-x-1 group-hover:text-[#08224B]" />
                </Link>
              </li>
            )
          })}
        </ul>

        {/* CTA card with a slowly rotating conic border. */}
        <div className="relative mt-14 overflow-hidden rounded-[30px] p-[2px]">
          <div aria-hidden="true" className="absolute inset-[-150%] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_0deg,#ffae13,#1b6fe0,#17a589,#ffae13)] motion-reduce:animate-none" />
          <div className="relative rounded-[28px] bg-[#061633] px-6 py-12 text-center text-white sm:px-10">
            <h2 className="font-outfit text-2xl font-semibold sm:text-4xl">Tell us what you want to build</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm font-medium text-white/70 sm:text-base">
              GLOARO is based in Kallakurichi, Tamil Nadu, and works with businesses across India. Share your requirement and we’ll get back with a clear scope.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="group inline-flex items-center gap-2 rounded-full bg-[#ffae13] px-6 py-3 text-sm font-bold text-[#08142b] transition hover:-translate-y-0.5 hover:bg-[#ffd36e]">
                Get a free quote <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="tel:+917200073704" className="rounded-full border border-white/25 px-6 py-3 text-sm font-bold transition hover:border-[#ffae13]">Call +91 72000 73704</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
