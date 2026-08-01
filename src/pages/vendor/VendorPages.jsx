import { useEffect, useMemo, useState } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { vendorApi } from '../../api/vendor'
import { customerApi } from '../../api/customer'
import StatusBadge from '../../components/common/StatusBadge'
import { formatCurrency, formatDate } from '../../utils/format'
import NotificationsPage from '../shared/NotificationsPage'
import ProfilePage from '../shared/ProfilePage'
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

export function VendorProfilePage() {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <ResourceListPage title="Business Profile" fetcher={async () => {
        try {
          const response = await vendorApi.profile()
          return { data: { data: response.data.data ? [response.data.data] : [] } }
        } catch (error) {
          if (error.response?.status === 404) return { data: { data: [] } }
          throw error
        }
      }} columns={[{ key: 'businessName', header: 'Business' }, { key: 'status', header: 'Verification', render: (row) => <StatusBadge value={row.status} /> }, { key: 'plan', header: 'Plan', render: (row) => row.membership?.plan || 'free' }]} />
      <ProfilePage />
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

export function VendorOrdersPage() {
  const [orders, setOrders] = useState([])
  const [dashboard, setDashboard] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrderId, setSelectedOrderId] = useState(null)
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

  const stats = useMemo(() => {
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + Number(order.total || 0), 0)
    return {
      totalOrders: orders.length,
      pendingOrders: orders.filter((order) => ['placed', 'confirmed'].includes(order.status)).length,
      processingOrders: orders.filter((order) => ['processing', 'shipped'].includes(order.status)).length,
      deliveredOrders: orders.filter((order) => order.status === 'delivered').length,
      cancelledOrders: orders.filter((order) => order.status === 'cancelled').length,
      totalRevenue,
      avgOrderValue: orders.length ? Math.round(totalRevenue / orders.length) : 0,
      dashboardOrders: dashboard?.stats?.totalOrders || 0,
    }
  }, [dashboard?.stats?.totalOrders, filteredOrders, orders])

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
          <MetricCard label="Revenue" value={formatCurrency(stats.totalRevenue)} helper="Visible orders" icon={Banknote} accent="slate" />
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
                  className="w-64 bg-transparent text-xs font-semibold outline-none placeholder:text-slate-400"
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
          }} />

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-black text-slate-900">Seller Notes</h4>
                <p className="text-sm font-semibold text-slate-500">Use this space for fulfillment reminders or packing instructions.</p>
              </div>
            </div>
            <textarea
              rows={5}
              className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-[#0d4697]"
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
  const [replyText, setReplyText] = useState({})

  useEffect(() => {
    vendorApi.reviews()
      .then(res => setReviews(res.data?.data || res.data || []))
      .catch(() => {})
  }, [])

  const handleSendReply = (reviewId) => {
    const text = replyText[reviewId]
    if (!text?.trim()) return
    toast.success('Reply submitted to customer review')
    setReplyText(curr => ({ ...curr, [reviewId]: '' }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Customer Reviews & Ratings</h2>
        <p className="text-sm font-semibold text-slate-500">View customer ratings, comment logs, and write response replies.</p>
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

              <div className="space-y-2 border-t border-slate-100 pt-4">
                <p className="text-[10px] font-black uppercase text-slate-400">Reply to Review</p>
                <div className="flex gap-2">
                  <input
                    placeholder="Type your response reply..."
                    value={replyText[r._id] || ''}
                    onChange={e => setReplyText(curr => ({ ...curr, [r._id]: e.target.value }))}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold outline-none"
                  />
                  <button
                    onClick={() => handleSendReply(r._id)}
                    className="rounded-lg bg-[#0d4697] px-4 py-1.5 text-xs font-extrabold text-white hover:bg-blue-800 shrink-0"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export function VendorMembershipPage() {
  const [history, setHistory] = useState([])
  const [activeTab, setActiveTab] = useState('membership')

  useEffect(() => {
    vendorApi.membershipHistory()
      .then(res => setHistory(res.data?.data || res.data || []))
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Subscription & Billing</h2>
        <p className="text-sm font-semibold text-slate-500">Manage your vendor membership packages, renewal dates, and billing statements.</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-px">
        {['membership', 'renewal', 'billing'].map((tab) => (
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

      {activeTab === 'membership' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 text-left max-w-xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-400">Current Package</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1 capitalize">{history[0]?.plan || 'Gold Vendor'}</h3>
            </div>
            <StatusBadge value={history[0]?.status || 'active'} />
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-100">
            <div>
              <p className="font-bold text-slate-400">Price Rate</p>
              <p className="font-extrabold text-slate-800 mt-0.5">{formatCurrency(history[0]?.price || 12000)} / year</p>
            </div>
            <div>
              <p className="font-bold text-slate-400">Expires Date</p>
              <p className="font-extrabold text-slate-800 mt-0.5">{formatDate(history[0]?.endDate || new Date(Date.now() + 31536000000))}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'renewal' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 text-left max-w-xl">
          <h3 className="text-sm font-black uppercase text-slate-800">Renew Plan Subscription</h3>
          <p className="text-xs font-semibold text-slate-500 leading-relaxed">
            Choose to automatically renew your yearly subscription plan or upgrade to Platinum plan to unlock limitless product listings and zero commission.
          </p>
          <button
            onClick={() => toast.success('Plan renewal scheduled!')}
            className="rounded-lg bg-[#0d4697] px-4 py-2 text-xs font-extrabold text-white hover:bg-blue-800"
          >
            Settle Renewal Package
          </button>
        </div>
      )}

      {activeTab === 'billing' && (
        <DataTable
          columns={[
            { key: 'plan', header: 'Plan' },
            { key: 'billingCycle', header: 'Billing Cycle' },
            { key: 'price', header: 'Price', render: (row) => formatCurrency(row.price) },
            { key: 'endDate', header: 'Ends On', render: (row) => formatDate(row.endDate) },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> }
          ]}
          rows={history}
        />
      )}
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
      <p className="mt-4 text-2xl font-black text-slate-900">{value ?? 0}</p>
      {helper && <p className="mt-1 text-xs font-semibold text-slate-500">{helper}</p>}
    </div>
  )
}

function OrderDetailPanel({ order, onCopyOrderNumber }) {
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

  useEffect(() => {
    vendorApi.payments()
      .then(res => setPayments(res.data?.data || res.data || []))
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Payments & Commission Settle</h2>
        <p className="text-sm font-semibold text-slate-500">Track transaction records, overall earnings, and chapter settlements.</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-px">
        {['earnings', 'settlement', 'transactions'].map((tab) => (
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

      {activeTab === 'earnings' && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm text-left">
            <p className="text-[10px] font-black uppercase text-slate-400">Gross Sales</p>
            <p className="text-xl font-black text-slate-800 mt-2">₹4,85,250</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm text-left">
            <p className="text-[10px] font-black uppercase text-slate-400">Commission Deducted (5%)</p>
            <p className="text-xl font-black text-[#0d4697] mt-2">₹24,260</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm text-left">
            <p className="text-[10px] font-black uppercase text-[#ffbf1a]">Net Earnings</p>
            <p className="text-xl font-black text-emerald-700 mt-2">₹4,60,990</p>
          </div>
        </div>
      )}

      {activeTab === 'settlement' && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 text-left">
          <h3 className="text-xs font-black uppercase text-slate-800">Monthly Settle Ledger</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
              <span>Settle Period: July 2026</span>
              <span className="font-extrabold text-emerald-700">Settled (₹1,45,280)</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
              <span>Settle Period: June 2026</span>
              <span className="font-extrabold text-emerald-700">Settled (₹3,15,710)</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <DataTable
          columns={[
            { key: 'type', header: 'Type' },
            { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.amount, row.currency) },
            { key: 'gateway', header: 'Gateway' },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          ]}
          rows={payments}
        />
      )}
    </div>
  )
}

export function VendorNotificationsPage() {
  return <NotificationsPage />
}

export function VendorSupportPage() {
  return <ResourceListPage title="Support Tickets" fetcher={customerApi.support} createAction={async (data) => { await customerApi.createTicket(data); toast.success('Ticket created') }} columns={[{ key: 'ticketNumber', header: 'Ticket' }, { key: 'subject', header: 'Subject' }, { key: 'priority', header: 'Priority' }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> }]} renderForm={(props) => <SimpleJsonForm {...props} fields={[{ name: 'subject' }, { name: 'description', type: 'textarea' }, { name: 'category' }, { name: 'priority', type: 'select', options: ['low', 'medium', 'high', 'critical'].map((value) => ({ value, label: value })) }]} />} />
}
