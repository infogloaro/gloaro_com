/* eslint-disable react-refresh/only-export-components -- product definitions pair data with their render functions */
 
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { localT } from '../engine/choreo'

const H = Math.PI / 2

// Top-down outline of a right shoe: toe toward +x, heel toward -x.
function footShape(k = 1) {
  const s = new THREE.Shape()
  s.moveTo(-1.05 * k, 0)
  s.bezierCurveTo(-1.05 * k, 0.34 * k, -0.62 * k, 0.4 * k, -0.15 * k, 0.34 * k)
  s.bezierCurveTo(0.35 * k, 0.29 * k, 0.72 * k, 0.44 * k, 0.98 * k, 0.3 * k)
  s.bezierCurveTo(1.16 * k, 0.18 * k, 1.16 * k, -0.16 * k, 1.0 * k, -0.26 * k)
  s.bezierCurveTo(0.7 * k, -0.4 * k, 0.3 * k, -0.28 * k, -0.15 * k, -0.31 * k)
  s.bezierCurveTo(-0.62 * k, -0.36 * k, -1.05 * k, -0.32 * k, -1.05 * k, 0)
  return s
}

function useSlab(k, depth, bevel) {
  return useMemo(() => {
    const g = new THREE.ExtrudeGeometry(footShape(k), { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 48 })
    g.rotateX(-H)
    return g
  }, [k, depth, bevel])
}

// A hemisphere reshaped into a shoe upper: tall at the heel collar, low over the toe box.
function useUpper() {
  return useMemo(() => {
    const g = new THREE.SphereGeometry(1, 96, 48, 0, Math.PI * 2, 0, Math.PI / 2)
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i)
      const y = p.getY(i)
      const z = p.getZ(i)
      const toe = THREE.MathUtils.smoothstep(x, -0.2, 1)
      const height = THREE.MathUtils.lerp(0.62, 0.3, toe)
      const width = THREE.MathUtils.lerp(0.34, 0.37, toe) * (x < -0.7 ? THREE.MathUtils.lerp(0.82, 1, (x + 1) / 0.3) : 1)
      p.setXYZ(i, x * 1.02, y * height, z * width)
    }
    g.computeVertexNormals()
    return g
  }, [])
}

function Sole({ m }) {
  const geo = useSlab(1, 0.06, 0.02)
  return <mesh geometry={geo} material={m('gum')} position={[0, 0.02, 0]} />
}
function Midsole({ m }) {
  const geo = useSlab(0.985, 0.13, 0.045)
  return (
    <group>
      <mesh geometry={geo} material={m('foam')} position={[0, 0.1, 0]} />
      <mesh material={m('accent')} position={[-0.6, 0.2, 0.345]} rotation-y={0.05}><boxGeometry args={[0.5, 0.025, 0.01]} /></mesh>
    </group>
  )
}
function Insole({ m }) {
  const geo = useSlab(0.9, 0.02, 0.01)
  return <mesh geometry={geo} material={m('insole')} position={[0, 0.29, 0]} />
}
function Upper({ m }) {
  const geo = useUpper()
  return (
    <group position={[0.02, 0.3, 0]}>
      <mesh geometry={geo} material={m('knit')} />
      <mesh material={m('knit')} position={[-0.6, 0.5, 0]} rotation-x={H} scale={[1, 0.62, 1]}><torusGeometry args={[0.24, 0.05, 16, 64]} /></mesh>
      <mesh material={m('lining')} position={[-0.6, 0.505, 0]} rotation-x={-H} scale={[1, 0.62, 1]}><circleGeometry args={[0.23, 48]} /></mesh>
      <mesh material={m('knit')} position={[-0.2, 0.6, 0]} rotation-z={-0.55}><boxGeometry args={[0.5, 0.04, 0.26]} /></mesh>
    </group>
  )
}
function Heel({ m }) {
  return (
    <group position={[-0.86, 0.36, 0]} rotation-y={-H} scale={[1, 1, 0.62]}>
      <mesh material={m('heel')}><cylinderGeometry args={[0.3, 0.33, 0.2, 64, 1, true, -H * 0.8, Math.PI * 0.8]} /></mesh>
    </group>
  )
}

