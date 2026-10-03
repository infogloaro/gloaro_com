// Catalogue for the GLOARO "Build your product" retail theme. Every product points at a
// model definition in models/, so a new product is one data entry plus one model file.

export const CATEGORIES = [
  { id: 'electronics', label: 'Electronics', env: 'precision', line: 'Technical precision', blurb: 'Engineered objects, understood from the inside out.' },
  { id: 'fashion', label: 'Fashion', env: 'runway', line: 'The runway edit', blurb: 'Cut, stitched and finished by hand. See every seam.' },
  { id: 'footwear', label: 'Footwear', env: 'motion', line: 'Built for movement', blurb: 'Layer by layer, from outsole to laces.' },
  { id: 'watches', label: 'Watches', env: 'mechanical', line: 'Precision mechanics', blurb: 'Watch a movement find its case.' },
  { id: 'beauty', label: 'Beauty', env: 'glow', line: 'Clean formulations', blurb: 'What is inside the bottle, explained.' },
  { id: 'home', label: 'Home', env: 'interior', line: 'Architectural interiors', blurb: 'Pieces made by hand for rooms that last.' },
  { id: 'grocery', label: 'Grocery', env: 'fresh', line: 'From the source', blurb: 'Single-origin, small-batch, traceable.' },
  { id: 'sports', label: 'Sports', env: 'track', line: 'Performance gear', blurb: 'Training equipment, precisely made.' },
  { id: 'lifestyle', label: 'Lifestyle', env: 'calm', line: 'Everyday objects', blurb: 'Things you carry every day, made better.' },
]

const STD_RETURNS = '10-day easy returns'

export const PRODUCTS = [
  {
    id: 'camera', model: 'camera', category: 'electronics', brand: 'Lumen', name: 'Lumen Z9 Mirrorless', tagline: 'Full frame. Fully understood.',
    price: 84999, mrp: 99990, rating: 4.8, reviews: 2340, popularity: 98, isNew: true, stock: 'In stock', hero: true,
    tags: ['camera', '45mp', 'mirrorless', '4k video', 'full frame'],
    variants: { colors: [
      { name: 'Graphite', swatch: '#2a2c30', colors: { body: '#2a2c30', rubber: '#1a1b1e' } },
      { name: 'Silver', swatch: '#c9ccd2', colors: { body: '#c9ccd2', rubber: '#2a2b2e' } },
    ] },
    specs: [['Sensor', '45.7 MP full-frame BSI'], ['Video', '8K 30p · 4K 120p'], ['Burst', '30 fps'], ['Stabilisation', '8-stop IBIS'], ['Battery', '~580 shots'], ['Weight', '738 g with battery']],
    included: ['Z9 body', '24–70 mm f/2.8 lens', 'Battery & charger', 'Strap', 'Body cap'],
    warranty: '2-year GLOARO warranty', returns: STD_RETURNS, deliveryDays: 2,
    compare: { Weight: '738 g', Battery: '580 shots', Warranty: '2 years', 'Water resistance': 'Weather-sealed' },
  },
  {
    id: 'sneaker', model: 'sneaker', category: 'footwear', brand: 'Stride', name: 'Stride Aero Knit', tagline: 'Six layers. One stride.',
    price: 7499, mrp: 10999, rating: 4.6, reviews: 5212, popularity: 95, isNew: true, stock: 'In stock', hero: true,
    tags: ['sneaker', 'running', 'knit', 'shoes', 'trainer'],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'], soldOutSizes: ['UK 11'],
    variants: { colors: [
      { name: 'Cloud', swatch: '#e9e6e1', colors: { knit: '#e9e6e1', heel: '#1f2125', gum: '#3a3532' } },
      { name: 'Midnight', swatch: '#23283a', colors: { knit: '#23283a', heel: '#e9e6e1', gum: '#1a1b1e' } },
      { name: 'Clay', swatch: '#b86b4b', colors: { knit: '#b86b4b', heel: '#2a1d16', gum: '#e3d7c8' } },
    ] },
    specs: [['Upper', 'Engineered recycled knit'], ['Midsole', 'Supercritical foam'], ['Drop', '8 mm'], ['Weight', '248 g (UK 8)'], ['Outsole', 'Carbon rubber']],
    included: ['Pair of sneakers', 'Spare laces', 'Dust bag'],
    warranty: '6-month manufacturing warranty', returns: '30-day free returns', deliveryDays: 3,
    compare: { Weight: '248 g', Warranty: '6 months', 'Water resistance': 'Splash-resistant' },
  },
  {
    id: 'watch', model: 'watch', category: 'watches', brand: 'Horologe', name: 'Horologe Calibre 41', tagline: 'Seven parts. One heartbeat.',
    price: 54990, mrp: 64990, rating: 4.9, reviews: 860, popularity: 88, isNew: false, stock: 'Only 4 left', hero: true,
    tags: ['watch', 'automatic', 'mechanical', 'steel', 'sapphire'],
    variants: {
      colors: [
        { name: 'Steel', swatch: '#c9ccd2', colors: { steel: '#c9ccd2', brushed: '#a7abb3' } },
        { name: 'Gold', swatch: '#d4ae5c', colors: { steel: '#d9b86a', brushed: '#c09a4e' } },
        { name: 'Black DLC', swatch: '#2b2d31', colors: { steel: '#2f3136', brushed: '#24262a' } },
      ],
      extra: { label: 'Strap', options: [
        { name: 'Tan leather', swatch: '#6b4429', colors: { strap: '#6b4429' } },
        { name: 'Black rubber', swatch: '#1b1c1f', colors: { strap: '#1b1c1f' } },
        { name: 'Navy canvas', swatch: '#24324f', colors: { strap: '#24324f' } },
      ] },
    },
    specs: [['Movement', 'Automatic, 28 jewels'], ['Power reserve', '70 hours'], ['Case', '41 mm 904L steel'], ['Crystal', 'Domed sapphire'], ['Water resistance', '100 m']],
    included: ['Watch', 'Second strap', 'Travel case', 'Certificate of chronometry'],
    warranty: '5-year international warranty', returns: STD_RETURNS, deliveryDays: 2,
    compare: { Weight: '142 g', Battery: '70 h power reserve', Warranty: '5 years', 'Water resistance': '100 m' },
  },
  {
    id: 'headphones', model: 'headphones', category: 'electronics', brand: 'Halden', name: 'Halden H1 Studio', tagline: 'Symmetry you can hear.',
    price: 24900, mrp: 29990, rating: 4.7, reviews: 3120, popularity: 92, isNew: false, stock: 'In stock', hero: true,
    tags: ['headphones', 'anc', 'wireless', 'noise cancelling', 'audio'],
    variants: { colors: [
      { name: 'Graphite', swatch: '#2b2d32', colors: { body: '#2b2d32', band: '#2b2d32' } },
      { name: 'Bone', swatch: '#dcd6ca', colors: { body: '#dcd6ca', band: '#cfc8ba' } },
      { name: 'Moss', swatch: '#46523f', colors: { body: '#46523f', band: '#3c4636' } },
    ] },
    specs: [['Driver', '40 mm beryllium'], ['Noise cancelling', 'Adaptive, 8 mics'], ['Battery', '38 h (ANC on)'], ['Codecs', 'LDAC · aptX HD · AAC'], ['Weight', '258 g']],
    included: ['H1 headphones', 'Carry case', 'USB-C cable', '3.5 mm cable'],
    warranty: '2-year GLOARO warranty', returns: STD_RETURNS, deliveryDays: 2,
    compare: { Weight: '258 g', Battery: '38 hours', Warranty: '2 years', 'Water resistance': 'IPX2' },
  },
  {
    id: 'handbag', model: 'handbag', category: 'fashion', brand: 'Maison Vara', name: 'Vara Atelier Tote', tagline: 'Cut flat. Built by hand.',
    price: 18900, mrp: 24500, rating: 4.7, reviews: 640, popularity: 84, isNew: true, stock: 'In stock', hero: true,
    tags: ['handbag', 'tote', 'leather', 'bag'],
    variants: { colors: [
      { name: 'Cognac', swatch: '#7a4a2e', colors: { leather: '#7a4a2e' } },
      { name: 'Noir', swatch: '#1e1b1a', colors: { leather: '#1e1b1a' } },
      { name: 'Ivory', swatch: '#e7dcc9', colors: { leather: '#e7dcc9' } },
    ] },
    specs: [['Material', 'Full-grain calf leather'], ['Dimensions', '36 × 26 × 14 cm'], ['Hardware', 'Brass, gold-plated'], ['Interior', 'Removable suede organiser'], ['Strap drop', '20 cm handle · 55 cm strap']],
    included: ['Tote', 'Shoulder strap', 'Organiser', 'Charm', 'Dust bag'],
    warranty: '1-year craftsmanship warranty', returns: '14-day returns', deliveryDays: 4,
    compare: { Weight: '820 g', Warranty: '1 year', 'Water resistance': 'Water-repellent finish' },
  },
  {
    id: 'laptop', model: 'laptop', category: 'electronics', brand: 'Arc', name: 'Arc Book Pro 14', tagline: 'Every layer, in its place.',
    price: 159900, mrp: 179900, rating: 4.8, reviews: 1890, popularity: 90, isNew: true, stock: 'In stock', hero: true,
    tags: ['laptop', 'notebook', 'computer', '14 inch', 'pro'],
    variants: { colors: [
      { name: 'Silver', swatch: '#c8cbd0', colors: { alu: '#c8cbd0', deck: '#b7bbc1' } },
      { name: 'Space black', swatch: '#33363c', colors: { alu: '#33363c', deck: '#2b2e33' } },
    ], extra: { label: 'Memory', options: [{ name: '18 GB · 512 GB', priceDelta: 0 }, { name: '36 GB · 1 TB', priceDelta: 40000 }] } },
    specs: [['Chip', '12-core CPU · 18-core GPU'], ['Display', '14.2" mini-LED, 120 Hz'], ['Battery', 'Up to 18 h'], ['Weight', '1.55 kg'], ['Ports', '3× Thunderbolt · HDMI · SD']],
    included: ['Arc Book Pro 14', '96 W USB-C adapter', 'Braided charging cable'],
    warranty: '1-year warranty + 1 year GLOARO Care', returns: '7-day replacement', deliveryDays: 2,
    compare: { Weight: '1.55 kg', Battery: '18 hours', Warranty: '2 years', 'Water resistance': '—' },
  },
  { id: 'serum', model: 'serum', category: 'beauty', brand: 'Aster', name: 'Aster C15 Serum', tagline: 'Three parts, one glow.', price: 1299, mrp: 1799, rating: 4.5, reviews: 9840, popularity: 86, isNew: false, stock: 'In stock', tags: ['serum', 'vitamin c', 'skincare'], specs: [['Volume', '30 ml'], ['Active', '15% ethyl ascorbic acid'], ['Skin type', 'All']], included: ['Serum with dropper'], warranty: '—', returns: 'Non-returnable once opened', deliveryDays: 3, compare: { Weight: '120 g', Warranty: '—' } },
  { id: 'perfume', model: 'perfume', category: 'beauty', brand: 'Aster', name: 'Iris Noir Eau de Parfum', tagline: 'A slow, warm trail.', price: 4499, mrp: 5999, rating: 4.6, reviews: 1260, popularity: 78, isNew: true, stock: 'In stock', tags: ['perfume', 'fragrance', 'iris'], specs: [['Volume', '50 ml'], ['Concentration', '18%'], ['Notes', 'Bergamot · iris · sandalwood']], included: ['Perfume', 'Gift box'], warranty: '—', returns: 'Non-returnable once opened', deliveryDays: 3, compare: { Weight: '310 g', Warranty: '—' } },
  { id: 'vase', model: 'vase', category: 'home', brand: 'Khurja Studio', name: 'Ridge Ceramic Vase', tagline: 'Thrown, glazed, fired twice.', price: 2899, mrp: 3999, rating: 4.7, reviews: 420, popularity: 70, isNew: false, stock: 'In stock', tags: ['vase', 'ceramic', 'decor', 'handmade'], specs: [['Height', '28 cm'], ['Material', 'Stoneware'], ['Finish', 'Reactive glaze']], included: ['Vase', 'Dried eucalyptus'], warranty: '—', returns: STD_RETURNS, deliveryDays: 5, compare: { Weight: '1.1 kg', Warranty: '—' } },
  { id: 'lamp', model: 'lamp', category: 'home', brand: 'Lumière', name: 'Halo Table Lamp', tagline: 'Marble, brass and linen.', price: 6499, mrp: 8999, rating: 4.6, reviews: 310, popularity: 72, isNew: true, stock: 'Only 6 left', tags: ['lamp', 'lighting', 'marble', 'brass'], specs: [['Height', '46 cm'], ['Bulb', '2,700 K LED, dimmable'], ['Base', 'Makrana marble']], included: ['Lamp', 'LED bulb', 'Cable'], warranty: '1-year warranty', returns: STD_RETURNS, deliveryDays: 4, compare: { Weight: '2.4 kg', Warranty: '1 year' } },
  { id: 'coffee', model: 'coffee', category: 'grocery', brand: 'Hillcrest', name: 'Chikmagalur Single Origin', tagline: 'Roasted this week.', price: 649, mrp: 799, rating: 4.7, reviews: 3880, popularity: 82, isNew: false, stock: 'In stock', tags: ['coffee', 'beans', 'arabica'], specs: [['Weight', '250 g'], ['Roast', 'Medium'], ['Notes', 'Cocoa · jaggery · orange']], included: ['Coffee beans in tin'], warranty: '—', returns: 'Non-returnable', deliveryDays: 2, compare: { Weight: '250 g', Warranty: '—' } },
  { id: 'honey', model: 'honey', category: 'grocery', brand: 'Ghats Collective', name: 'Raw Forest Honey', tagline: 'Never heated, never blended.', price: 499, mrp: 599, rating: 4.8, reviews: 6120, popularity: 80, isNew: false, stock: 'In stock', tags: ['honey', 'raw', 'organic'], specs: [['Weight', '350 g'], ['Source', 'Western Ghats'], ['Processing', 'Raw, unfiltered']], included: ['Honey jar', 'Wooden dipper'], warranty: '—', returns: 'Non-returnable', deliveryDays: 2, compare: { Weight: '350 g', Warranty: '—' } },
  { id: 'dumbbell', model: 'dumbbell', category: 'sports', brand: 'Forge', name: 'Forge Adjustable Dumbbell', tagline: 'Load, lock, lift.', price: 3499, mrp: 4999, rating: 4.5, reviews: 2210, popularity: 76, isNew: false, stock: 'In stock', tags: ['dumbbell', 'weights', 'gym', 'fitness'], specs: [['Weight', '12 kg (2 × 5 kg + handle)'], ['Plates', 'Urethane'], ['Handle', 'Chrome, knurled']], included: ['Handle', '4 plates', '2 collars'], warranty: '1-year warranty', returns: STD_RETURNS, deliveryDays: 4, compare: { Weight: '12 kg', Warranty: '1 year' } },
  { id: 'bottle', model: 'bottle', category: 'lifestyle', brand: 'Vessel', name: 'Vessel Insulated Bottle', tagline: 'Cold for 24 hours.', price: 1499, mrp: 1999, rating: 4.6, reviews: 7340, popularity: 85, isNew: false, stock: 'In stock', tags: ['bottle', 'flask', 'insulated', 'steel'],
    variants: { colors: [{ name: 'Indigo', swatch: '#3c5a7a', colors: { steel: '#3c5a7a' } }, { name: 'Sage', swatch: '#7d8d74', colors: { steel: '#7d8d74' } }, { name: 'Sand', swatch: '#cdbf9f', colors: { steel: '#cdbf9f' } }] },
    specs: [['Capacity', '750 ml'], ['Insulation', '24 h cold · 12 h hot'], ['Material', '18/8 steel']], included: ['Bottle', 'Sleeve'], warranty: 'Lifetime warranty', returns: STD_RETURNS, deliveryDays: 2, compare: { Weight: '390 g', Warranty: 'Lifetime' } },
  { id: 'sunglasses', model: 'sunglasses', category: 'fashion', brand: 'Maison Vara', name: 'Riviera Acetate Sunglasses', tagline: 'Polarised, hand-polished.', price: 7900, mrp: 9900, rating: 4.5, reviews: 980, popularity: 74, isNew: true, stock: 'In stock', tags: ['sunglasses', 'eyewear', 'polarised'], specs: [['Lens', 'Polarised, UV400'], ['Frame', 'Italian acetate'], ['Hinge', 'Five-barrel spring']], included: ['Sunglasses', 'Case', 'Cloth'], warranty: '1-year warranty', returns: STD_RETURNS, deliveryDays: 3, compare: { Weight: '32 g', Warranty: '1 year' } },
  { id: 'notebook', model: 'notebook', category: 'lifestyle', brand: 'Folio', name: 'Folio Dotted Notebook', tagline: 'Lies flat. Takes ink.', price: 899, mrp: 1199, rating: 4.7, reviews: 1540, popularity: 68, isNew: false, stock: 'In stock', tags: ['notebook', 'journal', 'stationery'], specs: [['Pages', '192 dotted'], ['Paper', '100 gsm acid-free'], ['Size', 'A5']], included: ['Notebook'], warranty: '—', returns: STD_RETURNS, deliveryDays: 3, compare: { Weight: '340 g', Warranty: '—' } },
]

export const HERO_ORDER = ['camera', 'sneaker', 'watch', 'headphones', 'handbag', 'laptop']

export const findProduct = (id) => PRODUCTS.find((p) => p.id === id)
export const BRANDS = [...new Set(PRODUCTS.map((p) => p.brand))].sort()

export const REVIEW_SNIPPETS = {
  camera: [['Arjun K.', 5, 'Autofocus tracks birds in flight without hunting. The grip is perfect with long lenses.'], ['Riya S.', 5, 'Colour straight out of camera is beautiful. Battery lasts a full wedding shoot.'], ['Faisal M.', 4, 'Brilliant, but the menus take a week to learn.']],
  sneaker: [['Neha P.', 5, 'Lightest pair I own and the midsole is properly bouncy.'], ['Kabir J.', 4, 'Runs a little narrow, go half a size up.'], ['Ira D.', 5, 'Washed it twice, the knit still looks new.']],
  watch: [['Vikram R.', 5, 'The sunburst dial is stunning in daylight. Keeps time within 2 s a day.'], ['Ananya B.', 5, 'The quick-release strap is genuinely tool-free.'], ['Rahul T.', 4, 'Heavier than expected, in a good way.']],
  headphones: [['Meera P.', 5, 'Detailed, neutral and very comfortable on long flights.'], ['Sid V.', 4, 'ANC is excellent; pads run warm in summer.'], ['Tara N.', 5, 'The dial is so much better than touch controls.']],
  handbag: [['Pooja L.', 5, 'The leather smells and feels expensive. Holds a 13" laptop.'], ['Simran K.', 5, 'Stands on its own, the organiser is so useful.'], ['Aisha F.', 4, 'Ivory needs care, but it is gorgeous.']],
  laptop: [['Dev A.', 5, 'Compiles our whole codebase without the fans spinning up.'], ['Kavya R.', 5, 'The display is the best I have used on a laptop.'], ['Nikhil S.', 4, 'Pricey, but the battery life is real.']],
}

export const reviewsFor = (id) => REVIEW_SNIPPETS[id] || [['Verified buyer', 5, 'Exactly as described, well packed and quick delivery.'], ['Verified buyer', 4, 'Good quality for the price. Would buy again.']]
