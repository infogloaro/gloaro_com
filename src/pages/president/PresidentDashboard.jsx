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
import LoadingScreen from '../../components/common/LoadingScreen'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/tables/DataTable'
import { useAuth } from '../../hooks/useAuth'
import { useApi } from '../../hooks/useApi'
import { formatCurrency, formatDate } from '../../utils/format'
import { ROLES } from '../../constants/roleConfig.js'

function GlassStat({ label, value, helper, icon: Icon }) {
  return (
    <article className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-950">{value ?? 0}</p>
          <p className="mt-2 text-xs font-extrabold text-[#0d4697]">{helper}</p>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#eef4ff] text-[#1558b0]"><Icon className="h-5 w-5" /></span>
      </div>
    </article>
  )
}

function formatTimeAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function ActivityTimeline() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.auditLogs({ limit: 4 })
      .then(res => {
        setLogs(res.data?.data || res.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-extrabold text-slate-950">Activity Timeline</h2>
        <div className="mt-5 text-sm font-semibold text-slate-400">Loading activity...</div>
      </section>
    );
  }

  const items = logs.map(log => [
    log.description || `${log.action?.replaceAll('_', ' ').toUpperCase()} by ${log.user?.name || log.user?.email || 'System'}`,
    log.module || 'System',
    formatTimeAgo(log.createdAt)
  ]);

  const displayItems = items.length ? items : [
    ['No recent actions logged', 'System', 'Just now']
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-extrabold text-slate-950">Activity Timeline</h2>
      <div className="mt-5 space-y-4">
        {displayItems.map(([title, module, time], idx) => (
          <div key={idx} className="flex gap-3">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#0d4697]" />
            <div>
              <p className="text-sm font-extrabold text-slate-800">{title}</p>
              <p className="text-xs font-bold text-slate-500">{module} • {time}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function monthLabel(item) {
  return `${item._id?.month || ''}/${item._id?.year || ''}`
}

export default function PresidentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const dashboard = useApi(adminApi.dashboard)
  const analytics = useApi(() => reportApi.analytics({ from: '2025-01-01' }))
  
  const stats = dashboard.data || {}
  const report = analytics.data || {}

  const [scopeOverview, setScopeOverview] = useState(null)

  useEffect(() => {
    api.get('/directory/scope-overview')
      .then(res => setScopeOverview(res.data?.data || null))
      .catch(() => {})
  }, [])

  const vpCount = stats.roleStats?.vicePresidents ?? 0;

  const topCards = [
    ['members', 'Total Members', stats.totalUsers ?? '—', `${stats.newUsersToday ?? 0} today`, Users],
    ['active', 'Active Memberships', scopeOverview?.activeMembers ?? stats.activeUsers ?? '—', 'Verified network', CheckCircle2],
    ['approvals', 'Pending Membership Requests', stats.pendingMembershipApplications ?? '—', 'Needs review', ClipboardList],
    [ROLES.VICE_PRESIDENT, 'Vice President', vpCount ?? '—', 'Assigned official', Users],
    ['meetings', 'Meetings', stats.totalMeetings ?? '—', 'Scheduled sessions', CalendarDays],
    ['revenue', 'Business Generated', stats.revenue != null ? formatCurrency(stats.revenue) : '—', 'Chapter value', FileBarChart],
  ]

  if (dashboard.loading || analytics.loading) {
    return <LoadingScreen label="Loading dashboard statistics..." />
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <header className="rounded-2xl border border-white/60 bg-white/85 p-6 shadow-sm backdrop-blur">
        <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#0d4697]">
          <Building2 className="h-4 w-4" />
          President Command Center
        </p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">Gloaro President Dashboard</h1>
        <p className="mt-2 max-w-4xl text-sm font-semibold leading-6 text-slate-555">
          Manage chapter officials, chapter vice presidents, and membership details under your assigned chapter.
        </p>
      </header>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {topCards.map(([key, label, value, helper, Icon]) => (
          <GlassStat key={key} label={label} value={value} helper={helper} icon={Icon} />
        ))}
      </div>

      {/* Quick Actions */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-extrabold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <button
            onClick={() => navigate('/president/vice-presidents')}
            className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-[#eef4ff] transition group text-left"
          >
            <div>
              <p className="font-extrabold text-slate-900 text-sm">Vice Presidents Management</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Manage Chapter Vice Presidents</p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition" />
          </button>
          <button
            onClick={() => navigate('/president/memberships')}
            className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-[#eef4ff] transition group text-left"
          >
            <div>
              <p className="font-extrabold text-slate-900 text-sm">Memberships</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Track memberships list</p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition" />
          </button>
          <button
            onClick={() => navigate('/president/settings')}
            className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-[#eef4ff] transition group text-left"
          >
            <div>
              <p className="font-extrabold text-slate-900 text-sm">Settings</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Configure profile & session</p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </section>

      {/* Analytics Growth Charts */}
      <section className="grid gap-5 xl:grid-cols-2">
        {report.monthlyUsers?.length ? (
          <ChartCard title="Membership Growth" data={report.monthlyUsers.map((item) => ({ label: monthLabel(item), members: item.users }))} dataKey="members" />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
            <p className="text-sm font-semibold text-slate-500">No data available</p>
          </div>
        )}
        {report.membershipSales?.length ? (
          <ChartCard title="Membership Sales" type="bar" data={report.membershipSales.map((item) => ({ label: item._id, sales: item.sales }))} dataKey="sales" />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
            <p className="text-sm font-semibold text-slate-500">No data available</p>
          </div>
        )}
      </section>

      {/* Recent Activity */}
      <section className="grid gap-5">
        <ActivityTimeline />
      </section>
    </section>
  )
}
