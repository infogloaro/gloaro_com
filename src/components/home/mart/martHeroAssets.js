// Image assets and mock catalogue data for the Gloaro Mart hero visual.
// Produce photos: src/assets/mart-hero (see CREDITS.md). 3D renders reuse the
// retail prototype's product set so the scene shares one lighting style.

import tomatoCrate from '../../../assets/mart-hero/tomato-crate.webp'
import mandarin from '../../../assets/mart-hero/mandarin.webp'
import strawberry from '../../../assets/mart-hero/strawberry.webp'
import peppers from '../../../assets/mart-hero/peppers.webp'
import apple from '../../../assets/mart-hero/apple.webp'
import broccoli from '../../../assets/mart-hero/broccoli.webp'
import sneaker from '../../../prototypes/retail/default/media/products/sneaker.png'
import headphones from '../../../prototypes/retail/default/media/products/headphones.png'
import watch from '../../../prototypes/retail/default/media/products/watch.png'
import handbag from '../../../prototypes/retail/default/media/products/handbag.png'
import lamp from '../../../prototypes/retail/default/media/products/lamp.png'
import perfume from '../../../prototypes/retail/default/media/products/perfume.png'

export const images = { tomatoCrate, mandarin, strawberry, peppers, apple, broccoli, sneaker, headphones, watch, handbag, lamp, perfume }

// Fixed design canvas (px). The scene is authored at this size and scaled to fit.
export const CANVAS = { width: 760, height: 640 }

export const phoneDeals = [
  { id: 'tomato', name: 'Cherry Tomatoes', price: '₹49', unit: '/kg', image: tomatoCrate, stock: 'In stock' },
  { id: 'sneaker', name: 'Running Shoes', price: '₹1,299', unit: '', image: sneaker, stock: 'In stock' },
]

export const phoneCategories = [
  { id: 'fruits', label: 'Fruits & Veg', image: apple },
  { id: 'fashion', label: 'Fashion', image: handbag },
  { id: 'electronics', label: 'Electronics', image: headphones },
  { id: 'home', label: 'Home', image: lamp },
]

export const dashboardProducts = [
  { id: 'veg', name: 'Organic Vegetables', price: '₹49 – ₹199', image: peppers, stock: 'In stock', low: false, vendor: 'Fresh Mart' },
  { id: 'sneaker', name: "Men's Sneakers", price: '₹1,299', image: sneaker, stock: 'In stock', low: false, vendor: 'Urban Kicks' },
  { id: 'watch', name: 'Classic Watch', price: '₹3,499', image: watch, stock: 'In stock', low: false, vendor: 'Gadget Point' },
  { id: 'bag', name: 'Leather Handbag', price: '₹2,199', image: handbag, stock: 'Low stock', low: true, vendor: 'Fashion Hub' },
  { id: 'lamp', name: 'Table Lamp', price: '₹899', image: lamp, stock: 'In stock', low: false, vendor: 'Home Essentials' },
  { id: 'fruit', name: 'Fresh Fruits', price: '₹79 /kg', image: mandarin, stock: 'In stock', low: false, vendor: 'Fresh Mart' },
]
