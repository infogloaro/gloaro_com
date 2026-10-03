/* eslint-disable react-refresh/only-export-components -- product definitions pair data with their render functions */
 
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { localT } from '../engine/choreo'

const H = Math.PI / 2
const W = 1.5 // width
const D = 0.56 // depth
const T = 1.0 // panel height

function Zipper({ m, progress }) {
  const puller = useRef()
  // The puller runs along the opening as the bag closes (the last moment of assembly).
  useFrame(() => {
    const open = localT(progress.current, [0, 0.18])
    if (puller.current) puller.current.position.x = THREE.MathUtils.lerp(0.62, -0.62, open)
  })
  return (
    <group position={[0, T + 0.03, 0]}>
      <mesh material={m('tape')}><boxGeometry args={[W - 0.14, 0.02, 0.07]} /></mesh>
      {Array.from({ length: 46 }, (_, i) => (
        <mesh key={i} material={m('gold')} position={[-0.66 + i * 0.0294, 0.012, 0]}><boxGeometry args={[0.012, 0.01, 0.05]} /></mesh>
      ))}
      <group ref={puller} position={[0.62, 0.02, 0.04]}>
        <mesh material={m('gold')}><boxGeometry args={[0.05, 0.03, 0.05]} /></mesh>
        <mesh material={m('leather')} position={[0, -0.02, 0.06]} rotation-x={0.3}><boxGeometry args={[0.04, 0.12, 0.012]} /></mesh>
      </group>
    </group>
  )
}

function Strap({ m }) {
  const geo = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.74, 0.92, 0), new THREE.Vector3(-0.6, 1.7, -0.05), new THREE.Vector3(0, 2.15, -0.1),
      new THREE.Vector3(0.6, 1.7, -0.05), new THREE.Vector3(0.74, 0.92, 0),
    ])
    return new THREE.TubeGeometry(c, 96, 0.025, 10, false)
  }, [])
  return (
    <group>
      <mesh geometry={geo} material={m('leather')} scale={[1, 1, 1.6]} />
      {[-0.74, 0.74].map((x) => <mesh key={x} material={m('gold')} position={[x, 0.92, 0]} rotation-y={H}><torusGeometry args={[0.04, 0.01, 8, 24]} /></mesh>)}
    </group>
  )
}

const panel = (args, position) => (m) => <RoundedBox args={args} radius={0.018} smoothness={4} position={position} material={m('leather')} />

