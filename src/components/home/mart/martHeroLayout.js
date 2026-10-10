// Scene layout for the Gloaro Mart hero visual. Everything is positioned in
// design-canvas px (see CANVAS in martHeroAssets, 760 × 640). `compact` marks
// the items that survive on small screens.

import { MapPin, ShieldCheck, Store, Truck, Users } from 'lucide-react'
import { images } from './martHeroAssets'

export const devices = {
  dashboard: { left: 238, top: 58, z: 2 },
  phone: { left: 148, top: 84, z: 5 },
}

export const productLayers = [
  { id: 'crate', src: images.tomatoCrate, alt: 'Crate of fresh cherry tomatoes', left: -26, top: 352, width: 226, z: 6, duration: 7.5, delay: 0.4, rotate: -2, lift: -10, compact: true },
  { id: 'strawberry', src: images.strawberry, alt: 'Strawberry', left: 60, top: 312, width: 62, z: 7, duration: 5.5, delay: 1.1, rotate: -14, lift: -9, compact: false },
  { id: 'mandarin', src: images.mandarin, alt: 'Mandarin orange', left: 158, top: 522, width: 66, z: 7, duration: 6.2, delay: 0.2, rotate: 0, lift: -7, compact: true },
  { id: 'sneaker', src: images.sneaker, alt: 'White running sneaker', left: 418, top: 476, width: 192, z: 7, duration: 7, delay: 0.8, rotate: -6, lift: -9, compact: true },
  { id: 'handbag', src: images.handbag, alt: 'Tan leather shopping bag', left: 628, top: 0, width: 128, z: 3, duration: 8, delay: 0.5, rotate: 6, lift: -10, compact: false },
  { id: 'headphones', src: images.headphones, alt: 'Wireless headphones', left: 652, top: 322, width: 100, z: 7, duration: 6.5, delay: 1.4, rotate: -8, lift: -8, compact: false },
]

export const objects = {
  pin: { left: 82, top: 146, z: 4 },
  box: { left: 512, top: 392, z: 5 },
  cart: { left: 206, top: 12, z: 6 },
}

export const sparkLayers = [
  { left: 58, top: 112, size: 10, duration: 6, delay: 0.3, compact: true },
  { left: 300, top: 28, size: 8, duration: 5.2, delay: 1.2, compact: false },
  { left: 736, top: 236, size: 9, duration: 6.8, delay: 0.7, compact: false },
  { left: 262, top: 606, size: 7, duration: 5.6, delay: 1.8, compact: true },
  { left: 666, top: 560, size: 8, duration: 6.4, delay: 0.9, compact: false },
  { left: 140, top: 562, size: 6, duration: 5, delay: 2.2, compact: false },
]

export const featureCards = [
  { id: 'nearby', Icon: MapPin, label: 'Nearby stores', detail: '4 shops within 2 km', left: 596, top: 150, z: 8, duration: 6.4, delay: 0.3, compact: false, gold: true },
  { id: 'delivery', Icon: Truck, label: 'Fast delivery', detail: 'Same-day across the city', left: 22, top: 546, z: 9, duration: 7.2, delay: 1.1, compact: true, gold: false },
  { id: 'b2b', Icon: Users, label: 'B2B deals', detail: 'Bulk pricing for retailers', left: 590, top: 436, z: 8, duration: 6.8, delay: 0.7, compact: true, gold: false },
  { id: 'secure', Icon: ShieldCheck, label: 'Secure shopping', detail: 'Protected payments', left: 4, top: 48, z: 8, duration: 7.6, delay: 1.6, compact: false, gold: false },
  { id: 'vendors', Icon: Store, label: 'Multi-vendor marketplace', detail: '1,200+ verified sellers', left: 304, top: 592, z: 9, duration: 6, delay: 0.5, compact: false, gold: true },
]
