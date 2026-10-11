import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Briefcase, Building2, Check, Cpu, MapPin, Users } from 'lucide-react'
import { useAmbient } from '../../hooks/useMotionEnv'
import { spring, variants, viewportOnce } from '../../lib/motion'
import ScrollStory from '../../components/partners/ScrollStory'
import { franchiseStory } from '../../components/partners/stories/franchiseStory'
import {
  ApplyButton,
  CtaBand,
  FaqAccordion,
  GhostLink,
  Pending,
  PathSwitcher,
  Reveal,
  ScrollTimeline,
  Section,
  SectionHeading,
  Value,
} from '../../components/partners/PartnerUI'
import { approved, franchise } from '../../components/partners/partnerConfig'

const orbit = ['School Management', 'Hospital Management', 'CRM & ERP', 'Websites', 'Mobile Apps', 'Digital Marketing', 'AI & Automation', 'Custom Software']
const profileIcons = [Briefcase, Building2, Cpu, Users]
const sections = [
  ['franchise-story', 'How it works'],
  ['operating-model', 'Operating model'],
  ['eligibility', 'Eligibility'],
  ['journey', 'Journey'],
  ['faq', 'FAQ'],
]

// Service chips orbiting "Your GLOARO franchise". The slow spin only runs
// while on screen and within the site's ambient-animation budget.
function ServiceOrbit() {
  const ref = useRef(null)
  const spinning = useAmbient(ref, { priority: 2 })
  return (
    <div ref={ref} aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[460px]">
      <div className="absolute inset-[14%] rounded-full border border-dashed border-white/15" />
      <div className="absolute inset-[30%] rounded-full border border-white/10" />
      <motion.div
        className="absolute inset-0"
        animate={spinning ? { rotate: 360 } : undefined}
        transition={{ duration: 80, ease: 'linear', repeat: Infinity }}
      >
        {orbit.map((name, index) => {
          const angle = (index / orbit.length) * Math.PI * 2 - Math.PI / 2
          const x = 50 + Math.cos(angle) * 40
          const y = 50 + Math.sin(angle) * 40
          return (
            <motion.div
              key={name}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: 0.3 + index * 0.08, ...spring.interactive } }}
            >
              <motion.span
                className="block whitespace-nowrap rounded-full border border-white/15 bg-[#0B2451] px-3 py-1.5 text-xs font-semibold text-white shadow-lg sm:text-sm"
                animate={spinning ? { rotate: -360 } : undefined}
                transition={{ duration: 80, ease: 'linear', repeat: Infinity }}
              >
                {name}
              </motion.span>
            </motion.div>
          )
        })}
      </motion.div>
      <div className="absolute inset-[34%] grid place-items-center rounded-full bg-[#F5A900] p-4 text-center shadow-[0_0_60px_rgba(245,169,0,0.35)]">
        <span className="font-outfit text-base font-semibold leading-tight text-[#061A3A] sm:text-lg">Your GLOARO franchise</span>
      </div>
    </div>
  )
}

