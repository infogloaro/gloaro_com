import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { CheckCircle2, ExternalLink, Eye, FileText, Loader2, XCircle, Package, BriefcaseBusiness } from 'lucide-react'
import api from '../../api/axios'
import { adminApi } from '../../api/admin'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import { useAuth } from '../../hooks/useAuth'
import { formatCurrency, formatDate } from '../../utils/format'
import ResourceListPage from '../shared/ResourceListPage'
import SimpleJsonForm from '../shared/SimpleJsonForm'

const statusFilters = [{ key: 'status', label: 'Status', options: ['pending', 'approved', 'rejected', 'active', 'completed', 'failed'].map((value) => ({ value, label: value })) }]

export function AdminUsersPage() {
  return <ResourceListPage module="members" section="users" title="User Management" fetcher={adminApi.users} filters={[{ key: 'role', label: 'Role', options: ['customer', 'vendor', 'admin', 'superadmin'].map((value) => ({ value, label: value })) }]} columns={[
    { key: 'name', header: 'Name' }, { key: 'email', header: 'Email' }, { key: 'role', header: 'Role' }, { key: 'isActive', header: 'Status', render: (row) => <StatusBadge value={row.isActive ? 'active' : 'blocked'} /> },
  ]} updateAction={adminApi.updateUser} deleteAction={adminApi.deleteUser} renderForm={(props) => <SimpleJsonForm {...props} fields={[{ name: 'name' }, { name: 'phone' }, { name: 'role', type: 'select', options: ['customer', 'vendor', 'admin'].map((value) => ({ value, label: value })) }]} />} />
}

export function AdminVendorsPage() {
  return <ResourceListPage module="vendors" section="vendors" title="Vendor Management" fetcher={adminApi.vendors} filters={statusFilters} columns={[
    { key: 'businessName', header: 'Business' }, { key: 'email', header: 'Email' }, { key: 'city', header: 'City', render: (row) => row.address?.city || 'Not added' }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
  ]} />
}

export function AdminCategoriesPage() {
  return <ResourceListPage module="settings" section="categories" title="Category Management" fetcher={adminApi.categories} createAction={adminApi.createCategory} updateAction={adminApi.updateCategory} deleteAction={adminApi.deleteCategory} columns={[
    { key: 'name', header: 'Name' }, { key: 'type', header: 'Type' }, { key: 'isActive', header: 'Status', render: (row) => <StatusBadge value={row.isActive ? 'active' : 'inactive'} /> },
  ]} renderForm={(props) => <SimpleJsonForm {...props} fields={[{ name: 'name' }, { name: 'type', type: 'select', options: ['business', 'product', 'service', 'event'].map((value) => ({ value, label: value })) }, { name: 'description', type: 'textarea' }]} />} />
}

