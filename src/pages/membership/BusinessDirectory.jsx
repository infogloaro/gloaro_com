import { useEffect, useState } from 'react'
import { communityApi } from '../../api/community'
import LoadingScreen from '../../components/common/LoadingScreen'
import toast from 'react-hot-toast'
import {
  Search,
  Building2,
  UsersRound,
  Mail,
  Phone,
  MessageSquare,
  Globe,
  Star,
  Award,
  Filter
} from 'lucide-react'

export default function BusinessDirectory() {
  const [directory, setDirectory] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedChapter, setSelectedChapter] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  const fetchDirectory = (params = {}) => {
    setLoading(true)
    communityApi.getDirectory(params)
      .then(res => {
        const data = res.data?.data || []
        setDirectory(data)
        setFiltered(data)
      })
      .catch(() => {
        toast.error('Failed to load business directory')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchDirectory()
  }, [])

  const handleSearchChange = (val) => {
    setSearchQuery(val)
    applyFilters(val, selectedCategory, selectedChapter, selectedStatus)
  }

  const handleFilterChange = (cat, ch, st) => {
    setSelectedCategory(cat)
    setSelectedChapter(ch)
    setSelectedStatus(st)
    applyFilters(searchQuery, cat, ch, st)
  }

  const applyFilters = (query, cat, ch, st) => {
    let result = [...directory]
    
    if (query) {
      const q = query.toLowerCase()
      result = result.filter(item => 
        item.name?.toLowerCase().includes(q) || 
        item.businessName?.toLowerCase().includes(q) || 
        item.email?.toLowerCase().includes(q)
      )
    }

    if (cat) {
      result = result.filter(item => item.category === cat)
    }

    if (ch) {
      result = result.filter(item => item.chapterName === ch)
    }

    if (st) {
      result = result.filter(item => item.status === st)
    }

    setFiltered(result)
  }

  if (loading) {
    return <LoadingScreen label="Loading business directory..." />
  }

  // Extract unique filter fields
  const categories = [...new Set(directory.map(i => i.category))].filter(Boolean)
  const chapters = [...new Set(directory.map(i => i.chapterName))].filter(Boolean)

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search members, vendors, company names, emails..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center text-xs font-bold text-slate-600">
          <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
            <Filter className="h-4 w-4" />
            <span>Filters:</span>
          </div>

          <select 
            value={selectedCategory}
            onChange={(e) => handleFilterChange(e.target.value, selectedChapter, selectedStatus)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-[#0d4697]"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select 
            value={selectedChapter}
            onChange={(e) => handleFilterChange(selectedCategory, e.target.value, selectedStatus)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-[#0d4697]"
          >
            <option value="">All Chapters</option>
            {chapters.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select 
            value={selectedStatus}
            onChange={(e) => handleFilterChange(selectedCategory, selectedChapter, e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-[#0d4697]"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </section>

      {/* Directory cards list */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <article key={item._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 relative group hover:border-[#0d4697]/50 transition">
            {/* Header */}
            <div className="flex items-center gap-3">
              <span className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[#0d4697] text-lg border border-slate-200 shrink-0">
                {item.name?.charAt(0) || 'M'}
              </span>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 leading-tight">{item.name}</h4>
                <p className="text-[10px] font-semibold text-slate-400 capitalize mt-0.5">{item.role?.replace('_', ' ')}</p>
                <p className="text-[11px] font-extrabold text-[#0d4697] mt-1">{item.businessName}</p>
              </div>
            </div>

            {/* Performance scores */}
            <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-100 text-center">
              <div>
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Rating</p>
                <p className="text-xs font-black text-slate-800 flex items-center justify-center gap-0.5 mt-0.5">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 shrink-0" />
                  {item.rating}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Referral</p>
                <p className="text-xs font-black text-emerald-600 mt-0.5">{item.referralScore}%</p>
              </div>
              <div>
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Meetings</p>
                <p className="text-xs font-black text-[#0d4697] mt-0.5">{item.meetingScore}%</p>
              </div>
            </div>

            {/* Contact details */}
            <div className="space-y-2 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Chapter: {item.chapterName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="truncate">{item.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{item.phone || '-'}</span>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <a 
                href={`mailto:${item.email}`}
                className="flex-1 text-center py-1.5 rounded-lg bg-blue-50 text-xs font-extrabold text-[#0d4697] hover:bg-blue-100"
              >
                Send Email
              </a>
              {item.phone && (
                <a 
                  href={`https://wa.me/${item.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-1.5 rounded-lg bg-emerald-50 text-xs font-extrabold text-emerald-700 hover:bg-emerald-100"
                >
                  WhatsApp
                </a>
              )}
            </div>
          </article>
        ))}
        {!filtered.length && (
          <p className="text-sm font-semibold text-slate-500 text-center py-10 md:col-span-2 lg:col-span-3">No matching profiles found in Directory.</p>
        )}
      </div>
    </div>
  )
}
