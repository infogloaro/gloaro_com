import { useEffect, useState } from 'react'
import { adminApi } from '../../api/admin'
import { useAuth } from '../../hooks/useAuth'
import LoadingScreen from '../../components/common/LoadingScreen'
import {
  Building2,
  UsersRound,
  FileBarChart,
  CalendarDays,
  Gem,
  Award,
  Globe,
  MapPin
} from 'lucide-react'
import api from '../../api/axios'

export default function MyChapter() {
  const { user } = useAuth()
  const [chapterDetails, setChapterDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const org = user?.meta?.adminProfile?.organization || {}
    const chapterId = org.chapter
    if (!chapterId) {
      setLoading(false)
      return
    }

    setLoading(true)
    api.get(`/community/chapters/${chapterId}`)
      .then(res => {
        setChapterDetails(res.data?.data || null)
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false)
      })
  }, [user])

  if (loading) {
    return <LoadingScreen label="Loading chapter registry..." />
  }

  const org = user?.meta?.adminProfile?.organization || {}

  return (
    <div className="space-y-6">
      {/* Chapter General Header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0d4697]">My Local Chapter</p>
        <h2 className="mt-2 text-2xl font-black text-slate-900">{chapterDetails?.name || 'Chapter Name'}</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            Region: {org.assignedRegion?.name || org.region || 'Default'}
          </span>
          <span>•</span>
          <span>State: {org.assignedState?.name || org.state || 'Default'}</span>
          <span>•</span>
          <span>District: {org.assignedDistrict?.name || org.district || 'Default'}</span>
        </div>
      </section>

      {/* Chapter Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatItem title="Chapter Members" value={chapterDetails?.membersCount || 24} icon={UsersRound} />
        <StatItem title="Meetings Logged" value={chapterDetails?.meetingsCount || 16} icon={CalendarDays} />
        <StatItem title="Referrals Passed" value={chapterDetails?.metadata?.referralsCount || 78} icon={Gem} />
        <StatItem title="Revenue Created" value={chapterDetails?.businessValue || 1200000} isCurrency icon={FileBarChart} />
      </div>

      {/* Chapter Leadership */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900">Chapter Leadership & Directory</h3>
        
        <div className="grid gap-4 sm:grid-cols-3">
          <LeadershipCard title="Chapter President" name={chapterDetails?.metadata?.presidentName || 'Kishore Kumar'} contact={chapterDetails?.metadata?.presidentEmail || 'president@gloaro.com'} />
          <LeadershipCard title="Vice President" name={chapterDetails?.metadata?.vicePresidentName || 'Arun Dev'} contact={chapterDetails?.metadata?.vicePresidentEmail || 'vp@gloaro.com'} />
          <LeadershipCard title="Secretary" name={chapterDetails?.metadata?.secretaryName || 'Jane Smith'} contact={chapterDetails?.metadata?.secretaryEmail || 'secretary@gloaro.com'} />
        </div>
      </section>
    </div>
  )
}

function StatItem({ title, value, isCurrency, icon: Icon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">{title}</p>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-[#0d4697]">
          <Icon className="h-4.5 w-4.5" />
        </span>
      </div>
      <p className="mt-3 text-lg font-black text-slate-800">
        {isCurrency ? `₹${value.toLocaleString('en-IN')}` : value}
      </p>
    </div>
  )
}

function LeadershipCard({ title, name, contact }) {
  return (
    <div className="rounded-lg bg-slate-50 border border-slate-100 p-4 space-y-1">
      <p className="text-[10px] font-extrabold uppercase text-[#0d4697] tracking-wider">{title}</p>
      <p className="text-sm font-extrabold text-slate-800">{name}</p>
      <p className="text-[11px] font-semibold text-slate-400">{contact}</p>
    </div>
  )
}
