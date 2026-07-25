import { useState } from 'react'
import toast from 'react-hot-toast'
import { CheckCircle2, ExternalLink, Eye, FileText, Loader2, XCircle } from 'lucide-react'
import api from '../../api/axios'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import { useAuth } from '../../hooks/useAuth'
import { formatDate } from '../../utils/format'
import ResourceListPage from '../shared/ResourceListPage'
import { ROLES } from '../../constants/roleConfig.js'

const formatRoleLabel = (roleStr = '') => {
  const clean = String(roleStr || '').toLowerCase().replaceAll('_', ' ').replaceAll('-', ' ')
  if (clean === 'executive director' || clean === 'chapter director') return 'EXECUTIVE DIRECTOR'
  if (clean === ROLES.SUPERADMIN) return 'SUPER ADMIN'
  if (clean === ROLES.ADMIN) return 'ADMIN'
  if (clean === 'vice president') return 'VICE PRESIDENT'
  return clean.toUpperCase() || 'SYSTEM'
}

export default function VicePresidentVendorApplicationsPage() {
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
      const response = await api.get(`/vendor-applications/${row._id}`)
      const application = response.data?.data || row
      setSelected(application)
      setAdminNotes(application.adminNotes || '')
    } catch {
      toast.error('Failed to load application details')
    } finally {
      setLoadingDetails(false)
    }
  }

  const changeStatus = async (status) => {
    if (!selected?._id) return
    setUpdatingStatus(true)
    try {
      const response = await api.patch(`/vendor-applications/${selected._id}/status`, { status, adminNotes })
      const updated = response.data?.data || { ...selected, status, adminNotes }
      setSelected(updated)
      toast.success(`Application marked ${status.replaceAll('_', ' ')}`)
      reloadList?.()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const changeRowStatus = async (row, status, reload) => {
    if (!row?._id || !status || status === row.status) return
    try {
      await api.patch(`/vendor-applications/${row._id}/status`, { status, adminNotes: row.adminNotes || '' })
      toast.success(`Application marked ${status.replaceAll('_', ' ')}`)
      reload?.()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status')
    }
  }

  return (
    <>
      <ResourceListPage
        title="Vendor Applications"
        description="Pre-screen assigned vendor applications that are waiting for Vice President review."
        fetcher={(params) => api.get('/vendor-applications', { params })}
        filters={[]}
        columns={[
          { key: 'businessName', header: 'Business Name', render: (row) => row.step2?.details?.businessName || 'Business' },
          { key: 'fullName', header: 'Applicant Name', render: (row) => row.step2?.personal?.fullName || 'Applicant' },
          { key: 'source', header: 'Source', render: (row) => row.applicationSource || row.submittedFromLabel || row.submittedFrom?.replaceAll('_', ' ') || 'Unknown' },
          { key: 'region', header: 'Region', render: (row) => row.regionId?.name || '-' },
          { key: 'state', header: 'State', render: (row) => row.stateId?.name || '-' },
          { key: 'district', header: 'District', render: (row) => row.districtId?.name || '-' },
          { key: 'chapter', header: 'Chapter', render: (row) => row.chapterId?.name || '-' },
          { key: 'createdAt', header: 'Submitted Date', render: (row) => formatDate(row.createdAt) },
          { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
        ]}
        renderActions={(row, { reload }) => {
          const isFinalized = ['rejected_by_vp'].includes(row.status)
          const reviewerRole = row.reviewedByRole || ''
          const userRole = user?.role || ''
          const userOrg = user?.meta?.adminProfile?.organization || {}
          const isAssignedChapter = String(row.chapterId?._id || row.chapterId) === String(userOrg.chapter?._id || userOrg.chapter || '')
          const canAct = userRole === ROLES.VICE_PRESIDENT && isAssignedChapter && row.status === 'pending_vp_review'

          return (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openDetails(row, reload)}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#0d4697]/20 px-3 py-1.5 text-xs font-extrabold text-[#0d4697] hover:bg-blue-50"
              >
                <Eye className="h-3.5 w-3.5" />
                View
              </button>
              {canAct && (
                <>
                  <button
                    onClick={() => changeRowStatus(row, 'submitted', reload)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-md bg-emerald-600 px-3 text-xs font-extrabold text-white hover:bg-emerald-700"
                  >
                    Forward
                  </button>
                  <button
                    onClick={() => changeRowStatus(row, 'rejected_by_vp', reload)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-md bg-red-600 px-3 text-xs font-extrabold text-white hover:bg-red-700"
                  >
                    Reject
                  </button>
                </>
              )}
              {isFinalized && (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 border border-slate-200">
                  {row.status === 'rejected_by_vp' ? 'Rejected by' : 'Reviewed by'} {formatRoleLabel(reviewerRole)}
                </span>
              )}
            </div>
          )
        }}
      />

      <Modal open={Boolean(selected)} title="Vendor Application Details" onClose={() => setSelected(null)} maxWidth="max-w-6xl">
        {loadingDetails ? (
          <div className="grid min-h-48 place-items-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#0d4697]" />
          </div>
        ) : (
          <VendorApplicationDetails
            application={selected}
            adminNotes={adminNotes}
            onNotesChange={setAdminNotes}
            onClose={() => setSelected(null)}
            onForward={() => changeStatus('submitted')}
            onReject={() => changeStatus('rejected_by_vp')}
            updating={updatingStatus}
            user={user}
          />
        )}
      </Modal>
    </>
  )
}

function VendorApplicationDetails({ application, adminNotes, onNotesChange, onClose, onForward, onReject, updating, user }) {
  if (!application) return null

  const openDocument = async (field) => {
    try {
      const response = await api.get(`/vendor-applications/${application._id}/documents/${field}/url`)
      const url = response.data?.data?.url
      if (url) window.open(url, '_blank', 'noopener,noreferrer')
    } catch {
      toast.error('Unable to open document')
    }
  }

  const reviewerRole = application.reviewedByRole || ''
  const isFinalized = ['rejected_by_vp'].includes(application.status)
  const userRole = user?.role || ''
  const userOrg = user?.meta?.adminProfile?.organization || {}
  const isAssignedChapter = String(application.chapterId?._id || application.chapterId) === String(userOrg.chapter?._id || userOrg.chapter || '')
  const showActions = userRole === ROLES.VICE_PRESIDENT && isAssignedChapter && application.status === 'pending_vp_review'

  const documents = [
    ['profilePhoto', 'Profile Photo'],
    ['registrationCertificate', 'Registration Certificate'],
    ['gstCertificate', 'GST Certificate'],
    ['businessLogo', 'Business Logo'],
    ['ownerIdProof', 'Owner ID Proof'],
    ['shopPhoto', 'Shop Photo'],
  ].map(([key, label]) => ({ key, label, file: key === 'profilePhoto' ? application.step2?.personal?.profilePhoto : application.step3?.documents?.[key] })).filter((item) => item.file?.url)

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Applicant</p>
          <h3 className="mt-1 text-xl font-extrabold text-slate-950">{application.step2?.personal?.fullName || 'Owner'}</h3>
          <p className="text-sm font-semibold text-slate-600">{application.step2?.details?.businessName || 'Business'}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            Source: <span className="text-slate-800">{application.applicationSource || application.submittedFromLabel || application.submittedFrom?.replaceAll('_', ' ') || 'Unknown'}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge value={application.status} />
          <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-slate-600 ring-1 ring-slate-200">
            Submitted {formatDate(application.createdAt)}
          </span>
          {application.reviewedAt && (
            <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-slate-600 ring-1 ring-slate-200">
              Reviewed {formatDate(application.reviewedAt)}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DetailSection title="Personal Information" items={[
          ['Full Name', application.step2?.personal?.fullName],
          ['Date of Birth', application.step2?.personal?.dateOfBirth],
          ['Gender', application.step2?.personal?.gender],
          ['Mobile Number', application.step2?.personal?.mobileNumber],
          ['Email Address', application.step2?.personal?.email],
        ]} />
        <DetailSection title="Business Address" items={[
          ['Address Line 1', application.step2?.address?.line1],
          ['Address Line 2', application.step2?.address?.line2],
          ['Landmark', application.step2?.address?.landmark],
          ['City', application.step2?.address?.city],
          ['State', application.step2?.address?.state],
          ['Pincode', application.step2?.address?.pincode],
        ]} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DetailSection title="Organization Context" items={[
          ['Region', application.regionId?.name || 'Not Scoped'],
          ['State', application.stateId?.name || 'Not Scoped'],
          ['District', application.districtId?.name || 'Not Scoped'],
          ['Chapter', application.chapterId?.name || 'Not Scoped'],
        ]} />
        <DetailSection title="Business Details" items={[
          ['Business Name', application.step2?.details?.businessName],
          ['Category', application.step2?.details?.businessCategory?.name],
          ['Business Type', application.step2?.details?.businessType],
          ['Years of Experience', application.step2?.details?.yearsOfExperience],
          ['Background Summary', application.step2?.details?.professionalBackground],
          ['Why Join GLOARO', application.step2?.details?.whyJoinGloaro],
          ['Website', application.step2?.digitalPresence?.website],
          ['Instagram', application.step2?.digitalPresence?.instagram],
          ['Business Email', application.step2?.digitalPresence?.businessEmail],
        ]} />
      </div>

      <DetailSection title="Credentials" items={[
        ['Registration Number', application.step3?.credentials?.businessRegistrationNumber],
        ['GST Number', application.step3?.credentials?.gstNumber || 'Not added'],
        ['PAN Number', application.step3?.credentials?.panNumber],
      ]} />

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h4 className="text-sm font-extrabold text-slate-950">Verification Files</h4>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {documents.map(({ key, label, file }) => (
            <button key={key} type="button" onClick={() => openDocument(key)} className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-left text-sm font-bold text-slate-700 hover:border-[#0d4697]/40 hover:bg-blue-50">
              <span className="flex min-w-0 items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-[#0d4697]" />
                <span className="min-w-0">
                  <span className="block truncate">{label}</span>
                  <span className="block truncate text-xs font-semibold text-slate-500">{file.originalName || 'Attachment'}</span>
                </span>
              </span>
              <ExternalLink className="h-4 w-4 shrink-0" />
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <label htmlFor="vendor-vp-review-notes" className="text-sm font-extrabold text-slate-950">VP Notes / Comments</label>
        <textarea
          id="vendor-vp-review-notes"
          value={adminNotes}
          onChange={(event) => onNotesChange(event.target.value)}
          rows={4}
          disabled={isFinalized}
          placeholder={isFinalized ? 'Finalized application notes' : 'Add VP review remarks here...'}
          className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-[#0d4697] focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
        />
        {application.reviewedBy && (
          <p className="mt-2 text-xs font-semibold text-slate-500">
            Reviewed by official on {formatDate(application.reviewedAt)}
          </p>
        )}
      </section>

      <div className="sticky bottom-0 flex flex-col gap-2 border-t border-slate-200 bg-white pt-4 sm:flex-row sm:justify-end">
        <button disabled={updating} onClick={onClose} className="inline-flex items-center justify-center rounded-md border border-slate-200 px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50 disabled:opacity-60">
          Close
        </button>
        {showActions && (
          <>
            <button disabled={updating} onClick={onReject} className="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 px-4 py-2 text-sm font-extrabold text-red-600 hover:bg-red-50 disabled:opacity-60">
              <XCircle className="h-4 w-4" />
              Reject
            </button>
            <button disabled={updating} onClick={onForward} className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-extrabold text-white hover:bg-emerald-700 disabled:opacity-60">
              <CheckCircle2 className="h-4 w-4" />
              Forward
            </button>
          </>
        )}
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
