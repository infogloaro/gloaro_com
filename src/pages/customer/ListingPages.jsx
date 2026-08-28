import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Clock3,
  Filter,
  MapPin,
  Search,
  Sparkles,
  Star,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { customerApi } from '../../api/customer'
import EmptyState from '../../components/common/EmptyState'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import LoadingScreen from '../../components/common/LoadingScreen'
import Seo from '../../components/Seo'
import StatusBadge from '../../components/common/StatusBadge'
import LocationAutocomplete from '../../components/common/LocationAutocomplete'
import FormField from '../../components/forms/FormField'
import { useApi } from '../../hooks/useApi'
import { formatCurrency, formatDate, getList, getPagination } from '../../utils/format'
import ResourceListPage from '../shared/ResourceListPage'
import NotificationsPage from '../shared/NotificationsPage'
import ProfilePage from '../shared/ProfilePage'
import SimpleJsonForm from '../shared/SimpleJsonForm'
import { useShop } from '../../context/ShopContext'
import { ProductCard, QuickViewModal } from './ShopPages'

function VendorCard({ vendor }) {
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <img src={vendor.logo?.url || vendor.images?.[0]?.url || vendor.gallery?.[0]?.url || vendor.coverImage?.url || '/logo.png'} alt="" className="h-40 w-full object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-extrabold text-slate-900">{vendor.businessName || vendor.title || vendor.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-500">{vendor.shortDescription || vendor.description || vendor.address?.city}</p>
        <div className="mt-3 flex items-center justify-between">
          <StatusBadge value={vendor.status || (vendor.isActive ? 'active' : 'pending')} />
          <Link to={`/vendors/${vendor._id}`} className="text-sm font-extrabold text-[#0d4697]">View</Link>
        </div>
      </div>
    </article>
  )
}

function CardGrid({ items, type }) {
  if (!items?.length) return <EmptyState />
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (type === 'vendors'
        ? <VendorCard key={item._id} vendor={item} />
        : (
          <article key={item._id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <img src={item.logo?.url || item.images?.[0]?.url || item.gallery?.[0]?.url || item.coverImage?.url || '/logo.png'} alt="" className="h-40 w-full object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-extrabold text-slate-900">{item.businessName || item.title || item.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-500">{item.shortDescription || item.description || item.address?.city}</p>
              <div className="mt-3 flex items-center justify-between">
                <StatusBadge value={item.status || (item.isActive ? 'active' : 'pending')} />
                <Link to={`/${type}/${item._id}`} className="text-sm font-extrabold text-[#0d4697]">View</Link>
              </div>
            </div>
          </article>
        )))}
    </div>
  )
}

const SERVICE_ACCENTS = [
  'from-[#0d4697] via-[#1f6fd6] to-[#67b7ff]',
  'from-[#ff8a00] via-[#ffb547] to-[#ffe1a8]',
  'from-[#0f766e] via-[#14b8a6] to-[#9bf5d0]',
  'from-[#4f46e5] via-[#7c3aed] to-[#c4b5fd]',
]

function getServiceAccent(index = 0) {
  return SERVICE_ACCENTS[index % SERVICE_ACCENTS.length]
}

function getServiceLocation(vendor = {}) {
  const address = vendor.address || {}
  return [address.city, address.state].filter(Boolean).join(', ') || 'Location on request'
}

function getServiceRating(service = {}) {
  return Number(service.stats?.avgRating || 0)
}

function getServiceReviewCount(service = {}) {
  return Number(service.stats?.totalReviews || 0)
}

