import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import {
  Building2,
  CheckCircle2,
  Eye,
  Loader2,
  XCircle,
} from 'lucide-react'
import { adminApi } from '../../api/admin'
import Modal from '../../components/common/Modal'
import SearchBar from '../../components/common/SearchBar'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/tables/DataTable'
import { useAuth } from '../../hooks/useAuth'
import { formatDate, getList, getPagination } from '../../utils/format'

export default function UnitApprovalsPage() {
  const { user } = useAuth()
  const [payload, setPayload] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [saving, setSaving] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const districtId = user?.meta?.adminProfile?.organization?.district?._id || user?.meta?.adminProfile?.organization?.district || ''

  const params = useMemo(() => ({
    page,
    limit: 10,
    search: search || undefined,
    status: status || undefined,
    type: 'chapter',
    parent: districtId || undefined,
  }), [page, search, status, districtId])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [recordsResponse, statsResponse] = await Promise.all([
        adminApi.enterpriseRecords('organization', params),
        adminApi.enterpriseStats('organization', params),
      ])
      setPayload(recordsResponse.data)
      setStats(statsResponse.data?.data || null)
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    const timer = window.setTimeout(() => load(), 0)
    return () => window.clearTimeout(timer)
  }, [load])

  const rows = getList(payload)
  const pagination = getPagination(payload)

  const openDetails = async (row) => {
    setSelected(row)
    setRejectReason(row.rejectedReason || '')
    setLoadingDetails(true)
    try {
      const response = await adminApi.enterpriseRecord(row._id)
      const record = response.data?.data || row
      setSelected(record)
      setRejectReason(record.rejectedReason || '')
    } finally {
      setLoadingDetails(false)
    }
  }

  const refreshSelected = async (id) => {
    if (!selected?._id || selected._id !== id) return
    const response = await adminApi.enterpriseRecord(id)
    const record = response.data?.data || selected
    setSelected(record)
    setRejectReason(record.rejectedReason || '')
  }

  const approve = async (row) => {
    setSaving(true)
    try {
      await adminApi.approveChapter(row._id, {})
      toast.success('Unit approved successfully')
      await load()
      await refreshSelected(row._id)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve unit')
    } finally {
      setSaving(false)
    }
  }

  const reject = async (row, reasonValue = rejectReason) => {
    const reason = String(reasonValue || '').trim()
    if (!reason) {
      toast.error('Rejection reason is required')
      return
    }

    setSaving(true)
    try {
      await adminApi.rejectChapter(row._id, { reason })
      toast.success('Unit rejected successfully')
      await load()
      await refreshSelected(row._id)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject unit')
    } finally {
      setSaving(false)
    }
  }

  const unitStats = useMemo(() => {
    const counts = Object.fromEntries((stats?.byStatus || []).map((item) => [item._id, item.count]))
    return [
      { label: 'Total Unit Approvals', value: stats?.total || 0 },
      { label: 'Pending Approval', value: counts.pending_approval || 0 },
      { label: 'Active', value: counts.active || 0 },
      { label: 'Rejected', value: counts.rejected || 0 },
      { label: 'Inactive', value: counts.inactive || 0 },
    ]
  }, [stats])

  const formatLabel = (val) => val.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  return (
    <section className="space-y-6">
      <EnterpriseHeader
        title="Unit Approval Queue"
        description="Review Unit requests submitted by Launch Directors under your assigned District, then approve or reject them."
        icon={Building2}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {unitStats.map((card) => (
          <article key={card.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-extrabold uppercase text-slate-400">{card.label}</p>
            <p className="mt-2 text-2xl font-black text-slate-950">{card.value}</p>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1) }} placeholder="Search unit approvals" />
          <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold">
            <option value="">All Statuses</option>
            {['pending_approval', 'active', 'rejected', 'inactive'].map((value) => (
              <option key={value} value={value}>{formatLabel(value)}</option>
            ))}
          </select>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'name', header: 'Unit Name' },
          { key: 'region', header: 'Region', render: (row) => row.parent?.parent?.parent?.name || '-' },
          { key: 'state', header: 'State', render: (row) => row.parent?.parent?.name || '-' },
          { key: 'district', header: 'District', render: (row) => row.parent?.name || '-' },
          { key: 'createdBy', header: 'Created By', render: (row) => row.createdBy?.name || row.createdBy?.email || 'System' },
          { key: 'createdAt', header: 'Created Date', render: (row) => formatDate(row.createdAt) },
          { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
        ]}
        rows={rows}
        loading={loading}
        pagination={pagination}
        onPageChange={setPage}
        actions={(row) => (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => openDetails(row)}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#0d4697]/25 px-3 py-1.5 text-xs font-bold text-[#0d4697] hover:bg-blue-50"
            >
              <Eye className="h-3.5 w-3.5" />
              View
            </button>
            <button
              type="button"
              disabled={saving || row.status !== 'pending_approval'}
              onClick={() => approve(row)}
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-extrabold text-white disabled:opacity-50"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Approve
            </button>
            <button
              type="button"
              disabled={saving || row.status !== 'pending_approval'}
              onClick={() => {
                const reason = window.prompt('Enter a rejection reason')
                if (reason) reject(row, reason)
              }}
              className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-xs font-extrabold text-white disabled:opacity-50"
            >
              <XCircle className="h-3.5 w-3.5" />
              Reject
            </button>
          </div>
        )}
      />

      <Modal open={Boolean(selected)} title="Unit Details" onClose={() => setSelected(null)} maxWidth="max-w-5xl">
        {loadingDetails ? (
          <div className="grid min-h-40 place-items-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#0d4697]" />
          </div>
        ) : selected ? (
          <div className="space-y-5">
            <div className="flex flex-col justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Unit</p>
                <h3 className="mt-1 text-xl font-black text-slate-950">{selected.name}</h3>
                <p className="mt-1 text-sm font-semibold text-slate-600">
                  {selected.parent?.parent?.parent?.name || 'Region'} / {selected.parent?.parent?.name || 'State'} / {selected.parent?.name || 'District'}
                </p>
              </div>
              <StatusBadge value={selected.status} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <DetailSection title="Location Details" items={[
                ['Region', selected.parent?.parent?.parent?.name],
                ['State', selected.parent?.parent?.name],
                ['District', selected.parent?.name],
                ['Code', selected.code],
              ]} />
              <DetailSection title="Approval Audit" items={[
                ['Requested By', selected.requestedBy?.name || selected.createdBy?.name || 'System'],
                ['Requested At', formatDate(selected.requestedAt || selected.createdAt)],
                ['Approved By', selected.approvedBy?.name || '-'],
                ['Approved At', formatDate(selected.approvedAt)],
                ['Rejected By', selected.rejectedBy?.name || '-'],
                ['Rejected At', formatDate(selected.rejectedAt)],
              ]} />
            </div>

            {selected.status === 'pending_approval' && (
              <section className="rounded-lg border border-slate-200 bg-white p-4">
                <label className="text-sm font-extrabold text-slate-950">Rejection Reason</label>
                <textarea
                  value={rejectReason}
                  onChange={(event) => setRejectReason(event.target.value)}
                  rows={4}
                  placeholder="Add a rejection reason before rejecting this unit"
                  className="mt-2 w-full rounded-md border border-slate-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    disabled={saving}
                    onClick={() => reject(selected)}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-red-600 px-6 text-sm font-extrabold text-white disabled:opacity-50"
                  >
                    Reject Unit
                  </button>
                  <button
                    disabled={saving}
                    onClick={() => approve(selected)}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-600 px-6 text-sm font-extrabold text-white disabled:opacity-50"
                  >
                    Approve Unit
                  </button>
                </div>
              </section>
            )}

            {selected.rejectedReason && selected.status === 'rejected' && (
              <div className="mt-3 rounded-md bg-red-50 p-4 border border-red-100">
                <p className="text-xs font-extrabold text-red-800 uppercase tracking-wide">Rejection Reason</p>
                <p className="mt-1 text-sm font-semibold text-red-700">{selected.rejectedReason}</p>
              </div>
            )}
          </div>
        ) : null}
      </Modal>
    </section>
  )
}

function EnterpriseHeader({ title, description, icon: Icon }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/60 bg-white/85 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white flex items-center gap-2">
          {Icon && <Icon className="h-8 w-8 text-[#0d4697]" />}
          {title}
        </h1>
        {description && <p className="mt-2 text-sm font-semibold text-slate-555">{description}</p>}
      </div>
    </header>
  )
}

function DetailSection({ title, items }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h4 className="mb-4 text-sm font-black text-slate-900">{title}</h4>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map(([label, value], i) => (
          <div key={i}>
            <p className="text-xs font-extrabold uppercase text-slate-500">{label}</p>
            <p className="mt-1 text-sm font-bold text-slate-900">{value || '-'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
