
import { useCallback, useEffect, useMemo, useState } from 'react'

import { customerApi } from '../../api/customer'
import { attendanceApi } from '../../api/attendance'
import LoadingScreen from '../../components/common/LoadingScreen'
import {
  Eye,
  ClipboardList
} from 'lucide-react'
import { formatDate } from '../../utils/format'

const getVenueString = (venue) => {
  if (!venue) return 'Venue not specified';
  if (typeof venue === 'string') return venue;
  const parts = [venue.name, venue.address, venue.city].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Venue not specified';
};

export default function MeetingsAttendance() {
  const [meetings, setMeetings] = useState([])
  const [attendanceRows, setAttendanceRows] = useState([])
  const [attendanceSummary, setAttendanceSummary] = useState({ present: 0, absent: 0, attendanceRate: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedMeeting, setSelectedMeeting] = useState(null)
  const [summary, setSummary] = useState({ attendanceRate: 0, present: 0, absent: 0 })

  const loadPageData = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true)
    try {
      const [meetingResponse, attendanceResponse] = await Promise.all([
        customerApi.events({ page: 1, limit: 100 }),
        attendanceApi.list({ page: 1, limit: 100 }),
      ])
      const meetingPayload = meetingResponse.data?.data ?? meetingResponse.data ?? []
      setMeetings(Array.isArray(meetingPayload) ? meetingPayload : [])
      setAttendanceRows(Array.isArray(attendanceResponse.data?.data) ? attendanceResponse.data.data : [])
      setAttendanceSummary(attendanceResponse.data?.summary || { present: 0, absent: 0, attendanceRate: 0 })
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    const initialLoad = window.setTimeout(() => loadPageData().catch(() => {}), 0)
    const refresh = () => loadPageData({ silent: true }).catch(() => {})
    window.addEventListener('focus', refresh)
    const interval = window.setInterval(refresh, 30000)
    return () => {
      window.clearTimeout(initialLoad)
      window.removeEventListener('focus', refresh)
      window.clearInterval(interval)
    }
  }, [loadPageData])

  const attendanceByEvent = useMemo(() => {
    const grouped = new Map()
    attendanceRows.forEach((row) => {
      const eventId = String(row.eventId || '')
      if (!eventId) return
      const current = grouped.get(eventId) || { present: 0, absent: 0, pending: 0 }
      if (row.status === 'present') current.present += 1
      else if (row.status === 'absent') current.absent += 1
      else current.pending += 1
      grouped.set(eventId, current)
    })
    return grouped
  }, [attendanceRows])

  if (loading) {
    return <LoadingScreen label="Loading meetings and attendance logs..." />
  }

  return (
    <div className="space-y-6">
      {/* Attendance Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Total Meetings</p>
          <p className="mt-2 text-2xl font-black text-[#0d4697]">{meetings.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Present Records</p>
          <p className="mt-2 text-2xl font-black text-emerald-600">{attendanceSummary.present || 0}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Attendance Rate</p>
          <p className="mt-2 text-2xl font-black text-[#0d4697]">{attendanceSummary.attendanceRate || 0}%</p>
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
            if (meeting.event) Object.assign(meeting, event)
            const eventAttendance = attendanceByEvent.get(String(event._id)) || { present: 0, absent: 0, pending: 0 }
            return (
              <div key={event._id || index} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-xs font-black text-[#0d4697]">
                    {event.startDate ? new Date(event.startDate).getDate() : '—'}
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
                    onClick={() => setSelectedMeeting({ meeting: event, eventAttendance })}
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

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-emerald-50 p-3 text-center"><p className="text-[10px] font-extrabold uppercase text-emerald-600">Present</p><p className="mt-1 text-lg font-black text-emerald-700">{selectedMeeting.eventAttendance.present}</p></div>
                <div className="rounded-xl bg-red-50 p-3 text-center"><p className="text-[10px] font-extrabold uppercase text-red-600">Absent</p><p className="mt-1 text-lg font-black text-red-700">{selectedMeeting.eventAttendance.absent}</p></div>
                <div className="rounded-xl bg-amber-50 p-3 text-center"><p className="text-[10px] font-extrabold uppercase text-amber-600">Pending</p><p className="mt-1 text-lg font-black text-amber-700">{selectedMeeting.eventAttendance.pending}</p></div>
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

    </div>
  )
}
