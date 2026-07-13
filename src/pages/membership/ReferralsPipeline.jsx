import { useEffect, useState } from 'react'
import { communityApi } from '../../api/community'
import LoadingScreen from '../../components/common/LoadingScreen'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import {
  Copy,
  UserCheck,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Shield,
  Activity,
  AlertCircle
} from 'lucide-react'
import { formatCurrency, formatDate } from '../../utils/format'

export default function ReferralsPipeline() {
  const { user } = useAuth()
  const [referrals, setReferrals] = useState([])
  const [stats, setStats] = useState({ totalUsed: 0, pendingApproval: 0, approvedMembers: 0, businessGenerated: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    communityApi.getMySignupReferrals()
      .then(res => {
        setReferrals(res.data?.data || [])
        setStats(res.data?.stats || { totalUsed: 0, pendingApproval: 0, approvedMembers: 0, businessGenerated: 0 })
      })
      .catch(() => {
        toast.error('Failed to load signup referrals list')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleCopyCode = () => {
    const code = user?.referralCode || 'GLR-000245'
    navigator.clipboard.writeText(code)
      .then(() => {
        toast.success('Referral code copied to clipboard!')
      })
      .catch(() => {
        toast.error('Failed to copy code')
      })
  }

  if (loading) {
    return <LoadingScreen label="Loading referrals command center..." />
  }

  return (
    <div className="space-y-6">
      {/* 1. My Referral Code Banner */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col lg:flex-row justify-between gap-6 items-stretch">
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ffbf1a] bg-[#0d4697] px-3 py-1 rounded-full">
              Personal Referral
            </span>
            <h2 className="mt-3 text-2xl font-black text-slate-900 font-sans">My Gloaro Referral Code: {user?.referralCode || 'GLR-000245'}</h2>
            <p className="text-xs font-semibold text-slate-400 mt-1">Share this code with invitees to track network expansion metrics automatically.</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex h-6 items-center gap-1 rounded bg-emerald-50 border border-emerald-200 px-2.5 text-[10px] font-extrabold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Status: Active
            </span>
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-extrabold text-slate-700 hover:bg-slate-100 transition shadow-sm"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy Code
            </button>
          </div>
        </div>

        {/* Dynamic code stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:w-[620px] shrink-0 bg-slate-50/50 rounded-xl p-4 border border-slate-100">
          <div className="flex flex-col justify-center items-center text-center p-3 rounded-lg bg-white border border-slate-100 shadow-sm">
            <Users className="h-5 w-5 text-blue-500 mb-1" />
            <p className="text-[9px] font-black uppercase text-slate-400">Total Registrations</p>
            <p className="text-lg font-black text-slate-800 mt-0.5">{stats.totalUsed || 0}</p>
          </div>
          <div className="flex flex-col justify-center items-center text-center p-3 rounded-lg bg-white border border-slate-100 shadow-sm">
            <AlertCircle className="h-5 w-5 text-amber-500 mb-1" />
            <p className="text-[9px] font-black uppercase text-slate-400 font-bold">Pending Approval</p>
            <p className="text-lg font-black text-amber-600 mt-0.5">{stats.pendingApproval || 0}</p>
          </div>
          <div className="flex flex-col justify-center items-center text-center p-3 rounded-lg bg-white border border-slate-100 shadow-sm">
            <UserCheck className="h-5 w-5 text-emerald-500 mb-1" />
            <p className="text-[9px] font-black uppercase text-slate-400 font-bold">Approved Members</p>
            <p className="text-lg font-black text-emerald-600 mt-0.5">{stats.approvedMembers || 0}</p>
          </div>
          <div className="flex flex-col justify-center items-center text-center p-3 rounded-lg bg-white border border-slate-100 shadow-sm">
            <DollarSign className="h-5 w-5 text-[#0d4697] mb-1" />
            <p className="text-[9px] font-black uppercase text-slate-400 font-bold">Business Generated</p>
            <p className="text-sm font-black text-[#0d4697] mt-1.5 truncate max-w-[110px]">
              {formatCurrency(stats.businessGenerated || 0)}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Referral History Table */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
        <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
          <Activity className="h-4.5 w-4.5 text-[#0d4697]" />
          Referral History Table
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Chapter</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {referrals.map((ref) => {
                const member = ref.referred || {}
                const approved = member.isActive ? 'Approved' : 'Pending'
                const chapterName = member.meta?.adminProfile?.organization?.chapterName || member.chapter || 'Sultanpur'
                return (
                  <tr key={ref._id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-4 font-extrabold text-slate-900">{member.name || '-'}</td>
                    <td className="py-4 px-4 text-slate-500 font-semibold">{member.phone || '-'}</td>
                    <td className="py-4 px-4 text-slate-500 font-semibold">{chapterName}</td>
                    <td className="py-4 px-4 uppercase text-[10px] font-extrabold">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border ${
                        approved === 'Approved' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {approved === 'Approved' ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3 animate-pulse" />
                        )}
                        {approved}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right text-slate-400 font-bold">
                      {formatDate(member.createdAt)}
                    </td>
                  </tr>
                )
              })}
              {!referrals.length && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-semibold">
                    No referred members have signed up yet. Share your Referral Code to grow your chapter!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
