import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Eye, Loader2, PlugZap } from 'lucide-react'
import DataTable from '../../components/tables/DataTable'
import Modal from '../../components/common/Modal'
import SearchBar from '../../components/common/SearchBar'
import StatusBadge from '../../components/common/StatusBadge'
import { forms } from '../../components/partners/forms/formConfig'
import { PARTNERSHIP_STATUSES, partnershipAdminApi } from '../../api/partnershipApplication'
import { formatDate, getList, getPagination } from '../../utils/format'

// Admin review for Franchise and Channel Partner applications. The two types
// are filtered separately and never merged into one record. Data comes only
// from the protected admin API; nothing personal is logged or tracked here.

const TYPES = [
  ['', 'All'],
  ['FRANCHISE', 'Franchise'],
  ['CHANNEL_PARTNER', 'Channel Partner'],
]
const typeLabel = { FRANCHISE: 'Franchise', CHANNEL_PARTNER: 'Channel Partner' }
const statusLabel = (status) => String(status || '').toLowerCase().replaceAll('_', ' ')

// Field labels per application type, from the same config the public forms use.
const labelsByType = Object.fromEntries(
  Object.values(forms).map((form) => [form.type, Object.fromEntries(form.steps.flatMap((step) => step.fields).map((field) => [field.name, field.label.replace(' (optional)', '')]))]),
)

const recordId = (row) => row?._id || row?.id
const showValue = (value) => {
  if (Array.isArray(value)) return value.length ? value.join(', ') : 'Not provided'
  if (value === null || value === undefined || value === '') return 'Not provided'
  return String(value)
}

