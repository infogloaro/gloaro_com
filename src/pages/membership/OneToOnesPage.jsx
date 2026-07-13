import { useEffect, useState } from 'react'
import { communityApi } from '../../api/community'
import LoadingScreen from '../../components/common/LoadingScreen'
import toast from 'react-hot-toast'
import {
  PlusCircle,
  CalendarDays,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  FileText,
  HelpCircle,
  ArrowRight
} from 'lucide-react'
import { formatDate } from '../../utils/format'

export default function OneToOnesPage() {
  const [oneToOnes, setOneToOnes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  // Schedule form states
  const [partnerId, setPartnerId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchOneToOnes = () => {
    communityApi.getOneToOnes()
      .then(res => {
        setOneToOnes(res.data?.data || [])
      })
      .catch(() => {
        toast.error('Failed to reload One-to-One logs')
      })
  }

  useEffect(() => {
    setLoading(true)
    communityApi.getOneToOnes()
      .then(res => {
        setOneToOnes(res.data?.data || [])
      })
      .catch(() => {
        toast.error('Failed to load networking One-to-One sessions')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleSchedule = (e) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      partnerId,
      date,
      time,
      notes
    }

    communityApi.createOneToOne(payload)
      .then(() => {
        toast.success('One-to-One session scheduled successfully!')
        setShowModal(false)
        setPartnerId('')
        setDate('')
        setTime('')
        setNotes('')
        fetchOneToOnes()
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to schedule session')
      })
      .finally(() => {
        setSaving(false)
      })
  }

  const handleStatusUpdate = (id, status, outcome = '') => {
    communityApi.updateOneToOne(id, { status, outcome })
      .then(() => {
        toast.success(`One-to-One session updated to ${status}`)
        fetchOneToOnes()
      })
      .catch(() => {
        toast.error('Unable to update session')
      })
  }

  if (loading) {
    return <LoadingScreen label="Loading networking One-to-One sessions..." />
  }

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl p-4">
        <span className="text-sm font-extrabold text-slate-800">Schedule one-to-one business networking sessions with peers.</span>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0d4697] px-4 py-2 text-xs font-extrabold text-white hover:bg-blue-800"
        >
          <PlusCircle className="h-4 w-4" />
          Schedule 1-to-1
        </button>
      </div>

      {/* Sessions list */}
      <div className="grid gap-4 md:grid-cols-2">
        {oneToOnes.map((oto) => {
          const isPending = oto.metadata?.status === 'pending'
          const isAccepted = oto.metadata?.status === 'accepted'
          const isCompleted = oto.metadata?.status === 'completed'
          
          return (
            <article key={oto._id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">{oto.name}</h4>
                  <p className="text-[10px] font-semibold text-slate-400 mt-1">Invited by: {oto.createdBy?.name || 'Member'}</p>
                </div>
                
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase border ${
                  isCompleted ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                  isAccepted ? 'text-blue-700 bg-blue-50 border-blue-200' :
                  isPending ? 'text-amber-700 bg-amber-50 border-amber-200' :
                  'text-red-700 bg-red-50 border-red-200'
                }`}>
                  {oto.metadata?.status || 'pending'}
                </span>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[#0d4697] shrink-0" />
                  <span>Date: {formatDate(oto.metadata?.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#0d4697] shrink-0" />
                  <span>Time: {oto.metadata?.time}</span>
                </div>
              </div>

              {oto.metadata?.notes && (
                <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500 leading-relaxed">
                  <p className="font-extrabold text-slate-700 mb-1">Agenda / Discussion notes:</p>
                  {oto.metadata.notes}
                </div>
              )}

              {oto.metadata?.outcome && (
                <div className="rounded-lg bg-emerald-50/50 border border-emerald-100 p-3 text-xs text-emerald-800 leading-relaxed">
                  <p className="font-extrabold text-emerald-950 mb-1">Outcome / Next Steps:</p>
                  {oto.metadata.outcome}
                </div>
              )}

              {/* Status transition controls */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2 justify-end">
                {isPending && (
                  <>
                    <button 
                      onClick={() => handleStatusUpdate(oto._id, 'accepted')}
                      className="rounded bg-blue-600 px-3 py-1.5 text-[10px] font-extrabold text-white hover:bg-blue-700"
                    >
                      Accept Meeting
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(oto._id, 'rejected')}
                      className="rounded border border-slate-200 px-3 py-1.5 text-[10px] font-extrabold text-slate-600 hover:bg-slate-50"
                    >
                      Decline
                    </button>
                  </>
                )}
                {isAccepted && (
                  <button 
                    onClick={() => handleStatusUpdate(oto._id, 'completed', 'Collaborated on business cross-referrals.')}
                    className="rounded bg-emerald-600 px-3 py-1.5 text-[10px] font-extrabold text-white hover:bg-emerald-700"
                  >
                    Complete Meeting
                  </button>
                )}
              </div>
            </article>
          )
        })}
        {!oneToOnes.length && (
          <p className="text-sm font-semibold text-slate-500 text-center py-10 md:col-span-2">No 1-to-1 meetings scheduled.</p>
        )}
      </div>

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
            <h3 className="text-base font-extrabold text-[#0d4697] border-b border-slate-100 pb-3 mb-4">Schedule One-to-One Meeting</h3>
            
            <form onSubmit={handleSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Partner User ID</label>
                <input 
                  type="text" 
                  value={partnerId}
                  onChange={(e) => setPartnerId(e.target.value)}
                  required
                  placeholder="e.g. 669a8b1c402cd0a20e24177b" 
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-[#0d4697]"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-[#0d4697]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Time</label>
                  <input 
                    type="text" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    placeholder="e.g. 10:00 AM" 
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-[#0d4697]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Meeting Agenda / Networking Notes</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3} 
                  required
                  placeholder="Explain why you want to meet or topics you want to discuss..." 
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
                  {saving ? 'Scheduling...' : 'Schedule Meeting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
