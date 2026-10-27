/* eslint-disable react-hooks/immutability -- three.js materials, textures, lights and the camera are mutated every frame by design. */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import {
  DESKTOP, DESKTOP_CTA, DESKTOP_SCROLL, PHONE, PHONE_SCROLL,
  drawDesktopHeader, drawDesktopPage, drawPhoneHeader, drawPhonePage, loadSiteAssets,
} from './showcaseSite'

// "The digital web experience": a thin studio display and a phone on a stand,
// both running the same responsive storefront. Opening (once, 3.2 s): the
// camera eases in as the studio lights come up, the screens power on, the
// phone slides into place and a highlight runs round the display's edge. Then
// a seamless 10 s loop:
//   0.3–3.0 cursor glides to the call to action, hovers and clicks
//   3.4–5.6 both pages scroll to the product grid, phone a beat behind
//   5.6–7.6 hold; a highlight travels the display edge, then the phone's
//   7.6–9.6 both pages ease back to the top
// The three annotations light in turn alongside those beats.

const INTRO = 3.2
const LOOP = 10
const GOLD = '#CB9015'

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const ease = (v) => v * v * (3 - 2 * v)
const easeOut = (v) => 1 - (1 - v) ** 3
const seg = (t, a, b) => ease(clamp01((t - a) / (b - a)))
const bell = (t, a, b) => Math.sin(Math.PI * clamp01((t - a) / (b - a)))

// Device dimensions (scene units).
const SCREEN = { w: 3.2, h: 2.0 }
const MONITOR = { w: 3.3, h: 2.1, d: 0.045 }
const PHONE_SCREEN = { w: 0.69, h: 0.69 * (PHONE.view / PHONE.width) }
const HANDSET = { w: 0.74, h: PHONE_SCREEN.h + 0.05, d: 0.062 }
const GROUND = -1.28

function roundedShape(w, h, r, rBottom = r) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + rBottom, y)
  s.lineTo(x + w - rBottom, y)
  if (rBottom) s.quadraticCurveTo(x + w, y, x + w, y + rBottom)
  s.lineTo(x + w, y + h - r)
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h)
  s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + rBottom)
  if (rBottom) s.quadraticCurveTo(x, y, x + rBottom, y)
  return s
}

// Flat rounded rectangle whose UVs span 0..1 across its bounds.
function roundedPlane(w, h, r, rBottom = r) {
  const geo = new THREE.ShapeGeometry(roundedShape(w, h, r, rBottom), 12)
  const pos = geo.attributes.position
  const uv = geo.attributes.uv
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5)
  return geo
}

// Slab with softly bevelled edges, centred on the origin.
function slab(w, h, d, r, bevel = 0.006) {
  const geo = new THREE.ExtrudeGeometry(roundedShape(w - bevel * 2, h - bevel * 2, r), {
    depth: d - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 16,
  })
  geo.translate(0, 0, -(d - bevel * 2) / 2)
  return geo
}

// Closed path round the front edge of a device, for the travelling highlight.
function edgeTube(w, h, r, z, radius) {
  const shape = roundedShape(w, h, r)
  const pts = shape.getSpacedPoints(240).map((p) => new THREE.Vector3(p.x, p.y, z))
  pts.pop()
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0), 480, radius, 6, true)
}

const edgeVertex = /* glsl */ `
  varying vec2 vUv; varying vec3 vNormal;
  void main() { vUv = uv; vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`
// Brushed chamfer: dim steel, plus a soft white band at uHead (wraps around).
const edgeFragment = /* glsl */ `
  uniform float uHead; uniform float uLight; uniform float uBase;
  varying vec2 vUv; varying vec3 vNormal;
  void main() {
    float d = fract(vUv.x - uHead + 0.5) - 0.5;
    float band = exp(-d * d * 1400.0) * uLight;
    float facing = 0.55 + 0.45 * clamp(vNormal.y * 0.6 + vNormal.z * 0.5, 0.0, 1.0);
    vec3 steel = vec3(0.42, 0.45, 0.52) * facing * uBase;
    gl_FragColor = vec4(steel + vec3(1.0, 0.97, 0.92) * band * 1.6, 1.0);
  }
`

