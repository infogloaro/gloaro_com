/* eslint-disable react-refresh/only-export-components -- product definitions pair data with their render functions */
import { useMemo } from 'react'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

const H = Math.PI / 2

function Lathe({ pts, material, segments = 96, position }) {
  const geo = useMemo(() => {
    const spline = new THREE.SplineCurve(pts.map(([x, y]) => new THREE.Vector2(x, y)))
    return new THREE.LatheGeometry(spline.getPoints(64), segments)
  }, [pts, segments])
  return <mesh geometry={geo} material={material} position={position} />
}

const GLASS = { color: '#ffffff', roughness: 0.03, transmission: 1, thickness: 0.4, ior: 1.5, clearcoat: 1 }
const view = (y = 0.6, d = 3.2) => ({ pos: [1.2, y + 0.6, d], target: [0, y, 0], fov: 30, minDistance: 1.8, maxDistance: 7, explodedPos: [1.6, y + 1.4, d + 1.4], explodedTarget: [0, y + 0.5, 0] })

// Secondary catalogue items: lighter models with a simple, product-specific take-apart.
export const serum = {
  id: 'serum', view: view(0.6), shadowY: 0, baseRotation: [0, 0.3, 0],
  materials: { glass: { ...GLASS, color: '#f3d9b0', thickness: 0.6 }, liquid: { color: '#e0a95a', roughness: 0.1, transmission: 0.6, thickness: 0.5 }, cap: { color: '#1d1e21', roughness: 0.35, clearcoat: 1 }, bulb: { color: '#2a2b2e', roughness: 0.7 }, label: { color: '#f6f3ee', roughness: 0.8 } },
  parts: [
    { id: 'bottle', name: 'Amber glass bottle', info: 'UV-filtering amber glass keeps the vitamin C stable for 12 months.', label: [0.3, 0.6, 0.2], window: [0, 1],
      render: (m) => (
        <group>
          <Lathe pts={[[0, 0], [0.36, 0], [0.4, 0.06], [0.4, 0.9], [0.3, 1.04], [0.16, 1.1], [0.16, 1.2], [0, 1.2]]} material={m('glass')} />
          <mesh material={m('label')} position={[0, 0.5, 0]}><cylinderGeometry args={[0.405, 0.405, 0.42, 96, 1, true]} /></mesh>
        </group>
      ) },
    { id: 'liquid', name: '15% vitamin C serum', info: 'Ethyl ascorbic acid with ferulic acid and vitamin E for an even, brighter tone.', origin: [0, 0.45, 0], label: [-0.2, 0.45, 0.2], window: [0.4, 1], ex: { p: [-0.9, 0.2, 0] },
      render: (m) => <mesh material={m('liquid')} position={[0, 0.42, 0]}><cylinderGeometry args={[0.34, 0.34, 0.7, 64]} /></mesh> },
    { id: 'dropper', name: 'Glass dropper', info: 'A calibrated glass pipette that measures four drops, exactly one application.', origin: [0, 1.3, 0], label: [0.2, 1.5, 0], window: [0, 0.6], ex: { p: [0, 1.0, 0] },
      render: (m) => (
        <group position={[0, 1.2, 0]}>
          <mesh material={m('cap')} position={[0, 0.08, 0]}><cylinderGeometry args={[0.19, 0.19, 0.16, 48]} /></mesh>
          <mesh material={m('bulb')} position={[0, 0.3, 0]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.13, 32, 24]} /></mesh>
          <mesh material={m('glass')} position={[0, -0.35, 0]}><cylinderGeometry args={[0.04, 0.025, 0.7, 24]} /></mesh>
        </group>
      ) },
  ],
}

