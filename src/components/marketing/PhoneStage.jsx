import { useRef } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { spring, transition } from '../../lib/motion'
import { useAmbient, usePointerEffects } from '../../hooks/useMotionEnv'

// Resting pose: turned slightly toward the copy so the phone reads as an
// object in space, not a flat screenshot.
const REST = { x: 3, y: -8 }
const TILT = { x: 8, y: 14 }
const tiltSpring = { stiffness: spring.surface.stiffness, damping: spring.surface.damping }

// CSS-built smartphone. The screen is real DOM (crisp at any size, cheap to
// swap); depth comes from perspective, a lit titanium frame, a glare layer that
// slides with the tilt and a soft floor shadow. Pointer tilt is desktop-only;
// the idle float takes part in the shared ambient budget.
export default function PhoneStage({ label, accent, children }) {
  const ref = useRef(null)
  const pointer = usePointerEffects()
  const floating = useAmbient(ref, { priority: 3, amount: 0.4 })
  const rotateX = useSpring(REST.x, tiltSpring)
  const rotateY = useSpring(REST.y, tiltSpring)
  const glareX = useTransform(rotateY, [REST.y - TILT.y, REST.y + TILT.y], ['-45%', '45%'])

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    rotateY.set(REST.y + ((event.clientX - rect.left) / rect.width - 0.5) * TILT.y * 2)
    rotateX.set(REST.x - ((event.clientY - rect.top) / rect.height - 0.5) * TILT.x * 2)
  }
  const reset = () => {
    rotateX.set(REST.x)
    rotateY.set(REST.y)
  }

  return (
    <div
      ref={ref}
      className="relative mx-auto w-[264px] py-6 sm:w-[292px] xl:w-[312px]"
      style={{ perspective: 1400 }}
      onPointerMove={pointer ? handleMove : undefined}
      onPointerLeave={pointer ? reset : undefined}
    >
      <motion.div
        animate={floating ? { y: [0, -10, 0] } : { y: 0 }}
        transition={floating ? { duration: 6, ease: 'easeInOut', repeat: Infinity } : transition.micro}
      >
        <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }} className="relative aspect-[9/19.5]">
          {/* Frame */}
          <div
            className="absolute inset-0 rounded-[46px] bg-[linear-gradient(145deg,#76839c_0%,#2a3550_22%,#0d1428_50%,#273350_78%,#8090ab_100%)]"
            style={{ boxShadow: `inset 0 0 0 1.5px rgba(255,255,255,0.22), inset 0 0 0 6px #0b1022, 0 60px 90px -40px rgba(0,0,0,0.8), 0 30px 80px -30px ${accent}66` }}
          />
          <span aria-hidden="true" className="absolute -left-[3px] top-[19%] h-[5%] w-[3px] rounded-l-sm bg-[#3a4663]" />
          <span aria-hidden="true" className="absolute -left-[3px] top-[27%] h-[9%] w-[3px] rounded-l-sm bg-[#3a4663]" />
          <span aria-hidden="true" className="absolute -left-[3px] top-[38%] h-[9%] w-[3px] rounded-l-sm bg-[#3a4663]" />
          <span aria-hidden="true" className="absolute -right-[3px] top-[30%] h-[13%] w-[3px] rounded-r-sm bg-[#3a4663]" />

          {/* Screen */}
          <div role="img" aria-label={label} className="absolute inset-[9px] isolate overflow-hidden rounded-[38px] bg-black font-work [transform:translateZ(0)]">
            {children}
            <span aria-hidden="true" className="absolute left-1/2 top-[9px] z-30 h-[26px] w-[90px] -translate-x-1/2 rounded-full bg-black" />
            <motion.span
              aria-hidden="true"
              style={{ x: glareX }}
              className="pointer-events-none absolute -inset-y-4 -left-1/2 z-40 w-[200%] bg-[linear-gradient(112deg,transparent_38%,rgba(255,255,255,0.13)_47%,rgba(255,255,255,0.04)_53%,transparent_60%)]"
            />
          </div>
        </motion.div>
      </motion.div>
      <span aria-hidden="true" className="absolute -bottom-2 left-1/2 h-10 w-[70%] -translate-x-1/2 rounded-[50%] bg-black/55 blur-2xl" />
    </div>
  )
}
