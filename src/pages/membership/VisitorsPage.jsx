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
  Copy
} from 'lucide-react'
import { formatDate } from '../../utils/format'

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  // Form states
  const [visitorName, setVisitorName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [saving, setSaving] = useState(false)

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

  if (loading) {
    return <LoadingScreen label="Loading visitors logs..." />
  }

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl p-4">
        <span className="text-sm font-extrabold text-slate-800">Invite guest visitors to attend upcoming chapter networking sessions.</span>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0d4697] px-4 py-2 text-xs font-extrabold text-white hover:bg-blue-800"
        >
          <PlusCircle className="h-4 w-4" />
          Invite Visitor
        </button>
      </div>

      {/* Visitor grid */}
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