export const perfume = {
  id: 'perfume', view: view(0.6), shadowY: 0, baseRotation: [0, 0.6, 0],
  materials: { glass: { ...GLASS, color: '#dfe6ff', thickness: 1 }, juice: { color: '#d7b5ff', roughness: 0.1, transmission: 0.5, thickness: 0.6 }, cap: { color: '#d8b46a', metalness: 1, roughness: 0.2 }, atomiser: { color: '#c9ccd2', metalness: 1, roughness: 0.3 } },
  parts: [
    { id: 'flacon', name: 'Faceted flacon', info: 'Hand-polished glass cut with 24 facets that throw light across the room.', label: [0.35, 0.5, 0.2], window: [0, 1],
      render: (m) => <RoundedBox args={[0.9, 0.95, 0.42]} radius={0.12} smoothness={6} position={[0, 0.48, 0]} material={m('glass')} /> },
    { id: 'juice', name: 'Eau de parfum', info: 'Bergamot, iris and warm sandalwood. 18% concentration for a 10-hour trail.', origin: [0, 0.4, 0], label: [-0.2, 0.4, 0.1], window: [0.4, 1], ex: { p: [-0.9, 0.3, 0] },
      render: (m) => <RoundedBox args={[0.72, 0.62, 0.28]} radius={0.08} position={[0, 0.38, 0]} material={m('juice')} /> },
    { id: 'atomiser', name: 'Atomiser', info: 'A fine-mist pump that releases 0.1 ml per spray.', origin: [0, 1.0, 0], label: [0.15, 1.05, 0], window: [0.2, 0.75], ex: { p: [0, 0.55, 0] },
      render: (m) => <mesh material={m('atomiser')} position={[0, 1.0, 0]}><cylinderGeometry args={[0.08, 0.1, 0.12, 32]} /></mesh> },
    { id: 'cap', name: 'Weighted cap', info: 'A solid brass cap that closes with a soft magnetic click.', origin: [0, 1.15, 0], label: [0.2, 1.3, 0], window: [0, 0.5], ex: { p: [0, 1.1, 0], r: [0, 0.8, 0] },
      render: (m) => <RoundedBox args={[0.36, 0.3, 0.36]} radius={0.05} position={[0, 1.12, 0]} material={m('cap')} /> },
  ],
}

export const vase = {
  id: 'vase', view: view(0.7, 3.6), shadowY: 0, baseRotation: [0, 0, 0],
  materials: { ceramic: { color: '#e8e1d6', roughness: 0.62, clearcoat: 0.4, clearcoatRoughness: 0.5 }, glaze: { color: '#3d5a52', roughness: 0.25, clearcoat: 1 }, stem: { color: '#5e7a52', roughness: 0.7 }, leaf: { color: '#7d9b6a', roughness: 0.6, side: 2 } },
  parts: [
    { id: 'body', name: 'Hand-thrown body', info: 'Thrown on the wheel in Khurja and fired twice at 1,240°C.', label: [0.42, 0.6, 0.2], window: [0, 1],
      render: (m) => <Lathe pts={[[0, 0], [0.34, 0], [0.48, 0.25], [0.52, 0.6], [0.36, 1.0], [0.22, 1.25], [0.26, 1.4], [0, 1.4]]} material={m('ceramic')} /> },
    { id: 'glaze', name: 'Reactive glaze band', info: 'A reactive glaze that pools differently on every piece, so no two are alike.', origin: [0, 0.6, 0], label: [-0.5, 0.6, 0.2], window: [0.3, 0.9], ex: { p: [0, 0.2, 0], s: 1.25 },
      render: (m) => <mesh material={m('glaze')} position={[0, 0.6, 0]}><cylinderGeometry args={[0.525, 0.53, 0.16, 96, 1, true]} /></mesh> },
    { id: 'stems', name: 'Dried eucalyptus', info: 'Preserved eucalyptus stems that last for years without water.', origin: [0, 1.6, 0], label: [0.3, 2.0, 0], window: [0, 0.6], ex: { p: [0, 1.1, 0] },
      render: (m) => (
        <group position={[0, 1.2, 0]}>
          {[-0.12, 0, 0.12].map((x, i) => (
            <group key={x} position={[x, 0, 0]} rotation-z={x * 1.4}>
              <mesh material={m('stem')} position={[0, 0.45, 0]}><cylinderGeometry args={[0.012, 0.016, 0.9, 8]} /></mesh>
              {[0.3, 0.5, 0.7, 0.85].map((y, j) => <mesh key={y} material={m('leaf')} position={[(j % 2 ? 0.06 : -0.06), y, 0]} rotation-z={(j % 2 ? -1 : 1) * 0.8 + i}><circleGeometry args={[0.06, 16]} /></mesh>)}
            </group>
          ))}
        </group>
      ) },
  ],
}