function useEdgeMaterial() {
  return useMemo(() => new THREE.ShaderMaterial({
    vertexShader: edgeVertex,
    fragmentShader: edgeFragment,
    uniforms: { uHead: { value: 0 }, uLight: { value: 0 }, uBase: { value: 0 } },
    toneMapped: false,
  }), [])
}

function canvasTexture(canvas, gl) {
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
  return tex
}

// Diagonal sheen across cover glass; offset with the pointer so the glass reads.
function sheenTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')
  const grad = g.createLinearGradient(0, 0, 256, 256)
  grad.addColorStop(0, 'rgba(255,255,255,0.10)')
  grad.addColorStop(0.32, 'rgba(255,255,255,0.025)')
  grad.addColorStop(0.42, 'rgba(255,255,255,0.075)')
  grad.addColorStop(0.5, 'rgba(255,255,255,0.01)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 256, 256)
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = THREE.MirroredRepeatWrapping
  return tex
}

function blobTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(0,4,12,0.85)')
  grad.addColorStop(0.45, 'rgba(0,4,12,0.4)')
  grad.addColorStop(1, 'rgba(0,4,12,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

function cursorTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  g.translate(18, 8)
  g.beginPath()
  g.moveTo(0, 0); g.lineTo(0, 34); g.lineTo(8, 26); g.lineTo(14, 40); g.lineTo(20, 37); g.lineTo(14, 24); g.lineTo(25, 24)
  g.closePath()
  g.shadowColor = 'rgba(0,0,0,0.35)'
  g.shadowBlur = 4
  g.shadowOffsetY = 2
  g.fillStyle = '#111'
  g.fill()
  g.shadowColor = 'transparent'
  g.lineWidth = 2.4
  g.strokeStyle = '#fff'
  g.stroke()
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// Draws the storefront once the photos and fonts are in, then hands back the
// four textures (pages + sticky headers). null until ready.
function useSiteTextures(full) {
  const gl = useThree((s) => s.gl)
  const [tex, setTex] = useState(null)
  useEffect(() => {
    let live = true
    let made
    loadSiteAssets().then((img) => {
      if (!live) return
      const d = full ? 1.25 : 0.9
      const p = full ? 1.6 : 1.2
      made = {
        desktopPage: canvasTexture(drawDesktopPage(img, d), gl),
        desktopHeader: canvasTexture(drawDesktopHeader(d), gl),
        phonePage: canvasTexture(drawPhonePage(img, p), gl),
        phoneHeader: canvasTexture(drawPhoneHeader(p), gl),
      }
      made.desktopPage.repeat.y = DESKTOP.view / DESKTOP.height
      made.phonePage.repeat.y = PHONE.view / PHONE.height
      setTex(made)
    })
    return () => {
      live = false
      if (made) Object.values(made).forEach((t) => t.dispose())
    }
  }, [full, gl])
  return tex
}

function useMaterials() {
  return useMemo(() => ({
    graphite: new THREE.MeshPhysicalMaterial({ color: '#59606c', metalness: 1, roughness: 0.3, clearcoat: 0.5, clearcoatRoughness: 0.25 }),
    titanium: new THREE.MeshPhysicalMaterial({ color: '#7a818d', metalness: 1, roughness: 0.24, clearcoat: 0.6, clearcoatRoughness: 0.18 }),
    satin: new THREE.MeshPhysicalMaterial({ color: '#474e59', metalness: 1, roughness: 0.42 }),
    glass: new THREE.MeshPhysicalMaterial({ color: '#04060a', metalness: 0, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.04, reflectivity: 0.6 }),
    gold: new THREE.MeshPhysicalMaterial({ color: GOLD, metalness: 1, roughness: 0.3 }),
    // Screens are self-lit: start dark, the opening powers them on.
    desktopScreen: new THREE.MeshBasicMaterial({ color: '#000', toneMapped: false }),
    desktopHeader: new THREE.MeshBasicMaterial({ color: '#000', toneMapped: false, transparent: true, opacity: 0 }),
    phoneScreen: new THREE.MeshBasicMaterial({ color: '#000', toneMapped: false }),
    phoneHeader: new THREE.MeshBasicMaterial({ color: '#000', toneMapped: false, transparent: true, opacity: 0 }),
  }), [])
}

// Page point (CSS px of the visible desktop viewport) to display-local units.
const deskPoint = (x, y) => [(x / DESKTOP.width - 0.5) * SCREEN.w, (0.5 - y / DESKTOP.view) * SCREEN.h]

function Monitor({ m, sheen, edgeMat, hoverRef, rippleRef, cursorRef }) {
  const body = useMemo(() => slab(MONITOR.w, MONITOR.h, MONITOR.d, 0.05), [])
  const front = useMemo(() => roundedPlane(MONITOR.w - 0.016, MONITOR.h - 0.016, 0.044), [])
  const screen = useMemo(() => new THREE.PlaneGeometry(SCREEN.w, SCREEN.h), [])
  const headerH = (DESKTOP.header / DESKTOP.view) * SCREEN.h
  const edge = useMemo(() => edgeTube(MONITOR.w - 0.006, MONITOR.h - 0.006, 0.048, MONITOR.d / 2 - 0.004, 0.0045), [])
  const cta = useMemo(() => roundedPlane((DESKTOP_CTA.w / DESKTOP.width) * SCREEN.w, (DESKTOP_CTA.h / DESKTOP.view) * SCREEN.h, (DESKTOP_CTA.h / DESKTOP.view) * SCREEN.h / 2), [])
  const cursor = useMemo(() => cursorTexture(), [])
  const z = MONITOR.d / 2
  return (
    <group>
      <mesh geometry={body} material={m.graphite} />
      <mesh geometry={front} material={m.glass} position={[0, 0, z + 0.0004]} />
      <mesh geometry={screen} material={m.desktopScreen} position={[0, 0, z + 0.001]} />
      <mesh material={m.desktopHeader} position={[0, SCREEN.h / 2 - headerH / 2, z + 0.002]}>
        <planeGeometry args={[SCREEN.w, headerH]} />
      </mesh>
      <mesh ref={hoverRef} geometry={cta} position={[0, 0, z + 0.0025]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={rippleRef} position={[0, 0, z + 0.0028]}>
        <ringGeometry args={[0.92, 1, 48]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={cursorRef} position={[0, 0, z + 0.003]}>
        <planeGeometry args={[0.085, 0.085]} />
        <meshBasicMaterial map={cursor} transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, z + 0.0035]}>
        <planeGeometry args={[MONITOR.w - 0.02, MONITOR.h - 0.02]} />
        <meshBasicMaterial map={sheen} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh geometry={edge} material={edgeMat} />
      {/* Camera dot in the top bezel */}
      <mesh position={[0, MONITOR.h / 2 - 0.026, z + 0.0012]}>
        <circleGeometry args={[0.009, 20]} />
        <meshBasicMaterial color="#1a2233" />
      </mesh>
    </group>
  )
}

function Stand({ m }) {
  const foot = useMemo(() => slab(1.1, 0.72, 0.034, 0.12, 0.008), [])
  return (
    <group>
      {/* Hinge collar with a fine gold ring, arm, and a low machined foot. */}
      <mesh material={m.satin} position={[0, 0.05, -MONITOR.d / 2 - 0.035]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.045, 0.6, 32]} />
      </mesh>
      {[-0.302, 0.302].map((x) => (
        <mesh key={x} material={m.gold} position={[x, 0.05, -MONITOR.d / 2 - 0.035]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.046, 0.046, 0.006, 32]} />
        </mesh>
      ))}
      <mesh material={m.graphite} position={[0, -0.6, -0.2]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.44, 1.36, 0.028]} />
      </mesh>
      <mesh geometry={foot} material={m.graphite} position={[0, GROUND + 0.017, -0.26]} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  )
}

