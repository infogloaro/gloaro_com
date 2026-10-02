import { useRef } from 'react'
import { gsap, useMotion } from '../motion'
import { Split } from '../Split'
import { MEDIA } from '../data'

const smooth = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1)
  return t * t * (3 - 2 * t)
}

// Matches the burger film: layers lift apart (0.6–3.4s), hover, then re-stack (4.6–6.4s).
const layerSpread = (t) => (t < 4 ? smooth(0.6, 3.4, t) : 1 - smooth(4.6, 6.4, t))

const LEFT = [['Slow', -1], ['fire,', -0.25], ['built', 0.6]]
const RIGHT = [['layer', -0.7], ['by', 0.15], ['layer.', 1]]

export default function Hero({ go }) {
  const root = useRef(null)
  const video = useRef(null)

  useMotion(root, ({ mobile }) => {
    const round = mobile ? 'round 260px 260px 18px 18px' : 'round 420px 420px 22px 22px'
    const arch = mobile ? `inset(18% 9% 30% 9% ${round})` : `inset(11% 35.5% 8% 35.5% ${round})`
    const shut = mobile ? `inset(50% 50% 50% 50% ${round})` : `inset(50% 50% 50% 50% ${round})`

    gsap.timeline({ delay: 0.1 })
      .fromTo('.me-hero-frame', { clipPath: shut }, { clipPath: arch, duration: 1.7, ease: 'expo.inOut' })
      .from('.me-hero-back .me-c', { yPercent: 115, rotateX: -70, stagger: 0.045, duration: 1.3, ease: 'expo.out' }, 0.55)
      .from('.me-hero-left .me-line > span', { xPercent: -120, skewX: 12, stagger: 0.09, duration: 1.2, ease: 'expo.out' }, 0.85)
      .from('.me-hero-right .me-line > span', { xPercent: 120, skewX: -12, stagger: 0.09, duration: 1.2, ease: 'expo.out' }, 0.95)
      .from('.me-hero-meta > *', { clipPath: 'inset(0 100% 0 0)', stagger: 0.1, duration: 1, ease: 'power3.inOut' }, 1.3)

    // Side typography rides the burger layers: top words lift, bottom words drop, in sync with the film.
    const lines = gsap.utils.toArray('.me-hero-side .me-line')
    const setters = lines.map((el) => gsap.quickSetter(el, 'y', 'px'))
    const factors = lines.map((el) => Number(el.dataset.f))
    const back = root.current.querySelector('.me-hero-back')
    const tick = () => {
      const v = video.current
      if (!v) return
      const s = layerSpread(v.currentTime)
      const amp = mobile ? 26 : 70
      setters.forEach((set, i) => set(factors[i] * s * amp))
      back.style.letterSpacing = `${-0.045 + s * 0.05}em`
    }
    gsap.ticker.add(tick)

    // Scroll: the arch opens to full bleed, the giant word slips behind the film, side words part.
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root.current, start: 'top top', end: '+=140%', scrub: 1, pin: true },
    })
    tl.fromTo('.me-hero-frame', { clipPath: arch }, { clipPath: `inset(0% 0% 0% 0% round 0px 0px 0px 0px)`, ease: 'power2.inOut', immediateRender: false }, 0)
      .fromTo('.me-hero-film', { scale: 1 }, { scale: 1.32, ease: 'none', immediateRender: false }, 0)
      .to('.me-hero-back', { scale: 1.35, yPercent: -12, ease: 'power1.in' }, 0)
      .to('.me-hero-left', { xPercent: -60, opacity: 0, filter: 'blur(8px)', ease: 'power2.in' }, 0)
      .to('.me-hero-right', { xPercent: 60, opacity: 0, filter: 'blur(8px)', ease: 'power2.in' }, 0)
      .to('.me-hero-meta', { yPercent: 120, opacity: 0, ease: 'power2.in' }, 0)
      .fromTo('.me-hero-caption .me-c', { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.02, ease: 'power3.out' }, 0.55)
      .fromTo('.me-hero-caption-sub', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', ease: 'power2.out' }, 0.8)

    return () => gsap.ticker.remove(tick)
  })

  return (
    <section id="top" ref={root} className="me-hero">
      <h1 className="me-hero-back"><Split text="EMBER" /></h1>

      <div className="me-hero-frame" data-cursor="Watch">
        <video
          ref={video}
          className="me-hero-film me-film"
          src={MEDIA.burgerVideo}
          poster={MEDIA.burgerPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>

      <div className="me-hero-side me-hero-left">
        {LEFT.map(([w, f]) => <div key={w} className="me-line" data-f={f}><span>{w}</span></div>)}
      </div>
      <div className="me-hero-side me-hero-right">
        {RIGHT.map(([w, f]) => <div key={w} className="me-line" data-f={f}><span>{w}</span></div>)}
      </div>

      <div className="me-hero-caption">
        <p className="me-hero-caption-main"><Split text="Every layer, in its place." /></p>
        <p className="me-hero-caption-sub">Wood-fired kitchen · Nungambakkam, Chennai</p>
      </div>

      <div className="me-hero-meta">
        <span className="me-eyebrow">Now booking · Tuesday to Sunday</span>
        <button className="me-link-btn" onClick={() => go('reserve')}>Reserve a table <i>→</i></button>
        <span className="me-scroll-cue">Scroll</span>
      </div>
    </section>
  )
}
