import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Line, MeshDistortMaterial, RoundedBox, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import SceneCanvas from '../../../prototypes/core/SceneCanvas'
import SaasEngine, { AnnotationLayer } from './scenes/SaasEngine'
import WebShowcase, { AnnotationLayer as WebAnnotations, StaticAnnotations as WebStaticAnnotations } from './scenes/WebShowcase'

// One 3D hero scene per Gloaro Tech service. Every scene leans gently toward the
// pointer; the 'static' capability tier (reduced motion / no WebGL) gets `fallback`.

const GOLD = '#ffae13'
const NAVY = '#0b2451'

// Tilts its children toward the pointer, eased.
function PointerRig({ children, strength = 0.35 }) {
  const ref = useRef()
  useFrame((state, delta) => {
    const g = ref.current
    if (!g) return
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, state.pointer.x * strength, 3, delta)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * strength * 0.6, 3, delta)
  })
  return <group ref={ref}>{children}</group>
}

function Lights({ accent }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 5, 5]} intensity={1.4} />
      <pointLight position={[-4, -2, 3]} intensity={18} color={accent} />
      <pointLight position={[3, -3, -2]} intensity={10} color={GOLD} />
    </>
  )
}

// Points spread evenly on a sphere (Fibonacci lattice).
function spherePoints(count, radius) {
  const points = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i
    points.push(new THREE.Vector3(Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius))
  }
  return points
}

// --- AI: a glowing neural core inside a network shell with signals travelling the links.
function AiScene({ accent, lite }) {
  const shell = useRef()
  const pulses = useRef([])
  const nodes = useMemo(() => spherePoints(lite ? 36 : 56, 2), [lite])
  const links = useMemo(() => {
    const out = []
    nodes.forEach((a, i) => nodes.forEach((b, j) => { if (j > i && a.distanceTo(b) < 0.95) out.push([a, b]) }))
    return out
  }, [nodes])
  const pulseLinks = useMemo(() => links.filter((_, i) => i % 4 === 0).slice(0, lite ? 10 : 22), [links, lite])
  // All links in one draw call.
  const linkGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(links.flat()), [links])

  useFrame((state, delta) => {
    if (shell.current) shell.current.rotation.y += delta * 0.12
    const t = state.clock.elapsedTime
    pulses.current.forEach((mesh, i) => {
      if (!mesh) return
      const [a, b] = pulseLinks[i]
      mesh.position.lerpVectors(a, b, (t * 0.6 + i * 0.37) % 1)
    })
  })

  return (
    <PointerRig>
      <Float speed={2} floatIntensity={0.6} rotationIntensity={0.3}>
        <mesh>
          <icosahedronGeometry args={[0.95, lite ? 8 : 20]} />
          <MeshDistortMaterial color={accent} emissive={accent} emissiveIntensity={0.55} roughness={0.15} metalness={0.4} distort={0.38} speed={2.2} />
        </mesh>
        <mesh scale={1.25}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color={GOLD} wireframe transparent opacity={0.25} />
        </mesh>
      </Float>
      <group ref={shell}>
        {nodes.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshBasicMaterial color={i % 5 === 0 ? GOLD : '#9cc3ff'} />
          </mesh>
        ))}
        <lineSegments geometry={linkGeometry}>
          <lineBasicMaterial color="#5b8ee6" transparent opacity={0.35} />
        </lineSegments>
        {pulseLinks.map((_, i) => (
          <mesh key={i} ref={(el) => { pulses.current[i] = el }}>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshBasicMaterial color={GOLD} />
          </mesh>
        ))}
      </group>
      <Sparkles count={lite ? 30 : 70} scale={6} size={2.2} speed={0.4} color="#ffd98a" />
    </PointerRig>
  )
}

// A rounded panel with a few flat "UI" blocks on its face.
function Panel({ size = [2.4, 1.6], color = '#ffffff', blocks = [], depth = 0.08, children, ...props }) {
  const [w, h] = size
  return (
    <group {...props}>
      <RoundedBox args={[w, h, depth]} radius={0.06} smoothness={4}>
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.1} />
      </RoundedBox>
      {blocks.map(([x, y, bw, bh, c], i) => (
        <mesh key={i} position={[x, y, depth / 2 + 0.005]}>
          <planeGeometry args={[bw, bh]} />
          <meshBasicMaterial color={c} />
        </mesh>
      ))}
      {children}
    </group>
  )
}

