/* eslint-disable react-hooks/immutability -- three.js materials, uniforms, lights and the camera are mutated every frame by design. */
import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, MeshTransmissionMaterial, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

// "The SaaS engine": a machined titanium core on a plinth, with three modules
// (data, tenants, gateway) wired to it by inlaid channels. One 9 s loop:
//   0.0–1.6 dormant   light runs once around the core channel
//   1.6–3.2 assembly  cap lifts, glass rises, modules ease outward
//   3.2–5.6 activate  blue light travels each channel; modules wake in turn
//   5.6–7.0 integrate parts settle back, gold accents flash once
//   7.0–9.0 hold      everything eases back to the opening state

const LOOP = 9
const BLUE = '#155EEF'
const GOLD = '#CB9015'

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const ease = (v) => v * v * (3 - 2 * v)
const seg = (t, a, b) => ease(clamp01((t - a) / (b - a)))
const bell = (t, a, b) => Math.sin(Math.PI * clamp01((t - a) / (b - a)))

// Lathe profile for a cylinder with chamfered (machined) top and bottom edges.
function chamferCylinder(r, h, c, segments = 96) {
  const pts = [[0, -h / 2], [r - c, -h / 2], [r, -h / 2 + c], [r, h / 2 - c], [r - c, h / 2], [0, h / 2]]
  return new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), segments)
}

// Fine circuit pattern for the chip, drawn once to a canvas.
function circuitTexture() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const g = canvas.getContext('2d')
  g.fillStyle = '#000'
  g.fillRect(0, 0, size, size)
  g.strokeStyle = '#7fb0ff'
  g.lineWidth = 2
  let seed = 7
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  for (let i = 0; i < 70; i++) {
    let x = 40 + Math.round(rand() * 14) * 31
    let y = 40 + Math.round(rand() * 14) * 31
    g.beginPath()
    g.moveTo(x, y)
    for (let k = 0; k < 3; k++) {
      if (rand() > 0.5) x = Math.min(472, Math.max(40, x + (rand() > 0.5 ? 62 : -62)))
      else y = Math.min(472, Math.max(40, y + (rand() > 0.5 ? 62 : -62)))
      g.lineTo(x, y)
    }
    g.stroke()
    g.fillStyle = '#cfe0ff'
    g.fillRect(x - 4, y - 4, 8, 8)
  }
  g.strokeStyle = '#3d7bff'
  g.lineWidth = 6
  g.strokeRect(14, 14, size - 28, size - 28)
  g.fillStyle = '#9cc3ff'
  g.fillRect(size / 2 - 70, size / 2 - 70, 140, 140)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

// Soft additive glow sprite.
function glowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const g = canvas.getContext('2d')
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.35, 'rgba(255,255,255,0.35)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(canvas)
}

// Inlaid channel: dim gold base, a travelling blue light head and a gold flash.
const channelVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`
const channelFragment = /* glsl */ `
  uniform vec3 uGold; uniform vec3 uBlue;
  uniform float uHead; uniform float uLight; uniform float uFlash;
  varying vec2 vUv;
  void main() {
    float d = vUv.x - uHead;
    float head = exp(-d * d * 900.0) * uLight;
    float trail = smoothstep(-0.18, 0.0, d) * step(d, 0.0) * 0.35 * uLight;
    vec3 col = uGold * (0.4 + uFlash * 1.4) + uBlue * (head * 3.0 + trail);
    gl_FragColor = vec4(col, 1.0);
  }
