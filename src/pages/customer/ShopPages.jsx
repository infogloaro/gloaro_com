/* eslint-disable react-hooks/set-state-in-effect, react-hooks/purity */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  ArrowRight,
  Banknote,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Heart,
  HeartOff,
  Minus,
  Package,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  Upload,
  X,
} from 'lucide-react'
import { customerApi } from '../../api/customer'
import { paymentApi } from '../../api/payment'
import EmptyState from '../../components/common/EmptyState'
import LoadingScreen from '../../components/common/LoadingScreen'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import StatusBadge from '../../components/common/StatusBadge'
import { useApi } from '../../hooks/useApi'
import { useAuth } from '../../hooks/useAuth'
import { useShop, RETURN_REASONS, RETURN_METHODS, REFUND_METHODS, RETURN_STATUS_FLOW, REFUND_STATUS_FLOW } from '../../context/ShopContext'
import { formatCurrency, formatDate, getList } from '../../utils/format'

const SORT_OPTIONS = [
  ['relevance', 'Relevance'],
  ['latest', 'Latest'],
  ['price_asc', 'Price: Low to High'],
  ['price_desc', 'Price: High to Low'],
  ['rating_desc', 'Highest Rated'],
  ['popular', 'Most Popular'],
  ['discount_desc', 'Biggest Discount'],
]

const DELIVERY_OPTIONS = [
  { value: 'standard', label: 'Standard', eta: '3-5 days', fee: 59 },
  { value: 'express', label: 'Express', eta: '1-2 days', fee: 149 },
  { value: 'scheduled', label: 'Scheduled', eta: '4-6 days', fee: 79 },
]

const ATTRIBUTE_FIELDS = ['size', 'color', 'material', 'weight', 'storage', 'pack size', 'packsize']

function useDebouncedValue(value, delay = 350) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(timer)
  }, [value, delay])
  return debounced
}

function useQueryState() {
  const [searchParams, setSearchParams] = useSearchParams()
  const read = (key, fallback = '') => searchParams.get(key) || fallback
  const update = (patch, replace = true) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(patch).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') next.delete(key)
      else next.set(key, String(value))
    })
    setSearchParams(next, { replace })
  }
  return { searchParams, read, update }
}

function getProductImage(product, variant) {
  return variant?.images?.[0]?.url || product.images?.[0]?.url || product.vendor?.logo?.url || '/logo.png'
}

function getBrand(product) {
  return product.brand || product.vendor?.businessName || product.vendor?.ownerName || 'Gloaro partner'
}

function getPrice(product, variant) {
  return Number(variant?.price ?? product.pricing?.sellingPrice ?? 0)
}

function getOriginalPrice(product, variant) {
  return Number(variant?.originalPrice ?? product.pricing?.mrp ?? product.pricing?.sellingPrice ?? 0)
}

function getDiscount(product, variant) {
  const original = getOriginalPrice(product, variant)
  const price = getPrice(product, variant)
  if (!original || original <= price) return 0
  return Math.round(((original - price) / original) * 100)
}

function getStockStatus(product, variant) {
  const quantity = Number(variant?.stock ?? product.inventory?.quantity ?? 0)
  if (product.inventory?.isUnlimited) return 'In stock'
  if (quantity <= 0) return 'Out of stock'
  if (quantity <= Number(product.inventory?.lowStockAlert || 10)) return 'Limited stock'
  return 'In stock'
}

function getBadge(product) {
  if (!product.inventory?.isUnlimited && Number(product.inventory?.quantity || 0) <= 0) return 'Out of stock'
  if (product.isFeatured) return 'Featured'
  if (product.stats?.totalReviews >= 50) return 'Best Seller'
  const daysOld = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  if (daysOld <= 14) return 'New'
  return getDiscount(product) >= 20 ? 'Limited Offer' : 'Popular'
}

function getRating(product) {
  return Number(product.stats?.avgRating || product.vendor?.stats?.avgRating || 0)
}

function getReviewCount(product) {
  return Number(product.stats?.totalReviews || product.vendor?.stats?.totalReviews || 0)
}

function getAverageReviewRating(reviews = [], fallback = 0) {
  if (!reviews.length) return Number(fallback || 0)
  const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0)
  return total / reviews.length
}

function getPopularityScore(product) {
  const sales = Number(product.stats?.orders || product.stats?.sales || product.stats?.totalOrders || product.stats?.sold || 0)
  const views = Number(product.stats?.views || product.stats?.totalViews || 0)
  const reviews = getReviewCount(product)
  return (sales * 1000) + (views * 10) + (reviews * 25) + (getRating(product) * 100)
}

function isWishlisted(wishlist = [], productId) {
  return wishlist.some((item) => String(item.productId) === String(productId))
}

function getVariantOptions(product) {
  const variants = Array.isArray(product.variants) ? product.variants : []
  return variants.map((variant, index) => ({
    ...variant,
    index,
    display: variant.option || variant.value || variant.name || `Variant ${index + 1}`,
  }))
}

function deriveFacetValues(product) {
  const attrs = Array.isArray(product.attributes) ? product.attributes : []
  const values = Object.fromEntries(ATTRIBUTE_FIELDS.map((field) => [field, []]))
  attrs.forEach((attr) => {
    const key = String(attr.name || '').toLowerCase()
    const entry = ATTRIBUTE_FIELDS.find((field) => key.includes(field))
    if (entry && attr.value) values[entry].push(String(attr.value).toLowerCase())
  })
  getVariantOptions(product).forEach((variant) => {
    if (variant.name) values.size.push(String(variant.name).toLowerCase())
    if (variant.option) values.color.push(String(variant.option).toLowerCase())
  })
  return values
}

function matchesFilters(product, filters) {
  const brand = getBrand(product).toLowerCase()
  const category = String(product.category?.name || '').toLowerCase()
  const subcategory = String(product.subcategory?.name || product.category?.parent?.name || '').toLowerCase()
  const rating = getRating(product)
  const discount = getDiscount(product)
  const stock = Number(product.inventory?.quantity || 0)
  const price = getPrice(product)
  const facetValues = deriveFacetValues(product)
  const searchTerms = [product.title, product.shortDescription, product.description, brand, category, subcategory, product.sku]
    .join(' ')
    .toLowerCase()

  if (filters.search && !searchTerms.includes(filters.search.toLowerCase())) return false
  if (filters.category && String(product.category?._id || product.category) !== filters.category) return false
  if (filters.brand && !brand.includes(filters.brand.toLowerCase())) return false
  if (filters.minPrice && price < Number(filters.minPrice)) return false
  if (filters.maxPrice && price > Number(filters.maxPrice)) return false
  if (filters.rating && rating < Number(filters.rating)) return false
  if (filters.availability === 'in_stock' && stock <= 0 && !product.inventory?.isUnlimited) return false
  if (filters.availability === 'out_of_stock' && (stock > 0 || product.inventory?.isUnlimited)) return false
  if (filters.discount === 'discounted' && discount <= 0) return false
  if (filters.discount === '20_plus' && discount < 20) return false
  if (filters.featured === 'true' && !product.isFeatured) return false
  if (filters.newArrivals === 'true') {
    const daysOld = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    if (daysOld > 21) return false
  }
  if (filters.size && !facetValues.size.some((value) => value.includes(filters.size.toLowerCase()))) return false
  if (filters.color && !facetValues.color.some((value) => value.includes(filters.color.toLowerCase()))) return false
  if (filters.material && !facetValues.material.some((value) => value.includes(filters.material.toLowerCase()))) return false
  return true
}

function sortProducts(products, sortBy) {
  const list = [...products]
  const sorter = {
    latest: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    price_asc: (a, b) => getPrice(a) - getPrice(b),
    price_desc: (a, b) => getPrice(b) - getPrice(a),
    rating_desc: (a, b) => getRating(b) - getRating(a),
    popular: (a, b) => (b.stats?.views || 0) - (a.stats?.views || 0),
    discount_desc: (a, b) => getDiscount(b) - getDiscount(a),
  }[sortBy]
  return sorter ? list.sort(sorter) : list
}

function getCategoryChips(products) {
  const chips = new Map()
  products.forEach((product) => {
    const name = product.category?.name || 'All'
    if (!chips.has(name)) chips.set(name, product.category?._id || '')
  })
  return [...chips.entries()].slice(0, 10)
}

function getRecommended(products, sourceProduct) {
  if (!sourceProduct) return products.slice(0, 4)
  const sourceCategory = String(sourceProduct.category?._id || sourceProduct.category || '')
  const sourceSubcategory = String(sourceProduct.subcategory?._id || sourceProduct.subcategory || sourceProduct.category?.parent?._id || sourceProduct.category?.parent || '')
  const sourceBrand = getBrand(sourceProduct)
  const sourceVendor = String(sourceProduct.vendor?._id || sourceProduct.vendor || '')
  return products
    .filter((product) => product._id !== sourceProduct._id)
    .sort((a, b) => {
      const scoreA =
        (String(a.category?._id || a.category) === sourceCategory ? 5 : 0) +
        (String(a.subcategory?._id || a.subcategory || a.category?.parent?._id || a.category?.parent || '') === sourceSubcategory ? 3 : 0) +
        (getBrand(a) === sourceBrand ? 2 : 0) +
        (String(a.vendor?._id || a.vendor || '') === sourceVendor ? 1 : 0) +
        (getPopularityScore(a) / 1000)
      const scoreB =
        (String(b.category?._id || b.category) === sourceCategory ? 5 : 0) +
        (String(b.subcategory?._id || b.subcategory || b.category?.parent?._id || b.category?.parent || '') === sourceSubcategory ? 3 : 0) +
        (getBrand(b) === sourceBrand ? 2 : 0) +
        (String(b.vendor?._id || b.vendor || '') === sourceVendor ? 1 : 0) +
        (getPopularityScore(b) / 1000)
      return scoreB - scoreA
    })
    .slice(0, 6)
}

function takeUniqueProducts(products, limit = 4, excludedIds = new Set()) {
  const seen = new Set(excludedIds)
  const list = []
  for (const product of products) {
    const id = String(product?._id || '')
    if (!id || seen.has(id)) continue
    seen.add(id)
    list.push(product)
    if (list.length >= limit) break
  }
  return list
}