// Panels are cut flat like a fashion pattern: on explode they unfold about their bottom edges.
export const handbag = {
  id: 'handbag',
  view: { pos: [1.8, 1.2, 3.8], target: [0, 0.6, 0], fov: 32, minDistance: 2.4, maxDistance: 8, explodedPos: [0.8, 4.4, 5.4], explodedTarget: [0, 0.7, 0] },
  baseRotation: [0, -0.45, 0],
  mood: 'fashion',
  shadowY: 0,
  materials: {
    leather: { color: '#7a4a2e', roughness: 0.55, clearcoat: 0.25, clearcoatRoughness: 0.5, sheen: 0.4, sheenColor: '#ffd9c2' },
    tape: { color: '#2a2220', roughness: 0.8 },
    gold: { color: '#d8b46a', metalness: 1, roughness: 0.22 },
    lining: { color: '#e9dccb', roughness: 0.9, sheen: 1, sheenColor: '#ffffff' },
    suede: { color: '#c79b72', roughness: 0.95 },
  },
  parts: [
    { id: 'base', name: 'Structured base', info: 'A double-stitched base with five gold feet, so the bag stands on its own.', label: [0.5, 0.05, 0.3], window: [0, 1],
      render: (m) => (
        <group>
          <RoundedBox args={[W, 0.04, D]} radius={0.015} position={[0, 0.02, 0]} material={m('leather')} />
          {[[-0.6, -0.2], [0.6, -0.2], [-0.6, 0.2], [0.6, 0.2], [0, 0]].map(([x, z], i) => <mesh key={i} material={m('gold')} position={[x, -0.005, z]}><cylinderGeometry args={[0.03, 0.03, 0.02, 16]} /></mesh>)}
        </group>
      ) },
    { id: 'front', name: 'Front panel', info: 'Full-grain calf leather, cut from a single hide so the grain flows across the face.',
      origin: [0, 0.54, D / 2], label: [0.2, 0.7, D / 2 + 0.02], window: [0.25, 0.8], path: 'hinge', hinge: { pivot: [0, 0.04, D / 2], axis: 'x', angle: H },
      render: panel([W, T, 0.03], [0, 0.54, D / 2]) },
    { id: 'back', name: 'Back panel', info: 'With a slip pocket for a phone or a metro card, lined in suede.',
      origin: [0, 0.54, -D / 2], label: [0.2, 0.7, -D / 2 - 0.02], window: [0.25, 0.8], path: 'hinge', hinge: { pivot: [0, 0.04, -D / 2], axis: 'x', angle: -H },
      render: panel([W, T, 0.03], [0, 0.54, -D / 2]) },
    { id: 'sideR', name: 'Side gusset', info: 'Soft gussets let the bag expand by 4 cm without losing its shape.',
      origin: [W / 2, 0.54, 0], label: [W / 2 + 0.02, 0.6, 0], window: [0.32, 0.86], path: 'hinge', hinge: { pivot: [W / 2, 0.04, 0], axis: 'z', angle: -H },
      render: panel([0.03, T, D - 0.04], [W / 2, 0.54, 0]) },
    { id: 'sideL', name: 'Side gusset', info: 'Soft gussets let the bag expand by 4 cm without losing its shape.',
      origin: [-W / 2, 0.54, 0], label: [-W / 2 - 0.02, 0.6, 0], window: [0.32, 0.86], path: 'hinge', hinge: { pivot: [-W / 2, 0.04, 0], axis: 'z', angle: H },
      render: panel([0.03, T, D - 0.04], [-W / 2, 0.54, 0]) },
    { id: 'interior', name: 'Interior compartment', info: 'A removable suede organiser with a zip pocket, pen loops and a key clip.',
      origin: [0, 0.5, 0], label: [0.4, 0.75, 0], window: [0.45, 0.95], ex: { p: [0, 1.7, 0] },
      render: (m) => (
        <group position={[0, 0.5, 0]}>
          <RoundedBox args={[W - 0.12, 0.84, D - 0.12]} radius={0.03} material={m('lining')} />
          <RoundedBox args={[0.5, 0.36, 0.03]} radius={0.01} position={[-0.3, 0.12, (D - 0.12) / 2 + 0.01]} material={m('suede')} />
        </group>
      ) },
    { id: 'zipper', name: 'Gold zipper', info: 'A smooth-running brass zip with a leather pull. Watch it close as the bag assembles.',
      origin: [0, T + 0.03, 0], label: [0.6, T + 0.12, 0.05], window: [0, 0.4], ex: { p: [0, 1.4, 0.2] },
      render: (m, ctx) => <Zipper m={m} progress={ctx.progress} /> },
    { id: 'handles', name: 'Rolled handles', info: 'Hand-rolled leather handles with a 20 cm drop for carrying in hand or on the forearm.',
      origin: [0, 1.2, 0], label: [0, 1.42, 0.2], window: [0.1, 0.55], ex: { p: [0, 1.25, 0] },
      render: (m) => (
        <group position={[0, T + 0.03, 0]}>
          {[0.17, -0.17].map((z) => <mesh key={z} material={m('leather')} position={[0, 0, z]}><torusGeometry args={[0.32, 0.035, 16, 64, Math.PI]} /></mesh>)}
        </group>
      ) },
    { id: 'strap', name: 'Shoulder strap', info: 'An adjustable, detachable strap for wearing cross-body, with brass swivel clasps.',
      origin: [0, 1.5, 0], label: [0, 2.2, 0], window: [0, 0.45], ex: { p: [0, 0.8, -0.9] },
      render: (m) => <Strap m={m} /> },
    { id: 'charm', name: 'Leather charm', info: 'A detachable tassel and brass ring, monogrammed free on request.',
      origin: [0.42, 0.95, 0.3], label: [0.55, 0.85, 0.35], window: [0.15, 0.5], ex: { p: [0.9, 0.2, 0.6] },
      render: (m) => (
        <group position={[0.42, 0.95, 0.3]}>
          <mesh material={m('gold')}><torusGeometry args={[0.05, 0.01, 10, 32]} /></mesh>
          <mesh material={m('suede')} position={[0, -0.13, 0]}><coneGeometry args={[0.05, 0.2, 16]} /></mesh>
        </group>
      ) },
  ],
}
