import { useEffect, useRef } from 'react'
import { useAmbient } from '../../hooks/useMotionEnv'

// Palettes per atmosphere. Low contrast on purpose: this sits behind copy and cards.
const TONES = {
  cream: { line: '8,34,75', lineAlpha: 0.11, node: '8,34,75', nodeAlpha: 0.22, stream: '8,34,75', streamAlpha: 0.06, pulse: '203,144,21', glow: ['rgba(203,144,21,0.16)', 'rgba(8,34,75,0.08)'] },
  sky: { line: '8,34,75', lineAlpha: 0.09, node: '27,111,224', nodeAlpha: 0.22, stream: '27,111,224', streamAlpha: 0.07, pulse: '203,144,21', glow: ['rgba(27,111,224,0.12)', 'rgba(203,144,21,0.10)'] },
  night: { line: '150,180,240', lineAlpha: 0.13, node: '190,210,255', nodeAlpha: 0.38, stream: '150,180,240', streamAlpha: 0.08, pulse: '233,178,62', glow: ['rgba(27,111,224,0.28)', 'rgba(203,144,21,0.14)'] },
}

const DEPTHS = [0.45, 0.7, 1]
const PULSE_MS = 2600
const STREAM_COUNT = 2

function buildNetwork(width, height) {
  const count = Math.max(14, Math.min(34, Math.round((width * height) / 38000)))
  // Jittered grid placement keeps nodes evenly spread instead of clumping.
  const cols = Math.ceil(Math.sqrt((count * width) / height))
  const rows = Math.ceil(count / cols)
  const nodes = []
  for (let i = 0; i < count; i += 1) {
    const col = i % cols
    const row = Math.floor(i / cols)
    nodes.push({
      x: ((col + 0.2 + Math.random() * 0.6) / cols) * width,
      y: ((row + 0.2 + Math.random() * 0.6) / rows) * height,
      depth: DEPTHS[i % DEPTHS.length],
      phase: Math.random() * Math.PI * 2,
      amp: 10 + Math.random() * 18,
      speed: 0.00012 + Math.random() * 0.00012,
    })
  }
  // Static topology (each node to its two nearest neighbours) so lines never
  // pop in and out as nodes drift.
  const edges = []
  const seen = new Set()
  nodes.forEach((a, i) => {
    nodes
      .map((b, j) => [j, (a.x - b.x) ** 2 + (a.y - b.y) ** 2])
      .filter(([j]) => j !== i)
      .sort((p, q) => p[1] - q[1])
      .slice(0, 2)
      .forEach(([j]) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`
        if (!seen.has(key)) {
          seen.add(key)
          edges.push([i, j])
        }
      })
  })
  return { nodes, edges }
}

// Ambient AI backdrop: a slowly breathing neural network with gold pulses
// travelling along its connections and two faint data streams. Canvas-drawn,
// paused off screen / in hidden tabs, static under reduced motion.
export default function NeuralBackground({ tone = 'cream', priority = 2, className = '' }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const active = useAmbient(wrapRef, { priority, amount: 0.15 })
  const clock = useRef(4000)
  const drawRef = useRef(null)
  const palette = TONES[tone]

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let width = 0
    let height = 0
    let network = { nodes: [], edges: [] }
    let pulses = []
    let lastSpawn = 0

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      network = buildNetwork(width, height)
      pulses = []
    }

    // `t` is the animation clock (only advances while playing); `now` is wall time for pulses.
    const draw = (t, now = performance.now()) => {
      const rect = wrap.getBoundingClientRect()
      // -0.5 … 0.5 as the section travels through the viewport; drives parallax per depth.
      const scroll = Math.max(-0.5, Math.min(0.5, (window.innerHeight / 2 - (rect.top + rect.height / 2)) / (rect.height + window.innerHeight)))
      const points = network.nodes.map((n) => [
        n.x + Math.sin(t * n.speed + n.phase) * n.amp * n.depth,
        n.y + Math.cos(t * n.speed * 0.8 + n.phase) * n.amp * 0.7 * n.depth - scroll * 90 * n.depth,
      ])

      ctx.clearRect(0, 0, width, height)

      // Data streams: faint sine paths with a brighter segment flowing along them.
      for (let s = 0; s < STREAM_COUNT; s += 1) {
        const baseY = height * (0.3 + s * 0.4) - scroll * 50
        const pathY = (x) => baseY + Math.sin(x / (220 + s * 90) + t * 0.00018 + s * 2) * (26 + s * 12)
        ctx.beginPath()
        for (let x = 0; x <= width; x += 16) ctx.lineTo(x, pathY(x))
        ctx.strokeStyle = `rgba(${palette.stream},${palette.streamAlpha})`
        ctx.lineWidth = 1
        ctx.stroke()
        const head = ((t * 0.00006 + s * 0.5) % 1) * (width + 300) - 150
        const gradient = ctx.createLinearGradient(head - 150, 0, head + 150, 0)
        gradient.addColorStop(0, `rgba(${palette.pulse},0)`)
        gradient.addColorStop(0.5, `rgba(${palette.pulse},0.35)`)
        gradient.addColorStop(1, `rgba(${palette.pulse},0)`)
        ctx.beginPath()
        for (let x = Math.max(0, head - 150); x <= Math.min(width, head + 150); x += 8) ctx.lineTo(x, pathY(x))
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      // Connections, fainter for deeper layers.
      ctx.lineWidth = 1
      for (const [i, j] of network.edges) {
        const depth = Math.min(network.nodes[i].depth, network.nodes[j].depth)
        ctx.strokeStyle = `rgba(${palette.line},${palette.lineAlpha * depth})`
        ctx.beginPath()
        ctx.moveTo(points[i][0], points[i][1])
        ctx.lineTo(points[j][0], points[j][1])
        ctx.stroke()
      }

      for (let i = 0; i < points.length; i += 1) {
        const { depth } = network.nodes[i]
        ctx.fillStyle = `rgba(${palette.node},${palette.nodeAlpha * depth})`
        ctx.beginPath()
        ctx.arc(points[i][0], points[i][1], 1.4 + depth * 1.6, 0, Math.PI * 2)
        ctx.fill()
      }

      // Occasional light pulses travelling along a connection.
      if (now - lastSpawn > 1500 && pulses.length < 3 && network.edges.length) {
        pulses.push({ edge: network.edges[Math.floor(Math.random() * network.edges.length)], born: now })
        lastSpawn = now
      }
      pulses = pulses.filter((pulse) => now - pulse.born < PULSE_MS)
      for (const pulse of pulses) {
        const progress = (now - pulse.born) / PULSE_MS
        const eased = progress < 0.5 ? 2 * progress * progress : 1 - (-2 * progress + 2) ** 2 / 2
        const [a, b] = pulse.edge
        const x = points[a][0] + (points[b][0] - points[a][0]) * eased
        const y = points[a][1] + (points[b][1] - points[a][1]) * eased
        const fade = Math.sin(progress * Math.PI)
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 14)
        glow.addColorStop(0, `rgba(${palette.pulse},${0.55 * fade})`)
        glow.addColorStop(1, `rgba(${palette.pulse},0)`)
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(x, y, 14, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    resize()
    draw(clock.current)
    const observer = new ResizeObserver(() => {
      resize()
      draw(clock.current)
    })
    observer.observe(wrap)
    drawRef.current = { draw, isPhone: () => width < 768 }
    return () => observer.disconnect()
  }, [palette])

  useEffect(() => {
    if (!active) return undefined
    let frame = 0
    let last = performance.now()
    let lastDraw = 0
    const loop = (now) => {
      clock.current += Math.min(now - last, 50)
      last = now
      // Phones get ~30fps; the motion is slow enough that it reads the same.
      if (now - lastDraw >= (drawRef.current.isPhone() ? 32 : 0)) {
        drawRef.current.draw(clock.current, now)
        lastDraw = now
      }
      frame = window.requestAnimationFrame(loop)
    }
    frame = window.requestAnimationFrame(loop)
    return () => window.cancelAnimationFrame(frame)
  }, [active])


  return (
    <div ref={wrapRef} aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
      {/* Soft volumetric light behind the network. */}
      <div className="absolute -left-[10%] top-[5%] h-[55%] w-[45%] rounded-full blur-3xl" style={{ background: palette.glow[0] }} />
      <div className="absolute -right-[8%] bottom-[0%] h-[50%] w-[40%] rounded-full blur-3xl" style={{ background: palette.glow[1] }} />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
