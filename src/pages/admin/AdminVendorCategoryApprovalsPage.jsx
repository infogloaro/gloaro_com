import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { CheckCircle2, Eye, History, Loader2, RefreshCw, XCircle } from 'lucide-react'
import { adminApi } from '../../api/admin'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/tables/DataTable'
import { useAuth } from '../../hooks/useAuth'
import { formatDate, getList, getPagination } from '../../utils/format'
import { ROLES } from '../../constants/roleConfig'

const statusTabs = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

const getId = (value) => {
  if (!value) return ''
  if (typeof value === 'object' && value._id) return String(value._id)
  return String(value)
}

const getVendorLabel = (row) =>
  row?.vendorId?.ownerName ||
  row?.vendorId?.user?.name ||
  row?.vendorId?.businessName ||
  'Vendor'

const getBusinessName = (row) => row?.vendorId?.businessName || 'Business'
const getCategoryName = (row) => row?.categoryId?.name || 'Category'
const getOrgValue = (row, field) => row?.vendorId?.[field]?.name || row?.vendorId?.[field]?.code || '-'

function DetailField({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-900">{value || 'Not available'}</p>
    </div>
  )
}

function HistoryItem({ entry }) {
  return (
    <div className="relative pl-6">
      <span className="absolute left-[6px] top-2 h-full w-px bg-slate-200" />
      <span className="absolute left-0 top-2 h-3 w-3 rounded-full bg-[#0d4697]" />
      <div className="rounded-lg border border-slate-200 bg-white p-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-extrabold text-slate-900">{String(entry?.action || 'update').replaceAll('_', ' ')}</p>
          {entry?.isOverride && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-700">Override</span>}
          {entry?.newStatus && <StatusBadge value={entry.newStatus} />}
        </div>
        <p className="mt-1 text-xs font-semibold text-slate-500">
          {entry?.reviewedBy?.name || 'System'} {entry?.reviewedAt ? `on ${formatDate(entry.reviewedAt)}` : ''}
        </p>
        {entry?.remarks && <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{entry.remarks}</p>}
      </div>
    </div>
  )
}

export default function AdminVendorCategoryApprovalsPage() {
  const { user } = useAuth()
  const [payload, setPayload] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('pending')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [reviewTarget, setReviewTarget] = useState(null)
  const [reviewDecision, setReviewDecision] = useState('approve')
  const [reviewRemarks, setReviewRemarks] = useState('')
  const [reviewOverride, setReviewOverride] = useState(false)
  const [reviewLoading, setReviewLoading] = useState(false)
  const isAdminOrSuperAdmin = [ROLES.ADMIN, ROLES.SUPERADMIN].includes(user?.role)
  const showOrganizationColumns = isAdminOrSuperAdmin

  const canReviewRequest = (request) => {
    const role = user?.role
    if ([ROLES.ADMIN, ROLES.SUPERADMIN].includes(role)) return true
    if (role !== ROLES.EXECUTIVE_DIRECTOR) return false

    const userChapter = getId(user?.meta?.adminProfile?.organization?.chapter)
    const requestChapter = getId(request?.vendorId?.chapterId)
    return Boolean(userChapter && requestChapter && userChapter === requestChapter)
  }

  const load = async () => {
    setLoading(true)
    try {
      const response = await adminApi.vendorCategoryQueue({ page, limit: 10, status })
      setPayload(response.data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load vendor category queue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [page, status])

  const rows = useMemo(() => getList(payload), [payload])
  const pagination = useMemo(() => getPagination(payload), [payload])

  const openDetails = (request) => {
    setSelectedRequest(request)
  }

  const openReview = (request, nextDecision, override = false) => {
    setReviewTarget(request)
    setReviewDecision(nextDecision)
    setReviewRemarks('')
    setReviewOverride(override)
  }

  const submitReview = async () => {
    if (!reviewTarget?._id) return

    const decision = String(reviewDecision || '').toLowerCase()
    const remarks = String(reviewRemarks || '').trim()
    if (decision === 'reject' && !remarks) {
      toast.error('Remarks are required when rejecting a request')
      return
    }

    setReviewLoading(true)
    try {
      const response = await adminApi.reviewVendorCategoryApproval(reviewTarget._id, {
        decision,
        remarks,
        override: reviewOverride,
      })
      const updated = response.data?.data || response.data || reviewTarget
      toast.success(`Category request ${reviewOverride ? 'overridden' : decision === 'approve' ? 'approved' : 'rejected'}`)
      setReviewTarget(null)
      if (selectedRequest?._id === reviewTarget._id) {
        setSelectedRequest(updated)
      }
      await load()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update category request')
    } finally {
      setReviewLoading(false)
    }
  }

  const approveQuick = async (request) => {
    setReviewLoading(true)
    try {
      const response = await adminApi.reviewVendorCategoryApproval(request._id, { decision: 'approve', remarks: '', override: false })
      const updated = response.data?.data || response.data || request
      toast.success('Category request approved')
      if (selectedRequest?._id === request._id) {
        setSelectedRequest(updated)
      }
      await load()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve category request')
    } finally {
      setReviewLoading(false)
    }
  }

  const isApprovedOrRejected = (request) => ['approved', 'rejected'].includes(String(request?.status || '').toLowerCase())

  const columns = useMemo(() => {
    const organizationColumns = showOrganizationColumns ? [
      { key: 'region', header: 'Region', render: (row) => getOrgValue(row, 'regionId') },
      { key: 'state', header: 'State', render: (row) => getOrgValue(row, 'stateId') },
      { key: 'district', header: 'District', render: (row) => getOrgValue(row, 'districtId') },
      { key: 'chapter', header: 'Chapter', render: (row) => getOrgValue(row, 'chapterId') },
    ] : []

    return [
    { key: 'vendor', header: 'Vendor', render: (row) => getVendorLabel(row) },
    { key: 'businessName', header: 'Business Name', render: (row) => getBusinessName(row) },
    ...organizationColumns,
    { key: 'category', header: 'Category', render: (row) => getCategoryName(row) },
    { key: 'description', header: 'Description', render: (row) => row.description || '-' },
    { key: 'requestedAt', header: 'Requested Date', render: (row) => formatDate(row.requestedAt || row.createdAt) },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
    ]
  }, [showOrganizationColumns])

  const actions = (row) => {
    const allowed = canReviewRequest(row)
    const finalized = isApprovedOrRejected(row)

    return (
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => openDetails(row)}
          className="inline-flex items-center gap-1.5 rounded-md border border-[#0d4697]/20 bg-white px-3 py-1.5 text-xs font-extrabold text-[#0d4697] hover:bg-blue-50 transition"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </button>
        {allowed && !finalized && (
          <>
            <button
              type="button"
              onClick={() => approveQuick(row)}
              disabled={reviewLoading}
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-extrabold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 transition"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Approve
            </button>
            <button
              type="button"
              onClick={() => openReview(row, 'reject', false)}
              className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-xs font-extrabold text-white hover:bg-red-700 transition"
            >
              <XCircle className="h-3.5 w-3.5" />
              Reject
            </button>
          </>
        )}
        {allowed && finalized && (
          <button
            type="button"
            onClick={() => openReview(row, row.status === 'approved' ? 'reject' : 'approve', true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-extrabold text-amber-800 hover:bg-amber-100 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Override
          </button>
        )}
      </div>
    )
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950">Vendor Category Approval Queue</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Review vendor category requests with chapter-scoped access for Executive Directors and full scope for Admin and Super Admin.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {statusTabs.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => { setStatus(item.value); setPage(1) }}
              className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${
                status === item.value
                  ? 'bg-[#0d4697] text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        pagination={pagination}
        onPageChange={setPage}
        actions={actions}
      />

      <Modal open={Boolean(selectedRequest)} title="Vendor Category Request Details" onClose={() => setSelectedRequest(null)} maxWidth="max-w-6xl">
        {selectedRequest && (
          <div className="space-y-5">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Request Overview</p>
                  <h3 className="mt-1 text-xl font-extrabold text-slate-950">{getVendorLabel(selectedRequest)}</h3>
                  <p className="text-sm font-semibold text-slate-600">{getBusinessName(selectedRequest)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge value={selectedRequest.status} />
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-slate-600 ring-1 ring-slate-200">
                    Requested {formatDate(selectedRequest.requestedAt || selectedRequest.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <DetailField label="Vendor" value={getVendorLabel(selectedRequest)} />
              <DetailField label="Business Name" value={getBusinessName(selectedRequest)} />
              {showOrganizationColumns && (
                <>
                  <DetailField label="Region" value={getOrgValue(selectedRequest, 'regionId')} />
                  <DetailField label="State" value={getOrgValue(selectedRequest, 'stateId')} />
                  <DetailField label="District" value={getOrgValue(selectedRequest, 'districtId')} />
                  <DetailField label="Chapter" value={getOrgValue(selectedRequest, 'chapterId')} />
                </>
              )}
              <DetailField label="Category" value={getCategoryName(selectedRequest)} />
              <DetailField label="Requested Date" value={formatDate(selectedRequest.requestedAt || selectedRequest.createdAt)} />
              <DetailField label="Reviewed By" value={selectedRequest.reviewedBy?.name || 'Not reviewed yet'} />
              <DetailField label="Reviewed Date" value={formatDate(selectedRequest.reviewedAt)} />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Description</p>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-700">{selectedRequest.description || 'No description provided'}</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-[#0d4697]" />
                  <h4 className="text-sm font-extrabold text-slate-950">History</h4>
                </div>
                <div className="mt-4 space-y-4">
                  {(selectedRequest.history || []).length > 0 ? (
                    selectedRequest.history.map((entry, index) => <HistoryItem key={`${entry.action || 'history'}-${index}`} entry={entry} />)
                  ) : (
                    <p className="text-sm font-semibold text-slate-500">No history available yet.</p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Actions</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {canReviewRequest(selectedRequest) && selectedRequest.status === 'pending' && (
                    <>
                      <button
                        type="button"
                        onClick={() => approveQuick(selectedRequest)}
                        disabled={reviewLoading}
                        className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-2 text-xs font-extrabold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 transition"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => openReview(selectedRequest, 'reject', false)}
                        className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-2 text-xs font-extrabold text-white hover:bg-red-700 transition"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </button>
                    </>
                  )}
                  {canReviewRequest(selectedRequest) && selectedRequest.status !== 'pending' && (
                    <button
                      type="button"
                      onClick={() => openReview(selectedRequest, selectedRequest.status === 'approved' ? 'reject' : 'approve', true)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-extrabold text-amber-800 hover:bg-amber-100 transition"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Override
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={Boolean(reviewTarget)} title={reviewOverride ? 'Override Review' : reviewDecision === 'reject' ? 'Reject Request' : 'Approve Request'} onClose={() => setReviewTarget(null)} maxWidth="max-w-2xl">
        {reviewTarget && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Request</p>
              <h3 className="mt-1 text-lg font-extrabold text-slate-950">{getVendorLabel(reviewTarget)}</h3>
              <p className="text-sm font-semibold text-slate-600">{getBusinessName(reviewTarget)} - {getCategoryName(reviewTarget)}</p>
            </div>

            {reviewOverride && (
              <div>
                <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-slate-500">Decision</label>
                <select
                  value={reviewDecision}
                  onChange={(event) => setReviewDecision(event.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900"
                >
                  <option value="approve">Approve</option>
                  <option value="reject">Reject</option>
                </select>
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Remarks {reviewDecision === 'reject' ? <span className="text-red-600">*</span> : null}
              </label>
              <textarea
                rows={4}
                value={reviewRemarks}
                onChange={(event) => setReviewRemarks(event.target.value)}
                placeholder={reviewDecision === 'reject' ? 'Provide the rejection reason' : 'Optional remarks'}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-[#0d4697]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReviewTarget(null)}
                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitReview}
                disabled={reviewLoading}
                className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-extrabold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  reviewDecision === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {reviewLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {reviewOverride ? 'Save Override' : reviewDecision === 'reject' ? 'Reject Request' : 'Approve Request'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}
