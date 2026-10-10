import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { spring } from '../../lib/motion'
import { usePointerEffects } from '../../hooks/useMotionEnv'

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, summary'
const follow = { stiffness: spring.interactive.stiffness * 1.6, damping: spring.interactive.damping + 6, mass: 0.4 }

function Follower() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const smoothX = useSpring(x, follow)
  const smoothY = useSpring(y, follow)
  const scale = useSpring(1, { stiffness: spring.interactive.stiffness, damping: spring.interactive.damping })
  const opacity = useSpring(0, { stiffness: 300, damping: 30 })

  useEffect(() => {
    const move = (event) => {
      x.set(event.clientX)
      y.set(event.clientY)
      opacity.set(1)
    }
    const over = (event) => scale.set(event.target.closest?.(INTERACTIVE) ? 1.8 : 1)
    const leave = () => opacity.set(0)
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [opacity, scale, x, y])

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: smoothX, y: smoothY, scale, opacity }}
      className="pointer-events-none fixed left-0 top-0 z-[90] -ml-4 -mt-4 h-8 w-8 rounded-full border-2 border-[#ffae13]/70 mix-blend-multiply"
    />
  )
}

// Soft ring that trails the cursor and grows over interactive elements.
// Desktop pointer only; never rendered on touch or with reduced motion.
export default function CursorFollower() {
  const enabled = usePointerEffects()
  return enabled ? <Follower /> : null
}
