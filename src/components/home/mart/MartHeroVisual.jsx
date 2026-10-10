import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ease, viewportOnce } from '../../../lib/motion'
import { useAmbient } from '../../../hooks/useMotionEnv'
import { CANVAS } from './martHeroAssets'
import MarketplacePhoneMockup from './MarketplacePhoneMockup'
import MarketplaceDashboardMockup from './MarketplaceDashboardMockup'
import { devices, featureCards, objects, productLayers, sparkLayers } from './martHeroLayout'
import { CartOrb, FloatingProduct, LocationPin, ShippingBox, Spark } from './FloatingProductAssets'
import FeatureCard from './MarketplaceFeatureCards'
import './martHero.css'

// Scales the fixed design canvas to its container. `fit: 'width'` sizes the
// wrapper's height from the scale (stacked/mobile layouts); `fit: 'contain'`
// fits inside the wrapper's own box and centres the canvas (sticky desktop).
function useCanvasFit(ref, fit) {
  const [layout, setLayout] = useState({ scale: 1, x: 0, y: 0 })

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return undefined
    const measure = () => {
      const { width, height } = element.getBoundingClientRect()
      const byWidth = width / CANVAS.width
      const scale = fit === 'contain' && height > 0 ? Math.min(byWidth, height / CANVAS.height) : byWidth
      const x = fit === 'contain' ? (width - CANVAS.width * scale) / 2 : 0
      const y = fit === 'contain' ? (height - CANVAS.height * scale) / 2 : 0
      setLayout((current) => (Math.abs(current.scale - scale) < 0.001 && current.x === x && current.y === y ? current : { scale, x, y }))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, fit])

  return layout
}

const sceneVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}

const layerVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: ease.entrance } },
}

const layerVariantsStill = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } },
}

function Layer({ left, top, z, variants, className = '', children, style }) {
  return (
    <motion.div variants={variants} className={`mh-layer ${className}`} style={{ left, top, zIndex: z, ...style }}>
      {children}
    </motion.div>
  )
}

function OrbitRings({ compact }) {
  return (
    <>
      <div className="mh-ring-wrap" style={{ left: 116, top: 150, width: 544, height: 544, zIndex: 1, transform: 'rotateX(74deg)' }} aria-hidden="true">
        <div className="mh-ring" style={{ '--mh-duration': '58s' }}>
          <span className="mh-ring-bead" />
        </div>
      </div>
      {!compact && (
        <div className="mh-ring-wrap" style={{ left: 50, top: 96, width: 660, height: 660, zIndex: 1, transform: 'rotateX(70deg) rotateZ(14deg)', opacity: 0.7 }} aria-hidden="true">
          <div className="mh-ring" style={{ '--mh-duration': '84s', '--mh-direction': 'reverse' }}>
            <span className="mh-ring-bead" style={{ width: 10, height: 10, marginTop: -5, right: -5 }} />
          </div>
        </div>
      )}
    </>
  )
}

/**
 * Gloaro Mart hero scene: floating dashboard + phone mockups surrounded by
 * real product imagery, golden orbit rings and glass feature cards.
 *
 * @param {'width'|'contain'} fit  how the canvas sizes to its wrapper
 * @param {boolean} compact        trimmed composition for small screens
 */
export default function MartHeroVisual({ fit = 'width', compact = false, className = '' }) {
  const wrapperRef = useRef(null)
  const sceneRef = useRef(null)
  const reduce = useReducedMotion()
  const live = useAmbient(sceneRef, { priority: 3, amount: 0.2 })
  const { scale, x, y } = useCanvasFit(wrapperRef, fit)
  const variants = reduce ? layerVariantsStill : layerVariants

  const products = compact ? productLayers.filter((layer) => layer.compact) : productLayers
  const cards = compact ? featureCards.filter((card) => card.compact) : featureCards
  const sparks = compact ? sparkLayers.filter((spark) => spark.compact) : sparkLayers

  return (
    <div
      ref={wrapperRef}
      className={`relative min-w-0 overflow-visible ${fit === 'contain' ? 'h-full w-full' : 'w-full'} ${className}`}
      style={fit === 'width' ? { height: Math.round(CANVAS.height * scale) } : undefined}
    >
      <motion.div
        ref={sceneRef}
        className="mh-scene"
        data-live={live}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={sceneVariants}
        style={{ width: CANVAS.width, height: CANVAS.height, transform: `translate(${x}px, ${y}px) scale(${scale})` }}
      >
        <div className="mh-glow" aria-hidden="true" />
        <div className="mh-floor" aria-hidden="true" />
        <OrbitRings compact={compact} />

        <Layer {...devices.dashboard} variants={variants} style={{ perspective: 1400 }}>
          <div className="mh-float-tilt" style={{ '--mh-ry': '-12deg', '--mh-rx': '3deg', '--mh-duration': '9s', '--mh-lift': '-8px' }}>
            <MarketplaceDashboardMockup />
          </div>
        </Layer>

        <Layer {...devices.phone} variants={variants} style={{ perspective: 1400 }}>
          <div className="mh-float-tilt" style={{ '--mh-ry': '8deg', '--mh-rx': '0deg', '--mh-rotate': '-7deg', '--mh-duration': '7.5s', '--mh-delay': '0.6s', '--mh-lift': '-12px' }}>
            <MarketplacePhoneMockup />
          </div>
        </Layer>

        {products.map((layer) => (
          <Layer key={layer.id} left={layer.left} top={layer.top} z={layer.z} variants={variants}>
            <FloatingProduct layer={layer} />
          </Layer>
        ))}

        <Layer {...objects.pin} variants={variants}>
          <LocationPin width={64} />
        </Layer>

        {!compact && (
          <Layer {...objects.box} variants={variants}>
            <ShippingBox width={150} />
          </Layer>
        )}

        {!compact && (
          <Layer {...objects.cart} variants={variants}>
            <CartOrb size={54} />
          </Layer>
        )}

        {cards.map((card) => (
          <Layer key={card.id} left={card.left} top={card.top} z={card.z} variants={variants}>
            <FeatureCard card={card} />
          </Layer>
        ))}

        {sparks.map((spark, index) => <Spark key={index} layer={spark} />)}
      </motion.div>
    </div>
  )
}
