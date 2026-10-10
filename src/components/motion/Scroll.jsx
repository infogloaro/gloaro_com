import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

// Thin gold bar across the top of the viewport that tracks page scroll.
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-[#ffae13] via-[#ffd36e] to-[#1b6fe0]"
    />
  )
}

// Section that scales and fades up as its top edge travels into the viewport.
export function SectionEnter({ children, className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.55'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1])
  const opacity = useTransform(scrollYProgress, [0, 1], [0.35, 1])
  return (
    <motion.div ref={ref} style={reduce ? undefined : { scale, opacity }} className={`origin-top ${className}`}>
      {children}
    </motion.div>
  )
}
