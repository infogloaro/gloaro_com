// The sample website shown on the devices in the Website Development hero: a
// handloom studio storefront ("Tantu", fictional), drawn to canvases in two
// responsive layouts. Each layout is a tall page canvas the screen scrolls
// through, plus a fixed header canvas that sits over it, like a sticky nav.
// All coordinates are CSS pixels of the layout; `scale` sets texture density.

export const PHOTOS = {
  hero: '/tech/web/hero.webp',
  textiles: '/tech/web/textiles.webp',
  weaver: '/tech/web/weaver.webp',
}

const INK = '#1b1a17'
const MUTED = '#6b665d'
const IVORY = '#f7f3ec'
const NAVY = '#08224B'
const GOLD = '#CB9015'
const LINE = '#e8e2d6'
const SERIF = 'Georgia, "Times New Roman", serif'
const SANS = '"Work Sans", system-ui, sans-serif'
const DISPLAY = 'Outfit, system-ui, sans-serif'

// Products crop different regions of the one textiles photo (source px).
const PRODUCTS = [
  { name: 'Kalamkari Dupatta', note: 'Hand-block printed', price: '₹2,450', crop: [20, 330, 470, 560] },
  { name: 'Ikat Cotton Stole', note: 'Pochampally weave', price: '₹1,890', crop: [440, 520, 460, 620] },
  { name: 'Paisley Wool Shawl', note: 'Kashmiri jamawar', price: '₹4,200', crop: [0, 640, 520, 560] },
  { name: 'Handloom Saree', note: 'Pure cotton, zari border', price: '₹3,600', crop: [160, 60, 560, 520] },
]

const VALUES = [
  ['Handwoven by artisans', 'Every piece is made on a hand loom by master weavers.'],
  ['Natural dyes', 'Indigo, madder and turmeric, kind to skin and soil.'],
  ['Delivered in 3–5 days', 'Free, insured shipping to every pin code in India.'],
]

// Layout sizes. `view` is the visible viewport height of the device screen.
export const DESKTOP = { width: 1440, height: 2420, view: 900, header: 72 }
export const PHONE = { width: 375, height: 2330, view: 812, header: 104 }

// Interactive spots the scene animates over (page coordinates).
export const DESKTOP_CTA = { x: 120, y: 584, w: 236, h: 56 }
export const DESKTOP_SCROLL = 772 // "New this season" sits just under the nav
export const PHONE_SCROLL = 814

function rr(g, x, y, w, h, r) {
  g.beginPath()
  g.moveTo(x + r, y)
  g.arcTo(x + w, y, x + w, y + h, r)
  g.arcTo(x + w, y + h, x, y + h, r)
  g.arcTo(x, y + h, x, y, r)
  g.arcTo(x, y, x + w, y, r)
  g.closePath()
}

function text(g, str, x, y, { size = 16, weight = 400, font = SANS, color = INK, align = 'left', spacing = 0, italic = false } = {}) {
  g.font = `${italic ? 'italic ' : ''}${weight} ${size}px ${font}`
  g.fillStyle = color
  g.textAlign = align
  g.textBaseline = 'alphabetic'
  if (spacing && 'letterSpacing' in g) g.letterSpacing = `${spacing}px`
  g.fillText(str, x, y)
  if ('letterSpacing' in g) g.letterSpacing = '0px'
  return g.measureText(str).width
}

// Draws `img` into the rect with object-fit: cover, optionally from a source crop.
function cover(g, img, x, y, w, h, radius = 0, crop) {
  g.save()
  rr(g, x, y, w, h, radius)
  g.clip()
  if (!img) {
    g.fillStyle = '#d9cfbf'
    g.fillRect(x, y, w, h)
  } else {
    const [sx0, sy0, sw0, sh0] = crop || [0, 0, img.width, img.height]
    const s = Math.max(w / sw0, h / sh0)
    const sw = w / s
    const sh = h / s
    g.drawImage(img, sx0 + (sw0 - sw) / 2, sy0 + (sh0 - sh) / 2, sw, sh, x, y, w, h)
  }
  g.restore()
}

