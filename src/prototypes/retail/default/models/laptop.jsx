/* eslint-disable react-refresh/only-export-components -- product definitions pair data with their render functions */
 
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

const H = Math.PI / 2
const OPEN = -1.92 // lid angle when open (about 110°)

function Keys({ m }) {
  const keys = useMemo(() => {
    const out = []
    for (let r = 0; r < 5; r++) for (let c = 0; c < 14; c++) out.push([-0.65 + c * 0.1, -0.4 + r * 0.085 + 0.08])
    return out
  }, [])
  return keys.map(([x, z], i) => (
    <mesh key={i} material={m('key')} position={[x, 0.074, z - 0.12]}>
      <boxGeometry args={[0.082, 0.012, 0.07]} />
    </mesh>
  ))
}

function Fan({ m, x }) {
  const ref = useRef()
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 6 })
  return (
    <group position={[x, 0.05, -0.32]}>
      <mesh material={m('frame')}><cylinderGeometry args={[0.13, 0.13, 0.025, 48, 1, true]} /></mesh>
      <group ref={ref}>
        {Array.from({ length: 9 }, (_, i) => (
          <mesh key={i} material={m('blade')} rotation={[0.35, (i / 9) * Math.PI * 2, 0]} position={[Math.cos((i / 9) * Math.PI * 2) * 0.06, 0, -Math.sin((i / 9) * Math.PI * 2) * 0.06]}>
            <boxGeometry args={[0.1, 0.004, 0.04]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function HeatPipe({ m }) {
  const geo = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.42, 0.05, -0.32), new THREE.Vector3(-0.15, 0.05, -0.2), new THREE.Vector3(0.15, 0.05, -0.2), new THREE.Vector3(0.42, 0.05, -0.32)])
    return new THREE.TubeGeometry(c, 48, 0.014, 10, false)
  }, [])
  return <mesh geometry={geo} material={m('copper')} />
}

