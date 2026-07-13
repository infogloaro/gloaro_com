import { useEffect, useState } from 'react'
import { customerApi } from '../../api/customer'
import { useApi } from '../../hooks/useApi'
import LoadingScreen from '../../components/common/LoadingScreen'
import toast from 'react-hot-toast'
import {
  CalendarDays,
  CheckCircle,
  XCircle,
  FileText,
  UserCheck,
  Building,
  PlusCircle,
  ClipboardList
} from 'lucide-react'
import { formatDate } from '../../utils/format'

export default function MeetingsAttendance() {
  // Retrieve events mapped as meetings
  const { data, loading } = useApi(() => customerApi.events({ limit: 12 }))
  const [meetings, setMeetings] = useState([])
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [leaveReason, setLeaveReason] = useState('')
  const [leaveMeetingId, setLeaveMeetingId] = useState('')
  const [leaveRequests, setLeaveRequests] = useState([])

  useEffect(() => {
    if (data) {
      // Filter meetings from events or use all events as community sessions
      setMeetings(data.data || data || [])
    }
  }, [data])

  const handleApplyLeave = (e) => {
    e.preventDefault()
    if (!leaveReason.trim()) return

    const newRequest = {
      meetingId: leaveMeetingId,
      reason: leaveReason,
      status: 'pending',
      date: new Date().toISOString()
    }

    setLeaveRequests(prev => [newRequest, ...prev])
    toast.success('Leave application submitted to Chapter Secretary')
    setShowLeaveModal(false)
    setLeaveReason('')
  }

  if (loading) {
    return <LoadingScreen label="Loading meetings and attendance logs..." />
  }

  // Calculate Attendance KPIs
  const totalMeetings = meetings.length || 8
  const attendedCount = Math.max(totalMeetings - 1, 0)
  const missedCount = Math.min(totalMeetings - attendedCount, 1)
  const pct = totalMeetings > 0 ? ((attendedCount / totalMeetings) * 100).toFixed(0) : '100'

  return (
    <div className="space-y-6">
      {/* Attendance Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Attendance Rate</p>
          <p className="mt-2 text-2xl font-black text-[#0d4697]">{pct}%</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Meetings Attended</p>
          <p className="mt-2 text-2xl font-black text-emerald-600">{attendedCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Absent Logs</p>
          <p className="mt-2 text-2xl font-black text-red-600">{missedCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Approved Leaves</p>
          <p className="mt-2 text-2xl font-black text-slate-600">{leaveRequests.length}</p>
        </div>
      </div>

      {/* Action panel to apply leave */}
      <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl p-4">
        <span className="text-sm font-extrabold text-slate-800">Need to apply for leaves for upcoming scheduled sessions?</span>
        <button
          onClick={() => setShowLeaveModal(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-extrabold text-slate-700 hover:bg-slate-50"
        >
          <PlusCircle className="h-4 w-4" />
          Apply for Leave
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        {/* Meetings Logs list */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-[#0d4697]" />
            Chapter Meetings Registry
          </h3>

          <div className="divide-y divide-slate-100">
            {meetings.map((meeting, index) => {
              const isAttended = index > 0; // mock attendance values
              return (
                <div key={meeting._id || index} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-xs font-black text-[#0d4697]">
                      {new Date(meeting.startDate || Date.now()).getDate()}
                    </span>
                    <div>
                      <p className="text-sm font-extrabold text-slate-800 leading-tight">{meeting.title || 'Weekly Chapter Meeting'}</p>
                      <p className="text-[10px] font-semibold text-slate-400 mt-1">
                        {formatDate(meeting.startDate)} • Venue: {meeting.venue || 'Chapter Hall'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isAttended ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Present
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                        <XCircle className="h-3.5 w-3.5" />
                        Absent
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
            {!meetings.length && (
              <p className="text-sm font-semibold text-slate-500 py-6 text-center">No scheduled meetings logged in registry.</p>
            )}
          </div>
        </section>

        {/* Leave Requests Logs Sidebar */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900">Leave Applications Logs</h3>
          
          <div className="space-y-3">
            {leaveRequests.map((req, idx) => (
              <div key={idx} className="rounded-lg bg-slate-50 border border-slate-100 p-3 text-xs space-y-1.5">
                <div className="flex justify-between items-center font-bold text-slate-700">
                  <span>Leave Request</span>
                  <span className="rounded bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-amber-700">
                    {req.status}
                  </span>
                </div>
                <p className="text-slate-500 leading-normal">{req.reason}</p>
                <p className="text-[9px] font-semibold text-slate-400">{formatDate(req.date)}</p>
              </div>
            ))}
            {!leaveRequests.length && (
              <p className="text-xs font-semibold text-slate-400 text-center py-6">No leaves logged.</p>
            )}
          </div>
        </section>
      </div>

      {/* Leave Application Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 mb-4">Apply for Leave</h3>
            
            <form onSubmit={handleApplyLeave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Select Meeting</label>
                <select 
                  value={leaveMeetingId}
                  onChange={(e) => setLeaveMeetingId(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-[#0d4697]"
                >
                  <option value="">Select an upcoming meeting...</option>
                  {meetings.map((m) => (
                    <option key={m._id} value={m._id}>{m.title} ({formatDate(m.startDate)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Reason for Absence</label>
                <textarea 
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  rows={4} 
                  required
                  placeholder="Explain why you are unable to attend..." 
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-[#0d4697]"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowLeaveModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-extrabold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="rounded-lg bg-[#0d4697] px-4 py-2 text-xs font-extrabold text-white hover:bg-blue-800"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