export const lamp = {
  id: 'lamp', view: view(0.9, 4), shadowY: 0, baseRotation: [0, 0.4, 0],
  materials: { marble: { color: '#efece6', roughness: 0.25, clearcoat: 1 }, brass: { color: '#c9a35a', metalness: 1, roughness: 0.25 }, shade: { color: '#f6efe3', roughness: 0.9, transmission: 0.25, thickness: 0.05, side: 2, emissive: '#ffd8a0', emissiveIntensity: 0.25 }, bulb: { color: '#fff4dc', emissive: '#ffcf7a', emissiveIntensity: 1.6 } },
  parts: [
    { id: 'base', name: 'Marble base', info: 'A solid Makrana marble foot, weighted so the lamp never tips.', label: [0.35, 0.08, 0.2], window: [0, 1], render: (m) => <mesh material={m('marble')} position={[0, 0.07, 0]}><cylinderGeometry args={[0.42, 0.46, 0.14, 64]} /></mesh> },
    { id: 'stem', name: 'Brass stem', info: 'Solid brass, hand-brushed, with the cable routed invisibly inside.', origin: [0, 0.7, 0], label: [0.08, 0.7, 0], window: [0.2, 0.7], ex: { p: [0.9, 0.3, 0] }, render: (m) => <mesh material={m('brass')} position={[0, 0.7, 0]}><cylinderGeometry args={[0.03, 0.03, 1.15, 24]} /></mesh> },
    { id: 'bulb', name: 'Warm LED filament', info: '2,700 K filament LED, dimmable through the touch base.', origin: [0, 1.32, 0], label: [0.1, 1.32, 0.1], window: [0.3, 0.85], ex: { p: [0, 0.6, 0.6] }, render: (m) => <mesh material={m('bulb')} position={[0, 1.32, 0]}><sphereGeometry args={[0.09, 32, 24]} /></mesh> },
    { id: 'shade', name: 'Linen shade', info: 'Belgian linen on a brass ring, diffusing light into a soft pool.', origin: [0, 1.45, 0], label: [0.5, 1.5, 0.1], window: [0, 0.55], ex: { p: [0, 1.0, 0] },
      render: (m) => <mesh material={m('shade')} position={[0, 1.45, 0]}><cylinderGeometry args={[0.28, 0.52, 0.5, 96, 1, true]} /></mesh> },
  ],
}

export const coffee = {
  id: 'coffee', view: view(0.55), shadowY: 0, baseRotation: [0, 0.4, 0],
  materials: { tin: { color: '#26302b', roughness: 0.35, metalness: 0.6, clearcoat: 0.6 }, lid: { color: '#c3c7ce', metalness: 1, roughness: 0.3 }, label: { color: '#f2e6cf', roughness: 0.85 }, beans: { color: '#4a2a17', roughness: 0.45, clearcoat: 0.6 } },
  parts: [
    { id: 'tin', name: 'Airtight tin', info: 'A one-way valve tin that lets CO₂ out and keeps air out for six weeks of freshness.', label: [0.36, 0.4, 0.2], window: [0, 1],
      render: (m) => (
        <group>
          <mesh material={m('tin')} position={[0, 0.5, 0]}><cylinderGeometry args={[0.42, 0.42, 1.0, 96]} /></mesh>
          <mesh material={m('label')} position={[0, 0.48, 0]}><cylinderGeometry args={[0.425, 0.425, 0.46, 96, 1, true, -1.2, 2.4]} /></mesh>
        </group>
      ) },
    { id: 'beans', name: 'Single-origin beans', info: 'Chikmagalur arabica, medium roast: cocoa, jaggery and a little orange peel.', origin: [0, 1.15, 0], label: [-0.2, 1.4, 0], window: [0.35, 1], ex: { p: [0, 0.9, 0] },
      render: (m) => (
        <group position={[0, 1.05, 0]}>
          {Array.from({ length: 22 }, (_, i) => {
            const a = i * 2.4
            const r = 0.06 + (i % 5) * 0.06
            return <mesh key={i} material={m('beans')} position={[Math.cos(a) * r, (i % 4) * 0.05, Math.sin(a) * r]} rotation={[a, a * 0.5, 0]} scale={[1, 0.62, 0.78]}><sphereGeometry args={[0.055, 16, 12]} /></mesh>
          })}
        </group>
      ) },
    { id: 'lid', name: 'Steel lid', info: 'A press-fit steel lid with a silicone seal.', origin: [0, 1.04, 0], label: [0.3, 1.1, 0], window: [0, 0.5], ex: { p: [0.9, 0.7, 0], r: [0, 0, -0.5] },
      render: (m) => <mesh material={m('lid')} position={[0, 1.03, 0]}><cylinderGeometry args={[0.44, 0.44, 0.07, 96]} /></mesh> },
  ],
}

