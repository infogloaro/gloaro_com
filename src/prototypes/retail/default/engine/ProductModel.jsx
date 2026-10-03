/* eslint-disable react-hooks/immutability -- three.js objects and the shared HUD registry are mutated in frame loops by design */
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { applyPart } from './choreo'
import { MaterialBank } from './materials'

/**
 * Renders a product definition (see models/*.jsx). The same component drives the hero,
 * the product page, the collection and thumbnail capture, so a real GLB can later replace
 * a part's `render` without touching any choreography or UI.
 */
function PartNode({ part, m, progress, interactive, hud, onHover, onSelect }) {
  const outer = useRef()
  const o = part.origin || [0, 0, 0]

  useFrame((state) => {
    if (outer.current) applyPart(outer.current, part, progress.current, state.clock.elapsedTime)
  })

  const handlers = interactive
    ? {
        onPointerOver: (e) => { e.stopPropagation(); onHover?.(part.id); document.body.style.cursor = 'pointer' },
        onPointerOut: () => { onHover?.(null); document.body.style.cursor = '' },
        onClick: (e) => {
          // Ignore clicks that were really drags (rotating the product).
          if (e.delta > 6) return
          e.stopPropagation()
          onSelect?.(part.id)
        },
      }
    : {}

  return (
    <group ref={outer} {...handlers}>
      <group position={[-o[0], -o[1], -o[2]]}>
        {part.render(m, { progress })}
        {hud && <group ref={(g) => { hud.anchors[part.id] = g }} position={part.label || o} />}
      </group>
    </group>
  )
}

export default function ProductModel({ def, colors, progress, focus = null, interactive = false, hud, onHover, onSelect, spin = 0 }) {
  const bank = useMemo(() => new MaterialBank(def.materials), [def])
  const root = useRef()

  useEffect(() => () => bank.dispose(), [bank])
  useEffect(() => { bank.setColors(colors) }, [bank, colors])
  useEffect(() => { bank.setFocus(focus) }, [bank, focus])

  useFrame((_, delta) => {
    bank.tick(delta)
    if (spin && root.current) root.current.rotation.y += delta * spin
  })

  return (
    <group ref={root} rotation={def.baseRotation || [0, 0, 0]} scale={def.scale || 1}>
      {def.parts.map((part) => (
        <PartNode
          key={part.id}
          part={part}
          m={(key) => bank.get(part.id, key)}
          progress={progress}
          interactive={interactive}
          hud={hud}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </group>
  )
}