export function ProductsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const shop = useShop()
  const { localWishlist } = shop
  const { read, update } = useQueryState()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState({})
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [page, setPage] = useState(Number(read('page', '1')) || 1)
  const [filterState, setFilterState] = useState({
    search: read('search'),
    category: read('category'),
    brand: read('brand'),
    sortBy: read('sortBy', 'relevance'),
    minPrice: read('minPrice'),
    maxPrice: read('maxPrice'),
    rating: read('rating'),
    availability: read('availability'),
    discount: read('discount'),
    featured: read('featured'),
    newArrivals: read('newArrivals'),
    size: read('size'),
    color: read('color'),
    material: read('material'),
  })
  const debouncedSearch = useDebouncedValue(filterState.search, 350)

  const [catalogParams, setCatalogParams] = useState({
    page: 1,
    limit: 100,
    sortBy: 'newest',
  })

  const categories = useApi(() => customerApi.categories({ type: 'product', limit: 200 }))
  const productsQuery = useApi(() => customerApi.products(catalogParams), [catalogParams.page, catalogParams.limit, catalogParams.sortBy, catalogParams.search, catalogParams.category, catalogParams.minPrice, catalogParams.maxPrice], { immediate: true })

  useEffect(() => {
    update({
      page,
      search: filterState.search || undefined,
      category: filterState.category || undefined,
      brand: filterState.brand || undefined,
      sortBy: filterState.sortBy !== 'relevance' ? filterState.sortBy : undefined,
      minPrice: filterState.minPrice || undefined,
      maxPrice: filterState.maxPrice || undefined,
      rating: filterState.rating || undefined,
      availability: filterState.availability || undefined,
      discount: filterState.discount || undefined,
      featured: filterState.featured || undefined,
      newArrivals: filterState.newArrivals || undefined,
      size: filterState.size || undefined,
      color: filterState.color || undefined,
      material: filterState.material || undefined,
    })
  }, [page, filterState, update])

  useEffect(() => {
    setCatalogParams({
      page: 1,
      limit: 100,
      search: debouncedSearch || undefined,
      category: filterState.category || undefined,
      minPrice: filterState.minPrice || undefined,
      maxPrice: filterState.maxPrice || undefined,
      sortBy: filterState.sortBy === 'price_asc' || filterState.sortBy === 'price_desc' ? filterState.sortBy : 'newest',
      featured: filterState.featured === 'true' ? 'true' : undefined,
    })
  }, [debouncedSearch, filterState.category, filterState.featured, filterState.maxPrice, filterState.minPrice, filterState.sortBy])

  const products = useMemo(() => {
    const data = productsQuery.data
    if (!data) return []
    if (Array.isArray(data)) return data
    const list = getList(data)
    if (list.length) return list
    if (typeof data === 'object') {
      for (const key of Object.keys(data)) {
        if (Array.isArray(data[key])) return data[key]
      }
    }
    return []
  }, [productsQuery.data])
  const filteredProducts = useMemo(() => sortProducts(products.filter((product) => matchesFilters(product, { ...filterState, search: debouncedSearch })), filterState.sortBy), [debouncedSearch, filterState, products])
  const allCategories = getList(categories.data)
  const categoryChips = useMemo(() => getCategoryChips(products), [products])
  const featuredProducts = useMemo(
    () => filteredProducts.filter((product) => product.isFeatured).sort((a, b) => getPopularityScore(b) - getPopularityScore(a)),
    [filteredProducts],
  )
  const bestSellerPool = useMemo(
    () => [...filteredProducts].sort((a, b) => getPopularityScore(b) - getPopularityScore(a)).filter((product) => !product.isFeatured),
    [filteredProducts],
  )
  const newArrivalPool = useMemo(
    () => filteredProducts.filter((product) => {
      const daysOld = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      return daysOld <= 21
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [filteredProducts],
  )
  const discountPool = useMemo(
    () => [...filteredProducts].filter((product) => getDiscount(product) > 0).sort((a, b) => getDiscount(b) - getDiscount(a)),
    [filteredProducts],
  )
  const recentlyViewedPool = useMemo(() => shop.recentlyViewed || [], [shop.recentlyViewed])
  const recommendationSeed = selectedProduct || recentlyViewedPool[0]?.productSnapshot || filteredProducts[0] || null
  const recommendedPool = useMemo(() => getRecommended(products, recommendationSeed), [products, recommendationSeed])

  const { curatedFeatured, bestSellers, discountProducts, newArrivals, recommendedProducts, recentlyViewed } = useMemo(() => {
    const used = new Set()
    const pick = (pool, limit = 4, extraExclusions = []) => {
      const items = takeUniqueProducts(pool, limit, new Set([...used, ...extraExclusions]))
      items.forEach((item) => used.add(String(item._id)))
      return items
    }

    const curatedFeatured = pick(featuredProducts, 4)
    const bestSellers = pick(bestSellerPool, 4)
    const discountProducts = pick(discountPool, 4)
    const newArrivals = pick(newArrivalPool, 4)
    const recommendedProducts = pick(recommendedPool, 4)
    const recentlyViewed = takeUniqueProducts(
      recentlyViewedPool
        .filter((entry) => entry?.productSnapshot?._id || entry?.productId)
        .map((entry) => ({
          productId: entry.productId || entry.productSnapshot?._id,
          productSnapshot: entry.productSnapshot,
          _id: entry.productId || entry.productSnapshot?._id,
          createdAt: entry.createdAt,
        }))
        .reverse(),
      4,
      used,
    ).map((entry) => ({
      ...entry.productSnapshot,
      _id: entry.productId,
      productId: entry.productId,
    }))

    return { curatedFeatured, bestSellers, discountProducts, newArrivals, recommendedProducts, recentlyViewed }
  }, [bestSellerPool, discountPool, featuredProducts, newArrivalPool, recentlyViewedPool, recommendedPool])
  const pageSize = 12
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const pagedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize)
  const totals = shop.totals

  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [page, totalPages])

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#faf8f5] via-white to-[#f5f7fa]">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0B2451] via-[#0d3a6e] to-[#1558B0] text-white shadow-[0_40px_100px_-20px_rgba(11,36,81,0.5)]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
            <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#D6A744]/10 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
            <div className="relative grid gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[1.3fr_0.7fr] lg:px-12 lg:py-12">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#D6A744]/30 bg-[#D6A744]/10 px-4 py-1.5">
                  <ShoppingBag className="h-3.5 w-3.5 text-[#D6A744]" />
                  <span className="text-xs font-black uppercase tracking-[0.24em] text-[#D6A744]">Premium Shop</span>
                </div>
                <h1 className="mt-5 max-w-2xl font-playfair text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                  Curated commerce,<br /><span className="text-[#D6A744]">elevated experience</span>
                </h1>
                <p className="mt-4 max-w-xl text-base font-medium leading-relaxed text-blue-100/80">
                  Discover handpicked products, checkout seamlessly with Razorpay, track every order, and enjoy premium support — all in one place.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3 xl:grid-cols-4">
                  {[
                    ['Razorpay Secure', ShieldCheck],
                    ['Live Inventory', Package],
                    ['Express Delivery', Truck],
                    ['Easy Returns', RotateCcw],
                  ].map(([label, Icon]) => (
                    <div key={label} className="group rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5 backdrop-blur-sm transition hover:border-[#D6A744]/30 hover:bg-white/10">
                      <Icon className="h-5 w-5 text-[#D6A744] transition group-hover:scale-110" />
                      <p className="mt-2 text-sm font-bold">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative rounded-[2rem] border border-white/20 bg-white/95 p-6 text-slate-900 shadow-2xl backdrop-blur-sm">
                <div className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#D6A744] text-navy shadow-lg">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ['Products', filteredProducts.length, ShoppingBag],
                    ['Categories', categoryChips.length, Package],
                    ['Collections', 6, Star],
                    ['Secure', '100%', ShieldCheck],
                  ].map(([label, value, Icon]) => (
                    <div key={label} className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 p-4">
                      <Icon className="h-5 w-5 text-navy" />
                      <p className="mt-2 font-playfair text-2xl font-black text-navy">{value}</p>
                      <p className="text-xs font-medium text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/cart" className="relative z-10 flex min-h-12 w-full items-center justify-center gap-1 rounded-xl border-2 border-navy px-4 py-3 text-sm font-black text-navy transition hover:bg-navy/5 sm:flex-1">
                    <span>Cart ({shop.cart.length})</span>
                    <ArrowRight className="h-3.5 w-3.5 transition" />
                  </Link>
                <Link to="/checkout" className="relative z-10 flex min-h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-navy to-royal px-4 py-3 text-sm font-black text-white shadow-lg shadow-navy/20 transition hover:from-navy/90 hover:to-royal/90 sm:flex-1">
                    Checkout
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-[2rem] border border-slate-200/80 bg-white/80 p-4 shadow-[0_8px_30px_rgba(11,36,81,0.06)] backdrop-blur-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <label className="flex h-12 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 transition focus-within:border-navy/30 focus-within:bg-white">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  value={filterState.search}
                  onChange={(event) => setFilterState((current) => ({ ...current, search: event.target.value }))}
                  placeholder="Search products, brands, categories..."
                  className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
                />
              </label>
              <div className="flex items-center gap-2">
                <Link to="/cart" className="relative z-10 inline-flex items-center justify-center rounded-lg bg-navy px-4 py-2.5 text-xs font-black text-white transition hover:bg-navy/90">Cart {shop.cart.length}</Link>
                <Link to="/orders" className="relative z-10 inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-black text-slate-700 transition hover:border-navy/30 hover:text-navy">Orders</Link>
                <Link to="/wishlist" className="relative z-10 inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-black text-slate-700 transition hover:border-navy/30 hover:text-navy">Wishlist</Link>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {categoryChips.map(([name, id]) => (
                  <button key={name} type="button" onClick={() => setFilterState((current) => ({ ...current, category: id }))} className={`relative z-10 rounded-lg px-4 py-2 text-xs font-black transition-all ${filterState.category === id ? 'bg-navy text-white shadow-md' : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200'}`}>
                  {name}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="flex-1 px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col gap-6 lg:flex-row">
          <aside className="w-full lg:w-[280px] lg:flex-shrink-0 lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
            <div className="space-y-4">
              <FiltersPanel filterState={filterState} setFilterState={setFilterState} categories={allCategories} onReset={() => { setFilterState({ search: '', category: '', brand: '', sortBy: 'relevance', minPrice: '', maxPrice: '', rating: '', availability: '', discount: '', featured: '', newArrivals: '', size: '', color: '', material: '' }); setPage(1) }} />
              <SummaryPanel featured={featuredProducts} totals={totals} />
            </div>
          </aside>

          <div className="flex-1 min-w-0 space-y-6">
            <section className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-4 shadow-[0_8px_30px_rgba(11,36,81,0.06)] backdrop-blur-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-jakarta text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Collection</p>
                  <h2 className="mt-1 font-playfair text-2xl font-black text-navy">
                    {filteredProducts.length}
                    <span className="ml-1.5 text-base font-medium text-slate-500">products</span>
                  </h2>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SORT_OPTIONS.map(([value, label]) => (
                    <button key={value} type="button" onClick={() => setFilterState((current) => ({ ...current, sortBy: value }))} className={`rounded-lg px-3.5 py-2 text-[11px] font-black transition-all ${filterState.sortBy === value ? 'bg-navy text-white shadow-md' : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {productsQuery.loading ? (
                <ProductGridSkeleton />
              ) : productsQuery.error ? (
                <EmptyState title="Unable to load products" description="Try refreshing the shop or check your network connection." />
              ) : pagedProducts.length === 0 ? (
                <EmptyState title="No products matched" description="Try clearing filters, widening the price range, or removing a sort preference." />
              ) : (
                <>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {pagedProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        wishlisted={isWishlisted(localWishlist, product._id)}
                        onQuickView={(nextProduct) => {
                          setSelectedProduct(nextProduct)
                          setSelectedVariant({})
                          setQuickViewOpen(true)
                        }}
                        onWishlist={() => shop.toggleWishlist(product)}
                        onAddToCart={(nextProduct) => shop.upsertCartLine(nextProduct, selectedVariant[nextProduct._id] || null, 1)}
                        onOpen={() => navigate(`/products/${product._id}`, { state: { from: location.pathname + location.search } })}
                      />
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-medium text-slate-500">
                      Showing <span className="font-black text-navy">{(page - 1) * pageSize + 1}</span>-
                      <span className="font-black text-navy">{Math.min(page * pageSize, filteredProducts.length)}</span> of{' '}
                      <span className="font-black text-navy">{filteredProducts.length}</span>
                    </p>
                    <PaginationBar page={page} totalPages={totalPages} onChange={setPage} />
                  </div>
                </>
              )}
            </section>

            {curatedFeatured.length > 0 && (
              <ProductRailSection
                title="Featured Products"
                description="Handpicked products with standout quality and trust."
                items={curatedFeatured}
                onSeeAll={() => {
                  setFilterState((current) => ({ ...current, featured: 'true', discount: '', newArrivals: '', sortBy: 'relevance' }))
                  setPage(1)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                accent="text-navy"
              />
            )}
            {bestSellers.length > 0 && (
              <ProductRailSection
                title="Best Sellers"
                description="Top-performing products based on popularity and demand."
                items={bestSellers}
                onSeeAll={() => {
                  setFilterState((current) => ({ ...current, featured: '', discount: '', newArrivals: '', sortBy: 'popular' }))
                  setPage(1)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                accent="text-amber-700"
              />
            )}
            {discountProducts.length > 0 && (
              <ProductRailSection
                title="Discounted Deals"
                description="Best value picks with strong markdowns."
                items={discountProducts}
                onSeeAll={() => {
                  setFilterState((current) => ({ ...current, featured: '', discount: 'discounted', newArrivals: '', sortBy: 'discount_desc' }))
                  setPage(1)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                accent="text-emerald-700"
              />
            )}
            {newArrivals.length > 0 && (
              <ProductRailSection
                title="New Arrivals"
                description="Freshly listed products from trusted sellers."
                items={newArrivals}
                onSeeAll={() => {
                  setFilterState((current) => ({ ...current, featured: '', discount: '', newArrivals: 'true', sortBy: 'latest' }))
                  setPage(1)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                accent="text-navy"
              />
            )}
            {recommendedProducts.length > 0 && (
              <ProductRailSection
                title="Recommended for You"
                description="Based on your browsing and product similarity."
                items={recommendedProducts}
                onSeeAll={() => {
                  setFilterState((current) => ({ ...current, featured: '', discount: '', newArrivals: '', sortBy: 'relevance' }))
                  setPage(1)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                accent="text-[#D6A744]"
              />
            )}
            {recentlyViewed.length > 0 && (
              <ProductRailSection
                title="Recently Viewed"
                description="Pick up where you left off."
                items={recentlyViewed}
                onSeeAll={() => {
                  setFilterState({ search: '', category: '', brand: '', sortBy: 'relevance', minPrice: '', maxPrice: '', rating: '', availability: '', discount: '', featured: '', newArrivals: '', size: '', color: '', material: '' })
                  setPage(1)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                accent="text-slate-700"
              />
            )}
          </div>
        </div>
      </div>

      {quickViewOpen && selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          selectedVariant={selectedVariant[selectedProduct._id] || null}
          onSelectVariant={(variant) => setSelectedVariant((current) => ({ ...current, [selectedProduct._id]: variant }))}
          onClose={() => setQuickViewOpen(false)}
          onAddToCart={() => {
            shop.upsertCartLine(selectedProduct, selectedVariant[selectedProduct._id] || null, 1)
            setQuickViewOpen(false)
          }}
          onBuyNow={() => navigate('/checkout')}
        />
      )}
    </main>
  )
}

export function DetailPage({ type }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const shop = useShop()
  const { addRecentlyViewed, upsertCartLine, toggleWishlist, localWishlist } = shop
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [estimatedPincode, setEstimatedPincode] = useState('')
  const fetcher = type === 'vendors' ? customerApi.vendor : type === 'products' ? customerApi.product : customerApi.service
  const { data, loading } = useApi(() => fetcher(id), [id])
  const [relatedItems, setRelatedItems] = useState([])
  const [reviews, setReviews] = useState([])
  const item = data
  const productReviews = useMemo(() => {
    if (type !== 'products') return reviews
    const matched = reviews.filter((review) => String(review.product?._id || review.product || '') === String(item?._id))
    return matched.length ? matched : reviews
  }, [item?._id, reviews, type])
  const reviewAverage = useMemo(() => getAverageReviewRating(productReviews, getRating(item)), [item, productReviews])
  const reviewCount = useMemo(() => (productReviews.length || getReviewCount(item)), [item, productReviews.length])

  useEffect(() => {
    if (!item) return
    if (type === 'products') {
      addRecentlyViewed(item)
      const variants = getVariantOptions(item)
      setSelectedVariant((current) => current || variants[0] || null)
      if (item.category?._id) {
        customerApi.products({ category: item.category._id, limit: 8 }).then((res) => {
          setRelatedItems(getList(res.data).filter((entry) => entry._id !== item._id).slice(0, 6))
        }).catch(() => {})
      }
      if (item.vendor?._id) {
        customerApi.reviews(item.vendor._id, { limit: 5 }).then((res) => setReviews(getList(res.data))).catch(() => {})
      }
    }
  }, [addRecentlyViewed, item, type])

  if (loading) return <LoadingScreen label="Loading product details..." />
  if (!item) return <EmptyState title="Product not found" description="The requested item may have been removed or is unavailable." />

  if (type === 'vendors') {
    return (
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-xl">
          <img src={item.logo?.url || item.coverImage?.url || '/logo.png'} alt="" className="h-48 w-full object-cover sm:h-72" />
          <div className="p-6">
            <h1 className="font-playfair text-4xl font-black text-navy">{item.businessName}</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{item.description}</p>
            <button type="button" onClick={() => toggleWishlist({ _id: item._id, title: item.businessName, images: [item.logo].filter(Boolean), vendor: item })} className="mt-6 rounded-xl bg-navy px-5 py-3 text-sm font-black text-white">Add to Wishlist</button>
          </div>
        </div>
      </section>
    )
  }

  const vendor = item.vendor || {}
  const galleryImages = (item.images || []).concat(selectedVariant?.images || [])
  const mainImage = galleryImages[selectedImageIndex]?.url || getProductImage(item, selectedVariant)
  const price = getPrice(item, selectedVariant)
  const originalPrice = getOriginalPrice(item, selectedVariant)
  const discount = getDiscount(item, selectedVariant)
  const stockStatus = getStockStatus(item, selectedVariant)
  const outOfStock = stockStatus === 'Out of stock'

  const handleBuyNow = async () => {
    if (outOfStock) {
      toast.error('This product is out of stock')
      return
    }
    upsertCartLine(item, selectedVariant, 1)
    navigate('/checkout', { state: { buyNow: true, from: location.pathname } })
  }

  const handleRazorpay = async () => {
    if (outOfStock) {
      toast.error('This product is out of stock')
      return
    }
    upsertCartLine(item, selectedVariant, 1)
    navigate('/checkout', { state: { productId: item._id, from: location.pathname } })
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white shadow-[0_15px_50px_rgba(11,36,81,0.08)]">
            <div className="relative h-[300px] overflow-hidden bg-slate-100 sm:h-[400px] lg:h-[460px]">
              <img src={mainImage} alt={item.title} className="h-full w-full object-contain transition duration-500" />
              <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-slate-700 shadow-lg backdrop-blur-sm">{getBadge(item)}</div>
              <button type="button" onClick={() => toggleWishlist(item)} className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-rose-500 shadow-lg backdrop-blur-sm transition hover:scale-110">
                <Heart className={`h-5 w-5 transition ${isWishlisted(localWishlist, item._id) ? 'fill-pink-500 text-pink-500' : ''}`} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 border-t border-slate-100 p-4 sm:grid-cols-6">
              {galleryImages.length ? galleryImages.map((image, index) => (
                <button key={`${image.url}-${index}`} type="button" onClick={() => setSelectedImageIndex(index)} className={`overflow-hidden rounded-xl border-2 transition ${selectedImageIndex === index ? 'border-navy shadow-md' : 'border-transparent hover:border-slate-300'}`}>
                  <img src={image.url} alt="" className="h-20 w-full object-cover" />
                </button>
              )) : (
                <img src="/logo.png" alt="" className="h-20 w-full rounded-xl object-cover sm:col-span-6" />
              )}
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(11,36,81,0.08)]">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge value={stockStatus} />
              <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-slate-500">{item.category?.name || 'Product'}</span>
              <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">SKU {item.sku || selectedVariant?.sku || item.productId || item._id}</span>
            </div>
            <h1 className="mt-4 font-playfair text-4xl font-black text-navy">{item.title}</h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">{item.shortDescription || item.description}</p>

            <div className="mt-6 flex items-end gap-3">
              {discount > 0 && <p className="text-lg font-bold text-slate-400 line-through">{formatCurrency(originalPrice)}</p>}
              <p className="font-playfair text-4xl font-black text-navy">{formatCurrency(price)}</p>
              {discount > 0 && <p className="rounded-lg bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700">{discount}% OFF</p>}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <InfoBlock icon={ShieldCheck} title="Tax" text={`${Number(item.pricing?.taxPercent || 0)}% GST included at checkout`} />
              <InfoBlock icon={Truck} title="Delivery" text="Calculated from selected address and postal code" />
              <InfoBlock icon={Package} title="Inventory" text={item.inventory?.isUnlimited ? 'Unlimited stock' : `${Number(item.inventory?.quantity || 0)} units available`} />
              <InfoBlock icon={RotateCcw} title="Returns" text={item.returnPolicy || 'Easy return window available on eligible orders'} />
            </div>
          </div>

          <SpecsSection item={item} />
          <ReviewsSection reviews={productReviews} vendor={vendor} productId={item._id} />
          <FrequentlyBoughtTogether products={relatedItems} />
          {relatedItems.length > 0 && (
            <RelatedStrip items={relatedItems} />
          )}
        </section>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(11,36,81,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-jakarta text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Price</p>
                <h2 className="mt-1 font-playfair text-3xl font-black text-navy">{formatCurrency(price)}</h2>
              </div>
              <div className="rounded-lg bg-amber-50 px-3 py-1.5 text-right text-sm font-black text-amber-700">
                <div>
                  {reviewAverage.toFixed(1)} <Star className="inline h-3.5 w-3.5 fill-current" />
                </div>
                <p className="text-[11px] font-semibold text-amber-700/80">{reviewCount} review{reviewCount === 1 ? '' : 's'}</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block text-sm font-bold text-slate-700">
                Delivery pincode
                <div className="mt-1.5 flex gap-2">
                  <input value={estimatedPincode} onChange={(event) => setEstimatedPincode(event.target.value)} placeholder="Enter pincode" className="h-11 flex-1 rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none transition focus:border-navy/40" />
                  <button type="button" onClick={() => toast.success(estimatedPincode ? `Estimated delivery to ${estimatedPincode} calculated` : 'Please enter a postcode')} className="rounded-xl bg-navy px-4 text-sm font-black text-white">Check</button>
                </div>
              </label>

              <div className="flex flex-wrap gap-2">
                {getVariantOptions(item).map((variant) => (
                  <button key={`${variant.name}-${variant.option}-${variant.sku}`} type="button" onClick={() => setSelectedVariant(variant)} className={`rounded-lg px-4 py-2 text-xs font-black transition-all ${selectedVariant?.sku === variant.sku ? 'bg-navy text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                    {variant.display}
                  </button>
                ))}
              </div>

              <QuantitySelector disabled={outOfStock} />

              <div className="flex flex-wrap gap-3">
                <button type="button" disabled={outOfStock} onClick={() => upsertCartLine(item, selectedVariant, 1)} className="flex-1 rounded-xl border-2 border-navy px-4 py-3 text-sm font-black text-navy transition hover:bg-navy/5 disabled:cursor-not-allowed disabled:opacity-50">
                  Add to Cart
                </button>
                <button type="button" disabled={outOfStock} onClick={handleBuyNow} className="flex-1 rounded-xl bg-gradient-to-r from-navy to-royal px-4 py-3 text-sm font-black text-white shadow-lg shadow-navy/20 transition hover:from-navy/90 hover:to-royal/90 disabled:cursor-not-allowed disabled:opacity-50">
                  Buy Now
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs font-medium text-slate-400">or pay with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRazorpay}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#0b2c6f] to-[#1a4a8a] px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-navy/20 transition hover:from-[#0d3a7a] hover:to-[#1e5096]"
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
                <div className="relative flex items-center justify-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Pay with Razorpay</span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </div>
              </button>

              <button type="button" onClick={() => toggleWishlist(item)} className={`w-full rounded-xl border px-4 py-3 text-sm font-black transition ${isWishlisted(localWishlist, item._id) ? 'border-pink-200 bg-pink-50 text-pink-600 hover:border-pink-300' : 'border-slate-200 text-slate-700 hover:border-navy/30 hover:text-navy'}`}>
                <Heart className={`mr-1.5 inline h-4 w-4 transition ${isWishlisted(localWishlist, item._id) ? 'fill-pink-500 text-pink-500' : ''}`} />
                {isWishlisted(localWishlist, item._id) ? 'Saved to Wishlist' : 'Add to Wishlist'}
              </button>

              <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Secured by Razorpay — backend order verification
              </div>
            </div>
          </div>

          <VendorCard vendor={vendor} />
          <ShippingCard item={item} />
        </aside>
      </div>
    </main>
  )
}

export function CartPage() {
  const navigate = useNavigate()
  const shop = useShop()
  const { cart, savedForLater, totals, updateCartQuantity, removeFromCart, clearCart, saveForLater, moveToCart, removeSaved, applyCoupon, removeCoupon, coupons, activeCoupon } = shop
  const [couponCode, setCouponCode] = useState('')

  if (!cart.length && !savedForLater.length) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <EmptyState title="Your cart is empty" description="Add products from the shop to start building your order." />
      </div>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="space-y-4">
          <div className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(11,36,81,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-jakarta text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Shopping Cart</p>
                <h1 className="mt-1 font-playfair text-3xl font-black text-navy">{cart.length} {cart.length === 1 ? 'item' : 'items'}</h1>
              </div>
              <button type="button" onClick={clearCart} className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-black text-slate-600 transition hover:border-rose-200 hover:text-rose-600">Clear Cart</button>
            </div>

            <div className="mt-6 space-y-4">
              {cart.map((line) => (
                <article key={line.lineKey} className="group grid gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-slate-200 hover:shadow-sm md:grid-cols-[100px_1fr_auto] md:items-center">
                  <img src={line.variant?.images?.[0]?.url || line.productSnapshot?.images?.[0]?.url || '/logo.png'} alt="" className="h-24 w-full rounded-xl object-cover md:h-24 md:w-24" />
                  <div>
                    <h2 className="font-playfair text-lg font-bold text-navy">{line.productSnapshot?.title}</h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">{line.variant?.name || 'Default variant'} {line.variant?.option ? `· ${line.variant.option}` : ''}</p>
                    <p className="mt-1 font-jakarta text-sm font-black text-navy">{formatCurrency(line.unitPrice)}</p>
                  </div>
                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <QuantityButtons value={line.quantity} onChange={(value) => updateCartQuantity(line.lineKey, value)} max={line.stock || 99} />
                    <div className="flex gap-2">
                      <button type="button" onClick={() => saveForLater(line.lineKey)} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600 transition hover:bg-slate-200">Save for later</button>
                      <button type="button" onClick={() => removeFromCart(line.lineKey)} className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-black text-rose-600 transition hover:bg-rose-100">Remove</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {savedForLater.length > 0 && (
            <div className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(11,36,81,0.08)]">
              <h2 className="font-playfair text-2xl font-black text-navy">Saved for Later</h2>
              <div className="mt-4 space-y-3">
                {savedForLater.map((line) => (
                  <div key={line.lineKey} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-100 p-4">
                    <div>
                      <p className="font-bold text-navy">{line.productSnapshot?.title}</p>
                      <p className="text-sm font-medium text-slate-500">{formatCurrency(line.unitPrice)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => moveToCart(line.lineKey)} className="rounded-lg bg-navy px-3 py-1.5 text-xs font-black text-white">Move to cart</button>
                      <button type="button" onClick={() => removeSaved(line.lineKey)} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(11,36,81,0.08)]">
            <h2 className="font-playfair text-2xl font-black text-navy">Order Summary</h2>
            <div className="mt-5 space-y-3 text-sm font-semibold text-slate-600">
              <MetricRow label="Subtotal" value={formatCurrency(totals.subtotal)} />
              <MetricRow label="Product discount" value={`-${formatCurrency(totals.productDiscount)}`} theme="emerald" />
              <MetricRow label="Coupon discount" value={`-${formatCurrency(totals.couponDiscount)}`} theme="emerald" />
              <MetricRow label="Tax" value={formatCurrency(totals.tax)} />
              <MetricRow label="Shipping" value={formatCurrency(totals.shipping)} />
              <div className="border-t border-slate-100 pt-3">
                <MetricRow label="Total payable" value={formatCurrency(totals.total)} strong />
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100/50 p-4">
              <label className="text-sm font-bold text-slate-700">
                Coupon code
                <div className="mt-2 flex gap-2">
                  <input value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="WELCOME10" className="h-11 flex-1 rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none transition focus:border-navy/40" />
                  <button type="button" onClick={() => applyCoupon(couponCode)} className="rounded-xl bg-navy px-4 text-sm font-black text-white shadow-md transition hover:bg-navy/90">Apply</button>
                </div>
              </label>
              {activeCoupon && (
                <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700">
                  <span>Applied {activeCoupon.code}</span>
                  <button type="button" onClick={removeCoupon} className="ml-2 text-emerald-700 underline">Remove</button>
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {coupons.map((coupon) => (
                  <button type="button" key={coupon.code} onClick={() => setCouponCode(coupon.code)} className="rounded-lg bg-white px-3 py-1.5 text-xs font-black text-slate-600 shadow-sm transition hover:shadow">Quick: {coupon.code}</button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/products" className="flex min-h-12 w-full items-center justify-center rounded-xl border-2 border-slate-200 px-4 py-3 text-sm font-black text-slate-600 transition hover:border-navy/30 hover:text-navy sm:flex-1">Continue Shopping</Link>
              <button type="button" onClick={() => navigate('/checkout')} className="flex min-h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-navy to-royal px-4 py-3 text-sm font-black text-white shadow-lg shadow-navy/20 transition hover:from-navy/90 hover:to-royal/90 sm:flex-1">Checkout</button>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(11,36,81,0.08)]">
            <h3 className="font-playfair text-xl font-black text-navy">Shopping Tips</h3>
            <ul className="mt-4 space-y-3 text-sm font-medium text-slate-500">
              <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-emerald-600" /> Prices are recalculated during checkout.</li>
              <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-emerald-600" /> Stock is revalidated before payment.</li>
              <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-emerald-600" /> Orders are tracked from placed to delivered.</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  )
}

export function CheckoutPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const shop = useShop()
  const { cart, totals, activeCoupon, deliveryMethod, checkoutNotes, setCheckoutMeta, placeLocalOrder, markOrderPaid, createRazorpayPayment } = shop
  const [address, setAddress] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const [submitting, setSubmitting] = useState(false)
  const [guestForm, setGuestForm] = useState({ fullName: '', phone: '', line1: '', city: '', state: '', pincode: '' })
  const [checkoutReady, setCheckoutReady] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const hasSavedAddress = !user?._id || addresses.length > 0
  const canProceedToPayment = !user?._id || Boolean(address)

  useEffect(() => {
    setCheckoutMeta({ deliveryMethod, checkoutNotes })
  }, [checkoutNotes, deliveryMethod, setCheckoutMeta])

  useEffect(() => {
    if (!user?._id) return
    setLoadingAddresses(true)
    customerApi.addresses()
      .then((res) => {
        const list = res.data?.data?.addresses || getList(res.data)
        setAddresses(list)
        const defaultAddress = list.find((entry) => entry.isDefault) || list[0] || null
        setAddress(defaultAddress)
      })
      .catch(() => {})
      .finally(() => setLoadingAddresses(false))
  }, [user?._id])

  useEffect(() => {
    if (window.Razorpay) {
      setCheckoutReady(true)
      return undefined
    }

    const existingScript = window.document.querySelector('script[data-razorpay]')
    if (existingScript) {
      const handleExistingLoad = () => setCheckoutReady(true)
      const handleExistingError = () => setCheckoutError('Razorpay checkout failed to load. Please refresh and try again.')
      existingScript.addEventListener('load', handleExistingLoad, { once: true })
      existingScript.addEventListener('error', handleExistingError, { once: true })
      return () => {
        existingScript.removeEventListener('load', handleExistingLoad)
        existingScript.removeEventListener('error', handleExistingError)
      }
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.dataset.razorpay = 'true'
    script.onload = () => setCheckoutReady(true)
    script.onerror = () => setCheckoutError('Razorpay checkout failed to load. Please refresh and try again.')
    document.body.appendChild(script)

    return () => {
      script.onload = null
      script.onerror = null
    }
  }, [])

  const totalsWithDelivery = useMemo(() => {
    const selectedDelivery = DELIVERY_OPTIONS.find((option) => option.value === deliveryMethod) || DELIVERY_OPTIONS[0]
    return { ...totals, shipping: selectedDelivery.fee, total: Math.max(0, totals.subtotal - totals.productDiscount - totals.couponDiscount + totals.tax + (totals.subtotal >= 1499 ? 0 : selectedDelivery.fee)) }
  }, [deliveryMethod, totals])

  if (!cart.length) {
    return <div className="mx-auto max-w-4xl px-4 py-12"><EmptyState title="Nothing to checkout" description="Add products to your cart before continuing to payment." /></div>
  }

  const selectedDelivery = DELIVERY_OPTIONS.find((option) => option.value === deliveryMethod) || DELIVERY_OPTIONS[0]
  const selectedAddressText = address ? formatAddress(address) : ''

  const placeOrder = async () => {
    if (!cart.length) return
    if (!user?._id && !guestForm.fullName) {
      toast.error('Please enter delivery details')
      return
    }
    if (user?._id && loadingAddresses) {
      toast.error('Please wait while we load your saved addresses')
      return
    }
    if (user?._id && !address) {
      toast.error('Please add a delivery address before payment')
      return
    }
    setSubmitting(true)
    try {
      const draftOrder = await placeLocalOrder({
        address: user?._id ? address : guestForm,
        deliveryMethod,
        notes: checkoutNotes,
        paymentMethod,
      })
      if (!draftOrder) return

      if (paymentMethod === 'cod') {
        navigate(`/orders/${draftOrder._id}`)
        return
      }

      const razorpayOrder = await createRazorpayPayment({
        amount: totalsWithDelivery.total,
        description: `Order ${draftOrder.orderNumber}`,
        metadata: { orderId: draftOrder._id },
      })

      const razorpayKeyId = razorpayOrder?.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID
      if (!checkoutReady || !window.Razorpay || !razorpayOrder?.order?.id || !razorpayKeyId) {
        toast.error('Razorpay checkout is not ready yet. Please wait a moment and try again.')
        return
      }

      const options = {
        key: razorpayKeyId,
        amount: razorpayOrder.order.amount,
        currency: razorpayOrder.order.currency,
        name: 'Gloaro Shop',
        description: `Order ${draftOrder.orderNumber}`,
        order_id: razorpayOrder.order.id,
        handler: async (response) => {
          await paymentApi.verifyRazorpay({
            paymentId: razorpayOrder.payment._id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }).catch(() => null)
          markOrderPaid(draftOrder._id, response)
          navigate(`/orders/${draftOrder._id}`)
        },
        prefill: {
          name: user?.name || guestForm.fullName || '',
          email: user?.email || '',
          contact: user?.phone || guestForm.phone || '',
        },
        theme: { color: '#0B2451' },
      }
      const payment = new window.Razorpay(options)
      payment.on('payment.failed', () => {
        toast.error('Payment was not completed. Please try again.')
      })
      payment.open()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="space-y-6">
          <div className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(11,36,81,0.08)]">
            <h1 className="font-playfair text-3xl font-black text-navy">Checkout</h1>
            <p className="mt-2 text-sm font-medium text-slate-500">Review your order details before payment.</p>
            {user?._id && !hasSavedAddress && !loadingAddresses && (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
                <p className="font-black text-amber-900">No saved address found.</p>
                <p className="mt-1">Add a delivery address before you continue to payment.</p>
                <Link to="/customer/addresses" className="mt-3 inline-flex rounded-xl bg-amber-500 px-4 py-2 text-xs font-black text-white transition hover:bg-amber-600">
                  Add Address
                </Link>
              </div>
            )}
            {checkoutError && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {checkoutError}
              </div>
            )}

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <FieldGroup label="Delivery Method">
                <select value={deliveryMethod} onChange={(event) => setCheckoutMeta({ deliveryMethod: event.target.value })} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none transition focus:border-navy/40">
                  {DELIVERY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label} — {option.eta}</option>)}
                </select>
              </FieldGroup>
              <FieldGroup label="Payment Method">
                <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none transition focus:border-navy/40">
                  <option value="razorpay">Razorpay — Online Payment</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
              </FieldGroup>
            </div>

            <div className="mt-6 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100/50 p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-playfair text-xl font-black text-navy">Delivery Address</h2>
                {!user?._id && <span className="rounded-lg bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">Guest checkout</span>}
              </div>
              {user?._id ? (
                loadingAddresses ? <LoadingSpinner /> : (
                  <div className="mt-4 space-y-3">
                    {addresses.map((entry) => (
                      <label key={entry._id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${String(address?._id) === String(entry._id) ? 'border-navy bg-navy/5 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                        <input type="radio" name="address" checked={String(address?._id) === String(entry._id)} onChange={() => setAddress(entry)} className="mt-1 accent-navy" />
                        <div>
                          <p className="font-bold text-navy">{entry.fullName}</p>
                          <p className="text-sm font-medium text-slate-500">{entry.line1}, {entry.city}, {entry.state} — {entry.pincode}</p>
                        </div>
                      </label>
                    ))}
                    {!addresses.length && <EmptyState title="No saved addresses" description="Add an address from your profile before checkout." />}
                  </div>
                )
              ) : (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {Object.entries(guestForm).map(([key, value]) => (
                    <label key={key} className="text-sm font-bold text-slate-700">
                      {key}
                      <input value={value} onChange={(event) => setGuestForm((current) => ({ ...current, [key]: event.target.value }))} className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none transition focus:border-navy/40" />
                    </label>
                  ))}
                </div>
              )}
            </div>

            <label className="mt-6 block text-sm font-bold text-slate-700">
              Delivery notes
              <textarea value={checkoutNotes} onChange={(event) => setCheckoutMeta({ checkoutNotes: event.target.value })} rows={3} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium outline-none transition focus:border-navy/40" placeholder="Leave packaging, access, or delivery instructions" />
            </label>
          </div>

          <div className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(11,36,81,0.08)]">
            <h2 className="font-playfair text-2xl font-black text-navy">Items</h2>
            <div className="mt-4 space-y-4">
              {cart.map((line) => (
                <div key={line.lineKey} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 p-4">
                  <div>
                    <p className="font-bold text-navy">{line.productSnapshot?.title}</p>
                    <p className="mt-0.5 text-sm font-medium text-slate-500">{line.variant?.display || line.variant?.option || 'Default'} × {line.quantity}</p>
                  </div>
                  <p className="font-bold text-navy">{formatCurrency(line.lineTotal)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(11,36,81,0.08)]">
            <div className="flex items-center gap-2">
              {paymentMethod === 'razorpay' ? (
                <CreditCard className="h-5 w-5 text-navy" />
              ) : (
                <Banknote className="h-5 w-5 text-emerald-600" />
              )}
              <h2 className="font-playfair text-2xl font-black text-navy">
                {paymentMethod === 'razorpay' ? 'Payment' : 'COD'}
              </h2>
            </div>

            {paymentMethod === 'razorpay' && (
              <div className="mt-4 rounded-xl bg-gradient-to-r from-navy/5 to-royal/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-navy">Razorpay Secure</p>
                    <p className="text-xs font-medium text-slate-500">Pay via UPI, Card, NetBanking, Wallet</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 space-y-3 text-sm font-semibold text-slate-600">
              <MetricRow label="Subtotal" value={formatCurrency(totals.subtotal)} />
              <MetricRow label="Discount" value={`-${formatCurrency(totals.productDiscount + totals.couponDiscount)}`} theme="emerald" />
              <MetricRow label="Tax" value={formatCurrency(totals.tax)} />
              <MetricRow label="Shipping" value={formatCurrency(totalsWithDelivery.shipping)} />
              <div className="border-t border-slate-100 pt-3">
                <MetricRow label="Total payable" value={formatCurrency(totalsWithDelivery.total)} strong />
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs font-medium text-slate-500">
              <p className="font-bold text-slate-700">Selected delivery</p>
              <p className="mt-1">{selectedDelivery.label} · {selectedDelivery.eta} · {formatCurrency(selectedDelivery.fee)}</p>
              {activeCoupon?.code && <p className="mt-1 text-emerald-700">Coupon applied: {activeCoupon.code}</p>}
            </div>

            {user?._id && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Selected Address</p>
                  <Link to="/customer/addresses" className="text-[11px] font-black text-navy hover:underline">Manage</Link>
                </div>
                {address ? (
                  <div className="mt-2">
                    <p className="text-sm font-black text-navy">{address.fullName}</p>
                    <p className="mt-1 text-sm font-medium leading-6 text-slate-600">{selectedAddressText}</p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm font-medium leading-6 text-amber-700">
                    {loadingAddresses ? 'Loading your saved addresses...' : 'No saved address selected. Add one from your profile before payment.'}
                  </p>
                )}
              </div>
            )}

            <button
              type="button"
              disabled={submitting || (paymentMethod === 'razorpay' && !checkoutReady) || !canProceedToPayment || loadingAddresses}
              onClick={placeOrder}
              className={`mt-5 w-full rounded-xl px-4 py-3.5 text-sm font-black text-white shadow-lg transition-all ${
                paymentMethod === 'razorpay'
                  ? 'bg-gradient-to-r from-navy to-royal shadow-navy/20 hover:from-navy/90 hover:to-royal/90'
                  : 'bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-700'
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <div className="flex items-center justify-center gap-2">
                {submitting ? (
                  <>
                    <LoadingSpinner />
                    Processing...
                  </>
                ) : !canProceedToPayment ? (
                  'Add Address First'
                ) : paymentMethod === 'razorpay' && !checkoutReady ? (
                  'Loading Razorpay...'
                ) : paymentMethod === 'cod' ? (
                  'Place COD Order'
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Pay {formatCurrency(totalsWithDelivery.total)}
                  </>
                )}
              </div>
            </button>

            <p className="mt-3 text-center text-xs font-medium text-slate-400">
              Prices recalculated at checkout for backend validation before capture.
            </p>
          </div>

          <div className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(11,36,81,0.08)]">
            <h3 className="font-playfair text-xl font-black text-navy">Security</h3>
            <ul className="mt-4 space-y-3 text-sm font-medium text-slate-500">
              <li className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-600" /> Totals recalculated server-side before payment.</li>
              <li className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-600" /> Razorpay backed by order creation & verification.</li>
              <li className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-600" /> Full order history, refunds, and returns in your account.</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  )
}

export function OrdersPage() {
  const { orders, cancelOrder, downloadInvoice } = useShop()
  const [status, setStatus] = useState('all')
  const [returnModalOrder, setReturnModalOrder] = useState(null)
  const filteredOrders = status === 'all' ? orders : orders.filter((order) => order.status === status)

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(11,36,81,0.08)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-jakarta text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Order Center</p>
            <h1 className="mt-1 font-playfair text-3xl font-black text-navy">Track, return, and manage your orders</h1>
          </div>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none transition focus:border-navy/40">
            <option value="all">All orders</option>
            <option value="placed">Placed</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="cancelled">Cancelled</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        <div className="mt-6 space-y-4">
          {!filteredOrders.length ? (
            <EmptyState title="No orders yet" description="Your completed orders will appear here for tracking, refunds, and invoices." />
          ) : filteredOrders.map((order) => (
            <article key={order._id} className="rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(11,36,81,0.08)]">
              {(() => {
                const stages = ['placed', 'confirmed', 'processing', 'shipped', 'delivered']
                const currentIndex = Math.max(0, stages.findIndex((stage) => stage === order.status))
                const progress = Math.round(((currentIndex + 1) / stages.length) * 100)
                const orderDate = formatDate(order.createdAt)
                const eta = order.estimatedDeliveryDate ? formatDate(order.estimatedDeliveryDate) : 'To be updated'

                return (
                  <>
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-jakarta text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">{order.orderNumber}</p>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-600">
                            {orderDate}
                          </span>
                          <StatusBadge value={order.status} />
                          <StatusBadge value={order.paymentStatus} />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Total</p>
                            <p className="mt-1 text-2xl font-black text-navy">{formatCurrency(order.total)}</p>
                          </div>
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Delivery</p>
                            <p className="mt-1 text-sm font-semibold capitalize text-slate-700">{order.deliveryMethod}</p>
                          </div>
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">ETA</p>
                            <p className="mt-1 text-sm font-semibold text-slate-700">{eta}</p>
                          </div>
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Progress</p>
                            <p className="mt-1 text-sm font-black text-navy">{progress}%</p>
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                              <div className="h-full rounded-full bg-gradient-to-r from-navy to-royal" style={{ width: `${progress}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 xl:min-w-72">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Manage Order</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button type="button" onClick={() => downloadInvoice(order)} className="rounded-lg bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-100">Invoice</button>
                          {['placed', 'confirmed'].includes(order.status) && (
                            <button type="button" onClick={() => cancelOrder(order._id)} className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-black text-rose-600 transition hover:bg-rose-50">Cancel</button>
                          )}
                          {order.status === 'delivered' && !order.returnRequest && (
                            <button type="button" onClick={() => setReturnModalOrder(order)} className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-black text-white transition hover:bg-amber-600">Start Return</button>
                          )}
                          <Link to={`/orders/${order._id}`} className="rounded-lg bg-navy px-3 py-2 text-xs font-black text-white">Details</Link>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      {order.items.slice(0, 4).map((item) => (
                        <div key={`${order._id}-${item.productId}`} className="rounded-xl bg-slate-50 p-3">
                          <p className="text-sm font-bold text-navy">{item.productSnapshot?.title}</p>
                          <p className="text-xs font-medium text-slate-500">Qty {item.quantity} · {formatCurrency(item.lineTotal)}</p>
                        </div>
                      ))}
                    </div>

                    {order.returnRequest && (
                      <div className="mt-4">
                        <ReturnStatusBar returnRequest={order.returnRequest} />
                      </div>
                    )}
                    {order.refund && (
                      <div className="mt-4">
                        <RefundStatusBar refund={order.refund} />
                      </div>
                    )}
                  </>
                )
              })()}
            </article>
          ))}
        </div>
      </div>

      {returnModalOrder && (
        <ReturnRequestModal
          order={returnModalOrder}
          onClose={() => setReturnModalOrder(null)}
        />
      )}
    </main>
  )
}

function ReturnStatusBar({ returnRequest }) {
  return (
    <div className="mt-3 rounded-xl bg-amber-50/50 p-3">
      <div className="flex items-center gap-2 text-xs font-medium text-amber-800">
        <RotateCcw className="h-3.5 w-3.5" />
        Return {returnRequest.status.replace(/_/g, ' ')} — {returnRequest.reasonLabel || returnRequest.reason}
      </div>
      {returnRequest.pickupSlot && (
        <p className="mt-1 text-xs text-slate-500">Pickup: {returnRequest.pickupSlot}</p>
      )}
      {returnRequest.rejectionReason && (
        <p className="mt-1 text-xs text-rose-600">Reason: {returnRequest.rejectionReason}</p>
      )}
      {returnRequest.refundAmount && (
        <p className="mt-1 text-xs font-semibold text-emerald-700">Refund amount: {formatCurrency(returnRequest.refundAmount)}</p>
      )}
    </div>
  )
}

function RefundStatusBar({ refund }) {
  return (
    <div className="mt-3 rounded-xl bg-emerald-50/50 p-3">
      <div className="flex items-center gap-2 text-xs font-medium text-emerald-800">
        <Banknote className="h-3.5 w-3.5" />
        Refund {refund.status} — {refund.reasonLabel || refund.reason}
      </div>
      {refund.rejectionReason && (
        <p className="mt-1 text-xs text-rose-600">Reason: {refund.rejectionReason}</p>
      )}
      {refund.refundAmount && (
        <p className="mt-1 text-xs font-semibold text-emerald-700">Amount: {formatCurrency(refund.refundAmount)}</p>
      )}
    </div>
  )
}

export function OrderDetailPage() {
  const { orderId } = useParams()
  const { orders, cancelOrder, canCancelOrder, canReturnOrder, downloadInvoice } = useShop()
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [returnModalItems, setReturnModalItems] = useState([])
  const order = orders.find((entry) => entry._id === orderId)

  if (!order) {
    return <div className="mx-auto max-w-4xl px-4 py-12"><EmptyState title="Order not found" description="This order may have been cleared or the link is incorrect." /></div>
  }

  const deliveryTimeline = [
    { key: 'placed', title: 'Placed', note: 'Order accepted by the shop' },
    { key: 'confirmed', title: 'Confirmed', note: 'Seller confirmed your order' },
    { key: 'processing', title: 'Processing', note: 'Warehouse packing in progress' },
    { key: 'shipped', title: 'Shipped', note: 'Courier hand-off completed' },
    { key: 'delivered', title: 'Delivered', note: 'Delivered to the selected address' },
  ]
  const currentStepIndex = Math.max(0, deliveryTimeline.findIndex((step) => step.key === order.status))
  const progressPercent = Math.round(((currentStepIndex + 1) / deliveryTimeline.length) * 100)
  const estimatedDelivery = order.estimatedDeliveryDate ? formatDate(order.estimatedDeliveryDate) : 'To be updated'
  const orderSummary = [
    { label: 'Status', value: order.status },
    { label: 'Payment', value: order.paymentStatus },
    { label: 'Method', value: order.deliveryMethod },
    { label: 'ETA', value: estimatedDelivery },
  ]
  const openReturnModal = (items = []) => {
    setReturnModalItems(items.length ? items : order.items)
    setShowReturnModal(true)
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(11,36,81,0.08)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-jakarta text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">{order.orderNumber}</p>
              <h1 className="mt-1 font-playfair text-3xl font-black text-navy">Order tracking</h1>
              <p className="mt-2 text-sm font-medium text-slate-500">Placed on {formatDate(order.createdAt)} · Estimated delivery {formatDate(order.estimatedDeliveryDate)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge value={order.status} />
              <button type="button" onClick={() => downloadInvoice(order)} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600 transition hover:bg-slate-200">Invoice</button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {orderSummary.map((entry) => (
              <div key={entry.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">{entry.label}</p>
                <p className="mt-1 text-sm font-bold capitalize text-navy">{entry.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Fulfillment Progress</p>
                <p className="mt-1 text-sm font-semibold text-slate-600">Track the same order journey your vendor sees.</p>
              </div>
              <p className="text-sm font-black text-navy">{progressPercent}%</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-gradient-to-r from-navy to-royal transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {deliveryTimeline.map((step, index) => (
              <TimelineStep key={step.key} title={step.title} note={step.note} active={index <= currentStepIndex} />
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100/50 p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-playfair text-xl font-black text-navy">Items</h2>
              {canReturnOrder(order) && (
                <button
                  type="button"
                  onClick={() => openReturnModal(order.items)}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white transition hover:bg-emerald-700"
                >
                  Return items
                </button>
              )}
            </div>
            <div className="mt-3 space-y-3">
              {order.items.map((item) => (
                <div key={`${order._id}-${item.productId}`} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <img
                      src={item.productSnapshot?.images?.[0]?.url || '/logo.png'}
                      alt=""
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-bold text-navy">{item.productSnapshot?.title}</p>
                      <p className="text-sm font-medium text-slate-500">{item.variant?.display || item.variant?.option || 'Default'} · Qty {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-navy">{formatCurrency(item.lineTotal)}</p>
                    {canReturnOrder(order) && (
                      <button
                        type="button"
                        onClick={() => openReturnModal([item])}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 transition hover:border-navy/30 hover:text-navy"
                      >
                        Return item
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {order.returnRequest && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
              <h3 className="font-playfair text-lg font-black text-amber-800">Return Request</h3>
              <div className="mt-4 space-y-3">
                {RETURN_STATUS_FLOW.map((step) => {
                  const stepIndex = RETURN_STATUS_FLOW.findIndex((s) => s.status === step.status)
                  const currentIndex = RETURN_STATUS_FLOW.findIndex((s) => s.status === order.returnRequest.status)
                  const active = stepIndex <= currentIndex
                  return (
                    <TimelineStep
                      key={step.status}
                      title={step.label}
                      note={order.returnRequest.tracking?.find((t) => t.status === step.status)?.at
                        ? `${step.description} — ${formatDate(order.returnRequest.tracking.find((t) => t.status === step.status).at)}`
                        : step.description}
                      active={active}
                    />
                  )
                })}
              </div>
              {order.returnRequest.rejectionReason && (
                <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700">
                  Rejected: {order.returnRequest.rejectionReason}
                </div>
              )}
            </div>
          )}

          {order.refund && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
              <h3 className="font-playfair text-lg font-black text-emerald-800">Refund Request</h3>
              <div className="mt-4 space-y-3">
                {REFUND_STATUS_FLOW.map((step) => {
                  const stepIndex = REFUND_STATUS_FLOW.findIndex((s) => s.status === step.status)
                  const currentIndex = REFUND_STATUS_FLOW.findIndex((s) => s.status === order.refund.status)
                  const active = stepIndex <= currentIndex
                  return (
                    <TimelineStep
                      key={step.status}
                      title={step.label}
                      note={order.refund.tracking?.find((t) => t.status === step.status)?.at
                        ? `${step.description} — ${formatDate(order.refund.tracking.find((t) => t.status === step.status).at)}`
                        : step.description}
                      active={active}
                    />
                  )
                })}
              </div>
              {order.refund.rejectionReason && (
                <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700">
                  Rejected: {order.refund.rejectionReason}
                </div>
              )}
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(11,36,81,0.08)]">
            <p className="font-jakarta text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Manage Order</p>
            <h2 className="mt-1 font-playfair text-2xl font-black text-navy">Everything in one place</h2>

            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Delivery Address</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">{formatAddress(order.address)}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Delivery Method</p>
                  <p className="mt-1 text-sm font-semibold capitalize text-slate-700">{order.deliveryMethod}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Payment</p>
                  <p className="mt-1 text-sm font-semibold capitalize text-slate-700">{order.paymentMethod} · {order.paymentStatus}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <button type="button" onClick={() => downloadInvoice(order)} className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-200">
                Invoice
              </button>
              {canReturnOrder(order) && (
                <button type="button" onClick={() => openReturnModal(order.items)} className="w-full rounded-xl bg-amber-500 px-4 py-3 text-sm font-black text-white shadow-md transition hover:bg-amber-600">
                  <RotateCcw className="mr-2 inline h-4 w-4" />Start Return
                </button>
              )}
              <button
                type="button"
                onClick={() => cancelOrder(order._id)}
                disabled={!canCancelOrder(order)}
                className="w-full rounded-xl border border-rose-200 px-4 py-3 text-sm font-black text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {canCancelOrder(order) ? 'Cancel Order' : 'Cancellation Unavailable'}
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <StatusBadge value={order.status} />
              <StatusBadge value={order.paymentStatus} />
              {order.returnRequest && (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-amber-700 ring-1 ring-amber-200">
                  Return in progress
                </span>
              )}
              {order.refund && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-200">
                  Refund tracked
                </span>
              )}
            </div>

            {(order.returnRequest || order.refund) && (
              <div className="mt-5 space-y-3">
                {order.returnRequest && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-700">Return Request</p>
                    <p className="mt-1 text-sm font-semibold text-amber-900">
                      {order.returnRequest.status.replace(/_/g, ' ')}
                    </p>
                  </div>
                )}
                {order.refund && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-700">Refund Status</p>
                    <p className="mt-1 text-sm font-semibold text-emerald-900">
                      {order.refund.status}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      {showReturnModal && (
        <ReturnRequestModal
          order={order}
          initialItems={returnModalItems}
          onClose={() => setShowReturnModal(false)}
        />
      )}
    </main>
  )
}

function ProductCard({ product, wishlisted, onQuickView, onWishlist, onAddToCart, onOpen }) {
  const variant = getVariantOptions(product)[0] || null
  const badge = getBadge(product)
  const price = getPrice(product, variant)
  const originalPrice = getOriginalPrice(product, variant)
  const discount = getDiscount(product, variant)
  const stockStatus = getStockStatus(product, variant)

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(11,36,81,0.12)]">
      <div className="relative overflow-hidden">
          <img src={getProductImage(product, variant)} alt={product.title} className="h-44 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-48 lg:h-56" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-lg bg-navy/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white backdrop-blur-sm">{badge}</span>
          {discount > 0 && <span className="rounded-lg bg-emerald-500 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white">{discount}% off</span>}
        </div>
        <button
          type="button"
          aria-pressed={wishlisted}
          onClick={() => onWishlist(product)}
          className={`absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full shadow-lg backdrop-blur-sm transition hover:scale-110 ${
            wishlisted ? 'bg-pink-100 text-pink-600' : 'bg-white/90 text-rose-500'
          }`}
        >
          <Heart className={`h-4 w-4 transition ${wishlisted ? 'fill-pink-500 text-pink-500' : ''}`} />
        </button>
        {stockStatus === 'Out of stock' && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
            <span className="rounded-lg bg-slate-900/90 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="relative z-10 p-5">
        <p className="font-jakarta text-[10px] font-black uppercase tracking-[0.24em] text-navy">{product.category?.name || 'Product'}</p>
        <button type="button" onClick={onOpen} className="mt-1.5 block w-full text-left font-playfair text-lg font-bold text-navy transition group-hover:text-royal">{product.title}</button>
        <p className="mt-1 text-xs font-medium text-slate-500">{getBrand(product)}</p>
        <div className="mt-4 flex items-center gap-3">
          <p className="font-playfair text-xl font-black text-navy">{formatCurrency(price)}</p>
          {originalPrice > price && <p className="text-xs font-semibold text-slate-400 line-through">{formatCurrency(originalPrice)}</p>}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-current text-amber-400" /> {getRating(product).toFixed(1)}
            <span className="text-slate-400">({getReviewCount(product)})</span>
          </span>
          <span className={`font-semibold ${stockStatus === 'In stock' ? 'text-emerald-600' : stockStatus === 'Limited stock' ? 'text-amber-600' : 'text-rose-500'}`}>{stockStatus}</span>
        </div>
                <div className="mt-5 grid grid-cols-3 gap-1.5 sm:gap-2">
                  <button type="button" onClick={() => onQuickView(product)} className="rounded-xl border border-slate-200 px-1.5 py-2.5 text-[10px] font-black text-slate-600 transition hover:border-navy/30 hover:text-navy sm:px-2 sm:text-xs">Quick View</button>
                  <button type="button" onClick={() => onAddToCart(product)} disabled={stockStatus === 'Out of stock'} className="rounded-xl bg-navy px-1.5 py-2.5 text-[10px] font-black text-white transition hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-50 sm:px-2 sm:text-xs">
                    {stockStatus === 'Out of stock' ? 'Unavailable' : 'Cart'}
                  </button>
                  <Link to={`/products/${product._id}`} className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-1.5 py-2.5 text-center text-[10px] font-black text-white transition hover:bg-slate-800 sm:px-2 sm:text-xs">
                    Details
                  </Link>
                </div>
      </div>
    </article>
  )
}

export function WishlistPage() {
  const navigate = useNavigate()
  const shop = useShop()
  const { localWishlist, removeLocalWishlist, upsertCartLine } = shop

  const moveToCart = (entry) => {
    upsertCartLine(entry.productSnapshot, entry.variant || null, 1)
    removeLocalWishlist(entry.productId)
  }

  if (!localWishlist.length) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center">
          <h2 className="font-playfair text-2xl font-black text-navy">Your wishlist is empty</h2>
          <p className="mt-2 text-sm font-medium text-slate-500">Save products with the heart icon and they will appear here.</p>
          <button type="button" onClick={() => navigate('/products')} className="mt-5 rounded-xl bg-navy px-5 py-3 text-sm font-black text-white transition hover:bg-navy/90">
            Continue shopping
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="space-y-4">
          <div className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(11,36,81,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-jakarta text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Wishlist</p>
                <h1 className="mt-1 font-playfair text-3xl font-black text-navy">{localWishlist.length} {localWishlist.length === 1 ? 'item' : 'items'}</h1>
              </div>
              <button type="button" onClick={() => navigate('/products')} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-black text-slate-600 transition hover:border-navy/30 hover:text-navy">
                Continue Shopping
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {localWishlist.map((entry) => {
                const product = entry.productSnapshot || {}
                const price = Number(product.pricing?.sellingPrice || entry.unitPrice || 0)
                const image = product.images?.[0]?.url || '/logo.png'
                return (
                  <article key={entry.productId} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <img src={image} alt={product.title || 'Wishlist product'} className="h-44 w-full object-cover" />
                    <div className="p-5">
                      <p className="font-jakarta text-[10px] font-black uppercase tracking-[0.24em] text-navy">{product.category?.name || 'Product'}</p>
                      <h2 className="mt-1 font-playfair text-lg font-black text-navy">{product.title || 'Saved item'}</h2>
                      <p className="mt-1 text-xs font-medium text-slate-500">{product.brand || product.vendor?.businessName || 'Gloaro partner'}</p>
                      <p className="mt-4 font-playfair text-2xl font-black text-navy">{formatCurrency(price)}</p>
                      <div className="mt-5 flex gap-2">
                        <button type="button" onClick={() => moveToCart(entry)} className="flex-1 rounded-xl bg-navy px-4 py-3 text-sm font-black text-white transition hover:bg-navy/90">
                          Move to Cart
                        </button>
                        <button type="button" onClick={() => removeLocalWishlist(entry.productId)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-600 transition hover:border-rose-200 hover:text-rose-600">
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(11,36,81,0.08)]">
            <h2 className="font-playfair text-2xl font-black text-navy">Wishlist Actions</h2>
            <div className="mt-5 space-y-3 text-sm font-medium text-slate-600">
              <p className="flex gap-2"><HeartOff className="mt-0.5 h-4 w-4 text-pink-500" /> Saved items stay in your wishlist until you remove them.</p>
              <p className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-emerald-600" /> Move items to cart whenever you’re ready to checkout.</p>
              <p className="flex gap-2"><ShoppingBag className="mt-0.5 h-4 w-4 text-navy" /> Wishlist works separately from cart, so you can curate products first.</p>
            </div>
            <button type="button" onClick={() => navigate('/cart')} className="mt-6 w-full rounded-xl bg-gradient-to-r from-navy to-royal px-4 py-3 text-sm font-black text-white shadow-lg shadow-navy/20 transition hover:from-navy/90 hover:to-royal/90">
              Go to Cart
            </button>
          </div>
        </aside>
      </div>
    </main>
  )
}

function QuickViewModal({ product, selectedVariant, onSelectVariant, onAddToCart, onBuyNow, onClose }) {
  const price = getPrice(product, selectedVariant)
  const discount = getDiscount(product, selectedVariant)

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-navy/40 px-4 py-8 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2.5rem] border border-slate-200/80 bg-white shadow-2xl">
        <div className="grid lg:grid-cols-[1fr_0.9fr]">
          <img src={getProductImage(product, selectedVariant)} alt={product.title} className="h-48 w-full object-cover lg:h-full" />
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-jakarta text-[10px] font-black uppercase tracking-[0.24em] text-navy">{product.category?.name || 'Product'}</p>
                <h3 className="mt-1.5 font-playfair text-2xl font-black text-navy">{product.title}</h3>
              </div>
              <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <p className="font-playfair text-2xl font-black text-navy">{formatCurrency(price)}</p>
              {discount > 0 && <p className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{discount}% OFF</p>}
            </div>
            <p className="mt-3 text-sm font-medium leading-7 text-slate-600">{product.shortDescription || product.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {getVariantOptions(product).map((variant) => (
                <button type="button" key={`${variant.name}-${variant.option}-${variant.sku}`} onClick={() => onSelectVariant(variant)} className={`rounded-lg px-4 py-2 text-xs font-black transition-all ${selectedVariant?.sku === variant.sku ? 'bg-navy text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {variant.display}
                </button>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={onAddToCart} className="flex-1 rounded-xl border-2 border-navy px-4 py-3 text-sm font-black text-navy transition hover:bg-navy/5">Add to Cart</button>
              <button type="button" onClick={onBuyNow} className="flex-1 rounded-xl bg-gradient-to-r from-navy to-royal px-4 py-3 text-sm font-black text-white shadow-lg shadow-navy/20">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FiltersPanel({ filterState, setFilterState, categories, onReset }) {
  return (
    <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-5 shadow-[0_8px_30px_rgba(11,36,81,0.06)] backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-playfair text-lg font-black text-navy">Filters</h2>
        <button type="button" onClick={onReset} className="text-xs font-black text-navy underline underline-offset-2">Reset</button>
      </div>
      <div className="mt-4 space-y-4">
        <FieldGroup label="Category">
          <select value={filterState.category} onChange={(event) => setFilterState((current) => ({ ...current, category: event.target.value }))} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none transition focus:border-navy/40">
            <option value="">All categories</option>
            {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
          </select>
        </FieldGroup>
        <FieldGroup label="Brand">
          <input value={filterState.brand} onChange={(event) => setFilterState((current) => ({ ...current, brand: event.target.value }))} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none transition focus:border-navy/40" placeholder="Apple, Nike, Samsung..." />
        </FieldGroup>
        <div className="grid grid-cols-2 gap-3">
          <FieldGroup label="Min Price">
            <input type="number" min="0" value={filterState.minPrice} onChange={(event) => setFilterState((current) => ({ ...current, minPrice: event.target.value }))} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none transition focus:border-navy/40" />
          </FieldGroup>
          <FieldGroup label="Max Price">
            <input type="number" min="0" value={filterState.maxPrice} onChange={(event) => setFilterState((current) => ({ ...current, maxPrice: event.target.value }))} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none transition focus:border-navy/40" />
          </FieldGroup>
        </div>
        <FieldGroup label="Rating">
          <select value={filterState.rating} onChange={(event) => setFilterState((current) => ({ ...current, rating: event.target.value }))} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none transition focus:border-navy/40">
            <option value="">Any rating</option>
            <option value="4">4 stars and above</option>
            <option value="3">3 stars and above</option>
          </select>
        </FieldGroup>
        <FieldGroup label="Availability">
          <select value={filterState.availability} onChange={(event) => setFilterState((current) => ({ ...current, availability: event.target.value }))} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none transition focus:border-navy/40">
            <option value="">Any</option>
            <option value="in_stock">In stock</option>
            <option value="out_of_stock">Out of stock</option>
          </select>
        </FieldGroup>
        <FieldGroup label="Discount">
          <select value={filterState.discount} onChange={(event) => setFilterState((current) => ({ ...current, discount: event.target.value }))} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none transition focus:border-navy/40">
            <option value="">Any</option>
            <option value="discounted">Discounted</option>
            <option value="20_plus">20% and above</option>
          </select>
        </FieldGroup>
        <FieldGroup label="Size">
          <input value={filterState.size} onChange={(event) => setFilterState((current) => ({ ...current, size: event.target.value }))} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none transition focus:border-navy/40" placeholder="M, L, 42, 1TB" />
        </FieldGroup>
        <FieldGroup label="Color">
          <input value={filterState.color} onChange={(event) => setFilterState((current) => ({ ...current, color: event.target.value }))} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none transition focus:border-navy/40" placeholder="Red, Black, Blue" />
        </FieldGroup>
        <FieldGroup label="Material">
          <input value={filterState.material} onChange={(event) => setFilterState((current) => ({ ...current, material: event.target.value }))} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none transition focus:border-navy/40" placeholder="Cotton, Leather, Steel" />
        </FieldGroup>
        <ToggleChip label="Featured products" active={filterState.featured === 'true'} onClick={() => setFilterState((current) => ({ ...current, featured: current.featured === 'true' ? '' : 'true' }))} />
        <ToggleChip label="New arrivals" active={filterState.newArrivals === 'true'} onClick={() => setFilterState((current) => ({ ...current, newArrivals: current.newArrivals === 'true' ? '' : 'true' }))} />
      </div>
    </div>
  )
}

function SummaryPanel({ featured, totals }) {
  return (
    <div className="rounded-[2rem] bg-gradient-to-br from-navy via-[#0d3a6e] to-royal p-5 text-white shadow-[0_8px_30px_rgba(11,36,81,0.15)]">
      <p className="font-jakarta text-[10px] font-black uppercase tracking-[0.28em] text-[#D6A744]">Quick Summary</p>
      <h3 className="mt-2 font-playfair text-xl font-black">Your shopping board</h3>
      <div className="mt-5 space-y-2 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
        <MetricRow label="Cart subtotal" value={formatCurrency(totals.subtotal)} light />
        <MetricRow label="Discounts" value={`-${formatCurrency(totals.productDiscount + totals.couponDiscount)}`} light />
        <MetricRow label="Estimated total" value={formatCurrency(totals.total)} light strong />
      </div>
      <div className="mt-5">
        <p className="text-sm font-black text-[#D6A744]">Featured picks</p>
        <div className="mt-3 space-y-3">
          {featured.slice(0, 3).map((product) => (
            <div key={product._id} className="flex gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-sm">
              <img src={getProductImage(product)} alt="" className="h-14 w-14 rounded-xl object-cover ring-2 ring-white/20" />
              <div>
                <p className="text-sm font-bold text-white">{product.title}</p>
                <p className="text-xs text-blue-100/70">{formatCurrency(getPrice(product))}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProductRailSection({ title, description, items, onSeeAll, accent = 'text-navy' }) {
  const railRef = useRef(null)

  const scrollRail = (direction) => {
    railRef.current?.scrollBy({ left: direction * 360, behavior: 'smooth' })
  }

  return (
    <section className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-5 shadow-[0_8px_30px_rgba(11,36,81,0.06)] backdrop-blur-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-jakarta text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Curated shelf</p>
          <h2 className={`mt-1 font-playfair text-2xl font-black ${accent}`}>{title}</h2>
          {description && <p className="mt-1 max-w-2xl text-sm font-medium leading-6 text-slate-500">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => scrollRail(-1)} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-navy/30 hover:text-navy">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => scrollRail(1)} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-navy/30 hover:text-navy">
            <ChevronRight className="h-4 w-4" />
          </button>
          <button type="button" onClick={onSeeAll} className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-4 py-2 text-xs font-black text-slate-600 transition hover:border-navy/30 hover:text-navy">
            See all
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div
        ref={railRef}
        className="mt-5 flex gap-4 overflow-x-auto scroll-smooth pb-2 pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((product) => (
          <div key={product._id} className="w-[180px] shrink-0 snap-start sm:w-[205px]">
            <MiniProductCard product={product} rail />
          </div>
        ))}
      </div>
    </section>
  )
}

function MiniProductCard({ product, rail = false }) {
  const variant = getVariantOptions(product)[0] || null
  return (
    <Link
      to={`/products/${product._id}`}
      className={`group overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50 transition-all hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md ${
        rail ? 'flex h-full w-full flex-col' : 'block h-full'
      }`}
    >
      <div className="overflow-hidden">
        <img src={getProductImage(product, variant)} alt="" className={`w-full object-cover transition duration-300 group-hover:scale-105 ${rail ? 'h-32 sm:h-36' : 'h-28 sm:h-36'}`} />
      </div>
      <div className={rail ? 'flex-1 p-4' : 'p-4'}>
        <p className="font-jakarta text-[10px] font-black uppercase tracking-[0.22em] text-navy">{product.category?.name || 'Product'}</p>
        <p className="mt-1 line-clamp-1 font-playfair text-sm font-bold text-slate-900">{product.title}</p>
        <p className="mt-1 font-bold text-navy">{formatCurrency(getPrice(product, variant))}</p>
      </div>
    </Link>
  )
}

function RelatedStrip({ items }) {
  return (
    <section className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(11,36,81,0.08)]">
      <h2 className="font-playfair text-2xl font-black text-navy">Related products</h2>
      <div className="mt-4 grid grid-cols-2 gap-5 xl:grid-cols-3">
        {items.map((item) => <MiniProductCard key={item._id} product={item} />)}
      </div>
    </section>
  )
}

function FrequentlyBoughtTogether({ products }) {
  if (!products.length) return null
  return (
    <section className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(11,36,81,0.08)]">
      <h2 className="font-playfair text-2xl font-black text-navy">Frequently Bought Together</h2>
      <div className="mt-4 grid grid-cols-2 gap-5 xl:grid-cols-3">
        {products.map((item) => <MiniProductCard key={item._id} product={item} />)}
      </div>
    </section>
  )
}

function SpecsSection({ item }) {
  const specs = [
    ['Brand', getBrand(item)],
    ['SKU', item.sku || item.productId || 'N/A'],
    ['Tax', `${Number(item.pricing?.taxPercent || 0)}%`],
    ['Shipping', item.shippingInfo?.isFreeShipping ? 'Free shipping' : formatCurrency(item.shippingInfo?.shippingCharge || 0)],
    ['Warranty', item.warranty || 'Standard seller warranty'],
    ['Return Policy', item.returnPolicy || 'Eligible within policy window'],
  ]

  return (
    <section className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(11,36,81,0.08)]">
      <h2 className="font-playfair text-2xl font-black text-navy">Specifications</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {specs.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 p-4">
            <p className="font-jakarta text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function ReviewsSection({ reviews, vendor, productId = null }) {
  return (
    <section className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(11,36,81,0.08)]">
      <h2 className="font-playfair text-2xl font-black text-navy">Customer reviews</h2>
      <div className="mt-4 space-y-3">
        {reviews.length ? reviews.map((review) => (
          <div key={review._id} className="rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 p-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-navy">{review.title || 'Review'}</p>
              <p className="text-xs font-black text-amber-500">{review.rating} / 5</p>
            </div>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{review.comment}</p>
          </div>
        )) : <EmptyState title="No reviews yet" description={`Be the first to review ${vendor.businessName || 'this store'}.`} />}
      </div>
      <ReviewBox vendor={vendor?._id} productId={productId} />
    </section>
  )
}

function ReviewBox({ vendor, productId = null }) {
  const [form, setForm] = useState({ rating: '5', title: '', comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const submit = async (event) => {
    event.preventDefault()
    if (!vendor) return
    if (Number(form.rating) < 1 || Number(form.rating) > 5) {
      toast.error('Please choose a rating between 1 and 5')
      return
    }
    if (form.comment.trim().length < 10) {
      toast.error('Comment must be at least 10 characters')
      return
    }
    setSubmitting(true)
    try {
      await customerApi.createReview({ vendor, product: productId || undefined, rating: Number(form.rating), title: form.title, comment: form.comment })
      toast.success('Review submitted')
      setForm({ rating: '5', title: '', comment: '' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to submit review')
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <form onSubmit={submit} className="mt-5 rounded-xl border border-slate-200 p-4">
      <h3 className="font-playfair text-lg font-bold text-navy">Write a review</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <input value={form.rating} onChange={(event) => setForm((current) => ({ ...current, rating: event.target.value }))} type="number" min="1" max="5" step="1" className="h-11 rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none transition focus:border-navy/40" />
        <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Review title" className="h-11 rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none transition focus:border-navy/40" />
        <input value={form.comment} onChange={(event) => setForm((current) => ({ ...current, comment: event.target.value }))} placeholder="Share your experience" className="h-11 rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none transition focus:border-navy/40" />
      </div>
      <button type="submit" disabled={submitting} className="mt-4 rounded-xl bg-gradient-to-r from-navy to-royal px-4 py-3 text-sm font-black text-white shadow-md transition hover:from-navy/90 hover:to-royal/90 disabled:opacity-60">
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}

function VendorCard({ vendor }) {
  return (
    <div className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(11,36,81,0.08)]">
      <div className="flex items-center gap-4">
        <img src={vendor.logo?.url || '/logo.png'} alt="" className="h-16 w-16 rounded-xl object-cover ring-2 ring-slate-100" />
        <div>
          <p className="font-jakarta text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Seller</p>
          <h3 className="font-playfair text-xl font-black text-navy">{vendor.businessName || 'Verified seller'}</h3>
        </div>
      </div>
      <div className="mt-4 space-y-2 text-sm font-medium text-slate-600">
        <p>{vendor.ownerName || vendor.user?.name || 'Seller'}</p>
        {vendor.phone && <p>{vendor.phone}</p>}
        {vendor.email && <p>{vendor.email}</p>}
      </div>
    </div>
  )
}

function ShippingCard({ item }) {
  return (
    <div className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(11,36,81,0.08)]">
      <h3 className="font-playfair text-xl font-black text-navy">Shipping & returns</h3>
      <div className="mt-4 space-y-3 text-sm font-medium text-slate-600">
        <p>{item.shippingInfo?.isFreeShipping ? 'Free shipping available' : `Shipping charge ${formatCurrency(item.shippingInfo?.shippingCharge || 0)}`}</p>
        <p>{item.returnPolicy || 'Returns accepted within the stated policy window.'}</p>
        <p>{item.warranty || 'Warranty support depends on the selected product.'}</p>
      </div>
    </div>
  )
}

function QuantitySelector({ disabled = false }) {
  const [qty, setQty] = useState(1)
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2">
      <button type="button" disabled={disabled} onClick={() => setQty((current) => Math.max(1, current - 1))} className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200 disabled:opacity-50"><Minus className="h-4 w-4" /></button>
      <span className="min-w-8 text-center font-playfair text-lg font-black text-navy">{qty}</span>
      <button type="button" disabled={disabled} onClick={() => setQty((current) => current + 1)} className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200 disabled:opacity-50"><Plus className="h-4 w-4" /></button>
    </div>
  )
}

function QuantityButtons({ value, onChange, max }) {
  return (
    <div className="inline-flex items-center rounded-lg border border-slate-200">
      <button type="button" onClick={() => onChange(Math.max(1, value - 1))} className="grid h-9 w-9 place-items-center text-slate-500 transition hover:bg-slate-100"><Minus className="h-3.5 w-3.5" /></button>
      <span className="min-w-10 text-center font-playfair text-sm font-black text-navy">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max || 99, value + 1))} className="grid h-9 w-9 place-items-center text-slate-500 transition hover:bg-slate-100"><Plus className="h-3.5 w-3.5" /></button>
    </div>
  )
}

function PaginationBar({ page, totalPages, onChange }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      <button type="button" disabled={page <= 1} onClick={() => onChange((current) => Math.max(1, current - 1))} className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
      <span className="min-w-20 text-center font-playfair text-sm font-black text-navy">{page} / {totalPages}</span>
      <button type="button" disabled={page >= totalPages} onClick={() => onChange((current) => Math.min(totalPages, current + 1))} className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="h-56 bg-slate-100" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-24 rounded-lg bg-slate-100" />
            <div className="h-5 w-3/4 rounded-lg bg-slate-100" />
            <div className="h-3 w-1/2 rounded-lg bg-slate-100" />
            <div className="h-10 rounded-xl bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  )
}

function FieldGroup({ label, children }) {
  return (
    <label className="block text-sm font-black text-slate-700">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  )
}

function ToggleChip({ label, active, onClick }) {
  return (
    <button type="button" onClick={onClick} className={`rounded-xl border px-4 py-3 text-left text-sm font-black transition-all ${active ? 'border-navy bg-navy/5 text-navy shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}>
      {label}
    </button>
  )
}

function MetricRow({ label, value, strong = false, light = false, theme = 'default' }) {
  const colorMap = {
    default: light ? 'text-blue-100' : 'text-slate-600',
    emerald: light ? 'text-emerald-300' : 'text-emerald-600',
  }
  return (
    <div className={`flex items-center justify-between text-sm ${strong ? 'font-black' : 'font-semibold'} ${colorMap[theme] || colorMap.default}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

function InfoBlock({ icon: Icon, title, text }) {
  return (
    <div className="rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-navy" />
        <p className="text-sm font-black text-navy">{title}</p>
      </div>
      <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{text}</p>
    </div>
  )
}

function TimelineStep({ title, note, active }) {
  return (
    <div className={`flex gap-3 rounded-xl border p-4 transition ${active ? 'border-navy bg-navy/5 shadow-sm' : 'border-slate-200 bg-white'}`}>
      <div className={`mt-0.5 grid h-8 w-8 place-items-center rounded-full transition-all ${active ? 'bg-navy text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}>
        <Check className="h-4 w-4" />
      </div>
      <div>
        <p className="font-bold text-navy">{title}</p>
        <p className="text-sm font-medium text-slate-500">{note}</p>
      </div>
    </div>
  )
}

function ReturnRequestModal({ order, onClose, initialItems = [] }) {
  const { submitReturnRequest } = useShop()
  const [step, setStep] = useState(0)
  const [selectedItems, setSelectedItems] = useState(() => initialItems)
  const [reason, setReason] = useState('')
  const [reasonLabel, setReasonLabel] = useState('')
  const [details, setDetails] = useState('')
  const [returnMethod, setReturnMethod] = useState('pickup')
  const [refundMethod, setRefundMethod] = useState('original')
  const [evidence, setEvidence] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const steps = ['Select Items', 'Reason', 'Details', 'Return Method', 'Refund Method', 'Evidence', 'Review']

  const toggleItem = (item) => {
    setSelectedItems((prev) =>
      prev.some((i) => i.productId === item.productId)
        ? prev.filter((i) => i.productId !== item.productId)
        : [...prev, { productId: item.productId, productSnapshot: item.productSnapshot, quantity: item.quantity, unitPrice: item.unitPrice }]
    )
  }

  const handleEvidenceUpload = (event) => {
    const files = Array.from(event.target.files || [])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setEvidence((prev) => [...prev, e.target.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeEvidence = (index) => {
    setEvidence((prev) => prev.filter((_, i) => i !== index))
  }

  const handleNext = () => {
    if (step === 0 && !selectedItems.length) { setErrors({ items: 'Select at least one item' }); return }
    if (step === 1 && !reason) { setErrors({ reason: 'Select a return reason' }); return }
    setErrors({})
    setStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleSubmit = async () => {
    if (!selectedItems.length || !reason) {
      toast.error('Please complete all required fields')
      return
    }
    setSubmitting(true)
    const result = submitReturnRequest(order._id, {
      items: selectedItems,
      reason,
      reasonLabel,
      details,
      returnMethod,
      refundMethod,
      evidence,
    })
    setSubmitting(false)
    if (result) {
      toast.success('Return request submitted successfully')
      onClose()
    }
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <p className="mb-4 text-sm font-medium text-slate-600">Select the items you want to return:</p>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {order.items.map((item) => (
                <label
                  key={item.productId}
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${selectedItems.some((i) => i.productId === item.productId) ? 'border-navy bg-navy/5' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.some((i) => i.productId === item.productId)}
                    onChange={() => toggleItem(item)}
                    className="accent-navy h-5 w-5"
                  />
                  <img src={item.productSnapshot?.images?.[0]?.url || '/logo.png'} alt="" className="h-14 w-14 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-navy">{item.productSnapshot?.title}</p>
                    <p className="text-xs text-slate-500">Qty: {item.quantity} · {formatCurrency(item.unitPrice)} each</p>
                  </div>
                </label>
              ))}
            </div>
            {errors.items && <p className="mt-2 text-xs font-semibold text-rose-600">{errors.items}</p>}
          </div>
        )
      case 1:
        return (
          <div>
            <p className="mb-4 text-sm font-medium text-slate-600">Why are you returning this item?</p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {RETURN_REASONS.map((r) => (
                <label
                  key={r.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${reason === r.value ? 'border-navy bg-navy/5' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <input
                    type="radio"
                    name="return-reason"
                    value={r.value}
                    checked={reason === r.value}
                    onChange={() => { setReason(r.value); setReasonLabel(r.label) }}
                    className="accent-navy"
                  />
                  <span className="text-sm font-medium text-slate-700">{r.label}</span>
                </label>
              ))}
            </div>
            {errors.reason && <p className="mt-2 text-xs font-semibold text-rose-600">{errors.reason}</p>}
          </div>
        )
      case 2:
        return (
          <div>
            <p className="mb-4 text-sm font-medium text-slate-600">Provide more details (optional):</p>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={5}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium outline-none transition focus:border-navy/40"
              placeholder="Describe the issue in detail. Include any relevant information that will help us process your return faster..."
            />
            <p className="mt-2 text-xs text-slate-400">{details.length}/500 characters</p>
          </div>
        )
      case 3:
        return (
          <div>
            <p className="mb-4 text-sm font-medium text-slate-600">How would you like to return the item?</p>
            <div className="space-y-3">
              {RETURN_METHODS.map((m) => (
                <label
                  key={m.value}
                  className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition ${returnMethod === m.value ? 'border-navy bg-navy/5' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <input
                    type="radio"
                    name="return-method"
                    value={m.value}
                    checked={returnMethod === m.value}
                    onChange={() => setReturnMethod(m.value)}
                    className="accent-navy mt-1"
                  />
                  <div>
                    <p className="text-sm font-bold text-navy">{m.label}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{m.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )
      case 4:
        return (
          <div>
            <p className="mb-4 text-sm font-medium text-slate-600">How would you like to receive your refund?</p>
            <div className="space-y-3">
              {REFUND_METHODS.map((m) => (
                <label
                  key={m.value}
                  className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition ${refundMethod === m.value ? 'border-navy bg-navy/5' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <input
                    type="radio"
                    name="refund-method"
                    value={m.value}
                    checked={refundMethod === m.value}
                    onChange={() => setRefundMethod(m.value)}
                    className="accent-navy mt-1"
                  />
                  <div>
                    <p className="text-sm font-bold text-navy">{m.label}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{m.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )
      case 5:
        return (
          <div>
            <p className="mb-4 text-sm font-medium text-slate-600">Upload images as evidence (optional):</p>
            <label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 p-8 transition hover:border-navy/40">
              <Upload className="h-8 w-8 text-slate-400" />
              <span className="text-sm font-medium text-slate-500">Click to upload images</span>
              <span className="text-xs text-slate-400">PNG, JPG up to 5MB each</span>
              <input type="file" accept="image/*" multiple onChange={handleEvidenceUpload} className="hidden" />
            </label>
            {evidence.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {evidence.map((src, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-lg border border-slate-200">
                    <img src={src} alt="" className="h-20 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeEvidence(i)}
                      className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/50 text-white opacity-0 transition group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      case 6:
        return (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">Items ({selectedItems.length})</p>
              {selectedItems.map((item) => (
                <p key={item.productId} className="mt-2 text-sm font-medium text-slate-700">{item.productSnapshot?.title} × {item.quantity}</p>
              ))}
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">Reason</p>
              <p className="mt-1 text-sm font-medium text-slate-700">{reasonLabel || reason}</p>
            </div>
            {details && (
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">Details</p>
                <p className="mt-1 text-sm font-medium text-slate-700">{details}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">Return Method</p>
                <p className="mt-1 text-sm font-medium text-slate-700">{RETURN_METHODS.find((m) => m.value === returnMethod)?.label}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">Refund Method</p>
                <p className="mt-1 text-sm font-medium text-slate-700">{REFUND_METHODS.find((m) => m.value === refundMethod)?.label}</p>
              </div>
            </div>
            {evidence.length > 0 && (
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">Evidence ({evidence.length} images)</p>
                <div className="mt-2 flex gap-2">
                  {evidence.map((src, i) => (
                    <img key={i} src={src} alt="" className="h-12 w-12 rounded-lg object-cover ring-1 ring-slate-200" />
                  ))}
                </div>
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-navy/30 px-4 py-8 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2.5rem] border border-slate-200/80 bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-6">
          <div>
            <h2 className="font-playfair text-2xl font-black text-navy">Start a Return</h2>
            <div className="mt-1 flex items-center gap-2">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-1">
                  <div className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-black ${i <= step ? 'bg-navy text-white' : 'bg-slate-100 text-slate-400'}`}>{i + 1}</div>
                  <span className={`text-[10px] font-medium ${i === step ? 'text-navy' : 'text-slate-400'}`}>{s}</span>
                  {i < steps.length - 1 && <div className="mx-1 h-px w-3 bg-slate-200" />}
                </div>
              ))}
            </div>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          {renderStep()}
        </div>

        <div className="sticky bottom-0 flex justify-between border-t border-slate-100 bg-white p-6">
          <button
            type="button"
            onClick={() => step === 0 ? onClose() : setStep((prev) => prev - 1)}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-black text-slate-600 transition hover:border-navy/30 hover:text-navy"
          >
            {step === 0 ? 'Cancel' : 'Back'}
          </button>
          {step < steps.length - 1 ? (
            <button type="button" onClick={handleNext} className="rounded-xl bg-navy px-6 py-2.5 text-sm font-black text-white shadow-md transition hover:bg-navy/90">
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-xl bg-gradient-to-r from-navy to-royal px-6 py-2.5 text-sm font-black text-white shadow-md transition hover:from-navy/90 hover:to-royal/90 disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Submit Return Request'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function formatAddress(address) {
  if (!address) return 'Address unavailable'
  if (typeof address === 'string') return address
  return [address.fullName, address.line1, address.city, address.state, address.pincode].filter(Boolean).join(', ')
}
