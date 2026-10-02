import { useRef } from 'react'
import { gsap, useMotion } from '../motion'
import { Split } from '../Split'
import { SIGNATURE, findDish, inr } from '../data'

// Three asymmetric compositions, each with its own reveal: wipe, rise, iris.
const LAYOUTS = ['wide', 'tall', 'iris']

export default function Signature({ openDish }) {
  const root = useRef(null)

  useMotion(root, () => {
    // Heading words arrive from alternating directions as the section scrolls in.
    gsap.utils.toArray('.me-sig-head .me-w').forEach((w, i) => {
      const dir = [[0, -120], [140, 0], [0, 120], [-140, 0]][i % 4]
      gsap.fromTo(w, { x: dir[0], y: dir[1], opacity: 0 }, {
        x: 0, y: 0, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: '.me-sig-head', start: 'top 95%', end: 'top 35%', scrub: 1 },
      })
    })

    gsap.utils.toArray('.me-sig-row').forEach((row) => {
      const kind = row.dataset.kind
      const media = row.querySelector('.me-sig-media')
      const img = row.querySelector('img')
      const title = row.querySelectorAll('.me-sig-title .me-c')
      const st = { trigger: row, start: 'top 78%', toggleActions: 'play none none reverse' }

      const from = {
        wide: 'inset(0% 100% 0% 0%)',
        tall: 'inset(100% 0% 0% 0%)',
        iris: 'circle(0% at 50% 50%)',
      }[kind]
      const to = { wide: 'inset(0% 0% 0% 0%)', tall: 'inset(0% 0% 0% 0%)', iris: 'circle(75% at 50% 50%)' }[kind]

      const tl = gsap.timeline({ scrollTrigger: st })
      tl.fromTo(media, { clipPath: from }, { clipPath: to, duration: 1.5, ease: 'expo.inOut' })
      if (kind === 'wide') tl.from(title, { xPercent: -100, opacity: 0, stagger: 0.025, duration: 1, ease: 'expo.out' }, 0.5)
      if (kind === 'tall') tl.from(title, { scaleX: 2.4, opacity: 0, transformOrigin: '0% 50%', stagger: 0.02, duration: 1.2, ease: 'expo.out' }, 0.5)
      if (kind === 'iris') {
        tl.from(title, {
          x: () => gsap.utils.random(-220, 220), y: () => gsap.utils.random(-90, 90), rotate: () => gsap.utils.random(-25, 25),
          opacity: 0, stagger: 0.015, duration: 1.3, ease: 'expo.out',
        }, 0.5)
      }
      tl.from(row.querySelectorAll('.me-sig-meta > *'), { clipPath: 'inset(0 0 100% 0)', y: 20, stagger: 0.08, duration: 0.8, ease: 'power3.out' }, 0.9)

      // Parallax inside the frame.
      gsap.fromTo(img, { yPercent: -8, scale: 1.18 }, {
        yPercent: 8, scale: 1.05, ease: 'none',
        scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })
  })

  return (
    <section id="signature" ref={root} className="me-sig">
      <div className="me-sig-intro">
        <span className="me-eyebrow">Signature · 01 — 03</span>
        <h2 className="me-sig-head"><Split text="Three plates worth crossing the city for" chars={false} /></h2>
      </div>

      {SIGNATURE.map((id, i) => {
        const dish = findDish(id)
        const kind = LAYOUTS[i]
        return (
          <article key={id} className={`me-sig-row is-${kind}`} data-kind={kind}>
            <button className="me-sig-media" onClick={(e) => openDish(id, e)} data-cursor="View" aria-label={`View ${dish.name}`}>
              <img src={dish.img} alt={dish.name} loading="lazy" />
            </button>
            <div className="me-sig-text">
              <span className="me-sig-num">0{i + 1}</span>
              <h3 className="me-sig-title"><Split text={dish.name} /></h3>
              <div className="me-sig-meta">
                <p>{dish.desc}</p>
                <div className="me-sig-actions">
                  <span className="me-price">{inr(dish.price)}</span>
                  <button className="me-link-btn" onClick={(e) => openDish(id, e)}>Discover the dish <i>→</i></button>
                </div>
              </div>
            </div>
          </article>
        )
      })}
    </section>
  )
}
