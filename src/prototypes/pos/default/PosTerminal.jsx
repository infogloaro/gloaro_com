import { Float, RoundedBox } from '@react-three/drei'
import SceneCanvas from '../../core/SceneCanvas'
import { StudioLights } from '../../retail/default/engine/Stage'

function TerminalModel() {
  return (
    <group rotation={[-0.08, -0.34, 0]} position={[0, -0.12, 0]}>
      <RoundedBox args={[1.02, 1.7, 0.22]} radius={0.11} smoothness={8} position={[0, 0.05, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#172b2a" roughness={0.26} metalness={0.23} />
      </RoundedBox>
      <RoundedBox args={[0.88, 1.28, 0.025]} radius={0.055} smoothness={8} position={[0, 0.2, 0.124]}>
        <meshStandardMaterial color="#09231f" roughness={0.2} metalness={0.04} emissive="#061a16" emissiveIntensity={0.7} />
      </RoundedBox>
      <mesh position={[0, 0.76, 0.143]}><planeGeometry args={[0.34, 0.045]} /><meshBasicMaterial color="#69d8a3" /></mesh>
      <mesh position={[0.32, 0.76, 0.143]}><circleGeometry args={[0.025, 24]} /><meshBasicMaterial color="#68e3a5" /></mesh>
      <mesh position={[-0.21, 0.55, 0.143]}><planeGeometry args={[0.22, 0.022]} /><meshBasicMaterial color="#7d9c8c" /></mesh>
      <mesh position={[-0.2, 0.34, 0.143]}><planeGeometry args={[0.39, 0.08]} /><meshBasicMaterial color="#193d31" /></mesh>
      <mesh position={[-0.13, 0.34, 0.148]}><planeGeometry args={[0.17, 0.018]} /><meshBasicMaterial color="#e5f0e7" /></mesh>
      <mesh position={[-0.14, 0.29, 0.148]}><planeGeometry args={[0.19, 0.012]} /><meshBasicMaterial color="#86a294" /></mesh>
      <mesh position={[0.22, 0.34, 0.149]}><planeGeometry args={[0.08, 0.035]} /><meshBasicMaterial color="#f5f8ef" /></mesh>
      <mesh position={[0, 0.04, 0.143]}><planeGeometry args={[0.39, 0.018]} /><meshBasicMaterial color="#315847" /></mesh>
      <mesh position={[-0.23, -0.25, 0.143]}><planeGeometry args={[0.17, 0.018]} /><meshBasicMaterial color="#93aa9b" /></mesh>
      <mesh position={[0.2, -0.25, 0.143]}><planeGeometry args={[0.12, 0.03]} /><meshBasicMaterial color="#f4fbf4" /></mesh>
      <RoundedBox args={[0.68, 0.17, 0.012]} radius={0.025} smoothness={4} position={[0, -0.52, 0.148]}>
        <meshBasicMaterial color="#168460" />
      </RoundedBox>
      <mesh position={[0, -0.52, 0.156]}><planeGeometry args={[0.34, 0.018]} /><meshBasicMaterial color="#effcf3" /></mesh>
      <RoundedBox args={[0.34, 0.25, 0.035]} radius={0.07} smoothness={6} position={[0, -0.76, 0.14]}>
        <meshStandardMaterial color="#213b36" roughness={0.3} metalness={0.15} />
      </RoundedBox>
      <mesh position={[0, -0.76, 0.162]}>
        <circleGeometry args={[0.045, 32]} />
        <meshStandardMaterial color="#5fe4aa" emissive="#27c786" emissiveIntensity={0.8} />
      </mesh>
      <RoundedBox args={[0.08, 0.16, 0.04]} radius={0.025} smoothness={4} position={[0.41, -0.66, 0]}>
        <meshStandardMaterial color="#253a36" roughness={0.34} metalness={0.5} />
      </RoundedBox>

      <Float speed={1.1} rotationIntensity={0.13} floatIntensity={0.13}>
        <group position={[1.07, -0.18, 0.35]} rotation={[0.15, -0.42, -0.2]}>
          <RoundedBox args={[0.62, 0.92, 0.045]} radius={0.07} smoothness={8} castShadow>
            <meshStandardMaterial color="#fffdf7" roughness={0.28} metalness={0.12} />
          </RoundedBox>
          <RoundedBox args={[0.5, 0.79, 0.012]} radius={0.045} smoothness={6} position={[0, 0, 0.029]}>
            <meshStandardMaterial color="#f5f7ef" roughness={0.45} />
          </RoundedBox>
          <RoundedBox args={[0.1, 0.075, 0.008]} radius={0.01} smoothness={3} position={[-0.14, 0.25, 0.04]}>
            <meshStandardMaterial color="#d6a747" metalness={0.8} roughness={0.3} />
          </RoundedBox>
          <mesh position={[0, 0.28, 0.038]}>
            <planeGeometry args={[0.3, 0.05]} />
            <meshBasicMaterial color="#e0efe5" />
          </mesh>
          <mesh position={[0, 0.1, 0.038]}>
            <planeGeometry args={[0.36, 0.015]} />
            <meshBasicMaterial color="#e0e6de" />
          </mesh>
          <mesh position={[0, 0.02, 0.038]}>
            <planeGeometry args={[0.28, 0.015]} />
            <meshBasicMaterial color="#e0e6de" />
          </mesh>
          <mesh position={[0, -0.2, 0.039]}>
            <planeGeometry args={[0.35, 0.1]} />
            <meshBasicMaterial color="#1f8867" />
          </mesh>
          <mesh position={[0, -0.2, 0.05]}><planeGeometry args={[0.24, 0.045]} /><meshBasicMaterial color="#ffffff" /></mesh>
        </group>
      </Float>
    </group>
  )
}

function StaticTerminal() {
  return (
    <div className="cf-static-stage" aria-label="Illustration of a modern point-of-sale terminal and payment card">
      <div className="cf-static-glow" />
      <div className="cf-static-terminal">
        <div className="cf-static-screen">
          <div className="cf-static-brand">counterflow <i /></div>
          <small>GOOD AFTERNOON</small>
          <strong>Ready to<br />check out?</strong>
          <div className="cf-static-product"><span>☕</span><span><b>Filter coffee</b><small>Regular · 1 × ₹ 45</small></span></div>
          <div className="cf-static-total"><span>Total</span><b>₹ 45.00</b></div>
          <div className="cf-static-pay">Tap, insert or scan to pay</div>
        </div>
        <div className="cf-static-button"><i /></div>
      </div>
      <div className="cf-static-card"><span>COUNTERFLOW</span><i /><b>₹ 45</b><small>Tap to pay</small></div>
      <span className="cf-static-badge"><i /> PAYMENT APPROVED</span>
    </div>
  )
}

export default function PosTerminal() {
  return (
    <SceneCanvas
      className="cf-terminal-canvas"
      camera={{ position: [0, 0.25, 5.8], fov: 36 }}
      fallback={<StaticTerminal />}
      style={{ width: '100%', height: '100%' }}
    >
      <StudioLights mood="studio" shadows shadowY={-1.24} shadowScale={7} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 4]} intensity={1.2} color="#fff2df" />
      <TerminalModel />
    </SceneCanvas>
  )
}