function logo(g, x, y, small = false) {
  const s = small ? 0.86 : 1
  g.save()
  g.translate(x, y)
  g.scale(s, s)
  // Diamond mark: a woven lozenge in gold.
  g.fillStyle = GOLD
  g.beginPath()
  g.moveTo(11, 0); g.lineTo(22, 11); g.lineTo(11, 22); g.lineTo(0, 11)
  g.closePath()
  g.fill()
  g.strokeStyle = '#fff'
  g.lineWidth = 1.6
  g.beginPath()
  g.moveTo(6, 11); g.lineTo(11, 6); g.lineTo(16, 11); g.lineTo(11, 16); g.closePath()
  g.stroke()
  text(g, 'TANTU', 32, 17, { size: 21, weight: 600, font: SERIF, spacing: 4 })
  g.restore()
}

function bagIcon(g, x, y, color = INK) {
  g.strokeStyle = color
  g.lineWidth = 1.7
  rr(g, x, y + 6, 18, 16, 3)
  g.stroke()
  g.beginPath()
  g.arc(x + 9, y + 6, 5, Math.PI, 0)
  g.stroke()
}

function searchIcon(g, x, y, color = INK) {
  g.strokeStyle = color
  g.lineWidth = 1.7
  g.beginPath()
  g.arc(x + 8, y + 8, 6.5, 0, Math.PI * 2)
  g.moveTo(x + 13, y + 13)
  g.lineTo(x + 18, y + 18)
  g.stroke()
}

function check(g, x, y, color = GOLD) {
  g.strokeStyle = color
  g.lineWidth = 2
  g.beginPath()
  g.moveTo(x, y - 4); g.lineTo(x + 4, y); g.lineTo(x + 11, y - 8)
  g.stroke()
}

function arrow(g, x, y, color) {
  g.strokeStyle = color
  g.lineWidth = 2
  g.beginPath()
  g.moveTo(x, y); g.lineTo(x + 14, y)
  g.moveTo(x + 9, y - 5); g.lineTo(x + 14, y); g.lineTo(x + 9, y + 5)
  g.stroke()
}

// Floating price tag on the hero photo.
function tag(g, x, y, w) {
  g.save()
  g.shadowColor = 'rgba(20,16,10,0.22)'
  g.shadowBlur = 24
  g.shadowOffsetY = 8
  g.fillStyle = '#fff'
  rr(g, x, y, w, 66, 12)
  g.fill()
  g.restore()
  text(g, 'Kalamkari Dupatta', x + 18, y + 28, { size: 15, weight: 600 })
  text(g, 'Hand-block printed  ·  ₹2,450', x + 18, y + 50, { size: 13, color: MUTED })
}

function productCard(g, p, img, x, y, w, ih, small) {
  cover(g, img, x, y, w, ih, small ? 10 : 14, p.crop)
  g.fillStyle = 'rgba(255,255,255,0.92)'
  rr(g, x + 10, y + 10, small ? 46 : 52, small ? 20 : 24, small ? 10 : 12)
  g.fill()
  text(g, 'NEW', x + (small ? 33 : 36), y + (small ? 24 : 26), { size: small ? 9 : 10, weight: 700, align: 'center', spacing: 1.2, color: NAVY })
  const ty = y + ih + (small ? 22 : 30)
  text(g, p.name, x, ty, { size: small ? 14 : 17, weight: 600 })
  text(g, p.note, x, ty + (small ? 18 : 22), { size: small ? 12 : 14, color: MUTED })
  text(g, p.price, x, ty + (small ? 40 : 50), { size: small ? 14 : 16, weight: 600, color: NAVY, font: DISPLAY })
}

function valueIcon(g, cx, cy, i) {
  g.fillStyle = '#fff'
  g.beginPath()
  g.arc(cx, cy, 26, 0, Math.PI * 2)
  g.fill()
  g.strokeStyle = GOLD
  g.lineWidth = 1.8
  g.beginPath()
  if (i === 0) { // shuttle / loom threads
    for (let k = -2; k <= 2; k++) { g.moveTo(cx + k * 5, cy - 10); g.lineTo(cx + k * 5, cy + 10) }
    g.moveTo(cx - 12, cy); g.lineTo(cx + 12, cy)
  } else if (i === 1) { // leaf
    g.moveTo(cx - 9, cy + 9)
    g.quadraticCurveTo(cx - 10, cy - 10, cx + 10, cy - 10)
    g.quadraticCurveTo(cx + 10, cy + 10, cx - 9, cy + 9)
    g.moveTo(cx - 9, cy + 9); g.lineTo(cx + 3, cy - 3)
  } else { // parcel
    g.rect(cx - 11, cy - 8, 22, 17)
    g.moveTo(cx - 11, cy - 2); g.lineTo(cx + 11, cy - 2)
    g.moveTo(cx, cy - 8); g.lineTo(cx, cy - 2)
  }
  g.stroke()
}

