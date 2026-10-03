/* eslint-disable react-hooks/immutability -- the HUD registry is written from the frame loop */
import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

const MOODS = {
  studio: { key: '#ffffff', fill: '#dfe6ff', warm: '#fff4e6' },
  fashion: { key: '#fff1df', fill: '#ffe2c4', warm: '#ffd8b0' },
  precision: { key: '#f4f7ff', fill: '#cfd9ff', warm: '#ffffff' },
}

/** Soft studio light built from light-formers, so no HDR file is fetched from the network. */
export function StudioLights({ mood = 'studio', shadows = true, shadowY = -0.6, shadowScale = 8 }) {
  const c = MOODS[mood] || MOODS.studio
  return (
    <>
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} color={c.key} position={[0, 5, 2]} rotation-x={Math.PI / 2} scale={[10, 8, 1]} />
        <Lightformer form="rect" intensity={1.7} color={c.fill} position={[-6, 2, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1.5} color={c.warm} position={[6, 2, 1]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1.4} position={[0, 2, 9]} scale={[14, 6, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[0, 1, -7]} scale={[14, 4, 1]} />
        <Lightformer form="rect" intensity={0.8} position={[0, -4, 2]} rotation-x={-Math.PI / 2} scale={[12, 8, 1]} />
      </Environment>
      <ambientLight intensity={0.2} />
      <directionalLight position={[3, 6, 4]} intensity={0.55} color={c.key} />
      {shadows && <ContactShadows position={[0, shadowY, 0]} opacity={0.32} scale={shadowScale} blur={2.6} far={3} />}
    </>
  )
}

/**
 * Projects registered 3D anchors to DOM labels every frame (labels live outside the canvas).
 * Render it after the product so it reads this frame's transforms. (A positive useFrame
 * priority would take over rendering in R3F, so ordering is done by tree position instead.)
 */
export function HudProjector({ hud, ids }) {
  const wp = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ camera, size }) => {
    camera.updateMatrixWorld()
    for (const id of ids) {
      const g = hud.anchors[id]
      const el = hud.labels[id]
      if (!g || !el) continue
      g.getWorldPosition(wp)
      const visible = g.parent?.parent?.visible !== false
      wp.project(camera)
      el.style.transform = `translate(${(wp.x * 0.5 + 0.5) * size.width}px, ${(-wp.y * 0.5 + 0.5) * size.height}px)`
      el.dataset.hidden = visible && wp.z < 1 ? 'false' : 'true'
    }
  })
  return null
}
