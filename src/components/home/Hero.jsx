import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, Bot, CheckCircle2, Cloud, Code2, Rocket, Server } from 'lucide-react'
import { ease, perspective, spring } from '../../lib/motion'
import { useAmbient, usePointerEffects } from '../../hooks/useMotionEnv'
import { Aurora } from '../motion/Ambient'
import { CountUp, Magnetic } from '../motion/Interactive'
import { SplitWords, Typewriter } from '../motion/Text'
import { heroStats, serviceRotator } from './homeData'

const surfaceSpring = { stiffness: spring.surface.stiffness, damping: spring.surface.damping }

const TOKEN = {
  k: 'text-[#ff9ac1]',
  v: 'text-[#9cdcfe]',
  f: 'text-[#ffd36e]',
  s: 'text-[#6ee7d7]',
  p: 'text-white/70',
}

const CODE = [
  [['const ', 'k'], ['app', 'v'], [' = ', 'p'], ['gloaro', 'f'], ['.build({', 'p']],
  [['  type: ', 'p'], ["'saas'", 's'], [',', 'p']],
  [['  ai: ', 'p'], ['true', 'k'], [',', 'p']],
  [['  users: ', 'p'], ['10_000', 'f'], [',', 'p']],
  [['})', 'p']],
  [['await ', 'k'], ['app', 'v'], ['.deploy()', 'f']],
]
// Character offset where each line starts, so rendering stays a pure function of `typed`.
const LINE_LENGTHS = CODE.map((line) => line.reduce((n, [text]) => n + text.length, 0))
const LINE_STARTS = LINE_LENGTHS.map((_, row) => LINE_LENGTHS.slice(0, row).reduce((a, b) => a + b, 0))
const CODE_LENGTH = LINE_LENGTHS.reduce((a, b) => a + b, 0)
const BARS = [40, 65, 50, 85, 60, 95, 75]

// Types the snippet out character by character while `active`, holds, then
// restarts. Every line has a fixed height so typing never shifts layout.
function CodeEditor({ active }) {
  const [typed, setTyped] = useState(CODE_LENGTH)

  useEffect(() => {
    if (!active) return undefined
    const done = typed >= CODE_LENGTH
    const timer = window.setTimeout(() => setTyped(done ? 0 : typed + 1), done ? 2400 : 38)
    return () => window.clearTimeout(timer)
  }, [active, typed])

  const caretRow = typed >= CODE_LENGTH ? -1 : LINE_STARTS.findLastIndex((lineStart) => typed >= lineStart)
  return (
    <div className="mt-3 rounded-xl bg-black/25 px-2 py-2">
      {CODE.map((line, row) => {
        let remaining = Math.max(0, typed - LINE_STARTS[row])
        const parts = []
        for (const [text, kind] of line) {
          if (remaining <= 0) break
          parts.push(<span key={parts.length} className={TOKEN[kind]}>{text.slice(0, remaining)}</span>)
          remaining -= text.length
        }
        return (
          <div key={row} className="flex h-5 items-center whitespace-pre font-mono text-[11px] sm:text-xs">
            <span className="mr-3 w-3 text-right text-white/25">{row + 1}</span>
            {parts}
            {row === caretRow && <span className="typewriter-caret ml-px inline-block h-3.5 w-[2px] bg-[#ffae13]" />}
          </div>
        )
      })}
    </div>
  )
}

