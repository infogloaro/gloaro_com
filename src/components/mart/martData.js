// Presentation-only mock data for the GLOARO MART showcase page.
// Nothing here is wired to the real marketplace APIs.

export const EASE = [0.22, 1, 0.36, 1]

export const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

export const staggerChild = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

export const MARKETPLACE_URL = '/products'
export const SELL_URL = '/register'

export const navLinks = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'business', label: 'For Businesses' },
  { id: 'web-mobile', label: 'Web & Mobile' },
  { id: 'how-it-works', label: 'How It Works' },
]

// tone → tailwind gradient used for product "photo" tiles
export const products = [
  { id: 'earbuds', name: 'Wireless Earbuds Pro', seller: 'Tech Store', price: 2499, mrp: 3999, rating: 4.6, distance: '3.1 km', stock: 'In stock', icon: 'Headphones', tone: 'from-sky-100 to-blue-200', ink: 'text-[#0b469e]' },
  { id: 'watch', name: 'Smart Watch S2', seller: 'Gadget Point', price: 3999, mrp: 5499, rating: 4.5, distance: '2.2 km', stock: 'In stock', icon: 'Watch', tone: 'from-indigo-100 to-slate-200', ink: 'text-[#0b2451]' },
  { id: 'kurta', name: 'Cotton Kurta', seller: 'Fashion Hub', price: 899, mrp: 1299, rating: 4.7, distance: '1.8 km', stock: 'In stock', icon: 'Shirt', tone: 'from-amber-100 to-orange-200', ink: 'text-[#b45309]' },
  { id: 'rice', name: 'Basmati Rice 5 kg', seller: 'Fresh Mart', price: 649, mrp: 760, rating: 4.8, distance: '2.4 km', stock: 'In stock', icon: 'Wheat', tone: 'from-yellow-100 to-amber-200', ink: 'text-[#a16207]' },
  { id: 'lamp', name: 'Study Desk Lamp', seller: 'Home Essentials', price: 1199, mrp: 1599, rating: 4.4, distance: '0.9 km', stock: 'Only 3 left', icon: 'Lamp', tone: 'from-emerald-50 to-teal-100', ink: 'text-[#0f766e]' },
  { id: 'laptop', name: 'Ultrabook 14"', seller: 'Tech Store', price: 54990, mrp: 62990, rating: 4.6, distance: '3.1 km', stock: 'In stock', icon: 'Laptop', tone: 'from-slate-100 to-blue-100', ink: 'text-[#0b469e]' },
]

export const searchResults = [
  { name: 'Wireless Earbuds Pro', seller: 'Tech Store', distance: '3.1 km', price: 2499, rating: 4.6, reviews: 214, stock: 'In stock', icon: 'Headphones', tone: 'from-sky-100 to-blue-200' },
  { name: 'BassBeat Buds ANC', seller: 'Gadget Point', distance: '2.2 km', price: 2899, rating: 4.5, reviews: 132, stock: 'In stock', icon: 'Headphones', tone: 'from-indigo-100 to-violet-100' },
  { name: 'AirLite Earbuds', seller: 'Sound Corner', distance: '1.4 km', price: 1799, rating: 4.3, reviews: 96, stock: 'Only 4 left', icon: 'Headphones', tone: 'from-amber-50 to-orange-100' },
]

export const categories = [
  { label: 'Grocery', icon: 'ShoppingBasket' },
  { label: 'Electronics', icon: 'Smartphone' },
  { label: 'Fashion', icon: 'Shirt' },
  { label: 'Home', icon: 'Sofa' },
  { label: 'Beauty', icon: 'Sparkles' },
  { label: 'Fitness', icon: 'Dumbbell' },
  { label: 'Kids', icon: 'Baby' },
  { label: 'Health', icon: 'Pill' },
  { label: 'Café', icon: 'Coffee' },
  { label: 'Wholesale', icon: 'Boxes' },
]

export const vendors = [
  { name: 'Fresh Mart', type: 'Grocery', distance: '2.4 km', rating: 4.8, icon: 'ShoppingBasket', tone: 'from-emerald-100 to-lime-100', ink: 'text-emerald-700' },
  { name: 'Fashion Hub', type: 'Fashion', distance: '1.8 km', rating: 4.7, icon: 'Shirt', tone: 'from-amber-100 to-orange-100', ink: 'text-amber-700' },
  { name: 'Tech Store', type: 'Electronics', distance: '3.1 km', rating: 4.9, icon: 'Smartphone', tone: 'from-sky-100 to-blue-100', ink: 'text-[#0b469e]' },
  { name: 'Home Essentials', type: 'Home & Living', distance: '0.9 km', rating: 4.6, icon: 'Sofa', tone: 'from-rose-50 to-pink-100', ink: 'text-rose-700' },
]

export const formatINR = (value) => `₹${value.toLocaleString('en-IN')}`