function makeCanvas(w, h, scale) {
  const c = document.createElement('canvas')
  c.width = Math.round(w * scale)
  c.height = Math.round(h * scale)
  const g = c.getContext('2d')
  g.scale(scale, scale)
  g.imageSmoothingQuality = 'high'
  return { c, g }
}

// ---------------------------------------------------------------- desktop

export function drawDesktopHeader(scale) {
  const { width, header } = DESKTOP
  const { c, g } = makeCanvas(width, header, scale)
  g.fillStyle = '#fff'
  g.fillRect(0, 0, width, header)
  g.fillStyle = LINE
  g.fillRect(0, header - 1, width, 1)
  logo(g, 120, 25)
  const links = ['Sarees', 'Dupattas', 'Shawls', 'Our Story', 'Journal']
  let x = 520
  links.forEach((l, i) => {
    const w = text(g, l, x, 42, { size: 15, weight: i === 0 ? 600 : 500, color: i === 0 ? INK : '#4a463f' })
    if (i === 0) { g.fillStyle = GOLD; g.fillRect(x, 50, w, 2) }
    x += w + 38
  })
  searchIcon(g, 1052, 26)
  bagIcon(g, 1094, 20)
  g.fillStyle = NAVY
  g.beginPath(); g.arc(1116, 24, 8, 0, Math.PI * 2); g.fill()
  text(g, '2', 1116, 28, { size: 10, weight: 700, color: '#fff', align: 'center' })
  g.fillStyle = NAVY
  rr(g, 1160, 16, 160, 40, 20)
  g.fill()
  text(g, 'Visit the studio', 1240, 41, { size: 14, weight: 600, color: '#fff', align: 'center' })
  return c
}

