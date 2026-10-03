 
const H = Math.PI / 2
const PI = Math.PI

// Built symmetrically: every cup-side part is generated for side = 1 (right) and -1 (left).
function cupParts(side) {
  const s = side > 0 ? 'R' : 'L'
  const x = side * 1.12
  const label = side > 0 ? 'Right' : 'Left'
  return [
    {
      id: `cup${s}`, name: `${label} ear cup`, info: 'A single-piece aluminium cup on a two-axis yoke, so the seal adapts to your head shape.',
      origin: [x, -0.3, 0], label: [x + side * 0.2, -0.1, 0.3], window: [0.15, 0.6], ex: { p: [side * 0.95, -0.15, 0] },
      render: (m) => (
        <group position={[x, -0.3, 0]} scale={[side, 1, 1]}>
          <mesh material={m('body')} rotation-z={H}><cylinderGeometry args={[0.56, 0.52, 0.3, 96]} /></mesh>
          <mesh material={m('metal')} position={[0.17, 0, 0]} rotation-z={H}><cylinderGeometry args={[0.47, 0.47, 0.07, 96]} /></mesh>
          <mesh material={m('metal')} position={[0.205, 0, 0]} rotation-y={H}><torusGeometry args={[0.5, 0.016, 12, 128]} /></mesh>
          <mesh material={m('metal')} position={[0, 0.7, 0]}><cylinderGeometry args={[0.045, 0.045, 0.2, 20]} /></mesh>
          <mesh material={m('metal')} rotation-y={H}><torusGeometry args={[0.6, 0.045, 14, 72, PI]} /></mesh>
        </group>
      ),
    },
    {
      id: `driver${s}`, name: '40 mm beryllium driver', info: 'A vapour-deposited beryllium dome: light and rigid, so detail stays clean right through the top end.',
      origin: [x - side * 0.1, -0.3, 0], label: [x - side * 0.1, 0.05, 0.25], window: [0.4, 0.85], ex: { p: [side * 0.35, -0.15, 0.9] },
      render: (m) => (
        <group position={[x - side * 0.1, -0.3, 0]} scale={[side, 1, 1]} rotation-z={H}>
          <mesh material={m('frame')}><cylinderGeometry args={[0.36, 0.36, 0.05, 64]} /></mesh>
          <mesh material={m('cone')} position={[0, -0.04, 0]}><coneGeometry args={[0.3, 0.1, 64, 1, true]} /></mesh>
          <mesh material={m('dome')} position={[0, -0.06, 0]} scale={[1, 0.4, 1]}><sphereGeometry args={[0.1, 32, 16]} /></mesh>
        </group>
      ),
    },
    {
      id: `cushion${s}`, name: 'Memory-foam cushion', info: 'Protein leather over slow-recovery foam. Magnetic, so a fresh pair clicks on in seconds.',
      origin: [x - side * 0.27, -0.3, 0], label: [x - side * 0.3, -0.62, 0.3], window: [0.5, 1], ex: { p: [-side * 0.55, -0.15, 0.8] },
      render: (m) => (
        <mesh material={m('soft')} position={[x - side * 0.27, -0.3, 0]} rotation-y={H} scale={[1, 1, 0.8]}>
          <torusGeometry args={[0.37, 0.17, 28, 80]} />
        </mesh>
      ),
    },
  ]
}

export const headphones = {
  id: 'headphones',
  view: { pos: [1.6, 0.7, 4.8], target: [0, 0.1, 0], fov: 32, minDistance: 2.6, maxDistance: 9, explodedPos: [3.0, 2.2, 7.8], explodedTarget: [0, 0.45, 0.3] },
  baseRotation: [0, -0.4, 0],
  shadowY: -1.15,
  materials: {
    body: { color: '#2b2d32', roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.35 },
    band: { color: '#2b2d32', roughness: 0.8 },
    metal: { color: '#b5bac2', metalness: 0.85, roughness: 0.26 },
    soft: { color: '#1b1b1e', roughness: 0.92 },
    frame: { color: '#45484f', metalness: 0.7, roughness: 0.4 },
    cone: { color: '#d9d4c8', roughness: 0.6, side: 2 },
    dome: { color: '#e9e2cf', metalness: 1, roughness: 0.15 },
    accent: { color: '#2b44ff', roughness: 0.35, emissive: '#2b44ff', emissiveIntensity: 0.25 },
  },
  parts: [
    {
      id: 'band', name: 'Aluminium headband', info: 'A single-piece arc with a suspended inner strap that spreads 258 g across the crown.',
      origin: [0, 1.0, 0], label: [0.3, 1.55, 0.1], window: [0, 0.45], ex: { p: [0, 1.05, 0] },
      render: (m) => (
        <group position={[0, 0.5, 0]}>
          <mesh material={m('band')}><torusGeometry args={[1.12, 0.085, 24, 140, PI]} /></mesh>
          <mesh material={m('soft')} scale={[1, 1, 0.9]}><torusGeometry args={[1.03, 0.055, 18, 140, PI * 0.78]} /></mesh>
          <mesh material={m('metal')}><torusGeometry args={[1.12, 0.03, 12, 140, PI]} /></mesh>
        </group>
      ),
    },
    ...cupParts(1),
    ...cupParts(-1),
    {
      id: 'control', name: 'Control module', info: 'A knurled volume dial and three-way noise switch, operable by feel. 38 h battery inside.',
      origin: [1.45, -0.62, 0.22], label: [1.62, -0.7, 0.3], window: [0.25, 0.7], ex: { p: [1.1, -0.55, 0.5] },
      render: (m) => (
        <group position={[1.45, -0.62, 0.22]}>
          <mesh material={m('metal')} rotation={[H, 0, H]}><cylinderGeometry args={[0.08, 0.08, 0.08, 32]} /></mesh>
          <mesh material={m('accent')} position={[0.045, 0, 0]} rotation={[H, 0, H]}><cylinderGeometry args={[0.03, 0.03, 0.01, 20]} /></mesh>
        </group>
      ),
    },
  ],
}
