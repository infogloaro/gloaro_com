import * as THREE from 'three'

/**
 * Part choreography. Every part has an assembled pose and an exploded pose, and a
 * `window` inside the 0..1 explode progress where it travels. Assembly is simply the
 * same timeline played backwards, so parts with the latest window return first.
 *
 * Paths:
 *  - 'linear' (default): straight move from assembled to exploded offset.
 *  - 'arc':    linear, lifted by `arc` at mid-flight.
 *  - 'orbit':  spirals out into an orbit around `axis` and keeps slowly circling.
 *  - 'hinge':  rotates about `pivot` by `angle` around `axis` (unfolding panels, lids).
 */

const clamp01 = (x) => Math.min(1, Math.max(0, x))
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const localT = (p, win = [0, 1]) => easeInOut(clamp01((p - win[0]) / Math.max(1e-4, win[1] - win[0])))

const v = new THREE.Vector3()
const axisVec = { x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 1, 0), z: new THREE.Vector3(0, 0, 1) }
const lerp = (a, b, t) => a + (b - a) * t

export function applyPart(obj, part, p, time) {
  const t = localT(p, part.window)
  const ex = part.ex || {}
  const at = part.at || {}
  const o = part.origin || [0, 0, 0]
  const ar = at.r || [0, 0, 0]
  const er = ex.r || ar
  const ep = ex.p || [0, 0, 0]

  let x = o[0] + ep[0] * t
  let y = o[1] + ep[1] * t
  let z = o[2] + ep[2] * t
  let rx = lerp(ar[0], er[0], t)
  let ry = lerp(ar[1], er[1], t)
  let rz = lerp(ar[2], er[2], t)

  if (part.path === 'arc') {
    y += Math.sin(Math.PI * t) * (part.arc ?? 0.4)
  } else if (part.path === 'orbit') {
    const { radius = 1.4, a0 = 0, spin = 1.2, axis = 'z', drift = 0.12 } = part.orbit || {}
    const a = a0 + spin * (1 - t) + time * drift * t
    const r = radius * t
    if (axis === 'z') { x += Math.cos(a) * r; y += Math.sin(a) * r } else { x += Math.cos(a) * r; z += Math.sin(a) * r }
  } else if (part.path === 'hinge') {
    const { pivot = [0, 0, 0], axis = 'x', angle = Math.PI / 2 } = part.hinge || {}
    v.set(o[0] - pivot[0], o[1] - pivot[1], o[2] - pivot[2]).applyAxisAngle(axisVec[axis], angle * t)
    x = pivot[0] + v.x + ep[0] * t
    y = pivot[1] + v.y + ep[1] * t
    z = pivot[2] + v.z + ep[2] * t
    if (axis === 'x') rx += angle * t
    if (axis === 'y') ry += angle * t
    if (axis === 'z') rz += angle * t
  }

  obj.position.set(x, y, z)
  obj.rotation.set(rx, ry, rz)
  const s = lerp(at.s ?? 1, ex.s ?? at.s ?? 1, t)
  obj.scale.setScalar(Math.max(s, 1e-4))
  obj.visible = s > 0.002
  return t
}