function Handset({ m, sheen, edgeMat }) {
  const body = useMemo(() => slab(HANDSET.w, HANDSET.h, HANDSET.d, 0.11, 0.012), [])
  const front = useMemo(() => roundedPlane(HANDSET.w - 0.018, HANDSET.h - 0.018, 0.1), [])
  const screen = useMemo(() => roundedPlane(PHONE_SCREEN.w, PHONE_SCREEN.h, 0.085), [])
  const headerH = (PHONE.header / PHONE.view) * PHONE_SCREEN.h
  const header = useMemo(() => roundedPlane(PHONE_SCREEN.w, headerH, 0.085, 0), [headerH])
  const island = useMemo(() => roundedPlane(0.19, 0.052, 0.026), [])
  const edge = useMemo(() => edgeTube(HANDSET.w - 0.004, HANDSET.h - 0.004, 0.108, HANDSET.d / 2 - 0.006, 0.004), [])
  const z = HANDSET.d / 2
  return (
    <group>
      <mesh geometry={body} material={m.titanium} />
      <mesh geometry={front} material={m.glass} position={[0, 0, z + 0.0004]} />
      <mesh geometry={screen} material={m.phoneScreen} position={[0, 0, z + 0.001]} />
      <mesh geometry={header} material={m.phoneHeader} position={[0, PHONE_SCREEN.h / 2 - headerH / 2, z + 0.002]} />
      <mesh geometry={island} position={[0, PHONE_SCREEN.h / 2 - 0.05, z + 0.0028]}>
        <meshBasicMaterial color="#020306" />
      </mesh>
      <mesh geometry={front} position={[0, 0, z + 0.0035]}>
        <meshBasicMaterial map={sheen} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh geometry={edge} material={edgeMat} />
      {/* Side buttons */}
      <mesh material={m.titanium} position={[HANDSET.w / 2 + 0.004, 0.28, 0]}><boxGeometry args={[0.012, 0.2, 0.026]} /></mesh>
      {[0.36, 0.22].map((y) => (
        <mesh key={y} material={m.titanium} position={[-HANDSET.w / 2 - 0.004, y, 0]}><boxGeometry args={[0.012, 0.11, 0.026]} /></mesh>
      ))}
    </group>
  )
}

