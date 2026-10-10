import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { spring, transition } from '../../../lib/motion'
import { processSteps } from '../homeData'
import SectionHeading from './SectionHeading'

// The timeline line draws with scroll. Each step's number flips in as the line
// reaches it, and the step nearest the reading line is highlighted.
export default function ProcessSection() {
  const listRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 0.65', 'end 0.65'] })
  const line = useSpring(scrollYProgress, { stiffness: spring.surface.stiffness, damping: spring.surface.damping, restDelta: 0.001 })
  const [reached, setReached] = useState(-1)

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = value <= 0 ? -1 : Math.min(processSteps.length - 1, Math.floor(value * processSteps.length))
    setReached((current) => (current === next ? current : next))
  })

  return (
    <section id="process" className="scroll-mt-28 bg-white px-5 py-16 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="How we work" title="Our development process" highlight="process" />

        <ol ref={listRef} className="relative mt-12 space-y-5">
          <span aria-hidden="true" className="absolute bottom-6 left-6 top-6 w-0.5 -translate-x-1/2 rounded-full bg-slate-200" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: line }}
            className="absolute bottom-6 left-6 top-6 w-0.5 -ml-px origin-top rounded-full bg-gradient-to-b from-[#ffae13] via-[#1b6fe0] to-[#0d4697]"
          />
          {processSteps.map(([step, title, description], index) => {
            const isReached = index <= reached
            const isActive = index === reached
            return (
              <li key={step} className="relative flex gap-5" aria-current={isActive ? 'step' : undefined}>
                <div className="relative z-10 h-12 w-12 shrink-0" style={{ perspective: 400 }}>
                  <span className="absolute inset-0 rounded-full border-2 border-slate-200 bg-white" />
                  <motion.span
                    initial={false}
                    animate={isReached ? { rotateX: 0, scale: 1, opacity: 1 } : { rotateX: -90, scale: 0.6, opacity: 0 }}
                    transition={spring.interactive}
                    className="absolute inset-0 grid place-items-center rounded-full border-4 border-white bg-[#0d4697] font-outfit text-sm font-black text-white shadow-[0_8px_20px_rgba(13,70,151,0.3)]"
                  >
                    {step}
                  </motion.span>
                </div>
                <div className="relative flex-1 rounded-2xl border border-[#0d4697]/10 bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.05)]">
                  <motion.span
                    aria-hidden="true"
                    initial={false}
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={transition.micro}
                    className="pointer-events-none absolute -inset-px rounded-2xl border-2 border-[#ffae13] shadow-[0_18px_40px_rgba(255,174,19,0.18)]"
                  />
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ff9515]">Step {step}</p>
                  <h3 className="mt-1 text-lg font-extrabold text-[#0d4697]">{title}</h3>
                  <p className="mt-1 text-sm font-medium leading-6 text-slate-600">{description}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
