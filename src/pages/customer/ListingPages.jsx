import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
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
import StatusBadge from '../../components/common/StatusBadge'
import FormField from '../../components/forms/FormField'
import { useApi } from '../../hooks/useApi'
import { formatCurrency, formatDate, getList, getPagination } from '../../utils/format'
import ResourceListPage from '../shared/ResourceListPage'
import NotificationsPage from '../shared/NotificationsPage'
import ProfilePage from '../shared/ProfilePage'
import SimpleJsonForm from '../shared/SimpleJsonForm'

function CardGrid({ items, type }) {
  if (!items?.length) return <EmptyState />
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
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
      ))}
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
  const [location, setLocation] = useState(null)
  const [permissionStatus, setPermissionStatus] = useState('idle')
  const [locationError, setLocationError] = useState('')
  const [activeTab, setActiveTab] = useState('services')
  const [filters, setFilters] = useState({ radius: 10, category: '', rating: '', openNow: false, search: '', minPrice: '', maxPrice: '', sort: 'nearest' })
  const { data: businessesData, loading: businessesLoading, execute: executeBusinesses } = useApi((params) => customerApi.nearbyBusinesses(params), [], { immediate: false, initialData: [] })
  const { data: productsData, loading: productsLoading, execute: executeProducts } = useApi((params) => customerApi.nearbyProducts(params), [], { immediate: false, initialData: [] })
  const { data: servicesData, loading: servicesLoading, execute: executeServices } = useApi((params) => customerApi.nearbyServices(params), [], { immediate: false, initialData: [] })
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
        setLocationError('Location access is required to discover nearby businesses and services.')
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    )
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(requestLocation, 0)
    return () => window.clearTimeout(timer)
  }, [requestLocation])

  useEffect(() => {
    if (!location) return
    const params = {
      latitude: location.lat,
      longitude: location.lng,
      lat: location.lat,
      lng: location.lng,
      radius: filters.radius,
      category: filters.category || undefined,
      rating: filters.rating || undefined,
      search: filters.search || undefined,
      openNow: filters.openNow,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      sort: filters.sort,
      limit: 50,
    }
    executeBusinesses(params)
    executeProducts(params)
    executeServices(params)
  }, [location, filters, executeBusinesses, executeProducts, executeServices])

  const businesses = useMemo(() => getList(businessesData).map((item) => normalizeNearbyItem(item, 'business', location)), [businessesData, location])
  const products = useMemo(() => getList(productsData).map((item) => normalizeNearbyItem(item, 'product', location)), [productsData, location])
  const services = useMemo(() => getList(servicesData).map((item) => normalizeNearbyItem(item, 'service', location)), [servicesData, location])
  const activeItems = activeTab === 'services' ? services : activeTab === 'products' ? products : businesses
  const activeLoading = activeTab === 'services' ? servicesLoading : activeTab === 'products' ? productsLoading : businessesLoading
  const mapItems = [...services, ...products, ...businesses]

  const categoryOptions = getList(categories.data)

  return (
    <section className="bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-lg bg-[#0d4697] px-5 py-6 text-white sm:px-7">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ffb20c]">Near Me</p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Local Marketplace Around You</h1>
          <p className="mt-2 max-w-2xl text-sm font-semibold text-blue-50 sm:text-base">Allow location access and Gloaro will automatically find nearby services, products, and businesses within your selected radius.</p>
          {location && <p className="mt-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white">Location detected with {Math.round(location.accuracy)}m accuracy</p>}
        </div>

        {permissionStatus === 'requesting' && <div className="mt-8 rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm"><LoadingSpinner /><p className="mt-4 font-bold text-slate-700">Waiting for location permission...</p></div>}

        {(permissionStatus === 'denied' || permissionStatus === 'unsupported') && (
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-6 text-center shadow-sm">
            <h2 className="text-xl font-extrabold text-slate-950">Enable location to continue</h2>
            <p className="mx-auto mt-2 max-w-xl font-semibold text-slate-700">{locationError || 'Location access is required to discover nearby businesses and services.'}</p>
            <button type="button" onClick={requestLocation} className="mt-5 rounded-md bg-[#0d4697] px-5 py-2.5 font-bold text-white">Enable Location</button>
          </div>
        )}

        {location && (
          <>
            <NearbyFilters filters={filters} setFilters={setFilters} categories={categoryOptions} />
            <NearbyMap location={location} items={mapItems} />

            <div className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="grid grid-cols-3 border-b border-slate-200">
                {[
                  ['services', `Services (${services.length})`],
                  ['products', `Products (${products.length})`],
                  ['businesses', `Businesses (${businesses.length})`],
                ].map(([key, label]) => <button key={key} type="button" onClick={() => setActiveTab(key)} className={`px-3 py-4 text-sm font-extrabold sm:text-base ${activeTab === key ? 'border-b-4 border-[#0d4697] text-[#0d4697]' : 'text-slate-500'}`}>{label}</button>)}
              </div>

              <div className="p-4 sm:p-5">
                {activeLoading ? <LoadingSpinner /> : <NearbyResultsGrid type={activeTab} items={activeItems} />}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function NearbyFilters({ filters, setFilters, categories }) {
  const radiusOptions = [2, 5, 10, 25]
  return (
    <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <label className="block text-sm font-bold text-slate-700">
        Search nearby
        <input value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} placeholder="plumber, grocery, laptop, hospital..." className="mt-1 h-11 w-full rounded-md border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-[#0d4697]" />
      </label>
      <div className="flex flex-wrap gap-2">
        {radiusOptions.map((radius) => <button key={radius} type="button" onClick={() => setFilters((current) => ({ ...current, radius }))} className={`rounded-full px-4 py-2 text-sm font-extrabold ${filters.radius === radius ? 'bg-[#0d4697] text-white' : 'bg-slate-100 text-slate-700'}`}>Within {radius} km</button>)}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
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

function NearbyMap({ location, items }) {
  const [selectedItem, setSelectedItem] = useState(null)
  const visibleItems = items.filter((item) => getItemCoordinates(item))

  return (
    <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 className="text-lg font-extrabold text-slate-950">Map View</h2>
        <a href={getDirectionsUrl(location)} target="_blank" rel="noreferrer" className="text-sm font-extrabold text-[#0d4697]">Open in Maps</a>
      </div>
      <div className="relative h-[360px] overflow-hidden bg-[#dbeafe] sm:h-[430px]">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.55)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.55)_1px,transparent_1px)] bg-[size:44px_44px]" />
        <div className="absolute left-1/2 top-1/2 z-20 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-white bg-[#0d4697] text-xs font-black text-white shadow-xl">YOU</div>
        {visibleItems.map((item, index) => {
          const position = getMarkerPosition(location, item, index)
          return (
            <button key={`${item.type}-${item._id || item.id}`} type="button" onClick={() => setSelectedItem(item)} className={`absolute z-10 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white text-xs font-black text-white shadow-lg ${item.type === 'service' ? 'bg-[#0d4697]' : item.type === 'product' ? 'bg-[#16a34a]' : 'bg-[#ff8a00]'}`} style={{ left: `${position.left}%`, top: `${position.top}%` }} aria-label={`Open ${item.name}`}>
              {item.type === 'service' ? 'S' : item.type === 'product' ? 'P' : 'B'}
            </button>
          )
        })}
        {selectedItem && <MapPopup item={selectedItem} location={location} onClose={() => setSelectedItem(null)} />}
      </div>
    </section>
  )
}