export const honey = {
  id: 'honey', view: view(0.45), shadowY: 0, baseRotation: [0, 0.3, 0],
  materials: { glass: { ...GLASS }, honey: { color: '#e19a1c', roughness: 0.08, transmission: 0.45, thickness: 0.8, ior: 1.5 }, lid: { color: '#3b2a1e', roughness: 0.7 }, cloth: { color: '#e9dcc4', roughness: 0.95 }, wood: { color: '#b98a55', roughness: 0.6 } },
  parts: [
    { id: 'jar', name: 'Glass jar', info: 'Heavy, recyclable glass with a wide mouth for spoons and dippers.', label: [0.36, 0.4, 0.2], window: [0, 1], render: (m) => <Lathe pts={[[0, 0], [0.4, 0], [0.44, 0.1], [0.44, 0.72], [0.36, 0.84], [0.34, 0.9], [0, 0.9]]} material={m('glass')} /> },
    { id: 'honey', name: 'Raw forest honey', info: 'Unprocessed honey from the Western Ghats, never heated above 40°C.', origin: [0, 0.4, 0], label: [-0.2, 0.4, 0.2], window: [0.4, 1], ex: { p: [-0.95, 0.2, 0] }, render: (m) => <mesh material={m('honey')} position={[0, 0.38, 0]}><cylinderGeometry args={[0.41, 0.4, 0.68, 64]} /></mesh> },
    { id: 'lid', name: 'Cloth-topped lid', info: 'A hand-tied cotton cover over a tamper-proof lid.', origin: [0, 0.96, 0], label: [0.3, 1.02, 0], window: [0, 0.55], ex: { p: [0, 0.8, 0] },
      render: (m) => (
        <group position={[0, 0.94, 0]}>
          <mesh material={m('lid')}><cylinderGeometry args={[0.37, 0.37, 0.09, 64]} /></mesh>
          <mesh material={m('cloth')} position={[0, 0.05, 0]} scale={[1, 0.25, 1]}><sphereGeometry args={[0.42, 48, 16, 0, Math.PI * 2, 0, H]} /></mesh>
        </group>
      ) },
    { id: 'dipper', name: 'Wooden dipper', info: 'A neem-wood dipper that releases honey in a slow, clean ribbon.', origin: [0.75, 0.6, 0], label: [0.75, 0.9, 0], window: [0.2, 0.7], ex: { p: [0.4, 0.5, 0.3] },
      render: (m) => (
        <group position={[0.75, 0.35, 0]} rotation-z={0.3}>
          <mesh material={m('wood')} position={[0, 0.4, 0]}><cylinderGeometry args={[0.02, 0.02, 0.7, 12]} /></mesh>
          {[0, 0.05, 0.1].map((y) => <mesh key={y} material={m('wood')} position={[0, y, 0]} rotation-x={H}><torusGeometry args={[0.06, 0.018, 8, 24]} /></mesh>)}
        </group>
      ) },
  ],
}

export const dumbbell = {
  id: 'dumbbell', view: { ...view(0.3, 3.4), pos: [1.6, 1.2, 2.8] }, shadowY: 0, baseRotation: [0, 0.5, 0],
  materials: { grip: { color: '#c3c7ce', metalness: 1, roughness: 0.45 }, plate: { color: '#1e2024', roughness: 0.6, clearcoat: 0.3 }, collar: { color: '#2b44ff', roughness: 0.35 }, chrome: { color: '#e6e8ec', metalness: 1, roughness: 0.12 } },
  parts: [
    { id: 'handle', name: 'Knurled handle', info: 'Medium-depth knurling for a secure grip, chrome-plated against sweat.', label: [0, 0.4, 0.1], window: [0, 1], render: (m) => <mesh material={m('grip')} position={[0, 0.3, 0]} rotation-z={H}><cylinderGeometry args={[0.06, 0.06, 1.5, 32]} /></mesh> },
    ...[1, -1].flatMap((s) => [
      { id: `plates${s > 0 ? 'R' : 'L'}`, name: '5 kg plates', info: 'Urethane-coated plates that will not crack, chip or smell like rubber.', origin: [s * 0.4, 0.3, 0], label: [s * 0.45, 0.62, 0.1], window: [0.25, 0.85], ex: { p: [s * 0.75, 0, 0] },
        render: (m) => (
          <group position={[s * 0.4, 0.3, 0]}>
            {[0, 0.11].map((o) => <mesh key={o} material={m('plate')} position={[s * o, 0, 0]} rotation-z={H}><cylinderGeometry args={[0.3 - o * 0.6, 0.3 - o * 0.6, 0.09, 64]} /></mesh>)}
          </group>
        ) },
      { id: `collar${s > 0 ? 'R' : 'L'}`, name: 'Spin-lock collar', info: 'Threaded collars that lock plates in place with a quarter turn.', origin: [s * 0.62, 0.3, 0], label: [s * 0.66, 0.42, 0.1], window: [0, 0.5], ex: { p: [s * 1.1, 0.25, 0], r: [s * 1.2, 0, 0] },
        render: (m) => <mesh material={m('collar')} position={[s * 0.62, 0.3, 0]} rotation-z={H}><cylinderGeometry args={[0.1, 0.1, 0.08, 32]} /></mesh> },
    ]),
  ],
}

