/* eslint-disable react-refresh/only-export-components -- product definitions pair data with their render functions */
 
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'

const H = Math.PI / 2

function Gear({ m, r, z, x = 0, y = 0, speed = 1, teeth = 18, mat = 'gold' }) {
  const ref = useRef()
  useFrame((_, d) => { if (ref.current) ref.current.rotation.z += d * speed })
  return (
    <group ref={ref} position={[x, y, z]}>
      <mesh material={m(mat)} rotation-x={H}><cylinderGeometry args={[r, r, 0.02, teeth * 2]} /></mesh>
      {Array.from({ length: teeth }, (_, i) => {
        const a = (i / teeth) * Math.PI * 2
        return <mesh key={i} material={m(mat)} position={[Math.cos(a) * r, Math.sin(a) * r, 0]} rotation-z={a}><boxGeometry args={[0.03, 0.02, 0.02]} /></mesh>
      })}
    </group>
  )
}

function Hands({ m }) {
  const h = useRef()
  const mi = useRef()
  const s = useRef()
  // Shows the visitor's real local time, with a smooth sweeping seconds hand.
  useFrame(() => {
    const d = new Date()
    const sec = d.getSeconds() + d.getMilliseconds() / 1000
    const min = d.getMinutes() + sec / 60
    const hr = (d.getHours() % 12) + min / 60
    if (s.current) s.current.rotation.z = -(sec / 60) * Math.PI * 2
    if (mi.current) mi.current.rotation.z = -(min / 60) * Math.PI * 2
    if (h.current) h.current.rotation.z = -(hr / 12) * Math.PI * 2
  })
  return (
    <group position={[0, 0, 0.1]}>
      <group ref={h}><mesh material={m('hand')} position={[0, 0.13, 0]}><boxGeometry args={[0.035, 0.27, 0.008]} /></mesh></group>
      <group ref={mi}><mesh material={m('hand')} position={[0, 0.2, 0.01]}><boxGeometry args={[0.024, 0.41, 0.008]} /></mesh></group>
      <group ref={s}><mesh material={m('accent')} position={[0, 0.15, 0.02]}><boxGeometry args={[0.008, 0.48, 0.005]} /></mesh></group>
      <mesh material={m('hand')} position={[0, 0, 0.025]} rotation-x={H}><cylinderGeometry args={[0.03, 0.03, 0.02, 24]} /></mesh>
    </group>
  )
}

