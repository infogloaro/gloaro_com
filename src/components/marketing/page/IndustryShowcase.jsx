import { useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, BadgeCheck, Check, Clapperboard, Image as ImageIcon, Info, MessageCircle, Pause, Play, Search, Sparkles } from 'lucide-react'
import { ease, spring, transition } from '../../../lib/motion'
import { usePageVisible } from '../../../hooks/useMotionEnv'
import SectionHeading from '../../home/sections/SectionHeading'
import PhoneStage from '../PhoneStage'
import { StatusBar } from '../scenes/parts'
import { sceneComponents } from '../scenes'
import { industries, sceneDuration, sceneKinds } from '../industries'
import '../marketing.css'

const kindIcons = { 'social-post': ImageIcon, reel: Clapperboard, search: Search, enquiry: MessageCircle }

// Arrow keys move between industries (WAI-ARIA tabs pattern).
function useArrowKeys(index, select, prefix) {
  return (event) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
    if (!step) return
    event.preventDefault()
    const next = (index + step + industries.length) % industries.length
    select(next)
    document.getElementById(`${prefix}-${next}`)?.focus()
  }
}

function StatusLabel({ status, className = '' }) {
  const client = status === 'client'
  const Icon = client ? BadgeCheck : Sparkles
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${client ? 'bg-emerald-400/15 text-emerald-300' : 'bg-white/10 text-white/70'} ${className}`}>
      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      {client ? 'Client work' : 'Illustrative example'}
    </span>
  )
}

function Steps({ industry, step, onSelect, onDone, playing }) {
  return (
    <ol className="grid auto-cols-fr grid-flow-col gap-2 lg:grid-flow-row lg:grid-cols-1">
      {industry.scenes.map((scene, i) => {
        const KindIcon = kindIcons[scene.type]
        const active = i === step
        return (
          <li key={i}>
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-current={active ? 'step' : undefined}
              aria-label={`Step ${i + 1}: ${scene.step}`}
              className={`flex w-full flex-col rounded-xl border px-3 py-2 text-left transition-colors ${active ? 'border-white/25 bg-white/10' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}
            >
              <span className="flex items-center gap-2 text-white/60">
                <KindIcon aria-hidden="true" className="h-4 w-4 shrink-0" style={active ? { color: industry.accent } : undefined} />
                <span className={`hidden truncate text-[13px] font-semibold lg:inline ${active ? 'text-white' : 'text-white/70'}`}>{scene.step}</span>
              </span>
              <span className="mt-1.5 block h-[3px] overflow-hidden rounded-full bg-white/10">
                {active && (
                  <span
                    key={`${industry.id}-${i}`}
                    className="mk-progress block h-full rounded-full"
                    style={{ background: industry.accent, animationDuration: `${sceneDuration(scene)}s`, animationPlayState: playing ? 'running' : 'paused' }}
                    onAnimationEnd={onDone}
                  />
                )}
                {i < step && <span className="block h-full rounded-full bg-white/35" />}
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}