export const bottle = {
  id: 'bottle', view: view(0.75, 3.8), shadowY: 0, baseRotation: [0, 0.4, 0],
  materials: { steel: { color: '#3c5a7a', metalness: 0.7, roughness: 0.35, clearcoat: 0.6 }, cap: { color: '#1d1e21', roughness: 0.5 }, sleeve: { color: '#d7d1c5', roughness: 0.95 }, inner: { color: '#d9dce1', metalness: 1, roughness: 0.2 } },
  parts: [
    { id: 'body', name: 'Double-wall body', info: 'Vacuum-insulated 18/8 steel: cold for 24 hours, hot for 12.', label: [0.3, 0.7, 0.2], window: [0, 1], render: (m) => <Lathe pts={[[0, 0], [0.3, 0], [0.32, 0.05], [0.32, 1.2], [0.28, 1.35], [0.2, 1.42], [0, 1.42]]} material={m('steel')} /> },
    { id: 'inner', name: 'Copper-lined wall', info: 'A copper layer between the walls reflects heat back into your drink.', origin: [0, 0.7, 0], label: [-0.2, 0.7, 0.1], window: [0.3, 1], ex: { p: [-0.85, 0.2, 0] }, render: (m) => <mesh material={m('inner')} position={[0, 0.68, 0]}><cylinderGeometry args={[0.27, 0.27, 1.25, 64]} /></mesh> },
    { id: 'sleeve', name: 'Grip sleeve', info: 'A removable cork-blend sleeve so the bottle never feels too cold to hold.', origin: [0, 0.55, 0], label: [0.35, 0.5, 0.1], window: [0.2, 0.75], ex: { p: [0.85, 0.1, 0] }, render: (m) => <mesh material={m('sleeve')} position={[0, 0.55, 0]}><cylinderGeometry args={[0.335, 0.335, 0.5, 96, 1, true]} /></mesh> },
    { id: 'cap', name: 'Leak-proof cap', info: 'A carry-loop cap with a double seal, tested upside down for 72 hours.', origin: [0, 1.5, 0], label: [0.2, 1.62, 0], window: [0, 0.5], ex: { p: [0, 0.8, 0] },
      render: (m) => (
        <group position={[0, 1.5, 0]}>
          <mesh material={m('cap')}><cylinderGeometry args={[0.21, 0.22, 0.16, 48]} /></mesh>
          <mesh material={m('cap')} position={[0, 0.12, 0]}><torusGeometry args={[0.1, 0.022, 10, 32]} /></mesh>
        </group>
      ) },
  ],
}