// Dial faces +z. Components spiral out on orbits around the case and spiral back in.
export const watch = {
  id: 'watch',
  view: { pos: [0.9, 0.5, 3.6], target: [0, 0, 0], fov: 32, minDistance: 2, maxDistance: 8, explodedPos: [1.8, 1.4, 7.6], explodedTarget: [0, 0, 0] },
  baseRotation: [-0.12, -0.3, 0],
  mood: 'precision',
  shadowY: -1.6,
  materials: {
    steel: { color: '#c9ccd2', metalness: 1, roughness: 0.18, clearcoat: 0.6 },
    brushed: { color: '#a7abb3', metalness: 1, roughness: 0.38 },
    dial: { color: '#1c2a4a', roughness: 0.35, metalness: 0.3, clearcoat: 0.8, iridescence: 0.25 },
    index: { color: '#f1f2f4', metalness: 1, roughness: 0.2 },
    hand: { color: '#f4f5f7', metalness: 1, roughness: 0.18 },
    accent: { color: '#ff5a2b', roughness: 0.3, emissive: '#ff5a2b', emissiveIntensity: 0.15 },
    gold: { color: '#d4ae5c', metalness: 1, roughness: 0.28 },
    ruby: { color: '#c3163a', roughness: 0.1, transmission: 0.4, thickness: 0.05 },
    plate: { color: '#d8d4cb', metalness: 0.9, roughness: 0.4 },
    glass: { color: '#ffffff', roughness: 0.02, transmission: 1, thickness: 0.05, ior: 1.77, clearcoat: 1 },
    strap: { color: '#6b4429', roughness: 0.6, clearcoat: 0.2, sheen: 0.4 },
  },
  parts: [
    {
      id: 'case', name: '41 mm steel case', info: '904L stainless steel, polished and brushed by hand, water resistant to 100 m.',
      label: [0.55, 0.4, 0.1], window: [0, 1],
      render: (m) => (
        <group>
          <mesh material={m('steel')} rotation-x={H}><cylinderGeometry args={[0.66, 0.64, 0.2, 96, 1, true]} /></mesh>
          <mesh material={m('brushed')} position={[0, 0, -0.1]} rotation-x={H}><cylinderGeometry args={[0.64, 0.6, 0.03, 96]} /></mesh>
          <mesh material={m('steel')} position={[0, 0, 0.1]}><torusGeometry args={[0.6, 0.05, 24, 128]} /></mesh>
          {[[-0.3, 1], [0.3, 1], [-0.3, -1], [0.3, -1]].map(([x, s], i) => (
            <RoundedBox key={i} args={[0.14, 0.32, 0.12]} radius={0.04} position={[x, s * 0.68, -0.02]} rotation-x={s * 0.25} material={m('steel')} />
          ))}
        </group>
      ),
    },
    {
      id: 'movement', name: 'Automatic movement', info: 'A 28-jewel self-winding calibre with a 70-hour power reserve, visible through the case back.',
      origin: [0, 0, -0.04], label: [-0.32, -0.2, -0.04], window: [0.6, 1], path: 'orbit',
      orbit: { radius: 1.65, a0: Math.PI * 1.1, spin: 2.2, axis: 'z' }, ex: { p: [0, 0, -0.6] },
      render: (m) => (
        <group position={[0, 0, -0.04]}>
          <mesh material={m('plate')} rotation-x={H}><cylinderGeometry args={[0.55, 0.55, 0.04, 96]} /></mesh>
          <Gear m={m} r={0.18} z={0.035} x={-0.15} y={0.12} speed={0.6} />
          <Gear m={m} r={0.12} z={0.035} x={0.18} y={0.05} speed={-0.9} teeth={14} mat="brushed" />
          <Gear m={m} r={0.09} z={0.035} x={0.02} y={-0.22} speed={1.4} teeth={12} />
          <mesh material={m('gold')} position={[0.22, -0.2, 0.04]}><torusGeometry args={[0.1, 0.012, 12, 48]} /></mesh>
          {[[0.3, 0.25], [-0.32, -0.15], [0.05, 0.35]].map(([x, y], i) => <mesh key={i} material={m('ruby')} position={[x, y, 0.035]}><sphereGeometry args={[0.022, 16, 16]} /></mesh>)}
        </group>
      ),
    },
    {
      id: 'dial', name: 'Sunburst dial', info: 'A sunburst-brushed dial with applied, faceted indices that catch light at every angle.',
      origin: [0, 0, 0.05], label: [0.3, -0.3, 0.06], window: [0.45, 0.88], path: 'orbit',
      orbit: { radius: 1.75, a0: Math.PI * 0.15, spin: 1.8, axis: 'z' }, ex: { p: [0, 0, 0.4] },
      render: (m) => (
        <group position={[0, 0, 0.05]}>
          <mesh material={m('dial')} rotation-x={H}><cylinderGeometry args={[0.56, 0.56, 0.02, 96]} /></mesh>
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2
            const big = i % 3 === 0
            return <mesh key={i} material={m('index')} position={[Math.sin(a) * 0.44, Math.cos(a) * 0.44, 0.015]} rotation-z={-a}><boxGeometry args={[big ? 0.035 : 0.022, big ? 0.12 : 0.08, 0.012]} /></mesh>
          })}
        </group>
      ),
    },
    {
      id: 'hands', name: 'Hands', info: 'Skeletonised hour and minute hands with a counter-balanced seconds hand. It is showing your local time.',
      origin: [0, 0, 0.1], label: [0, 0.3, 0.12], window: [0.15, 0.5], ex: { p: [0, 0, 0.9], s: 0 },
      render: (m) => <Hands m={m} />,
    },
    {
      id: 'glass', name: 'Sapphire crystal', info: 'Domed sapphire with anti-reflective coating on the inside, scratch-proof for life.',
      origin: [0, 0, 0.12], label: [-0.35, 0.35, 0.13], window: [0.3, 0.72], path: 'orbit',
      orbit: { radius: 1.6, a0: Math.PI * 0.6, spin: 1.6, axis: 'z' }, ex: { p: [0, 0, 1.0] },
      render: (m) => <mesh material={m('glass')} position={[0, 0, 0.12]} rotation-x={H}><cylinderGeometry args={[0.58, 0.58, 0.035, 96]} /></mesh>,
    },
    {
      id: 'crown', name: 'Screw-down crown', info: 'A screw-down crown with double gaskets. Pull to set the time, wind to top up the power reserve.',
      origin: [0.7, 0, 0], label: [0.78, 0.08, 0], window: [0.5, 0.92], ex: { p: [0.9, 0.2, 0] },
      render: (m) => (
        <group position={[0.7, 0, 0]}>
          <mesh material={m('steel')} rotation-z={H}><cylinderGeometry args={[0.075, 0.075, 0.12, 28]} /></mesh>
          <mesh material={m('brushed')} position={[-0.07, 0, 0]} rotation-z={H}><cylinderGeometry args={[0.04, 0.04, 0.05, 20]} /></mesh>
        </group>
      ),
    },
    {
      id: 'strapTop', name: 'Leather strap', info: 'Vegetable-tanned Italian leather with a quick-release spring bar. No tools needed.',
      origin: [0, 1.2, -0.08], label: [0.2, 1.4, 0], window: [0, 0.35], ex: { p: [0, 0.85, -0.3], r: [-0.3, 0, 0] },
      render: (m) => (
        <group position={[0, 1.2, -0.08]} rotation-x={0.22}>
          <RoundedBox args={[0.46, 1.0, 0.07]} radius={0.03} smoothness={4} material={m('strap')} />
          {[-0.1, 0.1, 0.3].map((y) => <mesh key={y} material={m('brushed')} position={[0, y, 0.04]}><cylinderGeometry args={[0.02, 0.02, 0.01, 12]} /></mesh>)}
        </group>
      ),
    },
    {
      id: 'strapBottom', name: 'Leather strap', info: 'Vegetable-tanned Italian leather with a quick-release spring bar. No tools needed.',
      origin: [0, -1.2, -0.08], label: [0.2, -1.4, 0], window: [0, 0.35], ex: { p: [0, -0.85, -0.3], r: [0.3, 0, 0] },
      render: (m) => (
        <group position={[0, -1.2, -0.08]} rotation-x={-0.22}>
          <RoundedBox args={[0.46, 1.0, 0.07]} radius={0.03} smoothness={4} material={m('strap')} />
          <mesh material={m('steel')} position={[0, -0.42, 0.04]}><torusGeometry args={[0.2, 0.02, 10, 40]} /></mesh>
        </group>
      ),
    },
  ],
}
