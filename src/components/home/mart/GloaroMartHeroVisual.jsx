import { motion, useReducedMotion } from 'framer-motion'
import { viewportOnce } from '../../../lib/motion'
import FloatingProductAssets from './FloatingProductAssets'
import MarketplaceDashboardMockup from './MarketplaceDashboardMockup'
import MarketplaceFeatureCards from './MarketplaceFeatureCards'
import MarketplacePhoneMockup from './MarketplacePhoneMockup'

const scene = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }
// Entrance only; the resting tilt and idle drift are CSS on the inner wrapper.
const device = (from) => ({
  hidden: { opacity: 0, scale: 0.9, ...from },
  show: { opacity: 1, scale: 1, x: 0, y: 0, transition: { type: 'spring', stiffness: 90, damping: 18 } },
})

// Right-hand hero scene for Gloaro Mart: a phone in front of a web dashboard,
// ringed by product photography, a shopping bag, a shipping box, a map pin
// and glass feature chips. All idle motion is CSS so the scene is cheap to
// run; framer-motion only handles the one-off staggered entrance.
export default function GloaroMartHeroVisual({ compact = false, className = '' }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={scene}
      data-reduced={reduce || undefined}
      className={`mart-scene relative isolate w-full ${compact ? 'aspect-[4/5] sm:aspect-[5/4]' : 'aspect-[5/4]'} ${className}`}
      style={{ perspective: 1400 }}
    >
      {/* Ambient light and the two golden orbit rings. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-[-12%] -z-10">
        <div className="mart-glow absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_30%_30%,rgba(11,92,255,0.16),transparent_55%),radial-gradient(ellipse_at_72%_70%,rgba(255,176,0,0.22),transparent_55%)] blur-2xl" />
        <div className="absolute left-1/2 top-[54%] w-[92%] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]" style={{ transform: 'translate(-50%,-50%) rotateX(68deg) rotateZ(-14deg)' }}>
          <div className="mart-orbit aspect-square w-full rounded-full border-[3px] border-transparent [background:linear-gradient(white,white)_padding-box,conic-gradient(from_0deg,transparent_0_20%,#ffb000_45%,#ffd166_55%,transparent_80%)_border-box] opacity-80" />
        </div>
        <div className="absolute left-1/2 top-[60%] w-[64%] -translate-x-1/2 -translate-y-1/2" style={{ transform: 'translate(-50%,-50%) rotateX(68deg) rotateZ(22deg)' }}>
          <div className="mart-orbit aspect-square w-full rounded-full border-[2px] border-transparent opacity-60 [animation-direction:reverse] [animation-duration:80s] [background:linear-gradient(white,white)_padding-box,conic-gradient(from_180deg,transparent_0_30%,#0b5cff_50%,#9ec1ff_60%,transparent_85%)_border-box]" />
        </div>
      </div>

      {!compact && (
        <motion.div variants={device({ x: 60, y: 20 })} className="absolute left-[34%] top-[6%] z-10 w-[66%]">
          <div className="mart-float" style={{ '--dur': '9s', '--dist': '-10px' }}>
            <div style={{ transform: 'rotateY(-14deg) rotateX(4deg)', transformOrigin: 'left center' }}>
              <MarketplaceDashboardMockup />
            </div>
          </div>
        </motion.div>
      )}

      <motion.div variants={device({ y: 60 })} className="absolute left-[27%] top-[2%] z-20 w-[34%]">
        <div className="mart-float" style={{ '--dur': '6.5s', '--dist': '-14px', '--rot': '-6deg' }}>
          <MarketplacePhoneMockup />
        </div>
      </motion.div>

      <FloatingProductAssets compact={compact} />
      <MarketplaceFeatureCards compact={compact} />
    </motion.div>
  )
}
