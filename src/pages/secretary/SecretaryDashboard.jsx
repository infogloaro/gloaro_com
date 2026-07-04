import { Link } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { secretaryApi } from '../../api/secretary'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import StatCard from '../../components/dashboard/StatCard'
import { formatDate } from '../../utils/format'
import { Users, FileText, CalendarDays, ShoppingBag, FolderOpen } from 'lucide-react'

export default function SecretaryDashboard() {
  const { data, loading, error } = useApi(secretaryApi.dashboard)

  if (loading) return <LoadingSpinner label="Loading Secretary Dashboard" />

  if (error || !data) {
    return (
      <EmptyState 
        title="Dashboard Offline" 
        description="Could not load Secretary dashboard information from the API server." 
      />
    )
  }

  const summary = data.summary || {}

  return (
    <div className="space-y-6">
      {/* Brand Header Banner */}
      <div className="rounded-lg bg-[#0b1f3d] p-5 text-white shadow-sm sm:p-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#ffb20c]">
          Welcome Back
        </p>
        <h2 className="mt-1 text-xl font-bold sm:text-2xl text-slate-100">
          {data.user?.name || 'Secretary'}
        </h2>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">Secretary Dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold text-slate-200">
          Monitor your chapter metrics, view upcoming meetings, track member lists, and organize documents.
        </p>
      </div>

      {/* Summary KPI Cards Grid */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Members" value={summary.totalMembers} icon={Users} />
        <StatCard label="Active Members" value={summary.activeMembers} icon={Users} />
        <StatCard label="Pending Minutes" value={summary.pendingMinutes} icon={FileText} />
        <StatCard label="Attendance Rate" value={`${summary.attendanceRate}%`} icon={CalendarDays} />
        <StatCard label="Documents" value={summary.documentsUploaded} icon={ShoppingBag} />
      </section>

      {/* Quick Actions Panel */}
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-extrabold text-slate-950">Quick Actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {data.quickActions?.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#0d4697] px-4 text-sm font-extrabold text-white transition hover:bg-[#0b3e85]"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Grid Content Panel */}
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Upcoming Meetings List */}
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-extrabold text-slate-950">Upcoming Meetings</h2>
          <div className="mt-4">
            {data.upcomingMeetings?.length ? (
              <div className="divide-y divide-slate-100">
                {data.upcomingMeetings.map((meeting) => (
                  <div key={meeting._id} className="flex items-center justify-between gap-4 py-3.5">
                    <div>
                      <p className="text-sm font-extrabold text-slate-900">{meeting.title}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {formatDate(meeting.startDate)} • <span className="uppercase">{meeting.type}</span>
                      </p>
                    </div>
                    <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                      {meeting.venue?.name || 'Online'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                title="No Upcoming Meetings" 
                description="No chapter meetings or training events are scheduled at the moment." 
              />
            )}
          </div>
        </section>

        {/* Recent Activities Feed */}
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-extrabold text-slate-950">Recent Activities</h2>
          <div className="mt-4">
            {data.recentActivities?.length ? (
              <div className="space-y-3">
                {data.recentActivities.map((act, index) => (
                  <div key={index} className="flex items-start gap-3 rounded-md bg-slate-50 p-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">{act.message}</p>
                      <p className="mt-1 text-[10px] font-bold text-slate-400">{formatDate(act.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                title="No Recent Activities" 
                description="No operations have been logged for this chapter recently." 
              />
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
