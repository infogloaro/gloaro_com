import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  Briefcase,
  CheckCircle,
  Clock,
  Copy,
  Eye,
  IndianRupee,
  Search,
  TrendingUp,
  X,
  XCircle,
  Plus,
} from 'lucide-react'
import { businessConnectApi } from '../../api/businessConnect'
import LoadingScreen from '../../components/common/LoadingScreen'
import { useAuth } from '../../hooks/useAuth'
import { formatDate } from '../../utils/format'

const statusFilters = [
  ['all', 'All Business'],
  ['created', 'Created'],
  ['contacted', 'Contacted'],
  ['meeting_scheduled', 'Meeting'],
  ['proposal_sent', 'Proposal'],
  ['negotiation', 'Negotiation'],
  ['won', 'Won'],
  ['lost', 'Lost'],
]

const statusColors = {
  created: 'border-blue-100 bg-blue-50 text-blue-700',
  assigned: 'border-purple-100 bg-purple-50 text-purple-700',
  accepted: 'border-indigo-100 bg-indigo-50 text-indigo-700',
  contacted: 'border-cyan-100 bg-cyan-50 text-cyan-700',
  meeting_scheduled: 'border-amber-100 bg-amber-50 text-amber-700',
  proposal_sent: 'border-orange-100 bg-orange-50 text-orange-700',
  negotiation: 'border-yellow-100 bg-yellow-50 text-yellow-700',
  won: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  lost: 'border-red-100 bg-red-50 text-red-700',
}

const statusLabels = {
  created: 'Created',
  assigned: 'Assigned',
  accepted: 'Accepted',
  contacted: 'Contacted',
  meeting_scheduled: 'Meeting Scheduled',
  proposal_sent: 'Proposal Sent',
  negotiation: 'Negotiation',
  won: 'Won',
  lost: 'Lost',
}

const timelineStages = [
  ['business_created', 'Opportunity Created'],
  ['business_contacted', 'Contacted'],
  ['business_meeting', 'Meeting Scheduled'],
  ['business_proposal', 'Proposal Sent'],
  ['business_negotiation', 'Negotiation'],
  ['business_won', 'Business Won'],
  ['business_lost', 'Business Lost'],
]

const formatCurrency = (value) => {
  if (!value && value !== 0) return '-'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
}

const formatDateOrDash = (value) => (value ? formatDate(value) : '-')

function StatCard({ icon: Icon, label, value, tone = 'text-slate-800' }) {
  return (
    <div className="flex flex-col justify-center rounded-lg border border-slate-100 bg-white p-3 text-center shadow-sm">
      <Icon className={`mx-auto mb-1 h-5 w-5 ${tone}`} />
      <p className="text-[9px] font-black uppercase text-slate-400">{label}</p>
      <p className={`mt-0.5 text-lg font-black ${tone}`}>{value}</p>
    </div>
  )
}

