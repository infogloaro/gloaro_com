import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Building2, CheckCircle2, Clock3, PlusCircle, RefreshCcw, ShieldCheck, Trash2, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { vendorApi } from '../../api/vendor'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import EmptyState from '../../components/common/EmptyState'
import LoadingScreen from '../../components/common/LoadingScreen'
import Modal from '../../components/common/Modal'
import SearchableSelect from '../../components/common/SearchableSelect'
import SearchBar from '../../components/common/SearchBar'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/tables/DataTable'
import { useAuth } from '../../hooks/useAuth'
import { formatDate } from '../../utils/format'
import { getAccountClassification, getDashboardRoute } from '../../utils/permissions'

const TAB_DEFS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
]

const REQUEST_FORM_DEFAULTS = {
  categoryId: '',
  description: '',
}

export default function VendorCategoryApprovalsPage() {
  const { user } = useAuth()
  const location = useLocation()
  const account = getAccountClassification(user)
  const isStandaloneVendor = account.isOnlineVendor
  const dashboardBase = location.pathname.startsWith('/member/dashboard') ? '/member/dashboard' : getDashboardRoute(user?.role, user)
  const routeFor = (vendorPath, memberPath = vendorPath) => `${dashboardBase}${isStandaloneVendor ? vendorPath : memberPath}`

  const [requests, setRequests] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [requestModalOpen, setRequestModalOpen] = useState(false)
  const [resubmitModalOpen, setResubmitModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [draft, setDraft] = useState(REQUEST_FORM_DEFAULTS)
  const [submitting, setSubmitting] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const [requestRes, categoryRes] = await Promise.all([
        vendorApi.categoryRequests({ limit: 100, page: 1, sortBy: '-requestedAt' }),
        vendorApi.businessCategories({ isActive: true, all: true }),
      ])

      const requestList = requestRes.data?.data || []
      const categoryList = categoryRes.data?.data || categoryRes.data || []

      setRequests(Array.isArray(requestList) ? requestList : [])
      setCategories((Array.isArray(categoryList) ? categoryList : []).map((category) => ({
        value: category._id,
        label: category.name,
        raw: category,
      })))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const categoryMap = useMemo(() => {
    return new Map(categories.map((category) => [category.value, category]))
  }, [categories])

  const counts = useMemo(() => {
    return requests.reduce((acc, request) => {
      const status = String(request.status || 'pending')
      acc.total += 1
      if (acc[status] !== undefined) acc[status] += 1
      return acc
    }, { total: 0, pending: 0, approved: 0, rejected: 0 })
  }, [requests])

  const visibleRequests = useMemo(() => {
    const term = search.trim().toLowerCase()
    return requests.filter((request) => {
      const matchesTab = activeTab === 'all' || String(request.status) === activeTab
      const categoryName = request.categoryId?.name || categoryMap.get(String(request.categoryId?._id || request.categoryId))?.label || ''
      const haystack = [
        categoryName,
        request.description,
        request.remarks,
        request.reviewedBy?.name,
      ].join(' ').toLowerCase()
      const matchesSearch = !term || haystack.includes(term)
      return matchesTab && matchesSearch
    })
  }, [activeTab, categoryMap, requests, search])

  const openNewRequest = () => {
    setDraft(REQUEST_FORM_DEFAULTS)
    setRequestModalOpen(true)
  }

  const openResubmit = (request) => {
    setSelectedRequest(request)
    setDraft({
      categoryId: String(request.categoryId?._id || request.categoryId || ''),
      description: request.description || '',
    })
    setResubmitModalOpen(true)
  }

  const submitNewRequest = async (event) => {
    event.preventDefault()
    if (!draft.categoryId) return toast.error('Please select a category')

    setSubmitting(true)
    try {
      await vendorApi.requestCategory({
        categoryId: draft.categoryId,
        description: draft.description,
      })
      toast.success('Category request submitted')
      setRequestModalOpen(false)
      setDraft(REQUEST_FORM_DEFAULTS)
      await loadData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit category request')
    } finally {
      setSubmitting(false)
    }
  }

  const submitResubmit = async (event) => {
    event.preventDefault()
    if (!selectedRequest?._id) return

    setSubmitting(true)
    try {
      await vendorApi.resubmitCategoryRequest(selectedRequest._id, {
        description: draft.description,
      })
      toast.success('Category request resubmitted')
      setResubmitModalOpen(false)
      setSelectedRequest(null)
      setDraft(REQUEST_FORM_DEFAULTS)
      await loadData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resubmit category request')
    } finally {
      setSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget?._id) return

    setSubmitting(true)
    try {
      await vendorApi.deleteCategoryRequest(deleteTarget._id)
      toast.success('Pending category request deleted')
      setDeleteTarget(null)
      await loadData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete category request')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingScreen label="Loading categories..." />

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b1f3d] via-[#10305c] to-[#07111f] p-6 text-white shadow-sm">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#ffb20c]">Vendor Dashboard</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Categories</h1>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-200">
              Request categories for your vendor account, monitor approvals, and keep category access aligned with the approved workflow.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to={routeFor('')}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-extrabold text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              Back to Dashboard
            </Link>
            <button
              onClick={openNewRequest}
              disabled={!categories.length}
              className="inline-flex items-center gap-2 rounded-lg bg-[#ffb20c] px-4 py-2 text-sm font-extrabold text-[#0b1f3d] transition hover:bg-[#ffd24d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <PlusCircle className="h-4 w-4" />
              Request Category
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Requests" value={counts.total} icon={ClipboardIcon} />
        <StatCard label="Pending" value={counts.pending} icon={Clock3} />
        <StatCard label="Approved" value={counts.approved} icon={CheckCircle2} />
        <StatCard label="Rejected" value={counts.rejected} icon={XCircle} />
      </section>


      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-950">Request Queue</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Approved requests are locked. Pending requests can be deleted. Rejected requests can be resubmitted.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <SearchBar value={search} onChange={setSearch} placeholder="Search categories or remarks" />
            <button
              onClick={loadData}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 hover:border-[#0d4697] hover:text-[#0d4697]"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 border-b border-slate-200 pb-px">
          {TAB_DEFS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`border-b-2 px-4 py-2 text-xs font-extrabold uppercase tracking-wide transition ${
                activeTab === tab.key
                  ? 'border-[#0d4697] text-[#0d4697]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-5">
          {visibleRequests.length ? (
            <DataTable
              columns={[
                {
                  key: 'category',
                  header: 'Category',
                  render: (row) => (
                    <div>
                      <p className="font-extrabold text-slate-900">{row.categoryId?.name || 'Category'}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">{row.categoryId?.slug || 'category'}</p>
                    </div>
                  ),
                },
                {
                  key: 'description',
                  header: 'Description',
                  render: (row) => (
                    <p className="max-w-md text-sm font-semibold leading-6 text-slate-700">
                      {row.description || 'Not provided'}
                    </p>
                  ),
                },
                { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
                {
                  key: 'remarks',
                  header: 'Remarks',
                  render: (row) => <span className="text-sm font-semibold text-slate-600">{row.remarks || '-'}</span>,
                },
                {
                  key: 'requestedAt',
                  header: 'Requested Date',
                  render: (row) => <span className="text-sm font-semibold text-slate-600">{formatDate(row.requestedAt || row.createdAt)}</span>,
                },
                {
                  key: 'rejectedReason',
                  header: 'Rejected Reason',
                  render: (row) => <span className="text-sm font-semibold text-slate-600">{row.status === 'rejected' ? (row.remarks || '-') : '-'}</span>,
                },
              ]}
              rows={visibleRequests}
              actions={(row) => (
                <div className="flex flex-wrap items-center gap-2">
                  {row.status === 'pending' && (
                    <button
                      onClick={() => setDeleteTarget(row)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-extrabold text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  )}
                  {row.status === 'rejected' && (
                    <button
                      onClick={() => openResubmit(row)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[#0d4697]/20 bg-white px-3 py-1.5 text-xs font-extrabold text-[#0d4697] hover:bg-blue-50"
                    >
                      <RefreshCcw className="h-3.5 w-3.5" />
                      Resubmit
                    </button>
                  )}
                  {row.status === 'approved' && (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700 ring-1 ring-emerald-200">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Locked
                    </span>
                  )}
                </div>
              )}
            />
          ) : (
            <EmptyState
              title="No category requests found"
              description={activeTab === 'all'
                ? 'Create your first category request from this page.'
                : `There are no ${activeTab} category requests yet.`}
            />
          )}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
        <InfoPanel
          title="Request Rules"
          icon={Building2}
          items={[
            'Approved requests are read-only and stay locked.',
            'Pending requests can be removed before review.',
            'Rejected requests can be resubmitted with updated remarks.',
            'A category can only be requested once at a time.',
          ]}
        />
        <InfoPanel
          title="Current Availability"
          icon={ShieldCheck}
          items={[
            `${categories.length} categories available for new requests.`,
            `${counts.approved} approved categories are already active.`,
            `${counts.pending} requests are still awaiting review.`,
            `${counts.rejected} requests can be resubmitted from the table.`,
          ]}
        />
      </section>

      <Modal
        open={requestModalOpen}
        title="Request New Category"
        onClose={() => setRequestModalOpen(false)}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={submitNewRequest} className="space-y-5">
          <div>
            <SearchableSelect
              options={categories}
              value={draft.categoryId}
              onChange={(value) => setDraft((current) => ({ ...current, categoryId: value }))}
              placeholder="Category"
              searchPlaceholder="Search categories"
              noOptionsMessage="No matching categories"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-extrabold text-slate-900">Description</label>
            <textarea
              value={draft.description}
              onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
              rows={4}
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-[#0d4697]"
              placeholder="Briefly explain how this category supports your business"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setRequestModalOpen(false)}
              className="rounded-md border border-slate-200 px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !draft.categoryId}
              className="rounded-md bg-[#0d4697] px-4 py-2 text-sm font-extrabold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Submit Request
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={resubmitModalOpen}
        title="Resubmit Rejected Request"
        onClose={() => setResubmitModalOpen(false)}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={submitResubmit} className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">Category</p>
            <p className="mt-1 text-sm font-extrabold text-slate-900">{selectedRequest?.categoryId?.name || 'Category'}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">Category is locked during resubmission.</p>
          </div>

          <div>
            <label className="text-sm font-extrabold text-slate-900">Description</label>
            <textarea
              value={draft.description}
              onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
              rows={5}
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-[#0d4697]"
              placeholder="Update your request notes before resubmitting"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setResubmitModalOpen(false)}
              className="rounded-md border border-slate-200 px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-[#0d4697] px-4 py-2 text-sm font-extrabold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Resubmit Request
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete pending request?"
        description={`Delete the pending request for ${deleteTarget?.categoryId?.name || 'this category'}? This cannot be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

function StatCard({ label, value, icon: Icon = Clock3 }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#0d4697]/10 text-[#0d4697]">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  )
}

function InfoPanel({ title, icon: Icon, items }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#ffb20c]/20 text-[#0d4697]">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="text-lg font-extrabold text-slate-950">{title}</h3>
      </div>
      <ul className="mt-4 space-y-3 text-sm font-semibold text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0d4697]" />
            <span className="leading-6">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ClipboardIcon(props) {
  return <ShieldCheck {...props} />
}