// --- Web (legacy; the page now uses scenes/WebShowcase): layered browser windows.
function WebScene({ accent }) {
  const header = (w, c) => [0, 0.68, w - 0.12, 0.14, c]
  return (
    <PointerRig strength={0.45}>
      <Float speed={1.6} floatIntensity={0.5}>
        <Panel position={[-0.5, 0.25, -0.6]} rotation={[0, 0.35, 0]} blocks={[header(2.4, '#dbe6f7'), [-0.55, 0.15, 1.1, 0.7, '#e7eefb'], [0.6, 0.3, 0.9, 0.14, '#c7d6ef'], [0.6, 0.05, 0.9, 0.1, '#e1e8f5'], [0.6, -0.4, 0.9, 0.3, accent]]} />
      </Float>
      <Float speed={2} floatIntensity={0.7}>
        <Panel position={[0.45, -0.25, 0.4]} rotation={[0, -0.25, 0]} size={[2.6, 1.7]} blocks={[header(2.6, accent), [-0.45, 0.25, 1.4, 0.16, NAVY], [-0.6, 0.0, 1.1, 0.1, '#9fb3d6'], [-0.62, -0.42, 0.9, 0.22, GOLD], [0.72, -0.1, 0.9, 0.95, '#dbe6f7']]} />
      </Float>
      <Float speed={2.6} floatIntensity={1}>
        <mesh position={[1.75, 0.95, 0.9]}>
          <torusGeometry args={[0.32, 0.07, 16, 48, Math.PI * 1.7]} />
          <meshStandardMaterial color="#17a589" emissive="#17a589" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[-1.8, -0.95, 0.8]}>
          <octahedronGeometry args={[0.22]} />
          <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.4} />
        </mesh>
      </Float>
      <Sparkles count={40} scale={6} size={2} speed={0.3} color="#9cc3ff" />
    </PointerRig>
  )
}

// --- Mobile: a phone with app tiles orbiting it.
function MobileScene({ accent }) {
  const orbit = useRef()
  useFrame((_, delta) => { if (orbit.current) orbit.current.rotation.y += delta * 0.5 })
  const tiles = [accent, GOLD, '#1b6fe0', '#d6336c', '#7c5cff', '#17a589']
  return (
    <PointerRig strength={0.5}>
      <Float speed={1.8} floatIntensity={0.5} rotationIntensity={0.2}>
        <group rotation={[0.05, -0.35, 0]}>
          <RoundedBox args={[1.25, 2.5, 0.14]} radius={0.16} smoothness={6}>
            <meshStandardMaterial color="#0b1220" metalness={0.6} roughness={0.25} />
          </RoundedBox>
          <Panel position={[0, 0, 0.075]} size={[1.1, 2.3]} depth={0.01} color="#f5f8ff"
            blocks={[[0, 0.92, 1.0, 0.3, accent], [0, 0.42, 0.95, 0.5, '#dfe8f8'], [-0.25, -0.05, 0.42, 0.3, '#ffe2a6'], [0.25, -0.05, 0.42, 0.3, '#cfe1ff'], [0, -0.45, 0.95, 0.1, '#c7d3e6'], [0, -0.62, 0.7, 0.08, '#dde5f2'], [0, -0.92, 0.9, 0.18, NAVY]]} />
        </group>
      </Float>
      <group ref={orbit}>
        {tiles.map((c, i) => {
          const a = (i / tiles.length) * Math.PI * 2
          return (
            <Float key={i} speed={3} floatIntensity={0.8}>
              <RoundedBox args={[0.38, 0.38, 0.1]} radius={0.09} position={[Math.cos(a) * 1.9, Math.sin(a * 2) * 0.5, Math.sin(a) * 1.9]}>
                <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.25} roughness={0.3} />
              </RoundedBox>
            </Float>
          )
        })}
      </group>
      <Sparkles count={36} scale={5} size={2} speed={0.3} color="#bff5e6" />
    </PointerRig>
  )
}

// --- Custom software: modules that drift apart and click back together.
function SoftwareScene({ accent }) {
  const cubes = useRef([])
  const grid = useMemo(() => {
    const out = []
    for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) out.push(new THREE.Vector3(x, y, z))
    return out
  }, [])
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const spread = 1 + (Math.sin(t * 0.9) * 0.5 + 0.5) * 0.55
    cubes.current.forEach((mesh, i) => {
      if (!mesh) return
      mesh.position.copy(grid[i]).multiplyScalar(0.62 * spread)
      mesh.rotation.x = mesh.rotation.y = (spread - 1) * (i % 2 ? 1 : -1)
    })
  })
  return (
    <PointerRig strength={0.5}>
      <group rotation={[0.5, 0.6, 0]}>
        {grid.map((_, i) => (
          <RoundedBox key={i} ref={(el) => { cubes.current[i] = el }} args={[0.5, 0.5, 0.5]} radius={0.07}>
            <meshStandardMaterial color={i === 13 ? GOLD : i % 3 === 0 ? accent : '#1b6fe0'} metalness={0.3} roughness={0.3} emissive={i === 13 ? GOLD : '#000'} emissiveIntensity={0.4} />
          </RoundedBox>
        ))}
      </group>
      <Sparkles count={40} scale={6} size={2} speed={0.3} color="#9cc3ff" />
    </PointerRig>
  )
}