export default function PartnershipApplicationsPage() {
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [payload, setPayload] = useState(null)
  const [loading, setLoading] = useState(true)
  const [unavailable, setUnavailable] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setQuery(search.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [search])

  const params = useMemo(() => ({
    page,
    limit: 10,
    type: type || undefined,
    status: status || undefined,
    from: from || undefined,
    to: to || undefined,
    search: query || undefined,
  }), [page, type, status, from, to, query])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await partnershipAdminApi.list(params)
      setPayload(response.data)
      setUnavailable(false)
    } catch (error) {
      const code = error?.response?.status
      // 404 or no response: the backend for this module is not live yet.
      if (!error?.response || code === 404) setUnavailable(true)
      else if (code === 401 || code === 403) toast.error('You do not have access to partnership applications.')
      else toast.error('Could not load partnership applications. Please try again.')
      setPayload(null)
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    const timer = window.setTimeout(() => load(), 0)
    return () => window.clearTimeout(timer)
  }, [load])

  const setFilter = (setter) => (value) => {
    setter(value)
    setPage(1)
  }

  const columns = [
    { key: 'reference', header: 'Reference', render: (row) => <span className="font-extrabold text-slate-900">{row.reference || 'Not issued'}</span> },
    { key: 'type', header: 'Type', render: (row) => typeLabel[row.applicationType] || row.applicationType || 'Unknown' },
    { key: 'name', header: 'Name', render: (row) => row.contact?.fullName || 'Not provided' },
    { key: 'email', header: 'Email', render: (row) => row.contact?.email || 'Not provided' },
    { key: 'city', header: 'City', render: (row) => row.contact?.city || 'Not provided' },
    { key: 'createdAt', header: 'Submitted', render: (row) => formatDate(row.createdAt) },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge value={String(row.status || '').toLowerCase()} /> },
  ]

  const input = 'h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800'

  return (
    <section>
      <div className="mb-5 flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950">Partnership Applications</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">Franchise and Channel Partner applications from the public partner pages.</p>
        </div>

        <div role="tablist" aria-label="Application type" className="inline-flex w-fit rounded-lg border border-slate-200 bg-white p-1">
          {TYPES.map(([value, label]) => (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={type === value}
              onClick={() => setFilter(setType)(value)}
              className={`rounded-md px-4 py-2 text-sm font-extrabold transition ${type === value ? 'bg-[#0d4697] text-white' : 'text-slate-600 hover:text-[#0d4697]'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1) }} placeholder="Search reference, name or email" />
          <label className="sr-only" htmlFor="partner-status">Status</label>
          <select id="partner-status" value={status} onChange={(event) => setFilter(setStatus)(event.target.value)} className={input}>
            <option value="">All statuses</option>
            {PARTNERSHIP_STATUSES.map((value) => <option key={value} value={value} className="capitalize">{statusLabel(value)}</option>)}
          </select>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500">
            From
            <input type="date" value={from} max={to || undefined} onChange={(event) => setFilter(setFrom)(event.target.value)} className={input} />
          </label>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500">
            To
            <input type="date" value={to} min={from || undefined} onChange={(event) => setFilter(setTo)(event.target.value)} className={input} />
          </label>
        </div>
      </div>

      {unavailable ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <PlugZap aria-hidden="true" className="h-8 w-8 text-[#0d4697]" />
          <p className="text-base font-extrabold text-slate-900">The partnership applications API is not connected yet.</p>
          <p className="max-w-md text-sm font-semibold text-slate-500">Applications will appear here once the backend endpoints are live. The public forms keep submission locked until then, so no applications are being lost.</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={getList(payload)}
          loading={loading && !payload}
          pagination={getPagination(payload)}
          onPageChange={setPage}
          actions={(row) => (
            <button type="button" onClick={() => setSelected(row)} className="inline-flex items-center gap-1.5 rounded-md border border-[#0d4697]/20 px-3 py-1.5 text-xs font-extrabold text-[#0d4697] hover:bg-blue-50">
              <Eye aria-hidden="true" className="h-3.5 w-3.5" /> View
            </button>
          )}
          emptyTitle={query ? `No results for “${query}”` : 'No applications yet'}
          emptyDescription={query ? 'Try a reference like GF-2026-0001, a name or an email.' : 'New Franchise and Channel Partner applications will appear here.'}
        />
      )}

      <Modal open={Boolean(selected)} title={selected?.reference ? `Application ${selected.reference}` : 'Application details'} onClose={() => setSelected(null)} maxWidth="max-w-4xl">
        {selected && <ApplicationDetails key={recordId(selected)} row={selected} onSaved={load} />}
      </Modal>
    </section>
  )
}

function ApplicationDetails({ row, onSaved }) {
  const [application, setApplication] = useState(row)
  const [loading, setLoading] = useState(true)
  const [nextStatus, setNextStatus] = useState(row.status || 'SUBMITTED')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const id = recordId(row)

  useEffect(() => {
    let active = true
    partnershipAdminApi.get(id)
      .then((response) => {
        if (!active) return
        const full = response.data?.data || response.data || row
        setApplication(full)
        setNextStatus(full.status || 'SUBMITTED')
      })
      .catch(() => { /* keep the list row; details may be partial */ })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id, row])

  const save = async () => {
    if (nextStatus === application.status && !note.trim()) return
    setSaving(true)
    try {
      const response = await partnershipAdminApi.updateStatus(id, { status: nextStatus, note: note.trim() || undefined })
      const updated = response.data?.data || { ...application, status: nextStatus }
      setApplication(updated)
      setNote('')
      toast.success(`Status saved: ${statusLabel(nextStatus)}`)
      onSaved?.()
    } catch {
      // The axios interceptor shows the server's message.
    } finally {
      setSaving(false)
    }
  }

  const labels = labelsByType[application.applicationType] || {}
  const contact = application.contact || {}
  const answers = application.answers || {}
  const consents = application.consents || {}
  const history = application.history || application.auditHistory || []

  return (
    <div className="space-y-5 text-sm">
      {loading && <p className="flex items-center gap-2 font-semibold text-slate-500"><Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> Loading full application…</p>}

      <div className="flex flex-wrap items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${application.applicationType === 'FRANCHISE' ? 'bg-[#061A3A] text-[#F5A900]' : 'bg-[#1558B0] text-white'}`}>
          {typeLabel[application.applicationType] || application.applicationType}
        </span>
        <StatusBadge value={String(application.status || '').toLowerCase()} />
        <span className="font-semibold text-slate-500">Submitted {formatDate(application.createdAt)}</span>
      </div>

      <section className="rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Contact</h3>
        <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
          <Item label="Full name" value={contact.fullName} />
          <Item label="Email" value={contact.email} />
          <Item label="Phone" value={[contact.phoneCountryCode, contact.phone].filter(Boolean).join(' ')} />
          <Item label="City and state" value={contact.city} />
        </dl>
        <div className="mt-3 flex flex-wrap gap-2">
          {contact.email && <a href={`mailto:${contact.email}`} className="rounded-md border border-[#0d4697]/20 px-3 py-1.5 text-xs font-extrabold text-[#0d4697] hover:bg-blue-50">Email applicant</a>}
          {contact.phone && <a href={`tel:${contact.phoneCountryCode || ''}${String(contact.phone).replace(/\D/g, '')}`} className="rounded-md border border-[#0d4697]/20 px-3 py-1.5 text-xs font-extrabold text-[#0d4697] hover:bg-blue-50">Call applicant</a>}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Answers</h3>
        <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
          {Object.entries(answers).map(([key, value]) => (
            <div key={key} className="contents">
              <dt className="font-semibold text-slate-500">{labels[key] || key}</dt>
              <dd className="m-0 whitespace-pre-line break-words font-bold text-slate-900">{showValue(value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Consent</h3>
        <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
          <Item label="Privacy policy" value={consents.privacy ? `Agreed ${formatDate(consents.privacyAcceptedAt)}` : 'Not recorded'} />
          <Item label="Marketing updates" value={consents.marketing ? `Agreed ${formatDate(consents.marketingAcceptedAt)}` : 'Not agreed'} />
        </dl>
      </section>

      <section className="rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Review</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-[220px_minmax(0,1fr)]">
          <label className="flex flex-col gap-1.5 font-semibold text-slate-600">
            Status
            <select value={nextStatus} onChange={(event) => setNextStatus(event.target.value)} className="h-10 rounded-md border border-slate-200 bg-white px-3 font-bold capitalize text-slate-800">
              {PARTNERSHIP_STATUSES.map((value) => <option key={value} value={value}>{statusLabel(value)}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 font-semibold text-slate-600">
            Internal note (not shown to the applicant)
            <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} maxLength={2000} className="rounded-md border border-slate-200 px-3 py-2 font-medium text-slate-800" />
          </label>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving || (nextStatus === application.status && !note.trim())}
          className="mt-3 inline-flex h-10 items-center gap-2 rounded-md bg-[#0d4697] px-4 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />} Save review
        </button>
      </section>

      <section className="rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">History</h3>
        {history.length ? (
          <ol className="mt-3 space-y-2">
            {history.map((entry, index) => (
              <li key={`${entry.at || entry.createdAt || index}-${index}`} className="rounded-md bg-slate-50 px-3 py-2">
                <span className="font-extrabold capitalize text-slate-900">{statusLabel(entry.status || entry.action)}</span>
                <span className="font-semibold text-slate-500"> · {formatDate(entry.at || entry.createdAt)}{entry.by?.name || entry.reviewer?.name ? ` · ${entry.by?.name || entry.reviewer?.name}` : ''}</span>
                {entry.note && <p className="mt-1 whitespace-pre-line font-medium text-slate-700">{entry.note}</p>}
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-2 font-semibold text-slate-500">No review activity yet.</p>
        )}
      </section>
    </div>
  )
}

function Item({ label, value }) {
  return (
    <div>
      <dt className="font-semibold text-slate-500">{label}</dt>
      <dd className="m-0 break-words font-bold text-slate-900">{showValue(value)}</dd>
    </div>
  )
}
