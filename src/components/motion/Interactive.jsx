import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { perspective, spring } from '../../lib/motion'
import { usePointerEffects } from '../../hooks/useMotionEnv'

const interactiveSpring = { stiffness: spring.interactive.stiffness, damping: spring.interactive.damping }

// Pulls its child toward the cursor while hovered. Desktop pointer only.
export function Magnetic({ children, className = '', strength = 0.3 }) {
  const enabled = usePointerEffects()
  const x = useSpring(0, interactiveSpring)
  const y = useSpring(0, interactiveSpring)

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      className={`inline-block ${className}`}
      style={enabled ? { x, y } : undefined}
      onPointerMove={enabled ? handleMove : undefined}
      onPointerLeave={enabled ? reset : undefined}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.div>
  )
}

// Card with cursor-tracked 3D tilt, a spotlight that follows the pointer and
// a conic-gradient border that spins while hovered. `className` styles the
// outer frame (radius, shadow, border colour via its background); `innerClassName`
// styles the surface (background, padding).
export function TiltCard({
  children,
  className = '',
  innerClassName = '',
  max = 7,
  glow = 'rgba(255,174,19,0.22)',
  conic = 'conic-gradient(from 0deg, transparent 0 60%, #ffae13 75%, #1b6fe0 88%, transparent 100%)',
}) {
  const enabled = usePointerEffects()
  const rotateX = useSpring(0, interactiveSpring)
  const rotateY = useSpring(0, interactiveSpring)
  const lightX = useMotionValue(-400)
  const lightY = useMotionValue(-400)

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    rotateY.set(px * max * 2)
    rotateX.set(-py * max * 2)
    lightX.set(event.clientX - rect.left - 150)
    lightY.set(event.clientY - rect.top - 150)
  }
  const reset = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <div className="group/tilt h-full" style={{ perspective }}>
      <motion.div
        onPointerMove={enabled ? handleMove : undefined}
        onPointerLeave={enabled ? reset : undefined}
        whileHover={enabled ? { y: -4 } : undefined}
        transition={spring.interactive}
        style={enabled ? { rotateX, rotateY } : undefined}
        className={`relative h-full overflow-hidden p-px ${className}`}
      >
        <span
          aria-hidden="true"
          style={{ backgroundImage: conic }}
          className="conic-spin pointer-events-none absolute left-1/2 top-1/2 -ml-[125%] -mt-[125%] aspect-square w-[250%] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
        />
        <div className={`relative isolate h-full overflow-hidden rounded-[inherit] ${innerClassName}`}>
          {enabled && (
            <motion.span
              aria-hidden="true"
              style={{ x: lightX, y: lightY, backgroundImage: `radial-gradient(closest-side, ${glow}, transparent)` }}
              className="pointer-events-none absolute left-0 top-0 -z-10 h-[300px] w-[300px] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
            />
          )}
          {children}
        </div>
      </motion.div>
    </div>
  )
}

const formatNumber = (value) => Math.round(value).toLocaleString('en-IN')

// Counts a value like "22+" up from zero with a critically damped spring once
// it scrolls into view. Writes straight to the DOM node, no re-renders.
export function CountUp({ value, className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const match = /^([\d,]+)(.*)$/.exec(value)
  const target = match ? parseInt(match[1].replace(/,/g, ''), 10) : null
  const suffix = match ? match[2] : ''

  useEffect(() => {
    const node = ref.current
    if (!inView || target === null || !node) return undefined
    if (reduce) {
      node.textContent = formatNumber(target)
      return undefined
    }
    const controls = animate(0, target, {
      type: 'spring',
      stiffness: 50,
      damping: 18,
      restDelta: 0.5,
      onUpdate: (latest) => { node.textContent = formatNumber(latest) },
    })
    return () => controls.stop()
  }, [inView, reduce, target])

  if (target === null) return <span className={className}>{value}</span>

  return (
    <span className={`inline-grid tabular-nums ${className}`}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">{value}</span>
      <span aria-hidden="true" className="col-start-1 row-start-1">
        <span ref={ref}>0</span>
        {suffix}
      </span>
    </span>
  )
}
