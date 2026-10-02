import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

const lathe = (pts, seg = 64) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg)

// Profiles in metres, roughly real-world proportions.
const PLATE = [[0, 0.004], [0.1, 0], [0.11, 0.004], [0.135, 0.016], [0.142, 0.02], [0.138, 0.022], [0.112, 0.01], [0, 0.012]]
const GLASS = [[0, 0], [0.035, 0], [0.036, 0.003], [0.005, 0.008], [0.004, 0.09], [0.012, 0.1], [0.04, 0.13], [0.045, 0.17], [0.038, 0.215], [0.036, 0.215], [0.042, 0.17], [0.037, 0.132], [0.01, 0.104], [0, 0.102]]

function Cutlery({ side }) {
  const steel = useMemo(() => new THREE.MeshStandardMaterial({ color: '#e4e0d8', metalness: 0.8, roughness: 0.32 }), [])
  return (
    <group position={[side * 0.19, 0.003, 0]}>
      {side > 0 ? (
        <>
          <mesh material={steel} position={[0, 0, 0.04]}><boxGeometry args={[0.014, 0.004, 0.13]} /></mesh>
          <mesh material={steel} position={[0.002, 0, -0.07]}><boxGeometry args={[0.018, 0.002, 0.1]} /></mesh>
        </>
      ) : (
        <>
          <mesh material={steel} position={[0, 0, 0.04]}><boxGeometry args={[0.012, 0.004, 0.13]} /></mesh>
          <mesh material={steel} position={[0, 0, -0.04]}><boxGeometry args={[0.024, 0.002, 0.03]} /></mesh>
          {[-0.009, -0.003, 0.003, 0.009].map((x) => (
            <mesh key={x} material={steel} position={[x, 0, -0.072]}><boxGeometry args={[0.003, 0.002, 0.04]} /></mesh>
          ))}
        </>
      )}
    </group>
  )
}

function Setting({ index, guests, plateGeo, glassGeo, ceramic, crystal }) {
  const ref = useRef()
  useFrame((_, delta) => {
    const g = ref.current
    const visible = index < guests
    const angle = (index / Math.max(guests, 1)) * Math.PI * 2 + Math.PI / 2
    const r = 0.42
    const tx = Math.cos(angle) * r
    const tz = Math.sin(angle) * r
    g.position.x = THREE.MathUtils.damp(g.position.x, visible ? tx : 0, 5, delta)
    g.position.z = THREE.MathUtils.damp(g.position.z, visible ? tz : 0, 5, delta)
    const s = THREE.MathUtils.damp(g.scale.x, visible ? 1 : 0.0001, 6, delta)
    g.scale.setScalar(s)
    g.visible = s > 0.01
    // Face the centre of the table.
    const targetRot = -angle - Math.PI / 2
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetRot, 5, delta)
  })
  return (
    <group ref={ref} scale={0.0001}>
      <mesh geometry={plateGeo} material={ceramic} castShadow />
      <mesh geometry={plateGeo} material={ceramic} scale={0.72} position={[0, 0.012, 0]} />
      <Cutlery side={-1} />
      <Cutlery side={1} />
      <mesh geometry={glassGeo} material={crystal} position={[0.16, 0, -0.15]} />
    </group>
  )
}

export default function TableScene({ guests, tier }) {
  const plateGeo = useMemo(() => lathe(PLATE), [])
  const glassGeo = useMemo(() => lathe(GLASS, 48), [])
  const ceramic = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#fbfaf6', roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.08 }), [])
  const crystal = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#ffffff', roughness: 0.02, transmission: 1, thickness: 0.01, ior: 1.5, transparent: true,
  }), [])
  const rig = useRef()
  const camera = useThree((s) => s.camera)
  const aspect = useThree((s) => s.size.width / s.size.height)

  // Keep the whole table in frame: portrait stages (phones) pull the camera back.
  useEffect(() => {
    const k = aspect < 1 ? 1 / aspect : 1
    camera.position.set(0, 1.55 * k, 1.35 * k)
    camera.lookAt(0, 0, 0)
  }, [camera, aspect])

  useFrame((state, delta) => {
    const g = rig.current
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, state.pointer.x * 0.35 + state.clock.elapsedTime * 0.03, 2, delta)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * 0.06, 2, delta)
  })

  return (
    <>
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 1]} rotation-x={Math.PI / 2} scale={[6, 6, 1]} />
        <Lightformer form="rect" intensity={1.4} position={[-4, 1, 0]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#ffe2b8" position={[4, 1, -1]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer form="ring" intensity={2} position={[0, 2, -4]} scale={2} />
      </Environment>
      <directionalLight position={[2, 4, 2]} intensity={0.6} />
      <group ref={rig}>
        <mesh position={[0, -0.02, 0]} receiveShadow>
          <cylinderGeometry args={[0.62, 0.62, 0.04, 96]} />
          <meshPhysicalMaterial color="#e3d8c6" roughness={0.6} clearcoat={0.25} />
        </mesh>
        <mesh position={[0, 0.0005, 0]} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[0.6, 0.603, 128]} />
          <meshStandardMaterial color="#b8893b" metalness={1} roughness={0.3} />
        </mesh>
        {Array.from({ length: 8 }, (_, i) => (
          <Setting key={i} index={i} guests={guests} plateGeo={plateGeo} glassGeo={glassGeo} ceramic={ceramic} crystal={crystal} />
        ))}
      </group>
      {tier === 'full' && <ContactShadows position={[0, -0.041, 0]} opacity={0.35} scale={2.2} blur={2.4} far={0.6} />}
    </>
  )
}
