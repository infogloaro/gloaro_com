import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { ease, stagger, transition, viewportOnce } from '../../lib/motion'
import { usePageVisible, usePointerEffects } from '../../hooks/useMotionEnv'

const GOLD = {
  dark: 'bg-gradient-to-r from-[#ffe3a3] via-[#ffae13] to-[#ffd98a]',
  light: 'bg-gradient-to-r from-[#ff9515] via-[#ffae13] to-[#e07b00]',
}

// Gold gradient word with a light sweep across the glyphs. The sweep is
// transform-only: a masked window slides right while the copy of the text
// inside it slides left by the same amount, so the glyphs stay put.
export function ShimmerWord({ children, tone = 'dark', delay = 0, className = '' }) {
  const reduce = useReducedMotion()
  const pointer = usePointerEffects()
  const [run, setRun] = useState(0)
  const sweep = { duration: 1.1, ease: ease.entrance, delay: run === 0 ? delay : 0 }

  return (
    <span
      className={`relative inline-block ${className}`}
      onPointerEnter={pointer ? () => setRun((value) => value + 1) : undefined}
    >
      <span className={`${GOLD[tone]} bg-clip-text text-transparent`}>{children}</span>
      {!reduce && (
        <motion.span
          key={run}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-[40%] overflow-hidden [mask-image:linear-gradient(90deg,transparent,black,transparent)]"
          initial={{ x: '-100%' }}
          animate={{ x: '250%' }}
          transition={sweep}
        >
          <motion.span
            className="absolute inset-y-0 left-0 w-[250%] whitespace-nowrap bg-gradient-to-r from-[#fff3cf] via-white to-[#fff3cf] bg-clip-text text-transparent"
            initial={{ x: '40%' }}
            animate={{ x: '-100%' }}
            transition={sweep}
          >
            {children}
          </motion.span>
        </motion.span>
      )}
    </span>
  )
}

const MASK = 'inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom'

// Heading split into words that rise out of a mask, 120ms apart. The
// `highlight` word (gold shimmer) is held back and revealed on its own once
// the rest of the line has landed.
export function SplitWords({
  text,
  as = 'h2',
  highlight,
  tone = 'dark',
  trigger = 'view',
  delay = 0,
  gap = stagger.words,
  wordDuration = 0.8,
  underline = false,
  className = '',
}) {
  const Tag = motion[as]
  const words = text.split(' ')
  const isHighlight = (word) => Boolean(highlight) && word.replace(/[^\w]/g, '') === highlight
  // Position of each word among the non-highlighted ones, for stagger timing.
  const plainOrder = words.map((word, index) => words.slice(0, index).filter((w) => !isHighlight(w)).length)
  const plainCount = words.filter((word) => !isHighlight(word)).length
  const highlightDelay = delay + Math.max(0, plainCount - 1) * gap + wordDuration * 0.35
  const play = trigger === 'mount' ? { animate: 'show' } : { whileInView: 'show', viewport: viewportOnce }

  return (
    <Tag aria-label={text} initial="hidden" {...play} className={className}>
      {words.map((word, index) => {
        const special = isHighlight(word)
        const wordDelay = special ? highlightDelay : delay + plainOrder[index] * gap
        return (
          <span key={`${word}-${index}`} aria-hidden="true" className={`${MASK} mr-[0.26em] last:mr-0`}>
            <motion.span
              className="relative inline-block"
              variants={{
                hidden: special ? { y: '60%', opacity: 0, scale: 0.92 } : { y: '110%' },
                show: special
                  ? { y: '0%', opacity: 1, scale: 1, transition: { duration: wordDuration * 1.1, ease: ease.entrance, delay: wordDelay } }
                  : { y: '0%', transition: { duration: wordDuration, ease: ease.entrance, delay: wordDelay } },
              }}
            >
              {special ? <ShimmerWord tone={tone} delay={highlightDelay + wordDuration}>{word}</ShimmerWord> : word}
              {special && underline && (
                // Gold stroke drawn left to right under the highlight word once it has landed.
                <motion.svg
                  aria-hidden="true"
                  viewBox="0 0 100 8"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[0.14em] w-full overflow-visible"
                >
                  <motion.path
                    d="M1 6 C 25 1, 75 1, 99 6"
                    fill="none"
                    stroke="#ffae13"
                    strokeWidth="3"
                    strokeLinecap="round"
                    variants={{
                      hidden: { pathLength: 0, opacity: 0 },
                      show: { pathLength: 1, opacity: 1, transition: { duration: 0.7, ease: ease.entrance, delay: highlightDelay + wordDuration * 0.9 } },
                    }}
                  />
                </motion.svg>
              )}
            </motion.span>
          </span>
        )
      })}
    </Tag>
  )
}

// Paragraph whose words rise in grouped by rendered line, 120ms per line.
// Lines are measured after layout so wrapping stays responsive.
export function LineReveal({ text, as = 'p', className = '' }) {
  const Tag = motion[as]
  const ref = useRef(null)
  const words = text.split(' ')
  const [lines, setLines] = useState(() => words.map(() => 0))

  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const measure = () => {
      let top = null
      let line = -1
      const next = [...node.querySelectorAll('[data-word]')].map((span) => {
        if (span.offsetTop !== top) {
          top = span.offsetTop
          line += 1
        }
        return line
      })
      setLines((previous) => (previous.join() === next.join() ? previous : next))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [text])

  return (
    <Tag ref={ref} aria-label={text} initial="hidden" whileInView="show" viewport={viewportOnce} className={className}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} data-word aria-hidden="true" className={`${MASK} mr-[0.26em]`}>
          <motion.span
            className="inline-block"
            custom={lines[index]}
            variants={{
              hidden: { y: '110%', opacity: 0 },
              show: (line) => ({ y: '0%', opacity: 1, transition: { ...transition.entranceLong, delay: 0.25 + line * stagger.words } }),
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

// Types, holds, deletes and rotates through `words`. The longest word is
// rendered invisibly underneath so the line never changes width.
export function Typewriter({ words, className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref)
  const visible = usePageVisible()
  const [index, setIndex] = useState(0)
  const [count, setCount] = useState(words[0].length)
  const [deleting, setDeleting] = useState(false)
  const word = words[index]
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), '')

  useEffect(() => {
    if (!inView || !visible) return undefined
    if (reduce) {
      const timer = window.setTimeout(() => setIndex((value) => (value + 1) % words.length), 2400)
      return () => window.clearTimeout(timer)
    }
    const full = !deleting && count === word.length
    const empty = deleting && count === 0
    const wait = full ? 1600 : empty ? 260 : deleting ? 35 : 75
    const timer = window.setTimeout(() => {
      if (full) setDeleting(true)
      else if (empty) {
        setDeleting(false)
        setIndex((value) => (value + 1) % words.length)
      } else setCount((value) => value + (deleting ? -1 : 1))
    }, wait)
    return () => window.clearTimeout(timer)
  }, [count, deleting, inView, reduce, visible, word.length, words.length])

  return (
    <span ref={ref} className={`inline-grid ${className}`}>
      <span className="sr-only">{words.join(', ')}</span>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-nowrap">{longest}|</span>
      <span aria-hidden="true" className="col-start-1 row-start-1 whitespace-nowrap">
        {reduce ? (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={word} className="inline-block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {word}
            </motion.span>
          </AnimatePresence>
        ) : (
          <>
            {word.slice(0, count)}
            <span className="typewriter-caret ml-0.5 inline-block w-[2px] translate-y-[0.1em] self-center bg-current">&nbsp;</span>
          </>
        )}
      </span>
    </span>
  )
}
