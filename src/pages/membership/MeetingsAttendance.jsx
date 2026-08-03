import { useEffect, useState } from 'react'
import { attendanceApi } from '../../api/attendance'
import { customerApi } from '../../api/customer'
import { useApi } from '../../hooks/useApi'
import LoadingScreen from '../../components/common/LoadingScreen'
import toast from 'react-hot-toast'
import {
  CalendarDays,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  UserCheck,
  Building,
  PlusCircle,
  ClipboardList
} from 'lucide-react'
import { formatDate } from '../../utils/format'
import { useAuth } from '../../hooks/useAuth'

const getVenueString = (venue) => {
  if (!venue) return 'Venue not specified';
  if (typeof venue === 'string') return venue;
  const parts = [venue.name, venue.address, venue.city].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Venue not specified';
};

export default function MeetingsAttendance() {
  const { user } = useAuth()
  // Retrieve events mapped as meetings
  const { data, loading } = useApi(() => customerApi.events({ limit: 12 }))
  const [meetings, setMeetings] = useState([])
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [leaveReason, setLeaveReason] = useState('')
  const [leaveMeetingId, setLeaveMeetingId] = useState('')
  const [leaveRequests, setLeaveRequests] = useState([])
  const [selectedMeeting, setSelectedMeeting] = useState(null)
  const [summary, setSummary] = useState({ attendanceRate: 0, present: 0, absent: 0 })

  useEffect(() => {
    if (data) {
      // Filter meetings from events or use all events as community sessions
      setMeetings(data.data || data || [])
    }
  }, [data])

  useEffect(() => {
    attendanceApi.list()
      .then((res) => {
        if (res.data?.summary) {
          setSummary(res.data.summary)
        }
      })
      .catch(() => {})
  }, [])

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

  // Calculate Attendance KPIs from Live Database
  const attendedCount = summary.present || 0
  const missedCount = summary.absent || 0
  const pct = summary.attendanceRate != null ? summary.attendanceRate : 0

  return (
    <div className="space-y-6">
      {/* Attendance Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
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
      </div>



      {/* Meetings Logs list */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-[#0d4697]" />
          Chapter Meetings Registry
        </h3>

        <div className="divide-y divide-slate-100">
          {meetings.map((meeting, index) => {
            const event = meeting.event || meeting
            const registration = meeting.registration || event.attendees?.find((attendee) => attendee.user?._id === user?._id || attendee.user === user?._id)
            if (meeting.event) Object.assign(meeting, event)
            const isAttended = registration ? registration.status === 'attended' : index > 0 // fallback for legacy records
            return (
              <div key={event._id || index} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-xs font-black text-[#0d4697]">
                    {new Date(event.startDate || Date.now()).getDate()}
                  </span>
                  <div>
                    <p className="text-sm font-extrabold text-slate-800 leading-tight">{event.title || 'Weekly Chapter Meeting'}</p>
                    <p className="text-[10px] font-semibold text-slate-400 mt-1">
                      {formatDate(meeting.startDate)} • Venue: {getVenueString(meeting.venue)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMeeting({ meeting: event, registration, isAttended })}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-[#0d4697] transition hover:border-[#0d4697] hover:bg-blue-100"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View details
                  </button>
                </div>
              </div>
            )
          })}
          {!meetings.length && (
            <p className="text-sm font-semibold text-slate-500 py-6 text-center">No scheduled meetings logged in registry.</p>
          )}
        </div>
      </section>

      {selectedMeeting && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4" onMouseDown={() => setSelectedMeeting(null)}>
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#0d4697]">Meeting details</p>
                <h3 className="mt-1 text-xl font-black text-slate-900">{selectedMeeting.meeting.title || 'Weekly Chapter Meeting'}</h3>
              </div>
              <button type="button" onClick={() => setSelectedMeeting(null)} className="text-2xl leading-none text-slate-400 hover:text-slate-700" aria-label="Close details">×</button>
            </div>

            <div className="space-y-5 px-6 py-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-extrabold uppercase text-slate-400">Date</p><p className="mt-1 text-sm font-bold text-slate-800">{formatDate(selectedMeeting.meeting.startDate)}</p></div>
                <div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-extrabold uppercase text-slate-400">Venue</p><p className="mt-1 text-sm font-bold text-slate-800">{getVenueString(selectedMeeting.meeting.venue)}</p></div>
                <div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-extrabold uppercase text-slate-400">Meeting type</p><p className="mt-1 text-sm font-bold capitalize text-slate-800">{selectedMeeting.meeting.type || 'Chapter meeting'}</p></div>
                <div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-extrabold uppercase text-slate-400">Time</p><p className="mt-1 text-sm font-bold text-slate-800">{selectedMeeting.meeting.startDate ? new Date(selectedMeeting.meeting.startDate).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) : '—'}</p></div>
              </div>

              {selectedMeeting.meeting.attendees?.length > 0 && (
                <div className="border-t border-slate-100 pt-5">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Event members</p>
                  <div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200">
                    {selectedMeeting.meeting.attendees.map((attendee, index) => (
                      <div key={attendee._id || index} className="flex items-center justify-between gap-3 px-3 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-extrabold text-slate-800">{attendee.user?.name || attendee.name || 'Member'}</p>
                          <p className="text-xs font-semibold text-slate-500">{attendee.role || 'Member'}{attendee.task ? ` • ${attendee.task}` : ''}</p>
                        </div>
                        <span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-extrabold ${attendee.status === 'attended' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : attendee.status === 'no_show' ? 'border-red-200 bg-red-50 text-red-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                          {attendee.status === 'attended' ? 'Present' : attendee.status === 'no_show' ? 'Absent' : 'Registered'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

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
