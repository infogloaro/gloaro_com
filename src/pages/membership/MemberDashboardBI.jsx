import { useEffect, useState } from 'react'
import { communityApi } from '../../api/community'
import LoadingScreen from '../../components/common/LoadingScreen'
import toast from 'react-hot-toast'
import {
  Gem,
  CalendarDays,
  ShieldCheck,
  Award,
  UsersRound,
  FileBarChart,
  TrendingUp,
  FileText,
  Download,
  Flame,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { formatCurrency } from '../../utils/format'

export default function MemberDashboardBI() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reportType, setReportType] = useState('monthly')

  useEffect(() => {
    setLoading(true)
    communityApi.getMemberStats()
      .then(res => {
        setStats(res.data?.data || null)
      })
      .catch(() => {
        toast.error('Failed to load member analytics')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleExport = (format) => {
    toast.success(`Exporting ${reportType} report as ${format.toUpperCase()}...`)
  }

  if (loading || !stats) {
    return <LoadingScreen label="Loading business intelligence analytics..." />
  }

  const kpis = stats.kpis || {}
  const charts = stats.charts || {}

  // Determine color for Performance Tier
  let tierColor = 'text-amber-700 bg-amber-50 border-amber-200'
  if (kpis.performanceTier === 'Gold') tierColor = 'text-yellow-700 bg-yellow-50 border-yellow-200'
  else if (kpis.performanceTier === 'Silver') tierColor = 'text-slate-700 bg-slate-50 border-slate-200'

  return (
    <div className="space-y-6">
      {/* Performance Score & Tier Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Member Performance Scorecard</h2>
          <p className="text-sm font-semibold text-slate-500 mt-1">Based on chapter attendance, referrals, one-to-one sessions, and business generated.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className={`flex items-center gap-1.5 rounded-full px-4 py-2 border text-sm font-black uppercase ${tierColor}`}>
            <Award className="h-5 w-5" />
            {kpis.performanceTier} Tier ({kpis.performanceScore} pts)
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Membership ID" value={kpis.membershipId} icon={ShieldCheck} subtitle="Unique identification" />
        <KPICard title="Attendance" value={`${kpis.attendancePercentage} (${kpis.totalMeetingsAttended} meetings)`} icon={CalendarDays} subtitle="Participation record" />
        <KPICard title="Connects Given" value={kpis.referralsGiven} icon={Flame} subtitle="Business passed to peers" />
        <KPICard title="Business Generated" value={formatCurrency(kpis.businessGenerated)} icon={FileBarChart} subtitle="Value of closed referrals" />
        <KPICard title="Connects Received" value={kpis.referralsReceived} icon={UsersRound} subtitle="Business received" />
        <KPICard title="One-to-Ones" value={kpis.oneToOnesCompleted} icon={TrendingUp} subtitle="Peer networking sessions" />
        <KPICard title="Visitor Invites" value={kpis.visitorInvites} icon={UsersRound} subtitle="Invitations dispatched" />
        <KPICard title="Membership" value={kpis.membershipStatus} icon={CheckCircle2} subtitle="Active context state" />
      </div>

      {/* Analytics Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Connect Comparison Chart */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#0d4697]" />
            Connects Pipeline
          </h3>
          <div className="space-y-4">
            <ProgressBar label="Connects Passed" value={charts.referralsComparison?.given || 0} max={10} color="bg-blue-600" />
            <ProgressBar label="Connects Received" value={charts.referralsComparison?.received || 0} max={10} color="bg-indigo-600" />
            <ProgressBar label="Connects Converted" value={charts.referralsComparison?.converted || 0} max={10} color="bg-emerald-600" />
          </div>
        </section>

        {/* Business Growth Visual */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <FileBarChart className="h-5 w-5 text-[#0d4697]" />
            Business Value Growth (Cumulative)
          </h3>
          <div className="flex h-36 items-end gap-3 px-2 pt-4">
            {(charts.monthlyBusinessGrowth || []).map((node, index) => {
              const maxVal = Math.max(...charts.monthlyBusinessGrowth.map(n => n.value)) || 1;
              const pct = (node.value / maxVal) * 100;
              return (
                <div key={index} className="flex flex-1 flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-all cursor-pointer" style={{ height: `${pct}%` }} title={formatCurrency(node.value)} />
                  <span className="text-[10px] font-bold text-slate-400">{node.label}</span>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      {/* Reports Generator Panel */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-extrabold text-slate-900 mb-2">Performance Reports Generator</h3>
        <p className="text-sm font-semibold text-slate-500 mb-5">Export detailed attendance, network meetings, one-to-ones, and referrals breakdown reports.</p>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <select 
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-[#0d4697]"
          >
            <option value="daily">Daily Log Report</option>
            <option value="weekly">Weekly Checklist Report</option>
            <option value="monthly">Monthly Statistics Summary</option>
            <option value="quarterly">Quarterly Audits</option>
            <option value="yearly">Yearly Performance Analysis</option>
          </select>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleExport('pdf')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0d4697] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-blue-800"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
            >
              <FileText className="h-4 w-4" />
              Export Excel
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function KPICard({ title, value, icon: Icon, subtitle }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">{title}</p>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-[#0d4697]">
          <Icon className="h-4.5 w-4.5" />
        </span>
      </div>
      <p className="mt-3 text-lg font-black text-slate-800 truncate">{value}</p>
      {subtitle && <p className="mt-1 text-[10px] font-semibold text-slate-500">{subtitle}</p>}
    </article>
  )
}

function ProgressBar({ label, value, max = 10, color = 'bg-blue-600' }) {
  const percentage = Math.min((value / max) * 100, 100)
  return (
    <div>
      <div className="flex items-center justify-between text-sm font-bold text-slate-700 mb-1">
        <span>{label}</span>
        <span>{value} / {max}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