export function AdminProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState(null)

  return (
    <>
      <ResourceListPage
        module="marketplace"
        section="products"
        title="Product Management"
        fetcher={adminApi.products}
        filters={statusFilters}
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
          { key: 'vendorName', header: 'Vendor Name', render: (row) => row.vendor?.ownerName || row.vendor?.user?.name || '-' },
          { key: 'businessName', header: 'Business Name', render: (row) => row.vendor?.businessName || '-' },
          { key: 'category', header: 'Category', render: (row) => row.category?.name || '-' },
          { key: 'price', header: 'Price', render: (row) => formatCurrency(row.pricing?.sellingPrice) },
          { key: 'stock', header: 'Stock', render: (row) => row.inventory?.isUnlimited ? 'Unlimited' : (row.inventory?.quantity ?? 0) },
          { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          { key: 'createdAt', header: 'Created Date', render: (row) => formatDate(row.createdAt) }
        ]}
        renderActions={(row) => (
          <button
            onClick={() => setSelectedProduct(row)}
            className="inline-flex items-center gap-1 rounded-md border border-[#0d4697]/25 px-2.5 py-1.5 text-xs font-bold text-[#0d4697] hover:bg-blue-50 transition"
          >
            <Eye className="h-3 w-3" />
            View
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

export function AdminServicesPage() {
  const [selectedService, setSelectedService] = useState(null)

  return (
    <>
      <ResourceListPage
        module="marketplace"
        section="services"
        title="Service Management"
        fetcher={adminApi.services}
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
    { key: 'vendor', header: 'Vendor', render: (row) => row.vendor?.businessName || 'Vendor' }, { key: 'plan', header: 'Plan' }, { key: 'price', header: 'Price', render: (row) => formatCurrency(row.price) }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
  ]} />
}

export function AdminMembershipApplicationsPage() {
  const { user } = useAuth()
  const [selected, setSelected] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [reloadList, setReloadList] = useState(null)

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
    } catch (_) {}
  }

  return (
    <>
      <ResourceListPage module="members" section="applications" title="Membership Applications" fetcher={adminApi.membershipApplications} filters={[{ key: 'status', label: 'Status', options: ['submitted', 'documents_verified', 'under_review', 'approved', 'rejected'].map((value) => ({ value, label: value.replaceAll('_', ' ') })) }]} columns={[
        { key: 'applicationNumber', header: 'Member ID/App ID', render: (row) => row.submittedBy?.memberId || row.applicationNumber },
        { key: 'fullName', header: 'Name', render: (row) => row.personal?.fullName || row.submittedBy?.name },
        { key: 'email', header: 'Email', render: (row) => row.personal?.emailAddress || row.submittedBy?.email || 'Not added' },
        { key: 'mobile', header: 'Mobile', render: (row) => row.personal?.mobileNumber || row.submittedBy?.phone || 'Not added' },
        { key: 'plan', header: 'Membership Plan', render: (row) => row.professional?.membershipPlan || row.membership?.plan || 'Silver' },
        { key: 'region', header: 'Region', render: (row) => row.regionId?.name || 'Not assigned' },
        { key: 'state', header: 'State', render: (row) => row.stateId?.name || 'Not assigned' },
        { key: 'district', header: 'District', render: (row) => row.districtId?.name || 'Not assigned' },
        { key: 'chapter', header: 'Chapter', render: (row) => row.chapterId?.name || 'Not assigned' },
        { key: 'submittedBy', header: 'Submitted By (VP)', render: (row) => row.vicePresidentId?.name || row.vicePresidentId?.email || 'Self' },
        { key: 'createdAt', header: 'Submitted Date', render: (row) => formatDate(row.createdAt) },
        { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
      ]} renderActions={(row, { reload }, permissions) => {
        const userRole = user?.role || ''
        const showDropdownStatus = ['superadmin', 'admin'].includes(userRole) && !['approved', 'rejected'].includes(row.status)
        return (
          <>
            {permissions.hasOperation('members', 'view') && <button onClick={() => openDetails(row, reload)} className="inline-flex items-center gap-1.5 rounded-md border border-[#0d4697]/20 px-3 py-1.5 text-xs font-extrabold text-[#0d4697] hover:bg-blue-50">
              <Eye className="h-3.5 w-3.5" />
              View
            </button>}
            {showDropdownStatus && <select
              value={row.status || 'submitted'}
              onChange={(event) => changeRowStatus(row, event.target.value, reload)}
              className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs font-extrabold text-slate-700 outline-none focus:border-[#0d4697]"
              aria-label="Change application status"
            >
              <option value="submitted">Submitted</option>
              <option value="documents_verified">Documents Verified</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Final Approval</option>
              <option value="rejected">Rejected</option>
            </select>}
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
            onDocumentsVerified={() => changeStatus('documents_verified')}
            onUnderReview={() => changeStatus('under_review')}
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

function MembershipApplicationDetails({ application, adminNotes, onNotesChange, onClose, onDocumentsVerified, onUnderReview, onApprove, onReject, updating, user }) {
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
  
  let showVerifyBtn = false
  let showApproveBtn = false
  let showRejectBtn = false

  const isFinalDecision = ['approved', 'rejected'].includes(application.status)

  if (!isFinalDecision) {
    if (['superadmin', 'admin'].includes(userRole)) {
      showVerifyBtn = true
      showApproveBtn = true
      showRejectBtn = true
    } else if (userRole === 'direct_consultant') {
      showVerifyBtn = true
      showApproveBtn = true
      showRejectBtn = true
    } else if (userRole === 'executive_director') {
      showApproveBtn = true
      showRejectBtn = true
    }
  }

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
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge value={application.status} />
          <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-slate-600 ring-1 ring-slate-200">
            Submitted {formatDate(application.createdAt)}
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DetailSection title="Personal Information" items={[
          ['Full Name', application.personal?.fullName],
          ['Date of Birth', application.personal?.dateOfBirth],
          ['Gender', application.personal?.gender],
          ['Mobile Number', application.personal?.mobileNumber],
          ['Email Address', application.personal?.emailAddress],
          ['Submitted By', application.submittedBy?.email || application.submittedBy?.name],
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
        {showVerifyBtn && <button disabled={updating} onClick={onDocumentsVerified} className="inline-flex items-center justify-center rounded-md border border-blue-200 px-4 py-2 text-sm font-extrabold text-[#0d4697] hover:bg-blue-50 disabled:opacity-60">
          Documents Verified
        </button>}
        {showVerifyBtn && <button disabled={updating} onClick={onUnderReview} className="inline-flex items-center justify-center rounded-md border border-amber-200 px-4 py-2 text-sm font-extrabold text-amber-700 hover:bg-amber-50 disabled:opacity-60">
          Under Review
        </button>}
        {showRejectBtn && <button disabled={updating} onClick={onReject} className="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 px-4 py-2 text-sm font-extrabold text-red-600 hover:bg-red-50 disabled:opacity-60">
          <XCircle className="h-4 w-4" />
          Reject
        </button>}
        {showApproveBtn && <button disabled={updating} onClick={onApprove} className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-extrabold text-white hover:bg-emerald-700 disabled:opacity-60">
          <CheckCircle2 className="h-4 w-4" />
          Approve
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

export function AdminPlansPage() {
  return <ResourceListPage module="members" section="plans" title="Membership Plans" fetcher={adminApi.plans} createAction={adminApi.createPlan} updateAction={adminApi.updatePlan} columns={[
    { key: 'displayName', header: 'Plan' }, { key: 'name', header: 'Code' }, { key: 'price', header: 'Monthly', render: (row) => formatCurrency(row.price?.monthly) },
  ]} renderForm={(props) => <SimpleJsonForm {...props} fields={[{ name: 'name' }, { name: 'displayName' }, { name: 'description', type: 'textarea' }]} />} />
}

export function AdminEventsPage() {
  return <ResourceListPage module="events" section="events" title="Event Management" fetcher={adminApi.events} columns={[{ key: 'title', header: 'Title' }, { key: 'type', header: 'Type' }, { key: 'startDate', header: 'Starts', render: (row) => formatDate(row.startDate) }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> }]} />
}

export function AdminReferralsPage() {
  return <ResourceListPage module="referrals" section="referrals" title="Referral Management" fetcher={adminApi.referrals} columns={[{ key: 'referrer', header: 'Referrer', render: (row) => row.referrer?.name || 'User' }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> }]} />
}

export function AdminPaymentsPage() {
  return <ResourceListPage module="reports" section="payments" title="Payment & Transaction Management" fetcher={adminApi.payments} filters={statusFilters} columns={[{ key: 'user', header: 'User', render: (row) => row.user?.name || row.user?.email || 'User' }, { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.amount, row.currency) }, { key: 'gateway', header: 'Gateway' }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> }]} />
}

export function AdminReviewsPage() {
  return <ResourceListPage module="marketplace" section="reviews" title="Review Management" fetcher={adminApi.reviews} filters={statusFilters} columns={[{ key: 'user', header: 'User', render: (row) => row.user?.name || 'User' }, { key: 'vendor', header: 'Vendor', render: (row) => row.vendor?.businessName || 'Vendor' }, { key: 'rating', header: 'Rating' }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> }]} />
}

export function AdminSupportPage() {
  return <ResourceListPage module="settings" section="support" title="Support Tickets" fetcher={adminApi.support} filters={statusFilters} columns={[{ key: 'ticketNumber', header: 'Ticket' }, { key: 'subject', header: 'Subject' }, { key: 'priority', header: 'Priority' }, { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> }]} />
}

export function AdminBannersPage() {
  return <ResourceListPage module="settings" section="banners" title="Banner Management" fetcher={adminApi.banners} createAction={adminApi.createBanner} updateAction={adminApi.updateBanner} deleteAction={adminApi.deleteBanner} columns={[{ key: 'title', header: 'Title' }, { key: 'placement', header: 'Placement' }, { key: 'isActive', header: 'Status', render: (row) => <StatusBadge value={row.isActive ? 'active' : 'inactive'} /> }]} renderForm={(props) => <SimpleJsonForm {...props} fields={[{ name: 'title' }, { name: 'subtitle' }, { name: 'placement', type: 'select', options: ['home', 'directory', 'marketplace', 'events', 'dashboard'].map((value) => ({ value, label: value })) }, { name: 'link' }]} />} />
}

export function AdminFaqsPage() {
  return <ResourceListPage module="settings" section="faqs" title="FAQ Management" fetcher={adminApi.faqs} createAction={adminApi.createFaq} updateAction={adminApi.updateFaq} deleteAction={adminApi.deleteFaq} columns={[{ key: 'question', header: 'Question' }, { key: 'category', header: 'Category' }, { key: 'isActive', header: 'Status', render: (row) => <StatusBadge value={row.isActive ? 'active' : 'inactive'} /> }]} renderForm={(props) => <SimpleJsonForm {...props} fields={[{ name: 'question' }, { name: 'answer', type: 'textarea' }, { name: 'category' }]} />} />
}

export function AdminSettingsPage() {
  return <ResourceListPage module="settings" section="settings" title="Settings" fetcher={adminApi.settings} columns={[{ key: 'key', header: 'Key' }, { key: 'group', header: 'Group' }, { key: 'value', header: 'Value', render: (row) => typeof row.value === 'object' ? JSON.stringify(row.value) : String(row.value) }]} />
}

export function AdminMembersPage() {
  const [regions, setRegions] = useState([])
  const [states, setStates] = useState([])
  const [districts, setDistricts] = useState([])
  const [chapters, setChapters] = useState([])

  useEffect(() => {
    api.get('/organization/regions')
      .then(res => setRegions(res.data?.data?.regions || []))
      .catch(err => console.error("Error loading regions", err))

    api.get('/organization/states')
      .then(res => setStates(res.data?.data?.states || []))
      .catch(err => console.error("Error loading states", err))

    api.get('/organization/districts')
      .then(res => setDistricts(res.data?.data?.districts || []))
      .catch(err => console.error("Error loading districts", err))

    api.get('/organization/chapters')
      .then(res => setChapters(res.data?.data?.chapters || []))
      .catch(err => console.error("Error loading chapters", err))
  }, [])

  const filters = useMemo(() => [
    {
      key: 'region',
      label: 'Region',
      options: regions.map(r => ({ value: r._id, label: r.name }))
    },
    {
      key: 'state',
      label: 'State',
      options: states.map(s => ({ value: s._id, label: s.name }))
    },
    {
      key: 'district',
      label: 'District',
      options: districts.map(d => ({ value: d._id, label: d.name }))
    },
    {
      key: 'chapter',
      label: 'Chapter',
      options: chapters.map(c => ({ value: c._id, label: c.name }))
    },
    {
      key: 'plan',
      label: 'Membership Plan',
      options: [
        { value: 'free', label: 'Free' },
        { value: 'silver', label: 'Silver' },
        { value: 'gold', label: 'Gold' },
        { value: 'platinum', label: 'Platinum' }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'suspended', label: 'Suspended' },
        { value: 'blocked', label: 'Blocked' }
      ]
    }
  ], [regions, states, districts, chapters])

  const columns = useMemo(() => [
    { key: 'memberId', header: 'Member ID', render: (row) => row.memberId || 'N/A' },
    { key: 'name', header: 'Name', render: (row) => row.name },
    { key: 'email', header: 'Email', render: (row) => row.email },
    { key: 'phone', header: 'Mobile', render: (row) => row.phone || 'N/A' },
    { key: 'membershipPlan', header: 'Membership Plan', render: (row) => <span className="uppercase font-bold text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{row.membershipPlan}</span> },
    { key: 'region', header: 'Region', render: (row) => row.region || 'N/A' },
    { key: 'state', header: 'State', render: (row) => row.state || 'N/A' },
    { key: 'district', header: 'District', render: (row) => row.district || 'N/A' },
    { key: 'chapter', header: 'Chapter', render: (row) => row.chapter || 'N/A' },
    { key: 'approvedBy', header: 'Approved By', render: (row) => row.approvedBy || 'N/A' },
    { key: 'approvedRole', header: 'Approver Role', render: (row) => <span className="capitalize font-semibold text-xs text-slate-500">{row.approvedRole?.replaceAll('_', ' ')}</span> },
    { key: 'approvedAt', header: 'Approved Date', render: (row) => formatDate(row.approvedAt) },
    { key: 'status', header: 'Status', render: (row) => {
      let statusVal = 'active'
      if (row.isSuspended) statusVal = 'suspended'
      else if (row.isBlocked) statusVal = 'blocked'
      return <StatusBadge value={statusVal} />
    }},
  ], [])

  return (
    <ResourceListPage
      module="members"
      section="list"
      title="Members"
      description="View and filter all approved members across regions, states, districts, and chapters."
      fetcher={adminApi.members}
      columns={columns}
      filters={filters}
    />
  )
}