// Industry use cases: pick a business type and its campaign plays out on a
// phone — post, short video, local search, then the WhatsApp enquiry.
export default function IndustryShowcase({ onPlan }) {
  const [index, setIndex] = useState(0)
  const [step, setStep] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()
  const stageRef = useRef(null)
  const inView = useInView(stageRef, { amount: 0.35 })
  const pageVisible = usePageVisible()
  const playing = inView && pageVisible && !paused && !reduce

  const industry = industries[index]
  const scene = industry.scenes[step]
  const { Component: Scene, statusTone } = sceneComponents[scene.type]

  const select = (i) => {
    setIndex(i)
    setStep(0)
  }
  const onTabKeys = useArrowKeys(index, select, 'industry-tab')
  const onChipKeys = useArrowKeys(index, select, 'industry-chip')
  const advance = () => setStep((s) => (s + 1) % industry.scenes.length)

  return (
    <section id="industries" aria-labelledby="industries-heading" className="relative isolate scroll-mt-28 overflow-hidden bg-[#061633] px-5 py-16 sm:py-24 lg:px-8">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(27,111,224,0.22),transparent_60%)]" />
      <div className="mx-auto max-w-7xl">
        <div id="industries-heading">
          <SectionHeading dark eyebrow="Industry examples" title="See how it works for businesses like yours" highlight="yours">
            Pick an industry and watch a campaign play out, from the first post to a real enquiry.
          </SectionHeading>
        </div>

        <div
          role="tablist"
          aria-label="Industries"
          onKeyDown={onChipKeys}
          className="-mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:hidden"
        >
          {industries.map(({ id, Icon, label }, i) => {
            const selected = i === index
            return (
              <button
                key={id}
                id={`industry-chip-${i}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="industry-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => select(i)}
                className={`relative isolate flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition-colors ${selected ? 'border-transparent text-[#061633]' : 'border-white/15 bg-white/5 text-white/80'}`}
              >
                {selected && <motion.span layoutId="industry-chip" transition={spring.interactive} className="absolute inset-0 -z-10 rounded-full bg-[#ffae13]" />}
                <Icon aria-hidden="true" className="h-4 w-4" />
                {label}
              </button>
            )
          })}
        </div>

        <div className="mt-4 grid items-center gap-8 lg:mt-14 lg:grid-cols-[230px_minmax(0,1fr)_300px] xl:gap-12">
          <div role="tablist" aria-label="Industries" aria-orientation="vertical" onKeyDown={onTabKeys} className="hidden flex-col gap-1.5 lg:flex">
            {industries.map(({ id, Icon, label, status, accent }, i) => {
              const selected = i === index
              return (
                <button
                  key={id}
                  id={`industry-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="industry-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  className={`relative isolate flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left transition-colors ${selected ? 'text-white' : 'text-white/60 hover:text-white'}`}
                >
                  {selected && <motion.span layoutId="industry-tab" transition={spring.interactive} className="absolute inset-0 -z-10 rounded-2xl border border-white/15 bg-white/10" />}
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors" style={{ background: selected ? accent : 'rgba(255,255,255,0.06)' }}>
                    <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold leading-tight">{label}</span>
                    <span className="block text-[11px] font-medium text-white/45">{status === 'client' ? 'Client work' : 'Illustrative example'}</span>
                  </span>
                </button>
              )
            })}
          </div>

          <div id="industry-panel" role="tabpanel" aria-label={industry.label} ref={stageRef} className="relative">
            <motion.div
              aria-hidden="true"
              animate={{ backgroundColor: industry.accent }}
              transition={{ duration: 0.8, ease: ease.entrance }}
              className="absolute left-1/2 top-1/2 -z-10 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[90px]"
            />
            <PhoneStage accent={industry.accent} label={`${industry.brand.name}, ${sceneKinds[scene.type].toLowerCase()}: ${scene.alt}`}>
              <StatusBar tone={statusTone} />
              <AnimatePresence>
                <motion.div
                  key={`${industry.id}-${step}`}
                  className="absolute inset-0"
                  initial={{ opacity: 0, y: '5%' }}
                  animate={{ opacity: 1, y: 0, transition: { ...spring.surface, opacity: { duration: 0.3, ease: ease.entrance } } }}
                  exit={{ opacity: 0, scale: 0.97, transition: transition.exit }}
                >
                  <Scene scene={scene} industry={industry} playing={playing} reduce={reduce} />
                </motion.div>
              </AnimatePresence>
            </PhoneStage>
          </div>

          <div className="text-white">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={industry.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0, transition: transition.entrance }}
                exit={{ opacity: 0, transition: transition.exit }}
              >
                <StatusLabel status={industry.status} />
                <p className="mt-3 font-outfit text-xl font-semibold leading-snug">{industry.brand.name}</p>
                <p className="mt-1.5 text-sm font-medium leading-6 text-white/65">{industry.pitch}</p>
                <ul className="mt-4 grid gap-1.5">
                  {industry.ideas.map((idea) => (
                    <li key={idea} className="flex items-start gap-2 text-[13px] font-medium text-white/80">
                      <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" style={{ color: industry.accent }} />
                      {idea}
                    </li>
                  ))}
                </ul>
                {industry.note && (
                  <p className="mt-3 flex gap-2 rounded-xl border border-white/10 bg-white/5 p-2.5 text-[12px] leading-5 text-white/65">
                    <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-white/50" />
                    {industry.note}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">Campaign journey</span>
              {!reduce && (
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  aria-pressed={paused}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-xs font-bold text-white/80 transition hover:border-white/30 hover:text-white"
                >
                  {paused ? <Play aria-hidden="true" className="h-3.5 w-3.5" /> : <Pause aria-hidden="true" className="h-3.5 w-3.5" />}
                  {paused ? 'Play' : 'Pause'}
                </button>
              )}
            </div>
            <div className="mt-2.5">
              <Steps industry={industry} step={step} onSelect={setStep} onDone={advance} playing={playing} />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <button
                type="button"
                onClick={() => onPlan({ industry: industry.label })}
                className="group inline-flex items-center gap-2 rounded-full bg-[#ffae13] px-5 py-3 text-sm font-bold text-[#061633] shadow-[0_12px_28px_rgba(255,174,19,0.3)] transition hover:-translate-y-0.5 hover:bg-[#ffbb38]"
              >
                Plan my campaign
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              {industry.brand.site && (
                <a href={industry.brand.site} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-sm font-bold text-white/80 hover:text-white">
                  <span className="link-wipe">Visit {industry.brand.short}</span>
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <p className="mx-auto mt-14 max-w-2xl text-center text-xs font-medium leading-5 text-white/45">
          Vinayaga Ready Mix Concrete is shown with the client’s permission. Other examples use fictional brands with licensed stock photography, and all chats and searches are illustrative. No results are implied.
        </p>
      </div>
    </section>
  )
}
