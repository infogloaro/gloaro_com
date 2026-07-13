import { useEffect, useState } from 'react'
import { communityApi } from '../../api/community'
import LoadingScreen from '../../components/common/LoadingScreen'
import toast from 'react-hot-toast'
import {
  Award,
  TrendingUp,
  CalendarDays,
  User,
  Building,
  Trophy,
  Percent,
  TrendingDown
} from 'lucide-react'
import { formatCurrency } from '../../utils/format'

export default function Leaderboard() {
  const [board, setBoard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState('monthly')

  useEffect(() => {
    setLoading(true)
    communityApi.getLeaderboards()
      .then(res => {
        setBoard(res.data?.data || null)
      })
      .catch(() => {
        toast.error('Failed to load Leaderboard registry')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [timeFilter])

  if (loading || !board) {
    return <LoadingScreen label="Loading Leaderboards..." />
  }

  const { topMembers = [], topChapters = [] } = board

  return (
    <div className="space-y-6">
      {/* Time filter header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Leaderboard Rankings</h2>
          <p className="text-sm font-semibold text-slate-500 mt-1 font-sans">Discover top-performing members driven by dynamic referral conversions.</p>
        </div>

        <select 
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-extrabold text-slate-700 outline-none focus:border-[#0d4697]"
        >
          <option value="daily">Daily Standings</option>
          <option value="weekly">Weekly Standings</option>
          <option value="monthly">Monthly Standings</option>
          <option value="quarterly">Quarterly Standings</option>
          <option value="yearly">Yearly Standings</option>
        </select>
      </section>

      {/* Main rankings grid */}
      <div className="space-y-6">
        {/* Top Members BNI Board Table */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <h3 className="text-base font-extrabold text-slate-900">Top Performing Members (Referrals & Business Value)</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4 text-center">Referrals Passed</th>
                  <th className="py-3 px-4 text-center">Converted</th>
                  <th className="py-3 px-4 text-right">Business Generated</th>
                  <th className="py-3 px-4 text-center">Conversion %</th>
                  <th className="py-3 px-4 text-center">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {topMembers.map((member, idx) => {
                  const isTop3 = idx < 3
                  const rankColors = [
                    'bg-yellow-500 text-white',
                    'bg-slate-300 text-slate-800',
                    'bg-amber-600 text-white'
                  ]
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-4">
                        <span className={`grid h-6 w-6 place-items-center rounded-full font-black text-[10px] ${
                          isTop3 ? rankColors[idx] : 'bg-slate-100 text-slate-500'
                        }`}>
                          #{idx + 1}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-extrabold text-slate-900">{member.name}</td>
                      <td className="py-4 px-4 text-center font-bold text-slate-600">{member.referrals}</td>
                      <td className="py-4 px-4 text-center font-bold text-emerald-600">{member.converted}</td>
                      <td className="py-4 px-4 text-right font-black text-slate-900">
                        {formatCurrency(member.businessValue)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2.5 py-1 text-[11px] font-extrabold text-[#0d4697]">
                          {member.conversionRate || member.conversionPercentage || 0}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-extrabold text-amber-600">{member.score} pts</span>
                      </td>
                    </tr>
                  )
                })}
                {!topMembers.length && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-semibold">
                      No rank data available yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Top Chapters Board */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Building className="h-5 w-5 text-[#0d4697]" />
            <h3 className="text-base font-extrabold text-slate-900">Top Performing Chapters</h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {topChapters.map((chapter, idx) => (
              <div key={idx} className="flex justify-between items-center rounded-xl bg-slate-50 border border-slate-100 p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-200 text-slate-700 font-black text-xs shrink-0">
                    #{idx + 1}
                  </span>
                  <div>
                    <p className="text-sm font-extrabold text-slate-800">{chapter.name}</p>
                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{chapter.members} members active</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 rounded bg-blue-50 border border-blue-100 px-2 py-0.5 text-[10px] font-extrabold text-[#0d4697]">
                    Score: {chapter.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
