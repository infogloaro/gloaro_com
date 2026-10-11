import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight, CalendarCheck, MessageCircle, Navigation, Phone, ShieldCheck } from 'lucide-react'
import { ease, spring, transition, variants } from '../../../lib/motion'
import { whatsappLink } from '../../../lib/contact'
import { useAmbient, usePageVisible } from '../../../hooks/useMotionEnv'
import PhoneStage from '../PhoneStage'
import SocialPost from '../scenes/SocialPost'
import { StatusBar } from '../scenes/parts'
import { industries } from '../industries'
import { serviceGroups } from './content'

const CYCLE_MS = 4200
const heroPosts = industries.map((industry) => ({ industry, scene: industry.scenes.find((s) => s.type === 'social-post') }))

function GlassCard({ className, delay, floating, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.94 }}
      animate={{ opacity: 1, y: floating ? [0, -6, 0] : 0, scale: 1 }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { ...spring.surface, delay },
        y: floating ? { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.6 } : { duration: 0.5, delay },
      }}
      className={`absolute z-10 rounded-2xl border border-white/40 bg-white/75 p-3 shadow-[0_18px_40px_-12px_rgba(6,22,51,0.45)] backdrop-blur-md ${className}`}
    >
      {children}
    </motion.div>
  )
}

function HeroVisual() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { amount: 0.3 })
  const visible = usePageVisible()
  const floating = useAmbient(ref, { priority: 2, amount: 0.3 })
  const [index, setIndex] = useState(0)
  const cycling = inView && visible && !reduce

  useEffect(() => {
    if (!cycling) return undefined
    const id = window.setInterval(() => setIndex((i) => (i + 1) % heroPosts.length), CYCLE_MS)
    return () => window.clearInterval(id)
  }, [cycling])

  const { industry, scene } = heroPosts[index]

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[560px]">
      <PhoneStage accent={industry.accent} label={`Example social post for ${industry.brand.name}: ${scene.alt}`}>
        <StatusBar tone="dark" />
        <AnimatePresence>
          <motion.div
            key={industry.id}
            className="absolute inset-0"
            initial={{ opacity: 0, x: '8%' }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.5, ease: ease.entrance } }}
            exit={{ opacity: 0, x: '-6%', transition: transition.exit }}
          >
            <SocialPost scene={scene} industry={industry} playing={cycling} />
          </motion.div>
        </AnimatePresence>
      </PhoneStage>

      <GlassCard className="left-0 top-[9%] hidden w-40 sm:block" delay={0.5} floating={floating}>
        <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#d6336c]"><CalendarCheck className="h-3.5 w-3.5" />Post scheduled</p>
        <p className="mt-1 text-xs font-bold text-[#08224B]">Friday · 7:00 PM</p>
        <p className="text-[10px] font-medium text-slate-500">Instagram + Facebook</p>
      </GlassCard>
      <GlassCard className="right-0 top-[46%] hidden w-44 sm:block" delay={0.75} floating={floating}>
        <p className="text-[10px] font-semibold text-slate-500">Search · near me</p>
        <p className="mt-0.5 text-xs font-extrabold text-[#1a0dab]">Your Business</p>
        <p className="text-[10px] font-semibold text-[#188038]">Open now</p>
        <div className="mt-2 flex gap-1.5">
          <span className="flex items-center gap-1 rounded-full bg-[#e8f0fe] px-2 py-1 text-[9px] font-bold text-[#1a73e8]"><Phone className="h-2.5 w-2.5" />Call</span>
          <span className="flex items-center gap-1 rounded-full bg-[#e8f0fe] px-2 py-1 text-[9px] font-bold text-[#1a73e8]"><Navigation className="h-2.5 w-2.5" />Directions</span>
        </div>
      </GlassCard>
      <GlassCard className="bottom-[9%] left-0 w-44 sm:w-48" delay={1} floating={floating}>
        <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#00a884]"><MessageCircle className="h-3.5 w-3.5" />New WhatsApp enquiry</p>
        <p className="mt-1 text-xs font-semibold text-[#08224B]">“Hi, is this available this week?”</p>
      </GlassCard>
    </div>
  )
}

export default function Hero({ onPlan, onExplore }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#061633] px-5 pb-16 pt-10 text-white sm:pb-24 sm:pt-14 lg:px-8">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_10%,rgba(214,51,108,0.28),transparent_55%),radial-gradient(ellipse_at_10%_90%,rgba(27,111,224,0.25),transparent_55%)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <motion.div initial="hidden" animate="show" variants={variants.container(0.08)}>
          <motion.nav variants={variants.fadeUp} aria-label="Breadcrumb" className="text-xs font-semibold text-white/55">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link to="/#services" className="hover:text-white">Services</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-[#ffd36e]">Digital Marketing</li>
            </ol>
          </motion.nav>
          <motion.p variants={variants.fadeUp} className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-white/90">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ffae13]" />
            Digital Marketing
          </motion.p>
          <motion.h1 variants={variants.fadeUp} className="mt-5 font-outfit text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            Digital marketing that turns local attention into <span className="text-[#ffae13]">real enquiries</span>
          </motion.h1>
          <motion.p variants={variants.fadeUp} className="mt-5 max-w-xl text-base font-medium leading-7 text-white/70 sm:text-lg">
            GloAro plans, creates and manages your social media, ads and search presence — then makes sure every interested customer reaches you on a call, a form or WhatsApp.
          </motion.p>
          <motion.div variants={variants.fadeUp} className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onPlan({})}
              className="group inline-flex items-center gap-2 rounded-full bg-[#ffae13] px-6 py-3.5 text-sm font-bold text-[#061633] shadow-[0_12px_28px_rgba(255,174,19,0.3)] transition hover:-translate-y-0.5 hover:bg-[#ffbb38]"
            >
              Plan my campaign
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href={whatsappLink('Hi GloAro, I would like to discuss digital marketing for my business.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:border-white/40 hover:bg-white/10"
            >
              <MessageCircle aria-hidden="true" className="h-4 w-4 text-[#25D366]" />
              Discuss my business
            </a>
          </motion.div>
          <motion.div variants={variants.fadeUp} className="mt-9">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">Explore marketing services</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {serviceGroups.map(({ id, Icon, label }) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => onExplore(id)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:border-white/35 hover:text-white"
                  >
                    <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.p variants={variants.fadeUp} className="mt-7 flex items-center gap-2 text-xs font-medium text-white/55">
            <ShieldCheck aria-hidden="true" className="h-4 w-4 text-emerald-300" />
            Your accounts, your data · Clear monthly scope · Transparent reporting
          </motion.p>
        </motion.div>
        <HeroVisual />
      </div>
    </section>
  )
}
