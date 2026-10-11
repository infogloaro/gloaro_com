import { useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { useMediaQuery } from '../../hooks/useMotionEnv'
import { ease } from '../../lib/motion'
import { gsap, ScrollTrigger } from './gsap'

// A story is { id, eyebrow, title, steps: [{ title, body }], Scene, build }.
// `Scene` renders one SVG holding every element of every step (tagged with
// data-s="…"). `build(tl)` adds each step's tweens to a GSAP timeline, step i
// occupying time [i, i + 1). The same timeline drives all three modes:
//   pinned  – desktop: the stage sticks and scroll scrubs through the steps
//   cards   – phones: one card per step, each plays its own segment once
//   static  – reduced motion: each card is a still frame of its step's end state

const themes = {
  dark: {
    section: 'bg-[#061A3A] text-white',
    stage: 'ring-1 ring-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.35)]',
    card: 'border-white/10 bg-white/5',
    muted: 'text-[#B8C5D9]',
    eyebrow: 'text-[#F5A900]',
    dot: 'bg-white/25',
    dotOn: 'bg-[#F5A900]',
    link: 'text-[#B8C5D9] hover:text-white',
  },
  light: {
    section: 'bg-[#F4F8FE] text-[#0B2451]',
    stage: 'ring-1 ring-[#D9E1EC] shadow-[0_30px_70px_rgba(21,88,176,0.14)]',
    card: 'border-[#D9E1EC] bg-white',
    muted: 'text-[#4A5874]',
    eyebrow: 'text-[#1558B0]',
    dot: 'bg-[#C3CEDD]',
    dotOn: 'bg-[#1558B0]',
    link: 'text-[#4A5874] hover:text-[#0B2451]',
  },
}

const focusRing = 'focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#F5A900]'
const tlDefaults = { ease: 'power2.out', duration: 0.3 }

export default function ScrollStory({ story, theme = 'dark', cta = null }) {
  const reduce = useReducedMotion()
  const desktop = useMediaQuery('(min-width: 1024px)')
  const mode = reduce ? 'static' : desktop ? 'pinned' : 'cards'
  const t = themes[theme]
  const endId = `${story.id}-end`

  return (
    <section aria-labelledby={`${story.id}-title`} className={`relative font-work ${t.section}`}>
      {mode === 'pinned' ? (
        <PinnedStory story={story} t={t} cta={cta} endId={endId} />
      ) : (
        <div className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl">
            <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${t.eyebrow}`}>{story.eyebrow}</p>
            <h2 id={`${story.id}-title`} className="mt-3 font-outfit text-3xl font-semibold leading-tight">{story.title}</h2>
            <a href={`#${endId}`} className={`mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline ${t.link} ${focusRing}`}>
              Skip story <ArrowDown aria-hidden="true" className="h-4 w-4" />
            </a>
            <ol className="mt-8 space-y-6">
              {story.steps.map((step, index) => (
                <StoryCard key={step.title} story={story} index={index} t={t} animate={mode === 'cards'} />
              ))}
            </ol>
            {cta && <div className="mt-8">{cta}</div>}
          </div>
        </div>
      )}
      <span id={endId} className="block scroll-mt-36" />
    </section>
  )
}

function PinnedStory({ story, t, cta, endId }) {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const triggerRef = useRef(null)
  const [active, setActive] = useState(0)
  const count = story.steps.length
  const isLast = active === count - 1

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: tlDefaults })
      story.build(tl)
      tl.set({}, {}, count) // one time unit per step, even if the last step ends early
      triggerRef.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        animation: tl,
        scrub: 0.6,
        onUpdate: (self) => setActive(Math.min(count - 1, Math.floor(self.progress * count))),
      })
    }, stageRef)
    // Fonts and lazy content above can shift the layout after mount.
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => {
      cancelAnimationFrame(frame)
      ctx.revert()
    }
  }, [story, count])

  const goTo = (index) => {
    const trigger = triggerRef.current
    if (!trigger) return
    const top = trigger.start + (trigger.end - trigger.start) * ((index + 0.55) / count)
    if (window.__lenis) window.__lenis.scrollTo(top)
    else window.scrollTo({ top, behavior: 'smooth' })
  }

  const step = story.steps[active]

  return (
    <div ref={sectionRef} style={{ height: `${count * 90 + 100}vh` }}>
      {/* Screen readers get the whole story as a list; the scrubbed caption is visual only. */}
      <ol className="sr-only">
        {story.steps.map((item, index) => (
          <li key={item.title}>Step {index + 1}: {item.title} {item.body}</li>
        ))}
      </ol>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden pt-20">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-center gap-12 px-8">
          <div ref={stageRef} className={`relative aspect-[3/2] w-full overflow-hidden rounded-[28px] ${t.stage}`}>
            <story.Scene />
          </div>

          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${t.eyebrow}`}>{story.eyebrow}</p>
            <h2 id={`${story.id}-title`} className="mt-2 font-outfit text-xl font-medium opacity-80">{story.title}</h2>

            <div aria-hidden="true" className="relative mt-8 min-h-[190px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: ease.entrance } }}
                  exit={{ opacity: 0, y: -16, transition: { duration: 0.18, ease: ease.exit } }}
                >
                  <p className={`text-sm font-medium ${t.muted}`}>Step {active + 1} of {count}</p>
                  <p className="mt-2 font-outfit text-4xl font-semibold leading-tight xl:text-5xl">{step.title}</p>
                  <p className={`mt-4 max-w-md text-lg leading-8 ${t.muted}`}>{step.body}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-6 flex items-center gap-2" role="group" aria-label="Story steps">
              {story.steps.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Go to step ${index + 1}: ${item.title}`}
                  aria-current={index === active ? 'step' : undefined}
                  className={`grid h-11 place-items-center ${focusRing}`}
                >
                  <motion.span
                    animate={{ width: index === active ? 28 : 8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                    className={`block h-2 rounded-full ${index <= active ? t.dotOn : t.dot}`}
                  />
                </button>
              ))}
            </div>

            <div className="mt-6 flex min-h-14 flex-wrap items-center gap-4">
              <AnimatePresence>
                {isLast && cta && (
                  <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    {cta}
                  </motion.div>
                )}
              </AnimatePresence>
              {!isLast && (
                <a href={`#${endId}`} className={`inline-flex min-h-11 items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline ${t.link} ${focusRing}`}>
                  Skip story <ArrowDown aria-hidden="true" className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StoryCard({ story, index, t, animate }) {
  const stageRef = useRef(null)

  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: tlDefaults })
      story.build(tl)
      if (!animate) {
        tl.seek(index + 0.999, false)
        return
      }
      tl.seek(index, false)
      ScrollTrigger.create({
        trigger: stage,
        start: 'top 78%',
        once: true,
        onEnter: () => tl.tweenFromTo(index, index + 0.95),
      })
    }, stage)
    return () => ctx.revert()
  }, [story, index, animate])

  const step = story.steps[index]
  return (
    <li className={`overflow-hidden rounded-3xl border ${t.card}`}>
      <div ref={stageRef} aria-hidden="true" className="aspect-[3/2] w-full">
        <story.Scene />
      </div>
      <div className="p-5">
        <p className={`text-sm font-medium ${t.muted}`}>Step {index + 1} of {story.steps.length}</p>
        <h3 className="mt-1 font-outfit text-2xl font-semibold leading-snug">{step.title}</h3>
        <p className={`mt-2 text-base leading-7 ${t.muted}`}>{step.body}</p>
      </div>
    </li>
  )
}
