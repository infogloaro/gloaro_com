import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  CheckCircle2,
  CalendarDays,
  FileBarChart,
  Handshake,
  Clock,
  Layers,
  Award,
  Bell,
  Ticket,
  Briefcase,
  TrendingUp,
  Building2,
  CheckSquare,
  ShieldAlert
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useApi } from '../../hooks/useApi'
import { adminApi } from '../../api/admin'
import api from '../../api/axios'
import LoadingScreen from '../../components/common/LoadingScreen'
import { formatCurrency } from '../../utils/format'
import { dashboardConfig } from '../../constants/dashboardConfig'
import { ROLES } from '../../constants/roleConfig.js'

// Helper to calculate relative times
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

export default function DynamicDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const dashboard = useApi(adminApi.dashboard)

  const [logs, setLogs] = useState([])
  const [logsLoading, setLogsLoading] = useState(true)
  const [scopeOverview, setScopeOverview] = useState(null)

  useEffect(() => {
    api.get('/directory/scope-overview')
      .then(res => setScopeOverview(res.data?.data || null))
      .catch(() => {})
  }, [])

  useEffect(() => {
    adminApi.auditLogs({ limit: 4 })
      .then(res => {
        setLogs(res.data?.data || res.data || []);
      })
      .catch(() => {})
      .finally(() => setLogsLoading(false));
  }, [])

  if (dashboard.loading) {
    return <LoadingScreen label="Loading Dashboard..." />
  }

  const role = user?.role || ROLES.CUSTOMER
  const config = dashboardConfig[role]

  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert className="h-16 w-16 text-rose-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-800">Configuration Not Found</h1>
        <p className="text-sm text-slate-500 mt-2">Dynamic dashboard configuration is not defined for role: {role}</p>
      </div>
    )
  }

  const stats = dashboard.data || {}
  const org = user?.meta?.adminProfile?.organization || user?.organization || user?.meta?.organization || {}
  const region = org.assignedRegion?.name || org.region?.name || org.region || ''
  const state = org.assignedState?.name || org.state?.name || org.state || ''
  const district = org.assignedDistrict?.name || org.district?.name || org.district || ''
  const chapter = org.assignedChapter?.name || org.chapter?.name || org.chapter || ''

  const formatName = (name, suffix) => {
    if (!name) return ''
    if (name.toLowerCase().includes(suffix.toLowerCase())) return name
    return `${name} ${suffix}`
  }

  const hierarchyParts = []
  if (chapter) hierarchyParts.push(formatName(chapter, 'Chapter'))
  if (district) hierarchyParts.push(formatName(district, 'District'))
  if (state) hierarchyParts.push(state)
  if (region) hierarchyParts.push(formatName(region, 'Region'))

  const hierarchyString = hierarchyParts.filter(Boolean).join(' • ') || 'All Territories Authorized'
  const memberId = user?.officialId || user?.memberId || 'MEM-TN-CHN-000145'

  const formatVal = (val) => val ?? '—'

  // Map stat key names to readable values and icons
  const statResolver = {
    members: {
      label: 'Members',
      value: formatVal(stats.roleStats?.registeredMembers ?? stats.totalUsers),
      icon: Users,
      color: 'text-blue-600 bg-blue-50'
    },
    attendance: {
      label: 'Attendance Rate',
      value: '—',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50'
    },
    meetings: {
      label: 'Meetings Scheduled',
      value: formatVal(stats.eventsCount ?? stats.totalMeetings),
      icon: CalendarDays,
      color: 'text-amber-600 bg-amber-50'
    },
    referrals: {
      label: 'Connects Passed',
      value: formatVal(stats.roleStats?.referralsCount),
      icon: Handshake,
      color: 'text-purple-600 bg-purple-50'
    },
    visitors: {
      label: 'Visitors Invited',
      value: formatVal(stats.visitorsCount ?? stats.roleStats?.visitorsCount),
      icon: Ticket,
      color: 'text-pink-600 bg-pink-50'
    },
    business: {
      label: 'Business Generated',
      value: stats.revenue != null ? formatCurrency(stats.revenue) : '—',
      icon: TrendingUp,
      color: 'text-teal-600 bg-teal-50'
    },
    assignedChapters: {
      label: 'Assigned Chapters',
      value: formatVal(stats.roleStats?.totalChapters),
      icon: Building2,
      color: 'text-blue-600 bg-blue-50'
    },
    chaptersReady: {
      label: 'Chapters Ready',
      value: formatVal(stats.roleStats?.activeChapters),
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50'
    },
    chaptersPending: {
      label: 'Chapters Pending',
      value: formatVal(stats.roleStats?.pendingChapters),
      icon: Clock,
      color: 'text-amber-600 bg-amber-50'
    },
    presidentsAssigned: {
      label: 'Unit Chairmen Assigned',
      value: formatVal(stats.roleStats?.chapterPresidents),
      icon: Users,
      color: 'text-purple-600 bg-purple-50'
    },
    membersRegistered: {
      label: 'Members Registered',
      value: formatVal(stats.roleStats?.registeredMembers ?? stats.totalUsers),
      icon: Users,
      color: 'text-indigo-600 bg-indigo-50'
    },
    pendingMemberships: {
      label: 'Pending Memberships',
      value: formatVal(stats.roleStats?.pendingRegistrations ?? stats.pendingMembershipApplications),
      icon: Clock,
      color: 'text-rose-600 bg-rose-50'
    },
    vendorsApproved: {
      label: 'Vendors Approved',
      value: formatVal(stats.activeVendors),
      icon: Briefcase,
      color: 'text-sky-600 bg-sky-50'
    },
    meetingsScheduled: {
      label: 'Meetings Scheduled',
      value: formatVal(stats.eventsCount ?? stats.totalMeetings),
      icon: CalendarDays,
      color: 'text-amber-600 bg-amber-50'
    },
    referralsPassed: {
      label: 'Connects Passed',
      value: formatVal(stats.roleStats?.referralsCount),
      icon: Handshake,
      color: 'text-violet-600 bg-violet-50'
    },
    visitorsInvited: {
      label: 'Visitors Invited',
      value: formatVal(stats.visitorsCount ?? stats.roleStats?.visitorsCount),
      icon: Ticket,
      color: 'text-pink-600 bg-pink-50'
    },
    businessGenerated: {
      label: 'Business Generated',
      value: stats.revenue != null ? formatCurrency(stats.revenue) : '—',
      icon: TrendingUp,
      color: 'text-emerald-600 bg-emerald-50'
    },
    activeMembers: {
      label: 'Active Members',
      value: formatVal(scopeOverview?.activeMembers ?? stats.roleStats?.registeredMembers ?? stats.activeUsers),
      icon: Users,
      color: 'text-emerald-600 bg-emerald-50'
    },
    pendingVendors: {
      label: 'Vendor Applications',
      value: formatVal(stats.pendingVendors ?? stats.roleStats?.pendingVendors),
      icon: Briefcase,
      color: 'text-rose-600 bg-rose-50'
    },
    oneToOnes: {
      label: 'One-to-One Meetings',
      value: formatVal(stats.oneToOnes ?? stats.roleStats?.oneToOnes),
      icon: Users,
      color: 'text-indigo-600 bg-indigo-50'
    },
    chapterDirectors: {
      label: 'Chapter Directors',
      value: formatVal(stats.roleStats?.chapterDirectors ?? stats.roleStats?.launchDirectors),
      icon: Users,
      color: 'text-blue-600 bg-blue-50'
    },
    executiveDirectors: {
      label: 'District Presidents',
      value: formatVal(stats.roleStats?.executiveDirectors),
      icon: Users,
      color: 'text-purple-600 bg-purple-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. Welcome Banner */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b1f3d] to-[#0d4697] p-6 text-white shadow-lg relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#ffb20c]">
            Welcome Back, {user?.name || 'Director'} 👋
          </p>
          <h1 className="text-3xl font-black capitalize">{role.replaceAll('_', ' ')} Console</h1>
          <p className="text-sm font-semibold text-slate-200">
            {hierarchyString}
          </p>
        </div>
        <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/20 backdrop-blur text-xs space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-[#ffb20c]" /> Member ID: {memberId}
          </div>
          <div className="font-bold flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Status: <span className="uppercase text-emerald-400 font-black">Active</span>
          </div>
        </div>
      </div>

      {/* 2. dynamic stats grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {config.cards.map((cardKey) => {
          const card = statResolver[cardKey]
          if (!card) return null
          const Icon = card.icon
          return (
            <div key={cardKey} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
                <p className="mt-2 text-2xl font-black text-slate-900">{card.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${card.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          )
        })}
      </section>

      {/* 3. quick actions & timeline */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-extrabold text-slate-950 mb-4 flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-[#0d4697]" /> Quick Operations
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {config.quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-[#0d4697]/5 hover:border-[#0d4697]/20 transition text-left"
              >
                <div className="p-2 rounded-lg bg-[#0d4697]/10 text-[#0d4697]">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-800 leading-none">{action.label}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1">Navigate</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-extrabold text-slate-950 mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#0d4697]" /> Activity Log
          </h2>
          <div className="space-y-4">
            {logsLoading ? (
              <div className="text-xs text-slate-400 font-semibold">Loading log records...</div>
            ) : logs.length ? (
              logs.map((log, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-[#0d4697]" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">{log.description || log.action}</p>
                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{log.module} • {formatTimeAgo(log.createdAt)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 font-semibold">No recent events logged.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
