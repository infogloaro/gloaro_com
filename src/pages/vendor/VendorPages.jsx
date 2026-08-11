import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { vendorApi } from '../../api/vendor'
import { customerApi } from '../../api/customer'
import StatusBadge from '../../components/common/StatusBadge'
import FormField from '../../components/forms/FormField'
import { formatCurrency, formatDate } from '../../utils/format'
import NotificationsPage from '../shared/NotificationsPage'
import ResourceListPage from '../shared/ResourceListPage'
import SimpleJsonForm from '../shared/SimpleJsonForm'
import DataTable from '../../components/tables/DataTable'
import { 
  Package, Star, ToggleLeft, ShoppingBag, BriefcaseBusiness, Heart, 
  PlusCircle, TrendingUp, ClipboardList, LayoutDashboard, Building2, 
  Users, FileText, HelpCircle, FileBarChart, CreditCard,
  Search, Filter, RefreshCw, ChevronRight, MapPin, Truck, Clock3, Banknote, ReceiptText, Copy, Eye, CircleDashed
} from 'lucide-react'

const buildApprovedCategoryOptions = (categories = [], approvedCategories = []) => {
  const approvedIds = new Set((approvedCategories || []).map((category) => String(category?._id || category || '')))
  return categories
    .filter((category) => category?.isActive !== false && approvedIds.has(String(category?._id || '')))
    .map((category) => ({ value: category._id, label: category.name }))
}

