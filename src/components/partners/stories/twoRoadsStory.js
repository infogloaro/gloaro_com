// Landing scroll story "Two roads" (storyboard frames R1–R3; R4 is the FitPicker).
import TwoRoadsScene from './TwoRoadsScene'

function build(tl) {
  // 1 · The road splits
  tl.from('[data-s=leftBg]', { scaleX: 0, transformOrigin: '0% 50%', duration: 0.3 }, 0)
    .from('[data-s=rightBg]', { scaleX: 0, transformOrigin: '100% 50%', duration: 0.3 }, 0)
    .fromTo('[data-s=road]', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.35, ease: 'none' }, 0.1)
    .fromTo('[data-s=lineL], [data-s=lineR]', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.3, ease: 'none' }, 0.3)
    .from('[data-s=fork]', { scale: 0, transformOrigin: '50% 50%', duration: 0.15, ease: 'back.out(2)' }, 0.35)
    .from('[data-s=labelF], [data-s=labelC]', { y: -16, opacity: 0, stagger: 0.08, duration: 0.2 }, 0.5)
  // 2 · Franchise: build and run your own office
  // (from/fromTo render their start state immediately, so later elements start hidden)
    .fromTo('[data-s=dimR]', { opacity: 0 }, { opacity: 0.6, duration: 0.2 }, 1)
    .fromTo('[data-s=ground]', { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.2 }, 1.05)
    .fromTo('[data-s=floor]', { y: -80, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.14, duration: 0.25, ease: 'bounce.out' }, 1.15)
    .from('[data-s=window]', { opacity: 0, stagger: 0.02, duration: 0.05 }, 1.6)
  // 3 · Channel Partner: connect businesses to GLOARO
    .to('[data-s=dimR]', { opacity: 0, duration: 0.2 }, 2)
    .fromTo('[data-s=dimL]', { opacity: 0 }, { opacity: 0.6, duration: 0.2 }, 2)
    .fromTo('[data-s=you]', { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.15, ease: 'back.out(2)' }, 2.1)
    .fromTo('[data-s=node]', { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, stagger: 0.05, duration: 0.15, ease: 'back.out(2)' }, 2.2)
    .fromTo('[data-s=nlines] line', { strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: 0.05, duration: 0.2, ease: 'none' }, 2.25)
    .fromTo('[data-s=gloaro]', { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2 }, 2.55)
}

export const twoRoadsStory = {
  id: 'two-roads-story',
  eyebrow: 'Two ways to grow',
  title: 'One company. Two roads.',
  Scene: TwoRoadsScene,
  build,
  steps: [
    { title: 'Two ways to grow with GLOARO.', body: 'One road splits in two. Left, you build and run a GLOARO franchise. Right, you connect businesses to GLOARO as a Channel Partner.' },
    { title: 'Franchise: build and run your own office.', body: 'You open a GLOARO office in your area and sell GLOARO products locally, with GLOARO building and delivering the software.' },
    { title: 'Channel Partner: connect businesses to GLOARO.', body: 'No office needed. You introduce businesses you know; GLOARO handles the proposal, the sale and the delivery.' },
  ],
}
