import { GraduationCap, HardHat, HeartPulse, Leaf, Refrigerator, Sofa, UtensilsCrossed } from 'lucide-react'
import school from './school'
import furniture from './furniture'
import appliances from './appliances'
import vrmc from './vrmc'
import restaurant from './restaurant'
import healthcare from './healthcare'
import wellness from './wellness'

// Selector order. Adding an industry = one data file + a media folder + a line here.
// `status: 'client'` is real client work shown with permission; 'example' uses
// a fictional brand and is always labelled as an illustrative example.
export const industries = [
  { ...school, Icon: GraduationCap },
  { ...furniture, Icon: Sofa },
  { ...appliances, Icon: Refrigerator },
  { ...vrmc, Icon: HardHat },
  { ...restaurant, Icon: UtensilsCrossed },
  { ...healthcare, Icon: HeartPulse },
  { ...wellness, Icon: Leaf },
]

// Seconds each scene stays on screen when auto-playing (a scene's own
// `duration` wins). Enquiries scale with the length of the conversation.
export const MESSAGE_INTERVAL = 1.5

export function sceneDuration(scene) {
  if (scene.duration) return scene.duration
  if (scene.type === 'enquiry') return scene.messages.length * MESSAGE_INTERVAL + 2.5
  if (scene.type === 'search') return 6.5
  if (scene.type === 'reel') return 7
  return 5
}

export const sceneKinds = {
  'social-post': 'Social post',
  reel: 'Short video',
  search: 'Search & maps',
  enquiry: 'WhatsApp enquiry',
}
