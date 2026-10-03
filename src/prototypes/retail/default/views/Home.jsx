/* eslint-disable react-hooks/immutability -- scroll and frame loops write into shared refs */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import SceneCanvas from '../../../core/SceneCanvas'
import { useCapabilities } from '../../../core/useCapabilities'
import ProductModel from '../engine/ProductModel'
import { HudProjector, StudioLights } from '../engine/Stage'
import { MODELS } from '../models'
import { CATEGORIES, HERO_ORDER, PRODUCTS, findProduct } from '../data/catalog'
import { addDays, discountPct, inr } from '../data/commerce'
import { MEDIA, imageOf } from '../data/images'
import { useNav, useStore } from '../store'
import { Magnetic, Price, ProductImage, Rating } from '../ui/bits'

gsap.registerPlugin(ScrollTrigger)

const ease = [0.16, 1, 0.3, 1]
// Pinned sections start below the fixed header, so it never covers their top edge.
const belowHeader = () => `top ${document.querySelector('.gx-header')?.offsetHeight || 0}px`
const STAGES = [
  ['Product', 'A full-frame camera, exactly as it leaves the factory.'],
  ['Rotate', 'It turns in the light. Every surface is engineered.'],
  ['Explode', 'Lens forward, board and screen apart, battery out.'],
  ['Explore', 'Tap any component to open it in 3D and learn what it does.'],
  ['Assemble', 'Every component returns to its exact original position.'],
  ['Shop', 'Now you know it inside out. Make it yours.'],
]
const stageAt = (t) => (t < 0.12 ? 0 : t < 0.3 ? 1 : t < 0.5 ? 2 : t < 0.68 ? 3 : t < 0.86 ? 4 : 5)

// Scroll position -> time in the camera film. The film explodes around 1.9–3.6 s and
// re-assembles by 7.1 s, so EXPLORE holds on the fully exploded frame.
const filmTime = (t) => {
  const seg = (a, b, x0, x1) => x0 + ((t - a) / (b - a)) * (x1 - x0)
  if (t < 0.3) return seg(0, 0.3, 0, 1.9)
  if (t < 0.5) return seg(0.3, 0.5, 1.9, 3.6)
  if (t < 0.68) return 3.6
  if (t < 0.86) return seg(0.68, 0.86, 3.6, 7.1)
  return seg(0.86, 1, 7.1, 9.95)
}

// Component positions in the exploded frame (3.6 s), as % of the 1280×720 film.
const FILM_PARTS = [
  ['lens', 'Front element', 14.5, 52.8],
  ['rings', 'Focus & zoom rings', 29.3, 51.4],
  ['body', 'Body & lens mount', 48, 51.4],
  ['sensor', 'Sensor & processor', 63.7, 50.7],
  ['display', 'Vari-angle display', 79.3, 53.5],
  ['buttons', 'Top plate & dials', 50, 24.3],
  ['internals', 'Main logic board', 52.3, 72],
  ['battery', 'Battery', 52, 82.6],
]