const ORDER_STATUS_OPTIONS = [
  { value: 'placed', label: 'Placed' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

const buildPickupAddressState = (vendor = {}) => {
  const pickup = vendor.shipping?.pickupAddress || {}
  const address = vendor.address || {}

  return {
    contactName: pickup.contactName || vendor.ownerName || '',
    phone: pickup.phone || vendor.phone || '',
    alternatePhone: pickup.alternatePhone || vendor.alternatePhone || '',
    email: pickup.email || vendor.email || '',
    addressLine1: pickup.addressLine1 || address.street || '',
    addressLine2: pickup.addressLine2 || '',
    landmark: pickup.landmark || '',
    city: pickup.city || address.city || '',
    state: pickup.state || address.state || '',
    country: pickup.country || address.country || 'India',
    pincode: pickup.pincode || address.pincode || '',
    gstNumber: pickup.gstNumber || vendor.gstNumber || '',
  }
}

export function VendorProfilePage() {
  const [vendor, setVendor] = useState(null)
  const [pickupForm, setPickupForm] = useState(buildPickupAddressState())
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [clearingProfile, setClearingProfile] = useState(false)

  useEffect(() => {
    let alive = true

    const loadVendor = async () => {
      setLoadingProfile(true)
      try {
        const response = await vendorApi.profile()
        const vendorData = response.data?.data || response.data || null
        if (!alive) return
        setVendor(vendorData)
        setPickupForm(buildPickupAddressState(vendorData || {}))
      } catch (error) {
        if (!alive) return
        if (error.response?.status === 404) {
          setVendor(null)
          setPickupForm(buildPickupAddressState())
        } else {
          toast.error(error.response?.data?.message || 'Failed to load vendor profile')
        }
      } finally {
        if (alive) setLoadingProfile(false)
      }
    }

    loadVendor()

    return () => {
      alive = false
    }
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setPickupForm((current) => ({ ...current, [name]: value }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    const vendorId = vendor?._id || vendor?.id
    if (!vendorId) {
      toast.error('Vendor profile is not available yet')
      return
    }

    setSavingProfile(true)
    try {
      const payload = {
        shipping: {
          pickupAddress: {
            contactName: pickupForm.contactName,
            phone: pickupForm.phone,
            alternatePhone: pickupForm.alternatePhone,
            email: pickupForm.email,
            addressLine1: pickupForm.addressLine1,
            addressLine2: pickupForm.addressLine2,
            landmark: pickupForm.landmark,
            city: pickupForm.city,
            state: pickupForm.state,
            country: pickupForm.country || 'India',
            pincode: pickupForm.pincode,
            gstNumber: pickupForm.gstNumber,
          },
        },
      }

      const response = await vendorApi.updateProfile(vendorId, payload)
      const updatedVendor = response.data?.data || response.data || vendor
      setVendor(updatedVendor)
      setPickupForm(buildPickupAddressState(updatedVendor))
      toast.success('Pickup location saved')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save pickup location')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleClear = async () => {
    const vendorId = vendor?._id || vendor?.id
    if (!vendorId) {
      toast.error('Vendor profile is not available yet')
      return
    }

    setClearingProfile(true)
    try {
      const response = await vendorApi.updateProfile(vendorId, {
        shipping: {
          pickupAddress: null,
        },
      })
      const updatedVendor = response.data?.data || response.data || vendor
      setVendor(updatedVendor)
      setPickupForm(buildPickupAddressState(updatedVendor))
      toast.success('Pickup location removed')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove pickup location')
    } finally {
      setClearingProfile(false)
    }
  }

  const pickupStatus = vendor?.shipping?.shiprocketPickupStatus || 'NOT_CONFIGURED'
  const pickupLocation = vendor?.shipping?.shiprocketPickupLocation || 'Not generated yet'
  const pickupApproved = vendor?.shipping?.shiprocketPickupApproved

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_1.2fr]">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Vendor Profile</p>
            <h2 className="mt-1 text-2xl font-black text-slate-900">Pickup Location Setup</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Update the address Shiprocket will use as your pickup location. This also appears in your vendor dashboard.
            </p>
          </div>
          <StatusBadge value={vendor?.status || 'pending'} />
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Business Snapshot</p>
          <div className="mt-3 space-y-2">
            <div>
              <p className="text-sm font-black text-slate-900">{vendor?.businessName || 'Vendor business'}</p>
              <p className="text-xs font-semibold text-slate-500">{vendor?.ownerName || 'Owner name not available'}</p>
            </div>
            <div className="grid gap-2 text-xs font-semibold text-slate-600">
              <p><span className="font-black text-slate-800">Email:</span> {vendor?.email || '-'}</p>
              <p><span className="font-black text-slate-800">Phone:</span> {vendor?.phone || '-'}</p>
              <p><span className="font-black text-slate-800">GST:</span> {vendor?.gstNumber || '-'}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-left">
          <div className="flex items-center gap-2 text-[#0d4697]">
            <Truck className="h-4 w-4" />
            <p className="text-xs font-black uppercase tracking-[0.2em]">Shiprocket Pickup</p>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-700">
            <span className="font-black text-slate-900">Location:</span> {pickupLocation}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            <span className="font-black text-slate-900">Status:</span> {pickupStatus}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            <span className="font-black text-slate-900">Shiprocket sync:</span> {pickupApproved ? 'Approved & registered' : 'Auto-registered on next order'}
          </p>
          <p className="mt-3 text-xs font-semibold text-slate-500">
            Your pickup location is registered with Shiprocket automatically when your next order ships. Updating the pickup address will re-register it on the following order.
          </p>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Current Address</p>
          <p className="mt-2 text-sm font-semibold text-slate-700">
            {[
              vendor?.shipping?.pickupAddress?.addressLine1,
              vendor?.shipping?.pickupAddress?.addressLine2,
              vendor?.shipping?.pickupAddress?.landmark,
              vendor?.shipping?.pickupAddress?.city,
              vendor?.shipping?.pickupAddress?.state,
              vendor?.shipping?.pickupAddress?.pincode,
            ].filter(Boolean).join(', ') || 'No pickup address saved yet'}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-slate-900">Edit Pickup Address</h3>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Use the address below as your vendor pickup location for orders, cancellations, and returns.
            </p>
          </div>
          {loadingProfile && <p className="text-xs font-black uppercase tracking-wider text-slate-400">Loading</p>}
        </div>

        <form onSubmit={handleSave} className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Contact Name">
              <input name="contactName" value={pickupForm.contactName} onChange={handleChange} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#0d4697]" />
            </FormField>
            <FormField label="Phone">
              <input name="phone" value={pickupForm.phone} onChange={handleChange} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#0d4697]" />
            </FormField>
            <FormField label="Alternate Phone">
              <input name="alternatePhone" value={pickupForm.alternatePhone} onChange={handleChange} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#0d4697]" />
            </FormField>
            <FormField label="Email">
              <input name="email" type="email" value={pickupForm.email} onChange={handleChange} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#0d4697]" />
            </FormField>
          </div>

          <FormField label="Address Line 1">
            <input name="addressLine1" value={pickupForm.addressLine1} onChange={handleChange} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#0d4697]" />
          </FormField>

          <FormField label="Address Line 2">
            <input name="addressLine2" value={pickupForm.addressLine2} onChange={handleChange} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#0d4697]" />
          </FormField>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Landmark">
              <input name="landmark" value={pickupForm.landmark} onChange={handleChange} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#0d4697]" />
            </FormField>
            <FormField label="GST Number">
              <input name="gstNumber" value={pickupForm.gstNumber} onChange={handleChange} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#0d4697]" />
            </FormField>
            <FormField label="City">
              <input name="city" value={pickupForm.city} onChange={handleChange} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#0d4697]" />
            </FormField>
            <FormField label="State">
              <input name="state" value={pickupForm.state} onChange={handleChange} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#0d4697]" />
            </FormField>
            <FormField label="Country">
              <input name="country" value={pickupForm.country} onChange={handleChange} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#0d4697]" />
            </FormField>
            <FormField label="Pincode">
              <input name="pincode" value={pickupForm.pincode} onChange={handleChange} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#0d4697]" />
            </FormField>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">Important</p>
            <p className="mt-2 text-sm font-semibold text-amber-900">
              Saving changes will update your Shiprocket pickup location and may reset approval to pending until verified again.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={savingProfile || loadingProfile}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0d4697] px-5 py-3 text-sm font-black text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingProfile ? 'Saving...' : 'Save Pickup Location'}
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={clearingProfile || savingProfile || loadingProfile}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-black text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {clearingProfile ? 'Removing...' : 'Remove Pickup Location'}
            </button>
            <p className="text-xs font-semibold text-slate-500">
              This address is used for vendor dashboard pickup display and shipping operations.
            </p>
          </div>
        </form>
      </section>
    </div>
  )
}

export function VendorProductsPage() {
  const [activeTab, setActiveTab] = useState('inventory')
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setLoading(true)
    Promise.all([
      vendorApi.profile(),
      api.get('/categories?type=product&isActive=true'),
      vendorApi.products()
    ]).then(([profileRes, catRes, prodRes]) => {
      const vendorProfile = profileRes.data?.data || profileRes.data || {}
      const catList = catRes.data?.data || catRes.data || []
      setCategories(buildApprovedCategoryOptions(catList, vendorProfile.approvedCategories || []))
      setProducts(prodRes.data?.data || prodRes.data || [])
    }).catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleCreateProduct = async (data) => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description || '')
    formData.append('category', data.category)
    formData.append('pricing[mrp]', data.pricing?.mrp)
    formData.append('pricing[sellingPrice]', data.pricing?.sellingPrice)
    formData.append('pricing[taxPercent]', data.pricing?.taxPercent ?? 12)
    formData.append('shippingInfo[shippingCharge]', data.shippingInfo?.shippingCharge ?? 0)
    formData.append('inventory[quantity]', data.inventory?.quantity ?? 0)
    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        if (data.images[i] instanceof File) formData.append('images', data.images[i])
      }
    }
    await vendorApi.createProduct(formData)
    toast.success('Product created')
    setActiveTab('inventory')
    vendorApi.products().then(res => setProducts(res.data?.data || res.data || []))
  }

  const exportToCSV = () => {
    const headers = ['ID', 'Title', 'Category', 'MRP', 'Selling Price', 'Stock', 'Status']
    const rows = products.map(p => [
      p._id,
      p.title,
      p.category?.name || '',
      p.pricing?.mrp || 0,
      p.pricing?.sellingPrice || 0,
      p.inventory?.quantity || 0,
      p.status
    ])
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `products_export_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredProducts = products.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Products Module</h2>
          <p className="text-sm font-semibold text-slate-500">Manage your catalog, stock levels, and approval status.</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'inventory' && (
            <button
              onClick={exportToCSV}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold text-slate-700 hover:bg-slate-50"
            >
              Export Inventory (CSV)
            </button>
          )}
          <button
            onClick={() => setActiveTab('add')}
            className="rounded-lg bg-[#0d4697] px-3 py-1.5 text-xs font-extrabold text-white hover:bg-blue-800"
          >
            Add Product
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-px">
        {['inventory', 'add', 'categories', 'approval'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 px-4 py-2 text-xs font-extrabold capitalize transition-all ${
              activeTab === tab
                ? 'border-[#0d4697] text-[#0d4697]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab === 'approval' ? 'Approval Status' : tab === 'add' ? 'Add Product' : tab}
          </button>
        ))}
      </div>

      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex max-w-sm rounded-lg border border-slate-200 bg-white px-3 py-1.5">
            <input
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold outline-none"
            />
          </div>
          <DataTable
            columns={[
              { key: 'image', header: 'Image', render: (row) => (
                <img src={row.images?.[0]?.url || '/logo.png'} alt="" className="h-10 w-10 rounded-md object-cover border border-slate-200" />
              )},
              { key: 'title', header: 'Product' },
              { key: 'category', header: 'Category', render: (row) => row.category?.name || 'Local' },
              { key: 'price', header: 'Price', render: (row) => formatCurrency(row.pricing?.sellingPrice) },
              { key: 'stock', header: 'Stock', render: (row) => row.inventory?.quantity ?? 0 },
              { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            rows={filteredProducts}
          />
        </div>
      )}

      {activeTab === 'add' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm max-w-2xl text-left">
          <h3 className="text-sm font-black uppercase text-slate-800 mb-4">Add Product details</h3>
          {!categories.length && (
            <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">
              No approved product categories are available yet.
            </p>
          )}
          <SimpleJsonForm
            onSubmit={handleCreateProduct}
            fields={[
              { name: 'title', label: 'Product Title', required: true },
              { name: 'description', label: 'Description', type: 'textarea' },
              { name: 'category', label: 'Category', type: 'select', options: categories, required: true },
              { name: 'pricing.mrp', label: 'MRP (₹)', type: 'number', required: true },
              { name: 'pricing.sellingPrice', label: 'Selling Price (₹)', type: 'number', required: true },
              { name: 'pricing.taxPercent', label: 'GST / Tax (%)', type: 'number', required: true },
              { name: 'shippingInfo.shippingCharge', label: 'Shipping Charge (₹)', type: 'number', required: true },
              { name: 'inventory.quantity', label: 'Stock Quantity', type: 'number', required: true },
              { name: 'images', label: 'Product Images', type: 'file' }
            ]}
          />
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="grid gap-4 sm:grid-cols-3">
          {categories.map((c) => (
            <div key={c.value} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-left">
              <p className="text-xs font-black text-slate-800">{c.label}</p>
              <p className="text-[10px] font-bold text-slate-400 mt-1">Category</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'approval' && (
        <div className="space-y-4 text-left">
          {products.map((p) => (
            <div key={p._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black text-slate-800">{p.title}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Created on {formatDate(p.createdAt)}</p>
              </div>
              <StatusBadge value={p.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function VendorServicesPage() {
  const [activeTab, setActiveTab] = useState('inventory')
  const [categories, setCategories] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setLoading(true)
    Promise.all([
      vendorApi.profile(),
      api.get('/categories?isActive=true'),
      vendorApi.services()
    ]).then(([profileRes, catRes, servRes]) => {
      const vendorProfile = profileRes.data?.data || profileRes.data || {}
      const catList = catRes.data?.data || catRes.data || []
      setCategories(buildApprovedCategoryOptions(catList, vendorProfile.approvedCategories || []))
      setServices(servRes.data?.data || servRes.data || [])
    }).catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleCreateService = async (data) => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description || '')
    formData.append('category', data.category)
    formData.append('pricing[minPrice]', data.pricing?.minPrice)
    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        if (data.images[i] instanceof File) formData.append('images', data.images[i])
      }
    }
    await vendorApi.createService(formData)
    toast.success('Service created')
    setActiveTab('inventory')
    vendorApi.services().then(res => setServices(res.data?.data || res.data || []))
  }

  const exportToCSV = () => {
    const headers = ['ID', 'Title', 'Category', 'Min Price', 'Status']
    const rows = services.map(s => [
      s._id,
      s.title,
      s.category?.name || '',
      s.pricing?.minPrice || 0,
      s.status
    ])
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `services_export_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredServices = services.filter(s => 
    s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Services Module</h2>
          <p className="text-sm font-semibold text-slate-500">Manage your services offerings, pricing, and approvals.</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'inventory' && (
            <button
              onClick={exportToCSV}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold text-slate-700 hover:bg-slate-50"
            >
              Export Catalog (CSV)
            </button>
          )}
          <button
            onClick={() => setActiveTab('add')}
            className="rounded-lg bg-[#0d4697] px-3 py-1.5 text-xs font-extrabold text-white hover:bg-blue-800"
          >
            Add Service
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-px">
        {['inventory', 'add', 'categories', 'approval'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 px-4 py-2 text-xs font-extrabold capitalize transition-all ${
              activeTab === tab
                ? 'border-[#0d4697] text-[#0d4697]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab === 'approval' ? 'Approval Status' : tab === 'add' ? 'Add Service' : tab}
          </button>
        ))}
      </div>

      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex max-w-sm rounded-lg border border-slate-200 bg-white px-3 py-1.5">
            <input
              placeholder="Search services..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold outline-none"
            />
          </div>
          <DataTable
            columns={[
              { key: 'image', header: 'Image', render: (row) => (
                <img src={row.gallery?.[0]?.url || '/logo.png'} alt="" className="h-10 w-10 rounded-md object-cover border border-slate-200" />
              )},
              { key: 'title', header: 'Service' },
              { key: 'category', header: 'Category', render: (row) => row.category?.name || 'Local' },
              { key: 'minPrice', header: 'Starting Price', render: (row) => formatCurrency(row.pricing?.minPrice) },
              { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            rows={filteredServices}
          />
        </div>
      )}

      {activeTab === 'add' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm max-w-2xl text-left">
          <h3 className="text-sm font-black uppercase text-slate-800 mb-4">Add Service details</h3>
          {!categories.length && (
            <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">
              No approved categories are available yet.
            </p>
          )}
          <SimpleJsonForm
            onSubmit={handleCreateService}
            fields={[
              { name: 'title', label: 'Service Title', required: true },
              { name: 'description', label: 'Description', type: 'textarea' },
              { name: 'category', label: 'Category', type: 'select', options: categories, required: true },
              { name: 'pricing.minPrice', label: 'Minimum Price (₹)', type: 'number', required: true },
              { name: 'images', label: 'Service Images', type: 'file' }
            ]}
          />
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="grid gap-4 sm:grid-cols-3">
          {categories.map((c) => (
            <div key={c.value} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-left">
              <p className="text-xs font-black text-slate-800">{c.label}</p>
              <p className="text-[10px] font-bold text-slate-400 mt-1">Category</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'approval' && (
        <div className="space-y-4 text-left">
          {services.map((s) => (
            <div key={s._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black text-slate-800">{s.title}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Created on {formatDate(s.createdAt)}</p>
              </div>
              <StatusBadge value={s.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function VendorLeadsPage() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchLeads = () => {
    setLoading(true)
    vendorApi.leads()
      .then(res => setLeads(res.data?.data || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const columnsList = ['new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost']

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await vendorApi.updateLead(leadId, { status: newStatus })
      toast.success(`Lead moved to ${newStatus.replace('_', ' ')}`)
      fetchLeads()
    } catch {
      toast.error('Failed to update lead status')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Leads Pipeline</h2>
        <p className="text-sm font-semibold text-slate-500">Track and manage customer enquiries through the business pipeline.</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columnsList.map((col) => {
          const colLeads = leads.filter(l => l.status === col)
          return (
            <div key={col} className="w-72 shrink-0 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 flex flex-col gap-3 min-h-[500px]">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-xs font-black uppercase text-slate-600 tracking-wider">
                  {col.replace('_', ' ')}
                </span>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-black text-slate-700">
                  {colLeads.length}
                </span>
              </div>

              <div className="flex-1 space-y-3">
                {colLeads.map((l) => (
                  <div key={l._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow transition space-y-3 text-left">
                    <div>
                      <p className="text-xs font-black text-slate-800">{l.name || 'Anonymous'}</p>
                      <p className="text-[10px] font-bold text-slate-400">{l.phone || '-'}</p>
                      <p className="text-[10px] font-semibold text-slate-500 mt-2 line-clamp-2">{l.subject}</p>
                    </div>

                    <div className="flex gap-1 border-t border-slate-100 pt-2 flex-wrap">
                      {columnsList.filter(c => c !== col).map((nextCol) => (
                        <button
                          key={nextCol}
                          onClick={() => handleStatusChange(l._id, nextCol)}
                          className="rounded bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 text-[9px] font-extrabold text-slate-600 capitalize"
                        >
                          → {nextCol.split('_')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function VendorServiceEnquiriesPage() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchLeads = () => {
    setLoading(true)
    vendorApi.leads({ hasService: true, limit: 100 })
      .then((res) => setLeads(res.data?.data || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const rows = useMemo(() => leads.filter((lead) => Boolean(lead.service)), [leads])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Service Enquiries</h2>
        <p className="text-sm font-semibold text-slate-500">All enquiries submitted from service detail pages appear here.</p>
      </div>

      <DataTable
        loading={loading}
        columns={[
          { key: 'name', header: 'Customer', render: (row) => row.name || 'Anonymous' },
          { key: 'phone', header: 'Phone', render: (row) => row.phone || '-' },
          { key: 'service', header: 'Service', render: (row) => row.service?.title || row.subject || 'Service enquiry' },
          { key: 'budget', header: 'Budget', render: (row) => {
            const min = Number(row.budget?.min || 0)
            const max = Number(row.budget?.max || 0)
            if (!min && !max) return '-'
            if (min && max) return `${formatCurrency(min)} - ${formatCurrency(max)}`
            return formatCurrency(min || max)
          } },
          { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          { key: 'createdAt', header: 'Submitted', render: (row) => formatDate(row.createdAt) },
        ]}
        rows={rows}
      />
    </div>
  )
}

export function VendorOrdersPage() {
  const [orders, setOrders] = useState([])
  const [dashboard, setDashboard] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [statusDraft, setStatusDraft] = useState('')
  const [savingStatus, setSavingStatus] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadOrders = async ({ silent = false } = {}) => {
    if (silent) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    try {
      const [dashboardRes, ordersRes] = await Promise.allSettled([
        vendorApi.dashboard(),
        vendorApi.orders({ page: 1, limit: 100, status: 'all', paymentStatus: 'all' }),
      ])

      const dashboardData = dashboardRes.status === 'fulfilled' ? (dashboardRes.value.data?.data || dashboardRes.value.data || {}) : {}
      const apiOrders = ordersRes.status === 'fulfilled' ? (ordersRes.value.data?.data || ordersRes.value.data || []) : []
      const recentOrders = dashboardData.recentOrders || []
      const merged = mergeOrders([...recentOrders, ...apiOrders])

      setDashboard(dashboardData)
      setOrders(merged)
      if (!selectedOrderId && merged[0]?._id) {
        setSelectedOrderId(merged[0]._id)
      }
      if (!merged.length && ordersRes.status === 'rejected') {
        toast.error(ordersRes.reason?.response?.data?.message || 'Failed to load vendor orders')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load vendor orders')
    } finally {
      if (silent) setRefreshing(false)
      else setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
    const timer = window.setInterval(() => {
      loadOrders({ silent: true })
    }, 15000)
    return () => window.clearInterval(timer)
  }, [])

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'processing', label: 'Processing' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ]

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return orders.filter((order) => {
      const statusMatch =
        activeTab === 'all'
          ? true
          : activeTab === 'pending'
            ? ['placed', 'confirmed'].includes(order.status)
            : activeTab === 'processing'
              ? ['processing', 'shipped'].includes(order.status)
              : activeTab === 'completed'
                ? order.status === 'delivered'
                : activeTab === 'cancelled'
                  ? order.status === 'cancelled'
                  : true

      if (!statusMatch) return false
      if (!query) return true

      const haystack = [
        order.orderNumber,
        order.invoiceNumber,
        order.customerSnapshot?.name,
        order.customerSnapshot?.email,
        order.customerSnapshot?.phone,
        order.status,
        order.paymentStatus,
        order.deliveryMethod,
        ...(order.items || []).map((item) => item.productSnapshot?.title),
      ].filter(Boolean).join(' ').toLowerCase()

      return haystack.includes(query)
    })
  }, [activeTab, orders, searchQuery])

  useEffect(() => {
    if (!filteredOrders.length) {
      setSelectedOrderId(null)
      return
    }
    if (!filteredOrders.some((order) => order._id === selectedOrderId)) {
      setSelectedOrderId(filteredOrders[0]._id)
    }
  }, [filteredOrders, selectedOrderId])

  const selectedOrder = filteredOrders.find((order) => order._id === selectedOrderId) || filteredOrders[0] || null

  useEffect(() => {
    setStatusDraft(selectedOrder?.status || '')
  }, [selectedOrder?._id, selectedOrder?.status])

  const handleStatusChange = async (orderId, nextStatus) => {
    if (!orderId || !nextStatus || !selectedOrder) return
    if (nextStatus === selectedOrder.status) {
      toast('Order already has that status')
      return
    }

    setSavingStatus(true)
    try {
      const response = await vendorApi.updateOrderStatus(orderId, { status: nextStatus })
      const updatedOrder = response.data?.data || response.data || null
      if (updatedOrder?._id) {
        setOrders((current) => current.map((order) => (order._id === updatedOrder._id ? updatedOrder : order)))
      }
      setStatusDraft(nextStatus)
      toast.success('Order status updated')
      loadOrders({ silent: true })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order status')
    } finally {
      setSavingStatus(false)
    }
  }

  const stats = useMemo(() => {
    const revenueOrders = orders.filter((order) => {
      const status = String(order.status || '')
      const paymentStatus = String(order.paymentStatus || '')
      const paymentMethod = String(order.paymentMethod || '').toLowerCase()
      const isEligibleMethod = ['cod', 'razorpay'].includes(paymentMethod)
      const isCompleted = status === 'delivered' && paymentStatus === 'paid'
      return isEligibleMethod && isCompleted && !order.returnRequest && !order.cancellationRequest
    })
    const totalRevenue = revenueOrders.reduce((sum, order) => sum + Number(order.total || 0), 0)
    const dashboardRevenue = Number(dashboard?.stats?.totalRevenue || 0)
    const dashboardRevenueCount = Number(dashboard?.stats?.revenueOrderCount || 0)
    return {
      totalOrders: orders.length,
      pendingOrders: orders.filter((order) => ['placed', 'confirmed'].includes(order.status)).length,
      processingOrders: orders.filter((order) => ['processing', 'shipped'].includes(order.status)).length,
      deliveredOrders: orders.filter((order) => order.status === 'delivered').length,
      cancelledOrders: orders.filter((order) => order.status === 'cancelled').length,
      totalRevenue: dashboardRevenue || totalRevenue,
      avgOrderValue: dashboardRevenueCount ? Math.round((dashboardRevenue || totalRevenue) / dashboardRevenueCount) : (revenueOrders.length ? Math.round(totalRevenue / revenueOrders.length) : 0),
      dashboardOrders: dashboard?.stats?.totalOrders || 0,
    }
  }, [dashboard?.stats?.totalOrders, orders])

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Orders & Bookings</p>
            <h2 className="mt-1 text-3xl font-black text-slate-900">Vendor Order Center</h2>
            <p className="mt-2 max-w-2xl text-sm font-semibold text-slate-500">
              See every customer order placed for your products, track the current fulfillment stage, and open each order like a marketplace seller panel.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => loadOrders({ silent: false })} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 hover:border-[#0d4697] hover:text-[#0d4697]">
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button type="button" onClick={() => { toast.success('Invoice export coming next'); }} className="inline-flex items-center gap-2 rounded-xl bg-[#0d4697] px-4 py-2 text-xs font-black text-white hover:bg-blue-800">
              <ReceiptText className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <MetricCard label="Total Orders" value={stats.totalOrders} helper="Across all statuses" icon={ShoppingBag} />
          <MetricCard label="Pending" value={stats.pendingOrders} helper="Placed / confirmed" icon={Clock3} accent="amber" />
          <MetricCard label="Processing" value={stats.processingOrders} helper="Packed / shipped" icon={Truck} accent="blue" />
          <MetricCard label="Delivered" value={stats.deliveredOrders} helper="Completed orders" icon={CircleDashed} accent="emerald" />
          <MetricCard label="Revenue" value={formatCurrency(stats.totalRevenue)} helper="Delivered COD / Razorpay only" icon={Banknote} accent="slate" />
          <MetricCard label="AOV" value={formatCurrency(stats.avgOrderValue)} helper="Average order value" icon={Banknote} accent="violet" />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900">Order Timeline</h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">Auto-refreshes every 15 seconds so new orders show up quickly.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search order, customer, product..."
                  className="w-64 bg-transparent text-xs font-semibold text-slate-900 caret-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600">
                <Filter className="h-4 w-4" />
                Filter
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto border-b border-slate-200 pb-px">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`border-b-2 px-4 py-2 text-xs font-black capitalize transition-all ${
                  activeTab === tab.key
                    ? 'border-[#0d4697] text-[#0d4697]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-4">
            {loading ? (
              <div className="grid min-h-80 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
                <div className="text-center">
                  <RefreshCw className="mx-auto h-8 w-8 animate-spin text-[#0d4697]" />
                  <p className="mt-3 text-sm font-semibold text-slate-500">Loading your vendor orders...</p>
                </div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="grid min-h-80 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center">
                <div>
                  <ShoppingBag className="mx-auto h-10 w-10 text-slate-300" />
                  <h4 className="mt-3 text-lg font-black text-slate-800">No orders yet</h4>
                  <p className="mt-1 max-w-md text-sm font-semibold text-slate-500">
                    When a customer places an order for your products, it will appear here with the customer details, items, payment state, and fulfillment timeline.
                  </p>
                </div>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <button
                  key={order._id}
                  type="button"
                  onClick={() => setSelectedOrderId(order._id)}
                  className={`w-full rounded-2xl border p-4 text-left transition hover:shadow-sm ${
                    selectedOrderId === order._id
                      ? 'border-[#0d4697] bg-[#eef4ff]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-black text-slate-900">{order.orderNumber || order._id}</p>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-600">
                          {formatDate(order.createdAt)}
                        </span>
                        <StatusBadge value={order.status} />
                        <StatusBadge value={order.paymentStatus} />
                      </div>
                      <p className="text-sm font-semibold text-slate-600">
                        {order.customerSnapshot?.name || order.user?.name || 'Guest'} • {order.customerSnapshot?.phone || order.user?.phone || 'No phone'}
                      </p>
                      <p className="text-xs font-medium text-slate-500">
                        {order.items?.length || 0} item(s) • {order.deliveryMethod || 'standard'} delivery • {formatCurrency(order.total)}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {order.cancellationRequest && (
                          <OrderFlagBadge
                            tone="rose"
                            label={`Cancel ${String(order.cancellationRequest.status || 'requested').replace(/_/g, ' ')}`}
                          />
                        )}
                        {order.returnRequest && (
                          <OrderFlagBadge
                            tone="amber"
                            label={`Return ${String(order.returnRequest.status || 'requested').replace(/_/g, ' ')}`}
                          />
                        )}
                        {order.refund && (
                          <OrderFlagBadge
                            tone="emerald"
                            label={`Refund ${String(order.refund.status || 'requested').replace(/_/g, ' ')}`}
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-slate-50 px-3 py-2 text-right">
                        <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Total</p>
                        <p className="text-sm font-black text-slate-900">{formatCurrency(order.total)}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-300" />
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {(order.items || []).slice(0, 3).map((item) => (
                      <div key={`${order._id}-${item.productId || item.productSnapshot?._id}`} className="rounded-xl bg-slate-50 p-3">
                        <p className="line-clamp-1 text-sm font-bold text-slate-900">{item.productSnapshot?.title || 'Product'}</p>
                        <p className="text-xs font-semibold text-slate-500">Qty {item.quantity} • {formatCurrency(item.lineTotal)}</p>
                      </div>
                    ))}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <OrderDetailPanel order={selectedOrder} onCopyOrderNumber={() => {
            if (!selectedOrder?.orderNumber) return
            navigator.clipboard?.writeText(selectedOrder.orderNumber).then(() => toast.success('Order number copied')).catch(() => {})
          }} statusDraft={statusDraft} statusOptions={ORDER_STATUS_OPTIONS} onStatusDraftChange={setStatusDraft} onStatusChange={handleStatusChange} savingStatus={savingStatus} />

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-black text-slate-900">Seller Notes</h4>
                <p className="text-sm font-semibold text-slate-500">Use this space for fulfillment reminders or packing instructions.</p>
              </div>
            </div>
            <textarea
              rows={5}
              className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 caret-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0d4697]"
              placeholder="Add private notes for your team..."
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export function VendorReviewsPage() {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    vendorApi.reviews()
      .then(res => setReviews(res.data?.data || res.data || []))
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Customer Reviews & Ratings</h2>
        <p className="text-sm font-semibold text-slate-500">View customer ratings and review comments from the backend.</p>
      </div>

      <div className="grid gap-6">
        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400">
            No customer reviews posted yet.
          </div>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 text-left">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-black text-slate-800">{r.user?.name || 'Customer'}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">{r.user?.email || '-'}</p>
                </div>
                <div className="rounded bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs font-black text-amber-700">
                  {r.rating || 5} ★
                </div>
              </div>

              <p className="text-xs font-semibold text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg">
                "{r.comment || 'Outstanding services!'}"
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function mergeOrders(items = []) {
  const seen = new Set()
  return items.filter((order) => {
    const key = String(order?._id || '')
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function MetricCard({ label, value, helper, icon: Icon, accent = 'slate' }) {
  const accentMap = {
    amber: 'bg-amber-50 text-amber-700',
    blue: 'bg-blue-50 text-blue-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    violet: 'bg-violet-50 text-violet-700',
    slate: 'bg-slate-50 text-slate-700',
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${accentMap[accent] || accentMap.slate}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">{label}</span>
      </div>
      <p className="mt-4 text-2xl font-black text-slate-900">{displayValue(value)}</p>
      {helper && <p className="mt-1 text-xs font-semibold text-slate-500">{helper}</p>}
    </div>
  )
}

function OrderDetailPanel({ order, onCopyOrderNumber, statusDraft, statusOptions, onStatusDraftChange, onStatusChange, savingStatus }) {
  if (!order) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <ReceiptText className="mx-auto h-10 w-10 text-slate-300" />
          <h4 className="mt-3 text-lg font-black text-slate-900">Select an order</h4>
          <p className="mt-1 text-sm font-semibold text-slate-500">Pick an order from the list to inspect customer details, payment state, and fulfillment progress.</p>
        </div>
      </div>
    )
  }

  const tracking = order.tracking?.length ? order.tracking : buildFallbackTracking(order.status)
  const shiprocketShipments = Array.isArray(order.shiprocket?.shipments) ? order.shiprocket.shipments : []
  const trackingSnapshots = Array.isArray(order.shiprocket?.trackingSnapshots) ? order.shiprocket.trackingSnapshots : []
  const trackingSnapshotMap = new Map(trackingSnapshots.map((snapshot) => [String(snapshot?.shipmentId || snapshot?.orderId || ''), snapshot]))

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Order Details</p>
          <h4 className="mt-1 text-2xl font-black text-slate-900">{order.orderNumber || order._id}</h4>
          <p className="mt-1 text-sm font-semibold text-slate-500">{formatDate(order.createdAt)} • {displayValue(order.deliveryMethod || 'standard')} delivery</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge value={order.status} />
          <StatusBadge value={order.paymentStatus} />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <InfoTile label="Customer" value={order.customerSnapshot?.name || order.user?.name || 'Guest'} />
        <InfoTile label="Phone" value={order.customerSnapshot?.phone || order.user?.phone || '-'} />
        <InfoTile label="Payment" value={order.paymentMethod || 'razorpay'} />
        <InfoTile label="Total" value={formatCurrency(order.total)} />
      </div>

      <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <label className="flex-1">
            <span className="block text-[10px] font-black uppercase tracking-wide text-slate-400">Update Status</span>
            <select
              value={statusDraft || order.status}
              onChange={(event) => onStatusDraftChange?.(event.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-[#0d4697]"
            >
              {statusOptions?.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => onStatusChange?.(order._id, statusDraft || order.status)}
            disabled={savingStatus || !statusDraft || statusDraft === order.status}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0d4697] px-4 text-xs font-black text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {savingStatus ? 'Saving...' : 'Save Status'}
          </button>
        </div>
        <p className="mt-3 text-xs font-semibold text-slate-500">
          This updates the vendor order stage and will sync to the customer order page automatically.
        </p>
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Delivery Address</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{displayValue(formatOrderAddress(order.address))}</p>
          </div>
          <button type="button" onClick={onCopyOrderNumber} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-black text-slate-700 hover:border-[#0d4697] hover:text-[#0d4697]">
            <Copy className="h-3.5 w-3.5" />
            Copy
          </button>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Items</p>
        <div className="mt-3 space-y-3">
          {(order.items || []).map((item) => (
            <div key={`${order._id}-${item.productId || item.productSnapshot?._id}`} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                  <ShoppingBag className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{displayValue(item.productSnapshot?.title || 'Product')}</p>
                  <p className="text-xs font-semibold text-slate-500">Qty {displayValue(item.quantity)} • {displayValue(item.variant?.option || item.variant?.name || 'Default')}</p>
                </div>
              </div>
              <p className="text-sm font-black text-slate-900">{formatCurrency(item.lineTotal)}</p>
            </div>
          ))}
        </div>
      </div>

      {(order.returnRequest || order.cancellationRequest || order.refund) && (
        <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Customer Actions</p>
          <div className="mt-3 grid gap-4 xl:grid-cols-3">
            {order.cancellationRequest && (
              <RequestDetailCard
                title="Cancellation"
                tone="rose"
                request={order.cancellationRequest}
                fields={[
                  { label: 'Status', value: order.cancellationRequest.status?.replace(/_/g, ' ') || 'requested' },
                  { label: 'Reason', value: order.cancellationRequest.reason },
                  { label: 'UPI ID', value: order.cancellationRequest.upiId || '-' },
                  { label: 'Requested At', value: order.cancellationRequest.requestedAt ? formatDate(order.cancellationRequest.requestedAt) : '-' },
                  { label: 'Completed At', value: order.cancellationRequest.completedAt ? formatDate(order.cancellationRequest.completedAt) : '-' },
                  { label: 'Failure Reason', value: order.cancellationRequest.failureReason || '-' },
                  { label: 'Refund ID', value: order.cancellationRequest.refundId || '-' },
                ]}
              />
            )}
            {order.returnRequest && (
              <RequestDetailCard
                title="Return"
                tone="amber"
                request={order.returnRequest}
                fields={[
                  { label: 'Status', value: order.returnRequest.status?.replace(/_/g, ' ') || 'requested' },
                  { label: 'Reason', value: order.returnRequest.reasonLabel || order.returnRequest.reason },
                  { label: 'UPI ID', value: order.returnRequest.upiId || '-' },
                  { label: 'Return Method', value: order.returnRequest.returnMethod || '-' },
                  { label: 'Refund Method', value: order.returnRequest.refundMethod || '-' },
                  { label: 'Requested At', value: order.returnRequest.requestedAt ? formatDate(order.returnRequest.requestedAt) : '-' },
                  { label: 'Window Ends', value: order.returnRequest.returnWindowEndsAt ? formatDate(order.returnRequest.returnWindowEndsAt) : '-' },
                  { label: 'Rejection Reason', value: order.returnRequest.rejectionReason || '-' },
                ]}
              />
            )}
            {order.refund && (
              <RequestDetailCard
                title="Refund"
                tone="emerald"
                request={order.refund}
                fields={[
                  { label: 'Status', value: order.refund.status || 'requested' },
                  { label: 'Reason', value: order.refund.reason || order.refund.reasonLabel || '-' },
                  { label: 'UPI ID', value: order.refund.upiId || '-' },
                  { label: 'Amount', value: formatCurrency(order.refund.amount || order.refund.refundAmount || 0) },
                  { label: 'Refund ID', value: order.refund.refundId || '-' },
                  { label: 'Requested At', value: order.refund.requestedAt ? formatDate(order.refund.requestedAt) : '-' },
                  { label: 'Completed At', value: order.refund.refundedAt ? formatDate(order.refund.refundedAt) : '-' },
                  { label: 'Failure Reason', value: order.refund.failureReason || '-' },
                ]}
              />
            )}
          </div>
        </div>
      )}

      <div className="mt-4 rounded-2xl border border-slate-100 p-4">
        <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Fulfillment Timeline</p>
        <div className="mt-4 space-y-3">
          {tracking.map((step, index) => (
            <div key={step.status || index} className="flex items-start gap-3">
              <div className={`mt-1 h-3 w-3 rounded-full ${step.at ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <div>
                <p className="text-sm font-bold text-slate-900">{displayValue(step.label || step.status)}</p>
                <p className="text-xs font-semibold text-slate-500">
                  {step.at ? formatDate(step.at) : 'Waiting'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Shiprocket Fulfillment</p>
            <p className="mt-1 text-sm font-semibold text-slate-600">
              Shipment-level status, pickup details, and courier snapshots for this order.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge value={order.shiprocket?.status || 'pending'} />
            {order.shiprocket?.lastVendorStatus && (
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-wide text-slate-600 ring-1 ring-slate-200">
                {order.shiprocket.lastVendorStatus}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <InfoTile label="Shiprocket Status" value={order.shiprocket?.status || 'not synced'} />
          <InfoTile label="Shipments" value={shiprocketShipments.length || 0} />
          <InfoTile label="Last Vendor Update" value={order.shiprocket?.lastVendorStatusAt ? formatDate(order.shiprocket.lastVendorStatusAt) : '-'} />
          <InfoTile label="Last Tracking Sync" value={order.shiprocket?.lastTrackingSyncAt ? formatDate(order.shiprocket.lastTrackingSyncAt) : '-'} />
        </div>

        {shiprocketShipments.length > 0 ? (
          <div className="mt-4 space-y-3">
            {shiprocketShipments.map((shipment, index) => {
              const snapshot = trackingSnapshotMap.get(String(shipment.shipmentId || shipment.orderId || ''))
              const trackingData = snapshot?.raw?.tracking_data || snapshot?.raw?.data || snapshot?.raw || {}
              const activities = Array.isArray(trackingData.shipment_track_activities)
                ? trackingData.shipment_track_activities
                : Array.isArray(trackingData.activities)
                  ? trackingData.activities
                  : []
              const currentStatus =
                trackingData.current_status ||
                trackingData.status ||
                trackingData.shipment_status ||
                shipment.status ||
                'created'

              return (
                <div key={`${shipment.shipmentId || shipment.orderId || index}`} className="rounded-2xl border border-white bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Package className="h-4 w-4 text-[#0d4697]" />
                        <p className="text-sm font-black text-slate-900">{shipment.vendorName || 'Vendor shipment'}</p>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-600">
                          {currentStatus}
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        Order ID: {displayValue(shipment.orderId)} • Shipment ID: {displayValue(shipment.shipmentId)}
                      </p>
                    </div>

                    {snapshot?.raw && (
                      <div className="grid gap-2 text-right text-xs font-semibold text-slate-500">
                        <p>AWB: {displayValue(trackingData.awb_code || trackingData.awbCode || '-')}</p>
                        <p>Courier: {displayValue(trackingData.courier_name || trackingData.courierName || '-')}</p>
                        <p>Updated: {displayValue(trackingData.updated_at || trackingData.updatedAt || trackingData.last_update_time || '-')}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <InfoTile label="Pickup Location" value={order.shiprocket?.pickupLocation || shipment.pickup_location || '-'} />
                    <InfoTile label="Shipment Status" value={shipment.status || currentStatus} />
                  </div>

                  {activities.length > 0 && (
                    <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                      <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Courier Tracking</p>
                      <div className="mt-3 space-y-3">
                        {activities.slice(0, 4).map((activity, activityIndex) => (
                          <div key={`${shipment.shipmentId || index}-activity-${activityIndex}`} className="flex items-start gap-3">
                            <div className="mt-1 h-3 w-3 rounded-full bg-[#0d4697]" />
                            <div>
                              <p className="text-sm font-bold text-slate-900">
                                {displayValue(activity.status || activity.current_status || activity.activity)}
                              </p>
                              <p className="text-xs font-semibold text-slate-500">
                                {displayValue(activity.date_time || activity.date || activity.timestamp || activity.remarks || activity.location || '')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm font-semibold text-slate-500">
            Shiprocket shipment details will appear here after the order is synced from the backend.
          </div>
        )}
      </div>

      {order.notes && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-[10px] font-black uppercase tracking-wide text-amber-700">Customer Notes</p>
          <p className="mt-1 text-sm font-semibold text-amber-900">{displayValue(order.notes)}</p>
        </div>
      )}
    </div>
  )
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
      <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-900">{displayValue(value)}</p>
    </div>
  )
}

function RequestDetailCard({ title, tone = 'slate', request, fields = [] }) {
  const toneMap = {
    amber: 'border-amber-200 bg-amber-50/70 text-amber-800',
    rose: 'border-rose-200 bg-rose-50/70 text-rose-800',
    emerald: 'border-emerald-200 bg-emerald-50/70 text-emerald-800',
    slate: 'border-slate-200 bg-white text-slate-800',
  }
  const chipClass = toneMap[tone] || toneMap.slate

  return (
    <div className={`rounded-2xl border p-4 ${chipClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black">{title}</p>
          <p className="mt-1 text-[11px] font-semibold opacity-80">
            {request?.status ? String(request.status).replace(/_/g, ' ') : 'requested'}
          </p>
        </div>
        <StatusBadge value={request?.status || 'requested'} />
      </div>

      <div className="mt-4 space-y-2 rounded-xl bg-white/80 p-3 ring-1 ring-black/5">
        {fields.map((field) => (
          <div key={`${title}-${field.label}`} className="flex items-start justify-between gap-3">
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{field.label}</p>
            <p className="max-w-[60%] text-right text-xs font-semibold text-slate-700">{displayValue(field.value)}</p>
          </div>
        ))}
      </div>

      {Array.isArray(request?.tracking) && request.tracking.length > 0 && (
        <div className="mt-4">
          <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Timeline</p>
          <div className="mt-2 space-y-2">
            {request.tracking.slice(0, 5).map((step, index) => (
              <div key={`${title}-timeline-${step.status || index}`} className="flex items-start gap-2">
                <div className={`mt-1 h-2.5 w-2.5 rounded-full ${step.at ? 'bg-[#0d4697]' : 'bg-slate-300'}`} />
                <div>
                  <p className="text-xs font-bold text-slate-800">{displayValue(step.label || step.status)}</p>
                  <p className="text-[11px] font-semibold text-slate-500">{step.at ? formatDate(step.at) : step.description || 'Waiting'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function OrderFlagBadge({ tone = 'slate', label }) {
  const toneMap = {
    amber: 'border-amber-200 bg-amber-50 text-amber-800',
    rose: 'border-rose-200 bg-rose-50 text-rose-800',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    slate: 'border-slate-200 bg-slate-50 text-slate-700',
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${toneMap[tone] || toneMap.slate}`}>
      {label}
    </span>
  )
}

function formatOrderAddress(address) {
  if (!address) return 'Address unavailable'
  if (typeof address === 'string') return address
  if (Array.isArray(address)) return address.map(displayValue).filter(Boolean).join(', ')
  if (typeof address !== 'object') return displayValue(address)
  return [
    address.fullName,
    address.line1,
    address.line2,
    address.landmark,
    address.city,
    address.state,
    address.pincode,
  ].filter(Boolean).join(', ')
}

function buildFallbackTracking(status) {
  return [
    { status: 'placed', label: 'Order placed', at: status ? new Date().toISOString() : null },
    { status: 'processing', label: 'Packed by seller', at: ['processing', 'shipped', 'delivered'].includes(status) ? new Date().toISOString() : null },
    { status: 'shipped', label: 'Out for delivery', at: ['shipped', 'delivered'].includes(status) ? new Date().toISOString() : null },
    { status: 'delivered', label: 'Delivered', at: status === 'delivered' ? new Date().toISOString() : null },
  ]
}

function displayValue(value) {
  if (value === null || value === undefined || value === '') return '-'
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return value.map(displayValue).filter(Boolean).join(', ')
  if (value instanceof Date) return formatDate(value)
  if (typeof value === 'object') {
    const preferredKeys = ['name', 'title', 'label', 'value', 'orderNumber', 'phone', 'email']
    for (const key of preferredKeys) {
      if (value[key] !== undefined && value[key] !== null) return displayValue(value[key])
    }
    try {
      return JSON.stringify(value)
    } catch {
      return '[object]'
    }
  }
  return String(value)
}

export function VendorPaymentsPage() {
  const [payments, setPayments] = useState([])
  const [activeTab, setActiveTab] = useState('earnings')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadPayments = async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true)
    else setLoading(true)

    try {
      const [dashboardRes, paymentsRes] = await Promise.allSettled([
        vendorApi.dashboard(),
        vendorApi.payments({ page: 1, limit: 100, sortBy: '-createdAt' }),
      ])

      const dashboardData = dashboardRes.status === 'fulfilled' ? (dashboardRes.value.data?.data || dashboardRes.value.data || {}) : {}
      const paymentRows = paymentsRes.status === 'fulfilled' ? (paymentsRes.value.data?.data || paymentsRes.value.data || []) : []
      const merged = mergePayments([...paymentRows, ...(dashboardData.recentPayments || [])])
      setPayments(merged)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load vendor payments')
    } finally {
      if (silent) setRefreshing(false)
      else setLoading(false)
    }
  }

  useEffect(() => {
    loadPayments()
  }, [])

  const settlementRows = useMemo(() => {
    return payments.map((payment) => {
      const grossAmount = Number(payment.amount || 0)
      const commissionAmount = getCommissionAmount(payment)
      const vendorShareAmount = getVendorShare(payment)
      return {
        ...payment,
        grossAmount,
        commissionAmount,
        vendorShareAmount,
        settlementStatus: getSettlementStatus(payment),
        sourceLabel: getPaymentSourceLabel(payment),
        orderLabel: payment.orderNumber || payment.invoiceNumber || payment._id,
        customerLabel: getCustomerLabel(payment),
      }
    })
  }, [payments])

  const stats = useMemo(() => {
    const completedPayments = settlementRows.filter((payment) => isRevenueEligible(payment))
    const pendingPayments = settlementRows.filter((payment) => payment.status === 'pending')
    const refundedPayments = settlementRows.filter((payment) => ['refunded', 'partially_refunded'].includes(payment.status))
    const grossSales = completedPayments.reduce((sum, payment) => sum + Number(payment.grossAmount || 0), 0)
    const completedAmount = completedPayments.reduce((sum, payment) => sum + Number(payment.grossAmount || 0), 0)
    const commission = completedPayments.reduce((sum, payment) => sum + Number(payment.commissionAmount || 0), 0)
    const vendorShare = completedPayments.reduce((sum, payment) => sum + Number(payment.vendorShareAmount || 0), 0)

    return {
      grossSales,
      commission,
      completedCount: completedPayments.length,
      pendingCount: pendingPayments.length,
      refundedCount: refundedPayments.length,
      completedAmount,
      vendorShare,
      recentCompleted: completedPayments.slice(0, 5),
    }
  }, [settlementRows])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Vendor Payouts & Earnings</h2>
        <p className="text-sm font-semibold text-slate-500">Track order payouts, earnings, and payment activity from the backend.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 border-b border-slate-200 pb-px">
          {['earnings', 'payouts', 'transactions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-4 py-2 text-xs font-extrabold capitalize transition-all ${
                activeTab === tab
                  ? 'border-[#0d4697] text-[#0d4697]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => loadPayments({ silent: true })}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 hover:border-[#0d4697] hover:text-[#0d4697]"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {activeTab === 'earnings' && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm text-left">
            <p className="text-[10px] font-black uppercase text-slate-400">Gross Sales</p>
            <p className="text-xl font-black text-slate-800 mt-2">{formatCurrency(stats.grossSales)}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm text-left">
            <p className="text-[10px] font-black uppercase text-slate-400">Commission Deducted (5%)</p>
            <p className="text-xl font-black text-[#0d4697] mt-2">{formatCurrency(stats.commission)}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm text-left">
            <p className="text-[10px] font-black uppercase text-slate-400">Settlement Value</p>
            <p className="text-xl font-black text-slate-800 mt-2">{formatCurrency(stats.vendorShare)}</p>
          </div>
        </div>
      )}

      {activeTab === 'payouts' && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 text-left">
          <h3 className="text-xs font-black uppercase text-slate-800">Payout Summary</h3>
          {loading ? (
            <p className="text-sm font-semibold text-slate-500">Loading payout records...</p>
          ) : stats.recentCompleted.length === 0 ? (
            <p className="text-sm font-semibold text-slate-500">No completed payouts found yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentCompleted.map((payment) => (
                <div key={payment._id || payment.id} className="grid gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs sm:grid-cols-[1.1fr_0.9fr_0.8fr] sm:items-center">
                  <div>
                    <p className="font-black text-slate-900">{payment.orderLabel}</p>
                    <p className="mt-1 font-semibold text-slate-500">{payment.customerLabel} • {payment.sourceLabel}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-white px-2.5 py-1 font-black text-slate-700 ring-1 ring-slate-200">{formatCurrency(payment.grossAmount, payment.currency)}</span>
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 font-black text-[#0d4697] ring-1 ring-blue-100">Fee {formatCurrency(payment.commissionAmount, payment.currency)}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-emerald-700">{formatCurrency(payment.vendorShareAmount, payment.currency)}</p>
                    <p className="mt-1 font-semibold text-slate-500">{payment.settlementStatus}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-left">
              <p className="text-[10px] font-black uppercase text-slate-400">Completed</p>
              <p className="mt-2 text-2xl font-black text-slate-900">{stats.completedCount}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-left">
              <p className="text-[10px] font-black uppercase text-slate-400">Pending</p>
              <p className="mt-2 text-2xl font-black text-slate-900">{stats.pendingCount}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-left">
              <p className="text-[10px] font-black uppercase text-slate-400">Refunded</p>
              <p className="mt-2 text-2xl font-black text-slate-900">{stats.refundedCount}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-left">
              <p className="text-[10px] font-black uppercase text-slate-400">Total</p>
              <p className="mt-2 text-2xl font-black text-slate-900">{payments.length}</p>
            </div>
          </div>

          <DataTable
            loading={loading}
            columns={[
              { key: 'orderLabel', header: 'Order', render: (row) => row.orderLabel || row.invoiceNumber || row._id },
              { key: 'customerLabel', header: 'Customer', render: (row) => row.customerLabel || 'Guest' },
              { key: 'grossAmount', header: 'Order Value', render: (row) => formatCurrency(row.grossAmount ?? row.amount, row.currency) },
              { key: 'commissionAmount', header: 'Commission', render: (row) => formatCurrency(row.commissionAmount || 0, row.currency) },
              { key: 'vendorShareAmount', header: 'Vendor Share', render: (row) => formatCurrency(row.vendorShareAmount ?? row.amount, row.currency) },
              { key: 'gateway', header: 'Gateway', render: (row) => row.gateway || 'order' },
              { key: 'paidAt', header: 'Paid On', render: (row) => formatDate(row.paidAt || row.createdAt) },
              { key: 'settlementStatus', header: 'Settlement', render: (row) => <StatusBadge value={row.settlementStatus || row.status} /> },
            ]}
            rows={settlementRows}
          />
        </div>
      )}
    </div>
  )
}

export function VendorAnalyticsPage() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadAnalytics = async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true)
    else setLoading(true)

    try {
      const response = await vendorApi.dashboard()
      setDashboard(response.data?.data || response.data || {})
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load vendor analytics')
    } finally {
      if (silent) setRefreshing(false)
      else setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  const stats = dashboard?.stats || {}
  const recentOrders = dashboard?.recentOrders || []
  const recentPayments = dashboard?.recentPayments || []
  const recentLeads = dashboard?.recentLeads || []

  const summaryCards = [
    { label: 'Products', value: stats.productsCount || 0, helper: 'Approved catalog items', icon: Package },
    { label: 'Services', value: stats.servicesCount || 0, helper: 'Active service listings', icon: BriefcaseBusiness },
    { label: 'Orders', value: stats.totalOrders || 0, helper: 'All placed orders', icon: ShoppingBag },
    { label: 'Pending Orders', value: stats.pendingOrders || 0, helper: 'Needs action', icon: Clock3 },
    { label: 'Revenue', value: formatCurrency(stats.monthlyRevenue || 0), helper: 'Current month', icon: Banknote },
    { label: 'Reviews', value: stats.totalReviews || 0, helper: `Average ${Number(stats.avgRating || 0).toFixed(1)} stars`, icon: Star },
  ]

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Vendor Analytics</p>
            <h2 className="mt-1 text-3xl font-black text-slate-900">Marketplace Performance</h2>
            <p className="mt-2 max-w-2xl text-sm font-semibold text-slate-500">
              Track catalog health, orders, revenue, leads, and recent seller activity from the backend.
            </p>
          </div>
          <button
            type="button"
            onClick={() => loadAnalytics({ silent: true })}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 hover:border-[#0d4697] hover:text-[#0d4697]"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {summaryCards.map((card) => (
            <MetricCard
              key={card.label}
              label={card.label}
              value={card.value}
              helper={card.helper}
              icon={card.icon}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-black text-slate-900">Recent Orders</h3>
              <p className="text-sm font-semibold text-slate-500">Latest customer purchases across your catalog.</p>
            </div>
            <Link to="/vendor/orders" className="text-sm font-black text-[#0d4697]">View orders</Link>
          </div>
          <div className="mt-4">
            <DataTable
              loading={loading}
              columns={[
                { key: 'orderNumber', header: 'Order #', render: (row) => row.orderNumber || row._id },
                { key: 'customer', header: 'Customer', render: (row) => row.customerSnapshot?.name || 'Guest' },
                { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.total) },
                { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
                { key: 'paymentStatus', header: 'Payment', render: (row) => <StatusBadge value={row.paymentStatus} /> },
              ]}
              rows={recentOrders}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-slate-900">Recent Payments</h3>
                <p className="text-sm font-semibold text-slate-500">Latest vendor settlements and captured payments.</p>
              </div>
              <Link to="/vendor/payments" className="text-sm font-black text-[#0d4697]">View payments</Link>
            </div>
            <div className="mt-4 space-y-3">
              {recentPayments.length ? recentPayments.map((payment) => (
                <div key={payment._id || payment.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <div>
                    <p className="text-sm font-black text-slate-900">{formatCurrency(payment.amount, payment.currency)}</p>
                    <p className="text-xs font-semibold text-slate-500">{payment.type || payment.gateway} • {formatDate(payment.paidAt || payment.createdAt)}</p>
                  </div>
                  <StatusBadge value={payment.status} />
                </div>
              )) : (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-500">No recent payments yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-xl font-black text-slate-900">Recent Leads</h3>
            <p className="text-sm font-semibold text-slate-500">Customer enquiries and business requests.</p>
            <div className="mt-4 space-y-3">
              {recentLeads.length ? recentLeads.map((lead) => (
                <div key={lead._id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-sm font-black text-slate-900">{lead.name || lead.subject || 'Lead'}</p>
                  <p className="text-xs font-semibold text-slate-500">{lead.phone || lead.status || 'No phone'}</p>
                </div>
              )) : (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-500">No recent leads yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export function VendorNotificationsPage() {
  return <NotificationsPage />
}

export function VendorSupportPage() {
  return <ResourceListPage title="Support Tickets" fetcher={customerApi.support} createAction={async (data) => { await customerApi.createTicket(data); toast.success('Ticket created') }} columns={[{ key: 'ticketNumber', header: 'Ticket' }, { key: 'subject', header: 'Subject' }, { key: 'priority', header: 'Priority' }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> }]} renderForm={(props) => <SimpleJsonForm {...props} fields={[{ name: 'subject' }, { name: 'description', type: 'textarea' }, { name: 'category' }, { name: 'priority', type: 'select', options: ['low', 'medium', 'high', 'critical'].map((value) => ({ value, label: value })) }]} />} />
}

function mergePayments(items = []) {
  const seen = new Set()
  return items.filter((payment) => {
    const key = String(payment?._id || payment?.id || '')
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function getPaymentSourceLabel(payment) {
  return payment?.source === 'order' ? 'Order settlement' : 'Payment'
}

function getSettlementStatus(payment) {
  if (!payment) return 'pending'
  if (payment.status === 'completed') return 'settled'
  if (payment.status === 'refunded') return 'refunded'
  if (payment.status === 'partially_refunded') return 'partial refund'
  if (payment.status === 'cancelled') return 'cancelled'
  if (payment.status === 'failed') return 'failed'
  return 'pending'
}

function getVendorShare(payment) {
  const amount = Number(payment?.amount || 0)
  if (!amount) return 0
  if (['refunded', 'cancelled', 'failed'].includes(String(payment?.status || ''))) return 0
  return Math.max(0, amount - Math.round(amount * 0.05))
}

function getCommissionAmount(payment) {
  const amount = Number(payment?.amount || 0)
  if (!amount || ['refunded', 'cancelled', 'failed'].includes(String(payment?.status || ''))) return 0
  return Math.round(amount * 0.05)
}

function getCustomerLabel(payment) {
  return payment?.customerSnapshot?.name || payment?.user?.name || 'Guest'
}

function isRevenueEligible(payment) {
  const status = String(payment?.status || '')
  return status === 'completed'
}