// Layers stack vertically: chassis, battery, board, cooling, keyboard, then the display above.
export const laptop = {
  id: 'laptop',
  view: { pos: [1.7, 1.5, 3.4], target: [0, 0.35, 0], fov: 32, minDistance: 2.4, maxDistance: 8, explodedPos: [3.2, 3.8, 5.2], explodedTarget: [0, 1.1, 0] },
  baseRotation: [0, -0.5, 0],
  shadowY: 0,
  materials: {
    alu: { color: '#c8cbd0', metalness: 0.9, roughness: 0.32, clearcoat: 0.3 },
    deck: { color: '#b7bbc1', metalness: 0.85, roughness: 0.4 },
    key: { color: '#1c1d20', roughness: 0.55 },
    pad: { color: '#d7dade', metalness: 0.4, roughness: 0.2, clearcoat: 1 },
    screen: { color: '#05060a', roughness: 0.1, clearcoat: 1, emissive: '#ffffff', emissiveIntensity: 0.9, emissiveMap: 'laptop' },
    bezel: { color: '#0b0c0f', roughness: 0.3 },
    cell: { color: '#24272d', roughness: 0.45, clearcoat: 0.3 },
    pcb: { color: '#1c3352', roughness: 0.55, metalness: 0.2 },
    chip: { color: '#121316', roughness: 0.35, metalness: 0.3 },
    gold: { color: '#caa552', metalness: 1, roughness: 0.3 },
    copper: { color: '#c47a4a', metalness: 1, roughness: 0.25 },
    frame: { color: '#3a3d43', metalness: 0.7, roughness: 0.4, side: 2 },
    blade: { color: '#2c2f35', roughness: 0.5 },
    accent: { color: '#2b44ff', roughness: 0.35, emissive: '#2b44ff', emissiveIntensity: 0.3 },
  },
  parts: [
    { id: 'chassis', name: 'Unibody chassis', info: 'Machined from a single block of recycled aluminium: 1.29 kg and 14.9 mm thin.', label: [0.6, 0.05, 0.45], window: [0, 1],
      render: (m) => <RoundedBox args={[1.6, 0.06, 1.08]} radius={0.025} smoothness={4} position={[0, 0.03, 0]} material={m('alu')} /> },
    { id: 'battery', name: '72 Wh battery', info: 'Six cells shaped around the chassis for up to 18 hours of video playback.', origin: [0, 0.035, 0.16], label: [0.45, 0.06, 0.16], window: [0.25, 0.7], ex: { p: [0, 0.5, -0.15] },
      render: (m) => (
        <group position={[0, 0.035, 0.16]}>
          {[-0.4, 0, 0.4].map((x) => <RoundedBox key={x} args={[0.36, 0.025, 0.4]} radius={0.008} position={[x, 0, 0]} material={m('cell')} />)}
          <mesh material={m('accent')} position={[0, 0.014, 0.12]}><boxGeometry args={[0.3, 0.002, 0.02]} /></mesh>
        </group>
      ) },
    { id: 'board', name: '12-core logic board', info: 'The processor, unified memory and SSD share one compact board, close to the cooling.', origin: [0, 0.04, -0.28], label: [-0.35, 0.08, -0.28], window: [0.3, 0.75], ex: { p: [0, 0.95, -0.45] },
      render: (m) => (
        <group position={[0, 0.04, -0.28]}>
          <mesh material={m('pcb')}><boxGeometry args={[1.38, 0.012, 0.36]} /></mesh>
          {[[-0.05, 0.16, 0.16], [0.2, 0.1, 0.08], [0.32, 0.1, 0.08], [-0.35, 0.14, 0.06]].map(([x, w, d], i) => <mesh key={i} material={m('chip')} position={[x, 0.012, 0.02]}><boxGeometry args={[w, 0.012, d + 0.04]} /></mesh>)}
          <mesh material={m('gold')} position={[-0.6, 0.01, -0.1]}><boxGeometry args={[0.1, 0.008, 0.06]} /></mesh>
        </group>
      ) },
    { id: 'cooling', name: 'Vapour-chamber cooling', info: 'Twin fans and a copper heat pipe keep the chip at full speed and the keyboard cool.', origin: [0, 0.05, -0.28], label: [0.42, 0.12, -0.32], window: [0.35, 0.8], ex: { p: [0, 1.35, -0.25] },
      render: (m) => (
        <group>
          <Fan m={m} x={-0.42} />
          <Fan m={m} x={0.42} />
          <HeatPipe m={m} />
        </group>
      ) },
    { id: 'keyboard', name: 'Backlit keyboard', info: 'Scissor keys with 1.2 mm travel and per-key backlighting that fades in with the room.', origin: [0, 0.065, -0.05], label: [-0.55, 0.1, -0.1], window: [0.15, 0.65], ex: { p: [0, 1.8, 0.05] },
      render: (m) => (
        <group>
          <mesh material={m('deck')} position={[0, 0.064, 0]}><boxGeometry args={[1.56, 0.006, 1.04]} /></mesh>
          <Keys m={m} />
        </group>
      ) },
    { id: 'trackpad', name: 'Force Touch trackpad', info: 'A glass trackpad with haptic clicks that feel the same anywhere you press.', origin: [0, 0.068, 0.32], label: [0.2, 0.09, 0.34], window: [0.1, 0.6], ex: { p: [0, 1.8, 0.25] },
      render: (m) => <RoundedBox args={[0.56, 0.008, 0.34]} radius={0.004} position={[0, 0.068, 0.32]} material={m('pad')} /> },
    { id: 'display', name: '14.2" Liquid Retina XDR', info: 'Mini-LED display with 1,600 nits peak brightness and 120 Hz refresh.', origin: [0, 0.075, -0.53], label: [0.55, 0.85, -0.78], window: [0, 0.5],
      at: { r: [OPEN, 0, 0] }, ex: { p: [0, 2.35, -0.2], r: [-1.65, 0, 0] },
      render: (m) => (
        <group position={[0, 0.075, -0.53]}>
          <RoundedBox args={[1.6, 0.03, 1.06]} radius={0.02} smoothness={4} position={[0, 0.015, 0.53]} material={m('alu')} />
          <mesh material={m('bezel')} position={[0, -0.001, 0.53]} rotation-x={H}><planeGeometry args={[1.54, 1.0]} /></mesh>
          <mesh material={m('screen')} position={[0, -0.002, 0.54]} rotation-x={H}><planeGeometry args={[1.46, 0.92]} /></mesh>
        </group>
      ) },
  ],
}