/** Scrubs a <video> toward a target time with easing, so scroll feels smooth even with sparse keyframes. */
function useScrub(video) {
  const target = useRef(0)
  useEffect(() => {
    let raf
    let current = 0
    const loop = () => {
      const v = video.current
      if (v && v.readyState >= 1) {
        current += (target.current - current) * 0.16
        if (Math.abs(v.currentTime - current) > 0.02 && !v.seeking) v.currentTime = current
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [video])
  return target
}

function Hero() {
  const root = useRef(null)
  const video = useRef(null)
  const target = useScrub(video)
  const [stage, setStage] = useState(0)
  const caps = useCapabilities()
  const { state, dispatch } = useStore()
  const nav = useNav()
  const p = findProduct('camera')

  useLayoutEffect(() => {
    if (caps.reducedMotion) return undefined
    const ctx = gsap.context(() => {
      gsap.from('.gx-hero-title .w > span', { yPercent: 110, skewY: 8, duration: 1.2, stagger: 0.08, ease: 'expo.out', delay: 0.15 })
      ScrollTrigger.create({
        trigger: root.current,
        start: belowHeader,
        end: '+=520%',
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          target.current = filmTime(self.progress)
          const s = stageAt(self.progress)
          setStage((cur) => (cur === s ? cur : s))
        },
      })
      gsap.to('.gx-hero-title', { scale: 0.42, transformOrigin: '0% 0%', ease: 'none', scrollTrigger: { trigger: root.current, start: belowHeader, end: '+=60%', scrub: true } })
    }, root)
    return () => ctx.revert()
  }, [caps.reducedMotion, target])

  const comparing = state.compare.includes('camera')
  const shop = caps.reducedMotion || stage === 5
  return (
    <section ref={root} className="gx-hero">
      <div className="gx-film" aria-hidden="true">
        <video
          ref={video}
          src={MEDIA.cameraFilm}
          poster={caps.reducedMotion ? MEDIA.cameraEnd : MEDIA.cameraPoster}
          muted
          playsInline
          preload="auto"
        />
        <div className={`gx-film-labels ${stage === 3 ? 'show' : ''}`}>
          {FILM_PARTS.map(([part, name, x, y], i) => (
            <button
              key={part}
              className="gx-plabel film"
              style={{ left: `${x}%`, top: `${y}%`, transitionDelay: `${i * 40}ms` }}
              tabIndex={stage === 3 ? 0 : -1}
              onClick={() => nav.go('product', { id: 'camera', part })}
            >
              <i /><span>{name}</span>
            </button>
          ))}
        </div>
      </div>

      <h1 className="gx-hero-title" aria-label="Don't just shop. Build your product.">
        <span className="w"><span>DON&apos;T JUST SHOP.</span></span>
        <span className="w accent"><span>BUILD YOUR PRODUCT.</span></span>
      </h1>
      <p className="gx-hero-sub">Explore products from the inside out.</p>

      <ol className="gx-hero-steps" aria-label="Story progress">
        {STAGES.map(([name], i) => <li key={name} className={i === stage ? 'on' : i < stage ? 'done' : ''}><i>{String(i + 1).padStart(2, '0')}</i>{name}</li>)}
      </ol>

      <AnimatePresence mode="wait">
        {!shop ? (
          <motion.p key={stage} className="gx-hero-caption" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5, ease }}>
            <b>{STAGES[stage][0]}</b>{STAGES[stage][1]}
          </motion.p>
        ) : (
          <motion.div key="shop" className="gx-hero-shop" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease }}>
            <span className="gx-eyebrow">{p.brand}</span>
            <h2>{p.name}</h2>
            <div className="gx-row wrap"><Price p={p} size="lg" /><Rating p={p} /></div>
            <div className="gx-row wrap">
              <button className="gx-btn" onClick={() => { dispatch({ type: 'add', line: { id: 'camera', color: 0 } }); dispatch({ type: 'toast', text: `${p.name} added to bag` }) }}>Add to Bag</button>
              <button className="gx-btn dark" onClick={() => { dispatch({ type: 'add', line: { id: 'camera', color: 0 } }); nav.go('checkout', { step: 'address' }) }}>Buy Now</button>
              <button className="gx-link" onClick={() => dispatch({ type: 'compare', id: 'camera' })}>{comparing ? '✓ Comparing' : '⇄ Compare'}</button>
              <button className="gx-link" onClick={() => nav.go('product', { id: 'camera' })}>Explore specifications →</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <span className="gx-scroll-cue">Scroll to build</span>
    </section>
  )
}

// The showroom film walks past the six products in the same order as HERO_ORDER, ~1.43 s apart.
const TOUR = HERO_ORDER.map((id, i) => ({ id, at: 1.43 * (i + 1) }))

