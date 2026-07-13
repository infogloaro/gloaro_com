import { useEffect, useState } from 'react'
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
  Users, FileText, HelpCircle, FileBarChart, CreditCard 
} from 'lucide-react'

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
      api.get('/categories?type=product'),
      vendorApi.products()
    ]).then(([catRes, prodRes]) => {
      const catList = catRes.data?.data || catRes.data || []
      setCategories(catList.map(cat => ({ value: cat._id, label: cat.name })))
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
              <p className="text-[10px] font-bold text-slate-400 mt-1">Product Category</p>
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
      api.get('/categories?type=service'),
      vendorApi.services()
    ]).then(([catRes, servRes]) => {
      const catList = catRes.data?.data || catRes.data || []
      setCategories(catList.map(cat => ({ value: cat._id, label: cat.name })))
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
              <p className="text-[10px] font-bold text-slate-400 mt-1">Service Category</p>
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
  const [leads, setLeads] = useState([])
  const [activeTab, setActiveTab] = useState('processing')

  useEffect(() => {
    vendorApi.leads()
      .then(res => setLeads(res.data?.data || res.data || []))
      .catch(() => {})
  }, [])

  const getStatusList = () => {
    if (activeTab === 'pending') return leads.filter(l => l.status === 'new')
    if (activeTab === 'processing') return leads.filter(l => ['contacted', 'qualified', 'proposal_sent'].includes(l.status))
    if (activeTab === 'completed') return leads.filter(l => l.status === 'won')
    if (activeTab === 'cancelled') return leads.filter(l => l.status === 'lost')
    return []
  }

  const list = getStatusList()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Orders & Bookings</h2>
        <p className="text-sm font-semibold text-slate-500">Track purchase transactions, processing states, and download invoices.</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-px">
        {['pending', 'processing', 'completed', 'cancelled', 'invoice'].map((tab) => (
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

      {activeTab === 'invoice' ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm max-w-2xl text-left space-y-4">
          <div className="flex justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="font-playfair text-2xl font-bold text-[#0d4697]">GLOARO INVOICE</p>
              <p className="text-xs font-semibold text-slate-400 mt-1">Invoice #: INV-2026-00419</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-extrabold text-slate-800">Gloaro Verified Business</p>
              <p className="text-[10px] font-semibold text-slate-500 mt-1">Commission Settle Ledger</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-bold text-slate-400">Billed To:</p>
              <p className="font-extrabold text-slate-800 mt-1">Premium Customer</p>
              <p className="text-slate-500 mt-0.5">Chennai District Chapter</p>
            </div>
            <div>
              <p className="font-bold text-slate-400">Date Issued:</p>
              <p className="font-extrabold text-slate-800 mt-1">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-2 font-black text-slate-600">Product / Service</th>
                <th className="py-2 font-black text-slate-600 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-3 font-semibold text-slate-700">Corporate Consultation Deal</td>
                <td className="py-3 font-extrabold text-slate-800 text-right">₹45,000</td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-end pt-4">
            <button
              onClick={() => { toast.success('Invoice PDF downloading...') }}
              className="rounded-lg bg-[#0d4697] px-4 py-2 text-xs font-extrabold text-white hover:bg-blue-800"
            >
              Download PDF Invoice
            </button>
          </div>
        </div>
      ) : (
        <DataTable
          columns={[
            { key: 'name', header: 'Customer' },
            { key: 'phone', header: 'Phone' },
            { key: 'subject', header: 'Enquiry / Product' },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            { key: 'action', header: 'Invoice', render: (row) => (
              <button
                onClick={() => setActiveTab('invoice')}
                className="text-xs font-extrabold text-[#0d4697] hover:underline"
              >
                View Invoice
              </button>
            )}
          ]}
          rows={list}
        />
      )}
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
