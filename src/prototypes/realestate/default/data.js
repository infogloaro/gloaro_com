export const imageUrl = (id, width = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

export const HERO_IMAGE = 'photo-1600047509807-ba8f99d2cdde'
export const ABOUT_IMAGE = 'photo-1600607687920-4e2a09cf159d'
export const AMENITY_PHOTOS = [
  { id: 'photo-1560185127-6ed189bf02f4', caption: 'Infinity pool' },
  { id: 'photo-1571902943202-507ec2618e8f', caption: 'Fitness centre' },
  { id: 'photo-1600210492493-0946911123ea', caption: 'Grand clubhouse' },
  { id: 'photo-1572120360610-d971b9d7767c', caption: 'Resident lounge' },
]
export const PROPERTY_GALLERY_PREVIEW = [
  'photo-1572120360610-d971b9d7767c',
  'photo-1600566753086-00f18fb6b3ea',
  'photo-1507089947368-19c1da9775ae',
]

// Brand info for a premium Indian real estate company
export const BRAND = {
  name: 'Prestige Horizon',
  tagline: 'Building Dreams, Crafting Futures',
  city: 'Mumbai',
  address: ['Prestige Horizon Tower, BKC', 'Bandra Kurla Complex, Mumbai 400051'],
  phone: '+91 22 6800 9900',
  email: 'hello@prestigehorizon.in',
  founded: '1998',
  projectsDelivered: '200+',
  happyFamilies: '15,000+',
  sqftDelivered: '45M+',
}

// Navigation items
export const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'properties', label: 'Properties' },
  { id: 'about', label: 'About Us' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'contact', label: 'Contact' },
]

// Featured properties (Indian cities & pricing in INR)
export const PROPERTIES = [
  {
    id: 'skyline-towers',
    name: 'Skyline Towers',
    location: 'Worli, Mumbai',
    type: 'Luxury Apartments',
    price: '₹3.5 Cr onwards',
    priceValue: 35000000,
    beds: '3-4 BHK',
    sqft: '1,850 – 3,200 sq.ft',
    status: 'Ready to Move',
    tag: 'Premium',
    features: ['Sea View', 'Private Pool', 'Smart Home'],
    description: 'Ultra-luxury sea-facing residences with panoramic Arabian Sea views, designed by world-renowned architects.',
    highlight: 'Breathtaking 270° sea views from every apartment',
    image: 'photo-1486406146926-c627a92ad1ab',
    gallery: 4,
  },
  {
    id: 'green-valley',
    name: 'Green Valley Estate',
    location: 'Whitefield, Bangalore',
    type: 'Premium Villas',
    price: '₹2.8 Cr onwards',
    priceValue: 28000000,
    beds: '4-5 BHK',
    sqft: '3,500 – 5,800 sq.ft',
    status: 'Under Construction',
    tag: 'Eco Living',
    features: ['Private Garden', 'EV Charging', 'Rainwater Harvesting'],
    description: 'Sustainable luxury villas nestled in 12 acres of landscaped greenery with world-class eco-friendly features.',
    highlight: 'IGBC Platinum rated green living',
    image: 'photo-1600596542815-ffad4c1539a9',
    gallery: 4,
  },
  {
    id: 'royal-heritage',
    name: 'Royal Heritage',
    location: 'Golf Course Road, Gurgaon',
    type: 'Penthouse Collection',
    price: '₹5.2 Cr onwards',
    priceValue: 52000000,
    beds: '4-5 BHK',
    sqft: '4,200 – 7,500 sq.ft',
    status: 'Booking Open',
    tag: 'Ultra Luxury',
    features: ['Private Terrace', 'Butler Service', 'Helipad Access'],
    description: 'The pinnacle of opulence — handcrafted penthouses with private terraces, concierge service and unmatched grandeur.',
    highlight: 'Private elevator access to each penthouse',
    image: 'photo-1545324418-cc1a3fa10c00',
    gallery: 4,
  },
  {
    id: 'marina-bay',
    name: 'Marina Bay Residences',
    location: 'ECR, Chennai',
    type: 'Beachfront Apartments',
    price: '₹1.8 Cr onwards',
    priceValue: 18000000,
    beds: '2-3 BHK',
    sqft: '1,400 – 2,600 sq.ft',
    status: 'Nearing Completion',
    tag: 'Waterfront',
    features: ['Beach Access', 'Infinity Pool', 'Clubhouse'],
    description: 'Wake up to the sound of waves in these meticulously crafted beachfront residences on East Coast Road.',
    highlight: 'Direct beach access with private cabanas',
    image: 'photo-1580587771525-78b9dba3b914',
    gallery: 4,
  },
  {
    id: 'tech-park-residency',
    name: 'Tech Park Residency',
    location: 'HITEC City, Hyderabad',
    type: 'Smart Apartments',
    price: '₹95 L onwards',
    priceValue: 9500000,
    beds: '2-3 BHK',
    sqft: '1,100 – 1,900 sq.ft',
    status: 'Ready to Move',
    tag: 'Smart Living',
    features: ['IoT Enabled', 'Co-working Space', 'Metro Adjacent'],
    description: 'Future-ready smart homes designed for the modern professional, minutes from IT corridor.',
    highlight: 'Fully integrated smart home automation',
    image: 'photo-1551038247-3d9af20df552',
    gallery: 4,
  },
  {
    id: 'palm-gardens',
    name: 'Palm Gardens',
    location: 'Noida Expressway, Noida',
    type: 'Integrated Township',
    price: '₹1.2 Cr onwards',
    priceValue: 12000000,
    beds: '2-4 BHK',
    sqft: '1,250 – 3,400 sq.ft',
    status: 'New Launch',
    tag: 'Township',
    features: ['School', 'Hospital', 'Shopping Mall'],
    description: 'A self-sufficient 50-acre integrated township with every amenity your family needs, right at your doorstep.',
    highlight: '50-acre integrated township with 70% open space',
    image: 'photo-1515263487990-61b07816b324',
    gallery: 4,
  },
]