function MapPopup({ item, location, onClose }) {
  return (
    <div className="absolute bottom-4 left-4 right-4 z-30 rounded-lg bg-white p-4 shadow-2xl sm:left-auto sm:w-80">
      <button type="button" onClick={onClose} className="absolute right-3 top-2 text-lg font-bold text-slate-400">x</button>
      <img src={item.image} alt="" className="mb-3 h-24 w-full rounded-md object-cover" />
      <h3 className="pr-6 text-lg font-extrabold text-slate-950">{item.name}</h3>
      <p className="mt-1 text-sm font-semibold text-slate-500">{formatDistance(item.distanceKm)} • {formatRating(item.rating)}</p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-extrabold">
        <a href={getCallHref(item)} className="rounded-md bg-slate-100 px-2 py-2 text-slate-800">Call</a>
        <Link to={item.detailUrl} className="rounded-md bg-[#0d4697] px-2 py-2 text-white">View</Link>
        <a href={getDirectionsUrl(location, item)} target="_blank" rel="noreferrer" className="rounded-md bg-[#ffb20c] px-2 py-2 text-[#0d4697]">Directions</a>
      </div>
    </div>
  )
}

function NearbyResultsGrid({ type, items }) {
  if (!items.length) return <EmptyState title={`No nearby ${type} found`} description="Try increasing the distance or changing filters." />
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => type === 'services'
        ? <NearbyServiceCard key={item._id || item.id} item={item} />
        : type === 'products'
          ? <NearbyProductCard key={item._id || item.id} item={item} />
          : <NearbyBusinessCard key={item._id || item.id} item={item} />)}
    </div>
  )
}