// --- SaaS (legacy; the page now uses scenes/SaasEngine): stacked layers with tenants.
function SaasScene({ accent }) {
  const layers = useRef([])
  useFrame((state) => {
    const t = state.clock.elapsedTime
    layers.current.forEach((g, i) => { if (g) g.rotation.y = t * (0.25 + i * 0.12) * (i % 2 ? -1 : 1) })
  })
  const colors = [accent, '#1b6fe0', GOLD]
  return (
    <PointerRig>
      <group rotation={[0.45, 0, 0]}>
        {colors.map((c, i) => (
          <group key={i} position={[0, (i - 1) * 0.85, 0]} ref={(el) => { layers.current[i] = el }}>
            <mesh>
              <cylinderGeometry args={[1.7 - i * 0.3, 1.7 - i * 0.3, 0.1, 64]} />
              <meshPhysicalMaterial color={c} transparent opacity={0.55} roughness={0.15} metalness={0.2} clearcoat={1} />
            </mesh>
            {Array.from({ length: 6 - i }, (_, k) => {
              const a = (k / (6 - i)) * Math.PI * 2
              const r = 1.3 - i * 0.3
              return (
                <RoundedBox key={k} args={[0.26, 0.26, 0.26]} radius={0.05} position={[Math.cos(a) * r, 0.2, Math.sin(a) * r]}>
                  <meshStandardMaterial color="#ffffff" emissive={c} emissiveIntensity={0.35} />
                </RoundedBox>
              )
            })}
          </group>
        ))}
      </group>
      <Sparkles count={40} scale={6} size={2} speed={0.3} color="#d6c9ff" />
    </PointerRig>
  )
}

// --- CRM: a funnel of rings with leads flowing down into closed deals.
function CrmScene({ accent, lite }) {
  const leads = useRef([])
  const count = lite ? 14 : 26
  const seeds = useMemo(() => Array.from({ length: count }, (_, i) => ({ a: i * 2.4, off: i / count })), [count])
  useFrame((state) => {
    const t = state.clock.elapsedTime
    leads.current.forEach((mesh, i) => {
      if (!mesh) return
      const p = (t * 0.22 + seeds[i].off) % 1
      const r = 1.6 * (1 - p) + 0.2
      const a = seeds[i].a + t * 1.2
      mesh.position.set(Math.cos(a) * r, 1.5 - p * 3, Math.sin(a) * r)
      mesh.material.color.set(p > 0.8 ? GOLD : '#9cc3ff')
    })
  })
  return (
    <PointerRig>
      <group rotation={[0.35, 0, 0]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[0, 1.4 - i * 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.7 - i * 0.33, 0.05, 16, 80]} />
            <meshStandardMaterial color={i === 4 ? GOLD : accent} emissive={i === 4 ? GOLD : accent} emissiveIntensity={0.45} metalness={0.4} roughness={0.25} />
          </mesh>
        ))}
        {seeds.map((_, i) => (
          <mesh key={i} ref={(el) => { leads.current[i] = el }}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshBasicMaterial color="#9cc3ff" />
          </mesh>
        ))}
      </group>
      <Sparkles count={30} scale={6} size={2} speed={0.3} color="#ffd98a" />
    </PointerRig>
  )
}

// --- UI/UX: design cards fanned in space with a bezier path drawn through them.
function DesignScene({ accent }) {
  const curve = useMemo(() => new THREE.CubicBezierCurve3(new THREE.Vector3(-2, -1, 0.6), new THREE.Vector3(-0.8, 1.8, 0.8), new THREE.Vector3(0.8, -1.8, 0.8), new THREE.Vector3(2, 1, 0.6)).getPoints(60), [])
  const swatches = [accent, '#1b6fe0', '#d6336c', '#17a589', NAVY]
  return (
    <PointerRig strength={0.5}>
      <Float speed={1.5} floatIntensity={0.5}>
        <Panel position={[-0.9, 0.2, -0.4]} rotation={[0, 0.4, -0.06]} size={[1.3, 1.8]} color="#f3f6fb" blocks={[[0, 0.6, 1.1, 0.3, '#d9e1ee'], [0, 0.1, 1.1, 0.5, '#e6ecf5'], [-0.3, -0.45, 0.45, 0.2, '#d9e1ee'], [0.3, -0.45, 0.45, 0.2, '#d9e1ee']]} />
        <Panel position={[0.85, -0.1, 0.3]} rotation={[0, -0.35, 0.05]} size={[1.3, 1.8]} blocks={[[0, 0.6, 1.1, 0.3, accent], [0, 0.1, 1.1, 0.5, '#cfe1ff'], [-0.3, -0.45, 0.45, 0.2, GOLD], [0.3, -0.45, 0.45, 0.2, NAVY]]} />
      </Float>
      <Line points={curve} color={GOLD} lineWidth={2.5} />
      {[curve[0], curve[60]].map((p, i) => (
        <mesh key={i} position={p}><boxGeometry args={[0.16, 0.16, 0.16]} /><meshBasicMaterial color="#ffffff" /></mesh>
      ))}
      {swatches.map((c, i) => (
        <Float key={c} speed={2.5} floatIntensity={1}>
          <mesh position={[-1.6 + i * 0.8, -1.55, 0.9]}>
            <sphereGeometry args={[0.17, 24, 24]} />
            <meshStandardMaterial color={c} roughness={0.2} metalness={0.2} />
          </mesh>
        </Float>
      ))}
      <Sparkles count={36} scale={6} size={2} speed={0.3} color="#ffd98a" />
    </PointerRig>
  )
}