// Property categories/filters
export const PROPERTY_TYPES = [
  { id: 'all', label: 'All Properties' },
  { id: 'apartment', label: 'Apartments' },
  { id: 'villa', label: 'Villas' },
  { id: 'penthouse', label: 'Penthouses' },
  { id: 'township', label: 'Townships' },
]

// Home loan & financing partners
export const FINANCE_PARTNERS = ['SBI Home Loans', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'LIC Housing Finance']

// Stats/counters
export const STATS = [
  { value: '200+', label: 'Projects Delivered', suffix: '' },
  { value: '15,000+', label: 'Happy Families', suffix: '' },
  { value: '45M+', label: 'Sq.Ft Delivered', suffix: '' },
  { value: '25+', label: 'Cities Across India', suffix: '' },
]

// Amenities list with icons and descriptions
export const AMENITIES = [
  { id: 'pool', icon: '🏊', title: 'Infinity Pool', desc: 'Temperature-controlled rooftop infinity pool with city views' },
  { id: 'gym', icon: '🏋️', title: 'Fitness Center', desc: 'State-of-the-art gym with personal training facility' },
  { id: 'garden', icon: '🌳', title: 'Landscape Gardens', desc: 'Zen gardens and jogging tracks spread across acres' },
  { id: 'club', icon: '🏛️', title: 'Grand Clubhouse', desc: '40,000 sq.ft clubhouse with banquet and recreation' },
  { id: 'security', icon: '🛡️', title: 'Smart Security', desc: 'AI-powered surveillance with biometric access' },
  { id: 'parking', icon: '🚗', title: 'Multi-level Parking', desc: 'Automated parking with EV charging stations' },
  { id: 'kids', icon: '🎮', title: 'Kids Zone', desc: 'Indoor and outdoor play areas for children' },
  { id: 'spa', icon: '💆', title: 'Spa & Wellness', desc: 'Ayurvedic spa, sauna, and meditation rooms' },
  { id: 'theater', icon: '🎬', title: 'Mini Theater', desc: 'Private screening room with Dolby Atmos' },
  { id: 'sports', icon: '🎾', title: 'Sports Complex', desc: 'Tennis, badminton, squash, and cricket nets' },
  { id: 'cowork', icon: '💼', title: 'Co-working Hub', desc: 'Business center with meeting rooms and high-speed internet' },
  { id: 'green', icon: '🌱', title: 'Green Living', desc: 'Solar panels, rainwater harvesting, waste management' },
]

// Testimonials
export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Rajesh & Priya Sharma',
    role: 'Homeowners at Skyline Towers',
    location: 'Mumbai',
    text: 'Moving into our Skyline Towers apartment was a dream come true. The attention to detail in every corner of our home is remarkable. The sea view from our balcony is absolutely breathtaking.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Dr. Anand Krishnamurthy',
    role: 'Investor, Green Valley Estate',
    location: 'Bangalore',
    text: 'As someone who has invested in multiple properties across India, Prestige Horizon stands out for their commitment to quality and timely delivery. Their transparency throughout the process is unmatched.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Meera & Vikram Patel',
    role: 'Villa Owners',
    location: 'Gurgaon',
    text: 'Our villa at Royal Heritage redefined our understanding of luxury living. The private terrace, the butler service — everything exceeds expectations. This is truly world-class living in India.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Sunita Reddy',
    role: 'First-time Buyer',
    location: 'Hyderabad',
    text: 'Being a first-time buyer, I was nervous, but the team at Prestige Horizon guided me through every step. My smart apartment at Tech Park Residency is everything I hoped for and more.',
    rating: 5,
  },
]

// Timeline / Journey
export const JOURNEY = [
  { year: '1998', title: 'Foundation', desc: 'Started with a vision to redefine Indian real estate' },
  { year: '2005', title: 'First Landmark', desc: 'Delivered our 25th project — 5,000 happy families' },
  { year: '2012', title: 'Pan-India Expansion', desc: 'Expanded to 10 major cities across India' },
  { year: '2018', title: 'Smart Living Pioneer', desc: 'Launched India\'s first fully IoT-integrated township' },
  { year: '2024', title: 'Sustainability Leader', desc: 'All new projects IGBC Platinum certified' },
  { year: '2026', title: 'The Future', desc: '200+ projects, 15,000+ families, 25+ cities' },
]

// Utility
export const inr = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`

export const findProperty = (id) => PROPERTIES.find((p) => p.id === id)
