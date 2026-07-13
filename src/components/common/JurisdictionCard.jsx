import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Shield, MapPin, BadgeCheck, Calendar, User } from 'lucide-react'
import api from '../../api/axios'

export default function JurisdictionCard() {
  const { user } = useAuth()

  if (!user) return null

  // Safely extract hierarchy
  const org = user.organization || user.meta?.organization || user.meta?.adminProfile?.organization || {}
  const region = org.assignedRegion?.name || org.region?.name || org.region || ''
  const state = org.assignedState?.name || org.state?.name || org.state || ''
  const district = org.assignedDistrict?.name || org.district?.name || org.district || ''
  const chapter = org.assignedChapter?.name || org.chapter?.name || org.chapter || ''

  const [chapterDetails, setChapterDetails] = useState(null)

  useEffect(() => {
    const chapterId = org.chapter?._id || org.chapter
    if (!chapterId) return

    api.get(`/community/chapters/${chapterId}`)
      .then(res => {
        setChapterDetails(res.data?.data || null)
      })
      .catch(() => {})
  }, [user])
  
  // Vendor specific business location
  const bizLocation = user.vendorProfile?.businessLocation || org.businessLocation || ''

  const isGlobal = user.role === 'superadmin' || user.role === 'admin' || (!region && !state && !district && !chapter)

  const formattedRole = String(user.role || 'User')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())

  const memberId = user.officialId || user.memberId || user.memberIdGenerator || user._id

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in duration-300">
      <div className="space-y-4 flex-1">
        {/* Title */}
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#0d4697]" />
          <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">My Organization & Jurisdiction</h3>
        </div>

        {/* Hierarchy List */}
        {isGlobal ? (
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg w-fit">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <span>Global access - All territories authorized</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 items-center">
            {region && (
              <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-[#0d4697]" />
                Region: {region}
              </span>
            )}
            {state && (
              <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-1">
                State: {state}
              </span>
            )}
            {district && (
              <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-1">
                District: {district}
              </span>
            )}
            {chapter && (
              <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-1">
                Chapter: {chapter}
              </span>
            )}
            {bizLocation && (
              <span className="text-xs font-extrabold text-slate-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg flex items-center gap-1">
                Location: {bizLocation}
              </span>
            )}
          </div>
        )}

        {chapterDetails && (
          <div className="mt-3 grid grid-cols-1 gap-2 text-xs font-semibold text-slate-500 sm:grid-cols-3 border-t border-slate-100 pt-3">
            <div>👑 President: {chapterDetails.metadata?.presidentName || 'Kishore Kumar'}</div>
            <div>⚡ Vice President: {chapterDetails.metadata?.vicePresidentName || 'Arun Dev'}</div>
            <div>📋 Secretary: {chapterDetails.metadata?.secretaryName || 'Meena S.'}</div>
          </div>
        )}
      </div>

      {/* Meta Profile Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:flex items-center gap-4 text-left border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
            <User className="h-3 w-3" /> Role
          </span>
          <p className="text-xs font-bold text-slate-800">{formattedRole}</p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
            Official ID
          </span>
          <p className="text-xs font-bold text-slate-800 font-mono truncate max-w-[120px]" title={memberId}>
            {memberId}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
            <BadgeCheck className="h-3 w-3" /> Status
          </span>
          <span className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
            user.isActive || user.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {user.isActive || user.status === 'active' ? 'Active' : 'Inactive'}
          </span>
        </div>

        {user.createdAt && (
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Joined
            </span>
            <p className="text-xs font-bold text-slate-800">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
