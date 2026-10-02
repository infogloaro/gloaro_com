import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { gsap, useMotion } from '../motion'
import { Split } from '../Split'
import { BRAND, HOURS, MEDIA } from '../data'

const QUOTE = 'A burger is architecture you can eat. Every layer has a reason to be where it is — and if it doesn’t, it doesn’t go on.'

export function Chef() {
  const root = useRef(null)
  useMotion(root, () => {
    // Words light up in reading order as you scroll — the quote is read, not faded in.
    gsap.fromTo('.me-quote .me-w', { opacity: 0.12 }, {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: '.me-quote', start: 'top 80%', end: 'bottom 45%', scrub: true },
    })
    gsap.fromTo('.me-chef-media img', { yPercent: -10 }, {
      yPercent: 10, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
    })
    gsap.fromTo('.me-chef-media', { clipPath: 'inset(0 0 0 100%)' }, {
      clipPath: 'inset(0 0 0 0%)', duration: 1.6, ease: 'expo.inOut',
      scrollTrigger: { trigger: '.me-chef-media', start: 'top 80%', toggleActions: 'play none none reverse' },
    })
    gsap.utils.toArray('.me-stat b').forEach((el) => {
      gsap.from(el, {
        textContent: 0, snap: { textContent: 1 }, duration: 2, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' },
      })
    })
  })

  return (
    <section id="chef" ref={root} className="me-chef">
      <span className="me-eyebrow">The chef</span>
      <blockquote className="me-quote"><Split text={QUOTE} chars={false} /></blockquote>
      <div className="me-chef-sign">
        <span>Arjun Mehra</span>
        <small>Chef &amp; founder · formerly of kitchens in Naples and Melbourne</small>
      </div>
      <div className="me-chef-media"><img src={MEDIA.burgerLayers} alt="The Ember Stack, every layer apart" loading="lazy" /></div>
      <div className="me-stats">
        <div className="me-stat"><b>2019</b><span>First fire lit</span></div>
        <div className="me-stat"><b>485</b><span>Degrees, every night</span></div>
        <div className="me-stat"><b>42</b><span>Seats, never more</span></div>
      </div>
    </section>
  )
}

export function Visit() {
  const root = useRef(null)
  const [copied, setCopied] = useState(false)
  const [today] = useState(() => new Date().getDay())
  const address = BRAND.address.join(', ')

  useMotion(root, () => {
    gsap.from('.me-visit-addr .me-line > span', {
      xPercent: -105, stagger: 0.12, duration: 1.2, ease: 'expo.out',
      scrollTrigger: { trigger: root.current, start: 'top 70%', toggleActions: 'play none none reverse' },
    })
    gsap.fromTo('.me-visit-media', { clipPath: 'inset(100% 0 0 0)' }, {
      clipPath: 'inset(0% 0 0 0)', duration: 1.6, ease: 'expo.inOut',
      scrollTrigger: { trigger: '.me-visit-media', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    gsap.fromTo('.me-coords', { xPercent: 15 }, {
      xPercent: -15, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
    })
  })

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address)
    } catch {
      // Clipboard can be blocked (e.g. insecure context); the confirmation still helps in a demo.
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <section id="visit" ref={root} className="me-visit">
      <div className="me-coords" aria-hidden="true">{BRAND.coords}</div>
      <div className="me-visit-grid">
        <div>
          <span className="me-eyebrow">Visit</span>
          <address className="me-visit-addr">
            {BRAND.address.map((l) => <div key={l} className="me-line"><span>{l}</span></div>)}
          </address>
          <div className="me-visit-actions">
            <a className="me-pill dark" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Maison Ember, ${address}`)}`} target="_blank" rel="noreferrer">Get directions</a>
            <a className="me-link-btn" href={`tel:${BRAND.phone.replace(/\s/g, '')}`}>{BRAND.phone} <i>→</i></a>
            <button className="me-link-btn" onClick={copy}>{copied ? 'Address copied ✓' : 'Copy address'}</button>
          </div>
          <ul className="me-hours">
            {HOURS.map((h, i) => (
              <li key={h.day} className={i === today ? 'today' : ''}>
                <span>{h.day}{i === today && <em> · today</em>}</span><span>{h.time}</span>
              </li>
            ))}
          </ul>
          <p className="me-visit-note">Valet on Khader Nawaz Khan Road · Step-free entrance</p>
        </div>
        <div className="me-visit-media"><img src={MEDIA.pizzaOven} alt="The oak-fired oven at Maison Ember" loading="lazy" /></div>
      </div>
    </section>
  )
}

function Magnetic({ children, onClick }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 16 })
  const sy = useSpring(y, { stiffness: 220, damping: 16 })
  return (
    <motion.button
      className="me-magnet"
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * 0.35)
        y.set((e.clientY - r.top - r.height / 2) * 0.35)
      }}
      onPointerLeave={() => { x.set(0); y.set(0) }}
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
    >
      {children}
    </motion.button>
  )
}

export function FinalCta({ go }) {
  const root = useRef(null)
  useMotion(root, () => {
    const st = { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true }
    gsap.fromTo('.me-cta-l1', { xPercent: 18 }, { xPercent: -12, ease: 'none', scrollTrigger: st })
    gsap.fromTo('.me-cta-l2', { xPercent: -22 }, { xPercent: 8, ease: 'none', scrollTrigger: { ...st } })
    gsap.fromTo('.me-cta-l2 em', { letterSpacing: '0.3em' }, { letterSpacing: '-0.02em', ease: 'none', scrollTrigger: { ...st, end: 'center center' } })
  })

  return (
    <section ref={root} className="me-cta">
      <p className="me-cta-l1">Your table</p>
      <p className="me-cta-l2">is <em>waiting.</em></p>
      <Magnetic onClick={() => go('reserve')}>Reserve<br />a table</Magnetic>
      <footer className="me-foot">
        <span>© Maison Ember</span>
        <button className="me-link-btn" onClick={() => go('top')}>Back to top <i>↑</i></button>
        <a className="me-link-btn" href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
        <span>A GLOARO prototype</span>
      </footer>
    </section>
  )
}
