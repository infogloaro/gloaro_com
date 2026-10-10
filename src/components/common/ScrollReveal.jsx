import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useInViewOnce } from '../../hooks/useInViewOnce'

const EASE = [0.22, 1, 0.36, 1]

export function Reveal({ children, className = '', delay = 0, y = 36 }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: EASE, delay: delay / 1000 }}
    >
      {children}
    </motion.div>
  )
}

export function Stagger({ children, className = '', gap = 0.08, delay = 0 }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '', y = 32 }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y, scale: 0.97 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  )
}

// Animates a number ("22+") from 0 once it scrolls into view.
export function CountUpStat({ value, className = '' }) {
  const match = /^([\d,]+)(.*)$/.exec(value)
  const numeric = match ? parseInt(match[1].replace(/,/g, ''), 10) : null
  const suffix = match ? match[2] : ''
  const [ref, inView] = useInViewOnce(0.4)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView || numeric === null) return undefined
    const totalSteps = Math.max(1, Math.round(1400 / 16))
    let step = 0
    const timer = window.setInterval(() => {
      step += 1
      const next = Math.min(Math.round((numeric / totalSteps) * step), numeric)
      setDisplay(next)
      if (next >= numeric) window.clearInterval(timer)
    }, 16)
    return () => window.clearInterval(timer)
  }, [inView, numeric])

  return (
    <p ref={ref} className={className}>
      {numeric === null ? value : `${display.toLocaleString('en-IN')}${suffix}`}
    </p>
  )
}
