import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

// Friendly full-body robot (big rounded head with a glossy screen face, small
// body, jointed arms and legs) in the logo's palette: white shell, navy joints
// and screen, gold glowing eyes, and the logo's globe as the chest emblem.

const WHITE = '#f5f7fc'
const NAVY = '#14244b'
const GOLD = '#e8b43a'
const SCREEN = '#05091a'
const JUMP_EVERY = 3 // seconds between jumps
const JUMP_LENGTH = 0.75 // seconds a jump takes
const JUMP_HEIGHT = 0.7
const LAUNCH_LENGTH = 0.9 // the bigger jump played on click
const LAUNCH_HEIGHT = 1.3

function useMaterials() {
  return useMemo(
    () => ({
      white: new THREE.MeshStandardMaterial({ color: WHITE, metalness: 0.15, roughness: 0.28 }),
      navy: new THREE.MeshStandardMaterial({ color: NAVY, metalness: 0.55, roughness: 0.35 }),
      gold: new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.7, roughness: 0.25 }),
      goldGlow: new THREE.MeshStandardMaterial({ color: GOLD, emissive: GOLD, emissiveIntensity: 1.1, roughness: 0.3 }),
      screen: new THREE.MeshStandardMaterial({ color: SCREEN, metalness: 0.4, roughness: 0.12 }),
    }),
    [],
  )
}

function Joint({ position, r = 0.12, material }) {
  return (
    <mesh position={position} material={material}>
      <sphereGeometry args={[r, 18, 18]} />
    </mesh>
  )
}

function Arm({ side, m, armRef }) {
  return (
    <group ref={armRef} position={[side * 0.78, 0.35, 0]}>
      <Joint position={[0, 0, 0]} r={0.15} material={m.navy} />
      <mesh position={[0, -0.26, 0]} material={m.white}>
        <capsuleGeometry args={[0.1, 0.3, 6, 12]} />
      </mesh>
      <Joint position={[0, -0.52, 0]} r={0.12} material={m.navy} />
      <mesh position={[0, -0.76, 0]} material={m.white}>
        <capsuleGeometry args={[0.09, 0.28, 6, 12]} />
      </mesh>
      <Joint position={[0, -1.0, 0]} r={0.13} material={m.navy} />
    </group>
  )
}

function Leg({ side, m }) {
  return (
    <group position={[side * 0.32, -0.95, 0]}>
      <Joint position={[0, 0, 0]} r={0.16} material={m.navy} />
      <mesh position={[0, -0.3, 0]} material={m.white}>
        <capsuleGeometry args={[0.13, 0.3, 6, 12]} />
      </mesh>
      {/* Foot: white shoe with a navy toe cap */}
      <RoundedBox args={[0.42, 0.22, 0.6]} radius={0.09} smoothness={4} position={[0, -0.6, 0.1]} material={m.white} />
      <RoundedBox args={[0.42, 0.14, 0.24]} radius={0.06} smoothness={4} position={[0, -0.64, 0.33]} material={m.navy} />
    </group>
  )
}