function Walkthrough() {
  const root = useRef(null)
  const video = useRef(null)
  const target = useScrub(video)
  const [chapter, setChapter] = useState(-1)
  const caps = useCapabilities()
  const { dispatch } = useStore()
  const nav = useNav()

  useLayoutEffect(() => {
    if (caps.reducedMotion) return undefined
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current,
        start: belowHeader,
        end: '+=640%',
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const vt = self.progress * 9.95
          target.current = vt
          const c = vt < 0.75 ? -1 : vt > 9.3 ? 6 : TOUR.findIndex((s) => Math.abs(vt - s.at) <= 0.715)
          setChapter((cur) => (cur === c ? cur : c))
        },
      })
    }, root)
    return () => ctx.revert()
  }, [caps.reducedMotion, target])

  const item = chapter >= 0 && chapter < 6 ? findProduct(TOUR[chapter].id) : null
  return (
    <section ref={root} className="gx-tour" aria-label="Walk through the exhibition">
      <div className="gx-film">
        <video ref={video} src={MEDIA.showroomFilm} poster={MEDIA.showroomPoster} muted playsInline preload="auto" controls={caps.reducedMotion} />
      </div>
      <div className="gx-tour-rail" aria-hidden="true">
        {TOUR.map((s, i) => <i key={s.id} className={i === chapter ? 'on' : i < chapter ? 'done' : ''} />)}
      </div>
      <AnimatePresence mode="wait">
        {chapter === -1 && (
          <motion.div key="intro" className="gx-tour-copy" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6, ease }}>
            <span className="gx-eyebrow">The exhibition</span>
            <h2>Walk the gallery.</h2>
            <p>Six objects, each shown the way it is built. Keep scrolling.</p>
          </motion.div>
        )}
        {item && (
          <motion.div key={item.id} className="gx-tour-card" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.55, ease }}>
            <span className="gx-eyebrow">{String(chapter + 1).padStart(2, '0')} / 06 · {item.brand}</span>
            <h2>{item.name}</h2>
            <p>{item.tagline}</p>
            <div className="gx-row wrap"><Price p={item} /><Rating p={item} /></div>
            <div className="gx-row wrap">
              <button className="gx-btn dark" onClick={() => nav.go('product', { id: item.id })}>Explore in 3D</button>
              {!item.sizes && <button className="gx-btn" onClick={() => { dispatch({ type: 'add', line: { id: item.id, color: 0 } }); dispatch({ type: 'toast', text: `${item.name} added to bag` }) }}>Add to Bag</button>}
            </div>
          </motion.div>
        )}
        {chapter === 6 && (
          <motion.div key="end" className="gx-tour-copy" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease }}>
            <span className="gx-eyebrow">The collection</span>
            <h2>Now build yours.</h2>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function CategoryExhibit() {
  const [active, setActive] = useState(CATEGORIES[0].id)
  const nav = useNav()
  const root = useRef(null)
  const cat = CATEGORIES.find((c) => c.id === active)
  const items = PRODUCTS.filter((p) => p.category === active).slice(0, 3)

  // Pointer parallax for the floating composition.
  useEffect(() => {
    const el = root.current
    const move = (e) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
      el.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
    }
    el.addEventListener('pointermove', move)
    return () => el.removeEventListener('pointermove', move)
  }, [])

  return (
    <section ref={root} className="gx-cats" data-env={cat.env}>
      <div className="gx-env" aria-hidden="true" />
      <div className="gx-cats-rail" role="tablist" aria-label="Categories">
        {CATEGORIES.map((c, i) => (
          <button key={c.id} role="tab" aria-selected={c.id === active} className={c.id === active ? 'on' : ''} onClick={() => setActive(c.id)}>
            <sup>{String(i + 1).padStart(2, '0')}</sup>{c.label}
          </button>
        ))}
      </div>
      <div className="gx-cats-body">
        <AnimatePresence mode="wait">
          <motion.div key={cat.id} className="gx-cats-copy" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.6, ease }}>
            <span className="gx-eyebrow">{cat.line}</span>
            <h2>{cat.label}</h2>
            <p>{cat.blurb}</p>
            <Magnetic className="gx-btn" onClick={() => nav.go('shop', { cat: cat.id })}>Enter {cat.label} →</Magnetic>
          </motion.div>
        </AnimatePresence>
        <div className="gx-cats-comp">
          <AnimatePresence mode="popLayout">
            {items.map((p, i) => (
              <motion.button
                key={`${cat.id}-${p.id}`}
                className={`gx-float f${i}`}
                initial={{ opacity: 0, y: 80, rotate: i % 2 ? 6 : -6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, y: -60, scale: 0.94 }}
                transition={{ duration: 0.9, ease, delay: i * 0.08 }}
                onClick={() => nav.go('product', { id: p.id })}
              >
                <ProductImage id={p.id} peek={Boolean(p.hero)} />
                <span className="gx-float-meta">
                  <b>{p.name}</b>
                  <Price p={p} size="sm" />
                  <small><Rating p={p} compact /> · Free delivery by {addDays(p.deliveryDays)}</small>
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function Discovery() {
  const root = useRef(null)
  const track = useRef(null)
  const caps = useCapabilities()
  const { state, dispatch } = useStore()
  const nav = useNav()
  const list = useMemo(() => [...HERO_ORDER.map(findProduct), ...PRODUCTS.filter((p) => !p.hero)], [])

  useLayoutEffect(() => {
    if (caps.reducedMotion || window.matchMedia('(max-width: 860px)').matches) return undefined
    const ctx = gsap.context(() => {
      const distance = () => track.current.scrollWidth - window.innerWidth + 80
      gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: belowHeader, end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true },
      })
    }, root)
    return () => ctx.revert()
  }, [caps.reducedMotion])

  return (
    <section ref={root} className="gx-disc">
      <div className="gx-disc-head">
        <span className="gx-eyebrow">The edit · {list.length} products</span>
        <h2>Discover, then take it apart.</h2>
        <button className="gx-link" onClick={() => nav.go('shop')}>See everything →</button>
      </div>
      <div ref={track} className="gx-disc-track">
        {list.map((p, i) => {
          const wished = state.wishlist.includes(p.id)
          return (
            <article key={p.id} className={`gx-tile ${i % 3 === 1 ? 'tall' : ''}`}>
              <button className="gx-tile-img" onClick={() => nav.go('product', { id: p.id })} aria-label={`Open ${p.name}`}>
                <ProductImage id={p.id} peek={Boolean(p.hero)} />
                {p.hero && <span className="gx-badge">3D · Explode</span>}
                {discountPct(p) >= 25 && <span className="gx-badge off">{discountPct(p)}% OFF</span>}
              </button>
              <div className="gx-tile-meta">
                <span className="gx-eyebrow">{p.brand}</span>
                <h3>{p.name}</h3>
                <Price p={p} />
                <div className="gx-row"><Rating p={p} /><span className={`gx-avail ${p.stock !== 'In stock' ? 'low' : ''}`}>{p.stock}</span></div>
                <small>Free delivery by {addDays(p.deliveryDays)} · {p.returns}</small>
                <div className="gx-row">
                  <button className={`gx-icon ${wished ? 'on' : ''}`} aria-pressed={wished} aria-label="Wishlist" onClick={() => dispatch({ type: 'wish', id: p.id })}>{wished ? '♥' : '♡'}</button>
                  <button className={`gx-icon ${state.compare.includes(p.id) ? 'on' : ''}`} aria-pressed={state.compare.includes(p.id)} aria-label="Compare" onClick={() => dispatch({ type: 'compare', id: p.id })}>⇄</button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

// Collection: the six finished products drift from a loose scatter into an exhibition arc.
const ARC = HERO_ORDER.map((id, i) => {
  const a = (i - 2.5) * 0.42
  return { id, x: Math.sin(a) * 6.2, z: -Math.cos(a) * 3 + 3, scatter: [(i - 2.5) * 3.4, (i % 2 ? 2.6 : -1.8), -4 - (i % 3) * 2] }
})
const FIT = { camera: [1.3, 0.75], sneaker: [1.15, 0.1], watch: [0.78, 1.1], headphones: [0.82, 1.15], handbag: [1.1, 0.05], laptop: [1.2, 0.2] }

function CollectionItem({ item, arrange, hud, onPick }) {
  const g = useRef()
  const def = MODELS[item.id]
  const progress = useRef(0)
  const p = findProduct(item.id)
  const [s, y] = FIT[item.id]
  const tmp = useMemo(() => new THREE.Vector3(), [])
  useFrame((state, delta) => {
    const t = arrange.current
    tmp.set(THREE.MathUtils.lerp(item.scatter[0], item.x, t), THREE.MathUtils.lerp(item.scatter[1], 0, t), THREE.MathUtils.lerp(item.scatter[2], item.z, t))
    g.current.position.lerp(tmp, 1 - Math.exp(-delta * 4))
    g.current.rotation.y += delta * 0.25
  })
  return (
    <group ref={g} position={item.scatter}>
      <group position={[0, y, 0]} scale={s} onClick={(e) => { e.stopPropagation(); onPick(item.id) }} onPointerOver={() => { document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = '' }}>
        <ProductModel def={def} colors={p.variants?.colors?.[0]?.colors} progress={progress} />
      </group>
      <group ref={(n) => { hud.anchors[item.id] = n }} position={[0, -1.1, 0]} />
    </group>
  )
}

function Collection() {
  const root = useRef(null)
  const arrange = useRef(0)
  const nav = useNav()
  const caps = useCapabilities()
  const [hud] = useState(() => ({ labels: {}, anchors: {} }))

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top 70%',
        end: 'center center',
        scrub: 1,
        onUpdate: (self) => { arrange.current = caps.reducedMotion ? 1 : self.progress },
      })
    }, root)
    if (caps.reducedMotion) arrange.current = 1
    return () => ctx.revert()
  }, [caps.reducedMotion])

  return (
    <section ref={root} className="gx-coll">
      <div className="gx-coll-head">
        <span className="gx-eyebrow">The collection</span>
        <h2>Six products. Built in front of you.</h2>
      </div>
      <div className="gx-coll-stage">
        <SceneCanvas camera={{ position: [0, 2.4, 11], fov: 34 }} fallback={<div className="gx-coll-fallback">{HERO_ORDER.map((id) => <button key={id} onClick={() => nav.go('product', { id })}><img src={imageOf(id)} alt={findProduct(id).name} /></button>)}</div>}>
          {({ tier }) => (
            <>
              <StudioLights shadows={tier === 'full'} shadowY={-1.25} shadowScale={22} />
              <group position={[0, 0, -1]}>
                {ARC.map((item) => <CollectionItem key={item.id} item={item} arrange={arrange} hud={hud} onPick={(id) => nav.go('product', { id })} />)}
              </group>
              <HudProjector hud={hud} ids={HERO_ORDER} />
            </>
          )}
        </SceneCanvas>
        <div className="gx-labels show">
          {HERO_ORDER.map((id) => {
            const p = findProduct(id)
            return (
              <button key={id} ref={(el) => { hud.labels[id] = el }} className="gx-coll-label" onClick={() => nav.go('product', { id })}>
                <b>{p.name}</b><span>{inr(p.price)}</span>
              </button>
            )
          })}
        </div>
      </div>
      <div className="gx-coll-cta">
        <Magnetic className="gx-btn dark xl" onClick={() => nav.go('shop')}>EXPLORE THE COLLECTION</Magnetic>
        <Magnetic className="gx-btn ghost xl" onClick={() => nav.go('product', { id: 'camera' })}>START BUILDING</Magnetic>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div className="gx-home">
      <Hero />
      <CategoryExhibit />
      <Discovery />
      <Walkthrough />
      <Collection />
    </div>
  )
}