export const sunglasses = {
  id: 'sunglasses', view: { ...view(0.2, 2.8), pos: [0.6, 0.6, 2.8] }, shadowY: -0.25, baseRotation: [0, -0.35, 0],
  materials: { acetate: { color: '#2a1d16', roughness: 0.25, clearcoat: 1 }, lens: { color: '#2b3a4a', roughness: 0.05, metalness: 0.3, transmission: 0.35, thickness: 0.05, iridescence: 0.6 }, metal: { color: '#d8b46a', metalness: 1, roughness: 0.25 } },
  parts: [
    { id: 'frame', name: 'Acetate frame', info: 'Hand-polished Italian acetate, cut and tumbled for three days.', label: [0, 0.38, 0.05], window: [0, 1],
      render: (m) => (
        <group position={[0, 0.2, 0]}>
          {[-0.36, 0.36].map((x) => <mesh key={x} material={m('acetate')} position={[x, 0, 0]} scale={[1.15, 0.9, 1]}><torusGeometry args={[0.27, 0.045, 16, 64]} /></mesh>)}
          <mesh material={m('acetate')} position={[0, 0.08, 0]}><boxGeometry args={[0.2, 0.05, 0.05]} /></mesh>
        </group>
      ) },
    ...[1, -1].map((s) => ({
      id: `lens${s > 0 ? 'R' : 'L'}`, name: 'Polarised lens', info: 'Category 3 polarised lenses with full UV400 protection.', origin: [s * 0.36, 0.2, 0], label: [s * 0.36, 0.2, 0.05], window: [0.3, 0.9], ex: { p: [0, 0, 0.7] },
      render: (m) => <mesh material={m('lens')} position={[s * 0.36, 0.2, 0]} rotation-x={H} scale={[1.15, 1, 0.9]}><cylinderGeometry args={[0.26, 0.26, 0.02, 64]} /></mesh>,
    })),
    ...[1, -1].map((s) => ({
      id: `temple${s > 0 ? 'R' : 'L'}`, name: 'Spring-hinge temple', info: 'Five-barrel spring hinges that flex outward for a comfortable fit.', origin: [s * 0.68, 0.24, -0.4], label: [s * 0.7, 0.3, -0.5], window: [0, 0.6], ex: { p: [s * 0.5, 0, -0.2], r: [0, s * 0.6, 0] },
      render: (m) => (
        <group position={[s * 0.68, 0.24, -0.4]}>
          <mesh material={m('acetate')}><boxGeometry args={[0.04, 0.05, 0.8]} /></mesh>
          <mesh material={m('metal')} position={[0, 0, 0.4]}><boxGeometry args={[0.045, 0.03, 0.05]} /></mesh>
        </group>
      ),
    })),
  ],
}

export const notebook = {
  id: 'notebook', view: { ...view(0.2, 3.2), pos: [1.4, 1.6, 2.4] }, shadowY: 0, baseRotation: [0, 0.4, 0],
  materials: { cover: { color: '#2f4a3a', roughness: 0.7, sheen: 0.5 }, paper: { color: '#f4efe4', roughness: 0.95 }, band: { color: '#1b1c1f', roughness: 0.6 }, ribbon: { color: '#2b44ff', roughness: 0.6 } },
  parts: [
    { id: 'back', name: 'Back cover', info: 'Vegan leather over a rigid board, with an expanding pocket inside.', label: [0.5, 0.02, 0.3], window: [0, 1], render: (m) => <RoundedBox args={[1.0, 0.03, 1.42]} radius={0.01} position={[0, 0.015, 0]} material={m('cover')} /> },
    { id: 'pages', name: '192 dotted pages', info: '100 gsm acid-free paper that takes fountain pen ink without bleeding.', origin: [0, 0.09, 0], label: [-0.3, 0.12, 0.3], window: [0.25, 0.85], ex: { p: [0, 0.55, 0] }, render: (m) => <mesh material={m('paper')} position={[0, 0.09, 0]}><boxGeometry args={[0.96, 0.12, 1.38]} /></mesh> },
    { id: 'cover', name: 'Front cover', info: 'Lies completely flat when open thanks to a stitched, sewn spine.', origin: [0, 0.165, 0], label: [0.3, 0.2, 0.3], window: [0.4, 1], path: 'hinge', hinge: { pivot: [-0.5, 0.165, 0], axis: 'z', angle: 2.6 }, render: (m) => <RoundedBox args={[1.0, 0.03, 1.42]} radius={0.01} position={[0, 0.165, 0]} material={m('cover')} /> },
    { id: 'band', name: 'Elastic band', info: 'A closure band that keeps loose notes safely inside.', origin: [0.38, 0.1, 0], label: [0.38, 0.25, 0.4], window: [0, 0.45], ex: { p: [0.6, 0.4, 0] }, render: (m) => <mesh material={m('band')} position={[0.38, 0.1, 0]}><boxGeometry args={[0.04, 0.19, 1.44]} /></mesh> },
    { id: 'ribbon', name: 'Ribbon marker', info: 'Two satin markers so you never lose your place.', origin: [0.1, 0.17, 0.72], label: [0.1, 0.2, 0.8], window: [0.1, 0.6], ex: { p: [0, 0.3, 0.4] }, render: (m) => <mesh material={m('ribbon')} position={[0.1, 0.17, 0.78]}><boxGeometry args={[0.03, 0.005, 0.2]} /></mesh> },
  ],
}
