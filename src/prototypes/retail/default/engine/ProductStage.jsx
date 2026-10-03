/* eslint-disable react-hooks/immutability -- camera, controls state and the HUD registry are mutated in frame loops by design */
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import ProductModel from './ProductModel'
import { HudProjector, StudioLights } from './Stage'
import { easeInOut } from './choreo'

/**
 * Direct-manipulation controls: drag / one-finger swipe rotates the product, wheel and
 * pinch zoom, double-click resets. The camera itself is owned by the framing rig so it can
 * pull back while the product explodes.
 */
function useManipulation(ctl, enabled) {
  const gl = useThree((s) => s.gl)
  useEffect(() => {
    if (!enabled) return undefined
    const el = gl.domElement
    const pts = new Map()
    let lastDist = 0
    const down = (e) => {
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY })
      el.setPointerCapture?.(e.pointerId)
      ctl.current.touched = performance.now()
    }
    const move = (e) => {
      const prev = pts.get(e.pointerId)
      if (!prev) return
      const cur = { x: e.clientX, y: e.clientY }
      pts.set(e.pointerId, cur)
      ctl.current.touched = performance.now()
      if (pts.size === 1) {
        ctl.current.yaw += (cur.x - prev.x) * 0.008
        ctl.current.pitch = THREE.MathUtils.clamp(ctl.current.pitch + (cur.y - prev.y) * 0.004, -0.5, 0.6)
      } else if (pts.size === 2) {
        const [a, b] = [...pts.values()]
        const d = Math.hypot(a.x - b.x, a.y - b.y)
        if (lastDist) ctl.current.zoom = THREE.MathUtils.clamp(ctl.current.zoom * (lastDist / d), 0.55, 1.7)
        lastDist = d
      }
    }
    const up = (e) => { pts.delete(e.pointerId); if (pts.size < 2) lastDist = 0 }
    const wheel = (e) => {
      if (!ctl.current.wheel) return
      e.preventDefault()
      ctl.current.zoom = THREE.MathUtils.clamp(ctl.current.zoom * (1 + e.deltaY * 0.0012), 0.55, 1.7)
    }
    const reset = () => { ctl.current.yaw = 0; ctl.current.pitch = 0; ctl.current.zoom = 1 }
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    el.addEventListener('wheel', wheel, { passive: false })
    el.addEventListener('dblclick', reset)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
      el.removeEventListener('wheel', wheel)
      el.removeEventListener('dblclick', reset)
    }
  }, [gl, ctl, enabled])
}

function FramingRig({ def, progress, ctl, offset }) {
  const a = useMemo(() => new THREE.Vector3(...def.view.pos), [def])
  const b = useMemo(() => new THREE.Vector3(...(def.view.explodedPos || def.view.pos)), [def])
  const ta = useMemo(() => new THREE.Vector3(...def.view.target), [def])
  const tb = useMemo(() => new THREE.Vector3(...(def.view.explodedTarget || def.view.target)), [def])
  const pos = useMemo(() => new THREE.Vector3(), [])
  const tgt = useMemo(() => new THREE.Vector3(), [])
  const zoom = useRef(1)
  useFrame((state, delta) => {
    const t = easeInOut(Math.min(1, Math.max(0, progress.current)))
    zoom.current = THREE.MathUtils.damp(zoom.current, ctl.current.zoom, 6, delta)
    // Framings are authored for a ~1.4:1 stage; pull back on taller (narrower) stages.
    const aspect = state.size.width / Math.max(1, state.size.height)
    const fit = THREE.MathUtils.clamp(1.4 / aspect, 1, 1.9)
    tgt.lerpVectors(ta, tb, t)
    pos.lerpVectors(a, b, t).sub(tgt).multiplyScalar(zoom.current * fit).add(tgt)
    // Shift the frame sideways so the product sits clear of the info panel on wide screens.
    const off = offset?.current ?? 0
    state.camera.position.set(pos.x + off, pos.y, pos.z)
    state.camera.lookAt(tgt.x + off, tgt.y, tgt.z)
    if (state.camera.fov !== def.view.fov) { state.camera.fov = def.view.fov; state.camera.updateProjectionMatrix() }
  })
  return null
}

function Turntable({ ctl, children, idleSpin }) {
  const g = useRef()
  useFrame((_, delta) => {
    const idle = performance.now() - (ctl.current.touched || 0) > 3500
    if (idle && idleSpin) ctl.current.yaw += delta * idleSpin
    g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, ctl.current.yaw, 6, delta)
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, ctl.current.pitch, 6, delta)
  })
  return <group ref={g}>{children}</group>
}

export function ProductScene({ def, colors, progress, focus, hud, interactive = true, controls = true, idleSpin = 0.12, ctlRef, offset, tier, onHover, onSelect }) {
  const local = useRef({ yaw: 0, pitch: 0, zoom: 1, touched: 0, wheel: true })
  const ctl = ctlRef || local
  useManipulation(ctl, controls)
  return (
    <>
      <StudioLights mood={def.mood} shadows={tier === 'full'} shadowY={def.shadowY ?? -0.6} />
      <FramingRig def={def} progress={progress} ctl={ctl} offset={offset} />
      <Turntable ctl={ctl} idleSpin={idleSpin}>
        <ProductModel def={def} colors={colors} progress={progress} focus={focus} interactive={interactive} hud={hud} onHover={onHover} onSelect={onSelect} />
      </Turntable>
      {hud && <HudProjector hud={hud} ids={def.parts.map((p) => p.id)} />}
    </>
  )
}

/** DOM part labels. Positions are written by HudProjector; React only renders the content. */
export function PartLabels({ def, hud, show, focus, onSelect }) {
  const seen = new Set()
  return (
    <div className={`gx-labels ${show ? 'show' : ''}`} aria-hidden={!show}>
      {def.parts.map((p) => {
        const dup = seen.has(p.name)
        seen.add(p.name)
        return (
          <button
            key={p.id}
            ref={(el) => { hud.labels[p.id] = el }}
            className={`gx-plabel ${focus === p.id ? 'on' : ''} ${dup ? 'dot' : ''}`}
            onClick={() => onSelect(p.id)}
            tabIndex={show ? 0 : -1}
          >
            <i />{!dup && <span>{p.name}</span>}
          </button>
        )
      })}
    </div>
  )
}