function PhoneStand({ m }) {
  const base = useMemo(() => slab(0.56, 0.46, 0.026, 0.06, 0.006), [])
  return (
    <group>
      <mesh geometry={base} material={m.graphite} position={[0, 0.013, -0.1]} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh material={m.graphite} position={[0, 0.045, 0.085]}><boxGeometry args={[0.5, 0.04, 0.03]} /></mesh>
      <mesh material={m.satin} position={[0, 0.38, -0.21]} rotation={[-0.26, 0, 0]}><boxGeometry args={[0.36, 0.72, 0.022]} /></mesh>
    </group>
  )
}

// Label anchors: device-local positions, filled into `anchors` by index.
const ANNOTATIONS = [
  { key: 'seo', label: 'SEO-ready', text: 'Built for discoverability', dx: -22, dy: -64, on: [6.6, 9.4] },
  { key: 'performance', label: 'Performance', text: 'Fast, reliable experiences', dx: 28, dy: -46, on: [0.2, 3.1] },
  { key: 'responsive', label: 'Responsive design', text: 'Every screen, every device', dx: -30, dy: 58, on: [3.4, 6.4] },
]
// On the frame edges, so markers never sit on the screen's copy.
const DESK_ANCHORS = { seo: [-MONITOR.w / 2, SCREEN.h / 2 - 0.22], performance: [MONITOR.w / 2, SCREEN.h / 2 - 0.5] }

