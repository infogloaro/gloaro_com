// GSAP for the partnership scroll stories. Imported only by the lazily loaded
// /partners routes, so other pages never pay for it.
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }
