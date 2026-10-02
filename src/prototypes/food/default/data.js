import burgerFull from './media/burger-full.jpg'
import burgerLayers from './media/burger-layers.jpg'
import burgerPoster from './media/burger-poster.jpg'
import pizzaOven from './media/pizza-oven.jpg'
import pizzaClose from './media/pizza-close.jpg'
import pizzaSlices from './media/pizza-slices.jpg'
import burgerVideo from './media/burger-stack.mp4'
import pizzaVideo from './media/pizza-cut.mp4'

export const MEDIA = { burgerFull, burgerLayers, burgerPoster, pizzaOven, pizzaClose, pizzaSlices, burgerVideo, pizzaVideo }

export const BRAND = {
  name: 'Maison Ember',
  city: 'Chennai',
  address: ['14 Khader Nawaz Khan Road', 'Nungambakkam, Chennai 600006'],
  phone: '+91 44 4000 1919',
  email: 'table@maisonember.in',
  coords: '13.0569° N · 80.2425° E',
}

export const CATEGORIES = [
  { id: 'fire', label: 'Fire', note: 'From the oak oven' },
  { id: 'buns', label: 'Stacks', note: 'Between brioche' },
  { id: 'small', label: 'Small', note: 'To begin' },
  { id: 'sweet', label: 'Sweet', note: 'To finish' },
  { id: 'pour', label: 'Pour', note: 'Zero-proof' },
]