function dedupeById(items = []) {
  const seen = new Set()
  return items.filter((item) => {
    const key = String(item?._id || item?.id || '')
    if (!key) return true
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function CustomerHomePage() {
  const vendors = useApi(() => customerApi.vendors({ limit: 6, status: 'approved' }))
  const products = useApi(() => customerApi.products({ limit: 6 }))
  if (vendors.loading || products.loading) return <LoadingScreen label="Loading marketplace..." />
  return (
    <main className="bg-[#fdf9e9] px-5 py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-playfair text-5xl font-bold italic text-[#0d4697]">Discover verified businesses</h1>
        <p className="mt-3 max-w-2xl font-urbanist text-lg font-semibold text-slate-700">Search vendors, products, services, events, and referrals powered by the Gloaro backend.</p>
        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-extrabold text-slate-900">Featured Vendors</h2>
          <CardGrid items={vendors.data?.data || vendors.data || []} type="vendors" />
        </section>
        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-extrabold text-slate-900">Popular Products</h2>
          <CardGrid items={products.data?.data || products.data || []} type="products" />
        </section>
      </div>
    </main>
  )
}

export function NearbyPage() {
  const navigate = useNavigate()
  const shop = useShop()
  const [location, setLocation] = useState(null)
  const [permissionStatus, setPermissionStatus] = useState('idle')
  const [locationError, setLocationError] = useState('')
  const [activeTab, setActiveTab] = useState('services')
  const [filters, setFilters] = useState({ category: '', rating: '', openNow: false, search: '', minPrice: '', maxPrice: '', sort: 'nearest' })
  const [scope, setScope] = useState(null)
  const [resultScopes, setResultScopes] = useState({ products: null, services: null })
  const [displayProducts, setDisplayProducts] = useState([])
  const [displayServices, setDisplayServices] = useState([])
  const [isUnitFallback, setIsUnitFallback] = useState(false)
  const [nearbyLoading, setNearbyLoading] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [hierarchy, setHierarchy] = useState([])
  const [loadingChapters, setLoadingChapters] = useState(true)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [quickViewVariant, setQuickViewVariant] = useState(null)
  const { loading: productsLoading, execute: executeProducts } = useApi((params) => customerApi.nearbyProducts(params), [], { immediate: false, initialData: [] })
  const { loading: servicesLoading, execute: executeServices } = useApi((params) => customerApi.nearbyServices(params), [], { immediate: false, initialData: [] })
  const categories = useApi(() => customerApi.categories({ limit: 100, type: 'business' }))

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setPermissionStatus('unsupported')
      setLocationError('Your browser does not support location access.')
      return
    }

    setPermissionStatus('requesting')
    setLocationError('')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }
        setLocation(nextLocation)
        setPermissionStatus('granted')
      },
      () => {
        setPermissionStatus('denied')
        setLocationError('Location access is required to discover nearby services and products.')
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    )
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(requestLocation, 0)
    return () => window.clearTimeout(timer)
  }, [requestLocation])

  useEffect(() => {
    let mounted = true
    customerApi.organizationHierarchy()
      .then((res) => {
        const records = res.data?.data || res.data || []
        if (mounted) setHierarchy(Array.isArray(records) ? records : [])
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoadingChapters(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  const chapterOptions = useMemo(() => buildChapterOptions(hierarchy), [hierarchy])
  const selectedUnit = selectedChapter
  const selectedDistrict = selectedUnit?.districtId
    ? { _id: selectedUnit.districtId, name: selectedUnit.districtName }
    : null

  const searchParams = useMemo(() => {
    const base = {
      category: filters.category || undefined,
      rating: filters.rating || undefined,
      search: filters.search || undefined,
      openNow: filters.openNow,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      sort: filters.sort,
      limit: 50,
    }
    if (selectedChapter) return { ...base, chapterId: selectedChapter._id }
    if (location) {
      return {
        ...base,
        latitude: location.lat,
        longitude: location.lng,
        lat: location.lat,
        lng: location.lng,
      }
    }
    return null
  }, [location, selectedChapter, filters])

  useEffect(() => {
    if (!searchParams) return
    let cancelled = false
    setNearbyLoading(true)
    setDisplayProducts([])
    setDisplayServices([])
    setIsUnitFallback(false)
    setScope(null)
    setResultScopes({ products: null, services: null })

    const normalizePayload = (payload) => payload?.data || payload || {}
    const readItems = (payload) => getList(normalizePayload(payload))
    const readScope = (payload) => normalizePayload(payload)?.scope || null
    const exactParams = (params) => ({ ...params, fallback: 'false' })
    const applyResults = ({ productsPayload, servicesPayload, fallback }) => {
      if (cancelled) return
      const productsScope = readScope(productsPayload)
      const servicesScope = readScope(servicesPayload)
      setDisplayProducts(dedupeById(readItems(productsPayload)))
      setDisplayServices(dedupeById(readItems(servicesPayload)))
      setIsUnitFallback(Boolean(fallback))
      setResultScopes({ products: productsScope, services: servicesScope })
      setScope(servicesScope || productsScope || null)
    }

    const runSearch = async () => {
      const primaryParams = selectedUnit ? exactParams(searchParams) : searchParams
      const [unitProductsPayload, unitServicesPayload] = await Promise.all([
        executeProducts(primaryParams),
        executeServices(primaryParams),
      ])
      if (cancelled) return

      const unitProducts = readItems(unitProductsPayload)
      const unitServices = readItems(unitServicesPayload)
      const shouldFallbackToDistrict =
        selectedDistrict?._id &&
        unitProducts.length === 0 &&
        unitServices.length === 0

      if (!shouldFallbackToDistrict) {
        applyResults({
          productsPayload: unitProductsPayload,
          servicesPayload: unitServicesPayload,
          fallback: false,
        })
        return
      }

      const districtParams = exactParams({
        ...searchParams,
        chapterId: undefined,
        districtId: selectedDistrict._id,
        limit: 500,
      })
      const [districtProductsPayload, districtServicesPayload] = await Promise.all([
        executeProducts(districtParams),
        executeServices(districtParams),
      ])
      applyResults({
        productsPayload: districtProductsPayload,
        servicesPayload: districtServicesPayload,
        fallback: true,
      })
    }

    runSearch()
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setNearbyLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [searchParams, selectedDistrict?._id, selectedUnit, executeProducts, executeServices])

  const handleLocationChange = useCallback((chapterId) => {
    if (!chapterId) {
      setSelectedChapter(null)
      setLocation(null)
      setLocationError('')
      window.setTimeout(requestLocation, 0)
      return
    }
    const chapter = chapterOptions.find((option) => String(option._id) === String(chapterId))
    setSelectedChapter(chapter || null)
    setLocation(null)
    setLocationError('')
    setPermissionStatus('idle')
  }, [chapterOptions, requestLocation])

  const productItems = displayProducts
  const serviceItems = displayServices
  const activeLoading = nearbyLoading || (activeTab === 'services' ? servicesLoading : productsLoading)
  const activeScope = activeTab === 'services' ? resultScopes.services : resultScopes.products
  const fallbackScope = resultScopes.services || resultScopes.products || activeScope

  const categoryOptions = getList(categories.data)

  return (
    <>
      <Seo title="Nearby Businesses | GLOARO" description="Find nearby verified services and products from your local GLOARO network, with chapter-aware and location-based discovery." canonical="/nearby" />
      <section className="bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-lg bg-[#0d4697] px-5 py-6 text-white sm:px-7">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ffb20c]">Near Me</p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Local Marketplace Around You</h1>
          <p className="mt-2 max-w-2xl text-sm font-semibold text-blue-50 sm:text-base">Allow location access and Gloaro will automatically find nearby services and products from your local Gloaro network. You can also pick any Chapter manually.</p>
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="nearby-location-select" className="text-sm font-extrabold text-slate-700">Location</label>
            <LocationAutocomplete
              options={chapterOptions}
              value={selectedChapter ? String(selectedChapter._id) : ''}
              onChange={handleLocationChange}
              loading={loadingChapters}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {selectedChapter ? (
              <div className="flex flex-wrap items-center gap-2">
                <p className="inline-flex rounded-full bg-[#0d4697]/10 px-3 py-1 text-xs font-bold text-[#0d4697]">Viewing {selectedChapter.label}</p>
                {isUnitFallback && (
                  <p className="inline-flex rounded-full bg-[#ffb20c] px-3 py-1 text-xs font-bold text-[#0d4697]">
                    Showing {scopeLabel(fallbackScope)}
                  </p>
                )}
              </div>
            ) : (
              <>
                {location && <p className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">Location detected with {Math.round(location.accuracy)}m accuracy</p>}
                {scope && <p className="inline-flex rounded-full bg-[#ffb20c] px-3 py-1 text-xs font-bold text-[#0d4697]">{scopeLabel(scope)}</p>}
              </>
            )}
          </div>
        </div>

        {!selectedChapter && permissionStatus === 'requesting' && <div className="mt-8 rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm"><LoadingSpinner /><p className="mt-4 font-bold text-slate-700">Detecting your location...</p></div>}

        {!selectedChapter && (permissionStatus === 'denied' || permissionStatus === 'unsupported') && (
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-6 text-center shadow-sm">
            <h2 className="text-xl font-extrabold text-slate-950">Enable location to continue</h2>
            <p className="mx-auto mt-2 max-w-xl font-semibold text-slate-700">{locationError || 'Location access is required to discover nearby services and products.'}</p>
            <button type="button" onClick={requestLocation} className="mt-5 rounded-md bg-[#0d4697] px-5 py-2.5 font-bold text-white">Retry Location</button>
          </div>
        )}

        {(location || selectedChapter) && (
          <>
            <NearbyFilters filters={filters} setFilters={setFilters} categories={categoryOptions} />

            <div className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="grid grid-cols-2 border-b border-slate-200">
                {[
                  ['services', `B2B Services (${serviceItems.length})`],
                  ['products', `Products (${productItems.length})`],
                ].map(([key, label]) => <button key={key} type="button" onClick={() => setActiveTab(key)} className={`px-3 py-4 text-sm font-extrabold sm:text-base ${activeTab === key ? 'border-b-4 border-[#0d4697] text-[#0d4697]' : 'text-slate-500'}`}>{label}</button>)}
              </div>

              <div className="p-4 sm:p-5">
                {isUnitFallback && !activeLoading && (
                  <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-[#0d4697]">
                    No products or services found in this unit. Showing district-wide products and services from {scopeLabel(fallbackScope)}.
                  </div>
                )}
                {activeLoading ? (
                  <LoadingSpinner />
                ) : activeTab === 'services' ? (
                  serviceItems.length === 0
                    ? <EmptyState title="No nearby services found" description="Try changing the filters or search terms." />
                    : (
                      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {serviceItems.map((service) => <ServiceCard key={service._id} service={service} />)}
                      </div>
                    )
                ) : (
                  productItems.length === 0
                    ? <EmptyState title="No nearby products found" description="Try changing the filters or search terms." />
                    : (
                      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {productItems.map((product) => (
                          <ProductCard
                            key={product._id}
                            product={product}
                            wishlisted={shop.localWishlist.some((item) => String(item.productId) === String(product._id))}
                            onQuickView={(nextProduct) => {
                              setQuickViewProduct(nextProduct)
                              setQuickViewVariant(null)
                            }}
                            onWishlist={() => shop.toggleWishlist(product)}
                            onAddToCart={(nextProduct) => shop.upsertCartLine(nextProduct, null, 1)}
                            onOpen={() => navigate(`/products/${product._id}`)}
                          />
                        ))}
                      </div>
                    )
                )}
              </div>
            </div>

            {quickViewProduct && (
              <QuickViewModal
                product={quickViewProduct}
                selectedVariant={quickViewVariant}
                onSelectVariant={setQuickViewVariant}
                onAddToCart={() => {
                  shop.upsertCartLine(quickViewProduct, quickViewVariant, 1)
                  setQuickViewProduct(null)
                }}
                onBuyNow={() => navigate('/checkout')}
                onClose={() => setQuickViewProduct(null)}
              />
            )}
          </>
        )}
      </div>
      </section>
    </>
  )
}

function NearbyFilters({ filters, setFilters, categories }) {
  return (
    <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <label className="block text-sm font-bold text-slate-700">
        Search nearby
        <input value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} placeholder="watches, phones, laptop..." className="mt-1 h-11 w-full rounded-md border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-[#0d4697]" />
      </label>
      <div className="mt-4 grid gap-3 md:grid-cols-3 lg:grid-cols-5">
        <label className="text-sm font-bold text-slate-700">
          Category
          <select value={filters.category} onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))} className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-[#0d4697]">
            <option value="">All categories</option>
            {categories.map((category) => <option key={category._id || category.id || category.name} value={category._id || category.id}>{category.name}</option>)}
          </select>
        </label>
        <label className="text-sm font-bold text-slate-700">
          Rating
          <select value={filters.rating} onChange={(event) => setFilters((current) => ({ ...current, rating: event.target.value }))} className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-[#0d4697]">
            <option value="">Any rating</option>
            <option value="4">4 stars & above</option>
            <option value="3">3 stars & above</option>
          </select>
        </label>
        <label className="text-sm font-bold text-slate-700">
          Min Price
          <input type="number" min="0" value={filters.minPrice} onChange={(event) => setFilters((current) => ({ ...current, minPrice: event.target.value }))} className="mt-1 h-11 w-full rounded-md border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-[#0d4697]" />
        </label>
        <label className="text-sm font-bold text-slate-700">
          Max Price
          <input type="number" min="0" value={filters.maxPrice} onChange={(event) => setFilters((current) => ({ ...current, maxPrice: event.target.value }))} className="mt-1 h-11 w-full rounded-md border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-[#0d4697]" />
        </label>
        <label className="text-sm font-bold text-slate-700">
          Sort By
          <select value={filters.sort} onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))} className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-[#0d4697]">
            <option value="nearest">Nearest</option>
            <option value="highestRated">Highest Rated</option>
            <option value="newest">Newest</option>
            <option value="mostPopular">Most Popular</option>
          </select>
        </label>
        <label className="flex h-11 items-center gap-3 self-end rounded-md border border-slate-200 px-3 text-sm font-extrabold text-slate-700">
          <input type="checkbox" checked={filters.openNow} onChange={(event) => setFilters((current) => ({ ...current, openNow: event.target.checked }))} className="h-4 w-4 accent-[#0d4697]" />
          Open Now
        </label>
      </div>
    </div>
  )
}

function getServiceDisplayPrice(service) {
  const pricing = service?.pricing || {}
  const candidates = [pricing.minPrice, pricing.maxPrice, service?.price, service?.amount]
  const numeric = candidates.map((value) => Number(value)).find((value) => Number.isFinite(value) && value > 0)
  return numeric || 0
}

function getServicePriceText(service) {
  const pricing = service?.pricing || {}
  const minPrice = Number(pricing.minPrice)
  const maxPrice = Number(pricing.maxPrice)
  const currency = pricing.currency || 'INR'

  if (pricing.type === 'range' && Number.isFinite(minPrice) && minPrice > 0 && Number.isFinite(maxPrice) && maxPrice > 0) {
    return `${formatCurrency(minPrice, currency)} - ${formatCurrency(maxPrice, currency)}`
  }

  const price = getServiceDisplayPrice(service)
  if (price > 0) return formatCurrency(price, currency)
  return 'Custom quote'
}

function ServiceCard({ service }) {
  const vendor = service.vendor || {}
  const providerName = vendor.user?.name || vendor.ownerName || 'Gloaro vendor'
  const businessName = vendor.businessName || 'Gloaro business'
  const address = vendor.address || {}
  const location = [address.city, address.state].filter(Boolean).join(', ') || 'Location not listed'

  return (
    <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition duration-250 ease-in-out flex flex-col justify-between">
      <div>
        <div className="relative overflow-hidden aspect-video bg-slate-100">
          <img
            src={service.gallery?.[0]?.url || '/logo.png'}
            alt={service.title}
            className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
          />
        </div>
        <div className="p-4">
          <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[#0d4697]">
            {service.category?.name || 'Service'}
          </span>
          <h3 className="mt-1 text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-[#0d4697] transition">
            {service.title}
          </h3>
          <p className="mt-1 text-xs font-semibold text-slate-650 line-clamp-2">
            {service.shortDescription || service.description}
          </p>
          <div className="mt-2 space-y-1 border-t border-slate-100 pt-2 text-[11px] font-semibold text-slate-500">
            <p>Provider: {providerName}</p>
            <p>Business: {businessName}</p>
            <p className="text-slate-400">📍 {location}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 p-4 pt-3 flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-slate-400">Starting Price</span>
          <span className="text-sm font-black text-slate-900">
            {getServicePriceText(service)}
          </span>
        </div>
        <Link
          to={`/services/${service._id}`}
          className="rounded-md bg-[#0d4697] px-3 py-1.5 text-xs font-extrabold text-white hover:bg-blue-800 transition"
        >
          View Details
        </Link>
      </div>
    </article>
  )
}

function scopeLabel(scope) {
  if (!scope) return ''
  const parts = []
  if (scope.level === 'chapter' && scope.chapterName) parts.push(`${scope.chapterName} Unit`)
  else if (scope.level === 'district' && scope.districtName) parts.push(`${scope.districtName} District`)
  else if (scope.level === 'state' && scope.stateName) parts.push(`${scope.stateName} State`)
  else if (scope.level === 'region' && scope.regionName) parts.push(`${scope.regionName} Region`)
  else if (scope.chapterName) parts.push(`${scope.chapterName} Unit`)
  else if (scope.districtName) parts.push(`${scope.districtName} District`)
  else if (scope.stateName) parts.push(`${scope.stateName} State`)
  else if (scope.regionName) parts.push(`${scope.regionName} Region`)
  return parts.join(', ') || 'Your local Gloaro network'
}

const UNAVAILABLE_ORG_STATUSES = new Set(['inactive', 'archived', 'rejected', 'cancelled'])

function buildChapterOptions(records) {
  if (!Array.isArray(records)) return []
  const byId = new Map(records.map((record) => [String(record._id), record]))
  return records
    .filter((record) => record.type === 'chapter' && !UNAVAILABLE_ORG_STATUSES.has(record.status))
    .map((chapter) => {
      const district = chapter.parent ? byId.get(String(chapter.parent._id || chapter.parent)) : null
      const state = district?.parent ? byId.get(String(district.parent._id || district.parent)) : null
      const districtName = district?.name || ''
      const stateName = state?.name || ''
      const parts = [districtName, stateName].filter(Boolean)
      const label = parts.length ? `${chapter.name} (${parts.join(', ')})` : chapter.name
      return {
        _id: String(chapter._id),
        name: chapter.name,
        districtId: district?._id ? String(district._id) : '',
        stateId: state?._id ? String(state._id) : '',
        districtName,
        stateName,
        label,
      }
    })
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
}

export function CategoriesPage() {
  return <>
    <Seo title="Business Categories | GLOARO" description="Explore verified business categories to find products, services, and companies across the GLOARO network." canonical="/categories" />
    <div className="mx-auto max-w-7xl px-5 py-8"><ResourceListPage title="Categories" fetcher={customerApi.categories} columns={[{ key: 'name', header: 'Name' }, { key: 'type', header: 'Type' }, { key: 'description', header: 'Description' }]} /></div>
  </>
}

export function VendorsPage() {
  return <Seo title="Vendor Directory | GLOARO" description="Discover verified vendors, trusted suppliers, and professional business profiles in the GLOARO directory." canonical="/vendors" />
}

export function ProductsPage() {
  const [searchParams] = useSearchParams()
  const urlSearch = searchParams.get('search') || ''
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState(() => urlSearch)
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [categories, setCategories] = useState([])
  const { data: payload, loading, execute: fetchProducts } = useApi(
    (params) => customerApi.products(params),
    [],
    { immediate: false, initialData: {} },
  )

  useEffect(() => {
    customerApi.categories({ type: 'product', limit: 100 })
      .then((res) => {
        setCategories(res.data?.data || res.data || [])
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchProducts({ page, limit: 12, search: search || undefined, category: category || undefined, sortBy: sortBy || undefined })
      .catch(() => {})
  }, [page, search, category, sortBy, fetchProducts])

  const productsList = getList(payload)
  const pagination = getPagination(payload)

  return (
    <>
      <Seo title="Marketplace Products | GLOARO" description="Browse verified products from trusted GLOARO members and partners across the marketplace." canonical="/products" />
      <div className="mx-auto max-w-7xl px-5 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="font-playfair text-4xl font-bold text-[#0d4697]">Products</h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">Explore verified items from our trusted local partners.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search products..."
            className="h-10 w-full rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-855 outline-none focus:border-[#0d4697] sm:w-64"
          />
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1) }}
            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-855 outline-none focus:border-[#0d4697]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1) }}
            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-855 outline-none focus:border-[#0d4697]"
          >
            <option value="">Sort By</option>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0d4697]" />
        </div>
      ) : productsList.length === 0 ? (
        <EmptyState title="No products found" description="Try searching for another product or selecting a different category." />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {productsList.map((product) => {
              const discount = product.pricing?.mrp > product.pricing?.sellingPrice 
                ? Math.round(((product.pricing.mrp - product.pricing.sellingPrice) / product.pricing.mrp) * 100) 
                : 0
              return (
                <article key={product._id} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition duration-250 ease-in-out flex flex-col justify-between">
                  <div>
                    <div className="relative overflow-hidden aspect-video bg-slate-100">
                      <img 
                        src={product.images?.[0]?.url || '/logo.png'} 
                        alt={product.title} 
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-300" 
                      />
                      {discount > 0 && (
                        <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                          {discount}% OFF
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[#0d4697]">
                        {product.category?.name || 'Product'}
                      </span>
                      <h3 className="mt-1 text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-[#0d4697] transition">
                        {product.title}
                      </h3>
                      <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
                        Seller: {product.vendor?.user?.name || product.vendor?.ownerName || product.vendor?.businessName || 'Merchant'}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 p-4 pt-3 flex flex-col gap-3 mt-auto">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {product.pricing?.mrp > product.pricing?.sellingPrice && (
                          <span className="text-[10px] font-semibold text-slate-400 line-through">
                            {formatCurrency(product.pricing.mrp)}
                          </span>
                        )}
                        <span className="text-sm font-black text-slate-900">
                          {formatCurrency(product.pricing?.sellingPrice)}
                        </span>
                      </div>
                      <Link 
                        to={`/products/${product._id}`} 
                        className="text-xs font-extrabold text-[#0d4697] hover:underline"
                      >
                        View Details
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        onClick={() => toast.success('Added to Cart!')}
                        className="h-9 rounded-md border border-[#0d4697] text-xs font-extrabold text-[#0d4697] hover:bg-blue-50 transition"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => toast.success('Buy Now flow triggered!')}
                        className="h-9 rounded-md bg-[#0d4697] text-xs font-extrabold text-white hover:bg-blue-800 transition"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium text-slate-700 transition-all duration-200 hover:border-blue-600 hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-70 disabled:hover:border-slate-200 disabled:hover:bg-slate-100 disabled:hover:text-slate-400"
              >
                Previous
              </button>
              <span className="text-sm font-medium text-slate-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium text-slate-700 transition-all duration-200 hover:border-blue-600 hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-70 disabled:hover:border-slate-200 disabled:hover:bg-slate-100 disabled:hover:text-slate-400"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      </div>
    </>
  )
}

export function ServicesPage() {
  const [searchParams] = useSearchParams()
  const urlSearch = searchParams.get('search') || ''
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState(() => urlSearch)
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [categories, setCategories] = useState([])
  const [mounted, setMounted] = useState(false)
  const { data: payload, loading, execute: fetchServices } = useApi(
    (params) => customerApi.services(params),
    [],
    { immediate: false, initialData: {} },
  )

  useEffect(() => {
    customerApi.categories({ type: 'service', limit: 100 })
      .then((res) => {
        setCategories(res.data?.data || res.data || [])
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchServices({ page, limit: 12, search: search || undefined, category: category || undefined, sortBy: sortBy || undefined })
      .catch(() => {})
  }, [page, search, category, sortBy, fetchServices])

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 40)
    return () => window.clearTimeout(timer)
  }, [])

  const servicesList = getList(payload)
  const pagination = getPagination(payload)
  const featuredServices = servicesList.filter((service) => service.isFeatured).slice(0, 3)
  const totalServices = Number(pagination.total || servicesList.length || 0)
  const totalCategories = categories.length
  const averageRating = servicesList.length
    ? servicesList.reduce((sum, service) => sum + getServiceRating(service), 0) / servicesList.length
    : 0
  const activeCategoryName =
    categories.find((cat) => String(cat._id) === String(category))?.name ||
    'All services'

  return (
    <>
      <Seo title="Business Services | GLOARO" description="Explore verified business services from trusted GLOARO providers, consultants, and partners." canonical="/services" />
      <main className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,183,77,0.16),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(13,70,151,0.18),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#f5f7fb_38%,_#eef4ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute left-[-8rem] top-24 h-64 w-64 rounded-full bg-[#0d4697]/10 blur-3xl" />
      <div className="absolute right-[-6rem] top-56 h-72 w-72 rounded-full bg-[#ffb20c]/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <section
          className={`overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-all duration-700 sm:p-8 lg:p-10 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
        >
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0d4697]/15 bg-[#0d4697]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#0d4697]">
                <Sparkles className="h-3.5 w-3.5" />
                Premium B2B Services
              </div>
              <h1 className="mt-5 max-w-3xl font-playfair text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Discover polished, vendor-led services built for serious business work.
              </h1>
              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-600 sm:text-base">
                Compare verified providers, explore premium service packages, and send qualified enquiries from one refined marketplace.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  { label: `${totalServices.toLocaleString()} Services`, value: 'Marketplace ready' },
                  { label: `${totalCategories.toLocaleString()} Categories`, value: activeCategoryName },
                  { label: averageRating ? `${averageRating.toFixed(1)} Avg Rating` : 'New premium listings', value: 'Vendor quality signal' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
                    <p className="text-sm font-black text-slate-900">{item.label}</p>
                    <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {categories.slice(0, 6).map((cat) => {
                  const active = String(category) === String(cat._id)
                  return (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => { setCategory(active ? '' : cat._id); setPage(1) }}
                      className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition ${active ? 'bg-[#0d4697] text-white shadow-lg shadow-[#0d4697]/20' : 'border border-slate-200 bg-white text-slate-600 hover:border-[#0d4697]/30 hover:text-[#0d4697]'}`}
                    >
                      {cat.name}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-[#0d4697] via-[#133c7b] to-[#0f2447] opacity-95 shadow-[0_30px_80px_rgba(13,70,151,0.35)]" />
              <div className="relative overflow-hidden rounded-[2rem] p-6 text-white sm:p-7">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-white/10" />
                <div className="absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-[#ffb20c]/20 blur-2xl" />
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/70">B2B service spotlight</p>
                    <h2 className="mt-2 text-2xl font-black">Fast, credible, and enquiry ready.</h2>
                  </div>
                  <div className="rounded-2xl bg-white/15 px-3 py-2 text-right backdrop-blur">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/60">Curated</p>
                    <p className="text-lg font-black text-[#ffdf8a]">{featuredServices.length || 3}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    ['Verified vendors', 'Strong business profiles, service readiness, and professional presentation.'],
                    ['Premium discovery', 'Cleaner cards, stronger hierarchy, and faster filtering.'],
                    ['Business enquiries', 'Send structured briefs straight to the vendor inbox.'],
                  ].map(([title, description]) => (
                    <div key={title} className="rounded-2xl border border-white/10 bg-white/8 p-4">
                      <div className="flex items-start gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15">
                          <BadgeCheck className="h-5 w-5 text-[#ffdf8a]" />
                        </div>
                        <div>
                          <p className="font-black text-white">{title}</p>
                          <p className="mt-1 text-sm leading-6 text-white/75">{description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={`mt-6 rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-700 delay-100 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid flex-1 gap-3 sm:grid-cols-3">
              <label className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-[#0d4697]/30 focus-within:bg-white">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-[#0d4697]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                  placeholder="Search premium services"
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                />
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <BriefcaseBusiness className="h-4 w-4 text-slate-400" />
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setPage(1) }}
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
                >
                  <option value="">All categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setPage(1) }}
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
                >
                  <option value="">Sort by</option>
                  <option value="newest">Newest</option>
                  <option value="pricing.minPrice">Price: Low to High</option>
                  <option value="-pricing.minPrice">Price: High to Low</option>
                  <option value="title">Alphabetical</option>
                </select>
              </label>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-[#0d4697]/8 px-4 py-3 text-sm font-bold text-slate-700">
              <ShieldCheck className="h-4 w-4 text-[#0d4697]" />
              Verified marketplace listings
            </div>
          </div>
        </section>

        {loading ? (
          <div className="flex h-72 items-center justify-center">
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0d4697] border-t-transparent" />
                <p className="text-sm font-bold text-slate-600">Loading premium services...</p>
              </div>
            </div>
          </div>
        ) : servicesList.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="No services found" description="Try another keyword or category to discover more premium offerings." />
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {servicesList.map((service, index) => {  
              const vendor = service.vendor || {}
              const providerName = vendor.user?.name || vendor.ownerName || 'Gloaro vendor'
              const location = getServiceLocation(vendor)
              const accent = getServiceAccent(index)
              const rating = getServiceRating(service)
              const reviews = getServiceReviewCount(service)
              const image = service.gallery?.[0]?.url || '/logo.png'

              return (
                <article
                  key={service._id}
                  style={{ transitionDelay: `${index * 70}ms` }}
                  className={`group relative overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] transition-all duration-700 hover:-translate-y-1 hover:shadow-[0_22px_80px_rgba(15,23,42,0.15)] ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                >
                  <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accent}`} />
                  <div className="relative">
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <img
                        src={image}
                        alt={service.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent" />
                      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#0d4697]">
                          {service.category?.name || 'Service'}
                        </span>
                        {service.isFeatured && (
                          <span className="rounded-full bg-[#ffb20c] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] !text-white/65">Starting from</p>
                          <p className="mt-1 text-2xl font-black !text-white">{getServicePriceText(service)}</p>
                        </div>
                        <div className="rounded-2xl bg-white/90 px-3 py-2 text-right shadow-lg backdrop-blur">
                          <div className="flex items-center gap-1 text-sm font-black text-amber-500">
                            <Star className="h-4 w-4 fill-current" />
                            {rating ? rating.toFixed(1) : 'New'}
                          </div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            {reviews ? `${reviews} reviews` : 'No reviews yet'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-playfair text-2xl font-black leading-tight text-slate-950 transition group-hover:text-[#0d4697]">
                        {service.title}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                        {service.shortDescription || service.description}
                      </p>

                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
                          <BriefcaseBusiness className="h-4 w-4 text-[#0d4697]" />
                          {providerName}
                        </div>
                        <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
                          <MapPin className="h-4 w-4 text-[#0d4697]" />
                          {location}
                        </div>
                        {service.deliveryTime && (
                          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
                            <Clock3 className="h-4 w-4 text-[#0d4697]" />
                            {service.deliveryTime}
                          </div>
                        )}
                        {service.features?.length ? (
                          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
                            <Zap className="h-4 w-4 text-[#0d4697]" />
                            {service.features[0]}
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-5 flex gap-3">
                        <Link
                          to={`/services/${service._id}`}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0d4697] to-[#1f6fd6] px-4 py-3 text-sm font-black text-white shadow-lg shadow-[#0d4697]/20 transition hover:translate-y-[-1px]"
                        >
                          View details
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                        <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700">
                          Premium
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:border-[#0d4697]/30 hover:text-[#0d4697] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="rounded-full bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:border-[#0d4697]/30 hover:text-[#0d4697] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
      </main>
    </>
  )
}

export function DetailPage({ type }) {
  const { id } = useParams()
  const fetcher = type === 'vendors' ? customerApi.vendor : type === 'products' ? customerApi.product : customerApi.service
  const { data, loading } = useApi(() => fetcher(id), [id])
  const [relatedItems, setRelatedItems] = useState([])
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      budgetMin: '',
      budgetMax: '',
    },
  })
  const item = data

  useEffect(() => {
    if (!item) return
    const categoryId = item.category?._id || item.category
    if (categoryId) {
      const fetchRelated = type === 'products' ? customerApi.products : type === 'services' ? customerApi.services : null
      if (fetchRelated) {
        fetchRelated({ category: categoryId, limit: 5 })
          .then((res) => {
            const list = getList(res.data)
            setRelatedItems(list.filter(i => i._id !== item._id).slice(0, 4))
          })
        .catch(() => {})
      }
    }
  }, [type, item])

  useEffect(() => {
    if (type !== 'services' || !item) return
    reset({
      name: '',
      email: '',
      phone: '',
      subject: `Enquiry for ${item.title || 'service'}`,
      message: '',
      budgetMin: '',
      budgetMax: '',
    })
  }, [type, item, reset])

  if (loading) return <LoadingScreen label="Loading details..." />
  if (!item) return <EmptyState title="Not Found" />

  if (type === 'vendors') {
    return (
      <section className="mx-auto max-w-5xl px-5 py-8">
        <img src={item.logo?.url || item.coverImage?.url || '/logo.png'} alt="" className="h-72 w-full rounded-lg object-cover" />
        <h1 className="mt-5 text-4xl font-extrabold text-slate-955">{item.businessName}</h1>
        <p className="mt-3 text-lg font-medium leading-8 text-slate-600">{item.description}</p>
        <button onClick={() => customerApi.addWishlist({ itemType: 'vendor', itemId: id }).then(() => toast.success('Added to wishlist'))} className="mt-5 rounded-md bg-[#0d4697] px-5 py-2.5 font-bold text-white">Add to Wishlist</button>
        <ReviewBox vendor={id} />
      </section>
    )
  }

  const vendor = item.vendor || {}
  const providerName = vendor.user?.name || vendor.ownerName || 'Gloaro vendor'
  const businessName = vendor.businessName || 'Gloaro business'
  const addressObj = vendor.address || {}
  const fullAddress = [addressObj.street, addressObj.city, addressObj.state, addressObj.pincode].filter(Boolean).join(', ') || 'Address not listed'
  const displayPrice = type === 'products' ? item.pricing?.sellingPrice : getServiceDisplayPrice(item)
  const originalPrice = type === 'products' ? item.pricing?.mrp : null
  const discount = type === 'products' && originalPrice > displayPrice ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0

  const galleryImages = type === 'products' 
    ? (item.images || []) 
    : (item.gallery || [])

  const submitServiceEnquiry = async (values) => {
    if (!vendor?._id) {
      toast.error('Vendor details are missing for this service.')
      return
    }

    const budget = {}
    if (values.budgetMin) budget.min = Number(values.budgetMin)
    if (values.budgetMax) budget.max = Number(values.budgetMax)

    try {
      await customerApi.submitEnquiry({
        vendor: vendor._id,
        service: item._id,
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
        ...(Object.keys(budget).length ? { budget } : {}),
        source: 'service-detail',
      })
      toast.success('Your enquiry has been sent to the vendor.')
      reset({
        name: '',
        email: '',
        phone: '',
        subject: `Enquiry for ${item.title || 'service'}`,
        message: '',
        budgetMin: '',
        budgetMax: '',
      })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to send enquiry right now.')
    }
  }

  if (type === 'services') {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(13,70,151,.10),transparent_28%),#f5f8fc] py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 rounded-[28px] border border-[#0d4697]/10 bg-[linear-gradient(115deg,#082d66,#0d4697_64%,#1f6dc3)] px-6 py-7 text-white shadow-[0_20px_48px_rgba(13,70,151,.18)] sm:px-8"><p className="text-[11px] font-black uppercase tracking-[.24em] text-[#ffd36e]">Gloaro B2B Services</p><p className="mt-2 text-lg font-semibold text-white/90">Connect with verified business service providers.</p></div>
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1.65fr)_minmax(310px,.75fr)]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-3 shadow-[0_14px_40px_rgba(15,23,42,.08)]">
              <div className="grid gap-3 sm:grid-cols-2">
                {galleryImages.length ? (
                  galleryImages.map((img, idx) => (
                    <img key={idx} src={img.url} alt="" className="h-[240px] w-full rounded-[20px] bg-slate-50 object-contain p-4 sm:h-[300px]" />
                  ))
                ) : (
                  <img src="/logo.png" alt="" className="h-[240px] w-full rounded-[20px] bg-slate-50 object-contain p-6 sm:col-span-2 sm:h-[300px]" />
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,.07)] sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-[#0d4697]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.16em] text-[#0d4697]">
                  {item.category?.name || 'Service'}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Service ID: {item.serviceId || item._id}</span>
              </div>
              <h1 className="mt-5 font-playfair text-4xl font-black leading-tight text-[#082d66] sm:text-5xl">{item.title}</h1>
              <div className="mt-5 border-l-4 border-[#ffae13] pl-4"><p className="text-base leading-8 text-slate-600 whitespace-pre-line">{item.description}</p></div>
            </div>

            {relatedItems.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-extrabold text-[#082d66]">Related Services</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {relatedItems.map((rel) => (
                    <Link key={rel._id} to={`/services/${rel._id}`} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0d4697]/30 hover:shadow-md">
                      <img src={rel.gallery?.[0]?.url || '/logo.png'} alt="" className="h-16 w-16 rounded-xl bg-slate-50 object-contain p-1" />
                      <div>
                        <p className="line-clamp-1 text-sm font-bold text-slate-800">{rel.title}</p>
                        <p className="mt-0.5 text-xs font-semibold text-slate-500">{getServicePriceText(rel)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="order-2 rounded-[28px] border border-[#0d4697]/10 bg-[linear-gradient(145deg,#fff,#f2f7ff)] p-6 shadow-[0_14px_40px_rgba(15,23,42,.08)]">
              <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#0d4697]">Starting Price</p>
              <p className="mt-2 font-playfair text-5xl font-black text-[#082d66]">{getServicePriceText(item)}</p>
              <p className="mt-3 border-t border-[#0d4697]/10 pt-3 text-sm font-medium leading-6 text-slate-600">Send a detailed enquiry directly to the vendor.</p>
            </div>

            <form onSubmit={handleSubmit(submitServiceEnquiry)} className="order-1 overflow-hidden rounded-[28px] border border-[#0d4697]/15 bg-white shadow-[0_18px_45px_rgba(13,70,151,.14)]">
              <div className="bg-[linear-gradient(120deg,#082d66,#0d4697)] px-6 py-5 text-white"><p className="text-[10px] font-black uppercase tracking-[.2em] text-[#ffd36e]">Quick enquiry</p><h2 className="mt-1 text-2xl font-extrabold text-white">Request this service</h2><p className="mt-1 text-sm font-medium text-blue-100">Your enquiry goes directly to {businessName}.</p></div>

              <div className="p-6 sm:p-7">
                <div className="mb-6 grid grid-cols-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-center text-[10px] font-black uppercase tracking-[.12em] text-slate-400">
                  <div className="border-r border-slate-200 px-2 py-3 text-[#0d4697]"><span className="mr-1 inline-grid h-5 w-5 place-items-center rounded-full bg-[#0d4697] text-white">1</span> Your details</div>
                  <div className="border-r border-slate-200 px-2 py-3"><span className="mr-1 inline-grid h-5 w-5 place-items-center rounded-full bg-white ring-1 ring-slate-200">2</span> Requirements</div>
                  <div className="px-2 py-3"><span className="mr-1 inline-grid h-5 w-5 place-items-center rounded-full bg-white ring-1 ring-slate-200">3</span> Send</div>
                </div>
              <div className="grid gap-4">
                <FormField label="Full Name" error={errors.name?.message}>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#0d4697] focus:bg-white focus:ring-4 focus:ring-[#0d4697]/10"
                    placeholder="Your name"
                  />
                </FormField>

                <FormField label="Email" error={errors.email?.message}>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
                    })}
                    type="email"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#0d4697] focus:bg-white focus:ring-4 focus:ring-[#0d4697]/10"
                    placeholder="you@example.com"
                  />
                </FormField>

                <FormField label="Phone" error={errors.phone?.message}>
                  <input
                    {...register('phone', { required: 'Phone number is required' })}
                    type="tel"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#0d4697] focus:bg-white focus:ring-4 focus:ring-[#0d4697]/10"
                    placeholder="Phone number"
                  />
                </FormField>

                <FormField label="Subject" error={errors.subject?.message}>
                  <input
                    {...register('subject', { required: 'Subject is required' })}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#0d4697] focus:bg-white focus:ring-4 focus:ring-[#0d4697]/10"
                    placeholder="What do you need?"
                  />
                </FormField>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Budget Min">
                    <input
                      {...register('budgetMin')}
                      type="number"
                      min="0"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#0d4697] focus:bg-white focus:ring-4 focus:ring-[#0d4697]/10"
                      placeholder="Optional"
                    />
                  </FormField>
                  <FormField label="Budget Max">
                    <input
                      {...register('budgetMax')}
                      type="number"
                      min="0"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#0d4697] focus:bg-white focus:ring-4 focus:ring-[#0d4697]/10"
                      placeholder="Optional"
                    />
                  </FormField>
                </div>

                <FormField label="Message" error={errors.message?.message}>
                  <textarea
                    {...register('message', {
                      required: 'Message is required',
                      minLength: { value: 10, message: 'Message should be at least 10 characters' },
                    })}
                    rows={6}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#0d4697] focus:bg-white focus:ring-4 focus:ring-[#0d4697]/10"
                    placeholder="Tell the vendor what you need..."
                  />
                </FormField>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 rounded-xl bg-[linear-gradient(135deg,#ffae13,#ffcb55)] px-4 text-sm font-extrabold text-[#082d66] shadow-[0_10px_20px_rgba(255,174,19,.22)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_26px_rgba(255,174,19,.30)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending Enquiry...' : 'Submit Enquiry'}
                </button>
                <p className="text-center text-xs font-medium leading-5 text-slate-400">Your enquiry is shared securely with the selected provider only.</p>
              </div>
              </div>
            </form>

            <div className="order-3 rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,.08)] space-y-4">
              <div className="flex items-center gap-3">
                <img src={vendor.logo?.url || '/logo.png'} alt="" className="h-14 w-14 rounded-2xl border border-slate-200 bg-slate-50 object-contain p-1" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{businessName}</h3>
                  <Link to={`/vendors/${vendor._id}`} className="text-xs font-extrabold text-[#0d4697] hover:underline">
                    View Vendor Profile
                  </Link>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-3 text-xs font-semibold text-slate-650">
                <p><span className="text-slate-400">Owner:</span> {providerName}</p>
                {vendor.phone && <p><span className="text-slate-400">📞 Phone:</span> <a href={`tel:${vendor.phone}`} className="hover:underline">{vendor.phone}</a></p>}
                {vendor.email && <p><span className="text-slate-400">✉ Email:</span> <a href={`mailto:${vendor.email}`} className="hover:underline">{vendor.email}</a></p>}
                <p><span className="text-slate-400">📍 Address:</span> {fullAddress}</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-slate-50 min-h-screen">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Info Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <div className="grid gap-2 sm:grid-cols-2">
              {galleryImages.length ? (
                galleryImages.map((img, idx) => (
                  <img key={idx} src={img.url} alt="" className="h-60 w-full rounded-lg object-cover" />
                ))
              ) : (
                <img src="/logo.png" alt="" className="h-60 w-full rounded-lg object-cover sm:col-span-2" />
              )}
            </div>
          </div>

          {/* Title and Category */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-[#0d4697]/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#0d4697]">
                {item.category?.name || (type === 'products' ? 'Product' : 'Service')}
              </span>
              <span className="text-sm font-bold text-slate-400">ID: {item.productId || item.serviceId}</span>
            </div>
            <h1 className="mt-3 font-playfair text-3xl font-black text-slate-900">{item.title}</h1>
            <p className="mt-4 text-slate-700 leading-relaxed whitespace-pre-line">{item.description}</p>
          </div>

          {/* Related Items */}
          {relatedItems.length > 0 && (
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-4">Related {type === 'products' ? 'Products' : 'Services'}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {relatedItems.map((rel) => (
                  <Link key={rel._id} to={`/${type}/${rel._id}`} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 hover:shadow transition">
                    <img src={(type === 'products' ? rel.images?.[0]?.url : rel.gallery?.[0]?.url) || '/logo.png'} alt="" className="h-16 w-16 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-bold text-slate-800 line-clamp-1">{rel.title}</p>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        {type === 'products' ? formatCurrency(rel.pricing?.sellingPrice) : getServicePriceText(rel)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Vendor Details Sidebar */}
        <div className="space-y-6">
          {/* Price box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
              {type === 'products' ? 'Price' : 'Starting Price'}
            </p>
            {discount > 0 && (
              <p className="text-sm font-semibold text-slate-400 line-through">
                {formatCurrency(originalPrice)}
              </p>
            )}
            <p className="mt-2 text-4xl font-black text-slate-900">
              {formatCurrency(displayPrice)}
              {discount > 0 && <span className="ml-2 text-xs text-green-600 font-extrabold">({discount}% OFF)</span>}
            </p>
            <button 
              onClick={() => customerApi.addWishlist({ itemType: type.slice(0, -1), itemId: id }).then(() => toast.success('Added to wishlist'))} 
              className="mt-6 w-full rounded-xl bg-[#0d4697] py-3 text-sm font-extrabold text-white hover:bg-blue-800 transition"
            >
              Add to Wishlist
            </button>
          </div>

          {/* Vendor Box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <img src={vendor.logo?.url || '/logo.png'} alt="" className="h-12 w-12 rounded-full border object-cover" />
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{businessName}</h3>
                <Link to={`/vendors/${vendor._id}`} className="text-xs font-extrabold text-[#0d4697] hover:underline">
                  View Vendor Profile
                </Link>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3 text-xs font-semibold text-slate-650">
              <p><span className="text-slate-400">Owner:</span> {providerName}</p>
              {vendor.phone && <p><span className="text-slate-400">📞 Phone:</span> <a href={`tel:${vendor.phone}`} className="hover:underline">{vendor.phone}</a></p>}
              {vendor.email && <p><span className="text-slate-400">✉ Email:</span> <a href={`mailto:${vendor.email}`} className="hover:underline">{vendor.email}</a></p>}
              <p><span className="text-slate-400">📍 Address:</span> {fullAddress}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )}

function ReviewBox({ vendor }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [submitting, setSubmitting] = useState(false)
  const onSubmit = async (values) => {
    setSubmitting(true)
    try {
      await customerApi.createReview({ ...values, vendor, rating: Number(values.rating) })
      toast.success('Review submitted')
      reset()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to submit review')
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-extrabold">Write a Review</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <FormField label="Rating"><input {...register('rating', { required: 'Rating is required', min: { value: 1, message: 'Rating must be at least 1' }, max: { value: 5, message: 'Rating must be at most 5' } })} type="number" min="1" max="5" step="1" className="h-10 w-full rounded-md border px-3" /></FormField>
        <FormField label="Title"><input {...register('title')} className="h-10 w-full rounded-md border px-3" /></FormField>
        <FormField label="Comment"><input {...register('comment', { required: 'Comment is required', minLength: { value: 10, message: 'Comment must be at least 10 characters' } })} className="h-10 w-full rounded-md border px-3" /></FormField>
      </div>
      <div className="mt-3 space-y-1 text-xs font-semibold text-rose-600">
        {errors.rating && <p>{errors.rating.message}</p>}
        {errors.comment && <p>{errors.comment.message}</p>}
      </div>
      <button type="submit" disabled={submitting} className="mt-4 rounded-md bg-[#0d4697] px-4 py-2 font-bold text-white disabled:opacity-60">{submitting ? 'Submitting...' : 'Submit Review'}</button>
    </form>
  )
}

export function WishlistPage() {
  return <ResourceListPage title="Wishlist" fetcher={customerApi.wishlist} columns={[{ key: 'itemType', header: 'Type' }, { key: 'name', header: 'Item', render: (row) => row.vendor?.businessName || row.product?.title || row.service?.title }, { key: 'createdAt', header: 'Added', render: (row) => formatDate(row.createdAt) }]} />
}

export function ReferralPage() {
  const code = useApi(customerApi.referralCode)
  const stats = useApi(customerApi.referralStats)
  return (
    <section className="space-y-5">
      <h1 className="text-3xl font-extrabold">Connect</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-sm font-bold text-slate-500">Your referral code</p>
        <p className="mt-2 text-3xl font-extrabold text-[#0d4697]">{code.data?.referralCode || code.data?.code || 'Loading'}</p>
      </div>
      <pre className="rounded-lg bg-slate-950 p-5 text-sm text-white">{JSON.stringify(stats.data, null, 2)}</pre>
    </section>
  )
}

export function EventsPage() {
  return <>
    <Seo title="Business Events | GLOARO" description="Discover networking events, workshops, and community meetups hosted across the GLOARO ecosystem." canonical="/events" />
    <ResourceListPage title="Events" fetcher={(params) => customerApi.events({ ...params, upcoming: true })} columns={[{ key: 'title', header: 'Event' }, { key: 'type', header: 'Type' }, { key: 'startDate', header: 'Starts', render: (row) => formatDate(row.startDate) }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> }]} />
  </>
}

export function CustomerNotificationsPage() { return <NotificationsPage /> }
export function CustomerProfilePage() { return <ProfilePage /> }

export function CustomerSupportPage() {
  return <ResourceListPage title="Support" fetcher={customerApi.support} createAction={customerApi.createTicket} columns={[{ key: 'ticketNumber', header: 'Ticket' }, { key: 'subject', header: 'Subject' }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> }]} renderForm={(props) => <SimpleJsonForm {...props} fields={[{ name: 'subject' }, { name: 'description', type: 'textarea' }, { name: 'category' }, { name: 'priority', type: 'select', options: ['low', 'medium', 'high', 'critical'].map((value) => ({ value, label: value })) }]} />} />
}

export function ReviewsPage() {
  return <>
    <Seo title="Business Reviews | GLOARO" description="Read verified reviews and reputation signals for vendors and products across the GLOARO marketplace." canonical="/reviews" />
    <div className="rounded-lg border border-slate-200 bg-white p-5"><h1 className="text-2xl font-extrabold">Reviews</h1><p className="mt-2 font-semibold text-slate-500">Open a vendor detail page to view and submit vendor reviews.</p></div>
  </>
}