`

function useChannelMaterial() {
  return useMemo(() => new THREE.ShaderMaterial({
    vertexShader: channelVertex,
    fragmentShader: channelFragment,
    uniforms: {
      uGold: { value: new THREE.Color(GOLD) },
      uBlue: { value: new THREE.Color('#4d8dff') },
      uHead: { value: -1 },
      uLight: { value: 0 },
      uFlash: { value: 0 },
    },
    toneMapped: false,
  }), [])
}

function tubeAlong(points, radius = 0.02) {
  const path = new THREE.CurvePath()
  for (let i = 0; i < points.length - 1; i++) path.add(new THREE.LineCurve3(new THREE.Vector3(...points[i]), new THREE.Vector3(...points[i + 1])))
  return new THREE.TubeGeometry(path, 160, radius, 8, false)
}

function Channel({ points, material }) {
  const geometry = useMemo(() => tubeAlong(points), [points])
  return <mesh geometry={geometry} material={material} />
}

// Materials shared across the scene.
function useMaterials() {
  return useMemo(() => ({
    titanium: new THREE.MeshPhysicalMaterial({ color: '#5a6476', metalness: 1, roughness: 0.3, clearcoat: 0.35, clearcoatRoughness: 0.4 }),
    titaniumDark: new THREE.MeshPhysicalMaterial({ color: '#1c2331', metalness: 1, roughness: 0.52 }),
    anodized: new THREE.MeshPhysicalMaterial({ color: '#0e2a5e', metalness: 0.85, roughness: 0.38, clearcoat: 0.6, clearcoatRoughness: 0.25 }),
    gold: new THREE.MeshPhysicalMaterial({ color: GOLD, metalness: 1, roughness: 0.26, emissive: GOLD, emissiveIntensity: 0 }),
    blueLight: new THREE.MeshBasicMaterial({ color: new THREE.Color(BLUE).multiplyScalar(2.2), toneMapped: false }),
  }), [])
}

function SmokedGlass({ full }) {
  return full ? (
    <MeshTransmissionMaterial samples={6} resolution={512} thickness={0.35} roughness={0.12} transmission={1} ior={1.45} chromaticAberration={0.02} anisotropicBlur={0.1} color="#9fb8e6" attenuationColor="#0a1d40" attenuationDistance={0.9} backside={false} />
  ) : (
    <meshPhysicalMaterial color="#2c4b80" metalness={0.2} roughness={0.12} transparent opacity={0.42} />
  )
}

// Square frame of four thin bars (gold seams, cap inlay).
function Frame({ size, bar = 0.02, height = 0.02, material, ...props }) {
  const h = size / 2
  return (
    <group {...props}>
      <mesh material={material} position={[0, 0, h]}><boxGeometry args={[size + bar, height, bar]} /></mesh>
      <mesh material={material} position={[0, 0, -h]}><boxGeometry args={[size + bar, height, bar]} /></mesh>
      <mesh material={material} position={[h, 0, 0]}><boxGeometry args={[bar, height, size]} /></mesh>
      <mesh material={material} position={[-h, 0, 0]}><boxGeometry args={[bar, height, size]} /></mesh>
    </group>
  )
}

// Module positions on the plinth and the radial direction each slides along.
const MODULES = {
  data: { at: [-1.5, 0, 0.86], dir: [-0.87, 0, 0.5] },
  tenants: { at: [1.5, 0, -0.74], dir: [0.9, 0, -0.44] },
  gateway: { at: [1.1, 0, 1.32], dir: [0.6, 0, 0.8] },
}

// Channel routes (PCB-style right angles) from the core edge to each module.
const Y = 0.016
const ROUTES = {
  ring: [[-1.12, Y, -1.12], [1.12, Y, -1.12], [1.12, Y, 1.12], [-1.12, Y, 1.12], [-1.12, Y, -1.12]],
  data: [[-1.12, Y, 0.35], [-1.24, Y, 0.35], [-1.24, Y, 0.86], [-1.1, Y, 0.86]],
  tenants: [[1.12, Y, -0.35], [1.2, Y, -0.35], [1.2, Y, -0.74], [1.27, Y, -0.74]],
  gateway: [[0.45, Y, 1.12], [0.45, Y, 1.32], [0.63, Y, 1.32]],
}

function Engine({ full, anchors }) {
  const m = useMaterials()
  const chip = useMemo(() => circuitTexture(), [])
  const glow = useMemo(() => glowTexture(), [])
  const ring = useChannelMaterial()
  const channels = { data: useChannelMaterial(), tenants: useChannelMaterial(), gateway: useChannelMaterial() }
  const plinthTop = useMemo(() => chamferCylinder(2.45, 0.22, 0.05), [])
  const plinthStep = useMemo(() => chamferCylinder(2.62, 0.1, 0.03), [])
  const cell = useMemo(() => chamferCylinder(0.28, 0.15, 0.025, 64), [])

  const cap = useRef()
  const glass = useRef()
  const chipMat = useRef()
  const chipGlow = useRef()
  const dataRef = useRef()
  const tenantsRef = useRef()
  const gatewayRef = useRef()
  const slots = useRef([])
  const cellRings = useRef([])
  const gatewayDots = useRef([])
  const groove = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime % LOOP
    const assemble = seg(t, 1.6, 3.2) * (1 - seg(t, 5.6, 7.0))
    const flash = bell(t, 6.1, 7.3)

    if (cap.current) cap.current.position.y = 0.8 + 0.34 * assemble
    if (glass.current) glass.current.position.y = 0.5 + 0.12 * assemble

    // Phase 1: one lap of light round the core channel.
    ring.uniforms.uHead.value = seg(t, 0.15, 1.75) * 1.1
    ring.uniforms.uLight.value = bell(t, 0.1, 1.85)
    ring.uniforms.uFlash.value = flash

    // Modules: staggered outward slide, then settle; channel light; wake-up.
    let woke = 0
    Object.entries(MODULES).forEach(([key, { at, dir }], i) => {
      const out = seg(t, 1.7 + i * 0.18, 3.1 + i * 0.18) * (1 - seg(t, 5.6 + i * 0.12, 6.9 + i * 0.12))
      const g = { data: dataRef, tenants: tenantsRef, gateway: gatewayRef }[key].current
      if (g) g.position.set(at[0] + dir[0] * 0.3 * out, 0, at[2] + dir[2] * 0.3 * out)
      const c = channels[key].uniforms
      c.uHead.value = seg(t, 3.2 + i * 0.45, 4.25 + i * 0.45) * 1.12
      c.uLight.value = bell(t, 3.1 + i * 0.45, 4.45 + i * 0.45)
      c.uFlash.value = flash
      woke += seg(t, 4.1 + i * 0.45, 4.5 + i * 0.45) * (1 - seg(t, 7.3, 8.8))
    })
    const awake = (i) => seg(t, 4.1 + i * 0.45, 4.5 + i * 0.45) * (1 - seg(t, 7.3, 8.8))

    // Data cells light bottom to top; tenant slots one by one; gateway dots.
    cellRings.current.forEach((mesh, k) => { if (mesh) mesh.material.opacity = 0.15 + 0.85 * awake(0) * seg(t, 4.1 + k * 0.12, 4.4 + k * 0.12) })
    slots.current.forEach((mesh, k) => { if (mesh) mesh.material.opacity = 0.12 + 0.88 * awake(1) * seg(t, 4.55 + k * 0.15, 4.85 + k * 0.15) })
    gatewayDots.current.forEach((mesh, k) => { if (mesh) mesh.material.opacity = 0.15 + 0.85 * awake(2) * seg(t, 5.0 + k * 0.08, 5.2 + k * 0.08) })

    // Chip breathes with the system; gold inlays flash on integration.
    const energy = 0.55 + 0.25 * bell(t, 0.1, 1.85) + 0.5 * (woke / 3)
    if (chipMat.current) chipMat.current.color.setScalar(energy * 1.6)
    if (chipGlow.current) chipGlow.current.material.opacity = 0.18 + 0.3 * (woke / 3)
    m.gold.emissiveIntensity = flash * 0.9
    if (groove.current) groove.current.material.opacity = 0.25 + 0.2 * (woke / 3)
  })

  return (
    <group position={[0, -0.25, 0]}>
      {/* Plinth: stepped, chamfered titanium with a thin lit groove. */}
      <mesh geometry={plinthStep} material={m.anodized} position={[0, -0.27, 0]} receiveShadow />
      <mesh geometry={plinthTop} material={m.titaniumDark} position={[0, -0.11, 0]} receiveShadow castShadow />
      <mesh ref={groove} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[2.26, 2.272, 160]} />
        <meshBasicMaterial color={new THREE.Color(BLUE).multiplyScalar(1.6)} transparent opacity={0.3} toneMapped={false} />
      </mesh>

      <Channel points={ROUTES.ring} material={ring} />
      {['data', 'tenants', 'gateway'].map((key) => <Channel key={key} points={ROUTES[key]} material={channels[key]} />)}

      {/* Core */}
      <RoundedBox args={[2.1, 0.3, 2.1]} radius={0.05} smoothness={4} position={[0, 0.15, 0]} material={m.titanium} castShadow receiveShadow />
      <Frame size={2.12} bar={0.018} height={0.02} material={m.gold} position={[0, 0.305, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.31, 0]}>
        <planeGeometry args={[1.6, 1.6]} />
        <meshBasicMaterial ref={chipMat} map={chip} toneMapped={false} />
      </mesh>
      <mesh ref={chipGlow} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.33, 0]}>
        <planeGeometry args={[3.2, 3.2]} />
        <meshBasicMaterial map={glow} color={BLUE} transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <group ref={glass} position={[0, 0.5, 0]}>
        <RoundedBox args={[1.86, 0.34, 1.86]} radius={0.04} smoothness={4}>
          <SmokedGlass full={full} />
        </RoundedBox>
      </group>
      <group ref={cap} position={[0, 0.8, 0]}>
        <RoundedBox args={[1.5, 0.24, 1.5]} radius={0.05} smoothness={4} material={m.titanium} castShadow />
        <RoundedBox args={[0.9, 0.05, 0.9]} radius={0.02} position={[0, 0.12, 0]} material={m.anodized} />
        <Frame size={1.18} bar={0.016} height={0.012} material={m.gold} position={[0, 0.125, 0]} />
        <mesh position={[0, 0.148, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
          <ringGeometry args={[0.13, 0.16, 4]} />
          <meshBasicMaterial color={new THREE.Color(BLUE).multiplyScalar(2)} toneMapped={false} />
        </mesh>
        {/* Machined side grooves */}
        {[-0.05, 0.05].map((y) => <Frame key={y} size={1.505} bar={0.006} height={0.006} material={m.titaniumDark} position={[0, y, 0]} />)}
      </group>

      {/* Data vault: three machined cells with lit seams. */}
      <group ref={dataRef} position={MODULES.data.at}>
        <RoundedBox args={[0.82, 0.08, 0.82]} radius={0.025} position={[0, 0.04, 0]} material={m.anodized} castShadow receiveShadow />
        {[0, 1, 2].map((k) => (
          <group key={k} position={[0, 0.17 + k * 0.17, 0]}>
            <mesh geometry={cell} material={m.titanium} castShadow />
            <mesh ref={(el) => { cellRings.current[k] = el }} position={[0, 0.082, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.2, 0.235, 64]} />
              <meshBasicMaterial color={new THREE.Color(BLUE).multiplyScalar(2)} transparent opacity={0.15} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Tenant module: smoked glass block with three isolated, lit slots. */}
      <group ref={tenantsRef} position={MODULES.tenants.at}>
        <RoundedBox args={[0.5, 0.08, 1.0]} radius={0.025} position={[0, 0.04, 0]} material={m.titanium} castShadow receiveShadow />
        <RoundedBox args={[0.42, 0.78, 0.92]} radius={0.04} smoothness={4} position={[0, 0.48, 0]}>
          <SmokedGlass full={full} />
        </RoundedBox>
        {[-0.28, 0, 0.28].map((z, k) => (
          <mesh key={z} ref={(el) => { slots.current[k] = el }} position={[0, 0.48, z]}>
            <boxGeometry args={[0.06, 0.56, 0.12]} />
            <meshBasicMaterial color={new THREE.Color(BLUE).multiplyScalar(2.2)} transparent opacity={0.12} toneMapped={false} />
          </mesh>
        ))}
        <RoundedBox args={[0.46, 0.05, 0.96]} radius={0.02} position={[0, 0.9, 0]} material={m.titanium} />
      </group>

      {/* Gateway: low titanium interface block with a gold contact strip. */}
      <group ref={gatewayRef} position={MODULES.gateway.at}>
        <RoundedBox args={[0.95, 0.22, 0.52]} radius={0.04} smoothness={4} position={[0, 0.11, 0]} material={m.titanium} castShadow receiveShadow />
        <mesh material={m.gold} position={[0, 0.226, -0.12]}><boxGeometry args={[0.78, 0.012, 0.05]} /></mesh>
        {[-0.3, -0.15, 0, 0.15, 0.3].map((x, k) => (
          <mesh key={x} ref={(el) => { gatewayDots.current[k] = el }} position={[x, 0.224, 0.09]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.025, 20]} />
            <meshBasicMaterial color={new THREE.Color(BLUE).multiplyScalar(2.2)} transparent opacity={0.15} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {ANNOTATIONS.map((a, i) => <group key={a.label} ref={(el) => { anchors.current[i] = el }} position={a.position} />)}
    </group>
  )
}

// Two labels tied to points on the object by thin leader lines. They are plain
// DOM rendered beside the canvas; Projector moves them to the projected anchors.
const ANNOTATIONS = [
  { position: [0.1, 1.05, 0], label: 'MVP core', text: 'A focused product foundation', dx: -36, dy: -86 },
  { position: [1.42, 0.22, 1.34], label: 'Platform scale', text: 'Architecture built to grow', dx: 10, dy: 64 },
]

export function AnnotationLayer({ refs }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {ANNOTATIONS.map(({ label, text, dx, dy }, i) => (
        <div key={label} ref={(el) => { refs.current[i] = el }} className="absolute left-0 top-0 opacity-0 transition-opacity duration-700">
          <span className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-[#CB9015] shadow-[0_0_8px_#CB9015]" />
          <svg className="absolute left-0 top-0 overflow-visible" width="1" height="1">
            <polyline points={`0,0 0,${dy} ${dx},${dy}`} fill="none" stroke="rgba(203,144,21,0.7)" strokeWidth="1" />
          </svg>
          <div
            data-label
            className="absolute whitespace-nowrap rounded-md border border-white/10 bg-[#06142D]/80 px-2.5 py-1.5 backdrop-blur-sm"
            style={{ top: dy, left: dx, transform: `translate(${dx < 0 ? '-100%' : '0'}, -50%)` }}
          >
            <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e2b04a]">{label}</p>
            <p className="mt-0.5 text-[11px] font-medium text-white/80">{text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

const projected = new THREE.Vector3()
function Projector({ anchors, labels }) {
  useFrame(({ camera, size }) => {
    anchors.current.forEach((anchor, i) => {
      const el = labels?.current[i]
      if (!anchor || !el) return
      anchor.getWorldPosition(projected).project(camera)
      const x = (projected.x * 0.5 + 0.5) * size.width
      const y = (-projected.y * 0.5 + 0.5) * size.height
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      el.style.opacity = '1'
      // Keep the label box inside the frame on narrow screens: prefer its
      // designed side, flip or nudge when it would overflow.
      const box = el.querySelector('[data-label]')
      const w = box.offsetWidth
      const { dx } = ANNOTATIONS[i]
      let left = dx < 0 ? x + dx - w : x + dx
      if (left < 8) left = Math.min(8, size.width - 8 - w)
      if (left + w > size.width - 8) left = Math.max(8, size.width - 8 - w)
      box.style.left = `${(left - x).toFixed(1)}px`
      box.style.transform = 'translate(0, -50%)'
    })
  })
  return null
}

// Restrained pointer parallax: a few degrees of camera orbit, key light follows.
function Rig({ children, keyLight }) {
  const group = useRef()
  useFrame((state, delta) => {
    const { x, y } = state.pointer
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, x * 0.1, 2.5, delta)
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -y * 0.04, 2.5, delta)
    }
    if (keyLight.current) keyLight.current.position.x = THREE.MathUtils.damp(keyLight.current.position.x, -3 + x * 1.2, 2, delta)
  })
  return <group ref={group}>{children}</group>
}

function CameraSetup() {
  const { camera, size } = useThree()
  useLayoutEffect(() => {
    // Three-quarter, slightly elevated product view; pull back on narrow frames.
    const far = size.width < 520 ? 1.36 : 1.16
    camera.position.set(5.6 * far, 4.3 * far, 6.4 * far)
    camera.fov = 28
    camera.lookAt(-0.25, size.width < 520 ? 0.2 : -0.05, 0)
    camera.updateProjectionMatrix()
  }, [camera, size.width])
  return null
}

export default function SaasEngine({ tier, labels }) {
  const full = tier === 'full'
  const keyLight = useRef()
  const anchors = useRef([])
  return (
    <>
      <CameraSetup />
      <ambientLight intensity={0.15} />
      {/* Key: large soft cool-blue; rim: narrow neutral; accent: small warm gold. */}
      <directionalLight ref={keyLight} position={[-3, 6, 4]} intensity={1.6} color="#a9c4ff" castShadow={full} shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} />
      <directionalLight position={[4, 2.5, -5]} intensity={2.2} color="#ffffff" />
      <pointLight position={[2.6, 0.9, 2.4]} intensity={4} distance={6} color="#e8b04a" />
      <pointLight position={[0, 0.45, 0]} intensity={2.5} distance={3} color={BLUE} />
      <Environment resolution={full ? 256 : 64} background={false} environmentIntensity={0.85}>
        <Lightformer form="rect" intensity={5} color="#8fb2ff" position={[-4, 5, 3]} scale={[8, 5, 1]} />
        <Lightformer form="rect" intensity={0.45} color="#c9d8ff" position={[0, 8, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
        <Lightformer form="rect" intensity={3.5} color="#a8c0ff" position={[-6, 5, -7]} scale={[9, 4, 1]} />
        <Lightformer form="rect" intensity={8} color="#ffffff" position={[5, 2, -4]} scale={[0.6, 6, 1]} />
        <Lightformer form="rect" intensity={3} color="#e8b04a" position={[4, -1, 4]} scale={[2, 1, 1]} />
        <Lightformer form="ring" intensity={0.6} color="#155EEF" position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={4} />
      </Environment>
      <Rig keyLight={keyLight}>
        <Engine full={full} anchors={anchors} />
      </Rig>
      <Projector anchors={anchors} labels={labels} />
      <ContactShadows position={[0, -0.58, 0]} opacity={0.7} scale={9} blur={2.6} far={1.2} frames={1} color="#000814" />
    </>
  )
}
