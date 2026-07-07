import { useMemo, useState, useEffect } from 'react'
import {
  Users,
  Building2,
  MapPinned,
  CreditCard,
  FileBarChart,
  Settings,
  PlusCircle,
  CheckCircle2,
  ClipboardList,
  Activity,
  CalendarDays,
  Store,
  Workflow,
  ArrowRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '../../api/admin'
import { reportApi } from '../../api/report'
import api from '../../api/axios'
import ChartCard from '../../components/charts/ChartCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/tables/DataTable'
import { useAuth } from '../../hooks/useAuth'
import { useApi } from '../../hooks/useApi'
import { formatCurrency, formatDate } from '../../utils/format'

function GlassStat({ label, value, helper, icon: Icon }) {
  return (
    <article className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-950 dark:text-white">{value ?? 0}</p>
          <p className="mt-2 text-xs font-extrabold text-emerald-600">{helper}</p>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#eef4ff] text-[#1558b0] dark:bg-blue-950 dark:text-blue-400"><Icon className="h-5 w-5" /></span>
      </div>
    </article>
  )
}

function ActivityTimeline() {
  const items = [
    ['Membership application reviewed', 'Membership', '2 min ago'],
    ['Chapter Director assignment updated', 'Hierarchy', '18 min ago'],
    ['Chapter location status configured', 'Chapters', '42 min ago'],
    ['Chapter membership report exported', 'Reports', '1 hr ago'],
  ]

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-850 dark:bg-slate-950">
      <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Activity Timeline</h2>
      <div className="mt-5 space-y-4">
        {items.map(([title, module, time]) => (
          <div key={title} className="flex gap-3">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#0d4697]" />
            <div>
              <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{title}</p>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{module} • {time}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function monthLabel(item) {
  return `${item._id?.month || ''}/${item._id?.year || ''}`
}

export default function DistrictDirectorDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const dashboard = useApi(adminApi.dashboard)
  const analytics = useApi(() => reportApi.analytics({ from: '2025-01-01' }))
  
  const stats = dashboard.data || {}
  const report = analytics.data || {}

  const [chaptersCount, setChaptersCount] = useState(0)
  const [chapterDirectorsCount, setChapterDirectorsCount] = useState(0)

  useEffect(() => {
    // 1. Fetch locations to count chapters under the assigned district
    api.get('/organization/locations')
      .then(res => {
        const list = res.data?.data?.locations || []
        const count = list.filter(loc => loc.type === 'chapter').length
        setChaptersCount(count)
      })
      .catch(err => console.error('Failed to load locations for chapters:', err))

    // 2. Fetch admin accounts of type executive_director (Chapter Director) to count them
    adminApi.adminAccounts({ role: 'executive_director', limit: 1 })
      .then(res => {
        const pagination = res.data?.data?.pagination || res.data?.pagination || {}
        const count = pagination.total || res.data?.data?.total || 0
        setChapterDirectorsCount(count)
      })
      .catch(err => console.error('Failed to load chapter directors count:', err))
  }, [])

  const topCards = [
    ['chapters', 'Total Chapters', chaptersCount, 'Jurisdiction chapters', MapPinned],
    ['directors', 'Chapter Directors', chapterDirectorsCount, 'Assigned team', Users],
    ['members', 'Total Members', stats.totalUsers, `${stats.newUsersToday || 0} today`, Users],
    ['active', 'Active Memberships', stats.activeUsers || stats.totalUsers, 'Verified network', CheckCircle2],
    ['approvals', 'Pending Approvals', stats.pendingMembershipApplications || 0, 'Needs review', ClipboardList],
    ['revenue', 'Business Generated', formatCurrency(stats.revenue), 'Platform revenue', FileBarChart]
  ]

  if (dashboard.loading || analytics.loading) {
    return <LoadingSpinner label="Loading dashboard statistics" />
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <header className="rounded-2xl border border-white/60 bg-white/85 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900">
        <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#0d4697]">
          <Building2 className="h-4 w-4" />
          District Director Command Center
        </p>
        <h1 className="mt-3 text-3xl font-black text-slate-950 dark:text-white">Gloaro District Dashboard</h1>
        <p className="mt-2 max-w-4xl text-sm font-semibold leading-6 text-slate-555">
          Manage geographical chapters, chapter directors, and membership details under your assigned district.
        </p>
      </header>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {topCards.map(([key, label, value, helper, Icon]) => (
          <GlassStat key={key} label={label} value={value} helper={helper} icon={Icon} />
        ))}
      </div>

      {/* Quick Actions */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-950">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <button
            onClick={() => navigate('/district-director/chapters')}
            className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-[#eef4ff] transition group text-left dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <p className="font-extrabold text-slate-900 dark:text-white text-sm">Add Chapters</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Manage geography tree</p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition" />
          </button>
          <button
            onClick={() => navigate('/district-director/executive-directors')}
            className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-[#eef4ff] transition group text-left dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <p className="font-extrabold text-slate-900 dark:text-white text-sm">Executive Directors</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Create or manage team</p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition" />
          </button>
          <button
            onClick={() => navigate('/district-director/memberships')}
            className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-[#eef4ff] transition group text-left dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <p className="font-extrabold text-slate-900 dark:text-white text-sm">View Memberships</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Track district memberships</p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </section>

      {/* Analytics Growth Charts */}
      <section className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Membership Growth" data={(report.monthlyUsers || []).map((item) => ({ label: monthLabel(item), members: item.users }))} dataKey="members" />
        <ChartCard title="Membership Sales" type="bar" data={(report.membershipSales || []).map((item) => ({ label: item._id, sales: item.sales }))} dataKey="sales" />
      </section>

      {/* Recent Applications & Activity */}
      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-850 dark:bg-slate-950 overflow-hidden">
          <h2 className="text-lg font-extrabold text-slate-950 dark:text-white mb-4">Recent Payments</h2>
          <DataTable
            columns={[
              { key: 'user', header: 'User', render: (row) => row.user?.name || row.user?.email || 'User' },
              { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.amount, row.currency) },
              { key: 'gateway', header: 'Gateway' },
              { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
            ]}
            rows={stats.recentPayments || []}
          />
        </div>
        <ActivityTimeline />
      </section>
    </section>
  )
}