function HeroMockup({ rotateX, rotateY, chipsY }) {
  const ref = useRef(null)
  const active = useAmbient(ref, { priority: 3, amount: 0.6 })
  const [bars, setBars] = useState(BARS)

  useEffect(() => {
    if (!active) return undefined
    const timer = window.setInterval(() => {
      setBars((current) => current.map(() => 30 + Math.round(Math.random() * 70)))
    }, 1800)
    return () => window.clearInterval(timer)
  }, [active])

  const chips = [
    [Code2, 'React', 'left-[-8%] top-[8%]', 1.15],
    [Server, 'Node.js', 'right-[-8%] top-[34%]', 1.25],
    [Bot, 'AI', 'left-[-4%] bottom-[24%]', 1.35],
    [Cloud, 'Cloud', 'right-[0%] bottom-[-4%]', 1.45],
  ]

  return (
    <div ref={ref} className="relative mx-auto w-[84%] max-w-md sm:w-full" style={{ perspective }}>
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, ease: ease.entrance, delay: 0.3 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }} className="relative">
          {/* Back glass layer */}
          <div
            aria-hidden="true"
            style={{ transform: 'translateZ(-60px)' }}
            className="absolute -right-6 -top-8 w-40 rounded-2xl border border-white/10 bg-[#123a7a]/70 p-3 shadow-2xl"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Uptime</p>
            <p className="mt-1 font-outfit text-2xl font-semibold text-white">99.98%</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[92%] rounded-full bg-[#6ee7d7]" />
            </div>
          </div>

          {/* Main window */}
          <div className="relative rounded-3xl border border-white/15 bg-[#0b2451]/90 p-4 shadow-[0_40px_90px_rgba(0,0,0,0.45)]">
            <div className="flex items-center gap-1.5 border-b border-white/10 pb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffd36e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#4ade80]" />
              <span className="ml-3 font-mono text-[10px] text-white/40">app.config.js</span>
            </div>

            <CodeEditor active={active} />

            <div className="mt-4 flex h-24 items-end gap-2 rounded-2xl border border-white/10 bg-black/20 p-3">
              {bars.map((value, index) => (
                <div key={index} className="h-full flex-1 overflow-hidden">
                  <motion.div
                    className="h-full origin-bottom rounded-t-md bg-gradient-to-t from-[#1b6fe0] to-[#7fa8f0]"
                    initial={{ scaleY: 0.08 }}
                    animate={{ scaleY: value / 100 }}
                    transition={{ ...spring.surface, delay: bars === BARS ? 0.9 + index * 0.06 : 0 }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Front glass layer */}
          <div
            style={{ transform: 'translateZ(70px)' }}
            className="absolute -bottom-6 -left-6 flex items-center gap-3 rounded-2xl border border-white/20 bg-gradient-to-r from-[#ffae13] to-[#ffd36e] px-4 py-3 text-[#0b2451] shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
          >
            <CheckCircle2 className="h-5 w-5" />
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider">Deployed to production</p>
              <p className="text-[11px] font-semibold opacity-75">Build passed · 42s</p>
            </div>
            <ArrowRight className="h-4 w-4" />
          </div>

          {/* Floating chips: nearest depth layer */}
          <motion.div style={{ y: chipsY, transformStyle: 'preserve-3d' }} className="pointer-events-none absolute inset-0">
            {chips.map(([Icon, label, position, delay]) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...spring.interactive, delay }}
                style={{ z: 110 }}
                className={`absolute ${position} flex items-center gap-2 rounded-full border border-white/20 bg-[#0b2451]/90 px-3 py-2 text-xs font-bold text-white shadow-xl`}
              >
                <Icon className="h-4 w-4 text-[#ffae13]" />
                {label}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const pointer = usePointerEffects()
  const rotateX = useSpring(0, surfaceSpring)
  const rotateY = useSpring(0, surfaceSpring)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const progress = useSpring(scrollYProgress, surfaceSpring)
  const backY = useTransform(progress, [0, 1], [0, 140])
  const midY = useTransform(progress, [0, 1], [0, -70])
  const frontY = useTransform(progress, [0, 1], [0, -90])

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    rotateY.set(((event.clientX - rect.left) / rect.width - 0.5) * 16)
    rotateX.set(-((event.clientY - rect.top) / rect.height - 0.5) * 12)
  }
  const resetTilt = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <>
      <section
        ref={ref}
        onPointerMove={pointer ? handleMove : undefined}
        onPointerLeave={pointer ? resetTilt : undefined}
        className="relative isolate overflow-hidden bg-[#061633] pb-28 pt-12 sm:pb-32 sm:pt-16"
      >
        <motion.div aria-hidden="true" style={reduce ? undefined : { y: backY }} className="absolute inset-0">
          <Aurora tone="hero" priority={1} />
        </motion.div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:px-8">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: ease.entrance }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-white/90"
            >
              <Rocket className="h-3.5 w-3.5 text-[#ffae13]" />
              Gloaro Tech
            </motion.div>

            <SplitWords
              as="h1"
              trigger="mount"
              text="We build the software that grows your business"
              highlight="software"
              delay={0.1}
              wordDuration={0.55}
              className="mt-6 font-outfit text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: ease.entrance, delay: 0.8 }}
              className="mt-5 font-outfit text-xl font-medium text-white/90 sm:text-2xl"
            >
              Shipping{' '}
              <Typewriter words={serviceRotator} className="justify-items-center text-[#ffd36e] lg:justify-items-start" />
            </motion.p>

            {/* Largest text block above the fold (the LCP element): painted
                immediately rather than faded in, so the entrance never delays LCP. */}
            <p className="mx-auto mt-4 max-w-xl font-work text-base font-medium leading-7 text-white/75 sm:text-lg lg:mx-0">
              Custom software, websites, mobile apps, SaaS products and AI-driven automation — engineered for businesses that are ready to scale.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: ease.entrance, delay: 1 }}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
            >
              <Magnetic>
                <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ffae13] px-7 py-3.5 text-base font-bold text-[#0b2451] shadow-[0_16px_30px_rgba(255,174,19,0.35)]">
                  Start a Project
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Magnetic>
              <Magnetic>
                <a href="#portfolio" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/10">
                  View Our Work
                </a>
              </Magnetic>
            </motion.div>
          </div>

          <motion.div style={reduce ? undefined : { y: midY }}>
            <HeroMockup rotateX={pointer ? rotateX : 0} rotateY={pointer ? rotateY : 0} chipsY={reduce ? 0 : frontY} />
          </motion.div>
        </div>
      </section>

      <div className="relative z-10 -mt-14 px-5 sm:-mt-16">
        <motion.dl
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: ease.entrance, delay: 1 }}
          className="mx-auto grid max-w-5xl grid-cols-2 overflow-hidden rounded-3xl border border-white/70 bg-[#0d4697] text-center text-white shadow-xl shadow-slate-900/25 lg:grid-cols-4"
        >
          {heroStats.map(([value, label], index) => (
            <div key={label} className={`flex flex-col-reverse px-3 py-5 sm:py-6 ${index % 2 === 1 ? 'border-l border-white/30' : ''} ${index > 1 ? 'border-t border-white/30 lg:border-t-0' : ''} ${index === 2 ? 'lg:border-l' : ''}`}>
              <dt className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/75">{label}</dt>
              <dd><CountUp value={value} className="font-dm-serif text-3xl sm:text-4xl" /></dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </>
  )
}