// GLOARO provides / You provide: items slide into their own column.
function OperatingModel() {
  const columns = [
    { title: 'GLOARO provides', items: franchise.gloaroProvides, from: -60, dark: true },
    { title: 'You provide', items: franchise.youProvide, from: 60, dark: false },
  ]
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {columns.map(({ title, items, from, dark }) => (
        <div key={title} className={`overflow-hidden rounded-[28px] p-7 sm:p-9 ${dark ? 'bg-[#061A3A] text-white' : 'border border-[#D9E1EC] bg-white text-[#14213D]'}`}>
          <h3 className="font-outfit text-2xl font-semibold">{title}</h3>
          <motion.ul className="mt-6 space-y-3" initial="hidden" whileInView="show" viewport={viewportOnce} variants={variants.container(0.1, 0.1)}>
            {items.map((item) => (
              <motion.li
                key={item}
                variants={{ hidden: { opacity: 0, x: from }, show: { opacity: 1, x: 0, transition: spring.surface } }}
                className={`flex flex-wrap items-center gap-3 rounded-2xl px-4 py-3.5 ${dark ? 'bg-white/5' : 'bg-[#F7F9FC]'}`}
              >
                <Check aria-hidden="true" className={`h-5 w-5 shrink-0 ${dark ? 'text-[#F5A900]' : 'text-[#1558B0]'}`} />
                <span className="font-medium">{item}</span>
                {item === 'Onboarding and product training' && <Pending>Scope pending approval</Pending>}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      ))}
    </div>
  )
}

// Private self-check: nothing here is stored or sent.
function ReadinessCheck() {
  const reduce = useReducedMotion()
  const [ticked, setTicked] = useState(() => new Set())
  const total = franchise.readiness.length
  const count = ticked.size
  const radius = 52
  const circumference = 2 * Math.PI * radius

  const toggle = (item) => {
    setTicked((current) => {
      const next = new Set(current)
      if (next.has(item)) next.delete(item)
      else next.add(item)
      return next
    })
  }

  return (
    <div className="grid gap-8 rounded-[28px] border border-[#D9E1EC] bg-white p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_260px]">
      <fieldset className="m-0 border-0 p-0">
        <legend className="font-outfit text-2xl font-semibold text-[#061A3A]">Are you ready?</legend>
        <p className="mt-2 text-[#4A5874]">Tick what applies. This is only for you; nothing is saved or sent.</p>
        <div className="mt-6 space-y-3">
          {franchise.readiness.map((item) => {
            const checked = ticked.has(item)
            return (
              <label key={item} className={`flex min-h-14 cursor-pointer items-center gap-4 rounded-2xl border px-4 py-3 transition-colors ${checked ? 'border-[#0B2451] bg-[#EEF4FD]' : 'border-[#D9E1EC] hover:border-[#8EA3C2]'}`}>
                <input type="checkbox" checked={checked} onChange={() => toggle(item)} className="peer sr-only" />
                <span aria-hidden="true" className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition-colors peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#F5A900] ${checked ? 'border-[#0B2451] bg-[#0B2451]' : 'border-[#8EA3C2] bg-white'}`}>
                  <motion.svg viewBox="0 0 24 24" className="h-4 w-4" initial={false} animate={{ opacity: checked ? 1 : 0 }}>
                    <motion.path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#F5A900" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={false} animate={{ pathLength: checked ? 1 : 0 }} transition={{ duration: reduce ? 0 : 0.25 }} />
                  </motion.svg>
                </span>
                <span className="text-[15px] font-medium text-[#14213D]">{item}</span>
              </label>
            )
          })}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-[#F7F9FC] px-4 py-3 text-sm">
          <span className="font-semibold text-[#061A3A]">Investment range:</span>
          <Value value={approved.franchiseInvestment} />
        </div>
      </fieldset>

      <div className="flex flex-col items-center justify-center gap-5 text-center">
        <div className="relative h-36 w-36">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#EEF2F7" strokeWidth="10" />
            <motion.circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="#F5A900"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={false}
              animate={{ strokeDashoffset: circumference * (1 - count / total) }}
              transition={reduce ? { duration: 0 } : spring.surface}
            />
          </svg>
          <p className="absolute inset-0 grid place-items-center font-outfit text-3xl font-semibold text-[#061A3A]" aria-live="polite">
            <span>{count}<span className="text-base text-[#4A5874]"> of {total}</span></span>
          </p>
        </div>
        <p className="max-w-[220px] text-sm text-[#4A5874]">
          {count === total ? 'You have ticked everything. A great time to apply.' : 'There is no pass mark. Our team discusses readiness with you during review.'}
        </p>
        <ApplyButton pathKey="franchise" location="readiness">Start my application</ApplyButton>
      </div>
    </div>
  )
}

export default function FranchisePage() {
  return (
    <main className="font-work">
      <PathSwitcher active="franchise" sections={sections} />

      <section className="relative overflow-hidden bg-[#061A3A] px-4 pb-20 pt-14 text-white sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
        <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-[#F5A900]/10 blur-[120px]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F5A900]">Franchise Partner</p>
            <h1 className="mt-4 font-outfit text-4xl font-semibold leading-[1.08] sm:text-6xl">Build a technology business with GLOARO.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#DCE4F0]">
              Bring GLOARO’s school, hospital, CRM and digital solutions to businesses in your area. You build the local relationships. We provide the products and delivery.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ApplyButton pathKey="franchise" size="lg" location="hero" />
              <GhostLink dark to="#franchise-story">See how it works</GhostLink>
            </div>
          </Reveal>
          <ServiceOrbit />
        </div>
      </section>

      <span id="franchise-story" className="block scroll-mt-36" />
      <ScrollStory story={franchiseStory} theme="dark" cta={<ApplyButton pathKey="franchise" size="lg" location="story_end" />} />

      <Section id="what-is" tone="light">
        <div className="grid gap-10 lg:grid-cols-2">
          <SectionHeading
            eyebrow="What is a GLOARO franchise?"
            title="Your business. Our products and backing."
            intro="A franchise operator runs an approved GLOARO business in an agreed area. You find and serve customers locally; GLOARO supplies the technology, brand and delivery capability."
          />
          <motion.div className="grid gap-4 sm:grid-cols-2" initial="hidden" whileInView="show" viewport={viewportOnce} variants={variants.container(0.08)}>
            {franchise.profiles.map(([title, text], index) => {
              const Icon = profileIcons[index]
              return (
                <motion.div key={title} variants={variants.fadeUp} whileHover={{ y: -4 }} className="rounded-3xl border border-[#D9E1EC] bg-[#F7F9FC] p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#061A3A] text-[#F5A900]"><Icon aria-hidden="true" className="h-5 w-5" /></span>
                  <h3 className="mt-4 font-outfit text-lg font-semibold text-[#061A3A]">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#4A5874]">{text}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
        <p className="mt-6 flex flex-wrap items-center gap-2 text-sm text-[#4A5874]">Formal eligibility criteria: <Value value={approved.franchiseEligibility} /></p>
        <p className="mt-4 rounded-2xl bg-[#F7F9FC] px-4 py-3 text-sm leading-6 text-[#4A5874]">
          This page is about the GLOARO technology franchise. The Gloaro Network district franchise is a separate programme:{' '}
          <Link to="/network#apply-franchise" className="font-semibold text-[#1558B0] underline underline-offset-4 hover:text-[#0B2451]">see the network franchise</Link>.
        </p>
      </Section>

      <Section id="operating-model" tone="surface">
        <SectionHeading eyebrow="Who does what" title="Clear roles from day one." intro="Final responsibilities are set out in the signed franchise agreement." />
        <div className="mt-10"><OperatingModel /></div>
      </Section>

      <Section id="eligibility" tone="light">
        <ReadinessCheck />
      </Section>

      <Section id="territory" tone="surface">
        <Reveal className="flex flex-col gap-5 rounded-[28px] border border-[#D9E1EC] bg-white p-7 sm:flex-row sm:items-start sm:p-9">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#EAF2FD] text-[#1558B0]"><MapPin aria-hidden="true" className="h-6 w-6" /></span>
          <div>
            <h2 className="font-outfit text-2xl font-semibold text-[#061A3A]">Territory and local market</h2>
            <p className="mt-2 max-w-3xl text-base leading-7 text-[#4A5874]">
              Tell us the area you want to serve. We look at local demand together during review. Any territory rights, including exclusivity, are defined only in the signed franchise agreement.
            </p>
            <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#4A5874]">Territory rules: <Value value={approved.franchiseTerritory} /></p>
          </div>
        </Reveal>
      </Section>

      <Section id="journey" tone="navy">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <SectionHeading dark eyebrow="Your journey to launch" title="Seven clear steps, from first look to opening day." intro="An agreement happens only if both sides decide to go ahead after review and discussion." />
            <div className="mt-8"><ApplyButton pathKey="franchise" location="journey" /></div>
          </div>
          <ScrollTimeline items={franchise.journey} dark />
        </div>
      </Section>

      <Section id="faq" tone="light">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <SectionHeading eyebrow="Franchise questions" title="Straight answers. Placeholders where terms are still being approved." />
          <Reveal><FaqAccordion items={franchise.faqs} idPrefix="franchise-faq" /></Reveal>
        </div>
      </Section>

      <CtaBand pathKey="franchise" title="Start your GLOARO franchise application." text="Five short steps. Your answers are saved on this device as you go." />
    </main>
  )
}
