import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { ease, spring, transition, variants, viewportOnce } from '../../../lib/motion'
import NeuralBackground from '../../motion/NeuralBackground'
import { TiltCard } from '../../motion/Interactive'
import { services } from '../homeData'
import { techServiceById } from '../../tech/serviceContent'
import SectionHeading from './SectionHeading'
import ServicePreview from './servicePreviews'

const NAVY = '#08224B'
const GOLD = '#CB9015'

// Right-hand cards land one by one: rise, scale up and settle with a spring.
const cardEntrance = {
  hidden: { opacity: 0, y: 60, scale: 0.85 },
  show: { opacity: 1, y: 0, scale: 1, transition: { ...spring.surface, opacity: { duration: 0.4, ease: ease.entrance } } },
}

// Arrow keys move between services, matching the WAI-ARIA tabs pattern.
function useArrowKeys(index, select, prefix) {
  return (event) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
    if (!step) return
    event.preventDefault()
    const next = (index + step + services.length) % services.length
    select(next)
    document.getElementById(`${prefix}-${next}`)?.focus()
  }
}

function ShowcasePanel({ service }) {
  const { id, Icon, accent, title, description } = service
  const slug = techServiceById(id)?.slug
  return (
    <div
      id="service-panel"
      role="tabpanel"
      className="relative overflow-hidden rounded-[28px] border border-[#08224B]/10 bg-white/85 p-6 shadow-[0_24px_60px_rgba(8,34,75,0.12)] sm:p-8"
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 origin-left"
        style={{ background: `linear-gradient(90deg, ${accent}, ${GOLD})` }}
        key={`${id}-bar`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: ease.entrance }}
      />
      <AnimatePresence mode="wait" initial={false}>
        {/* Each selection zooms in from a small stage. */}
        <motion.div
          key={id}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1, transition: { ...spring.surface, opacity: { duration: 0.3, ease: ease.entrance } } }}
          exit={{ opacity: 0, scale: 0.92, transition: transition.exit }}
          className="origin-center"
        >
          <div className="flex items-center gap-4">
            <motion.span
              initial={{ scale: 0.6, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={spring.interactive}
              className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white shadow-lg"
              style={{ background: accent }}
            >
              <Icon className="h-7 w-7" />
            </motion.span>
            <h3 className="font-outfit text-2xl font-semibold tracking-tight sm:text-3xl" style={{ color: NAVY }}>{title}</h3>
          </div>
          <p className="mt-4 text-base font-medium leading-7 text-slate-600">{description}</p>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...spring.surface, delay: 0.12 }}
            className="mt-6 aspect-[16/10] overflow-hidden rounded-2xl border border-[#08224B]/10 shadow-inner"
          >
            <ServicePreview id={id} />
          </motion.div>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            {slug && (
              <Link to={`/tech/${slug}`} className="group inline-flex items-center gap-2 text-sm font-bold" style={{ color: NAVY }}>
                <span className="link-wipe">Learn more about {title}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            )}
            <Link to="/contact" className="group inline-flex items-center gap-2 text-sm font-bold text-[#CB9015]">
              <span className="link-wipe">Discuss this service</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function ServicesSection() {
  const [index, setIndex] = useState(0)
  const onCardKeys = useArrowKeys(index, setIndex, 'service-card')
  const onChipKeys = useArrowKeys(index, setIndex, 'service-chip')

  return (
    <section id="services" className="relative isolate scroll-mt-28 overflow-hidden bg-[#fdf9e9] px-5 py-16 sm:py-24 lg:px-8">
      <NeuralBackground tone="cream" priority={2} />
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="What we do" title="Technology services built around your business" highlight="business">
          Pick a service to see the kind of interface we build for it.
        </SectionHeading>

        {/* Mobile and tablet: tap chips above the panel. */}
        <div
          role="tablist"
          aria-label="Services"
          onKeyDown={onChipKeys}
          className="-mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:hidden"
        >
          {services.map(({ id, Icon, title }, i) => {
            const selected = i === index
            return (
              <button
                key={id}
                id={`service-chip-${i}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="service-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setIndex(i)}
                className={`relative flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition-colors ${selected ? 'border-transparent text-white' : 'border-[#08224B]/10 bg-white text-[#08224B]'}`}
              >
                {selected && <motion.span layoutId="service-chip" transition={spring.interactive} className="absolute inset-0 -z-10 rounded-full bg-[#08224B]" />}
                <Icon className="h-4 w-4" />
                {title.replace(' & Development', '').replace(' Development', '')}
              </button>
            )
          })}
        </div>

        <div className="mt-6 grid items-start gap-8 lg:mt-12 lg:grid-cols-[1.15fr_1fr]">
          <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={variants.fadeUp} className="lg:sticky lg:top-28">
            <ShowcasePanel service={services[index]} />
          </motion.div>

          {/* Desktop: selectable cards in an asymmetric grid beside the panel. */}
          <motion.div
            role="tablist"
            aria-label="Services"
            aria-orientation="vertical"
            onKeyDown={onCardKeys}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={variants.container(0.15, 0.25)}
            className="hidden gap-4 lg:grid lg:grid-cols-2"
          >
            {services.map(({ id, Icon, accent, title, short }, i) => {
              const selected = i === index
              return (
                <motion.div key={id} variants={cardEntrance} className={i % 2 === 1 ? 'lg:translate-y-8' : ''}>
                  <TiltCard
                    max={5}
                    glow={`${accent}33`}
                    className={`rounded-2xl shadow-[0_10px_26px_rgba(8,34,75,0.06)] ${selected ? 'bg-[#CB9015]' : 'bg-[#08224B]/10'}`}
                    innerClassName="bg-white"
                  >
                    <button
                      id={`service-card-${i}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="service-panel"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setIndex(i)}
                      className="flex h-full w-full flex-col items-start p-5 text-left"
                    >
                      <span
                        className="grid h-11 w-11 place-items-center rounded-xl transition-transform duration-300 group-hover/tilt:-rotate-12 group-hover/tilt:scale-110"
                        style={{ background: selected ? accent : `${accent}1a`, color: selected ? '#fff' : accent }}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="mt-3 text-sm font-extrabold" style={{ color: NAVY }}>{title}</span>
                      <span className="mt-1 text-xs font-medium text-slate-500">{short}</span>
                    </button>
                  </TiltCard>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
