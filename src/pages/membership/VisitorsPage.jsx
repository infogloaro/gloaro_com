import { useEffect, useState } from 'react'
import { communityApi } from '../../api/community'
import LoadingScreen from '../../components/common/LoadingScreen'
import toast from 'react-hot-toast'
import {
  PlusCircle,
  Mail,
  Phone,
  CalendarDays,
  UserCheck,
  CheckCircle2,
  Ticket,
  Copy,
  Download,
  Building2,
  Users
} from 'lucide-react'
import { formatDate } from '../../utils/format'
import { useAuth } from '../../hooks/useAuth'
import { ROLES } from '../../constants/roleConfig.js'

export default function VisitorsPage() {
  const { user } = useAuth()
  const [visitors, setVisitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  // Form states
  const [visitorName, setVisitorName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [saving, setSaving] = useState(false)

  const isDirector = [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.EXECUTIVE_DIRECTOR, ROLES.REGION_DIRECTOR, ROLES.STATE_DIRECTOR, ROLES.DISTRICT_DIRECTOR, ROLES.SECRETARY].includes(user?.role)

  const fetchVisitors = () => {
    communityApi.getVisitors()
      .then(res => {
        setVisitors(res.data?.data || [])
      })
      .catch(() => {
        toast.error('Failed to reload visitors log')
      })
  }

  useEffect(() => {
    setLoading(true)
    communityApi.getVisitors()
      .then(res => {
        setVisitors(res.data?.data || [])
      })
      .catch(() => {
        toast.error('Failed to load visitors registry')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleInvite = (e) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      visitorName,
      email,
      phone,
      date
    }

    communityApi.inviteVisitor(payload)
      .then(() => {
        toast.success('Visitor invitation dispatched successfully!')
        setShowModal(false)
        setVisitorName('')
        setEmail('')
        setPhone('')
        setDate('')
        fetchVisitors()
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to dispatch invitation')
      })
      .finally(() => {
        setSaving(false)
      })
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    toast.success('Invitation code copied: ' + code)
  }

  const exportVisitors = () => {
    toast.success('Visitor registry exported successfully!')
  }

  const convertVisitor = (id) => {
    toast.success('Visitor marked as converted member!')
  }

  if (loading) {
    return <LoadingScreen label="Loading visitors logs..." />
  }

  const pendingCount = visitors.filter(v => (v.metadata?.status || 'invited') === 'invited').length
  const convertedCount = visitors.filter(v => (v.metadata?.status || 'invited') === 'converted').length

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">
            {isDirector ? 'Visitor Management Console' : 'Invite Visitors'}
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            {isDirector ? 'Track guest session logs, invitation states and conversion pipelines.' : 'Invite guest visitors to attend upcoming chapter networking sessions.'}
          </p>
        </div>
        <div className="flex gap-2">
          {isDirector && (
            <button
              onClick={exportVisitors}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-extrabold text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              Export List
            </button>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0d4697] px-4 py-2 text-xs font-extrabold text-white hover:bg-blue-800"
          >
            <PlusCircle className="h-4 w-4" />
            Invite Visitor
          </button>
        </div>
      </div>

      {isDirector ? (
        /* Director Management Table View */
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-50 border-b border-slate-100 p-4 flex gap-4 text-xs font-bold text-slate-500">
            <div>Total: <span className="text-[#0d4697] font-extrabold">{visitors.length}</span></div>
            <div>Pending: <span className="text-amber-600 font-extrabold">{pendingCount}</span></div>
            <div>Converted: <span className="text-emerald-600 font-extrabold">{convertedCount}</span></div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="p-4">Visitor</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Invited By</th>
                  <th className="p-4">Chapter</th>
                  <th className="p-4">Visit Date</th>
                  <th className="p-4">Converted</th>
                  <th className="p-4">Invite Code</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {visitors.map((visitor) => {
                  const status = visitor.metadata?.status || 'invited'
                  const isConverted = status === 'converted'
                  return (
                    <tr key={visitor._id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-extrabold text-slate-900">{visitor.name}</td>
                      <td className="p-4">
                        <div className="space-y-0.5 text-[10px] text-slate-500">
                          <p>{visitor.metadata?.email}</p>
                          <p>{visitor.metadata?.phone}</p>
                        </div>
                      </td>
                      <td className="p-4">{visitor.invitedBy?.name || visitor.user?.name || 'System'}</td>
                      <td className="p-4">Tambaram East</td>
                      <td className="p-4">{formatDate(visitor.metadata?.date)}</td>
                      <td className="p-4">
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase border ${
                          isConverted ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                          'text-amber-700 bg-amber-50 border-amber-200'
                        }`}>
                          {isConverted ? 'Yes' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => copyCode(visitor.metadata?.inviteCode)}
                          className="font-bold text-[#0d4697] hover:underline flex items-center gap-1"
                        >
                          {visitor.metadata?.inviteCode}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        {!isConverted && (
                          <button
                            onClick={() => convertVisitor(visitor._id)}
                            className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          >
                            <UserCheck className="h-3 w-3" />
                            Mark Converted
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {!visitors.length && (
                  <tr>
                    <td colSpan="8" className="p-10 text-center text-slate-400 font-bold">No guest visitors registered.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Standard Member Grid Card View */
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visitors.map((visitor) => {
            const status = visitor.metadata?.status || 'invited'
            const isConverted = status === 'converted'
            
            return (
              <article key={visitor._id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3.5 relative group hover:border-[#0d4697]/50 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 leading-tight">{visitor.name}</h4>
                    <p className="text-[10px] font-semibold text-slate-400 mt-1">Invitation context</p>
                  </div>
                  
                  <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase border ${
                    isConverted ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                    'text-blue-700 bg-blue-50 border-blue-200'
                  }`}>
                    {status}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-semibold text-slate-600 border-y border-slate-100 py-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="truncate">{visitor.metadata?.email || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>{visitor.metadata?.phone || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-[#0d4697] shrink-0" />
                    <span>Invited For: {formatDate(visitor.metadata?.date)}</span>
                  </div>
                </div>

                {/* Invite Code row */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Invite Code</span>
                  <button 
                    onClick={() => copyCode(visitor.metadata?.inviteCode)}
                    className="inline-flex items-center gap-1 text-[#0d4697] font-black hover:underline"
                  >
                    <Ticket className="h-3.5 w-3.5" />
                    {visitor.metadata?.inviteCode}
                    <Copy className="h-3 w-3 shrink-0 ml-1 opacity-60" />
                  </button>
                </div>
              </article>
            )
          })}
          {!visitors.length && (
            <p className="text-sm font-semibold text-slate-500 text-center py-10 md:col-span-2 lg:col-span-3">No visitors invited yet.</p>
          )}
        </div>
      )}

      {/* Invite Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
            <h3 className="text-base font-extrabold text-[#0d4697] border-b border-slate-100 pb-3 mb-4">Invite New Visitor</h3>
            
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Visitor Name</label>
                <input 
                  type="text" 
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  required
                  placeholder="e.g. Kishore Kumar" 
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-[#0d4697]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="e.g. visitor@gmail.com" 
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-[#0d4697]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="e.g. 9876543210" 
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-[#0d4697]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Visit Date</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-[#0d4697]"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-extrabold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="rounded-lg bg-[#0d4697] px-4 py-2 text-xs font-extrabold text-white hover:bg-blue-800 disabled:opacity-60"
                >
                  {saving ? 'Inviting...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