function Showcase({ full, anchors, labels }) {
  const m = useMaterials()
  const tex = useSiteTextures(full)
  const sheen = useMemo(() => sheenTexture(), [])
  const blob = useMemo(() => blobTexture(), [])
  const deskEdge = useEdgeMaterial()
  const phoneEdge = useEdgeMaterial()
  const desk = useRef()
  const phone = useRef()
  const rig = useRef()
  const key = useRef()
  const rim = useRef()
  const scene = useThree((s) => s.scene)
  const hoverRef = useRef()
  const rippleRef = useRef()
  const cursorRef = useRef()
  const ready = useRef(null)

  // Hook the textures up the moment the storefront is drawn.
  useEffect(() => {
    if (!tex) return
    m.desktopScreen.map = tex.desktopPage
    m.desktopHeader.map = tex.desktopHeader
    m.phoneScreen.map = tex.phonePage
    m.phoneHeader.map = tex.phoneHeader
    Object.values(m).forEach((mat) => { mat.needsUpdate = true })
    ready.current = null
  }, [tex, m])

  const ctaCenter = deskPoint(DESKTOP_CTA.x + DESKTOP_CTA.w / 2, DESKTOP_CTA.y + DESKTOP_CTA.h / 2)
  const cursorFrom = deskPoint(1080, 820)
  const cursorTo = [ctaCenter[0] + 0.03, ctaCenter[1] - 0.035]
  const cursorAway = deskPoint(640, 420)

  useFrame((state, delta) => {
    const now = state.clock.elapsedTime
    // The opening is timed from when the screens can actually show the site.
    if (tex && ready.current === null) ready.current = now
    const t = ready.current === null ? 0 : now - ready.current
    const lt = t < INTRO ? -1 : (t - INTRO) % LOOP
    const first = t < INTRO + LOOP

    // Studio lights come up; screens power on.
    const lights = 0.25 + 0.75 * seg(now, 0, 1.4)
    if (key.current) key.current.intensity = 2.3 * lights
    if (rim.current) rim.current.intensity = 2.4 * lights
    scene.environmentIntensity = 0.9 * lights
    const power = tex ? seg(t, 0.5, 1.3) : 0
    m.desktopScreen.color.setScalar(0.96 * power)
    m.phoneScreen.color.setScalar(0.96 * seg(t, 0.9, 1.7))
    m.desktopHeader.color.setScalar(0.96 * power)
    m.desktopHeader.opacity = power
    m.phoneHeader.color.setScalar(0.96 * seg(t, 0.9, 1.7))
    m.phoneHeader.opacity = seg(t, 0.9, 1.7)

    // Phone slides into place beside the display.
    const arrive = easeOut(clamp01((now - 0.5) / 2.1))
    if (phone.current) {
      phone.current.position.set(1.6 + 0.5 * (1 - arrive), 0, 1.05 - 0.7 * (1 - arrive))
      phone.current.rotation.y = -0.18 + 0.3 * (1 - arrive)
    }

    // Page scroll (and the phone a beat behind).
    if (tex) {
      const ds = lt < 0 ? 0 : seg(lt, 3.4, 5.6) * (1 - seg(lt, 7.6, 9.6))
      const ps = lt < 0 ? 0 : seg(lt, 3.75, 5.95) * (1 - seg(lt, 7.9, 9.85))
      tex.desktopPage.offset.y = 1 - tex.desktopPage.repeat.y - (ds * DESKTOP_SCROLL) / DESKTOP.height
      tex.phonePage.offset.y = 1 - tex.phonePage.repeat.y - (ps * PHONE_SCROLL) / PHONE.height
    }

    // Cursor glides to the call to action, hovers, clicks, leaves.
    const cursor = cursorRef
    const hover = hoverRef
    const ripple = rippleRef
    if (cursor.current) {
      const go = seg(lt, 0.5, 2.0)
      const leave = seg(lt, 3.0, 3.7)
      const x = THREE.MathUtils.lerp(THREE.MathUtils.lerp(cursorFrom[0], cursorTo[0], go), cursorAway[0], leave)
      const y = THREE.MathUtils.lerp(THREE.MathUtils.lerp(cursorFrom[1], cursorTo[1], go), cursorAway[1], leave)
      cursor.current.position.x = x + 0.028
      cursor.current.position.y = y - 0.028
      cursor.current.material.opacity = lt < 0 ? 0 : seg(lt, 0.3, 0.8) * (1 - seg(lt, 3.4, 4.0))
      const press = bell(lt, 2.35, 2.6)
      cursor.current.scale.setScalar(1 - 0.12 * press)
    }
    if (hover.current) {
      hover.current.position.x = ctaCenter[0]
      hover.current.position.y = ctaCenter[1]
      hover.current.material.opacity = lt < 0 ? 0 : 0.16 * seg(lt, 1.85, 2.1) * (1 - seg(lt, 2.9, 3.2))
    }
    if (ripple.current) {
      const r = clamp01((lt - 2.4) / 0.7)
      ripple.current.position.set(cursorTo[0], cursorTo[1], ripple.current.position.z)
      ripple.current.scale.setScalar(0.01 + 0.12 * easeOut(r))
      ripple.current.material.opacity = lt < 0 ? 0 : 0.55 * bell(lt, 2.4, 3.1) * (1 - r * 0.6)
    }

    // A highlight travels the polished edge: in the opening, then once a loop.
    const sweep = (mat, a, b, la, lb) => {
      const inIntro = t < INTRO
      const head = inIntro ? seg(t, a, b) : seg(lt, la, lb)
      mat.uniforms.uHead.value = 0.12 + head * 1.05
      mat.uniforms.uLight.value = inIntro ? bell(t, a, b) : bell(lt, la, lb)
      mat.uniforms.uBase.value = lights
    }
    sweep(deskEdge, 1.3, 2.9, 5.8, 7.2)
    sweep(phoneEdge, 1.9, 3.1, 6.4, 7.6)

    // Restrained pointer parallax; the glass sheen slides against it.
    const { x: px, y: py } = state.pointer
    if (rig.current) {
      rig.current.rotation.y = THREE.MathUtils.damp(rig.current.rotation.y, px * 0.07, 2.5, delta)
      rig.current.rotation.x = THREE.MathUtils.damp(rig.current.rotation.x, -py * 0.03, 2.5, delta)
    }
    sheen.offset.x = THREE.MathUtils.damp(sheen.offset.x, -px * 0.12, 2.5, delta)
    if (key.current) key.current.position.x = THREE.MathUtils.damp(key.current.position.x, -4 + px * 1.2, 2, delta)

    // Annotations: fade in after the opening, then each brightens on its beat.
    ANNOTATIONS.forEach((a, i) => {
      const el = labels?.current[i]
      if (!el) return
      const intro = first ? seg(t, INTRO - 0.4 + i * 0.35, INTRO + 0.2 + i * 0.35) : 1
      const active = lt < 0 ? 0 : bell(lt, a.on[0], a.on[1]) ** 0.5
      el.style.setProperty('--on', active.toFixed(3))
      el.style.opacity = (intro * (0.62 + 0.38 * active)).toFixed(3)
    })
  })

  return (
    <group ref={rig}>
      <group ref={desk} position={[-0.38, 0, 0]} rotation={[0, -0.24, 0]}>
        <group position={[0, 0.36, 0]} rotation={[-0.035, 0, 0]}>
          <Monitor m={m} sheen={sheen} edgeMat={deskEdge} hoverRef={hoverRef} rippleRef={rippleRef} cursorRef={cursorRef} />
          <group ref={(el) => { anchors.current[0] = el }} position={[...DESK_ANCHORS.seo, MONITOR.d / 2]} />
          <group ref={(el) => { anchors.current[1] = el }} position={[...DESK_ANCHORS.performance, MONITOR.d / 2]} />
        </group>
        <Stand m={m} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, GROUND + 0.001, -0.18]} scale={[2.2, 1.25, 1]}>
          <planeGeometry />
          <meshBasicMaterial map={blob} transparent opacity={0.85} depthWrite={false} />
        </mesh>
      </group>

      <group ref={phone} position={[1.6, 0, 1.05]} rotation={[0, -0.18, 0]}>
        <group position={[0, GROUND, 0]}>
          <PhoneStand m={m} />
          <group position={[0, 0.06 + (HANDSET.h / 2) * Math.cos(0.2), -0.02 - (HANDSET.h / 2) * Math.sin(0.2)]} rotation={[-0.2, 0, 0]}>
            <Handset m={m} sheen={sheen} edgeMat={phoneEdge} />
            <group ref={(el) => { anchors.current[2] = el }} position={[-HANDSET.w / 2, -0.3, HANDSET.d / 2]} />
          </group>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, -0.08]} scale={[0.95, 0.75, 1]}>
            <planeGeometry />
            <meshBasicMaterial map={blob} transparent opacity={0.8} depthWrite={false} />
          </mesh>
        </group>
      </group>

      <directionalLight ref={key} position={[-4, 5, 6]} intensity={0.6} color="#ffffff" />
      <directionalLight ref={rim} position={[5, 3, -4]} intensity={0.6} color="#dfe8ff" />
    </group>
  )
}

