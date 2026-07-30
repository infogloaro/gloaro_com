import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Copy,
  Eye,
  Search,
  Shield,
  UserCheck,
  Users,
  X,
} from 'lucide-react'
import { communityApi } from '../../api/community'
import LoadingScreen from '../../components/common/LoadingScreen'
import { useAuth } from '../../hooks/useAuth'
import { formatDate } from '../../utils/format'

const filters = [
  ['all', 'All Referrals'],
  ['pending', 'Pending'],
  ['approved', 'Approved'],
  ['rejected', 'Rejected'],
  ['joined', 'Joined'],
]

const stageLabels = {
  registration_started: 'Registration Started',
  registered: 'Registered',
  application_submitted: 'Application Submitted',
  pending_approval: 'Pending Approval',
  approved: 'Approved',
  rejected: 'Rejected',
  member_joined: 'Member Joined',
}

const timelineOrder = [
  ['referral_code_used', 'Referral Code Used'],
  ['registered', 'Registration Completed'],
  ['application_submitted', 'Membership Application Submitted'],
  ['pending_approval', 'Pending Approval'],
  ['approved', 'Approved'],
  ['member_joined', 'Member Joined'],
]

const stageClass = (stage) => {
  if (stage === 'rejected') return 'border-red-100 bg-red-50 text-red-700'
  if (stage === 'approved' || stage === 'member_joined') return 'border-emerald-100 bg-emerald-50 text-emerald-700'
  return 'border-amber-100 bg-amber-50 text-amber-700'
}

const formatDateOrDash = (value) => value ? formatDate(value) : '-'

