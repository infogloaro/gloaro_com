/* eslint-disable react-refresh/only-export-components -- product definitions pair data with their render functions */
import { RoundedBox } from '@react-three/drei'

const H = Math.PI / 2

function Ribbed({ m, z, r, w, count = 48 }) {
  return (
    <group position={[0, 0, z]}>
      <mesh material={m('darkmetal')} rotation-x={H}><cylinderGeometry args={[r, r, w, 96]} /></mesh>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2
        return (
          <mesh key={i} material={m('rubber')} position={[Math.cos(a) * (r + 0.006), Math.sin(a) * (r + 0.006), 0]} rotation-z={a}>
            <boxGeometry args={[0.012, 0.02, w * 0.9]} />
          </mesh>
        )
      })}
    </group>
  )
}

// Mirrorless camera: the lens points at +z (toward the viewer), the grip is on the viewer's left.
export const camera = {
  id: 'camera',
  view: { pos: [2.6, 1.1, 4.4], target: [0, 0.05, 0], fov: 30, minDistance: 2.6, maxDistance: 9, explodedPos: [5.6, 2.6, 5.6], explodedTarget: [0, 0.2, 0] },
  baseRotation: [0, -0.35, 0],
  materials: {
    body: { color: '#2a2c30', roughness: 0.48, metalness: 0.15, clearcoat: 0.35, clearcoatRoughness: 0.45 },
    rubber: { color: '#1a1b1e', roughness: 0.92 },
    metal: { color: '#c3c7ce', metalness: 1, roughness: 0.26 },
    darkmetal: { color: '#3b3e44', metalness: 0.85, roughness: 0.34 },
    glass: { color: '#a9b8ff', roughness: 0.04, metalness: 0, transmission: 0.55, thickness: 0.4, ior: 1.6, clearcoat: 1, iridescence: 0.7, iridescenceIOR: 1.4 },
    sensor: { color: '#6d5bff', metalness: 0.85, roughness: 0.12, iridescence: 1, iridescenceIOR: 1.7, clearcoat: 1 },
    screen: { color: '#0d1220', roughness: 0.12, clearcoat: 1, emissive: '#ffffff', emissiveIntensity: 0.85, emissiveMap: 'camera' },
    pcb: { color: '#1e3a5f', roughness: 0.55, metalness: 0.2 },
    chip: { color: '#121316', roughness: 0.35, metalness: 0.3 },
    gold: { color: '#caa552', metalness: 1, roughness: 0.3 },
    battery: { color: '#2f3238', roughness: 0.45, clearcoat: 0.4 },
    accent: { color: '#2b44ff', roughness: 0.35, emissive: '#2b44ff', emissiveIntensity: 0.2 },
  },
  parts: [
    {
      id: 'body', name: 'Magnesium body', info: 'A weather-sealed magnesium-alloy shell that holds everything else in perfect alignment.',
      label: [0.45, 0.42, 0.1], window: [0, 1],
      render: (m) => (
        <group>
          <RoundedBox args={[1.4, 0.8, 0.34]} radius={0.06} smoothness={6} material={m('body')} />
          <RoundedBox args={[1.44, 0.14, 0.38]} radius={0.05} smoothness={4} position={[0, 0.42, 0]} material={m('darkmetal')} />
          <RoundedBox args={[0.44, 0.22, 0.42]} radius={0.06} smoothness={4} position={[0.06, 0.55, -0.02]} material={m('darkmetal')} />
          <mesh material={m('metal')} position={[0, 0, 0.175]} rotation-x={H}><cylinderGeometry args={[0.34, 0.34, 0.02, 96]} /></mesh>
          <mesh material={m('accent')} position={[0.58, 0.3, 0.172]}><boxGeometry args={[0.1, 0.012, 0.004]} /></mesh>
        </group>
      ),
    },
    {
      id: 'grip', name: 'Sculpted grip', info: 'Deep, textured grip shaped around a full hand, so heavier lenses stay balanced.',
      origin: [-0.58, 0, 0.12], label: [-0.66, 0.2, 0.3], window: [0.22, 0.6], ex: { p: [-0.95, 0.2, 0.25], r: [0, 0.4, 0] },
      render: (m) => <RoundedBox args={[0.34, 0.78, 0.34]} radius={0.12} smoothness={8} position={[-0.58, -0.01, 0.12]} material={m('rubber')} />,
    },
    {
      id: 'lens', name: '24–70 mm f/2.8 lens', info: 'Sixteen elements in twelve groups, with a nano-coated front element against flare.',
      origin: [0, 0, 0.48], label: [0, 0.32, 0.78], window: [0, 0.45], ex: { p: [0, 0, 1.75] },
      render: (m) => (
        <group>
          <mesh material={m('body')} position={[0, 0, 0.48]} rotation-x={H}><cylinderGeometry args={[0.3, 0.32, 0.6, 96]} /></mesh>
          <mesh material={m('darkmetal')} position={[0, 0, 0.8]} rotation-x={H}><cylinderGeometry args={[0.33, 0.3, 0.06, 96]} /></mesh>
          <mesh material={m('glass')} position={[0, 0, 0.82]} scale={[1, 1, 0.25]}><sphereGeometry args={[0.26, 64, 32]} /></mesh>
          <mesh material={m('accent')} position={[0, 0, 0.74]}><torusGeometry args={[0.322, 0.005, 8, 128]} /></mesh>
        </group>
      ),
    },
    {
      id: 'rings', name: 'Focus & zoom rings', info: 'Two damped control rings with a precise, consistent throw for smooth focus pulls.',
      origin: [0, 0, 0.5], label: [0.36, -0.1, 0.62], window: [0.08, 0.5], ex: { p: [0.0, 0.0, 1.05], r: [0, 0, 0.9] },
      render: (m) => (
        <group>
          <Ribbed m={m} z={0.36} r={0.32} w={0.09} />
          <Ribbed m={m} z={0.62} r={0.325} w={0.12} />
        </group>
      ),
    },
    {
      id: 'sensor', name: '45 MP full-frame sensor', info: 'A back-illuminated stacked sensor that reads out fast enough to all but remove rolling shutter.',
      origin: [0, 0, 0.09], label: [0.24, 0.18, 0.1], window: [0.2, 0.62], ex: { p: [0, 0.05, -0.85] },
      render: (m) => (
        <group position={[0, 0, 0.09]}>
          <mesh material={m('chip')}><boxGeometry args={[0.5, 0.38, 0.03]} /></mesh>
          <mesh material={m('sensor')} position={[0, 0, 0.018]}><boxGeometry args={[0.36, 0.24, 0.006]} /></mesh>
          <mesh material={m('gold')} position={[0, -0.21, 0]}><boxGeometry args={[0.4, 0.03, 0.02]} /></mesh>
        </group>
      ),
    },
    {
      id: 'internals', name: 'Dual image processor', info: 'Two processors split capture and display work, for 30 fps bursts with a live viewfinder.',
      origin: [0.1, 0, -0.04], label: [0.4, 0.2, -0.04], window: [0.3, 0.7], ex: { p: [0.1, 1.15, -0.4] },
      render: (m) => (
        <group position={[0.1, 0, -0.04]}>
          <mesh material={m('pcb')}><boxGeometry args={[1.0, 0.62, 0.02]} /></mesh>
          {[[-0.25, 0.1], [0.12, 0.12], [0.32, -0.12], [-0.05, -0.15]].map(([x, y], i) => (
            <mesh key={i} material={m('chip')} position={[x, y, 0.02]}><boxGeometry args={[i < 2 ? 0.18 : 0.1, i < 2 ? 0.18 : 0.08, 0.025]} /></mesh>
          ))}
          <mesh material={m('gold')} position={[-0.42, -0.24, 0.015]}><boxGeometry args={[0.1, 0.06, 0.012]} /></mesh>
        </group>
      ),
    },
    {
      id: 'display', name: '3.2" vari-angle display', info: 'A 2.1-million-dot touchscreen that tilts and flips for low angles, video and selfies.',
      origin: [0.08, -0.02, -0.2], label: [0.5, 0.15, -0.24], window: [0.25, 0.72], ex: { p: [0.1, 0.25, -1.55], r: [-0.25, 0, 0] },
      render: (m) => (
        <group position={[0.08, -0.02, -0.2]}>
          <RoundedBox args={[0.92, 0.6, 0.05]} radius={0.02} smoothness={4} material={m('body')} />
          <mesh material={m('screen')} position={[0, 0, -0.027]} rotation-y={Math.PI}><planeGeometry args={[0.84, 0.52]} /></mesh>
        </group>
      ),
    },
    {
      id: 'battery', name: '2,280 mAh battery', info: 'A high-density cell inside the grip, good for around 580 shots per charge, swappable in seconds.',
      origin: [-0.58, -0.06, 0.08], label: [-0.58, 0.22, 0.2], window: [0.35, 0.78], ex: { p: [-0.85, -1.05, -0.3], r: [0, 0, 0.25] },
      render: (m) => (
        <group position={[-0.58, -0.06, 0.08]}>
          <RoundedBox args={[0.2, 0.52, 0.17]} radius={0.03} smoothness={4} material={m('battery')} />
          <mesh material={m('accent')} position={[0, 0.12, 0.086]}><boxGeometry args={[0.12, 0.05, 0.004]} /></mesh>
          <mesh material={m('gold')} position={[0, 0.262, 0]}><boxGeometry args={[0.12, 0.006, 0.06]} /></mesh>
        </group>
      ),
    },
    {
      id: 'buttons', name: 'Dials & controls', info: 'Machined dials with positive clicks and a two-stage shutter you can feel through gloves.',
      origin: [0, 0.5, 0], label: [-0.35, 0.62, 0], window: [0.4, 0.82], ex: { p: [0, 0.6, 0.05] },
      render: (m) => (
        <group>
          <mesh material={m('metal')} position={[-0.4, 0.53, 0.05]}><cylinderGeometry args={[0.07, 0.07, 0.06, 48]} /></mesh>
          <mesh material={m('accent')} position={[-0.4, 0.565, 0.05]}><cylinderGeometry args={[0.04, 0.04, 0.012, 32]} /></mesh>
          <mesh material={m('darkmetal')} position={[0.48, 0.535, 0]}><cylinderGeometry args={[0.13, 0.13, 0.07, 64]} /></mesh>
          <mesh material={m('metal')} position={[0.48, 0.572, 0]}><cylinderGeometry args={[0.1, 0.1, 0.006, 64]} /></mesh>
          <mesh material={m('darkmetal')} position={[-0.18, 0.52, 0.1]}><cylinderGeometry args={[0.08, 0.08, 0.05, 48]} /></mesh>
          {[[0.62, 0.12], [0.62, -0.06], [0.62, -0.22]].map(([x, y], i) => (
            <mesh key={i} material={m('darkmetal')} position={[x, y, -0.19]} rotation-x={H}><cylinderGeometry args={[0.035, 0.035, 0.02, 24]} /></mesh>
          ))}
        </group>
      ),
    },
  ],
}
