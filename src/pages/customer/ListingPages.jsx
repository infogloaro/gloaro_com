import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
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
    price: type === 'service' ? item.pricing?.minPrice : item.pricing?.sellingPrice,
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
  return <div className="mx-auto max-w-7xl px-5 py-8"><ResourceListPage title="Vendors" fetcher={customerApi.vendors} columns={[{ key: 'businessName', header: 'Business' }, { key: 'city', header: 'City', render: (row) => row.address?.city }, { key: 'rating', header: 'Rating', render: (row) => row.stats?.avgRating || 0 }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> }]} /></div>
}

export function ProductsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [payload, setPayload] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    customerApi.categories({ type: 'product', limit: 100 })
      .then((res) => {
        setCategories(res.data?.data || res.data || [])
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    customerApi.products({ page, limit: 12, search: search || undefined, category: category || undefined })
      .then((res) => {
        setPayload(res.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [page, search, category])

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
            className="h-10 w-full rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-850 outline-none focus:border-[#0d4697] sm:w-64"
          />
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1) }}
            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-850 outline-none focus:border-[#0d4697]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
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
                      <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
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
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-10 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-755 hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm font-bold text-slate-550">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                className="h-10 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-755 hover:bg-slate-50 disabled:opacity-50"
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
  const [categories, setCategories] = useState([])
  const [payload, setPayload] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    customerApi.categories({ type: 'service', limit: 100 })
      .then((res) => {
        setCategories(res.data?.data || res.data || [])
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    customerApi.services({ page, limit: 12, search: search || undefined, category: category || undefined })
      .then((res) => {
        setPayload(res.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [page, search, category])

  const servicesList = getList(payload)
  const pagination = getPagination(payload)

  return (
    <div className="mx-auto max-w-7xl px-5 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="font-playfair text-4xl font-bold text-[#0d4697]">Services</h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">Discover premium services offered by certified professionals.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search services..."
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
        </div>
      </div>

      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0d4697]" />
        </div>
      ) : servicesList.length === 0 ? (
        <EmptyState title="No services found" description="Try searching for another service or selecting a different category." />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {servicesList.map((service) => (
              <article key={service._id} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition duration-250 ease-in-out flex flex-col justify-between">
                <div>
                  <div className="relative overflow-hidden aspect-video bg-slate-100">
                    <img 
                      src={service.gallery?.[0]?.url || '/logo.png'} 
                      alt={service.title} 
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-300" 
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
                      {service.category?.name || 'Service'}
                    </span>
                    <h3 className="mt-1 text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-[#0d4697] transition">
                      {service.title}
                    </h3>
                    <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
                      Provider: {service.vendor?.user?.name || service.vendor?.ownerName || service.vendor?.businessName || 'Professional'}
                    </p>
                  </div>
                </div>
                <div className="border-t border-slate-100 p-4 pt-3 flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-slate-400">Starting Price</span>
                    <span className="text-sm font-black text-slate-900">
                      {formatCurrency(service.pricing?.minPrice)}
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
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-10 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-755 hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm font-bold text-slate-550">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                className="h-10 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-755 hover:bg-slate-50 disabled:opacity-50"
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

export function DetailPage({ type }) {
  const { id } = useParams()
  const fetcher = type === 'vendors' ? customerApi.vendor : type === 'products' ? customerApi.product : customerApi.service
  const { data, loading } = useApi(() => fetcher(id), [id])
  const item = data
  if (loading) return <LoadingScreen label="Loading details..." />
  return (
    <section className="mx-auto max-w-5xl px-5 py-8">
      <img src={item.logo?.url || item.images?.[0]?.url || item.gallery?.[0]?.url || item.coverImage?.url || '/logo.png'} alt="" className="h-72 w-full rounded-lg object-cover" />
      <h1 className="mt-5 text-4xl font-extrabold text-slate-950">{item.businessName || item.title}</h1>
      <p className="mt-3 text-lg font-medium leading-8 text-slate-600">{item.description || item.shortDescription}</p>
      <button onClick={() => customerApi.addWishlist({ itemType: type.slice(0, -1), itemId: id }).then(() => toast.success('Added to wishlist'))} className="mt-5 rounded-md bg-[#0d4697] px-5 py-2.5 font-bold text-white">Add to Wishlist</button>
      {type === 'vendors' && <ReviewBox vendor={id} />}
    </section>
  )
}

function ReviewBox({ vendor }) {
  const { register, handleSubmit, reset } = useForm()
  const onSubmit = async (values) => {
    await customerApi.createReview({ ...values, vendor, rating: Number(values.rating) })
    toast.success('Review submitted')
    reset()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-extrabold">Write a Review</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <FormField label="Rating"><input {...register('rating', { required: true })} type="number" min="1" max="5" className="h-10 w-full rounded-md border px-3" /></FormField>
        <FormField label="Title"><input {...register('title')} className="h-10 w-full rounded-md border px-3" /></FormField>
        <FormField label="Comment"><input {...register('comment', { required: true })} className="h-10 w-full rounded-md border px-3" /></FormField>
      </div>
      <button className="mt-4 rounded-md bg-[#0d4697] px-4 py-2 font-bold text-white">Submit Review</button>
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