// --- Cloud: a cloud of spheres above server racks, with data packets rising.
function CloudScene({ accent }) {
  const packets = useRef([])
  useFrame((state) => {
    const t = state.clock.elapsedTime
    packets.current.forEach((mesh, i) => {
      if (!mesh) return
      const p = (t * 0.5 + i * 0.21) % 1
      mesh.position.set(-0.9 + (i % 3) * 0.9, -1.05 + p * 1.9, 0.3)
      mesh.material.opacity = 1 - p
    })
  })
  const puffs = [[0, 0.95, 0, 0.75], [-0.75, 0.75, 0.1, 0.55], [0.75, 0.75, 0.1, 0.6], [-0.35, 1.3, -0.1, 0.5], [0.4, 1.25, -0.1, 0.52]]
  return (
    <PointerRig>
      <Float speed={1.4} floatIntensity={0.4}>
        {puffs.map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y + 0.25, z]}>
            <sphereGeometry args={[r, 32, 32]} />
            <meshPhysicalMaterial color="#eaf3ff" roughness={0.4} clearcoat={0.6} emissive={accent} emissiveIntensity={0.08} />
          </mesh>
        ))}
      </Float>
      {[-0.9, 0, 0.9].map((x) => (
        <group key={x} position={[x, -1.45, 0]}>
          <RoundedBox args={[0.7, 0.9, 0.6]} radius={0.05}>
            <meshStandardMaterial color={NAVY} metalness={0.5} roughness={0.3} />
          </RoundedBox>
          {[0.25, 0, -0.25].map((y) => (
            <mesh key={y} position={[0.18, y, 0.31]}>
              <circleGeometry args={[0.035, 12]} />
              <meshBasicMaterial color={y === 0 ? GOLD : '#2ee6a6'} />
            </mesh>
          ))}
        </group>
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={i} ref={(el) => { packets.current[i] = el }}>
          <boxGeometry args={[0.08, 0.08, 0.08]} />
          <meshBasicMaterial color={i % 2 ? GOLD : '#7fe3ff'} transparent />
        </mesh>
      ))}
      <Sparkles count={36} scale={6} size={2} speed={0.3} color="#7fe3ff" />
    </PointerRig>
  )
}

const scenes = { ai: AiScene, web: WebScene, mobile: MobileScene, software: SoftwareScene, saas: SaasScene, crm: CrmScene, design: DesignScene, cloud: CloudScene }

// Scenes that bring their own camera, lighting and annotations. `Static`, when
// given, overlays the poster fallback with the same notes as plain HTML.
const directed = {
  saas: { Scene: SaasEngine, Labels: AnnotationLayer },
  web: { Scene: WebShowcase, Labels: WebAnnotations, Static: WebStaticAnnotations },
}

function DirectedScene({ entry, fallback }) {
  const labels = useRef([])
  const { Scene, Labels, Static } = entry
  return (
    <>
      <SceneCanvas fallback={Static ? <>{fallback}<Static /></> : fallback} shadows className="!absolute inset-0">
        {({ tier }) => <Scene tier={tier} labels={labels} />}
      </SceneCanvas>
      <Labels refs={labels} />
    </>
  )
}

export default function TechScene({ id, accent, fallback }) {
  if (directed[id]) return <DirectedScene entry={directed[id]} fallback={fallback} />
  const Scene = scenes[id] || AiScene
  return (
    <SceneCanvas fallback={fallback} camera={{ position: [0, 0, 6.2], fov: 45 }} className="!absolute inset-0">
      {({ tier }) => (
        <>
          <Lights accent={accent} />
          <Scene accent={accent} lite={tier !== 'full'} />
        </>
      )}
    </SceneCanvas>
  )
}