const LACES = [-0.34, -0.2, -0.06, 0.08, 0.22, 0.36]
function Laces({ m, progress }) {
  const refs = useRef([])
  // Each lace lifts, twists and drifts on its own, so the set "unthreads" instead of moving as a block.
  useFrame(() => {
    const t = localT(progress.current, [0.5, 1])
    refs.current.forEach((r, i) => {
      if (!r) return
      r.position.y = 0.0 + t * (0.12 + i * 0.07)
      r.position.x = LACES[i] + t * (i - 2.5) * 0.09
      r.rotation.x = H + t * (i % 2 ? 0.5 : -0.5)
      r.rotation.y = t * (i - 2.5) * 0.18
    })
  })
  return (
    <group position={[0, 0.84, 0]}>
      {LACES.map((x, i) => {
        const y = THREE.MathUtils.lerp(0.09, -0.05, (x + 0.34) / 0.7)
        return (
          <group key={x} position={[0, y, 0]}>
            <mesh ref={(el) => { refs.current[i] = el }} material={m('lace')} position={[x, 0, 0]} rotation-x={H}>
              <capsuleGeometry args={[0.016, 0.3, 6, 12]} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

export const sneaker = {
  id: 'sneaker',
  view: { pos: [2.6, 1.4, 3.4], target: [0, 0.35, 0], fov: 30, minDistance: 2.4, maxDistance: 8, explodedPos: [4.6, 3.2, 6.2], explodedTarget: [0, 1.2, 0] },
  baseRotation: [0, 0.5, 0],
  shadowY: 0,
  materials: {
    gum: { color: '#3a3532', roughness: 0.85 },
    foam: { color: '#f4f2ee', roughness: 0.7, clearcoat: 0.1 },
    insole: { color: '#6c7078', roughness: 0.95 },
    knit: { color: '#e9e6e1', roughness: 0.88, sheen: 1, sheenRoughness: 0.6, sheenColor: '#ffffff' },
    lining: { color: '#2b2d31', roughness: 0.9 },
    heel: { color: '#1f2125', roughness: 0.4, clearcoat: 0.6, side: 2 },
    lace: { color: '#2b2d31', roughness: 0.75 },
    accent: { color: '#2b44ff', roughness: 0.4 },
  },
  parts: [
    { id: 'sole', name: 'Rubber outsole', info: 'Carbon-rubber outsole with a herringbone pattern for grip on wet city streets.', label: [0.7, 0.05, 0.35], window: [0, 1], render: (m) => <Sole m={m} /> },
    { id: 'midsole', name: 'Responsive midsole', info: 'Supercritical foam that returns 82% of energy and stays soft in the cold.', origin: [0, 0.16, 0], label: [0.65, 0.18, 0.35], window: [0.55, 0.95], ex: { p: [0, 0.45, 0] }, render: (m) => <Midsole m={m} /> },
    { id: 'insole', name: 'Contoured insole', info: 'A moulded, removable insole with an arch profile from 4,000 foot scans.', origin: [0, 0.3, 0], label: [0.4, 0.3, 0.2], window: [0.4, 0.85], ex: { p: [0, 1.0, 0] }, render: (m) => <Insole m={m} /> },
    { id: 'upper', name: 'Engineered knit upper', info: 'A single knitted piece: tighter where you need support, open where you need air.', origin: [0, 0.5, 0], label: [0.55, 0.55, 0.25], window: [0.15, 0.7], ex: { p: [0, 1.6, 0] }, render: (m) => <Upper m={m} /> },
    { id: 'heel', name: 'Heel counter', info: 'A thermoformed heel clip that locks your heel without pressing on the Achilles.', origin: [-0.84, 0.42, 0], label: [-0.95, 0.55, 0.15], window: [0.25, 0.75], ex: { p: [-0.55, 1.05, 0], r: [0, 0, 0.25] }, render: (m) => <Heel m={m} /> },
    { id: 'laces', name: 'Recycled laces', info: 'Flat laces from recycled polyester with a grip weave that stays tied.', origin: [0, 0.84, 0], label: [0.1, 0.92, 0], window: [0, 0.6], ex: { p: [0, 1.75, 0] }, render: (m, ctx) => <Laces m={m} progress={ctx.progress} /> },
  ],
}