function DetailModal({ opportunity, onClose, onStatusUpdate }) {
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [statusNote, setStatusNote] = useState('')

  if (!opportunity) return null

  const timeline = opportunity.timeline || []
  const eventsByStage = new Map(timeline.map((item) => [item.stage, item]))

  const handleStatusUpdate = async () => {
    if (!newStatus) return
    setUpdating(true)
    try {
      await businessConnectApi.updateStatus(opportunity._id, {
        status: newStatus,
        notes: statusNote || undefined,
        actualValue: newStatus === 'won' ? opportunity.businessValue : undefined,
      })
      toast.success(`Status updated to ${statusLabels[newStatus]}`)
      onStatusUpdate()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const nextStatuses = {
    created: ['assigned', 'contacted', 'lost'],
    assigned: ['accepted', 'contacted', 'lost'],
    accepted: ['contacted', 'lost'],
    contacted: ['meeting_scheduled', 'lost'],
    meeting_scheduled: ['proposal_sent', 'lost'],
    proposal_sent: ['negotiation', 'lost'],
    negotiation: ['won', 'lost'],
  }
  const availableNext = nextStatuses[opportunity.status] || []

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <section className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#0d4697]">Business Opportunity</p>
            <h3 className="mt-1 text-xl font-black text-slate-950">{opportunity.requirement || 'Business Opportunity'}</h3>
            <p className="mt-1 text-xs font-semibold text-slate-500">Code: {opportunity.code}</p>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
          <p><span className="font-black text-slate-900">Customer:</span> <span className="font-semibold text-slate-600">{opportunity.name || '-'}</span></p>
          {opportunity.email && <p><span className="font-black text-slate-900">Customer Email:</span> <span className="font-semibold text-slate-600">{opportunity.email}</span></p>}
          {opportunity.mobileNumber && <p><span className="font-black text-slate-900">Customer Mobile:</span> <span className="font-semibold text-slate-600">{opportunity.mobileNumber}</span></p>}
          <p><span className="font-black text-slate-900">Connected To:</span> <span className="font-semibold text-slate-600">{opportunity.referred?.name || opportunity.referredVendor?.businessName || '-'}</span></p>
          <p><span className="font-black text-slate-900">Status:</span> <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${statusColors[opportunity.status] || ''}`}>{statusLabels[opportunity.status] || opportunity.status}</span></p>
          <p><span className="font-black text-slate-900">Priority:</span> <span className="font-semibold text-slate-600 capitalize">{opportunity.priority || '-'}</span></p>
          <p><span className="font-black text-slate-900">Expected Value:</span> <span className="font-semibold text-slate-600">{formatCurrency(opportunity.estimatedValue)}</span></p>
          <p><span className="font-black text-slate-900">Actual Value:</span> <span className="font-semibold text-slate-600">{formatCurrency(opportunity.actualValue || opportunity.businessValue)}</span></p>
          <p><span className="font-black text-slate-900">Referral Earnings:</span> <span className="font-semibold text-emerald-600">{formatCurrency(opportunity.commission?.amount)}</span></p>
          <p><span className="font-black text-slate-900">Commission Rate:</span> <span className="font-semibold text-slate-600">{opportunity.commission?.percent ? `${opportunity.commission.percent}%` : '-'}</span></p>
          {opportunity.parentReferral && (
            <p><span className="font-black text-slate-900">Connect:</span> <span className="font-semibold text-slate-600">{opportunity.parentReferral.code || '-'}</span></p>
          )}
          <p><span className="font-black text-slate-900">Created:</span> <span className="font-semibold text-slate-600">{formatDateOrDash(opportunity.createdAt)}</span></p>
          {opportunity.completedAt && <p><span className="font-black text-slate-900">Won:</span> <span className="font-semibold text-slate-600">{formatDateOrDash(opportunity.completedAt)}</span></p>}
          {opportunity.lostAt && <p><span className="font-black text-slate-900">Lost:</span> <span className="font-semibold text-slate-600">{formatDateOrDash(opportunity.lostAt)}</span></p>}
          {opportunity.linkedOrder && (
            <p><span className="font-black text-slate-900">Order:</span> <span className="font-semibold text-slate-600">{opportunity.linkedOrder.orderNumber || opportunity.linkedOrder._id} ({formatCurrency(opportunity.linkedOrder.total)})</span></p>
          )}
        </div>

        {opportunity.notes && (
          <div className="mt-4 rounded-lg bg-slate-50 p-3">
            <p className="text-[10px] font-extrabold uppercase text-slate-400">Notes</p>
            <p className="mt-1 text-sm text-slate-600">{opportunity.notes}</p>
          </div>
        )}

        <div className="mt-5">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#0d4697]">Timeline</p>
          <div className="mt-3 space-y-2">
            {timelineStages.map(([stage, label]) => {
              const event = eventsByStage.get(stage)
              const isActive = event
              return (
                <div key={stage} className={`flex items-center gap-3 rounded-lg border p-2 ${isActive ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 bg-slate-50 opacity-40'}`}>
                  <div className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold ${isActive ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {isActive ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${isActive ? 'text-emerald-700' : 'text-slate-500'}`}>{label}</p>
                    {event && <p className="text-[10px] text-slate-400">{formatDateOrDash(event.at)}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {availableNext.length > 0 && (
          <div className="mt-5 border-t border-slate-100 pt-4">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {availableNext.map((s) => (
                <button
                  key={s}
                  onClick={() => setNewStatus(s)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition ${newStatus === s ? 'bg-[#0d4697] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {statusLabels[s]}
                </button>
              ))}
            </div>
            {newStatus && (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Add a note (optional)"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400"
                />
                <button
                  onClick={handleStatusUpdate}
                  disabled={updating}
                  className="mt-2 rounded-lg bg-[#0d4697] px-4 py-2 text-sm font-bold text-white hover:bg-[#0a3875] disabled:opacity-50"
                >
                  {updating ? 'Updating...' : `Mark as ${statusLabels[newStatus]}`}
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

function CreateModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    referredUserId: '',
    name: '',
    email: '',
    mobileNumber: '',
    requirement: '',
    estimatedValue: '',
    priority: 'low',
    notes: '',
    businessType: 'opportunity',
  })
  const [submitting, setSubmitting] = useState(false)

  const [personSearch, setPersonSearch] = useState('')
  const [personResults, setPersonResults] = useState([])
  const [personSearching, setPersonSearching] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    if (!personSearch.trim() || personSearch.trim().length < 2) {
      setPersonResults([])
      return
    }
    const timer = setTimeout(async () => {
      setPersonSearching(true)
      try {
        const res = await businessConnectApi.searchPeople({ search: personSearch.trim(), limit: 20 })
        setPersonResults(res.data?.data || [])
      } catch {
        setPersonResults([])
      } finally {
        setPersonSearching(false)
        setShowDropdown(true)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [personSearch])

  const selectPerson = (person) => {
    setSelectedPerson(person)
    setForm((prev) => ({
      ...prev,
      referredUserId: person._id,
      name: prev.name || person.name || '',
      email: prev.email || person.email || '',
      mobileNumber: prev.mobileNumber || person.phone || '',
    }))
    setPersonSearch('')
    setPersonResults([])
    setShowDropdown(false)
  }

  const clearPerson = () => {
    setSelectedPerson(null)
    setForm((prev) => ({ ...prev, referredUserId: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name && !form.requirement) {
      toast.error('Provide a name or business requirement')
      return
    }
    setSubmitting(true)
    try {
      await businessConnectApi.create({
        ...form,
        estimatedValue: form.estimatedValue ? Number(form.estimatedValue) : 0,
        referredUserId: form.referredUserId || undefined,
      })
      toast.success('Business opportunity created')
      onSuccess()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create')
    } finally {
      setSubmitting(false)
    }
  }

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <section className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#0d4697]">New Business Opportunity</p>
            <h3 className="mt-1 text-lg font-black text-slate-950">Create Business Connect</h3>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="relative">
            <label className="text-[10px] font-extrabold uppercase text-slate-400">Share With Gloaro Person (Optional)</label>
            {selectedPerson ? (
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-emerald-800 truncate">{selectedPerson.name}</p>
                  <p className="text-[10px] text-emerald-600">{selectedPerson.email || ''} {selectedPerson.phone ? `| ${selectedPerson.phone}` : ''}</p>
                </div>
                <button type="button" onClick={clearPerson} className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-200 text-emerald-700 hover:bg-emerald-300">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <>
                    <input
                      type="text"
                      value={personSearch}
                      onChange={(e) => setPersonSearch(e.target.value)}
                      onFocus={async () => {
                        setShowDropdown(true)
                        if (!personSearch.trim() && personResults.length === 0) {
                          setPersonSearching(true)
                          try {
                            const res = await businessConnectApi.searchPeople({ limit: 20 })
                            setPersonResults(res.data?.data || [])
                          } catch {
                            setPersonResults([])
                          } finally {
                            setPersonSearching(false)
                          }
                        }
                      }}
                      onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                      placeholder="Search by name, email, phone, or member ID..."
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
                    />
                {personSearching && <p className="mt-1 text-[10px] text-slate-400">Searching...</p>}
                {showDropdown && personResults.length > 0 && (
                  <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                    {personResults.map((p) => (
                      <button
                        key={p._id}
                        type="button"
                        onMouseDown={() => selectPerson(p)}
                        className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 border-b border-slate-50 last:border-0"
                      >
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#eef4ff] text-xs font-black text-[#0d4697]">
                          {(p.name || '?')[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">{p.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{p.email || ''} {p.phone ? `| ${p.phone}` : ''} {p.officialId ? `| ${p.officialId}` : ''}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                      {showDropdown && personResults.length === 0 && !personSearching && (
                        <p className="mt-1 text-[10px] text-slate-400">No Gloaro people found. You can still create with manual details below.</p>
                      )}
              </>
            )}
          </div>

          <div>
            <label className="text-[10px] font-extrabold uppercase text-slate-400">Person / Business Name *</label>
            <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400" placeholder="e.g. ABC Company" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-extrabold uppercase text-slate-400">Email</label>
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400" />
            </div>
            <div>
              <label className="text-[10px] font-extrabold uppercase text-slate-400">Mobile</label>
              <input type="text" value={form.mobileNumber} onChange={(e) => update('mobileNumber', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-extrabold uppercase text-slate-400">Business Requirement *</label>
            <textarea value={form.requirement} onChange={(e) => update('requirement', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400" rows={2} placeholder="e.g. Website Development" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-extrabold uppercase text-slate-400">Expected Value (₹)</label>
              <input type="number" value={form.estimatedValue} onChange={(e) => update('estimatedValue', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400" min="0" />
            </div>
            <div>
              <label className="text-[10px] font-extrabold uppercase text-slate-400">Priority</label>
              <select value={form.priority} onChange={(e) => update('priority', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-extrabold uppercase text-slate-400">Notes</label>
            <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400" rows={2} />
          </div>

          <button type="submit" disabled={submitting} className="w-full rounded-lg bg-[#0d4697] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0a3875] disabled:opacity-50">
            {submitting ? 'Creating...' : 'Create Business Opportunity'}
          </button>
        </form>
      </section>
    </div>
  )
}

export default function BusinessConnectPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState(null)
  const [opportunities, setOpportunities] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [detail, setDetail] = useState(null)
  const [showCreate, setShowCreate] = useState(false)

  const fetchData = async (page = 1) => {
    setLoading(true)
    try {
      const params = { page, limit: 20 }
      if (filter !== 'all') params.status = filter
      if (search) params.search = search

      const [summaryRes, listRes] = await Promise.all([
        businessConnectApi.getSummary(),
        businessConnectApi.getMy(params),
      ])

      setSummary(summaryRes.data.data)
      setOpportunities(listRes.data.data)
      setPagination(listRes.data.pagination)
    } catch (err) {
      toast.error('Failed to load business connects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [filter])

  const handleSearch = () => { fetchData(1) }

  const handleDetail = async (id) => {
    try {
      const res = await businessConnectApi.getDetail(id)
      setDetail(res.data.data)
    } catch (err) {
      toast.error('Failed to load details')
    }
  }

  const sent = summary?.sent || {}

  if (loading && !summary) return <LoadingScreen />

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#0d4697]">Business Connects</p>
          <h1 className="mt-1 text-2xl font-black text-slate-950">My Business Opportunities</h1>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-[#0d4697] px-4 py-2 text-sm font-bold text-white hover:bg-[#0a3875]">
          <Plus className="h-4 w-4" /> New Opportunity
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
        <StatCard icon={Briefcase} label="Total" value={sent.total || 0} tone="text-slate-800" />
        <StatCard icon={Clock} label="Pending" value={sent.pending || 0} tone="text-amber-600" />
        <StatCard icon={CheckCircle} label="Won" value={sent.won || 0} tone="text-emerald-600" />
        <StatCard icon={XCircle} label="Lost" value={sent.lost || 0} tone="text-red-500" />
        <StatCard icon={IndianRupee} label="Business Generated" value={formatCurrency(sent.businessGenerated)} tone="text-[#0d4697]" />
        <StatCard icon={IndianRupee} label="Earnings" value={formatCurrency(sent.totalEarnings)} tone="text-emerald-600" />
        <StatCard icon={TrendingUp} label="Conversion" value={`${sent.conversionRate || 0}%`} tone="text-[#0d4697]" />
      </div>

      <div className="flex flex-wrap gap-2">
        {statusFilters.map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)} className={`rounded-full px-3 py-1 text-xs font-bold transition ${filter === key ? 'bg-[#0d4697] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="Search by name, requirement, code..." className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400" />
        </div>
        <button onClick={handleSearch} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200">Search</button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-3 py-2 font-black text-slate-500">#</th>
              <th className="px-3 py-2 font-black text-slate-500">Customer</th>
              <th className="px-3 py-2 font-black text-slate-500">Connected To</th>
              <th className="px-3 py-2 font-black text-slate-500">Business</th>
              <th className="px-3 py-2 font-black text-slate-500">Status</th>
              <th className="px-3 py-2 font-black text-slate-500">Expected</th>
              <th className="px-3 py-2 font-black text-slate-500">Actual</th>
              <th className="px-3 py-2 font-black text-slate-500">Earnings</th>
              <th className="px-3 py-2 font-black text-slate-500">Created</th>
              <th className="px-3 py-2 font-black text-slate-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.length === 0 && (
              <tr><td colSpan={9} className="px-3 py-8 text-center text-sm text-slate-400">No business opportunities yet</td></tr>
            )}
            {opportunities.map((opp, idx) => (
              <tr key={opp._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-3 py-2 font-semibold text-slate-400">{(pagination.page - 1) * 20 + idx + 1}</td>
                <td className="px-3 py-2">
                  <p className="font-bold text-slate-800">{opp.name || '-'}</p>
                  <p className="text-[10px] text-slate-400">{opp.email || ''}</p>
                </td>
                <td className="px-3 py-2">
                  <p className="font-bold text-slate-800">{opp.referred?.name || '-'}</p>
                  <p className="text-[10px] text-slate-400">{opp.referred?.chapter || ''}</p>
                </td>
                <td className="px-3 py-2 font-semibold text-slate-600 max-w-[200px] truncate">{opp.requirement || '-'}</td>
                <td className="px-3 py-2">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${statusColors[opp.status] || ''}`}>{statusLabels[opp.status] || opp.status}</span>
                </td>
                <td className="px-3 py-2 font-semibold text-slate-600">{formatCurrency(opp.estimatedValue)}</td>
                <td className="px-3 py-2 font-semibold text-slate-600">{formatCurrency(opp.actualValue || opp.businessValue)}</td>
                <td className="px-3 py-2 font-semibold text-emerald-600">{formatCurrency(opp.commission?.amount)}</td>
                <td className="px-3 py-2 text-slate-500">{formatDateOrDash(opp.createdAt)}</td>
                <td className="px-3 py-2">
                  <button onClick={() => handleDetail(opp._id)} className="grid h-7 w-7 place-items-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200">
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => fetchData(p)} className={`h-8 w-8 rounded-lg text-xs font-bold ${p === pagination.page ? 'bg-[#0d4697] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{p}</button>
          ))}
        </div>
      )}

      {detail && <DetailModal opportunity={detail} onClose={() => setDetail(null)} onStatusUpdate={() => fetchData(pagination.page)} />}
      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onSuccess={() => fetchData(1)} />}
    </div>
  )
}
