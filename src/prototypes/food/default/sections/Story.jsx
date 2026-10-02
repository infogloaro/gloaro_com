import { useRef, useState } from 'react'
import { gsap, prefersReducedMotion, useMotion } from '../motion'
import { Split } from '../Split'
import { MEDIA } from '../data'

/**
 * The pizza film is scrubbed by scroll: the camera's push toward the oven, the blade's
 * left-to-right sweep and the final shared slices become three chapters.
 * The frame itself opens like a cut: a gold hairline, then a slit, then full bleed.
 */
export default function Story() {
  const root = useRef(null)
  const video = useRef(null)
  const [reduced] = useState(prefersReducedMotion)

  useMotion(root, ({ mobile }) => {
    const v = video.current
    v.pause()
    let target = 0
    let current = 0
    const tick = () => {
      if (!v.duration) return
      current += (target - current) * 0.18
      if (Math.abs(target - current) > 0.008 && !v.seeking) v.currentTime = current
    }
    gsap.ticker.add(tick)

    const side = mobile ? '4%' : '7%'
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root.current,
        start: 'top top',
        end: '+=420%',
        scrub: true,
        pin: true,
        onUpdate: (self) => { if (v.duration) target = self.progress * (v.duration - 0.06) },
      },
    })

    tl.fromTo('.me-story-blade', { scaleX: 0 }, { scaleX: 1, duration: 0.07 }, 0)
      .fromTo('.me-story-frame', { clipPath: `inset(49.7% ${side} 49.7% ${side} round 0px)` }, { clipPath: `inset(16% ${side} 16% ${side} round 18px)`, duration: 0.12, ease: 'power2.inOut' }, 0.07)
      .to('.me-story-blade', { opacity: 0, duration: 0.04 }, 0.1)
      // I · Fire
      .fromTo('.me-ch1', { opacity: 0 }, { opacity: 1, duration: 0.02 }, 0.11)
      .fromTo('.me-ch1-big', { clipPath: 'inset(0 0 100% 0)', yPercent: -20 }, { clipPath: 'inset(0 0 0% 0)', yPercent: 0, duration: 0.07 }, 0.12)
      .fromTo('.me-ch1-num', { textContent: 0 }, { textContent: 485, snap: { textContent: 1 }, duration: 0.18 }, 0.12)
      .fromTo('.me-ch1-note', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.08 }, 0.18)
      .to('.me-ch1', { yPercent: -60, opacity: 0, duration: 0.06 }, 0.34)
      // II · The cut — the word splits along the blade line
      .fromTo('.me-ch2', { opacity: 0 }, { opacity: 1, duration: 0.02 }, 0.38)
      .fromTo('.me-ch2-line', { scaleX: 0 }, { scaleX: 1, duration: 0.08 }, 0.4)
      .fromTo('.me-ch2-top', { xPercent: 0 }, { xPercent: -6, yPercent: -8, duration: 0.12 }, 0.46)
      .fromTo('.me-ch2-bot', { xPercent: 0 }, { xPercent: 6, yPercent: 8, duration: 0.12 }, 0.46)
      .fromTo('.me-ch2-note', { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 0.08 }, 0.5)
      .to('.me-ch2', { xPercent: 40, opacity: 0, duration: 0.06 }, 0.62)
      // Frame opens to full bleed for the shared table
      .to('.me-story-frame', { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 0.12, ease: 'power2.inOut' }, 0.62)
      .to('.me-story-eyebrow', { opacity: 0, duration: 0.04 }, 0.62)
      .fromTo('.me-story-film', { scale: 1.32 }, { scale: 1.4, duration: 0.38 }, 0.62)
      // III · Shared — words drift in front of the film from the right, like slices pulled apart
      .fromTo('.me-ch3', { opacity: 0 }, { opacity: 1, duration: 0.02 }, 0.72)
      .fromTo('.me-ch3 .me-w', { xPercent: 120, opacity: 0 }, { xPercent: 0, opacity: 1, stagger: 0.02, duration: 0.1, ease: 'power3.out' }, 0.74)
      .fromTo('.me-ch3-note', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.06 }, 0.86)

    return () => gsap.ticker.remove(tick)
  })

  return (
    <section id="story" ref={root} className="me-story">
      <span className="me-eyebrow me-story-eyebrow">The fire · a film in three cuts</span>
      <div className="me-story-blade" />
      <div className="me-story-frame">
        <video
          ref={video}
          className="me-story-film me-film"
          src={MEDIA.pizzaVideo}
          poster={MEDIA.pizzaOven}
          muted
          playsInline
          controls={reduced}
          preload="auto"
          aria-label="A Margherita leaves the oak oven and is cut into eight slices"
        />
      </div>

      <div className="me-ch me-ch1">
        <span className="me-ch-label">I · Fire</span>
        <p className="me-ch1-big"><span className="me-ch1-num">485</span>°</p>
        <p className="me-ch1-note">Oak and coconut husk. Ninety seconds. No timer — the crust tells us.</p>
      </div>

      <div className="me-ch me-ch2" aria-label="The cut">
        <span className="me-ch-label">II · The cut</span>
        <div className="me-ch2-word">
          <span className="me-ch2-top" aria-hidden="true">Cut.</span>
          <span className="me-ch2-bot" aria-hidden="true">Cut.</span>
          <i className="me-ch2-line" />
        </div>
        <p className="me-ch2-note">One clean sweep, left to right. Eight slices, never sawn.</p>
      </div>

      <div className="me-ch me-ch3">
        <span className="me-ch-label">III · Shared</span>
        <p className="me-ch3-big"><Split text="Made to be pulled apart." chars={false} /></p>
        <p className="me-ch3-note">The cheese decides when you&apos;re done talking.</p>
      </div>
    </section>
  )
}
