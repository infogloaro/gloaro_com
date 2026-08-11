import { useEffect, useState } from 'react'
import { communityApi } from '../../api/community'
import LoadingScreen from '../../components/common/LoadingScreen'
import toast from 'react-hot-toast'
import {
  CalendarDays,
  Clock,
  Info,
  Gift,
  AlertCircle,
  UsersRound,
  FileCheck
} from 'lucide-react'
import { formatDate } from '../../utils/format'

export default function UnifiedCalendar() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    communityApi.getCalendar()
      .then(res => {
        setEvents(res.data?.data || [])
      })
      .catch(() => {
        toast.error('Failed to load unified calendar events')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <LoadingScreen label="Loading unified calendar..." />
  }

  return (
    <div className="space-y-6">
      {/* Calendar header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-900">Unified Unit Calendar</h2>
        <p className="text-sm font-semibold text-slate-500 mt-1">Track upcoming chapter meetings, training courses, peer birthdays, and renewal reminders.</p>
      </section>

      {/* Events Registry Stream */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-[#0d4697]" />
          Upcoming Scheduled Dates
        </h3>

        <div className="divide-y divide-slate-100">
          {events.map((evt, idx) => {
            const isRenewal = evt.type === 'renewal'
            const isBirthday = evt.type === 'birthday'
            const isMeeting = evt.type === 'meeting'

            let Icon = CalendarDays
            let colorClasses = 'bg-blue-50 text-[#0d4697] border-blue-100'
            
            if (isRenewal) {
              Icon = AlertCircle
              colorClasses = 'bg-red-50 text-red-700 border-red-100'
            } else if (isBirthday) {
              Icon = Gift
              colorClasses = 'bg-yellow-50 text-yellow-700 border-yellow-100'
            }

            return (
              <div key={idx} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4 first:pt-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <span className={`grid h-9 w-9 place-items-center rounded-lg border shrink-0 ${colorClasses}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800 leading-tight">{evt.title}</h4>
                    <p className="text-[11px] font-semibold text-slate-400 mt-1">{evt.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <span className="text-xs font-black text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                    {formatDate(evt.start)}
                  </span>
                </div>
              </div>
            )
          })}
          {!events.length && (
            <p className="text-sm font-semibold text-slate-500 py-6 text-center">No scheduled dates found on unified calendar.</p>
          )}
        </div>
      </div>
    </div>
  )
}
