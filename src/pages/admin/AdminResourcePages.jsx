import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { CheckCircle2, ExternalLink, Eye, FileText, Loader2, XCircle, Package, BriefcaseBusiness, AlertCircle, MapPinned } from 'lucide-react'
import api from '../../api/axios'
import { adminApi } from '../../api/admin'
import DataTable from '../../components/tables/DataTable'
import FormField from '../../components/forms/FormField'
import Modal from '../../components/common/Modal'
import SearchBar from '../../components/common/SearchBar'
import StatusBadge from '../../components/common/StatusBadge'
import { useAuth } from '../../hooks/useAuth'
import { formatCurrency, formatDate, getList, getPagination } from '../../utils/format'
import ResourceListPage from '../shared/ResourceListPage'
import SimpleJsonForm from '../shared/SimpleJsonForm'
import { ROLES } from '../../constants/roleConfig.js'

const statusFilters = [{ key: 'status', label: 'Status', options: ['pending', 'approved', 'rejected', 'active', 'completed', 'failed'].map((value) => ({ value, label: value })) }]

function BannerForm({ initialValues = {}, onSubmit }) {
  const safeInitialValues = initialValues || {}
  const defaultValues = useMemo(() => ({
    title: safeInitialValues.title || '',
    subtitle: safeInitialValues.subtitle || '',
    placement: safeInitialValues.placement || 'marketplace',
    link: safeInitialValues.link || '',
    order: safeInitialValues.order ?? 0,
    isActive: safeInitialValues.isActive ?? true,
  }), [
    safeInitialValues.title,
    safeInitialValues.subtitle,
    safeInitialValues.placement,
    safeInitialValues.link,
    safeInitialValues.order,
    safeInitialValues.isActive,
  ])

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues,
  })

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const submit = (values) => {
    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('subtitle', values.subtitle || '')
    formData.append('placement', values.placement)
    formData.append('link', values.link || '')
    formData.append('order', String(values.order ?? 0))
    formData.append('isActive', String(values.isActive !== 'false'))

    const image = values.image?.[0]
    const mobileImage = values.mobileImage?.[0]
    if (image) formData.append('image', image)
    if (mobileImage) formData.append('mobileImage', mobileImage)

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Title">
          <input {...register('title', { required: true })} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-black outline-none focus:border-[#0d4697]" />
        </FormField>
        <FormField label="Placement">
          <select {...register('placement')} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-black outline-none focus:border-[#0d4697]">
            {['home', 'directory', 'marketplace', 'events', 'dashboard'].map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </FormField>
      </div>

      <FormField label="Subtitle">
        <textarea {...register('subtitle')} rows={4} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-black outline-none focus:border-[#0d4697]" />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Link">
          <input {...register('link')} type="url" className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-black outline-none focus:border-[#0d4697]" />
        </FormField>
        <FormField label="Order">
          <input {...register('order', { valueAsNumber: true })} type="number" min="0" className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-black outline-none focus:border-[#0d4697]" />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Desktop Image">
          <input {...register('image')} type="file" accept="image/*" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-xs file:font-extrabold file:text-[#0d4697]" />
          {safeInitialValues?.image?.url && <img src={safeInitialValues.image.url} alt="" className="mt-2 h-24 w-full rounded-md object-cover" />}
        </FormField>
        <FormField label="Mobile Image">
          <input {...register('mobileImage')} type="file" accept="image/*" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-xs file:font-extrabold file:text-[#0d4697]" />
          {safeInitialValues?.mobileImage?.url && <img src={safeInitialValues.mobileImage.url} alt="" className="mt-2 h-24 w-full rounded-md object-cover" />}
        </FormField>
      </div>

      <FormField label="Status">
        <select {...register('isActive')} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-black outline-none focus:border-[#0d4697]">
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </FormField>

      <button disabled={isSubmitting} className="h-11 rounded-md bg-[#0d4697] px-5 text-sm font-extrabold text-white disabled:opacity-60">Save</button>
    </form>
  )
}

function LeaderForm({ initialValues = {}, onSubmit }) {
  const safeInitialValues = initialValues || {}
  const defaultValues = useMemo(() => ({
    name: safeInitialValues.name || '',
    role: safeInitialValues.role || '',
    bio: safeInitialValues.bio || '',
    order: safeInitialValues.order ?? 0,
    isActive: safeInitialValues.isActive ?? true,
    visionTitle: safeInitialValues.visionTitle || '',
    visionHighlight: safeInitialValues.visionHighlight || '',
    visionDescription: safeInitialValues.visionDescription || '',
    visionPoints: safeInitialValues.visionPoints?.length ? safeInitialValues.visionPoints : [
      { title: '', description: '' },
      { title: '', description: '' },
      { title: '', description: '' }
    ],
  }), [safeInitialValues.name, safeInitialValues.role, safeInitialValues.bio, safeInitialValues.order, safeInitialValues.isActive])
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({ defaultValues })
  useEffect(() => { reset(defaultValues) }, [defaultValues, reset])

  const submit = (values) => {
    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('role', values.role)
    formData.append('bio', values.bio || '')
    formData.append('order', String(values.order ?? 0))
    formData.append('isActive', String(values.isActive !== 'false'))
    formData.append('visionTitle', values.visionTitle || '')
    formData.append('visionHighlight', values.visionHighlight || '')
    formData.append('visionDescription', values.visionDescription || '')
    formData.append('visionPoints', JSON.stringify(values.visionPoints || []))
    if (values.image?.[0]) formData.append('image', values.image[0])
    onSubmit(formData)
  }

  return <form onSubmit={handleSubmit(submit)} className="space-y-4">
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField label="Leader Name"><input {...register('name', { required: true })} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-black outline-none focus:border-[#0d4697]" /></FormField>
      <FormField label="Designation"><input {...register('role', { required: true })} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-black outline-none focus:border-[#0d4697]" /></FormField>
    </div>
    <FormField label="Description"><textarea {...register('bio')} rows={4} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-black outline-none focus:border-[#0d4697]" /></FormField>
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField label="Leader Image"><input {...register('image')} type="file" accept="image/*" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-xs file:font-extrabold file:text-[#0d4697]" />{safeInitialValues.image?.url && <img src={safeInitialValues.image.url} alt="" className="mt-2 h-24 w-24 rounded-md object-cover" />}</FormField>
      <div className="grid gap-4 sm:grid-cols-2"><FormField label="Display Order"><input {...register('order', { valueAsNumber: true })} type="number" min="0" className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-black outline-none focus:border-[#0d4697]" /></FormField><FormField label="Status"><select {...register('isActive')} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-black outline-none focus:border-[#0d4697]"><option value="true">Active</option><option value="false">Inactive</option></select></FormField></div>
    </div>
    
    <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
      <h3 className="mb-4 text-sm font-bold text-slate-800">Executive Vision (Used on Public Page)</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Vision Title (e.g. Leadership That)"><input {...register('visionTitle')} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-black outline-none focus:border-[#0d4697]" /></FormField>
        <FormField label="Vision Highlight (e.g. Drives Growth)"><input {...register('visionHighlight')} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-black outline-none focus:border-[#0d4697]" /></FormField>
      </div>
      <div className="mt-4">
        <FormField label="Vision Description"><textarea {...register('visionDescription')} rows={3} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-black outline-none focus:border-[#0d4697]" /></FormField>
      </div>
      <div className="mt-5 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Vision Points (Up to 3)</h4>
        {[0, 1, 2].map(i => (
          <div key={i} className="grid gap-4 sm:grid-cols-[1fr_2fr]">
            <FormField label={`Point ${i+1} Title`}><input {...register(`visionPoints.${i}.title`)} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-black outline-none focus:border-[#0d4697]" /></FormField>
            <FormField label={`Point ${i+1} Description`}><input {...register(`visionPoints.${i}.description`)} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-black outline-none focus:border-[#0d4697]" /></FormField>
          </div>
        ))}
      </div>
    </div>
    <button disabled={isSubmitting} className="h-11 rounded-md bg-[#0d4697] px-5 text-sm font-extrabold text-white disabled:opacity-60">Save</button>
  </form>
}

function GalleryForm({ initialValues = {}, onSubmit }) {
  const safeInitialValues = initialValues || {}
  const defaultValues = useMemo(() => ({ title: safeInitialValues.title || '', order: safeInitialValues.order ?? 0, isActive: safeInitialValues.isActive ?? true }), [safeInitialValues.title, safeInitialValues.order, safeInitialValues.isActive])
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({ defaultValues })
  useEffect(() => { reset(defaultValues) }, [defaultValues, reset])
  const submit = (values) => {
    const formData = new FormData()
    formData.append('title', values.title || '')
    formData.append('order', String(values.order ?? 0))
    formData.append('isActive', String(values.isActive !== 'false'))
    if (values.image?.[0]) formData.append('image', values.image[0])
    onSubmit(formData)
  }
  return <form onSubmit={handleSubmit(submit)} className="space-y-4">
    <FormField label="Image title (optional)"><input {...register('title')} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-black outline-none focus:border-[#0d4697]" /></FormField>
    <FormField label="Gallery Image"><input {...register('image', { required: !safeInitialValues._id })} type="file" accept="image/*" className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-xs file:font-extrabold file:text-[#0d4697]" />{safeInitialValues.image?.url && <img src={safeInitialValues.image.url} alt="" className="mt-2 h-28 w-40 rounded-md object-cover" />}</FormField>
    <div className="grid gap-4 sm:grid-cols-2"><FormField label="Display Order"><input {...register('order', { valueAsNumber: true })} type="number" min="0" className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-black outline-none focus:border-[#0d4697]" /></FormField><FormField label="Status"><select {...register('isActive')} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-black outline-none focus:border-[#0d4697]"><option value="true">Active</option><option value="false">Inactive</option></select></FormField></div>
    <button disabled={isSubmitting} className="h-11 rounded-md bg-[#0d4697] px-5 text-sm font-extrabold text-white disabled:opacity-60">Save</button>
  </form>
}

export function AdminUsersPage() {
  return <ResourceListPage module="members" section="users" title="User Management" fetcher={adminApi.users} filters={[{ key: 'role', label: 'Role', options: [ROLES.CUSTOMER, ROLES.VENDOR, ROLES.ADMIN, ROLES.SUPERADMIN].map((value) => ({ value, label: value })) }]} columns={[
    { key: 'name', header: 'Name' }, { key: 'email', header: 'Email' }, { key: 'role', header: 'Role' }, { key: 'isActive', header: 'Status', render: (row) => <StatusBadge value={row.isActive ? 'active' : 'blocked'} /> },
  ]} updateAction={adminApi.updateUser} deleteAction={adminApi.deleteUser} renderForm={(props) => <SimpleJsonForm {...props} fields={[{ name: 'name' }, { name: 'phone' }, { name: 'role', type: 'select', options: [ROLES.CUSTOMER, ROLES.VENDOR, ROLES.ADMIN].map((value) => ({ value, label: value })) }]} />} />
}

export function AdminVendorsPage() {
  const [vendorProductsOpen, setVendorProductsOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [vendorProducts, setVendorProducts] = useState([])
  const [vendorProductsLoading, setVendorProductsLoading] = useState(false)

  const loadVendorProducts = async (vendor) => {
    if (!vendor?._id) return
    setSelectedVendor(vendor)
    setVendorProductsOpen(true)
    setVendorProductsLoading(true)
    try {
      const response = await adminApi.products({ vendor: vendor._id, status: 'all', limit: 100 })
      setVendorProducts(response.data?.data || response.data || [])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load vendor products')
    } finally {
      setVendorProductsLoading(false)
    }
  }

  const moderateVendor = async (vendor, action, reload) => {
    const reason = action === 'suspend' ? window.prompt('Optional suspension reason') || '' : ''
    try {
      await adminApi.moderateVendor(vendor._id, { action, reason })
      toast.success(`Vendor ${action}d successfully`)
      reload?.()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update vendor')
    }
  }

  return (
    <>
      <ResourceListPage
        module="vendors"
        section="vendors"
        title="Vendor Management"
        fetcher={adminApi.vendors}
        filters={statusFilters}
        columns={[
          { key: 'businessName', header: 'Business' },
          { key: 'email', header: 'Email' },
          { key: 'city', header: 'City', render: (row) => row.address?.city || 'Not added' },
          { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
        ]}
        renderActions={(row, { reload }) => (
          <div className="flex flex-wrap gap-2">
            <button onClick={() => loadVendorProducts(row)} className="inline-flex items-center gap-1 rounded-md border border-[#0d4697]/25 px-2.5 py-1.5 text-xs font-bold text-[#0d4697] hover:bg-blue-50 transition">
              <Eye className="h-3 w-3" />
              View Products
            </button>
            <button onClick={() => moderateVendor(row, row.status === 'suspended' ? 'activate' : 'suspend', reload)} className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 transition">
              {row.status === 'suspended' ? 'Activate' : 'Suspend'}
            </button>
          </div>
        )}
      />

      <Modal open={vendorProductsOpen} title={`${selectedVendor?.businessName || 'Vendor'} Products`} onClose={() => setVendorProductsOpen(false)} maxWidth="max-w-6xl">
        {vendorProductsLoading ? (
          <div className="grid min-h-40 place-items-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#0d4697]" />
          </div>
        ) : (
          <DataTable
            columns={[
              { key: 'title', header: 'Product' },
              { key: 'category', header: 'Category', render: (row) => row.category?.name || '-' },
              { key: 'visibility', header: 'Visibility', render: (row) => <StatusBadge value={row.isHidden ? 'hidden' : 'visible'} /> },
              { key: 'state', header: 'State', render: (row) => <StatusBadge value={row.isActive ? 'active' : 'disabled'} /> },
            ]}
            rows={vendorProducts}
          />
        )}
      </Modal>
    </>
  )
}

export function AdminCategoriesPage() {
  const moderateCategory = async (row, action, reload) => {
    try {
      await adminApi.moderateCategory(row._id, { action })
      toast.success(`Category ${action}d successfully`)
      reload?.()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update category')
    }
  }

  return (
    <ResourceListPage
      module="settings"
      section="categories"
      title="Category Management"
      fetcher={adminApi.categories}
      createAction={adminApi.createCategory}
      updateAction={adminApi.updateCategory}
      deleteAction={adminApi.deleteCategory}
      columns={[
        { key: 'name', header: 'Name' },
        { key: 'isActive', header: 'Status', render: (row) => <StatusBadge value={row.isActive ? 'active' : 'inactive'} /> },
      ]}
      renderActions={(row, { reload }) => (
        <button
          onClick={() => moderateCategory(row, row.isActive ? 'disable' : 'enable', reload)}
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
        >
          {row.isActive ? 'Disable' : 'Enable'}
        </button>
      )}
      renderForm={(props) => <SimpleJsonForm {...props} fields={[{ name: 'name' }, { name: 'isActive', type: 'select', options: ['true', 'false'].map((value) => ({ value, label: value === 'true' ? 'active' : 'inactive' })) }]} />}
    />
  )
}

export function AdminProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [vendorProductsOpen, setVendorProductsOpen] = useState(false)
  const [vendorProductsVendor, setVendorProductsVendor] = useState(null)
  const [vendorProducts, setVendorProducts] = useState([])
  const [vendorProductsLoading, setVendorProductsLoading] = useState(false)
  const [reloadProducts, setReloadProducts] = useState(null)

  const loadVendorProducts = async (vendor, reload) => {
    if (!vendor?._id) return
    setVendorProductsVendor(vendor)
    setVendorProductsLoading(true)
    setReloadProducts(() => reload)
    setVendorProductsOpen(true)
    try {
      const response = await adminApi.products({ vendor: vendor._id, status: 'all', limit: 100 })
      setVendorProducts(response.data?.data || response.data || [])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load vendor products')
    } finally {
      setVendorProductsLoading(false)
    }
  }

  const refreshSelectedProduct = async () => {
    if (!selectedProduct?._id) return
    const response = await adminApi.products({ vendor: selectedProduct.vendor?._id, status: 'all', limit: 100 })
    const updated = (response.data?.data || response.data || []).find((item) => item._id === selectedProduct._id)
    if (updated) setSelectedProduct(updated)
    reloadProducts?.()
  }

  const moderateProduct = async (action) => {
    if (!selectedProduct?._id) return
    const reason = action === 'hide' ? window.prompt('Optional hide reason') || '' : ''
    try {
      const response = await adminApi.moderateProduct(selectedProduct._id, { action, reason })
      setSelectedProduct(response.data?.data || selectedProduct)
      toast.success(`Product ${action}d successfully`)
      await refreshSelectedProduct()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product')
    }
  }

  const deleteProduct = async () => {
    if (!selectedProduct?._id) return
    if (!window.confirm('Delete this product permanently?')) return
    try {
      await adminApi.deleteProduct(selectedProduct._id)
      toast.success('Product deleted successfully')
      setSelectedProduct(null)
      reloadProducts?.()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product')
    }
  }

  const suspendVendor = async () => {
    const vendor = selectedProduct?.vendor
    if (!vendor?._id) return
    const action = vendor.status === 'suspended' ? 'activate' : 'suspend'
    const reason = action === 'suspend' ? window.prompt('Optional suspension reason') || '' : ''
    try {
      const response = await adminApi.moderateVendor(vendor._id, { action, reason })
      setSelectedProduct((current) => current ? { ...current, vendor: response.data?.data || current.vendor } : current)
      toast.success(`Vendor ${action}d successfully`)
      reloadProducts?.()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update vendor')
    }
  }

  const productColumns = [
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
    { key: 'vendorName', header: 'Vendor Name', render: (row) => row.vendor?.ownerName || row.vendor?.user?.name || '-' },
    { key: 'businessName', header: 'Business Name', render: (row) => row.vendor?.businessName || '-' },
    { key: 'category', header: 'Category', render: (row) => row.category?.name || '-' },
    { key: 'price', header: 'Price', render: (row) => formatCurrency(row.pricing?.sellingPrice) },
    { key: 'stock', header: 'Stock', render: (row) => row.inventory?.isUnlimited ? 'Unlimited' : (row.inventory?.quantity ?? 0) },
    { key: 'visibility', header: 'Visibility', render: (row) => <StatusBadge value={row.isHidden ? 'hidden' : 'visible'} /> },
    { key: 'state', header: 'State', render: (row) => <StatusBadge value={row.isActive ? 'active' : 'disabled'} /> },
    { key: 'createdAt', header: 'Created Date', render: (row) => formatDate(row.createdAt) }
  ]

  return (
    <>
      <ResourceListPage
        module="marketplace"
        section="products"
        title="Product Management"
        fetcher={(params) => adminApi.products({ ...params, status: params.status || 'all' })}
        columns={productColumns}
        renderActions={(row, { reload }) => {
          return (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => { setSelectedProduct(row); setReloadProducts(() => reload) }}
                className="inline-flex items-center gap-1 rounded-md border border-[#0d4697]/25 px-2.5 py-1.5 text-xs font-bold text-[#0d4697] hover:bg-blue-50 transition"
              >
                <Eye className="h-3 w-3" />
                View
              </button>
              <button
                type="button"
                onClick={() => loadVendorProducts(row.vendor, reload)}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Vendor Products
              </button>
            </div>
          )
        }}
      />

      <Modal open={Boolean(selectedProduct)} title="Product Details" onClose={() => setSelectedProduct(null)} maxWidth="max-w-5xl">
        {selectedProduct && (
          <div className="space-y-5 text-sm font-semibold text-slate-700">
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
                <div className="mt-2 flex flex-wrap gap-2">
                  <StatusBadge value={selectedProduct.isHidden ? 'hidden' : 'visible'} />
                  <StatusBadge value={selectedProduct.isActive ? 'active' : 'disabled'} />
                </div>
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
                <p className="text-xs font-bold uppercase text-slate-400">Live Status</p>
                <div className="mt-1"><StatusBadge value={selectedProduct.status} /></div>
              </div>
            </div>

            {selectedProduct.description && (
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-bold uppercase text-slate-400">Description</p>
                <p className="mt-1 text-xs font-medium text-slate-600 leading-relaxed max-h-48 overflow-y-auto pr-2">{selectedProduct.description}</p>
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
              <button onClick={() => moderateProduct(selectedProduct.isHidden ? 'unhide' : 'hide')} className="rounded-md bg-amber-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-amber-700">
                {selectedProduct.isHidden ? 'Unhide Product' : 'Hide Product'}
              </button>
              <button onClick={() => moderateProduct(selectedProduct.isActive ? 'disable' : 'enable')} className="rounded-md border border-slate-200 px-4 py-2 text-xs font-extrabold text-slate-700 hover:bg-slate-50">
                {selectedProduct.isActive ? 'Disable Product' : 'Enable Product'}
              </button>
              <button onClick={deleteProduct} className="rounded-md bg-red-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-red-700">
                Delete Product
              </button>
              <button onClick={suspendVendor} className="rounded-md border border-red-200 px-4 py-2 text-xs font-extrabold text-red-600 hover:bg-red-50">
                {selectedProduct.vendor?.status === 'suspended' ? 'Activate Vendor' : 'Suspend Vendor'}
              </button>
              <button onClick={() => loadVendorProducts(selectedProduct.vendor, reloadProducts)} className="rounded-md border border-[#0d4697]/25 px-4 py-2 text-xs font-extrabold text-[#0d4697] hover:bg-blue-50">
                View Vendor Products
              </button>
              <button onClick={() => setSelectedProduct(null)} className="rounded-md bg-slate-100 px-4 py-2 text-xs font-extrabold text-slate-700 hover:bg-slate-200">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={vendorProductsOpen} title={`${vendorProductsVendor?.businessName || 'Vendor'} Products`} onClose={() => setVendorProductsOpen(false)} maxWidth="max-w-6xl">
        {vendorProductsLoading ? (
          <div className="grid min-h-40 place-items-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#0d4697]" />
          </div>
        ) : (
          <DataTable
            columns={[
              { key: 'title', header: 'Product' },
              { key: 'category', header: 'Category', render: (row) => row.category?.name || '-' },
              { key: 'visibility', header: 'Visibility', render: (row) => <StatusBadge value={row.isHidden ? 'hidden' : 'visible'} /> },
              { key: 'state', header: 'State', render: (row) => <StatusBadge value={row.isActive ? 'active' : 'disabled'} /> },
              { key: 'createdAt', header: 'Created', render: (row) => formatDate(row.createdAt) },
            ]}
            rows={vendorProducts}
          />
        )}
      </Modal>
    </>
  )
}

export function AdminOrdersPage() {
  const [payload, setPayload] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filterValues, setFilterValues] = useState({ status: 'all', paymentStatus: 'all' })
  const [selectedSlice, setSelectedSlice] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [search])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void (async () => {
        setLoading(true)
        try {
          const response = await adminApi.orders({
            page,
            limit: 10,
            search: debouncedSearch || undefined,
            status: filterValues.status && filterValues.status !== 'all' ? filterValues.status : undefined,
            paymentStatus: filterValues.paymentStatus && filterValues.paymentStatus !== 'all' ? filterValues.paymentStatus : undefined,
          })
          setPayload(response.data)
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to load orders')
        } finally {
          setLoading(false)
        }
      })()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [page, debouncedSearch, filterValues.status, filterValues.paymentStatus])

  const rows = useMemo(() => {
    const orders = getList(payload)
    const slices = orders.flatMap((order) => splitOrderByVendor(order))
    const term = debouncedSearch.toLowerCase()

    if (!term) return slices

    return slices.filter((row) => {
      return [
        row.orderNumber,
        row.customerName,
        row.customerEmail,
        row.customerPhone,
        row.vendorLabel,
        row.vendorBusinessName,
        row.itemSummary,
      ].some((value) => String(value || '').toLowerCase().includes(term))
    })
  }, [debouncedSearch, payload])

  const pagination = getPagination(payload)

  const openDetails = async (row) => {
    setSelectedSlice(row)
    setSelectedOrder(null)
    setDetailsLoading(true)
    try {
      const response = await adminApi.order(row.originalOrderId)
      setSelectedOrder(response.data?.data || response.data || null)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load order details')
    } finally {
      setDetailsLoading(false)
    }
  }

  const selectedVendorSlices = useMemo(() => {
    if (!selectedOrder || !selectedSlice) return []
    return splitOrderByVendor(selectedOrder)
  }, [selectedOrder, selectedSlice])

  const activeVendorSlice = selectedVendorSlices.find((entry) => entry._id === selectedSlice?._id) || selectedSlice
  const otherVendorSlices = selectedVendorSlices.filter((entry) => entry._id !== activeVendorSlice?._id)

  return (
    <>
      <section>
        <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">Order Management</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">Track customer purchases and inspect each vendor share inside the order.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1) }} placeholder="Search order, customer, vendor, item..." />
            <select value={filterValues.status} onChange={(event) => setFilterValues((current) => ({ ...current, status: event.target.value }))} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800">
              {['all', 'placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
            <select value={filterValues.paymentStatus} onChange={(event) => setFilterValues((current) => ({ ...current, paymentStatus: event.target.value }))} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800">
              {['all', 'pending', 'paid', 'failed', 'refunded'].map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </div>
        </div>

        <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
          Each row represents a vendor-specific slice of a customer order, so split-cart purchases are visible separately.
        </div>

        <DataTable
          columns={[
            {
              key: 'orderNumber',
              header: 'Order / Vendor',
              render: (row) => (
                <div>
                  <p className="font-bold text-slate-900">{row.orderNumber}</p>
                  <p className="text-xs font-semibold text-slate-500">{row.vendorLabel}</p>
                  {row.vendorCount > 1 && <p className="text-[11px] font-bold uppercase tracking-wide text-[#0d4697]">Split order</p>}
                </div>
              ),
            },
            {
              key: 'customer',
              header: 'Customer',
              render: (row) => (
                <div>
                  <p className="font-bold text-slate-900">{row.customerName || 'Guest'}</p>
                  <p className="text-xs font-medium text-slate-500">{row.customerPhone || row.customerEmail || '-'}</p>
                </div>
              ),
            },
            {
              key: 'items',
              header: 'Items',
              render: (row) => (
                <div>
                  <p className="font-bold text-slate-900">{row.itemCount} item{row.itemCount === 1 ? '' : 's'}</p>
                  <p className="text-xs font-medium text-slate-500">{row.itemSummary}</p>
                </div>
              ),
            },
            {
              key: 'amount',
              header: 'Vendor Amount',
              render: (row) => (
                <div>
                  <p className="font-bold text-slate-900">{formatCurrency(row.vendorTotal, row.currency)}</p>
                  <p className="text-xs font-medium text-slate-500">Order total {formatCurrency(row.orderTotal, row.currency)}</p>
                </div>
              ),
            },
            {
              key: 'flags',
              header: 'Flags',
              render: (row) => (
                <div className="flex flex-wrap gap-1.5">
                  {row.cancellationRequest && <MiniFlag tone="rose" label="Cancel" />}
                  {row.returnRequest && <MiniFlag tone="amber" label="Return" />}
                  {row.refund && <MiniFlag tone="emerald" label="Refund" />}
                  {!row.cancellationRequest && !row.returnRequest && !row.refund && (
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-500">None</span>
                  )}
                </div>
              ),
            },
            { key: 'paymentStatus', header: 'Payment', render: (row) => <StatusBadge value={row.paymentStatus} /> },
            { key: 'status', header: 'Order Status', render: (row) => <StatusBadge value={row.status} /> },
            { key: 'createdAt', header: 'Created', render: (row) => formatDate(row.createdAt) },
          ]}
          rows={rows}
          loading={loading}
          pagination={pagination}
          onPageChange={setPage}
          actions={(row) => (
            <button
              type="button"
              onClick={() => openDetails(row)}
              className="inline-flex items-center gap-1 rounded-md border border-[#0d4697] bg-white px-3 py-1.5 text-xs font-bold text-[#0d4697] hover:bg-blue-50 transition duration-150"
            >
              <Eye className="h-3 w-3" />
              View details
            </button>
          )}
        />
      </section>

      <Modal
        open={Boolean(selectedSlice)}
        title={selectedSlice ? `${selectedSlice.orderNumber} • ${selectedSlice.vendorLabel}` : 'Order details'}
        onClose={() => {
          setSelectedSlice(null)
          setSelectedOrder(null)
        }}
        maxWidth="max-w-6xl"
      >
        {detailsLoading || !selectedOrder ? (
          <div className="grid min-h-48 place-items-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#0d4697]" />
          </div>
        ) : (
          <div className="space-y-4 text-sm">
            <div className="grid gap-3 lg:grid-cols-3">
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-[10px] font-black uppercase text-slate-400">Customer</p>
                <p className="mt-1 font-bold text-slate-900">{selectedOrder.customerSnapshot?.name || selectedOrder.user?.name || 'Guest'}</p>
                <p className="text-xs font-medium text-slate-500">{selectedOrder.customerSnapshot?.email || selectedOrder.user?.email || '-'}</p>
                <p className="text-xs font-medium text-slate-500">{selectedOrder.customerSnapshot?.phone || selectedOrder.user?.phone || '-'}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-[10px] font-black uppercase text-slate-400">Selected vendor</p>
                <p className="mt-1 font-bold text-slate-900">{activeVendorSlice?.vendorLabel || 'Vendor'}</p>
                <p className="text-xs font-medium text-slate-500">{activeVendorSlice?.itemCount || 0} item{(activeVendorSlice?.itemCount || 0) === 1 ? '' : 's'}</p>
                <p className="text-xs font-medium text-slate-500">Vendor amount: {formatCurrency(activeVendorSlice?.vendorTotal || 0, activeVendorSlice?.currency)}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-[10px] font-black uppercase text-slate-400">Order</p>
                <p className="mt-1 font-bold text-slate-900">{selectedOrder.orderNumber}</p>
                <p className="text-xs font-medium text-slate-500">{formatDate(selectedOrder.createdAt)}</p>
                <p className="text-xs font-medium text-slate-500">Payment: {selectedOrder.paymentStatus}</p>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-[10px] font-black uppercase text-slate-400">Shipping Address</p>
              <p className="mt-1 text-xs font-medium text-slate-600">
                {formatOrderAddress(selectedOrder.address)}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-[10px] font-black uppercase text-slate-400">Vendor items</p>
              <div className="mt-3 space-y-3">
                {(activeVendorSlice?.items || []).map((item, index) => (
                  <div key={`${selectedOrder._id}-${activeVendorSlice?._id}-${index}`} className="flex items-center justify-between gap-4 rounded-md bg-slate-50 px-3 py-2">
                    <div>
                      <p className="font-bold text-slate-800">{item.productSnapshot?.title || 'Product'}</p>
                      <p className="text-xs text-slate-500">Qty {item.quantity}</p>
                    </div>
                    <p className="font-bold text-slate-900">{formatCurrency(item.lineTotal || Number(item.unitPrice || 0) * Number(item.quantity || 0), selectedOrder.currency)}</p>
                  </div>
                ))}
              </div>
            </div>

            {otherVendorSlices.length > 0 && (
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-[10px] font-black uppercase text-slate-400">Other vendors in this order</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {otherVendorSlices.map((slice) => (
                    <div key={slice._id} className="rounded-md bg-slate-50 px-3 py-2">
                      <p className="font-bold text-slate-800">{slice.vendorLabel}</p>
                      <p className="text-xs text-slate-500">{slice.itemCount} item{slice.itemCount === 1 ? '' : 's'} • {formatCurrency(slice.vendorTotal, slice.currency)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-md bg-slate-50 p-3 text-xs font-semibold text-slate-700">Subtotal: {formatCurrency(selectedOrder.subtotal, selectedOrder.currency)}</div>
              <div className="rounded-md bg-slate-50 p-3 text-xs font-semibold text-slate-700">Order total: {formatCurrency(selectedOrder.total, selectedOrder.currency)}</div>
              <div className="rounded-md bg-slate-50 p-3 text-xs font-semibold text-slate-700">Vendor subtotal: {formatCurrency(activeVendorSlice?.vendorTotal || 0, selectedOrder.currency)}</div>
            </div>

            {(selectedOrder.cancellationRequest || selectedOrder.returnRequest || selectedOrder.refund) && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-black uppercase text-slate-400">Customer Actions</p>
                <div className="mt-3 grid gap-4 xl:grid-cols-3">
                  {selectedOrder.cancellationRequest && (
                    <RequestDetailCard
                      title="Cancellation"
                      tone="rose"
                      request={selectedOrder.cancellationRequest}
                      fields={[
                        { label: 'Status', value: selectedOrder.cancellationRequest.status?.replace(/_/g, ' ') || 'requested' },
                        { label: 'Reason', value: selectedOrder.cancellationRequest.reason },
                        { label: 'UPI ID', value: selectedOrder.cancellationRequest.upiId || '-' },
                        { label: 'Requested At', value: selectedOrder.cancellationRequest.requestedAt ? formatDate(selectedOrder.cancellationRequest.requestedAt) : '-' },
                        { label: 'Completed At', value: selectedOrder.cancellationRequest.completedAt ? formatDate(selectedOrder.cancellationRequest.completedAt) : '-' },
                        { label: 'Failure Reason', value: selectedOrder.cancellationRequest.failureReason || '-' },
                        { label: 'Refund ID', value: selectedOrder.cancellationRequest.refundId || '-' },
                      ]}
                    />
                  )}
                  {selectedOrder.returnRequest && (
                    <RequestDetailCard
                      title="Return"
                      tone="amber"
                      request={selectedOrder.returnRequest}
                      fields={[
                        { label: 'Status', value: selectedOrder.returnRequest.status?.replace(/_/g, ' ') || 'requested' },
                        { label: 'Reason', value: selectedOrder.returnRequest.reasonLabel || selectedOrder.returnRequest.reason },
                        { label: 'UPI ID', value: selectedOrder.returnRequest.upiId || '-' },
                        { label: 'Return Method', value: selectedOrder.returnRequest.returnMethod || '-' },
                        { label: 'Refund Method', value: selectedOrder.returnRequest.refundMethod || '-' },
                        { label: 'Requested At', value: selectedOrder.returnRequest.requestedAt ? formatDate(selectedOrder.returnRequest.requestedAt) : '-' },
                        { label: 'Window Ends', value: selectedOrder.returnRequest.returnWindowEndsAt ? formatDate(selectedOrder.returnRequest.returnWindowEndsAt) : '-' },
                        { label: 'Rejection Reason', value: selectedOrder.returnRequest.rejectionReason || '-' },
                      ]}
                    />
                  )}
                  {selectedOrder.refund && (
                    <RequestDetailCard
                      title="Refund"
                      tone="emerald"
                      request={selectedOrder.refund}
                      fields={[
                        { label: 'Status', value: selectedOrder.refund.status || 'requested' },
                        { label: 'Reason', value: selectedOrder.refund.reason || selectedOrder.refund.reasonLabel || '-' },
                        { label: 'UPI ID', value: selectedOrder.refund.upiId || '-' },
                        { label: 'Amount', value: formatCurrency(selectedOrder.refund.amount || selectedOrder.refund.refundAmount || 0) },
                        { label: 'Refund ID', value: selectedOrder.refund.refundId || '-' },
                        { label: 'Requested At', value: selectedOrder.refund.requestedAt ? formatDate(selectedOrder.refund.requestedAt) : '-' },
                        { label: 'Completed At', value: selectedOrder.refund.refundedAt ? formatDate(selectedOrder.refund.refundedAt) : '-' },
                        { label: 'Failure Reason', value: selectedOrder.refund.failureReason || '-' },
                      ]}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  )
}

function splitOrderByVendor(order) {
  const items = Array.isArray(order?.items) ? order.items : []
  if (!items.length) return []

  const buckets = new Map()

  items.forEach((item, index) => {
    const vendor = extractItemVendor(item)
    const vendorKey = vendor._id ? String(vendor._id) : `unknown-${index}`
    const current = buckets.get(vendorKey) || {
      _id: `${order._id}:${vendorKey}`,
      originalOrderId: order._id,
      orderNumber: order.orderNumber,
      invoiceNumber: order.invoiceNumber,
      customerName: order.customerSnapshot?.name || order.user?.name || 'Guest',
      customerEmail: order.customerSnapshot?.email || order.user?.email || '',
      customerPhone: order.customerSnapshot?.phone || order.user?.phone || '',
      address: order.address,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      orderTotal: Number(order.total || 0),
      subtotal: Number(order.subtotal || 0),
      currency: order.currency,
      vendorId: vendor._id || null,
      vendorLabel: vendor.label,
      vendorBusinessName: vendor.businessName || '',
      vendorCount: 0,
      items: [],
      itemCount: 0,
      vendorTotal: 0,
      cancellationRequest: order.cancellationRequest || null,
      returnRequest: order.returnRequest || null,
      refund: order.refund || null,
      itemSummary: '',
      searchBlob: '',
    }

    current.vendorCount += 1
    current.items.push(item)
    current.itemCount += Number(item.quantity || 1)
    current.vendorTotal += Number(item.lineTotal || Number(item.unitPrice || 0) * Number(item.quantity || 0))
    current.vendorLabel = current.vendorLabel || vendor.label
    current.vendorBusinessName = current.vendorBusinessName || vendor.businessName || ''
    buckets.set(vendorKey, current)
  })

  return [...buckets.values()].map((slice) => ({
    ...slice,
    itemSummary: slice.items.map((item) => item.productSnapshot?.title || 'Product').join(', '),
    searchBlob: [
      slice.orderNumber,
      slice.customerName,
      slice.customerEmail,
      slice.customerPhone,
      slice.vendorLabel,
      slice.vendorBusinessName,
      slice.items.map((item) => item.productSnapshot?.title || 'Product').join(' '),
    ].join(' '),
  }))
}

function extractItemVendor(item = {}) {
  const vendor = item?.productSnapshot?.vendor || item?.vendor || item?.vendorSnapshot || null
  if (!vendor) {
    return { _id: null, label: 'Marketplace', businessName: '' }
  }
  if (typeof vendor === 'string') {
    return { _id: vendor, label: 'Vendor', businessName: '' }
  }
  const vendorId = vendor._id || vendor.id || vendor.vendorId || null
  const label = vendor.businessName || vendor.ownerName || vendor.user?.name || vendor.name || 'Vendor'
  return { _id: vendorId, label, businessName: vendor.businessName || '' }
}

function formatOrderAddress(address) {
  if (!address) return 'Address unavailable'
  if (typeof address === 'string') return address
  return [
    address.fullName,
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.pincode,
  ].filter(Boolean).join(', ') || 'Address unavailable'
}

const displayValue = (value) => {
  if (value === null || value === undefined || value === '') return 'N/A'
  if (value instanceof Date) return formatDate(value)
  if (Array.isArray(value)) return value.length ? value.map(displayValue).join(', ') : 'N/A'
  if (typeof value === 'object') return value.name || value.label || JSON.stringify(value)
  return String(value).replace(/_/g, ' ')
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

function MiniFlag({ tone = 'slate', label }) {
  const toneMap = {
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
    rose: 'bg-rose-50 text-rose-700 ring-rose-200',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    slate: 'bg-slate-50 text-slate-600 ring-slate-200',
  }

  return (
    <span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-wide ring-1 ${toneMap[tone] || toneMap.slate}`}>
      {label}
    </span>
  )
}

export function AdminServicesPage() {
  const [selectedService, setSelectedService] = useState(null)

  return (
    <>
      <ResourceListPage
        module="marketplace"
        section="services"
        title="Service Management"
        fetcher={(params) => adminApi.services({ ...params, status: params.status || 'all' })}
        filters={statusFilters}
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
          { key: 'vendorName', header: 'Vendor Name', render: (row) => row.vendor?.ownerName || row.vendor?.user?.name || '-' },
          { key: 'businessName', header: 'Business Name', render: (row) => row.vendor?.businessName || '-' },
          { key: 'category', header: 'Category', render: (row) => row.category?.name || '-' },
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
          { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          { key: 'createdAt', header: 'Created Date', render: (row) => formatDate(row.createdAt) }
        ]}
        renderActions={(row) => (
          <button
            onClick={() => setSelectedService(row)}
            className="inline-flex items-center gap-1 rounded-md border border-[#0d4697]/25 px-2.5 py-1.5 text-xs font-bold text-[#0d4697] hover:bg-blue-50 transition"
          >
            <Eye className="h-3 w-3" />
            View
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

export function AdminMembershipsPage() {
  return <ResourceListPage module="members" section="memberships" title="Vendor Memberships" fetcher={adminApi.memberships} filters={statusFilters} columns={[
    { key: ROLES.VENDOR, header: 'Vendor', render: (row) => row.vendor?.businessName || 'Vendor' }, { key: 'price', header: 'Price', render: (row) => formatCurrency(row.price) }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
  ]} />
}

export function AdminMembershipApplicationsPage() {
  const { user } = useAuth()
  const [selected, setSelected] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [reloadList, setReloadList] = useState(null)

  useEffect(() => {
    console.log('AdminMembershipApplicationsPage mounted', window.location.pathname)
  }, [])

  const openDetails = async (row, reload) => {
    setReloadList(() => reload)
    setLoadingDetails(true)
    setSelected(row)
    setAdminNotes(row.adminNotes || '')
    try {
      const response = await adminApi.membershipApplication(row._id)
      const application = response.data?.data || row
      setSelected(application)
      setAdminNotes(application.adminNotes || '')
    } finally {
      setLoadingDetails(false)
    }
  }

  const changeStatus = async (status) => {
    if (!selected?._id) return
    setUpdatingStatus(true)
    try {
      const response = await adminApi.updateMembershipApplicationStatus(selected._id, { status, adminNotes })
      const updated = response.data?.data || { ...selected, status, adminNotes }
      setSelected(updated)
      toast.success(`Application marked ${status.replaceAll('_', ' ')}`)
      reloadList?.()
    } finally {
      setUpdatingStatus(false)
    }
  }

  const changeRowStatus = async (row, status, reload) => {
    if (!row?._id || !status || status === row.status) return
    try {
      await adminApi.updateMembershipApplicationStatus(row._id, { status, adminNotes: row.adminNotes || '' })
      toast.success(`Application marked ${status.replaceAll('_', ' ')}`)
      reload?.()
    } catch (error) {

      console.error('Failed to update membership application status', error)

    }
  }

  return (
    <>
      <ResourceListPage module="members" section="applications" title="Membership Applications" fetcher={adminApi.membershipApplications} filters={[{ key: 'status', label: 'Status', options: ['submitted', 'approved', 'rejected'].map((value) => ({ value, label: value.replaceAll('_', ' ') })) }]} columns={[
        { key: 'applicationNumber', header: 'Member ID/App ID', render: (row) => row.submittedBy?.memberId || row.applicationNumber },
        { key: 'fullName', header: 'Name', render: (row) => row.personal?.fullName || row.submittedBy?.name },
        { key: 'email', header: 'Email', render: (row) => row.personal?.emailAddress || row.submittedBy?.email || 'Not added' },
        { key: 'mobile', header: 'Mobile', render: (row) => row.personal?.mobileNumber || row.submittedBy?.phone || 'Not added' },
        { key: 'source', header: 'Source', render: (row) => row.source || row.sourceLabel || row.applicationSource || row.applicationSourceLabel || 'Online Member' },
        { key: 'region', header: 'Region', render: (row) => row.regionId?.name || 'Not assigned' },
        { key: 'state', header: 'State', render: (row) => row.stateId?.name || 'Not assigned' },
        { key: 'district', header: 'District', render: (row) => row.districtId?.name || 'Not assigned' },
        { key: 'chapter', header: 'Chapter', render: (row) => row.chapterId?.name || 'Not assigned' },
        { key: 'referredBy', header: 'Referred By', render: (row) => row.submittedBy?.referredBy?.name || row.submittedBy?.referredBy?.email || 'Direct' },
        { key: 'forwardedBy', header: 'Forwarded By (VP)', render: (row) => row.forwardedBy?.name || row.forwardedBy?.email || row.reviewedBy?.name || row.reviewedBy?.email || 'Pending' },
        { key: 'forwardedRole', header: 'Forwarded By Role', render: (row) => row.forwardedByRole?.replaceAll('_', ' ') || row.reviewedByRole?.replaceAll('_', ' ') || 'Pending' },
        { key: 'decisionDate', header: 'Decision Date', render: (row) => formatDate(row.decisionDate || row.reviewedAt || row.approvedAt) },
        { key: 'createdAt', header: 'Submitted Date', render: (row) => formatDate(row.createdAt) },
        { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
      ]} renderActions={(row, { reload }, permissions) => {
        const userRole = user?.role || ''
        const isPendingVpReview = row.status === 'pending_vp_review'
        const isSubmitted = row.status === 'submitted'
        const isFinalDecision = ['approved', 'rejected'].includes(row.status)
        const isExecutiveDirector = userRole === ROLES.EXECUTIVE_DIRECTOR
        const isDistrictScoped = !isExecutiveDirector || String(row.districtId?._id || row.districtId) === String(user?.meta?.adminProfile?.organization?.district?._id || user?.meta?.adminProfile?.organization?.district || '')
        const canVpAct = userRole === ROLES.VICE_PRESIDENT && isPendingVpReview
        const canFinalAct = [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.EXECUTIVE_DIRECTOR].includes(userRole) && isSubmitted && isDistrictScoped
        const latestStep = row.workflowHistory && row.workflowHistory.length > 0 ? row.workflowHistory[row.workflowHistory.length - 1] : null
        const reviewerRole = latestStep?.role || row.forwardedByRole || row.reviewedByRole || row.approvedRole
        return (
          <>
            {permissions.hasOperation('members', 'view') && <button onClick={() => openDetails(row, reload)} className="inline-flex items-center gap-1.5 rounded-md border border-[#0d4697]/20 px-3 py-1.5 text-xs font-extrabold text-[#0d4697] hover:bg-blue-50">
              <Eye className="h-3.5 w-3.5" />
              View
            </button>}
            {canVpAct && <>
              <button onClick={() => changeRowStatus(row, 'submitted', reload)} className="inline-flex h-8 items-center gap-1.5 rounded-md bg-emerald-600 px-3 text-xs font-extrabold text-white hover:bg-emerald-700">
                Forward
              </button>
              <button onClick={() => changeRowStatus(row, 'rejected', reload)} className="inline-flex h-8 items-center gap-1.5 rounded-md bg-red-600 px-3 text-xs font-extrabold text-white hover:bg-red-700">
                Reject
              </button>
            </>}
            {canFinalAct && <>
              <button onClick={() => changeRowStatus(row, 'approved', reload)} className="inline-flex h-8 items-center gap-1.5 rounded-md bg-emerald-600 px-3 text-xs font-extrabold text-white hover:bg-emerald-700">
                Approve
              </button>
              <button onClick={() => changeRowStatus(row, 'rejected', reload)} className="inline-flex h-8 items-center gap-1.5 rounded-md bg-red-600 px-3 text-xs font-extrabold text-white hover:bg-red-700">
                Reject
              </button>
            </>}
              {isFinalDecision && (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 border border-slate-200">
                  {row.status === 'approved' ? 'Approved by' : 'Rejected by'} {String(reviewerRole || '').replaceAll('_', ' ')}
                </span>
              )}
            </>
          )
        }} />

      <Modal open={Boolean(selected)} title="Membership Application Details" onClose={() => setSelected(null)} maxWidth="max-w-6xl">
        {loadingDetails ? (
          <div className="grid min-h-48 place-items-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#0d4697]" />
          </div>
        ) : (
          <MembershipApplicationDetails
            application={selected}
            adminNotes={adminNotes}
            onNotesChange={setAdminNotes}
            onClose={() => setSelected(null)}
            onForward={() => changeStatus('submitted')}
            onApprove={() => changeStatus('approved')}
            onReject={() => changeStatus('rejected')}
            updating={updatingStatus}
            user={user}
          />
        )}
      </Modal>
    </>
  )
}

function MembershipApplicationDetails({ application, adminNotes, onNotesChange, onClose, onForward, onApprove, onReject, updating, user }) {
  if (!application) return null

  const openDocument = async (field) => {
    try {
      const response = await adminApi.membershipApplicationDocumentUrl(application._id, field)
      const url = response.data?.data?.url
      if (url) window.open(url, '_blank', 'noopener,noreferrer')
    } catch {
      toast.error('Unable to open document')
    }
  }

  const userRole = user?.role || ''
  const isPendingVpReview = application.status === 'pending_vp_review'
  const isSubmitted = application.status === 'submitted'
  const isFinalDecision = ['approved', 'rejected'].includes(application.status)
  const isExecutiveDirector = userRole === ROLES.EXECUTIVE_DIRECTOR
  const isDistrictScoped = !isExecutiveDirector || String(application.districtId?._id || application.districtId) === String(user?.meta?.adminProfile?.organization?.district?._id || user?.meta?.adminProfile?.organization?.district || '')
  const showForwardBtn = isPendingVpReview && userRole === ROLES.VICE_PRESIDENT
  const showFinalButtons = isSubmitted && [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.EXECUTIVE_DIRECTOR].includes(userRole) && isDistrictScoped
  const latestStep = application.workflowHistory && application.workflowHistory.length > 0 ? application.workflowHistory[application.workflowHistory.length - 1] : null
  const decisionRole = application.forwardedByRole || latestStep?.role || application.reviewedByRole || application.approvedRole
  const decisionOfficer = application.forwardedBy?.name || application.forwardedBy?.email || application.reviewedBy?.name || application.reviewedBy?.email || 'Pending'
  const sourceLabel = application.source || application.sourceLabel || application.applicationSource || application.applicationSourceLabel || 'Online Member'

  const documents = [
    ['profilePhoto', 'Profile Photo'],
    ['registrationCertificate', 'Registration Certificate'],
    ['gstCertificate', 'GST Certificate'],
    ['companyProfile', 'Company Profile'],
    ['visitingCard', 'Visiting Card'],
  ].map(([key, label]) => ({ key, label, file: application.documents?.[key] })).filter((item) => item.file?.url)

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Applicant</p>
          <h3 className="mt-1 text-xl font-extrabold text-slate-950">{application.personal?.fullName || 'Applicant'}</h3>
          <p className="text-sm font-semibold text-slate-600">{application.professional?.companyName || 'Company not added'}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            Source: <span className="text-slate-800">{sourceLabel}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge value={application.status} />
          <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-slate-600 ring-1 ring-slate-200">
            Submitted {formatDate(application.createdAt)}
          </span>
        </div>
      </div>

      {application.decisionRemarks && isFinalDecision && (
        <div className={`flex gap-3 rounded-xl border p-4 ${application.status === 'rejected' ? 'border-red-200 bg-red-50/50' : 'border-emerald-200 bg-emerald-50/50'}`}>
          <AlertCircle className={`mt-0.5 h-5 w-5 shrink-0 ${application.status === 'rejected' ? 'text-red-600' : 'text-emerald-600'}`} />
          <div>
            <p className="text-sm font-extrabold text-slate-800">
              Forwarded By (VP): {decisionOfficer || 'Assigned Officer'} {decisionRole ? `(${String(decisionRole).replaceAll('_', ' ')})` : ''}
            </p>
            <p className="text-xs font-semibold text-slate-600 mt-1">{application.decisionRemarks}</p>
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <DetailSection title="Personal Information" items={[
          ['Full Name', application.personal?.fullName],
          ['Date of Birth', application.personal?.dateOfBirth],
          ['Gender', application.personal?.gender],
          ['Mobile Number', application.personal?.mobileNumber],
          ['Email Address', application.personal?.emailAddress],
          ['Submitted By', application.submittedBy?.email || application.submittedBy?.name],
          ['Forwarded By (VP)', application.forwardedBy?.name || application.forwardedBy?.email || application.reviewedBy?.name || application.reviewedBy?.email || 'Pending'],
          ['Referred By', application.submittedBy?.referredBy?.name || application.submittedBy?.referredBy?.email || 'Direct'],
          ['Connect Code Used', application.referralCode || 'None'],
        ]} />
        <DetailSection title="Address Information" items={[
          ['Address Line 1', application.address?.line1],
          ['Address Line 2', application.address?.line2],
          ['City', application.address?.city],
          ['State', application.address?.state],
          ['Pincode', application.address?.pincode],
        ]} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DetailSection title="Organization Assignment" items={[
          ['Region', application.regionId?.name || 'Not Assigned'],
          ['State', application.stateId?.name || 'Not Assigned'],
          ['District', application.districtId?.name || 'Not Assigned'],
          ['Chapter', application.chapterId?.name || 'Not Assigned'],
        ]} />
        <DetailSection title="Professional Details" items={[
        ['Company Name', application.professional?.companyName],
        ['Designation', application.professional?.designation],
        ['Industry Category', application.professional?.industry],
        ['Business Type', application.professional?.businessType],
        ['Years of Experience', application.professional?.yearsOfExperience],
        ['Company Website', application.professional?.companyWebsite],
        ['LinkedIn Profile', application.professional?.linkedInProfile],
        ['Business Email', application.professional?.businessEmail],
        ['Areas of Expertise', application.professional?.expertise?.join(', ')],
        ['Professional Background', application.professional?.backgroundSummary],
        ['Why Join Gloaro', application.professional?.joinReason],
      ]} />
      </div>

      <DetailSection title="Business Credentials" items={[
        ['Business Registration Number', application.credentials?.businessRegistrationNumber],
        ['GST Number', application.credentials?.gstNumber],
        ['PAN Number', application.credentials?.panNumber],
        ['Company Type', application.credentials?.companyType],
      ]} />

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h4 className="text-sm font-extrabold text-slate-950">Business References</h4>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          {(application.references || []).map((reference, index) => (
            <div key={reference._id || index} className="rounded-md border border-slate-100 bg-slate-50 p-3">
              <p className="mb-2 text-xs font-extrabold uppercase text-[#0d4697]">Reference Contact {index + 1}</p>
              <DetailGrid items={[
                ['Full Name', reference.fullName],
                ['Company', reference.companyName],
                ['Designation', reference.designation],
                ['Phone', reference.phoneNumber],
                ['Email', reference.emailAddress],
              ]} />
            </div>
          ))}
          {!application.references?.length && <p className="text-sm font-semibold text-slate-500">No references added.</p>}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-sm font-extrabold text-slate-950">Uploaded Documents</h4>
          <span className="text-xs font-extrabold text-slate-500">{documents.length} file(s)</span>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {documents.map(({ key, label, file }) => (
            <button key={key} type="button" onClick={() => openDocument(key)} className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-left text-sm font-bold text-slate-700 hover:border-[#0d4697]/40 hover:bg-blue-50">
              <span className="flex min-w-0 items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-[#0d4697]" />
                <span className="min-w-0">
                  <span className="block truncate">{label}</span>
                  <span className="block truncate text-xs font-semibold text-slate-500">{file.originalName || file.mimetype || 'Uploaded file'}</span>
                </span>
              </span>
              <ExternalLink className="h-4 w-4 shrink-0" />
            </button>
          ))}
          {!documents.length && <p className="text-sm font-semibold text-slate-500">No documents uploaded.</p>}
        </div>
      </section>

      <DetailSection title="Agreement & Signature" items={[
        ['Legal Name', application.agreement?.legalName],
        ['Digital Signature', application.agreement?.digitalSignature],
        ['Signature Date', application.agreement?.signatureDate],
        ['Location', application.agreement?.signatureLocation],
        ['Accepted At', formatDate(application.agreement?.acceptedTermsAt)],
        ['Declarations Accepted', application.agreement?.declarationsAccepted?.length],
      ]} />

      {/* Workflow History Timeline */}
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h4 className="text-sm font-extrabold text-slate-950">Workflow History Timeline</h4>
        <div className="mt-4 space-y-4">
          {(application.workflowHistory || []).map((step, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0d4697] text-xs font-bold text-white">
                  {idx + 1}
                </div>
                {idx < application.workflowHistory.length - 1 && (
                  <div className="h-full w-0.5 bg-slate-200" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Status: <span className="capitalize text-[#0d4697]">{step.action}</span>
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  Role: <span className="capitalize">{step.role?.replace('_', ' ')}</span> | Remarks: {step.remarks || 'None'}
                </p>
                <p className="text-[10px] font-medium text-slate-400">
                  {formatDate(step.timestamp)}
                </p>
              </div>
            </div>
          ))}
          {!application.workflowHistory?.length && (
            <p className="text-sm font-semibold text-slate-500">No workflow steps recorded yet.</p>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <label htmlFor="membership-admin-notes" className="text-sm font-extrabold text-slate-950">Admin Notes</label>
        <textarea
          id="membership-admin-notes"
          value={adminNotes}
          onChange={(event) => onNotesChange(event.target.value)}
          rows={4}
          placeholder="Add review comments for this application"
          className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-[#0d4697] focus:ring-2 focus:ring-blue-100"
        />
        {application.reviewedBy && (
          <p className="mt-2 text-xs font-semibold text-slate-500">
            Reviewed by {application.reviewedBy.name || application.reviewedBy.email} on {formatDate(application.reviewedAt)}
          </p>
        )}
      </section>

      <div className="sticky bottom-0 flex flex-col gap-2 border-t border-slate-200 bg-white pt-4 sm:flex-row sm:justify-end">
        <button disabled={updating} onClick={onClose} className="inline-flex items-center justify-center rounded-md border border-slate-200 px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50 disabled:opacity-60">
          Close
        </button>
        {showForwardBtn && <button disabled={updating} onClick={onForward} className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-extrabold text-white hover:bg-emerald-700 disabled:opacity-60">
          Forward
        </button>}
        {showForwardBtn && <button disabled={updating} onClick={onReject} className="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 px-4 py-2 text-sm font-extrabold text-red-600 hover:bg-red-50 disabled:opacity-60">
          <XCircle className="h-4 w-4" />
          Reject
        </button>}
        {showFinalButtons && <button disabled={updating} onClick={onApprove} className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-extrabold text-white hover:bg-emerald-700 disabled:opacity-60">
          <CheckCircle2 className="h-4 w-4" />
          Approve
        </button>}
        {showFinalButtons && <button disabled={updating} onClick={onReject} className="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 px-4 py-2 text-sm font-extrabold text-red-600 hover:bg-red-50 disabled:opacity-60">
          <XCircle className="h-4 w-4" />
          Reject
        </button>}
      </div>
    </div>
  )
}

function DetailSection({ title, items }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h4 className="text-sm font-extrabold text-slate-950">{title}</h4>
      <DetailGrid items={items} />
    </section>
  )
}

function DetailGrid({ items }) {
  return (
    <dl className="mt-3 grid gap-3 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="min-w-0 rounded-md bg-slate-50 px-3 py-2">
          <dt className="text-[11px] font-extrabold uppercase text-slate-500">{label}</dt>
          <dd className="mt-1 break-words text-sm font-bold text-slate-800">{value || 'Not added'}</dd>
        </div>
      ))}
    </dl>
  )
}

export function AdminModuleApplicationsPage({ title }) {
  return (
    <section>
      <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">{title}</h2>
      <div className="mt-5 rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <p className="text-sm font-bold text-slate-500">No applications found for this module yet.</p>
      </div>
    </section>
  )
}

export function AdminEventsPage() {
  return <ResourceListPage module="events" section="events" title="Event Management" fetcher={adminApi.events} detailFetcher={adminApi.event} columns={[{ key: 'title', header: 'Title' }, { key: 'type', header: 'Type' }, { key: 'startDate', header: 'Starts', render: (row) => formatDate(row.startDate) }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> }]} renderDetails={(event) => <div className="space-y-5 text-sm">
    <div className="grid gap-3 sm:grid-cols-2">
      {[
        ['Event ID', event.eventId || '—'], ['Created', formatDate(event.createdAt)], ['Type', event.type || '—'], ['Status', event.status || '—'],
        ['Region', event.region?.name || event.regionName || event.regionCode || event.region || '—'], ['State', event.state?.name || event.stateName || event.stateCode || event.state || '—'], ['District', event.district?.name || event.districtName || event.districtCode || event.district || '—'],
        ['Starts', `${formatDate(event.startDate)} ${event.startDate ? new Date(event.startDate).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) : ''}`],
        ['Ends', `${formatDate(event.endDate)} ${event.endDate ? new Date(event.endDate).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) : ''}`],
        ['Venue', event.venue?.name || event.venue || '—'], ['Organizer', event.organizer?.name || '—'], ['Category', event.category?.name || '—'],
      ].map(([label, value]) => <div key={label} className="rounded-lg bg-slate-50 p-3"><p className="text-[10px] font-extrabold uppercase text-slate-400">{label}</p><p className="mt-1 font-bold capitalize text-slate-800">{value}</p></div>)}
    </div>
    <div className="border-t border-slate-100 pt-4"><p className="font-extrabold text-slate-800">Registration</p><div className="mt-2 grid gap-3 sm:grid-cols-3"><div><span className="text-xs text-slate-500">Required</span><p className="font-bold">{event.registration?.isRequired ? 'Yes' : 'No'}</p></div><div><span className="text-xs text-slate-500">Capacity</span><p className="font-bold">{event.registration?.maxAttendees || 'Unlimited'}</p></div><div><span className="text-xs text-slate-500">Registered</span><p className="font-bold">{event.stats?.totalRegistrations ?? event.attendees?.length ?? 0}</p></div></div></div>
    <div className="border-t border-slate-100 pt-4"><p className="font-extrabold text-slate-800">Description</p><p className="mt-1 text-slate-600">{event.description || '—'}</p></div>
  </div>} />
}

export function AdminReferralsPage() {
  return <ResourceListPage module="referrals" section="referrals" title="Connect Management" fetcher={adminApi.referrals} columns={[{ key: 'referrer', header: 'Referrer', render: (row) => row.referrer?.name || 'User' }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> }]} />
}

export function AdminPaymentsPage() {
  return <ResourceListPage module="reports" section="payments" title="Payment & Transaction Management" fetcher={adminApi.payments} filters={statusFilters} columns={[{ key: ROLES.USER, header: 'User', render: (row) => row.user?.name || row.user?.email || 'User' }, { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.amount, row.currency) }, { key: 'gateway', header: 'Gateway' }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> }]} />
}

export function AdminReviewsPage() {
  return <ResourceListPage module="marketplace" section="reviews" title="Review Management" fetcher={adminApi.reviews} filters={statusFilters} columns={[{ key: ROLES.USER, header: 'User', render: (row) => row.user?.name || 'User' }, { key: ROLES.VENDOR, header: 'Vendor', render: (row) => row.vendor?.businessName || 'Vendor' }, { key: 'rating', header: 'Rating' }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> }]} />
}

export function AdminSupportPage() {
  return <ResourceListPage module="settings" section="support" title="Support Tickets" fetcher={adminApi.support} filters={statusFilters} columns={[{ key: 'ticketNumber', header: 'Ticket' }, { key: 'subject', header: 'Subject' }, { key: 'priority', header: 'Priority' }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> }]} />
}

export function AdminBannersPage() {
  return <ResourceListPage module="settings" section="banners" title="Banner Management" fetcher={adminApi.banners} createAction={adminApi.createBanner} updateAction={adminApi.updateBanner} deleteAction={adminApi.deleteBanner} columns={[{ key: 'title', header: 'Title' }, { key: 'placement', header: 'Placement' }, { key: 'isActive', header: 'Status', render: (row) => <StatusBadge value={row.isActive ? 'active' : 'inactive'} /> }]} renderForm={(props) => <BannerForm {...props} />} />
}

export function AdminLeadersPage() {
  return <ResourceListPage module="settings" section="leaders" title="Leadership Management" description="Upload the leaders and images shown on the public home page." fetcher={adminApi.leaders} createAction={adminApi.createLeader} updateAction={adminApi.updateLeader} deleteAction={adminApi.deleteLeader} columns={[{ key: 'image', header: 'Image', render: (row) => row.image?.url ? <img src={row.image.url} alt="" className="h-10 w-10 rounded-full object-cover" /> : '—' }, { key: 'name', header: 'Name' }, { key: 'role', header: 'Designation' }, { key: 'isActive', header: 'Status', render: (row) => <StatusBadge value={row.isActive ? 'active' : 'inactive'} /> }]} renderForm={(props) => <LeaderForm {...props} />} />
}

export function AdminGalleryPage() {
  return <ResourceListPage module="settings" section="gallery" title="Gallery Management" description="Images added here appear in the public Gloaro Gallery." fetcher={adminApi.gallery} createAction={adminApi.createGalleryItem} updateAction={adminApi.updateGalleryItem} deleteAction={adminApi.deleteGalleryItem} columns={[{ key: 'image', header: 'Image', render: (row) => row.image?.url ? <img src={row.image.url} alt="" className="h-10 w-16 rounded-md object-cover" /> : '—' }, { key: 'title', header: 'Title', render: (row) => row.title || '—' }, { key: 'order', header: 'Order' }, { key: 'isActive', header: 'Status', render: (row) => <StatusBadge value={row.isActive ? 'active' : 'inactive'} /> }]} renderForm={(props) => <GalleryForm {...props} />} />
}

export function AdminFaqsPage() {
  return <ResourceListPage module="settings" section="faqs" title="FAQ Management" fetcher={adminApi.faqs} createAction={adminApi.createFaq} updateAction={adminApi.updateFaq} deleteAction={adminApi.deleteFaq} columns={[{ key: 'question', header: 'Question' }, { key: 'category', header: 'Category' }, { key: 'isActive', header: 'Status', render: (row) => <StatusBadge value={row.isActive ? 'active' : 'inactive'} /> }]} renderForm={(props) => <SimpleJsonForm {...props} fields={[{ name: 'question' }, { name: 'answer', type: 'textarea' }, { name: 'category' }, { name: 'isActive', label: 'Status', type: 'select', options: [{ value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }] }]} />} />
}

export function AdminSettingsPage() {
  return <ResourceListPage module="settings" section="settings" title="Settings" fetcher={adminApi.settings} columns={[{ key: 'key', header: 'Key' }, { key: 'group', header: 'Group' }, { key: 'value', header: 'Value', render: (row) => typeof row.value === 'object' ? JSON.stringify(row.value) : String(row.value) }]} />
}

export function AdminMembersPage() {
  const { user } = useAuth()
  const [locations, setLocations] = useState([])
  const [loadingLocations, setLoadingLocations] = useState(true)
  const [rows, setRows] = useState([])
  const [pagination, setPagination] = useState({})
  const [loadingMembers, setLoadingMembers] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ region: '', state: '', district: '', chapter: '' })
  const memberRequestSequence = useRef(0)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [search])

  useEffect(() => {
    let mounted = true
    api.get('/directory/organization-hierarchy')
      .then((res) => {
        if (!mounted) return
        setLocations(Array.isArray(res.data?.data) ? res.data.data : [])
      })
      .catch((err) => {
        console.error('Error loading locations', err)
        if (mounted) setLocations([])
      })
      .finally(() => {
        if (mounted) setLoadingLocations(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const locationIndex = useMemo(() => {
    const byId = new Map()
    const byParent = new Map()

    locations.forEach((location) => {
      byId.set(location._id, location)
      const parentId = location.parent?._id || location.parent || 'root'
      if (!byParent.has(parentId)) byParent.set(parentId, [])
      byParent.get(parentId).push(location)
    })

    return { byId, byParent }
  }, [locations])

  const getParentId = (location) => location?.parent?._id || location?.parent || ''

  const assignedOrganization = user?.meta?.adminProfile?.organization || user?.meta?.memberProfile?.organization || {}
  const chapterScopedRole = [ROLES.EXECUTIVE_DIRECTOR, ROLES.LAUNCH_DIRECTOR, ROLES.DIRECT_CONSULTANT, ROLES.CHAPTER_PRESIDENT, ROLES.VICE_PRESIDENT, ROLES.SECRETARY].includes(user?.role)

  const assignedLocationOption = useCallback((key) => {
    const assignedKey = `assigned${key.charAt(0).toUpperCase()}${key.slice(1)}`
    const assigned = assignedOrganization[assignedKey]
    const assignedId = assigned?._id || assignedOrganization[key]
    const record = locations.find((location) => String(location._id) === String(assignedId))
    const location = record || assigned
    if (!location?._id || !location?.name) return []
    return [{ value: location._id, label: location.name }]
  }, [assignedOrganization, locations])

  const isDescendantOf = useCallback((location, ancestorId) => {
    if (!location || !ancestorId) return false
    let currentParentId = getParentId(location)

    while (currentParentId) {
      if (String(currentParentId) === String(ancestorId)) return true
      const parent = locationIndex.byId.get(currentParentId)
      if (!parent) break
      currentParentId = getParentId(parent)
    }

    return false
  }, [locationIndex])

  const regionOptions = useMemo(() => chapterScopedRole ? assignedLocationOption('region') : locations.filter((location) => location.type === 'region').map((location) => ({ value: location._id, label: location.name })), [assignedLocationOption, chapterScopedRole, locations])
  const stateOptions = useMemo(() => {
    if (chapterScopedRole) return assignedLocationOption('state')
    const allStates = locations.filter((location) => location.type === 'state')
    if (!filters.region) return allStates.map((location) => ({ value: location._id, label: location.name }))
    return allStates.filter((location) => isDescendantOf(location, filters.region)).map((location) => ({ value: location._id, label: location.name }))
  }, [assignedLocationOption, chapterScopedRole, filters.region, locations, isDescendantOf])
  const districtOptions = useMemo(() => {
    if (chapterScopedRole) return assignedLocationOption('district')
    const allDistricts = locations.filter((location) => location.type === 'district')
    if (!filters.state) return allDistricts.map((location) => ({ value: location._id, label: location.name }))
    return allDistricts.filter((location) => isDescendantOf(location, filters.state)).map((location) => ({ value: location._id, label: location.name }))
  }, [assignedLocationOption, chapterScopedRole, filters.state, locations, isDescendantOf])
  const chapterOptions = useMemo(() => {
    if (chapterScopedRole) return assignedLocationOption('chapter')
    const allChapters = locations.filter((location) => location.type === 'chapter')
    if (!filters.district) return allChapters.map((location) => ({ value: location._id, label: location.name }))
    return allChapters.filter((location) => isDescendantOf(location, filters.district)).map((location) => ({ value: location._id, label: location.name }))
  }, [assignedLocationOption, chapterScopedRole, filters.district, locations, isDescendantOf])

  const loadMembers = useCallback(async () => {
    const sequence = ++memberRequestSequence.current
    setLoadingMembers(true)
    try {
      const params = {
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        region: filters.region || undefined,
        state: filters.state || undefined,
        district: filters.district || undefined,
        chapter: filters.chapter || undefined,
      }
      const response = await adminApi.members(params)
      if (sequence !== memberRequestSequence.current) return
      const nextRows = getList(response.data)
      setRows(nextRows)
      setPagination(getPagination(response.data))
    } catch (error) {
      if (sequence !== memberRequestSequence.current) return
      toast.error(error.response?.data?.message || 'Failed to load members')
      setRows([])
      setPagination({})
    } finally {
      if (sequence === memberRequestSequence.current) setLoadingMembers(false)
    }
  }, [debouncedSearch, filters.chapter, filters.district, filters.region, filters.state, page])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadMembers()
    }, 200)
    return () => window.clearTimeout(timer)
  }, [loadMembers])

  useEffect(() => {
    const refresh = () => loadMembers()
    window.addEventListener('focus', refresh)
    const interval = window.setInterval(refresh, 30000)
    return () => {
      window.removeEventListener('focus', refresh)
      window.clearInterval(interval)
    }
  }, [loadMembers])

  const updateFilter = (key, value) => {
    setPage(1)
    setFilters((current) => {
      if (key === 'region') {
        return { region: value, state: '', district: '', chapter: '' }
      }
      if (key === 'state') {
        return { ...current, state: value, district: '', chapter: '' }
      }
      if (key === 'district') {
        return { ...current, district: value, chapter: '' }
      }
      return { ...current, [key]: value }
    })
  }

  const columns = useMemo(() => [
    { key: 'memberId', header: 'Member ID', render: (row) => row.memberId || 'N/A' },
    { key: 'name', header: 'Name', render: (row) => row.name },
    { key: 'email', header: 'Email', render: (row) => row.email },
    { key: 'phone', header: 'Mobile', render: (row) => row.phone || 'N/A' },
    { key: 'region', header: 'Region', render: (row) => row.region || 'N/A' },
    { key: 'state', header: 'State', render: (row) => row.state || 'N/A' },
    { key: 'district', header: 'District', render: (row) => row.district || 'N/A' },
    { key: 'chapter', header: 'Chapter', render: (row) => row.chapter || 'N/A' },
    { key: 'approvedBy', header: 'Approved By', render: (row) => row.approvedBy || 'N/A' },
    { key: 'approvedRole', header: 'Approver Role', render: (row) => <span className="capitalize font-semibold text-xs text-slate-500">{row.approvedRole?.replaceAll('_', ' ')}</span> },
    { key: 'approvedAt', header: 'Approved Date', render: (row) => formatDate(row.approvedAt) },
  ], [])

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-[#0c192e] p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-white" style={{ color: '#ffffff' }}>
            <MapPinned className="h-4 w-4 text-white" /> Approved Members
          </p>
          <h1 className="mt-3 text-3xl font-black text-white" style={{ color: '#ffffff' }}>Members</h1>
          <p className="mt-2 text-sm font-semibold text-slate-300">
            View and filter all approved members across regions, states, districts, and chapters.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <SearchBar
            value={search}
            onChange={(value) => {
              setSearch(value)
              setPage(1)
            }}
            placeholder="Search members"
          />
        </div>
      </header>

      <div className="rounded-2xl border border-slate-800 bg-[#0c192e] p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SelectFilter label="Region" value={filters.region} onChange={(value) => updateFilter('region', value)} options={regionOptions} placeholder={loadingLocations ? 'Loading regions...' : 'All Regions'} />
          <SelectFilter label="State" value={filters.state} onChange={(value) => updateFilter('state', value)} options={stateOptions} placeholder={loadingLocations ? 'Loading states...' : 'All States'} />
          <SelectFilter label="District" value={filters.district} onChange={(value) => updateFilter('district', value)} options={districtOptions} placeholder={loadingLocations ? 'Loading districts...' : 'All Districts'} />
          <SelectFilter label="Chapter" value={filters.chapter} onChange={(value) => updateFilter('chapter', value)} options={chapterOptions} placeholder={loadingLocations ? 'Loading chapters...' : 'All Chapters'} />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <DataTable
          columns={columns}
          rows={rows}
          loading={loadingMembers && !rows.length && !debouncedSearch}
          emptyTitle={debouncedSearch ? `No approved members found for "${debouncedSearch}"` : 'No approved members found'}
          emptyDescription={debouncedSearch ? 'No approved member in the selected organization scope matches this name, email, phone, or Member ID.' : 'There are no approved members in the selected organization scope.'}
          pagination={pagination}
          onPageChange={setPage}
        />
      </div>
    </section>
  )
}

function SelectFilter({ label, value, onChange, options = [], placeholder, disabled = false }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-wider text-white" style={{ color: '#ffffff' }}>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-[#0d4697] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
