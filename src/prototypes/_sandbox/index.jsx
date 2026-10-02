import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import SceneCanvas from '../core/SceneCanvas'
import { useScrollProgress } from '../core/useScrollProgress'

function Rig({ progress }) {
  const mesh = useRef()
  useFrame(({ camera }) => {
    const p = progress.current
    camera.position.z = 6 - p * 3
    if (mesh.current) mesh.current.rotation.y = p * Math.PI * 2
  })
  return (
    <mesh ref={mesh}>
      <torusKnotGeometry args={[1, 0.35, 128, 16]} />
      <meshStandardMaterial color="#e0793a" metalness={0.6} roughness={0.25} />
    </mesh>
  )
}

export default function Sandbox() {
  const { triggerRef, progress } = useScrollProgress()
  return (
    <div ref={triggerRef} style={{ height: '400vh', background: '#0b0b0c', color: '#fff' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh' }}>
        <SceneCanvas fallback={<p style={{ padding: 40 }}>Static fallback (no WebGL / reduced motion)</p>}>
          <ambientLight intensity={0.4} />
          <Environment preset="city" />
          <Rig progress={progress} />
        </SceneCanvas>
      </div>
    </div>
  )
}
