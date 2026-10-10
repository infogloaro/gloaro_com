import { useRef } from 'react'
import { motion } from 'framer-motion'
import { spring, variants, viewportOnce } from '../../../lib/motion'
import { useAmbient } from '../../../hooks/useMotionEnv'
import logo from '../../../assets/logo-transparent.webp'
import { allTech, techStack } from '../homeData'
import SectionHeading from './SectionHeading'

const INNER_COUNT = 8
const RINGS = [
  { items: allTech.slice(0, INNER_COUNT), radius: 27, duration: '48s', direction: 'normal' },
  { items: allTech.slice(INNER_COUNT), radius: 45, duration: '72s', direction: 'reverse' },
]

const pop = {
  hidden: { opacity: 0, scale: 0 },
  show: { opacity: 1, scale: 1, transition: spring.interactive },
}

function OrbitItem({ name, Icon, color, angle, radius }) {
  const left = 50 + radius * Math.cos(angle)
  const top = 50 + radius * Math.sin(angle)
  return (
    <div className="absolute" style={{ left: `${left}%`, top: `${top}%` }}>
      <div className="-translate-x-1/2 -translate-y-1/2">
        <div className="orbit-upright">
          <motion.button
            type="button"
            variants={pop}
            aria-label={name}
            className="group relative grid h-10 w-10 place-items-center rounded-2xl border border-white/15 bg-[#0b2451] shadow-lg transition-transform duration-300 hover:scale-125 focus-visible:scale-125 sm:h-12 sm:w-12"
          >
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color }} />
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-[#0b2451] opacity-0 shadow-lg transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100"
            >
              {name}
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  )
}

function Orbit() {
  const ref = useRef(null)
  const active = useAmbient(ref, { priority: 1, amount: 0.4 })
  return (
    <motion.div
      ref={ref}
      data-paused={!active}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={variants.container(0.06, 0.2)}
      className="orbit relative mx-auto aspect-square w-full max-w-[340px] sm:max-w-[520px]"
    >
      {RINGS.map(({ radius }) => (
        <span
          key={radius}
          aria-hidden="true"
          className="absolute rounded-full border border-dashed border-white/15"
          style={{ inset: `${50 - radius}%` }}
        />
      ))}
      <motion.div variants={pop} className="absolute left-1/2 top-1/2 -ml-12 -mt-12 grid h-24 w-24 place-items-center rounded-full bg-white shadow-[0_0_60px_rgba(255,174,19,0.35)] sm:-ml-14 sm:-mt-14 sm:h-28 sm:w-28">
        <img src={logo} alt="Gloaro" width="526" height="404" loading="lazy" className="h-auto w-16 sm:w-20" />
      </motion.div>
      {RINGS.map(({ items, radius, duration, direction }) => (
        <div
          key={radius}
          className="orbit-ring absolute inset-0"
          data-direction={direction}
          style={{ '--orbit-duration': duration }}
        >
          {items.map(([name, Icon, color], index) => (
            <OrbitItem
              key={name}
              name={name}
              Icon={Icon}
              color={color}
              radius={radius}
              angle={(index / items.length) * Math.PI * 2 - Math.PI / 2}
            />
          ))}
        </div>
      ))}
    </motion.div>
  )
}

export default function TechSection() {
  return (
    <section id="stack" className="relative scroll-mt-28 overflow-hidden bg-[#061633] px-5 py-16 sm:py-24 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1f66d2]/25 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading eyebrow="Engineering capabilities" title="Our technology stack" highlight="stack" dark align="left">
            Proven tools we pick per project, not a one-size framework. Hover or tap an icon to see its name.
          </SectionHeading>
          <motion.dl
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={variants.container(0.06, 0.1)}
            className="mt-8 grid gap-4 sm:grid-cols-2"
          >
            {techStack.map(([group, items]) => (
              <motion.div key={group} variants={variants.fadeUp}>
                <dt className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ffd36e]">{group}</dt>
                <dd className="mt-1 text-sm font-medium text-white/75">{items.map(([name]) => name).join(' · ')}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
        <Orbit />
      </div>
    </section>
  )
}