function Robot({ hovered, animate, launch, onLand }) {
  const m = useMaterials()
  const body = useRef()
  const head = useRef()
  const eyes = useRef()
  const armL = useRef()
  const armR = useRef()
  // Click-triggered jump: remembers which `launch` tick it started for and when.
  const launchRef = useRef({ id: 0, start: 0 })

  useFrame((state, delta) => {
    if (!animate) return
    const t = state.clock.elapsedTime
    if (launch !== launchRef.current.id) launchRef.current = { id: launch, start: t }
    const launching = launch > 0 && t - launchRef.current.start < LAUNCH_LENGTH
    // Head: gentle look-around, and faces the pointer when it's over the button.
    const px = hovered ? state.pointer.x : Math.sin(t * 0.7) * 0.3
    const py = hovered ? state.pointer.y : Math.cos(t * 0.9) * 0.15
    head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, px * 0.45, 4, delta)
    head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, -py * 0.25, 4, delta)
    // Blink about every 4 seconds.
    const phase = t % 4
    eyes.current.scale.y = phase > 3.75 && phase < 3.95 ? 0.1 : 1
    // Jump every 3 seconds: crouch, spring up with arms raised, land with a squash.
    // A click plays the same move bigger, and reports the landing.
    const jump = launching ? (t - launchRef.current.start) / LAUNCH_LENGTH : (t % JUMP_EVERY) / JUMP_LENGTH
    const height = launching ? LAUNCH_HEIGHT : JUMP_HEIGHT
    let y = 0
    let squash = 1
    let arms = 0
    if (jump < 1) {
      if (jump < 0.18) squash = 1 - Math.sin((jump / 0.18) * Math.PI) * 0.16
      else {
        const air = (jump - 0.18) / 0.82
        y = Math.sin(air * Math.PI) * height
        arms = Math.sin(air * Math.PI) * 2.4
        if (launching && air >= 0.97 && !launchRef.current.landed) {
          launchRef.current.landed = true
          onLand?.()
        }
        squash = air < 0.5 ? 1 + Math.sin(air * Math.PI) * 0.08 : 1 - Math.sin((air - 0.5) * 2 * Math.PI) * 0.1
      }
    }
    body.current.position.y = y
    body.current.scale.set(1 / Math.sqrt(squash), squash, 1 / Math.sqrt(squash))
    armL.current.rotation.z = THREE.MathUtils.damp(armL.current.rotation.z, -arms, 10, delta)
    armR.current.rotation.z = THREE.MathUtils.damp(armR.current.rotation.z, arms, 10, delta)
  })

  return (
    <group ref={body}>
      {/* Head */}
      <group ref={head} position={[0, 1.45, 0]}>
        <RoundedBox args={[2.1, 1.55, 1.35]} radius={0.5} smoothness={6} material={m.white} />
        {/* Glossy screen face */}
        <RoundedBox args={[1.8, 1.22, 0.14]} radius={0.4} smoothness={6} position={[0, 0, 0.64]} material={m.screen} />
        {/* Eyes: gold glow with navy pupils */}
        <group ref={eyes} position={[0, 0.08, 0.72]}>
          <mesh position={[-0.42, 0, 0]} material={m.goldGlow}>
            <sphereGeometry args={[0.2, 20, 20]} />
          </mesh>
          <mesh position={[0.42, 0, 0]} material={m.goldGlow}>
            <sphereGeometry args={[0.2, 20, 20]} />
          </mesh>
          <mesh position={[-0.42, 0.02, 0.19]} material={m.navy}>
            <sphereGeometry args={[0.06, 12, 12]} />
          </mesh>
          <mesh position={[0.42, 0.02, 0.19]} material={m.navy}>
            <sphereGeometry args={[0.06, 12, 12]} />
          </mesh>
        </group>
        {/* Mouth and brow ticks */}
        <RoundedBox args={[0.5, 0.06, 0.03]} radius={0.02} smoothness={3} position={[0, -0.38, 0.72]} material={m.goldGlow} />
        <RoundedBox args={[0.2, 0.04, 0.03]} radius={0.015} smoothness={3} position={[-0.5, 0.42, 0.72]} material={m.goldGlow} />
        <RoundedBox args={[0.2, 0.04, 0.03]} radius={0.015} smoothness={3} position={[0.5, 0.42, 0.72]} material={m.goldGlow} />
        {/* Ear caps */}
        <mesh position={[-1.1, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={m.navy}>
          <cylinderGeometry args={[0.36, 0.36, 0.16, 24]} />
        </mesh>
        <mesh position={[1.1, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={m.navy}>
          <cylinderGeometry args={[0.36, 0.36, 0.16, 24]} />
        </mesh>
        {/* Twin antennas */}
        {[-0.6, 0.6].map((x) => (
          <group key={x} position={[x, 0.78, 0]}>
            <mesh position={[0, 0.16, 0]} material={m.navy}>
              <cylinderGeometry args={[0.03, 0.03, 0.32, 8]} />
            </mesh>
            <mesh position={[0, 0.36, 0]} material={m.goldGlow}>
              <sphereGeometry args={[0.07, 12, 12]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Neck */}
      <mesh position={[0, 0.62, 0]} material={m.navy}>
        <cylinderGeometry args={[0.22, 0.26, 0.2, 20]} />
      </mesh>

      {/* Body */}
      <RoundedBox args={[1.25, 1.15, 0.9]} radius={0.35} smoothness={6} material={m.white} />
      {/* Chest emblem: the logo's globe */}
      <group position={[0, 0.05, 0.45]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={m.navy}>
          <cylinderGeometry args={[0.3, 0.3, 0.06, 28]} />
        </mesh>
        <group position={[0, 0, 0.03]}>
          <mesh material={m.navy}>
            <sphereGeometry args={[0.2, 20, 20]} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={m.goldGlow}>
            <torusGeometry args={[0.2, 0.02, 8, 32]} />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]} material={m.goldGlow}>
            <torusGeometry args={[0.2, 0.02, 8, 32]} />
          </mesh>
          <mesh material={m.goldGlow}>
            <torusGeometry args={[0.2, 0.02, 8, 32]} />
          </mesh>
        </group>
      </group>
      {/* Hip belt */}
      <mesh position={[0, -0.6, 0]} material={m.navy}>
        <cylinderGeometry args={[0.42, 0.46, 0.18, 24]} />
      </mesh>

      <Arm side={-1} m={m} armRef={armL} />
      <Arm side={1} m={m} armRef={armR} />
      <Leg side={-1} m={m} />
      <Leg side={1} m={m} />
    </group>
  )
}

// `launch` is a counter: each increment plays one big jump, and `onLand` fires
// the moment that jump touches the ground.
// `cameraZ` / `offsetY` frame the robot: the floating button uses a tall canvas
// with the robot standing at the bottom so its head stays in view mid-jump.
export default function GloaroBot3D({ hovered = false, animate = true, dpr = 1.5, className, launch = 0, onLand, cameraZ = 6, offsetY = -0.25 }) {
  return (
    <Canvas
      className={className}
      dpr={dpr}
      frameloop={animate ? 'always' : 'demand'}
      camera={{ position: [0, 0.3, cameraZ], fov: 36 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 5, 6]} intensity={2.4} />
      <directionalLight position={[-4, 1, 3]} intensity={0.8} color={GOLD} />
      <pointLight position={[0, 2.5, 3]} intensity={1.2} color={GOLD} distance={7} />
      <Float speed={animate ? 2 : 0} rotationIntensity={0} floatIntensity={0.4} floatingRange={[-0.05, 0.05]}>
        <group position={[0, offsetY, 0]}>
          <Robot hovered={hovered} animate={animate} launch={launch} onLand={onLand} />
        </group>
      </Float>
    </Canvas>
  )
}
