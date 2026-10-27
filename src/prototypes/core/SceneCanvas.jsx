import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import { useState } from 'react'
import { useCapabilities } from './useCapabilities'

/**
 * Shared 3D wrapper. Renders `fallback` (poster / CSS animation) on the 'static' tier,
 * lowers pixel ratio when frame rate drops, and exposes the tier to scene children
 * via the `tier` render-prop argument.
 */
export default function SceneCanvas({ children, fallback = null, camera, className, style, shadows = false }) {
  const caps = useCapabilities()
  const [dpr, setDpr] = useState(caps.dpr)

  if (caps.tier === 'static') return fallback

  return (
    <Canvas
      className={className}
      style={style}
      dpr={dpr}
      shadows={shadows && caps.tier === 'full'}
      camera={camera ?? { position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: caps.tier === 'full', powerPreference: 'high-performance' }}
    >
      <PerformanceMonitor onDecline={() => setDpr((d) => Math.max(1, d - 0.25))} />
      <AdaptiveDpr pixelated />
      {typeof children === 'function' ? children({ tier: caps.tier }) : children}
    </Canvas>
  )
}
