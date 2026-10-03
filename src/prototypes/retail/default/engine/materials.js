import * as THREE from 'three'

const FOCUS = new THREE.Color('#2b44ff')
const textureCache = new Map()

/** Small procedural screen textures so displays read as "on" without image assets. */
export function screenTexture(kind = 'camera') {
  if (textureCache.has(kind)) return textureCache.get(kind)
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 320
  const g = c.getContext('2d')
  const grad = g.createLinearGradient(0, 0, 512, 320)
  if (kind === 'laptop') {
    grad.addColorStop(0, '#dfe6ff'); grad.addColorStop(0.55, '#7d8dff'); grad.addColorStop(1, '#1c2266')
    g.fillStyle = grad; g.fillRect(0, 0, 512, 320)
    g.fillStyle = 'rgba(255,255,255,.85)'; g.fillRect(40, 40, 230, 150); g.fillRect(290, 40, 180, 70)
    g.fillStyle = 'rgba(255,255,255,.45)'; g.fillRect(290, 120, 180, 70); g.fillRect(40, 210, 430, 18)
    g.fillStyle = 'rgba(20,24,60,.7)'; g.fillRect(0, 296, 512, 24)
  } else {
    grad.addColorStop(0, '#2b3a55'); grad.addColorStop(0.5, '#c98a5a'); grad.addColorStop(1, '#f2d2a0')
    g.fillStyle = grad; g.fillRect(0, 0, 512, 320)
    g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 2
    for (let i = 1; i < 3; i++) { g.beginPath(); g.moveTo((512 / 3) * i, 0); g.lineTo((512 / 3) * i, 320); g.stroke(); g.beginPath(); g.moveTo(0, (320 / 3) * i); g.lineTo(512, (320 / 3) * i); g.stroke() }
    g.fillStyle = 'rgba(255,255,255,.9)'; g.font = '600 22px sans-serif'; g.fillText('ISO 100   f/2.8   1/250', 24, 300)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  textureCache.set(kind, tex)
  return tex
}

/**
 * One material per (part, key), so a single component can be highlighted while the rest
 * of the product fades back. Colourways update by material key across all parts.
 */
export class MaterialBank {
  constructor(defs) {
    this.defs = defs
    this.mats = new Map()
    this.colorTargets = {}
    this.focus = null
  }

  get(partId, key) {
    const id = `${partId}|${key}`
    let m = this.mats.get(id)
    if (!m) {
      const def = this.defs[key]
      if (!def) throw new Error(`Unknown material "${key}"`)
      const { map, emissiveMap, ...props } = def
      m = new THREE.MeshPhysicalMaterial({ roughness: 0.5, ...props })
      if (map) m.map = screenTexture(map)
      if (emissiveMap) m.emissiveMap = screenTexture(emissiveMap)
      m.userData = {
        partId, key,
        baseOpacity: props.opacity ?? 1,
        baseTransparent: Boolean(props.transparent || props.transmission),
        baseEmissive: m.emissive.clone(),
        baseIntensity: m.emissiveIntensity,
      }
      if (this.colorTargets[key]) m.color.set(this.colorTargets[key])
      this.mats.set(id, m)
    }
    return m
  }

  setColors(colors = {}) {
    this.colorTargets = Object.fromEntries(Object.entries(colors).map(([k, c]) => [k, new THREE.Color(c)]))
  }

  setFocus(partId) {
    this.focus = partId
  }

  tick(delta) {
    const t = 1 - Math.exp(-delta * 7)
    for (const m of this.mats.values()) {
      const u = m.userData
      const target = this.colorTargets[u.key]
      if (target) m.color.lerp(target, t)
      const focused = this.focus && u.partId === this.focus
      const dimmed = this.focus && !focused
      const wantOpacity = dimmed ? Math.min(0.14, u.baseOpacity) : u.baseOpacity
      m.opacity += (wantOpacity - m.opacity) * t
      const transparent = u.baseTransparent || m.opacity < 0.995
      if (m.transparent !== transparent) { m.transparent = transparent; m.needsUpdate = true }
      m.depthWrite = m.opacity > 0.5
      m.emissive.lerp(focused ? FOCUS : u.baseEmissive, t)
      m.emissiveIntensity += ((focused ? 0.45 : u.baseIntensity) - m.emissiveIntensity) * t
    }
  }

  dispose() {
    for (const m of this.mats.values()) m.dispose()
    this.mats.clear()
  }
}