export function drawDesktopPage(img, scale) {
  const { width, height, header } = DESKTOP
  const { c, g } = makeCanvas(width, height, scale)
  g.fillStyle = '#fff'
  g.fillRect(0, 0, width, height)

  // Hero
  g.fillStyle = IVORY
  g.fillRect(0, header, width, 740)
  text(g, 'HANDWOVEN IN INDIA  ·  FESTIVE EDIT 2026', 120, 236, { size: 13, weight: 600, color: GOLD, spacing: 2.4 })
  text(g, 'Heritage weaves,', 120, 318, { size: 66, font: SERIF })
  text(g, 'made for the way', 120, 392, { size: 66, font: SERIF })
  const w = text(g, 'you live ', 120, 466, { size: 66, font: SERIF })
  text(g, 'today.', 120 + w, 466, { size: 66, font: SERIF, italic: true, color: '#9a6b0c' })
  text(g, 'Sarees, dupattas and shawls handwoven by artisan families,', 120, 524, { size: 18, color: MUTED })
  text(g, 'delivered from their looms to your door.', 120, 552, { size: 18, color: MUTED })

  const { x: bx, y: by, w: bw, h: bh } = DESKTOP_CTA
  g.fillStyle = NAVY
  rr(g, bx, by, bw, bh, 28)
  g.fill()
  text(g, 'Shop the collection', bx + 28, by + 34, { size: 16, weight: 600, color: '#fff' })
  arrow(g, bx + bw - 44, by + bh / 2, '#fff')
  g.strokeStyle = INK
  g.lineWidth = 1.4
  rr(g, bx + bw + 16, by, 176, bh, 28)
  g.stroke()
  text(g, 'Book a fitting', bx + bw + 104, by + 34, { size: 16, weight: 600, align: 'center' })

  let tx = 120
  ;['Free shipping across India', '7-day easy returns', 'UPI & cards accepted'].forEach((t) => {
    check(g, tx, 714)
    tx += 20 + text(g, t, tx + 20, 716, { size: 14, color: '#4a463f' }) + 30
  })

  cover(g, img.hero, 760, 120, 560, 644, 22, [300, 0, 640, 735])
  tag(g, 790, 676, 252)

  // New this season
  text(g, 'NEW THIS SEASON', 120, 892, { size: 13, weight: 600, color: GOLD, spacing: 2.4 })
  text(g, 'Pieces from our weavers', 120, 944, { size: 42, font: SERIF })
  const vw = text(g, 'View all', 1300, 940, { size: 15, weight: 600, align: 'right', color: NAVY })
  g.fillStyle = NAVY
  g.fillRect(1300 - vw, 946, vw, 1.5)
  const cw = (width - 240 - 3 * 24) / 4
  PRODUCTS.forEach((p, i) => productCard(g, p, img.textiles, 120 + i * (cw + 24), 990, cw, 352, false))

  // Values band
  g.fillStyle = IVORY
  g.fillRect(0, 1530, width, 260)
  VALUES.forEach(([title, body], i) => {
    const x = 120 + i * 412
    valueIcon(g, x + 26, 1630, i)
    text(g, title, x + 74, 1624, { size: 18, weight: 600 })
    text(g, body.length > 46 ? body.slice(0, body.lastIndexOf(' ', 46)) : body, x + 74, 1650, { size: 14, color: MUTED })
    if (body.length > 46) text(g, body.slice(body.lastIndexOf(' ', 46) + 1), x + 74, 1672, { size: 14, color: MUTED })
  })

  // Story banner
  g.fillStyle = NAVY
  rr(g, 120, 1860, 1200, 380, 26)
  g.fill()
  cover(g, img.weaver, 760, 1860, 560, 380, 26, [0, 140, 640, 600])
  const fade = g.createLinearGradient(760, 0, 900, 0)
  fade.addColorStop(0, NAVY)
  fade.addColorStop(1, 'rgba(8,34,75,0)')
  g.fillStyle = fade
  g.fillRect(758, 1860, 142, 380)
  text(g, 'OUR STORY', 190, 1950, { size: 13, weight: 600, color: '#e2b04a', spacing: 2.4 })
  text(g, 'Made slowly, by hands', 190, 2010, { size: 40, font: SERIF, color: '#fff' })
  text(g, 'that have done it for generations.', 190, 2058, { size: 40, font: SERIF, color: '#fff' })
  g.fillStyle = GOLD
  rr(g, 190, 2110, 196, 52, 26)
  g.fill()
  text(g, 'Meet the weavers', 288, 2142, { size: 15, weight: 600, color: '#fff', align: 'center' })

  // Footer
  g.fillStyle = LINE
  g.fillRect(120, 2310, 1200, 1)
  logo(g, 120, 2348, true)
  ;['Shipping', 'Returns', 'Care guide', 'Contact'].forEach((l, i) => text(g, l, 900 + i * 110, 2366, { size: 14, color: MUTED }))
  return c
}

// ---------------------------------------------------------------- phone

export function drawPhoneHeader(scale) {
  const { width, header } = PHONE
  const { c, g } = makeCanvas(width, header, scale)
  g.fillStyle = '#fff'
  g.fillRect(0, 0, width, header)
  // Status bar
  text(g, '9:41', 34, 34, { size: 15, weight: 600, font: DISPLAY })
  g.fillStyle = INK
  ;[4, 6, 8, 10].forEach((h, i) => g.fillRect(286 + i * 5, 30 - h, 3, h))
  g.strokeStyle = INK
  g.lineWidth = 1.2
  rr(g, 312, 20, 24, 12, 3.5)
  g.stroke()
  g.fillRect(314, 22, 17, 8)
  g.fillRect(337.5, 24, 1.6, 4)
  // Nav
  g.fillStyle = LINE
  g.fillRect(0, header - 1, width, 1)
  logo(g, 18, 62, true)
  searchIcon(g, 284, 66)
  bagIcon(g, 318, 60)
  g.fillStyle = INK
  ;[0, 6, 12].forEach((dy) => g.fillRect(349, 70 + dy, 16, 1.8))
  return c
}

