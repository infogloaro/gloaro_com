import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  Briefcase,
  CheckCircle,
  Clock,
  Eye,
  IndianRupee,
  X,
} from 'lucide-react'
import { businessConnectApi } from '../../api/businessConnect'
import LoadingScreen from '../../components/common/LoadingScreen'
import { formatDate } from '../../utils/format'

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

function DetailModal({ opportunity, onClose }) {
  if (!opportunity) return null

  const timeline = opportunity.timeline || []
  const eventsByStage = new Map(timeline.map((item) => [item.stage, item]))

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <section className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#0d4697]">Your Business Opportunity</p>
            <h3 className="mt-1 text-xl font-black text-slate-950">{opportunity.requirement || 'Business Opportunity'}</h3>
            <p className="mt-1 text-xs font-semibold text-slate-500">Code: {opportunity.code}</p>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
          <p><span className="font-black text-slate-900">Referred By:</span> <span className="font-semibold text-slate-600">{opportunity.referrer?.name || '-'}</span></p>
          <p><span className="font-black text-slate-900">Handled By:</span> <span className="font-semibold text-slate-600">{opportunity.referred?.name || '-'}</span></p>
          <p><span className="font-black text-slate-900">Status:</span> <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${statusColors[opportunity.status] || ''}`}>{statusLabels[opportunity.status] || opportunity.status}</span></p>
          <p><span className="font-black text-slate-900">Expected Value:</span> <span className="font-semibold text-slate-600">{formatCurrency(opportunity.estimatedValue)}</span></p>
          {opportunity.actualValue > 0 && (
            <p><span className="font-black text-slate-900">Actual Value:</span> <span className="font-semibold text-slate-600">{formatCurrency(opportunity.actualValue)}</span></p>
          )}
          <p><span className="font-black text-slate-900">Created:</span> <span className="font-semibold text-slate-600">{formatDateOrDash(opportunity.createdAt)}</span></p>
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
      </section>
    </div>
  )
}

export default function CustomerBusinessPage() {
  const [loading, setLoading] = useState(true)
  const [opportunities, setOpportunities] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [detail, setDetail] = useState(null)

  const fetchData = async (page = 1) => {
    setLoading(true)
    try {
      const res = await businessConnectApi.getCustomerOpportunities({ page, limit: 20 })
      setOpportunities(res.data.data || [])
      setPagination(res.data.pagination || { page: 1, pages: 1, total: 0 })
    } catch (err) {
      toast.error('Failed to load business opportunities')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleDetail = async (id) => {
    try {
      const res = await businessConnectApi.getCustomerDetail(id)
      setDetail(res.data.data)
    } catch (err) {
      toast.error('Failed to load details')
    }
  }

  if (loading) return <LoadingScreen label="Loading your business opportunities..." />

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#0d4697]">Business Opportunities</p>
        <h1 className="mt-1 text-2xl font-black text-slate-950">Your Business Opportunities</h1>
        <p className="mt-1 text-sm text-slate-500">Business opportunities referred on your behalf by Gloaro members.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <div className="flex flex-col justify-center rounded-lg border border-slate-100 bg-white p-3 text-center shadow-sm">
          <Briefcase className="mx-auto mb-1 h-5 w-5 text-slate-800" />
          <p className="text-[9px] font-black uppercase text-slate-400">Total</p>
          <p className="mt-0.5 text-lg font-black text-slate-800">{pagination.total || 0}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-3 py-2 font-black text-slate-500">#</th>
              <th className="px-3 py-2 font-black text-slate-500">Referred By</th>
              <th className="px-3 py-2 font-black text-slate-500">Handled By</th>
              <th className="px-3 py-2 font-black text-slate-500">Requirement</th>
              <th className="px-3 py-2 font-black text-slate-500">Status</th>
              <th className="px-3 py-2 font-black text-slate-500">Expected</th>
              <th className="px-3 py-2 font-black text-slate-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.length === 0 && (
              <tr><td colSpan={7} className="px-3 py-8 text-center text-sm text-slate-400">No business opportunities found for your account.</td></tr>
            )}
            {opportunities.map((opp, idx) => (
              <tr key={opp._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-3 py-2 font-semibold text-slate-400">{(pagination.page - 1) * 20 + idx + 1}</td>
                <td className="px-3 py-2">
                  <p className="font-bold text-slate-800">{opp.referrer?.name || '-'}</p>
                </td>
                <td className="px-3 py-2">
                  <p className="font-bold text-slate-800">{opp.referred?.name || '-'}</p>
                </td>
                <td className="px-3 py-2 font-semibold text-slate-600 max-w-[200px] truncate">{opp.requirement || '-'}</td>
                <td className="px-3 py-2">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${statusColors[opp.status] || ''}`}>{statusLabels[opp.status] || opp.status}</span>
                </td>
                <td className="px-3 py-2 font-semibold text-slate-600">{formatCurrency(opp.estimatedValue)}</td>
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

      {detail && <DetailModal opportunity={detail} onClose={() => setDetail(null)} />}
    </div>
  )
}
