import { useEffect, useRef, useState } from 'react'
import { OrbitControls } from '@react-three/drei'
import SceneCanvas from '../../core/SceneCanvas'
import ProductModel from './engine/ProductModel'
import { StudioLights } from './engine/Stage'
import { MODELS } from './models'

// Dev/capture view: ?lab=<model>&x=<explode 0..1>&bg=0 renders one product alone.
export default function Lab({ id, explode = 0, transparent = false }) {
  const def = MODELS[id]
  const progress = useRef(explode)
  const [x, setX] = useState(explode)
  useEffect(() => { progress.current = x }, [x])
  if (!def) return <p>Unknown model {id}</p>
  return (
    <div style={{ position: 'fixed', inset: 0, background: transparent ? 'transparent' : '#f3f4f6' }}>
      <SceneCanvas camera={{ position: x > 0.5 ? def.view.explodedPos : def.view.pos, fov: def.view.fov }}>
        <StudioLights mood={def.mood} shadowY={def.shadowY ?? -0.6} />
        <ProductModel def={def} colors={def.variants?.[0]?.colors} progress={progress} />
        <OrbitControls target={x > 0.5 ? def.view.explodedTarget || def.view.target : def.view.target} />
      </SceneCanvas>
      {!transparent && <input type="range" min="0" max="1" step="0.01" value={x} onChange={(e) => setX(Number(e.target.value))} style={{ position: 'fixed', bottom: 20, left: 20, width: 300 }} />}
    </div>
  )
}
