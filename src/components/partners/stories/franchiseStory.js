// Franchise scroll story "Build your business" (storyboard frames F1–F6).
import FranchiseScene from './FranchiseScene'

function build(tl) {
  // 1 · Your GLOARO office
  tl.from('[data-s=map]', { opacity: 0, scale: 1.08, transformOrigin: '50% 50%' }, 0)
    .from('[data-s=pin]', { y: -150, opacity: 0, ease: 'bounce.out', duration: 0.4 }, 0.15)
    .fromTo('[data-s=ripple]', { scale: 0.2, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, stagger: 0.08, duration: 0.2 }, 0.5)
    .from('[data-s=officeLabel]', { y: 14, opacity: 0, duration: 0.2 }, 0.55)
  // 2 · You get ready products
    .from('[data-s=hq]', { x: -70, opacity: 0 }, 1)
    .fromTo('[data-s=hqLine]', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.25, ease: 'none' }, 1.15)
    .to('[data-s=pin]', { opacity: 0, duration: 0.15 }, 1.3)
    .fromTo('[data-s=prod]', { x: -170, y: -70, scale: 3.4, opacity: 0, transformOrigin: '50% 50%' }, { x: 0, y: 0, scale: 1, opacity: 1, stagger: 0.12, duration: 0.35, ease: 'power2.inOut' }, 1.3)
  // 3 · You find local customers
    .to('[data-s=ripple]', { opacity: 0, duration: 0.1 }, 2)
    .from('[data-s=ring]', { scale: 0.3, opacity: 0, svgOrigin: '300 140', stagger: 0.06, duration: 0.25 }, 2)
    .from('[data-s=custLit]', { opacity: 0, stagger: 0.14, duration: 0.18 }, 2.2)
    .from('[data-s=custLabel]', { opacity: 0, y: 6, stagger: 0.14, duration: 0.18 }, 2.2)
    .from('[data-s=glow]', { scale: 0.2, opacity: 0, transformOrigin: '50% 50%', stagger: 0.14, duration: 0.25 }, 2.2)
  // 4 · GLOARO builds and delivers
    .to('[data-s=ring]', { opacity: 0.35, duration: 0.1 }, 3)
    .fromTo('[data-s=deliver]', { strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: 0.12, duration: 0.3, ease: 'none' }, 3)
    .from('[data-s=custScreen]', { opacity: 0, scale: 0.6, transformOrigin: '50% 50%', stagger: 0.12, duration: 0.15 }, 3.3)
  // 5 · We support you
    .to('[data-s=deliver]', { opacity: 0.2, duration: 0.1 }, 4)
    .fromTo('[data-s=loop]', { strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: 0.14, duration: 0.3, ease: 'none' }, 4.05)
    .from('[data-s=packet]', { scale: 0, opacity: 0, transformOrigin: '50% 50%', stagger: 0.1, duration: 0.15 }, 4.4)
    .from('[data-s=support]', { y: -12, opacity: 0, duration: 0.2 }, 4.45)
  // 6 · Seven clear steps
    .to('[data-s=world]', { opacity: 0.22, duration: 0.2 }, 5)
    .from('[data-s=journey]', { y: 50, opacity: 0, duration: 0.25 }, 5.05)
    .fromTo('[data-s=journeyFill]', { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, ease: 'none', duration: 0.5 }, 5.25)
    .from('[data-s=jdot]', { opacity: 0, scale: 0.4, transformOrigin: '50% 50%', stagger: 0.07, duration: 0.08 }, 5.25)
}

export const franchiseStory = {
  id: 'franchise-story',
  eyebrow: 'How a franchise works',
  title: 'Build your business, step by step',
  Scene: FranchiseScene,
  build,
  steps: [
    { title: 'Your GLOARO office.', body: 'It starts on your city map. One pin lands on your block: this is where your franchise lives.' },
    { title: 'You get ready products.', body: 'GLOARO HQ links to your office. School, hospital and CRM software arrive ready to sell, so you never build from scratch.' },
    { title: 'You find local customers.', body: 'Schools, clinics and shops near you are your customers. You build the relationships in your area.' },
    { title: 'GLOARO builds and delivers.', body: 'When you win a customer, GLOARO’s team builds and sets up their software. Their screen switches on.' },
    { title: 'We support you.', body: 'Training flows from HQ to your office, and your questions flow back. The exact support scope is confirmed in the agreement.' },
    { title: 'Seven clear steps. Start with one.', body: 'Explore, apply, review, discuss, agreement if approved, onboarding, launch. The first step takes a few minutes.' },
  ],
}