export function drawPhonePage(img, scale) {
  const { width, height, header } = PHONE
  const { c, g } = makeCanvas(width, height, scale)
  g.fillStyle = '#fff'
  g.fillRect(0, 0, width, height)

  g.fillStyle = IVORY
  g.fillRect(0, header, width, 780)
  cover(g, img.hero, 16, header + 14, 343, 330, 18, [330, 0, 600, 735])
  g.save()
  g.shadowColor = 'rgba(20,16,10,0.2)'
  g.shadowBlur = 16
  g.shadowOffsetY = 6
  g.fillStyle = '#fff'
  rr(g, 30, header + 272, 196, 56, 10)
  g.fill()
  g.restore()
  text(g, 'Kalamkari Dupatta', 44, header + 296, { size: 13, weight: 600 })
  text(g, 'Hand-block printed · ₹2,450', 44, header + 315, { size: 11, color: MUTED })

  text(g, 'HANDWOVEN IN INDIA', 20, 498, { size: 11, weight: 600, color: GOLD, spacing: 2 })
  text(g, 'Heritage weaves,', 20, 540, { size: 34, font: SERIF })
  text(g, 'made for the way', 20, 579, { size: 34, font: SERIF })
  const w = text(g, 'you live ', 20, 618, { size: 34, font: SERIF })
  text(g, 'today.', 20 + w, 618, { size: 34, font: SERIF, italic: true, color: '#9a6b0c' })
  text(g, 'Sarees, dupattas and shawls handwoven', 20, 656, { size: 14.5, color: MUTED })
  text(g, 'by artisan families across India.', 20, 678, { size: 14.5, color: MUTED })
  g.fillStyle = NAVY
  rr(g, 20, 702, 335, 52, 26)
  g.fill()
  text(g, 'Shop the collection', 166, 734, { size: 15, weight: 600, color: '#fff', align: 'center' })
  arrow(g, 250, 728, '#fff')
  text(g, 'Book a fitting', 187.5, 786, { size: 14, weight: 600, align: 'center', color: NAVY })
  check(g, 20, 840)
  text(g, 'Free shipping', 38, 842, { size: 12, color: '#4a463f' })
  check(g, 140, 840)
  text(g, '7-day returns', 158, 842, { size: 12, color: '#4a463f' })
  check(g, 254, 840)
  text(g, 'UPI & cards', 272, 842, { size: 12, color: '#4a463f' })

  text(g, 'NEW THIS SEASON', 20, 950, { size: 11, weight: 600, color: GOLD, spacing: 2 })
  text(g, 'Pieces from our weavers', 20, 986, { size: 25, font: SERIF })
  const cw = (width - 40 - 12) / 2
  PRODUCTS.forEach((p, i) => productCard(g, p, img.textiles, 20 + (i % 2) * (cw + 12), 1010 + Math.floor(i / 2) * 296, cw, 200, true))

  g.fillStyle = IVORY
  g.fillRect(0, 1630, width, 300)
  VALUES.forEach(([title, body], i) => {
    const y = 1690 + i * 82
    valueIcon(g, 46, y, i)
    text(g, title, 86, y - 4, { size: 15, weight: 600 })
    text(g, body.length > 38 ? `${body.slice(0, body.lastIndexOf(' ', 38))}…` : body, 86, y + 16, { size: 12, color: MUTED })
  })

  g.fillStyle = NAVY
  rr(g, 16, 1960, 343, 320, 20)
  g.fill()
  cover(g, img.weaver, 16, 1960, 343, 150, 20, [0, 220, 640, 300])
  g.fillStyle = NAVY
  g.fillRect(16, 2090, 343, 20)
  text(g, 'OUR STORY', 36, 2140, { size: 11, weight: 600, color: '#e2b04a', spacing: 2 })
  text(g, 'Made slowly, by hands', 36, 2174, { size: 22, font: SERIF, color: '#fff' })
  text(g, 'that have done it for years.', 36, 2202, { size: 22, font: SERIF, color: '#fff' })
  g.fillStyle = GOLD
  rr(g, 36, 2224, 160, 40, 20)
  g.fill()
  text(g, 'Meet the weavers', 116, 2249, { size: 13, weight: 600, color: '#fff', align: 'center' })
  return c
}

// Loads the photos and the brand webfonts, then resolves with the images.
export async function loadSiteAssets() {
  const load = (src) => new Promise((resolve) => {
    const image = new Image()
    image.decoding = 'async'
    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = src
  })
  const fonts = document.fonts
    ? Promise.all(['500 16px "Work Sans"', '600 16px "Work Sans"', '600 16px Outfit'].map((f) => document.fonts.load(f).catch(() => null)))
    : Promise.resolve()
  const [hero, textiles, weaver] = await Promise.all([load(PHOTOS.hero), load(PHOTOS.textiles), load(PHOTOS.weaver), fonts])
  return { hero, textiles, weaver }
}