// Fine leader lines with compact labels, positioned over the projected anchors.
export function AnnotationLayer({ refs }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {ANNOTATIONS.map(({ key, label, text, dx, dy }, i) => (
        <div key={key} ref={(el) => { refs.current[i] = el }} className="absolute left-0 top-0 opacity-0 [--on:0]">
          <span className="absolute -left-[5px] -top-[5px] h-2.5 w-2.5 rounded-full border border-[#CB9015]/80" />
          <span className="absolute -left-[1.5px] -top-[1.5px] h-[3px] w-[3px] rounded-full bg-[#CB9015]" style={{ boxShadow: '0 0 calc(var(--on) * 10px) #CB9015' }} />
          <svg className="absolute left-0 top-0 overflow-visible" width="1" height="1">
            <polyline data-leader points={`0,0 0,${dy} ${dx},${dy}`} fill="none" stroke="rgba(226,176,74,0.65)" strokeWidth="1" />
          </svg>
          <div data-label className="absolute whitespace-nowrap" style={{ top: dy, left: dx }}>
            <p className="font-outfit text-[9.5px] font-semibold uppercase tracking-[0.22em] text-[#e2b04a] [text-shadow:0_1px_8px_rgba(6,20,45,0.9)] sm:text-[10px]">{label}</p>
            <p className="mt-0.5 hidden text-[11px] font-medium text-white/80 [text-shadow:0_1px_8px_rgba(6,20,45,0.9)] sm:block">{text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// Same three notes for the poster (no WebGL / reduced motion): a quiet list.
export function StaticAnnotations() {
  return (
    <ul aria-hidden="true" className="pointer-events-none absolute right-4 top-4 z-10 space-y-2 text-right sm:right-6 sm:top-6">
      {ANNOTATIONS.map(({ key, label, text }) => (
        <li key={key} className="[text-shadow:0_1px_8px_rgba(6,20,45,0.9)]">
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e2b04a]">{label}</p>
          <p className="hidden text-[11px] font-medium text-white/75 sm:block">{text}</p>
        </li>
      ))}
    </ul>
  )
}

const projected = new THREE.Vector3()
function Projector({ anchors, labels }) {
  useFrame(({ camera, size }) => {
    anchors.current.forEach((anchor, i) => {
      const el = labels?.current[i]
      if (!anchor || !el) return
      anchor.getWorldPosition(projected).project(camera)
      const x = (projected.x * 0.5 + 0.5) * size.width
      const y = (-projected.y * 0.5 + 0.5) * size.height
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      // Keep each label inside the frame: designed side first, nudged if needed.
      const box = el.querySelector('[data-label]')
      const w = box.offsetWidth
      const h = box.offsetHeight
      const { dx, dy } = ANNOTATIONS[i]
      let left = dx < 0 ? x + dx - w : x + dx
      left = Math.min(Math.max(left, 10), size.width - 10 - w)
      let top = y + dy - h / 2
      top = Math.min(Math.max(top, 10), size.height - 10 - h)
      box.style.left = `${(left - x).toFixed(1)}px`
      box.style.top = `${(top - y).toFixed(1)}px`
      // Elbow to the label's side; if nudging put the label over the marker
      // (narrow frames), run straight up or down to its edge instead.
      const leader = el.querySelector('[data-leader]')
      if (left - 4 < x && x < left + w + 4) {
        const end = dy < 0 ? top - y + h + 3 : top - y - 3
        leader.setAttribute('points', `0,0 0,${end.toFixed(1)}`)
      } else {
        const ly = top - y + h / 2
        const lx = dx < 0 ? left - x + w + 6 : left - x - 6
        leader.setAttribute('points', `0,0 0,${ly.toFixed(1)} ${lx.toFixed(1)},${ly.toFixed(1)}`)
      }
    })
  })
  return null
}

// Frames the pair of devices for any container shape, with headroom for labels.
function CameraRig() {
  const { camera, size } = useThree()
  const target = useMemo(() => new THREE.Vector3(), [])
  const fit = useRef(8)
  useLayoutEffect(() => {
    camera.fov = 30
    const half = Math.tan(THREE.MathUtils.degToRad(15))
    const aspect = size.width / size.height
    fit.current = Math.max(3.7 / 2 / half, 5.0 / 2 / (half * aspect))
    camera.updateProjectionMatrix()
  }, [camera, size.width, size.height])
  useFrame((state) => {
    // Opening dolly: a slow push-in from wider and lower; then it holds.
    const k = easeOut(clamp01(state.clock.elapsedTime / 2.8))
    const dist = fit.current * (1.2 - 0.2 * k)
    const az = 0.36 - 0.18 * k
    const el = 0.03 + 0.08 * k
    target.set(0.18, 0.12, 0.25)
    camera.position.set(
      target.x + Math.sin(az) * Math.cos(el) * dist,
      target.y + Math.sin(el) * dist,
      target.z + Math.cos(az) * Math.cos(el) * dist,
    )
    camera.lookAt(target)
  })
  return null
}

export default function WebShowcase({ tier, labels }) {
  const full = tier === 'full'
  const anchors = useRef([])
  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.18} />
      {/* Product-photography studio: large soft key front-left, a narrow white
          strip rim behind right, faint cobalt bounce and a small warm kicker. */}
      <Environment resolution={full ? 256 : 64} background={false}>
        <Lightformer form="rect" intensity={6} color="#ffffff" position={[-5, 4, 5]} scale={[7, 5, 1]} />
        <Lightformer form="rect" intensity={2.2} color="#eef3ff" position={[0, 8, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[2, 6, 7]} scale={[6, 1.2, 1]} />
        <Lightformer form="rect" intensity={9} color="#ffffff" position={[6, 2, -4]} scale={[0.5, 7, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#3f6fd8" position={[-7, 1, -5]} scale={[8, 4, 1]} />
        {/* Studio sweep behind the set: what the stand's top surfaces mirror. */}
        <Lightformer form="rect" intensity={1.4} color="#c9d6ee" position={[0, 1.5, -9]} scale={[22, 5, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#e8b04a" position={[5, -1.5, 5]} scale={[2, 0.8, 1]} />
      </Environment>
      <Showcase full={full} anchors={anchors} labels={labels} />
      <Projector anchors={anchors} labels={labels} />
    </>
  )
}
