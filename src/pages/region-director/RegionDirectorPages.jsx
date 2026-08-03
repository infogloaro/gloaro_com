import { useEffect, useState } from 'react'
import { Eye, Package, BriefcaseBusiness, Building2, Phone, Mail, MapPin, Globe } from 'lucide-react'
import { adminApi } from '../../api/admin'
import api from '../../api/axios'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import { formatCurrency, formatDate } from '../../utils/format'
import ResourceListPage from '../shared/ResourceListPage'

export function RegionDirectorProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    adminApi.categories({ limit: 100 })
      .then((res) => {
        setCategories((res.data?.data || res.data || []).map(cat => ({ value: cat._id, label: cat.name })))
      })
      .catch(() => {})
  }, [])

  const filters = [
    { key: 'status', label: 'Status', options: ['pending', 'approved', 'rejected', 'suspended'].map(s => ({ value: s, label: s.toUpperCase() })) },
    { key: 'category', label: 'Category', options: categories }
  ]

  return (
    <>
      <ResourceListPage
        readOnly={true}
        title="Products Monitoring"
        description="Region-wide view of products offered by approved vendors in your assigned region."
        fetcher={adminApi.products}
        filters={filters}
        columns={[
          {
            key: 'image',
            header: 'Image',
            render: (row) => {
              const url = row.images?.find((img) => img.isMain)?.url || row.images?.[0]?.url
              return url ? (
                <img src={url} alt={row.title} className="h-10 w-10 rounded-md object-cover border border-slate-100" />
              ) : (
                <div className="grid h-10 w-10 place-items-center rounded-md bg-slate-100 border border-slate-200">
                  <Package className="h-5 w-5 text-slate-400" />
                </div>
              )
            }
          },
          { key: 'title', header: 'Product Name' },
          { key: 'category', header: 'Category', render: (row) => row.category?.name || '-' },
          { key: 'vendorName', header: 'Vendor Name', render: (row) => row.vendor?.ownerName || row.vendor?.user?.name || '-' },
          { key: 'businessName', header: 'Business Name', render: (row) => row.vendor?.businessName || '-' },
          { key: 'vendorMobile', header: 'Vendor Mobile', render: (row) => row.vendor?.phone || '-' },
          { key: 'vendorEmail', header: 'Vendor Email', render: (row) => row.vendor?.email || '-' },
          { key: 'price', header: 'Price', render: (row) => formatCurrency(row.pricing?.sellingPrice) },
          { key: 'stock', header: 'Stock', render: (row) => row.inventory?.isUnlimited ? 'Unlimited' : (row.inventory?.quantity ?? 0) },
          { key: 'status', header: 'Product Status', render: (row) => <StatusBadge value={row.status} /> },
          { key: 'createdAt', header: 'Created Date', render: (row) => formatDate(row.createdAt) }
        ]}
        renderActions={(row) => (
          <button
            onClick={() => setSelectedProduct(row)}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#0d4697]/25 px-2.5 py-1.5 text-xs font-bold text-[#0d4697] hover:bg-blue-50 transition"
          >
            <Eye className="h-3.5 w-3.5" />
            View Details
          </button>
        )}
      />

      <Modal open={Boolean(selectedProduct)} title="Product Details" onClose={() => setSelectedProduct(null)}>
        {selectedProduct && (
          <div className="space-y-4 text-sm font-semibold text-slate-700">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              {(() => {
                const url = selectedProduct.images?.find((img) => img.isMain)?.url || selectedProduct.images?.[0]?.url
                return url ? (
                  <img src={url} alt={selectedProduct.title} className="h-16 w-16 rounded-lg object-cover border border-slate-200" />
                ) : (
                  <div className="grid h-16 w-16 place-items-center rounded-lg bg-slate-100 border border-slate-200">
                    <Package className="h-8 w-8 text-slate-400" />
                  </div>
                )
              })()}
              <div>
                <h3 className="text-base font-extrabold text-slate-950">{selectedProduct.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">SKU: {selectedProduct.sku || '-'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Vendor Name</p>
                <p className="mt-0.5 text-slate-900">{selectedProduct.vendor?.ownerName || selectedProduct.vendor?.user?.name || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Business Name</p>
                <p className="mt-0.5 text-slate-900">{selectedProduct.vendor?.businessName || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Vendor Mobile</p>
                <p className="mt-0.5 text-slate-900">{selectedProduct.vendor?.phone || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Vendor Email</p>
                <p className="mt-0.5 text-slate-900">{selectedProduct.vendor?.email || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Category</p>
                <p className="mt-0.5 text-slate-900">{selectedProduct.category?.name || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Price (MRP / Selling)</p>
                <p className="mt-0.5 text-slate-900">
                  {formatCurrency(selectedProduct.pricing?.mrp)} / {formatCurrency(selectedProduct.pricing?.sellingPrice)}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Stock</p>
                <p className="mt-0.5 text-slate-900">{selectedProduct.inventory?.isUnlimited ? 'Unlimited' : selectedProduct.inventory?.quantity}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Status</p>
                <div className="mt-1"><StatusBadge value={selectedProduct.status} /></div>
              </div>
            </div>
            {selectedProduct.description && (
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-bold uppercase text-slate-400">Description</p>
                <p className="mt-1 text-xs font-medium text-slate-600 leading-relaxed max-h-48 overflow-y-auto pr-2">{selectedProduct.description}</p>
              </div>
            )}
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button onClick={() => setSelectedProduct(null)} className="h-9 rounded-md bg-slate-100 px-4 text-xs font-bold text-slate-700 hover:bg-slate-200 transition">Close</button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

export function RegionDirectorServicesPage() {
  const [selectedService, setSelectedService] = useState(null)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    adminApi.categories({ limit: 100 })
      .then((res) => {
        setCategories((res.data?.data || res.data || []).map(cat => ({ value: cat._id, label: cat.name })))
      })
      .catch(() => {})
  }, [])

  const filters = [
    { key: 'status', label: 'Status', options: ['pending', 'approved', 'rejected', 'draft'].map(s => ({ value: s, label: s.toUpperCase() })) },
    { key: 'category', label: 'Category', options: categories }
  ]

  return (
    <>
      <ResourceListPage
        readOnly={true}
        title="Services Monitoring"
        description="Region-wide view of services offered by approved vendors in your assigned region."
        fetcher={adminApi.services}
        filters={filters}
        columns={[
          {
            key: 'image',
            header: 'Image',
            render: (row) => {
              const url = row.gallery?.[0]?.url
              return url ? (
                <img src={url} alt={row.title} className="h-10 w-10 rounded-md object-cover border border-slate-100" />
              ) : (
                <div className="grid h-10 w-10 place-items-center rounded-md bg-slate-100 border border-slate-200">
                  <BriefcaseBusiness className="h-5 w-5 text-slate-400" />
                </div>
              )
            }
          },
          { key: 'title', header: 'Service Name' },
          { key: 'category', header: 'Category', render: (row) => row.category?.name || '-' },
          { key: 'vendorName', header: 'Vendor Name', render: (row) => row.vendor?.ownerName || row.vendor?.user?.name || '-' },
          { key: 'businessName', header: 'Business Name', render: (row) => row.vendor?.businessName || '-' },
          { key: 'vendorMobile', header: 'Vendor Mobile', render: (row) => row.vendor?.phone || '-' },
          { key: 'vendorEmail', header: 'Vendor Email', render: (row) => row.vendor?.email || '-' },
          {
            key: 'price',
            header: 'Price',
            render: (row) => {
              const type = row.pricing?.type
              const min = row.pricing?.minPrice
              const max = row.pricing?.maxPrice
              if (type === 'fixed') return formatCurrency(min)
              if (type === 'range') return `${formatCurrency(min)} - ${formatCurrency(max)}`
              return String(type).toUpperCase()
            }
          },
          {
            key: 'availability',
            header: 'Availability',
            render: (row) => row.availability?.isAvailable ? (row.availability?.days?.length ? row.availability.days.join(', ') : 'Available') : 'Unavailable'
          },
          { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          { key: 'createdAt', header: 'Created Date', render: (row) => formatDate(row.createdAt) }
        ]}
        renderActions={(row) => (
          <button
            onClick={() => setSelectedService(row)}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#0d4697]/25 px-2.5 py-1.5 text-xs font-bold text-[#0d4697] hover:bg-blue-50 transition"
          >
            <Eye className="h-3.5 w-3.5" />
            View Details
          </button>
        )}
      />

      <Modal open={Boolean(selectedService)} title="Service Details" onClose={() => setSelectedService(null)}>
        {selectedService && (
          <div className="space-y-4 text-sm font-semibold text-slate-700">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              {(() => {
                const url = selectedService.gallery?.[0]?.url
                return url ? (
                  <img src={url} alt={selectedService.title} className="h-16 w-16 rounded-lg object-cover border border-slate-200" />
                ) : (
                  <div className="grid h-16 w-16 place-items-center rounded-lg bg-slate-100 border border-slate-200">
                    <BriefcaseBusiness className="h-8 w-8 text-slate-400" />
                  </div>
                )
              })()}
              <div>
                <h3 className="text-base font-extrabold text-slate-950">{selectedService.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">ID: {selectedService.serviceId || '-'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Vendor Name</p>
                <p className="mt-0.5 text-slate-900">{selectedService.vendor?.ownerName || selectedService.vendor?.user?.name || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Business Name</p>
                <p className="mt-0.5 text-slate-900">{selectedService.vendor?.businessName || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Vendor Mobile</p>
                <p className="mt-0.5 text-slate-900">{selectedService.vendor?.phone || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Vendor Email</p>
                <p className="mt-0.5 text-slate-900">{selectedService.vendor?.email || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Category</p>
                <p className="mt-0.5 text-slate-900">{selectedService.category?.name || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Pricing Type / Cost</p>
                <p className="mt-0.5 text-slate-900">
                  {String(selectedService.pricing?.type).toUpperCase()} (
                  {selectedService.pricing?.type === 'fixed' ? formatCurrency(selectedService.pricing?.minPrice) : selectedService.pricing?.type === 'range' ? `${formatCurrency(selectedService.pricing?.minPrice)} - ${formatCurrency(selectedService.pricing?.maxPrice)}` : 'Custom'}
                  )
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Status</p>
                <div className="mt-1"><StatusBadge value={selectedService.status} /></div>
              </div>
            </div>
            {selectedService.description && (
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-bold uppercase text-slate-400">Description</p>
                <p className="mt-1 text-xs font-medium text-slate-600 leading-relaxed max-h-48 overflow-y-auto pr-2">{selectedService.description}</p>
              </div>
            )}
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button onClick={() => setSelectedService(null)} className="h-9 rounded-md bg-slate-100 px-4 text-xs font-bold text-slate-700 hover:bg-slate-200 transition">Close</button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

export function RegionDirectorVendorsPage() {
  const [selected, setSelected] = useState(null)

  const filters = [
    { key: 'status', label: 'Status', options: ['pending', 'approved', 'rejected', 'suspended'].map(s => ({ value: s, label: s.toUpperCase() })) }
  ]

  return (
    <>
      <ResourceListPage
        readOnly={true}
        title="Vendors Monitoring"
        description="Browse directory of approved marketplace vendors in your region."
        fetcher={(params) => api.get('/vendors', { params: { ...params, status: 'approved' } })}
        filters={filters}
        columns={[
          { key: 'ownerName', header: 'Vendor Name' },
          { key: 'businessName', header: 'Business Name' },
          { key: 'category', header: 'Category', render: (row) => row.businessCategory?.name || '-' },
          { key: 'phone', header: 'Mobile', render: (row) => row.phone || '-' },
          { key: 'email', header: 'Email', render: (row) => row.email || '-' },
          { key: 'region', header: 'Region', render: (row) => row.regionId?.name || '-' },
          { key: 'state', header: 'State', render: (row) => row.stateId?.name || '-' },
          { key: 'district', header: 'District', render: (row) => row.districtId?.name || '-' },
          { key: 'chapter', header: 'Chapter', render: (row) => row.chapterId?.name || '-' },
          { key: 'approvedAt', header: 'Approval Date', render: (row) => formatDate(row.approvedAt || row.createdAt) },
          { key: 'status', header: 'Vendor Status', render: (row) => <StatusBadge value={row.status} /> },
        ]}
        renderActions={(row) => (
          <button
            onClick={() => setSelected(row)}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#0d4697]/20 px-3 py-1.5 text-xs font-extrabold text-[#0d4697] hover:bg-blue-50"
          >
            <Eye className="h-3.5 w-3.5" />
            View Vendor Profile
          </button>
        )}
      />

      <Modal open={Boolean(selected)} title="Vendor Profile details" onClose={() => setSelected(null)} maxWidth="max-w-4xl">
        {selected && (
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 bg-slate-50 p-5 rounded-xl sm:flex-row sm:items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#0d4697]">Active Vendor</p>
                <h3 className="mt-1 text-xl font-extrabold text-slate-950">{selected.businessName}</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1">{selected.businessCategory?.name || 'Category'}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge value={selected.status} />
                <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-slate-600 ring-1 ring-slate-200">
                  ID: {selected.vendorId}
                </span>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <section className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
                <h4 className="text-sm font-extrabold text-slate-950 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-[#0d4697]" />
                  Vendor Details
                </h4>
                <div className="space-y-3 text-xs font-bold text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Owner Name</span>
                    <span>{selected.ownerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phone Number</span>
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {selected.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email Address</span>
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {selected.email}</span>
                  </div>
                  {selected.website && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Website</span>
                      <a href={selected.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#0d4697] hover:underline">
                        <Globe className="h-3 w-3" /> Visit Site
                      </a>
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
                <h4 className="text-sm font-extrabold text-slate-950 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#0d4697]" />
                  Business Address
                </h4>
                <div className="space-y-3 text-xs font-bold text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Street</span>
                    <span>{selected.address?.street}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">City</span>
                    <span>{selected.address?.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">State</span>
                    <span>{selected.address?.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pincode</span>
                    <span>{selected.address?.pincode}</span>
                  </div>
                </div>
              </section>
            </div>
            <div className="flex justify-end border-t border-slate-100 pt-4">
              <button onClick={() => setSelected(null)} className="h-9 rounded-md bg-slate-100 px-4 text-xs font-bold text-slate-700 hover:bg-slate-200 transition">Close</button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
