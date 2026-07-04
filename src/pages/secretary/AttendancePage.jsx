import { useApi } from '../../hooks/useApi'
import { secretaryApi } from '../../api/secretary'
import StatusBadge from '../../components/common/StatusBadge'
import StatCard from '../../components/dashboard/StatCard'
import ResourceListPage from '../shared/ResourceListPage'
import { formatDate } from '../../utils/format'
import { Users, CalendarDays, Eye } from 'lucide-react'

const columns = [
  { key: 'name', header: 'Member Name', render: (row) => row.user?.name || '—' },
  { key: 'memberId', header: 'Member ID', render: (row) => row.user?.memberId || '—' },
  { key: 'meeting', header: 'Meeting', render: (row) => row.event?.title || '—' },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
  { key: 'checkInTime', header: 'Check-in Time', render: (row) => row.checkInTime ? formatDate(row.checkInTime) : '—' }
]

const filters = [
  {
    key: 'status',
    label: 'Filter by Status',
    options: [
      { value: 'Present', label: 'Present' },
      { value: 'Absent', label: 'Absent' },
      { value: 'Late', label: 'Late' },
      { value: 'Excused', label: 'Excused' }
    ]
  }
]

export default function AttendancePage() {
  // TODO:
  // Until the shared paginatedResponse() helper supports additional
  // summary metadata, retrieve Total Members from the Dashboard endpoint.
  // Once Attendance statistics are implemented, expose summary data
  // directly from the Attendance endpoint and remove this extra request.
  const { data: dashboardData } = useApi(secretaryApi.dashboard)
  const totalMembers = dashboardData?.summary?.totalMembers || 0

  const renderActions = () => (
    <button disabled className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-extrabold text-slate-400 opacity-50 cursor-not-allowed">
      <Eye className="h-3.5 w-3.5" />
      View
    </button>
  )

  // TODO:
  // Once Attendance records are implemented,
  // calculate Present, Absent and Attendance Rate
  // from attendance records scoped by req.user.chapterId.
  return (
    <div className="space-y-6">
      {/* Summary KPI Cards Grid */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Members" value={totalMembers} icon={Users} />
        <StatCard label="Present" value={0} icon={Users} />
        <StatCard label="Absent" value={0} icon={Users} />
        <StatCard label="Attendance Rate" value="0%" icon={CalendarDays} />
      </section>

      {/* Roster Listing via ResourceListPage */}
      <ResourceListPage
        title="Attendance Logs"
        description="Monitor and track chapter member attendance presence."
        fetcher={secretaryApi.attendance}
        columns={columns}
        filters={filters}
        renderActions={renderActions}
      />
    </div>
  )
}
