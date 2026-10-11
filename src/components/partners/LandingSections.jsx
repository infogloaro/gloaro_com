import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Building2, Check, Handshake, RotateCcw } from 'lucide-react'
import { TiltCard } from '../motion/Interactive'
import { spring, variants, viewportOnce } from '../../lib/motion'
import { trackPartnerEvent } from '../../lib/partnerAnalytics'
import { ApplyButton, DemoBadge, GhostLink, Reveal, Value } from './PartnerUI'
import { comparison, fitQuestions, howItWorks, paths, services } from './partnerConfig'

const focusRing = 'focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#F5A900]'

// Two path cards with cursor tilt, spotlight glow and a spinning border (desktop pointer only).
export function PathCards() {
  const cards = [
    { path: paths.franchise, Icon: Building2, label: 'Path 1', dark: true, conic: 'conic-gradient(from 0deg, transparent 0 60%, #F5A900 75%, #FFD36E 88%, transparent 100%)', glow: 'rgba(245,169,0,0.22)' },
    { path: paths.channel, Icon: Handshake, label: 'Path 2', dark: false, conic: 'conic-gradient(from 0deg, transparent 0 60%, #1558B0 75%, #7FA6DC 88%, transparent 100%)', glow: 'rgba(21,88,176,0.18)' },
  ]
  return (
    <motion.div
      className="grid gap-6 md:grid-cols-2"
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={variants.container(0.12)}
    >
      {cards.map(({ path, Icon, label, dark, conic, glow }) => (
        <motion.div key={path.key} variants={variants.fadeUp}>
          <TiltCard
            className={`rounded-[28px] ${dark ? 'bg-[#1B3A70]' : 'bg-[#C3CEDD]'}`}
            innerClassName={`flex flex-col p-7 sm:p-9 ${dark ? 'bg-[#061A3A] text-white' : 'bg-white text-[#14213D]'}`}
            conic={conic}
            glow={glow}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold uppercase tracking-[0.18em] ${dark ? 'text-[#F5A900]' : 'text-[#1558B0]'}`}>{label}</span>
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${dark ? 'bg-white/10 text-[#F5A900]' : 'bg-[#EAF2FD] text-[#1558B0]'}`}>
                <Icon aria-hidden="true" className="h-6 w-6" />
              </span>
            </div>
            <h3 className="mt-5 font-outfit text-3xl font-semibold">{path.short}</h3>
            <p className={`mt-2 text-lg ${dark ? 'text-[#DCE4F0]' : 'text-[#4A5874]'}`}>{path.tagline}</p>
            <ul className="mt-6 space-y-3">
              {path.points.map((point) => (
                <li key={point} className="flex gap-3 text-[15px]">
                  <Check aria-hidden="true" className={`mt-0.5 h-5 w-5 shrink-0 ${dark ? 'text-[#F5A900]' : 'text-[#1558B0]'}`} />
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-3 pt-2">
              <Link
                to={path.href}
                onClick={() => trackPartnerEvent('path_card_clicked', { path: path.key })}
                className={`inline-flex min-h-12 items-center gap-2 rounded-full px-6 font-outfit text-sm font-semibold transition-colors ${dark ? 'bg-[#F5A900] text-[#061A3A] hover:bg-[#FFBE2E]' : 'bg-[#1558B0] text-white hover:bg-[#0F4A99]'} ${focusRing}`}
              >
                {path.exploreLabel}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link
                to={path.applyHref}
                onClick={() => trackPartnerEvent('apply_clicked', { path: path.key, location: 'path_card' })}
                className={`inline-flex min-h-12 items-center rounded-full px-4 text-sm font-semibold underline-offset-4 hover:underline ${dark ? 'text-white' : 'text-[#0B2451]'} ${focusRing}`}
              >
                Apply now
              </Link>
            </div>
          </TiltCard>
        </motion.div>
      ))}
    </motion.div>
  )
}

// "Find your fit in 3 taps": each answer swings the arrow toward a road.
export function FitPicker() {
  const reduce = useReducedMotion()
  const [answers, setAnswers] = useState([])
  const [choosing, setChoosing] = useState(null)
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const index = answers.length
  const done = index >= fitQuestions.length
  const score = answers.reduce((sum, lean) => sum + (lean === 'franchise' ? -1 : 1), 0)
  const result = done ? (score < 0 ? 'franchise' : 'channel') : null
  const angle = (choosing ? score + (choosing === 'franchise' ? -1 : 1) : score) * 22

  const choose = (lean) => {
    if (choosing) return
    setChoosing(lean)
    timer.current = window.setTimeout(() => {
      const next = [...answers, lean]
      setAnswers(next)
      setChoosing(null)
      if (next.length === fitQuestions.length) {
        const total = next.reduce((sum, item) => sum + (item === 'franchise' ? -1 : 1), 0)
        trackPartnerEvent('picker_result', { result: total < 0 ? 'franchise' : 'channel' })
      }
    }, reduce ? 0 : 420)
  }

  const reset = () => {
    setAnswers([])
    setChoosing(null)
  }

  const question = fitQuestions[Math.min(index, fitQuestions.length - 1)]

  return (
    <div className="grid overflow-hidden rounded-[28px] border border-[#D9E1EC] bg-white shadow-[0_24px_60px_rgba(11,36,81,0.08)] lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="p-6 sm:p-10">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-[#4A5874]">{done ? 'Your match' : `Question ${index + 1} of ${fitQuestions.length}`}</p>
          <div className="flex gap-1.5" aria-hidden="true">
            {fitQuestions.map((item, i) => (
              <span key={item.id} className="h-1.5 w-8 overflow-hidden rounded-full bg-[#D9E1EC]">
                <motion.span
                  className="block h-full rounded-full bg-[#F5A900]"
                  initial={false}
                  animate={{ width: i < index ? '100%' : '0%' }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
            ))}
          </div>
        </div>

        <div aria-live="polite" className="relative mt-6 min-h-[230px]">
          <AnimatePresence mode="wait" initial={false}>
            {!done ? (
              <motion.fieldset
                key={question.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="m-0 border-0 p-0"
              >
                <legend className="font-outfit text-2xl font-semibold text-[#061A3A] sm:text-3xl">{question.question}</legend>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {question.answers.map((answer) => {
                    const picked = choosing === answer.lean
                    return (
                      <button
                        key={answer.label}
                        type="button"
                        aria-pressed={picked}
                        onClick={() => choose(answer.lean)}
                        className={`relative isolate min-h-16 rounded-2xl border px-5 py-4 text-left text-base font-medium transition-colors ${picked ? 'border-transparent text-white' : 'border-[#C3CEDD] text-[#14213D] hover:border-[#1558B0]'} ${focusRing}`}
                      >
                        {picked && (
                          <motion.span
                            layoutId="fit-pill"
                            transition={spring.interactive}
                            className={`absolute inset-0 -z-10 rounded-2xl ${answer.lean === 'franchise' ? 'bg-[#061A3A]' : 'bg-[#1558B0]'}`}
                          />
                        )}
                        {answer.label}
                      </button>
                    )
                  })}
                </div>
              </motion.fieldset>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-outfit text-3xl font-semibold text-[#061A3A]">{paths[result].name} looks like your fit.</p>
                <p className="mt-3 max-w-xl text-base leading-7 text-[#4A5874]">
                  {result === 'franchise'
                    ? 'You want to build and run a local business. This is only a guide; you are welcome to explore both paths.'
                    : 'You want to introduce businesses you know. This is only a guide; you are welcome to explore both paths.'}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <ApplyButton pathKey={result} location="picker" />
                  <GhostLink to={paths[result].href}>See the {paths[result].short} path</GhostLink>
                  <button type="button" onClick={reset} className={`inline-flex min-h-12 items-center gap-2 rounded-full px-4 text-sm font-semibold text-[#4A5874] hover:text-[#0B2451] ${focusRing}`}>
                    <RotateCcw aria-hidden="true" className="h-4 w-4" /> Start again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div aria-hidden="true" className="relative hidden min-h-[320px] lg:block">
        <svg viewBox="0 0 380 360" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <rect width="190" height="360" fill="#061A3A" />
          <rect x="190" width="190" height="360" fill="#EAF2FD" />
          <path d="M190 380 L190 230 C 190 170 120 130 50 40" fill="none" stroke="#8EA3C2" strokeWidth="30" strokeLinecap="round" />
          <path d="M190 230 C 190 170 260 130 330 40" fill="none" stroke="#8EA3C2" strokeWidth="30" strokeLinecap="round" />
          <path d="M190 230 C 190 170 120 130 50 40" fill="none" stroke="#F5A900" strokeWidth="3" strokeDasharray="10 8" />
          <path d="M190 230 C 190 170 260 130 330 40" fill="none" stroke="#1558B0" strokeWidth="3" strokeDasharray="10 8" />
          <text x="24" y="330" fontSize="15" fill="#F5A900" fontFamily="Outfit, sans-serif" fontWeight="600">Franchise</text>
          <text x="356" y="330" textAnchor="end" fontSize="15" fill="#1558B0" fontFamily="Outfit, sans-serif" fontWeight="600">Channel Partner</text>
          {/* Needle pivots on the fork: its path ends at (0,0) and the origin is its bottom centre. */}
          <g transform="translate(190 230)">
            <motion.path
              d="M0 -88 L12 -66 L3 -66 L3 0 L-3 0 L-3 -66 L-12 -66 Z"
              fill="#FFFFFF"
              stroke="#0B2451"
              strokeWidth="2"
              strokeLinejoin="round"
              style={{ originX: 0.5, originY: 1 }}
              animate={{ rotate: done ? (result === 'franchise' ? -40 : 40) : angle }}
              transition={{ type: 'spring', stiffness: 160, damping: 11 }}
            />
            <circle r="12" fill="#FFFFFF" stroke="#0B2451" strokeWidth="3" />
          </g>
        </svg>
      </div>
    </div>
  )
}

// Side-by-side comparison; rows reveal one after another.
export function ComparisonTable() {
  return (
    <motion.div
      role="region"
      aria-label="Comparison table"
      tabIndex={0}
      className="overflow-x-auto rounded-3xl border border-[#D9E1EC] bg-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-[#F5A900]"
      onViewportEnter={() => trackPartnerEvent('comparison_viewed')}
      viewport={{ once: true, amount: 0.3 }}
    >
      <table className="w-full min-w-[620px] border-collapse text-left">
        <caption className="sr-only">Franchise and Channel Partner compared</caption>
        <thead>
          <tr>
            <th scope="col" className="w-1/4 px-6 py-5 text-sm font-medium text-[#4A5874]"><span className="sr-only">Topic</span></th>
            <th scope="col" className="bg-[#061A3A] px-6 py-5 font-outfit text-lg font-semibold text-white">Franchise</th>
            <th scope="col" className="bg-[#1558B0] px-6 py-5 font-outfit text-lg font-semibold text-white">Channel Partner</th>
          </tr>
        </thead>
        <motion.tbody initial="hidden" whileInView="show" viewport={viewportOnce} variants={variants.container(0.1)}>
          {comparison.map(([topic, franchiseValue, channelValue]) => (
            <motion.tr
              key={topic}
              variants={{ hidden: { opacity: 0, x: -24 }, show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }}
              className="border-t border-[#EEF2F7]"
            >
              <th scope="row" className="px-6 py-4 text-sm font-semibold text-[#061A3A]">{topic}</th>
              <td className="px-6 py-4 text-[15px] text-[#14213D]"><Value value={franchiseValue} /></td>
              <td className="px-6 py-4 text-[15px] text-[#14213D]"><Value value={channelValue} /></td>
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </motion.div>
  )
}

function MiniScreen({ variant }) {
  const bars = {
    school: ['w-1/2', 'w-3/4', 'w-2/3'],
    hospital: ['w-2/3', 'w-1/2', 'w-3/4'],
    crm: ['w-3/4', 'w-2/3', 'w-1/2'],
  }[variant]
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-xl border border-[#D9E1EC] bg-[#F7F9FC]">
      <div className="flex items-center gap-1.5 bg-[#1558B0] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-white/80" />
        <span className="h-2 w-2 rounded-full bg-white/50" />
      </div>
      <div className="grid grid-cols-[56px_1fr] gap-3 p-3">
        <div className="h-24 rounded-lg bg-[#EAF2FD]" />
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="h-10 rounded-lg bg-[#D6E6FA]" />
            <div className="h-10 rounded-lg bg-[#D6E6FA]" />
          </div>
          {bars.map((width, index) => <div key={index} className={`h-2 rounded-full bg-[#C3CEDD] ${width}`} />)}
        </div>
      </div>
    </div>
  )
}

export function ServicesShowcase() {
  const demos = services.filter((service) => service.demo)
  const others = services.filter((service) => !service.demo)
  return (
    <>
      <motion.div className="grid gap-5 md:grid-cols-3" initial="hidden" whileInView="show" viewport={viewportOnce} variants={variants.container(0.1)}>
        {demos.map((service) => (
          <motion.article key={service.id} variants={variants.fadeUp} whileHover={{ y: -6 }} transition={spring.interactive} className="rounded-3xl border border-[#D9E1EC] bg-white p-5">
            <MiniScreen variant={service.id} />
            <div className="mt-5 flex items-center justify-between gap-3">
              <h3 className="font-outfit text-xl font-semibold text-[#061A3A]">{service.name}</h3>
              <DemoBadge />
            </div>
            <p className="mt-2 text-sm leading-6 text-[#4A5874]">{service.note}</p>
          </motion.article>
        ))}
      </motion.div>
      <motion.ul className="mt-6 flex flex-wrap gap-2.5" initial="hidden" whileInView="show" viewport={viewportOnce} variants={variants.container(0.05)}>
        {others.map((service) => (
          <motion.li key={service.id} variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }}>
            <Link to={service.href} className={`inline-flex min-h-11 items-center rounded-full border border-[#D9E1EC] bg-white px-4 text-sm font-medium text-[#14213D] transition-colors hover:border-[#1558B0] hover:text-[#1558B0] ${focusRing}`}>
              {service.name}
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </>
  )
}

export function HowItWorks() {
  const columns = [
    { key: 'franchise', dark: true, steps: howItWorks.franchise },
    { key: 'channel', dark: false, steps: howItWorks.channel },
  ]
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {columns.map(({ key, dark, steps }) => (
        <Reveal key={key} className={`rounded-[28px] p-7 sm:p-9 ${dark ? 'bg-[#061A3A] text-white' : 'border border-[#D9E1EC] bg-white text-[#14213D]'}`}>
          <h3 className="font-outfit text-2xl font-semibold">{paths[key].short}</h3>
          <motion.ol className="mt-6 space-y-5" initial="hidden" whileInView="show" viewport={viewportOnce} variants={variants.container(0.12, 0.15)}>
            {steps.map(([title, text], index) => (
              <motion.li key={title} variants={variants.fadeUp} className="flex gap-4">
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-outfit text-sm font-semibold ${dark ? 'bg-[#F5A900] text-[#061A3A]' : 'bg-[#1558B0] text-white'}`}>{index + 1}</span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className={`mt-0.5 text-sm leading-6 ${dark ? 'text-[#B8C5D9]' : 'text-[#4A5874]'}`}>{text}</p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
          <div className="mt-8">
            <ApplyButton pathKey={key} location="how_it_works" />
          </div>
        </Reveal>
      ))}
    </div>
  )
}
