import { useEffect, useState } from 'react'
import { communityApi } from '../../api/community'
import LoadingScreen from '../../components/common/LoadingScreen'
import toast from 'react-hot-toast'
import {
  Building2,
  UsersRound,
  FileBarChart,
  CalendarDays,
  Gem,
  Award,
  TrendingUp,
  LineChart
} from 'lucide-react'
import { formatCurrency } from '../../utils/format'

export default function ChapterDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    communityApi.getChapterStats()
      .then(res => {
        setStats(res.data?.data || null)
      })
      .catch(() => {
        toast.error('Failed to load Unit Dashboard analytics')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading || !stats) {
    return <LoadingScreen label="Loading Unit Dashboard metrics..." />
  }

  const { chapterName, summary, performers, growth } = stats

  return (
    <div className="space-y-6">
      {/* Unit header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0d4697]">Unit Dashboard Context</p>
          <h2 className="mt-1 text-2xl font-black text-slate-900">{chapterName} Overview</h2>
        </div>
        <div className="shrink-0 flex items-center gap-1 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-xs font-extrabold text-[#0d4697]">
          <TrendingUp className="h-4 w-4" />
          Active Growth Sector
        </div>
      </section>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Members" value={summary.members} icon={UsersRound} />
        <KPICard title="Active Vendors" value={summary.vendors} icon={Building2} />
        <KPICard title="Attendance Rate" value={summary.attendancePct} icon={CalendarDays} />
        <KPICard title="Business Closed" value={formatCurrency(summary.revenue)} icon={FileBarChart} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Top Performers in Unit */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Award className="h-5 w-5 text-[#0d4697]" />
            Top Unit Performers (Monthly score)
          </h3>
          
          <div className="divide-y divide-slate-100">
            {performers.map((performer, idx) => (
              <div key={idx} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 font-extrabold text-slate-700 text-xs shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-sm font-extrabold text-slate-800">{performer.name}</p>
                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{performer.referrals} referrals passed</p>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-600">{formatCurrency(performer.revenue)} generated</span>
              </div>
            ))}
          </div>
        </section>

        {/* Growth Stats Side-Card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <LineChart className="h-5 w-5 text-[#0d4697]" />
            Unit Standing
          </h3>

          <div className="space-y-4 text-xs font-bold text-slate-600">
            <div className="flex justify-between items-center rounded-lg bg-slate-50 p-3">
              <span>Unit Growth Rate</span>
              <span className="text-sm font-black text-emerald-600">+{growth.growthPct}</span>
            </div>
            <div className="flex justify-between items-center rounded-lg bg-slate-50 p-3">
              <span>Member Retention Rate</span>
              <span className="text-sm font-black text-[#0d4697]">{growth.retentionRate}</span>
            </div>
            <div className="flex justify-between items-center rounded-lg bg-slate-50 p-3">
              <span>Average Meeting Score</span>
              <span className="text-sm font-black text-amber-600">{growth.meetingScore} / 100</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function KPICard({ title, value, icon: Icon }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">{title}</p>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-[#0d4697]">
          <Icon className="h-4.5 w-4.5" />
        </span>
      </div>
      <p className="mt-3 text-lg font-black text-slate-800 truncate">{value}</p>
    </article>
  )
}