function NearbyServiceCard({ item }) {
  return (
    <NearbyCardShell item={item} primaryAction="Book / Enquire">
      <p className="mt-2 text-sm font-semibold text-slate-500">Provider: {item.providerName}</p>
      <p className="mt-1 text-sm font-bold text-slate-800">Starting {formatCurrency(item.price)}</p>
    </NearbyCardShell>
  )
}

function NearbyProductCard({ item }) {
  const discount = item.mrp > item.price ? Math.round(((item.mrp - item.price) / item.mrp) * 100) : 0
  return (
    <NearbyCardShell item={item} primaryAction="Add to Wishlist">
      <p className="mt-2 text-sm font-semibold text-slate-500">Seller: {item.providerName}</p>
      <p className="mt-1 text-sm font-bold text-slate-800">{formatCurrency(item.price)} {discount > 0 && <span className="text-green-700">({discount}% off)</span>}</p>
      <StatusBadge value={item.inStock ? 'in stock' : 'out of stock'} />
      <button type="button" onClick={() => toast.success('Enquiry option ready')} className="mt-3 w-full rounded-md border border-[#0d4697] px-3 py-2 text-sm font-extrabold text-[#0d4697]">Enquire Now</button>
    </NearbyCardShell>
  )
}

function NearbyBusinessCard({ item }) {
  return (
    <NearbyCardShell item={item} primaryAction="View Profile">
      <p className="mt-2 text-sm font-semibold text-slate-500">{item.address}</p>
      <p className="mt-1 text-sm font-bold text-slate-800">Hours: {item.hours}</p>
      {item.website && <a href={item.website} target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm font-extrabold text-[#0d4697]">Website</a>}
    </NearbyCardShell>
  )
}

function NearbyCardShell({ item, primaryAction, children }) {
  const phone = item.phone || ''
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <img src={item.image} alt="" className="h-44 w-full object-cover" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-slate-950">{item.name}</h3>
            <p className="mt-1 text-sm font-bold text-[#0d4697]">{item.category}</p>
          </div>
          <StatusBadge value={item.openNow ? 'open' : 'closed'} />
        </div>
        {children}
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-extrabold text-slate-700">
          <span className="rounded-full bg-slate-100 px-3 py-1">{formatRating(item.rating)}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">{formatDistance(item.distanceKm)}</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-center text-sm font-extrabold sm:grid-cols-3">
          <a href={getCallHref(item)} className={`rounded-md px-3 py-2 ${phone ? 'bg-slate-100 text-slate-900' : 'pointer-events-none bg-slate-50 text-slate-400'}`}>Call</a>
          <a href={getWhatsAppHref(item)} target="_blank" rel="noreferrer" className={`rounded-md px-3 py-2 ${phone ? 'bg-green-50 text-green-700' : 'pointer-events-none bg-slate-50 text-slate-400'}`}>WhatsApp</a>
          <a href={getDirectionsUrl(null, item)} target="_blank" rel="noreferrer" className="rounded-md bg-[#ffb20c] px-3 py-2 text-[#0d4697]">Directions</a>
          <Link to={item.detailUrl} className="rounded-md bg-[#0d4697] px-3 py-2 text-white">View Details</Link>
          <button type="button" onClick={() => handleNearbyAction(item)} className="rounded-md bg-slate-900 px-3 py-2 text-white sm:col-span-2">{primaryAction}</button>
        </div>
      </div>
    </article>
  )
}

function handleNearbyAction(item) {
  if (item.type === 'product') {
    customerApi.addWishlist({ itemType: 'product', itemId: item._id }).then(() => toast.success('Added to wishlist')).catch(() => {})
    return
  }
  toast.success('Enquiry option ready')
}

function normalizeNearbyItem(item, type, location) {
  const vendor = type === 'business' ? item : item.vendor || {}
  const distanceKm = Number.isFinite(Number(item.distanceKm)) ? Number(item.distanceKm) : getDistanceFromUser(location, vendor)
  return {
    ...item,
    type,
    name: type === 'business' ? item.businessName || item.name : item.title || item.name,
    providerName: vendor.user?.name || vendor.ownerName || vendor.businessName || item.businessName || 'Gloaro vendor',
    category: item.category?.name || item.businessCategory?.name || vendor.businessCategory?.name || 'Business',
    image: getItemImage(item, vendor, type),
    phone: vendor.phone || item.phone || '',
    website: vendor.website || item.website || '',
    address: getAddress(vendor),
    hours: getBusinessHours(vendor),
    openNow: isVendorOpenNow(vendor),
    rating: item.stats?.avgRating || vendor.stats?.avgRating || 0,
    distanceKm,
    price: type === 'service' ? getServiceDisplayPrice(item) : item.pricing?.sellingPrice,
    mrp: item.pricing?.mrp,
    inStock: item.inventory?.isUnlimited || Number(item.inventory?.quantity || 0) > 0,
    detailUrl: type === 'business' ? `/vendors/${item._id || item.id}` : `/${type}s/${item._id || item.id}`,
    location: vendor.location || item.location,
  }
}

function getItemImage(item, vendor, type) {
  if (type === 'product') return item.images?.[0]?.url || vendor.logo?.url || '/logo.png'
  if (type === 'service') return item.gallery?.[0]?.url || vendor.logo?.url || '/logo.png'
  return item.logo?.url || item.coverImage?.url || item.gallery?.[0]?.url || '/logo.png'
}

function getItemCoordinates(item) {
  const coordinates = item.location?.coordinates || item.vendor?.location?.coordinates
  if (!Array.isArray(coordinates) || coordinates.length < 2) return null
  const [lng, lat] = coordinates.map(Number)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return { lat, lng }
}

function getDistanceFromUser(location, vendor) {
  const coords = getItemCoordinates(vendor)
  if (!location || !coords) return vendor.distance || vendor.distanceKm || null
  const earthRadiusKm = 6371
  const dLat = toRadians(coords.lat - location.lat)
  const dLng = toRadians(coords.lng - location.lng)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(location.lat)) * Math.cos(toRadians(coords.lat)) * Math.sin(dLng / 2) ** 2
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function toRadians(value) {
  return (value * Math.PI) / 180
}

function formatDistance(distance) {
  if (!Number.isFinite(Number(distance))) return 'Distance unavailable'
  return `${Number(distance).toFixed(Number(distance) < 10 ? 1 : 0)} km`
}

function formatRating(value) {
  return `${Number(value || 0).toFixed(1)} rating`
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

function isVendorOpenNow(vendor) {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const today = vendor.operatingHours?.[days[new Date().getDay()]]
  if (!today) return true
  if (today.isOpen === false) return false
  if (!today.open || !today.close) return true
  const currentMinutes = new Date().getHours() * 60 + new Date().getMinutes()
  return currentMinutes >= timeToMinutes(today.open) && currentMinutes <= timeToMinutes(today.close)
}

function timeToMinutes(value) {
  const [hours = 0, minutes = 0] = String(value).split(':').map(Number)
  return hours * 60 + minutes
}

function getAddress(vendor) {
  const address = vendor.address || {}
  return [address.street, address.city, address.state, address.pincode].filter(Boolean).join(', ') || 'Address not available'
}

function getBusinessHours(vendor) {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const today = vendor.operatingHours?.[days[new Date().getDay()]]
  if (!today) return 'Hours not listed'
  if (today.isOpen === false) return 'Closed today'
  if (!today.open || !today.close) return 'Open today'
  return `${today.open} - ${today.close}`
}

function getCallHref(vendor) {
  return vendor.phone ? `tel:${vendor.phone}` : '#'
}

function getWhatsAppHref(vendor) {
  const phone = String(vendor.phone || '').replace(/\D/g, '')
  return phone ? `https://wa.me/${phone}` : '#'
}

function getDirectionsUrl(location, vendor) {
  const destination = vendor ? getItemCoordinates(vendor) : null
  const origin = location ? `${location.lat},${location.lng}` : ''
  const target = destination ? `${destination.lat},${destination.lng}` : origin
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(target)}`
}

function getMarkerPosition(location, vendor, index) {
  const coords = getItemCoordinates(vendor)
  if (!coords || !location) return { left: 50, top: 50 }
  const scale = 18
  const left = clamp(50 + (coords.lng - location.lng) * scale * 100 + ((index % 3) - 1) * 4, 8, 92)
  const top = clamp(50 - (coords.lat - location.lat) * scale * 100 + (Math.floor(index / 3) % 3 - 1) * 4, 10, 90)
  return { left, top }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export function CategoriesPage() {
  return <div className="mx-auto max-w-7xl px-5 py-8"><ResourceListPage title="Categories" fetcher={customerApi.categories} columns={[{ key: 'name', header: 'Name' }, { key: 'type', header: 'Type' }, { key: 'description', header: 'Description' }]} /></div>
}

export function VendorsPage() {
  return null
}

export function ProductsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
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
  )
}

export function ServicesPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
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
      <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-slate-50">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
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

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-[#0d4697]/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#0d4697]">
                  {item.category?.name || 'Service'}
                </span>
                <span className="text-sm font-bold text-slate-400">Service ID: {item.serviceId || item._id}</span>
              </div>
              <h1 className="mt-3 font-playfair text-3xl font-black text-slate-900">{item.title}</h1>
              <p className="mt-4 text-slate-700 leading-relaxed whitespace-pre-line">{item.description}</p>
            </div>

            {relatedItems.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-extrabold text-slate-900">Related Services</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {relatedItems.map((rel) => (
                    <Link key={rel._id} to={`/services/${rel._id}`} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 hover:shadow transition">
                      <img src={rel.gallery?.[0]?.url || '/logo.png'} alt="" className="h-16 w-16 rounded-lg object-cover" />
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

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">Starting Price</p>
              <p className="mt-2 text-4xl font-black text-slate-900">{getServicePriceText(item)}</p>
              <p className="mt-2 text-sm font-semibold text-slate-500">Send a detailed enquiry and the vendor will receive it directly in their dashboard.</p>
            </div>

            <form onSubmit={handleSubmit(submitServiceEnquiry)} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-900">Request this service</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">The enquiry goes to {businessName} and appears inside the vendor lead inbox.</p>

              <div className="mt-5 grid gap-4">
                <FormField label="Full Name" error={errors.name?.message}>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-900 outline-none focus:border-[#0d4697]"
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
                    className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-900 outline-none focus:border-[#0d4697]"
                    placeholder="you@example.com"
                  />
                </FormField>

                <FormField label="Phone" error={errors.phone?.message}>
                  <input
                    {...register('phone', { required: 'Phone number is required' })}
                    type="tel"
                    className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-900 outline-none focus:border-[#0d4697]"
                    placeholder="Phone number"
                  />
                </FormField>

                <FormField label="Subject" error={errors.subject?.message}>
                  <input
                    {...register('subject', { required: 'Subject is required' })}
                    className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-900 outline-none focus:border-[#0d4697]"
                    placeholder="What do you need?"
                  />
                </FormField>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Budget Min">
                    <input
                      {...register('budgetMin')}
                      type="number"
                      min="0"
                      className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-900 outline-none focus:border-[#0d4697]"
                      placeholder="Optional"
                    />
                  </FormField>
                  <FormField label="Budget Max">
                    <input
                      {...register('budgetMax')}
                      type="number"
                      min="0"
                      className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-900 outline-none focus:border-[#0d4697]"
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
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-[#0d4697]"
                    placeholder="Tell the vendor what you need..."
                  />
                </FormField>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 rounded-xl bg-[#0d4697] px-4 text-sm font-extrabold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending Enquiry...' : 'Submit Enquiry'}
                </button>
              </div>
            </form>

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
      <h1 className="text-3xl font-extrabold">Referral</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-sm font-bold text-slate-500">Your referral code</p>
        <p className="mt-2 text-3xl font-extrabold text-[#0d4697]">{code.data?.referralCode || code.data?.code || 'Loading'}</p>
      </div>
      <pre className="rounded-lg bg-slate-950 p-5 text-sm text-white">{JSON.stringify(stats.data, null, 2)}</pre>
    </section>
  )
}

export function EventsPage() {
  return <ResourceListPage title="Events" fetcher={(params) => customerApi.events({ ...params, upcoming: true })} columns={[{ key: 'title', header: 'Event' }, { key: 'type', header: 'Type' }, { key: 'startDate', header: 'Starts', render: (row) => formatDate(row.startDate) }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> }]} />
}

export function CustomerNotificationsPage() { return <NotificationsPage /> }
export function CustomerProfilePage() { return <ProfilePage /> }

export function CustomerSupportPage() {
  return <ResourceListPage title="Support" fetcher={customerApi.support} createAction={customerApi.createTicket} columns={[{ key: 'ticketNumber', header: 'Ticket' }, { key: 'subject', header: 'Subject' }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> }]} renderForm={(props) => <SimpleJsonForm {...props} fields={[{ name: 'subject' }, { name: 'description', type: 'textarea' }, { name: 'category' }, { name: 'priority', type: 'select', options: ['low', 'medium', 'high', 'critical'].map((value) => ({ value, label: value })) }]} />} />
}

export function ReviewsPage() {
  return <div className="rounded-lg border border-slate-200 bg-white p-5"><h1 className="text-2xl font-extrabold">Reviews</h1><p className="mt-2 font-semibold text-slate-500">Open a vendor detail page to view and submit vendor reviews.</p></div>
}