export const MENU = [
  {
    id: 'margherita', cat: 'fire', name: 'Margherita Verace', price: 520, veg: true, img: pizzaClose,
    desc: 'Forty-eight hour dough, San Marzano tomato, fior di latte and basil, blistered at 485°.',
    plate: ['48-hour fermented dough', 'San Marzano tomato', 'Fior di latte', 'Sweet basil', 'Ligurian olive oil'],
    pairing: 'Sparkling lime & basil soda', allergens: 'Gluten, dairy',
  },
  {
    id: 'grande', cat: 'fire', name: 'Margherita Grande', price: 980, veg: true, img: pizzaSlices,
    desc: 'Our Margherita at sixteen inches, cut into eight at the table. Made to be shared.',
    plate: ['16-inch hand-stretched base', 'San Marzano tomato', 'Double fior di latte', 'Basil', 'Olive oil'],
    pairing: 'A carafe of cold-pressed watermelon', allergens: 'Gluten, dairy',
  },
  {
    id: 'diavola', cat: 'fire', name: 'Diavola Affumicata', price: 640, spicy: true,
    desc: 'Smoked chicken salami, Calabrian chilli, smoked scamorza and chilli honey.',
    plate: ['Smoked chicken salami', 'Calabrian chilli', 'Scamorza', 'Chilli honey'],
    pairing: 'Smoked pineapple shrub', allergens: 'Gluten, dairy',
  },
  {
    id: 'bianca', cat: 'fire', name: 'Bianca al Tartufo', price: 720, veg: true,
    desc: 'No tomato. Ricotta, wild mushrooms, black truffle oil and thyme.',
    plate: ['Whipped ricotta', 'Wild mushrooms', 'Black truffle oil', 'Thyme'],
    pairing: 'Cold brew tonic', allergens: 'Gluten, dairy',
  },
  {
    id: 'stack', cat: 'buns', name: 'The Ember Stack', price: 560, img: burgerFull,
    desc: 'Dry-aged patty, molten gruyère sauce, wild rocket, heirloom tomato and caramelised onion on toasted brioche.',
    plate: ['Dry-aged smashed patty', 'Gruyère sauce', 'Wild rocket', 'Heirloom tomato', 'Red onion', 'Caramelised onion', 'Brioche'],
    pairing: 'Smoked old fashioned (zero-proof)', allergens: 'Gluten, dairy, egg',
  },
  {
    id: 'mushroom', cat: 'buns', name: 'Smoked Mushroom Stack', price: 520, veg: true,
    desc: 'Oyster mushroom patty, smoked cheddar, pickled shallots and truffle mayo.',
    plate: ['Oyster mushroom patty', 'Smoked cheddar', 'Pickled shallot', 'Truffle mayo', 'Brioche'],
    pairing: 'Cold brew tonic', allergens: 'Gluten, dairy, egg',
  },
  {
    id: 'chicken', cat: 'buns', name: 'Fire-Glazed Chicken', price: 540, spicy: true,
    desc: 'Buttermilk chicken thigh, gochujang glaze, slaw and kewpie.',
    plate: ['Buttermilk chicken thigh', 'Gochujang glaze', 'Cabbage slaw', 'Kewpie'],
    pairing: 'Smoked pineapple shrub', allergens: 'Gluten, egg, soy',
  },
  {
    id: 'burrata', cat: 'small', name: 'Burrata & Ember Tomatoes', price: 460, veg: true,
    desc: 'Whole burrata, fire-blistered cherry tomatoes and basil oil, with grilled sourdough.',
    plate: ['Burrata', 'Cherry tomatoes', 'Basil oil', 'Sourdough'], pairing: 'Sparkling lime & basil soda', allergens: 'Gluten, dairy',
  },
  {
    id: 'corn', cat: 'small', name: 'Charred Corn, Chilli Butter', price: 320, veg: true, spicy: true,
    desc: 'Oven-charred corn, chilli-lime butter and aged parmesan.',
    plate: ['Sweet corn', 'Chilli-lime butter', 'Parmesan'], pairing: 'Cold-pressed watermelon', allergens: 'Dairy',
  },
  {
    id: 'fries', cat: 'small', name: 'Triple-Cooked Fries', price: 260, veg: true,
    desc: 'Rosemary salt and roasted garlic aioli.',
    plate: ['Potato', 'Rosemary salt', 'Garlic aioli'], pairing: 'Any', allergens: 'Egg',
  },
  {
    id: 'basque', cat: 'sweet', name: 'Burnt Basque Cheesecake', price: 420, veg: true,
    desc: 'Caramelised top, soft centre, served with sour cherry.',
    plate: ['Cream cheese', 'Caramelised crust', 'Sour cherry'], pairing: 'Espresso', allergens: 'Dairy, egg',
  },
  {
    id: 'tiramisu', cat: 'sweet', name: 'Tiramisu della Casa', price: 380, veg: true,
    desc: 'Mascarpone, espresso-soaked savoiardi and bitter cocoa.',
    plate: ['Mascarpone', 'Savoiardi', 'Espresso', 'Cocoa'], pairing: 'Espresso', allergens: 'Gluten, dairy, egg',
  },
  {
    id: 'tonic', cat: 'pour', name: 'Cold Brew Tonic', price: 240, veg: true,
    desc: '18-hour cold brew over tonic with orange peel.', plate: ['Cold brew', 'Tonic', 'Orange peel'], pairing: '—', allergens: 'None',
  },
  {
    id: 'oldfashioned', cat: 'pour', name: 'Smoked Old Fashioned', price: 320, veg: true,
    desc: 'Zero-proof. Oak-smoked, demerara, aromatic bitters.', plate: ['Oak smoke', 'Demerara', 'Bitters'], pairing: '—', allergens: 'None',
  },
]

export const SIGNATURE = ['stack', 'margherita', 'grande']

// 0 = Sunday. Closed Mondays.
export const HOURS = [
  { day: 'Sunday', time: '12:30 – 23:00' },
  { day: 'Monday', time: 'Closed' },
  { day: 'Tuesday', time: '18:00 – 23:00' },
  { day: 'Wednesday', time: '18:00 – 23:00' },
  { day: 'Thursday', time: '18:00 – 23:30' },
  { day: 'Friday', time: '18:00 – 00:00' },
  { day: 'Saturday', time: '12:30 – 00:00' },
]

export const TIME_SLOTS = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30']

export const inr = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`

export const findDish = (id) => MENU.find((m) => m.id === id)
