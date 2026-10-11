// Channel Partner scroll story "Introduce and we deliver" (storyboard frames C1–C6).
import ChannelScene from './ChannelScene'

function build(tl) {
  // 1 · Your network is where it starts
  tl.from('[data-s=phone]', { y: 40, opacity: 0 }, 0)
    .fromTo('[data-s=clines] line', { strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: 0.03, duration: 0.25, ease: 'none' }, 0.2)
    .from('[data-s=dot]', { scale: 0, transformOrigin: '50% 50%', stagger: 0.03, duration: 0.2, ease: 'back.out(2)' }, 0.25)
  // 2 · Spot a need. Tap Introduce.
    .to('[data-s=dot], [data-s=clines]', { opacity: 0.25, duration: 0.15 }, 1)
    .from('[data-s=targetOn]', { opacity: 0, scale: 0.5, transformOrigin: '50% 50%', duration: 0.15 }, 1.05)
    .from('[data-s=halo]', { opacity: 0, scale: 0.3, transformOrigin: '50% 50%', duration: 0.25 }, 1.1)
    .from('[data-s=tag]', { y: 10, opacity: 0, duration: 0.2 }, 1.2)
    .to('[data-s=introBtn]', { scale: 0.9, transformOrigin: '50% 50%', duration: 0.08 }, 1.45)
    .to('[data-s=introBtn]', { scale: 1, duration: 0.1 }, 1.53)
    .to('[data-s=press]', { keyframes: [{ scale: 0.6, opacity: 0.9, duration: 0.01 }, { scale: 1.8, opacity: 0, duration: 0.24 }], transformOrigin: '50% 50%' }, 1.5)
  // 3 · Your introduction reaches GLOARO
    .to('[data-s=dot], [data-s=clines], [data-s=targetOn], [data-s=halo], [data-s=tag]', { opacity: 0, duration: 0.15 }, 2)
    .to('[data-s=phone]', { x: -190, duration: 0.3, ease: 'power2.inOut' }, 2)
    .from('[data-s=gloaro]', { x: 40, opacity: 0, duration: 0.2 }, 2.1)
    .fromTo('[data-s=arc]', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.25, ease: 'none' }, 2.3)
    .fromTo('[data-s=card]', { x: -390, y: 40, scale: 0.35, rotation: -10, opacity: 0, transformOrigin: '50% 50%' }, { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, duration: 0.4, ease: 'power2.inOut' }, 2.35)
    .to('[data-s=gloaro]', { scale: 1.06, transformOrigin: '50% 50%', duration: 0.06 }, 2.75)
    .to('[data-s=gloaro]', { scale: 1, duration: 0.1 }, 2.81)
  // 4 · See where it stands
    .to('[data-s=arc]', { opacity: 0.2, duration: 0.1 }, 3)
    .from('[data-s=tracker]', { y: 30, opacity: 0, duration: 0.2 }, 3)
    .fromTo('[data-s=tfill]', { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 0.5, ease: 'none', duration: 0.25 }, 3.2)
    .to('[data-s=tfill]', { scaleX: 1, ease: 'none', duration: 0.25 }, 3.5)
    .from('[data-s=tnode0]', { opacity: 0, scale: 0.4, transformOrigin: '50% 50%', duration: 0.1 }, 3.15)
    .from('[data-s=tnode1]', { opacity: 0, scale: 0.4, transformOrigin: '50% 50%', duration: 0.1 }, 3.45)
    .from('[data-s=tnode2]', { opacity: 0, scale: 0.4, transformOrigin: '50% 50%', duration: 0.1 }, 3.75)
    .from('[data-s=tstat1]', { opacity: 0, y: 8, duration: 0.1 }, 3.45)
    .to('[data-s=tstat0]', { opacity: 0, y: -8, duration: 0.1 }, 3.45)
    .from('[data-s=tstat2]', { opacity: 0, y: 8, duration: 0.1 }, 3.75)
    .to('[data-s=tstat1]', { opacity: 0, y: -8, duration: 0.1 }, 3.75)
  // 5 · GLOARO meets the customer and delivers
    .to('[data-s=tracker], [data-s=card], [data-s=arc]', { opacity: 0, duration: 0.15 }, 4)
    .from('[data-s=customer]', { x: 30, opacity: 0, duration: 0.2 }, 4.05)
    .from('[data-s=win]', { scale: 0.85, opacity: 0, transformOrigin: '50% 50%', duration: 0.2 }, 4.15)
    .from('[data-s=panel]', { y: -24, opacity: 0, stagger: 0.08, duration: 0.15, ease: 'back.out(1.6)' }, 4.35)
  // 6 · You stay informed
    .to('[data-s=win]', { opacity: 0.3, duration: 0.15 }, 5)
    .fromTo('[data-s=notif]', { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: 'back.out(1.6)' }, 5.1)
    .to('[data-s=bell]', { keyframes: [{ rotation: 16 }, { rotation: -12 }, { rotation: 0 }], transformOrigin: '50% 0%', duration: 0.25 }, 5.4)
}

export const channelStory = {
  id: 'channel-story',
  eyebrow: 'How referrals work',
  title: 'Introduce, and GLOARO delivers',
  Scene: ChannelScene,
  build,
  steps: [
    { title: 'Your network is where it starts.', body: 'You already know business owners. Each dot is someone in your network who may need better technology.' },
    { title: 'Spot a need. Tap Introduce.', body: 'A contact mentions they need school software. You do not sell it yourself; you simply introduce them to GLOARO.' },
    { title: 'Your introduction reaches GLOARO.', body: 'The need becomes an opportunity card with your name on it, sent straight to GLOARO’s partnerships team.' },
    { title: 'See where it stands.', body: 'The opportunity moves from Under review to Discussion to Proposal. This illustrates how progress could be shared; it is not a live portal.' },
    { title: 'GLOARO meets the customer and delivers.', body: 'GLOARO’s team talks to the customer, agrees the work and builds the software. You do not need to be technical.' },
    { title: 'You stay informed.', body: 'When there is an outcome, GLOARO lets you know. Any reward follows the signed Channel Partner agreement.' },
  ],
}
