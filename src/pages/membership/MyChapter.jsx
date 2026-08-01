import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '../../hooks/useAuth'
import LoadingScreen from '../../components/common/LoadingScreen'
import {
  Building2,
  UsersRound,
  MapPin,
  Shield,
  Layers
} from 'lucide-react'
import api from '../../api/axios'
import { ROLES } from '../../constants/roleConfig.js'

export default function MyChapter() {
  const { user } = useAuth()
  const [hierarchy, setHierarchy] = useState([])
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Resolve scope based on user role
  const scopeInfo = useMemo(() => {
    if (!user?.role) return null

    const org = user?.meta?.adminProfile?.organization || {}
    const role = user.role

    if (role === ROLES.REGION_DIRECTOR) {
      return {
        type: 'region',
        id: org.region || org.assignedRegion?._id,
        title: 'My Region',
      }
    }
    if (role === ROLES.STATE_DIRECTOR) {
      return {
        type: 'state',
        id: org.state || org.assignedState?._id,
        title: 'My State',
      }
    }
    if (role === ROLES.DISTRICT_DIRECTOR) {
      return {
        type: 'district',
        id: org.district || org.assignedDistrict?._id,
        title: 'My District',
      }
    }
    
    // Chapter-level roles
    return {
      type: 'chapter',
      id: org.chapter || org.assignedChapter?._id,
      title: 'My Chapter',
    }
  }, [user])

  useEffect(() => {
    if (!scopeInfo?.id) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    // Load both full hierarchy for counters and specific details for the assigned scope entity
    Promise.all([
      api.get('/directory/organization-hierarchy'),
      api.get('/directory/scope-overview').catch(() => ({ data: { data: null } }))
    ])
      .then(([hierarchyRes, overviewRes]) => {
        setHierarchy(hierarchyRes.data?.data || [])
        setOverview(overviewRes.data?.data || null)
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to retrieve organization hierarchy.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [scopeInfo])

  if (loading) {
    return <LoadingScreen label="Loading organization overview..." />
  }

  if (!scopeInfo?.id) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-center p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <Building2 className="h-12 w-12 text-slate-300" />
        <h3 className="mt-4 text-lg font-black text-slate-800">Organization assignment not available</h3>
        <p className="mt-2 text-sm text-slate-405">Please contact your administrator to assign your location context.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-center p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <h3 className="text-lg font-black text-red-650">Error Loading Details</h3>
        <p className="mt-2 text-sm text-slate-500">{error}</p>
      </div>
    )
  }

  // Find own entity record in hierarchy for meta info
  const entityDetails = hierarchy.find((item) => item._id === scopeInfo.id)
  const org = user?.meta?.adminProfile?.organization || {}

  // Compute location path variables
  const locationPath = (() => {
    const parts = []
    if (scopeInfo.type === 'chapter') {
      parts.push(`Region: ${org.assignedRegion?.name || org.region || 'N/A'}`)
      parts.push(`State: ${org.assignedState?.name || org.state || 'N/A'}`)
      parts.push(`District: ${org.assignedDistrict?.name || org.district || 'N/A'}`)
    } else if (scopeInfo.type === 'district') {
      parts.push(`Region: ${org.assignedRegion?.name || org.region || 'N/A'}`)
      parts.push(`State: ${org.assignedState?.name || org.state || 'N/A'}`)
    } else if (scopeInfo.type === 'state') {
      parts.push(`Region: ${org.assignedRegion?.name || org.region || 'N/A'}`)
    }
    return parts.join(' • ')
  })()

  // Calculate descendant counts based on current scope
  const stats = (() => {
    if (scopeInfo.type === 'region') {
      const states = hierarchy.filter((r) => r.type === 'state' && r.parent === scopeInfo.id)
      const stateIds = states.map((s) => s._id)
      const districts = hierarchy.filter((r) => r.type === 'district' && stateIds.includes(r.parent))
      const districtIds = districts.map((d) => d._id)
      const chapters = hierarchy.filter((r) => r.type === 'chapter' && districtIds.includes(r.parent))
      return {
        states: states.length,
        districts: districts.length,
        chapters: chapters.length,
        members: overview?.activeMembers ?? 'Unavailable',
      }
    }

    if (scopeInfo.type === 'state') {
      const districts = hierarchy.filter((r) => r.type === 'district' && r.parent === scopeInfo.id)
      const districtIds = districts.map((d) => d._id)
      const chapters = hierarchy.filter((r) => r.type === 'chapter' && districtIds.includes(r.parent))
      return {
        districts: districts.length,
        chapters: chapters.length,
        members: overview?.activeMembers ?? 'Unavailable',
      }
    }

    if (scopeInfo.type === 'district') {
      const chapters = hierarchy.filter((r) => r.type === 'chapter' && r.parent === scopeInfo.id)
      return {
        chapters: chapters.length,
        members: overview?.activeMembers ?? 'Unavailable',
      }
    }

    // Chapter scope
    return {
      members: overview?.activeMembers ?? 'Unavailable',
    }
  })()

  return (
    <div className="space-y-6">
      {/* Scope Header Card */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0d4697]">{scopeInfo.title}</p>
        <h2 className="mt-2 text-2xl font-black text-slate-900">{entityDetails?.name || 'Assigned Location'}</h2>
        {locationPath && (
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {locationPath}
            </span>
          </div>
        )}
      </section>

      {/* Aggregate Counts Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.states !== undefined && (
          <StatItem title="States" value={stats.states} icon={Layers} />
        )}
        {stats.districts !== undefined && (
          <StatItem title="Districts" value={stats.districts} icon={Shield} />
        )}
        {stats.chapters !== undefined && (
          <StatItem title="Chapters" value={stats.chapters} icon={Building2} />
        )}
        <StatItem title="Active Members" value={stats.members} icon={UsersRound} />
      </div>

      {/* Chapter Leadership (Only for Chapter-level roles) */}
      {scopeInfo.type === 'chapter' && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">Chapter Leadership & Directory</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <LeadershipCard
              title="Chapter President"
              name={overview?.leadership?.president?.name}
            />
            <LeadershipCard
              title="Vice President"
              name={overview?.leadership?.vicePresident?.name}
            />
            <LeadershipCard
              title="Secretary"
              name={overview?.leadership?.secretary?.name}
            />
          </div>
        </section>
      )}
    </div>
  )
}

function StatItem({ title, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">{title}</p>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-[#0d4697]">
          <Icon className="h-4.5 w-4.5" />
        </span>
      </div>
      <p className="mt-3 text-lg font-black text-slate-800">{value}</p>
    </div>
  )
}

function LeadershipCard({ title, name, contact }) {
  if (!name && !contact) {
    return (
      <div className="rounded-lg bg-slate-50 border border-slate-100 p-4 space-y-1">
        <p className="text-[10px] font-extrabold uppercase text-[#0d4697] tracking-wider">{title}</p>
        <p className="text-xs font-semibold text-slate-450">Not assigned</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-slate-50 border border-slate-100 p-4 space-y-1">
      <p className="text-[10px] font-extrabold uppercase text-[#0d4697] tracking-wider">{title}</p>
      <p className="text-sm font-extrabold text-slate-800">{name || 'Not assigned'}</p>
      <p className="text-[11px] font-semibold text-slate-400">{contact || ''}</p>
    </div>
  )
}