const formatDateTime = (value) => {
  if (!value) return ''
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

function StatCard({ icon: Icon, label, value, tone = 'text-slate-800' }) {
  return (
    <div className="flex flex-col justify-center rounded-lg border border-slate-100 bg-white p-3 text-center shadow-sm">
      <Icon className={`mx-auto mb-1 h-5 w-5 ${tone}`} />
      <p className="text-[9px] font-black uppercase text-slate-400">{label}</p>
      <p className={`mt-0.5 text-lg font-black ${tone}`}>{value}</p>
    </div>
  )
}

function ReferralDetailModal({ referral, onClose }) {
  if (!referral) return null

  const eventsByStage = new Map((referral.timeline || []).map((item) => [item.stage, item]))
  const isRejected = referral.currentStage === 'rejected'
  const visibleOrder = isRejected
    ? [...timelineOrder.slice(0, 4), ['rejected', 'Rejected']]
    : timelineOrder

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <section className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#0d4697]">Referral Details</p>
            <h3 className="mt-1 text-xl font-black text-slate-950">{referral.member?.name || '-'}</h3>
            <p className="mt-1 text-xs font-semibold text-slate-500">Referral Code: {referral.referralCode || '-'}</p>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200" aria-label="Close referral details">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
          <p><span className="font-black text-slate-900">Member:</span> <span className="font-semibold text-slate-600">{referral.member?.name || '-'}</span></p>
          <p><span className="font-black text-slate-900">Mobile:</span> <span className="font-semibold text-slate-600">{referral.member?.phone || '-'}</span></p>
          <p><span className="font-black text-slate-900">Referred By:</span> <span className="font-semibold text-slate-600">{referral.referrer?.name || '-'}</span></p>
          <p><span className="font-black text-slate-900">Chapter:</span> <span className="font-semibold text-slate-600">{referral.chapter || '-'}</span></p>
          <p><span className="font-black text-slate-900">Application:</span> <span className="font-semibold text-slate-600">{referral.application?.applicationNumber || '-'}</span></p>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-black text-slate-950">Referral Timeline</h4>
          <div className="mt-4 space-y-4">
            {visibleOrder.map(([stage, label]) => {
              const event = eventsByStage.get(stage)
              const complete = Boolean(event)
              return (
                <div key={stage} className="flex gap-3">
                  <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs font-black ${complete ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-400'}`}>
                    {complete ? '✓' : '○'}
                  </span>
                  <div>
                    <p className="text-sm font-black text-slate-900">{label}</p>
                    {event ? (
                      <>
                        <p className="mt-0.5 text-xs font-semibold text-slate-500">{formatDateTime(event.at)}</p>
                        {event.remarks && <p className="mt-1 text-xs font-semibold text-slate-400">{event.remarks}</p>}
                      </>
                    ) : (
                      <p className="mt-0.5 text-xs font-semibold text-slate-400">Not completed</p>
                    )}
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

export default function ReferralsPipeline() {
  const { user } = useAuth()
  const [referrals, setReferrals] = useState([])
  const [stats, setStats] = useState({ totalUsed: 0, pendingApproval: 0, approvedMembers: 0, rejected: 0, conversionRate: 0 })
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [referralCode, setReferralCode] = useState(user?.referralCode || '')
  const [codeStatus, setCodeStatus] = useState(user?.referralCode ? 'active' : 'inactive')
  const [codeLoading, setCodeLoading] = useState(true)

  const query = useMemo(() => ({ status, search: search.trim() || undefined }), [status, search])

  useEffect(() => {
    communityApi.getMySignupReferrals(query)
      .then((res) => {
        setReferrals(res.data?.data || [])
        setStats(res.data?.stats || {})
      })
      .catch(() => {
        toast.error('Failed to load referral tracking')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [query])

  useEffect(() => {
    communityApi.getMyReferralCode()
      .then((res) => {
        const data = res.data?.data || {}
        setReferralCode(data.referralCode || '')
        setCodeStatus(data.status || (data.referralCode ? 'active' : 'inactive'))
      })
      .catch(() => {
        toast.error('Failed to load referral code')
        setCodeStatus('inactive')
      })
      .finally(() => {
        setCodeLoading(false)
      })
  }, [])

  const handleCopyCode = () => {
    const code = referralCode || ''
    if (!code) {
      toast.error('Referral code is not available')
      return
    }
    navigator.clipboard.writeText(code)
      .then(() => toast.success('Referral code copied to clipboard!'))
      .catch(() => toast.error('Failed to copy code'))
  }

  const openDetail = (id) => {
    setDetailLoading(true)
    communityApi.getMySignupReferralDetail(id)
      .then((res) => setSelected(res.data?.data || null))
      .catch(() => toast.error('Unable to load referral details'))
      .finally(() => setDetailLoading(false))
  }

  if (loading) {
    return <LoadingScreen label="Loading referrals command center..." />
  }

  const isReferralCodeActive = Boolean(referralCode && codeStatus === 'active')
  const referralCodeStatusLabel = codeLoading ? 'Loading' : isReferralCodeActive ? 'Active' : 'Unavailable'

  return (
    <div className="space-y-6">
      <section className="flex flex-col items-stretch justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row">
        <div className="flex flex-1 flex-col justify-between space-y-4">
          <div>
            <span className="rounded-full bg-[#0d4697] px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#ffbf1a]">
              Personal Referral
            </span>
            <h2 className="mt-3 text-2xl font-black text-slate-900">My Gloaro Referral Code: {codeLoading ? 'Loading...' : referralCode || 'Not available'}</h2>
            <p className="mt-1 text-xs font-semibold text-slate-400">Share this code with invitees to track registrations, membership approval, and joining status.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex h-6 items-center gap-1 rounded border px-2.5 text-[10px] font-extrabold ${isReferralCodeActive ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isReferralCodeActive ? 'animate-pulse bg-emerald-600' : 'bg-amber-600'}`} />
              Status: {referralCodeStatusLabel}
            </span>
            <button onClick={handleCopyCode} disabled={!referralCode} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-extrabold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50">
              <Copy className="h-3.5 w-3.5" />
              Copy Code
            </button>
          </div>
        </div>

        <div className="grid gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 sm:grid-cols-2 lg:w-[720px] lg:grid-cols-5">
          <StatCard icon={Users} label="Total Registrations" value={stats.totalRegistrations || stats.totalUsed || 0} tone="text-blue-600" />
          <StatCard icon={AlertCircle} label="Pending Approval" value={stats.pendingApproval || 0} tone="text-amber-600" />
          <StatCard icon={UserCheck} label="Approved Members" value={stats.approvedMembers || 0} tone="text-emerald-600" />
          <StatCard icon={Shield} label="Rejected" value={stats.rejected || 0} tone="text-red-600" />
          <StatCard icon={CheckCircle} label="Conversion Rate" value={`${stats.conversionRate || 0}%`} tone="text-[#0d4697]" />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 lg:flex-row lg:items-center lg:justify-between">
          <h3 className="flex items-center gap-2 text-sm font-black text-slate-900">
            <Activity className="h-4.5 w-4.5 text-[#0d4697]" />
            Referral Tracking
          </h3>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-2">
              {filters.map(([key, label]) => (
                <button key={key} onClick={() => setStatus(key)} className={`rounded-full px-3 py-1.5 text-[11px] font-black transition ${status === key ? 'bg-[#0d4697] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  {label}
                </button>
              ))}
            </div>
            <label className="flex h-10 min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-500 sm:w-72">
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, mobile, code, chapter" className="min-w-0 flex-1 bg-transparent text-slate-900 caret-[#0d4697] outline-none placeholder:text-slate-400" />
            </label>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Referral Code</th>
                <th className="px-4 py-3">Chapter</th>
                <th className="px-4 py-3">Registration Date</th>
                <th className="px-4 py-3">Current Stage</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Approved Date</th>
                <th className="px-4 py-3">Joined Date</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {referrals.map((ref) => (
                <tr key={ref._id} className="transition hover:bg-slate-50/50">
                  <td className="px-4 py-4 font-extrabold text-slate-900">{ref.member?.name || '-'}</td>
                  <td className="px-4 py-4 text-slate-500">{ref.member?.phone || '-'}</td>
                  <td className="px-4 py-4 font-black text-[#0d4697]">{ref.referralCode || '-'}</td>
                  <td className="px-4 py-4 text-slate-500">{ref.chapter || '-'}</td>
                  <td className="px-4 py-4 text-slate-500">{formatDateOrDash(ref.registrationDate)}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase ${stageClass(ref.currentStage)}`}>
                      {stageLabels[ref.currentStage] || ref.currentStage}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-black text-slate-700">{ref.status || '-'}</td>
                  <td className="px-4 py-4 text-slate-500">{formatDateOrDash(ref.approvedDate)}</td>
                  <td className="px-4 py-4 text-slate-500">{formatDateOrDash(ref.joinedDate)}</td>
                  <td className="px-4 py-4 text-right">
                    <button onClick={() => openDetail(ref._id)} className="inline-flex items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-black text-[#0d4697] hover:bg-blue-100">
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {!referrals.length && (
                <tr>
                  <td colSpan={10} className="py-12 text-center font-semibold text-slate-400">
                    No matching referrals found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {detailLoading && <LoadingScreen label="Loading referral details..." />}
      <ReferralDetailModal referral={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
