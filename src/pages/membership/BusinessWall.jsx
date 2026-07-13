import { useEffect, useState } from 'react'
import { communityApi } from '../../api/community'
import LoadingScreen from '../../components/common/LoadingScreen'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import {
  Heart,
  MessageSquare,
  Share2,
  FileText,
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Check,
  Building,
  User,
  Users,
  Award,
  Sparkles,
  Zap,
  Megaphone,
  Briefcase,
  AlertCircle
} from 'lucide-react'
import { formatDate, formatCurrency } from '../../utils/format'

const postTypesList = [
  { key: 'business_requirement', label: 'Business Requirement', color: 'bg-red-50 text-red-700 border-red-150' },
  { key: 'business_opportunity', label: 'Business Opportunity', color: 'bg-emerald-50 text-emerald-700 border-emerald-150' },
  { key: 'success_story', label: 'Success Story', color: 'bg-blue-50 text-blue-700 border-blue-150' },
  { key: 'achievement', label: 'Achievement', color: 'bg-amber-50 text-amber-700 border-amber-150' },
  { key: 'announcement', label: 'Announcement', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { key: 'visitor', label: 'Visitor Invitation', color: 'bg-purple-50 text-purple-700 border-purple-150' }
]

const filterTabs = [
  { key: 'all', label: 'All' },
  { key: 'business_requirement', label: 'Requirements' },
  { key: 'business_opportunity', label: 'Opportunities' },
  { key: 'announcement', label: 'Announcements' },
  { key: 'achievement', label: 'Achievements' },
  { key: 'visitor', label: 'Visitors' },
  { key: 'success_story', label: 'Success Stories' },
  { key: 'event', label: 'Meetings' }
]

export default function BusinessWall() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  // Post Creator State
  const [content, setContent] = useState('')
  const [type, setType] = useState('business_requirement')
  const [visibility, setVisibility] = useState('chapter')
  const [publishing, setPublishing] = useState(false)

  // Extra metadata fields based on selected post type
  const [industry, setIndustry] = useState('')
  const [location, setLocation] = useState('')
  const [expectedTimeline, setExpectedTimeline] = useState('')
  const [budget, setBudget] = useState('')
  const [thankYouName, setThankYouName] = useState('')

  // Interactions lists
  const [interestList, setInterestList] = useState({})
  const [appreciationList, setAppreciationList] = useState({})
  const [rsvpList, setRsvpList] = useState({})

  const fetchFeed = () => {
    communityApi.getPosts()
      .then(res => {
        setPosts(res.data?.data || [])
      })
      .catch(() => {
        toast.error('Unable to fetch Business Wall feed')
      })
  }

  useEffect(() => {
    setLoading(true)
    communityApi.getPosts()
      .then((res) => {
        setPosts(res.data?.data || [])
      })
      .catch(() => {
        toast.error('Unable to load Business Wall feed')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleCreatePost = (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setPublishing(true)

    // Build rich business details content based on post type
    let richContent = content
    if (type === 'business_requirement') {
      richContent = `**BUSINESS REQUIREMENT**\n\n${content}\n\n*   **Industry:** ${industry || 'Manufacturing'}\n*   **Location:** ${location || 'Chennai'}\n*   **Expected Timeline:** ${expectedTimeline || 'Within 7 Days'}`
    } else if (type === 'success_story') {
      richContent = `**SUCCESS STORY**\n\n${content}\n\n*   **Referral Thank You:** Special thanks to ${thankYouName || 'Arun Kumar'} for the referral.`
    } else if (type === 'business_opportunity') {
      richContent = `**BUSINESS OPPORTUNITY**\n\n${content}\n\n*   **Location:** ${location || 'Coimbatore'}\n*   **Budget:** ${budget ? formatCurrency(Number(budget)) : '₹2,00,000'}`
    }

    const payload = {
      content: richContent,
      type,
      visibility
    }

    communityApi.createPost(payload)
      .then(() => {
        toast.success('Post published to Chapter feed!')
        setContent('')
        setIndustry('')
        setLocation('')
        setExpectedTimeline('')
        setBudget('')
        setThankYouName('')
        fetchFeed()
      })
      .catch(() => {
        toast.error('Failed to publish post')
      })
      .finally(() => {
        setPublishing(false)
      })
  }

  const handleLike = (id) => {
    communityApi.likePost(id)
      .then(() => {
        fetchFeed()
      })
      .catch(() => {})
  }

  const handleInterest = (id) => {
    setInterestList(prev => {
      const isInterested = !prev[id]
      if (isInterested) {
        toast.success('Logged interest in opportunity!')
      }
      return { ...prev, [id]: isInterested }
    })
  }

  const handleAppreciate = (id) => {
    setAppreciationList(prev => {
      const isAppreciated = !prev[id]
      if (isAppreciated) {
        toast.success('Sent congratulations appreciation!')
      }
      return { ...prev, [id]: isAppreciated }
    })
  }

  const renderRequirementCard = (post) => {
    const lines = post.content.split('\n')
    const coreText = lines.filter(l => !l.startsWith('*') && !l.startsWith('**') && !l.includes('BUSINESS REQUIREMENT')).join('\n').trim()
    const industryMatch = post.content.match(/\*\*Industry:\*\*\s*(.*)/i)
    const locationMatch = post.content.match(/\*\*Location:\*\*\s*(.*)/i)
    const timelineMatch = post.content.match(/\*\*Expected Timeline:\*\*\s*(.*)/i)
    
    return (
      <div className="space-y-3 bg-red-50/20 border border-red-100 p-4 rounded-xl">
        <p className="text-sm font-black text-slate-800">{coreText || 'Need GST Consultant'}</p>
        <div className="grid grid-cols-3 gap-2 text-xs border-t border-red-100/50 pt-2.5">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Industry</p>
            <p className="font-extrabold text-slate-700">{industryMatch ? industryMatch[1] : 'Manufacturing'}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Location</p>
            <p className="font-extrabold text-slate-700">{locationMatch ? locationMatch[1] : 'Chennai'}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Timeline</p>
            <p className="font-extrabold text-slate-700">{timelineMatch ? timelineMatch[1] : 'Within 7 Days'}</p>
          </div>
        </div>
        <p className="text-[10px] font-bold text-[#0d4697] mt-1">Interested members please contact me.</p>
      </div>
    )
  }

  const renderSuccessStoryCard = (post) => {
    const lines = post.content.split('\n')
    const coreText = lines.filter(l => !l.startsWith('*') && !l.startsWith('**') && !l.includes('SUCCESS STORY')).join('\n').trim()
    const thankYouMatch = post.content.match(/\*\*Referral Thank You:\*\*\s*(.*)/i)
    return (
      <div className="space-y-3 bg-blue-50/20 border border-blue-100 p-4 rounded-xl">
        <p className="text-sm font-black text-slate-800">{coreText || 'Successfully completed project worth ₹2,50,000 through Gloaro Referral.'}</p>
        <div className="border-t border-blue-150 pt-2.5 text-xs font-bold text-[#0d4697]">
          👏 Referral Thank You: <span className="font-black text-slate-800">{thankYouMatch ? thankYouMatch[1] : 'Arun Kumar'}</span>
        </div>
      </div>
    )
  }

  const renderOpportunityCard = (post) => {
    const lines = post.content.split('\n')
    const coreText = lines.filter(l => !l.startsWith('*') && !l.startsWith('**') && !l.includes('BUSINESS OPPORTUNITY')).join('\n').trim()
    const locationMatch = post.content.match(/\*\*Location:\*\*\s*(.*)/i)
    const budgetMatch = post.content.match(/\*\*Budget:\*\*\s*(.*)/i)
    return (
      <div className="space-y-3 bg-emerald-50/20 border border-emerald-100 p-4 rounded-xl">
        <p className="text-sm font-black text-slate-800">{coreText || 'New business opportunity available.'}</p>
        <div className="grid grid-cols-2 gap-2 text-xs border-t border-emerald-100/50 pt-2.5">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Location</p>
            <p className="font-extrabold text-slate-700">{locationMatch ? locationMatch[1] : 'Coimbatore'}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Budget</p>
            <p className="font-extrabold text-emerald-700">{budgetMatch ? budgetMatch[1] : '₹2,00,000'}</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return <LoadingScreen label="Loading BNI-style Business Wall..." />
  }

  const filteredPosts = posts.filter(post => {
    if (activeFilter === 'all') return true
    return post.type === activeFilter
  })

  return (
    <div className="space-y-6">
      {/* 1. Community Hero banner */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d4697] to-[#093574] p-7 text-white shadow-sm border border-blue-900">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#ffbf1a]">
            GLOARO BUSINESS NETWORK
          </p>
          <h1 className="mt-2 text-3xl font-black font-sans tracking-tight">
            Business Wall
          </h1>
          <p className="text-sm font-semibold text-[#ffbf1a] mt-1 italic tracking-wide">
            Connect • Collaborate • Grow Together
          </p>
          <p className="mt-3 max-w-2xl text-xs font-semibold text-blue-100 leading-relaxed">
            Share opportunities, referrals, achievements and announcements with your chapter.
          </p>
        </div>
      </div>

      {/* 2. Today's Chapter Activity widget ribbon */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3.5 border-b border-slate-100 pb-2">
          Today's Activity
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-100 text-center">
            <p className="text-[9px] font-black uppercase text-slate-400">Opportunities</p>
            <p className="text-xl font-black text-slate-800 mt-1">12</p>
          </div>
          <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-100 text-center">
            <p className="text-[9px] font-black uppercase text-slate-400">Referral Requests</p>
            <p className="text-xl font-black text-slate-800 mt-1">8</p>
          </div>
          <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-100 text-center">
            <p className="text-[9px] font-black uppercase text-slate-400">Visitors</p>
            <p className="text-xl font-black text-slate-800 mt-1">5</p>
          </div>
          <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-100 text-center">
            <p className="text-[9px] font-black uppercase text-slate-400 font-bold">Upcoming Meeting</p>
            <p className="text-xs font-black text-[#0d4697] mt-2">Tomorrow</p>
          </div>
          <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-100 text-center">
            <p className="text-[9px] font-black uppercase text-slate-400 font-bold">New Members</p>
            <p className="text-xl font-black text-emerald-600 mt-1">3</p>
          </div>
        </div>
      </section>

      {/* 3. Main layout Grid */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        
        {/* Left column (70%) */}
        <div className="space-y-6">
          
          {/* Create Post */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-[#0d4697] border-b border-slate-100 pb-2">
              Create Post
            </h3>
            
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black text-slate-500 mb-1">What's happening today?</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your update..."
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#0d4697]"
                  required
                />
              </div>

              {/* Simplified selectors */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Post Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-extrabold text-slate-600 bg-slate-50 outline-none"
                  >
                    {postTypesList.map(t => (
                      <option key={t.key} value={t.key}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Visibility</label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-extrabold text-slate-600 bg-slate-50 outline-none"
                  >
                    <option value="chapter">Chapter</option>
                    <option value="district">District</option>
                    <option value="state">State</option>
                    <option value="global">Global</option>
                  </select>
                </div>
              </div>

              {/* Dynamic contextual fields */}
              {type === 'business_requirement' && (
                <div className="grid gap-3 sm:grid-cols-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Industry</label>
                    <input
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="e.g. Manufacturing"
                      className="w-full rounded border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700 outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Chennai"
                      className="w-full rounded border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700 outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Timeline</label>
                    <input
                      type="text"
                      value={expectedTimeline}
                      onChange={(e) => setExpectedTimeline(e.target.value)}
                      placeholder="e.g. Within 7 Days"
                      className="w-full rounded border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700 outline-none bg-white"
                    />
                  </div>
                </div>
              )}

              {type === 'success_story' && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Referred Member (Thank You Name)</label>
                  <input
                    type="text"
                    value={thankYouName}
                    onChange={(e) => setThankYouName(e.target.value)}
                    placeholder="e.g. Arun Kumar"
                    className="w-full rounded border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700 outline-none bg-white"
                  />
                </div>
              )}

              {type === 'business_opportunity' && (
                <div className="grid gap-3 sm:grid-cols-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Location Required</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Coimbatore"
                      className="w-full rounded border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700 outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Budget (INR)</label>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="e.g. 200000"
                      className="w-full rounded border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700 outline-none bg-white"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={publishing}
                  className="rounded bg-[#0d4697] px-6 py-1.5 text-xs font-extrabold text-white hover:bg-blue-800 transition disabled:opacity-60"
                >
                  {publishing ? 'Publishing...' : 'Publish'}
                </button>
              </div>
            </form>
          </section>

          {/* Filters */}
          <section className="overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-[550px]">
              {filterTabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveFilter(t.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition ${
                    activeFilter === t.key
                      ? 'bg-[#0d4697] text-white border-[#0d4697]'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </section>

          {/* Feed list */}
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const isLiked = post.likes?.includes(user?._id)
              const typeConfig = postTypesList.find(t => t.key === post.type) || postTypesList[4]
              const isReq = post.type === 'business_requirement'
              const isOpp = post.type === 'business_opportunity'
              const isSuccess = post.type === 'success_story'

              return (
                <article key={post._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  {/* Rich Author details header */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-[#0d4697] font-extrabold text-xs">
                        {post.author?.name?.charAt(0) || 'M'}
                      </span>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 leading-tight">{post.author?.name || 'Meena'}</h4>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                          {post.author?.role === 'vendor' ? 'Approved Vendor' : 'Secretary • Sultanpur Chapter'} • {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </div>

                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${typeConfig.color}`}>
                      {typeConfig.label}
                    </span>
                  </div>

                  {/* Rich feed card body */}
                  <div className="space-y-2">
                    {isReq && renderRequirementCard(post)}
                    {isSuccess && renderSuccessStoryCard(post)}
                    {isOpp && renderOpportunityCard(post)}
                    {!isReq && !isSuccess && !isOpp && (
                      <p className="text-xs font-semibold text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                      </p>
                    )}
                  </div>

                  {/* Recommendations engagement bar */}
                  <div className="flex justify-between items-center border-t border-slate-100 pt-3 text-[11px] font-extrabold text-slate-500">
                    <button 
                      onClick={() => handleLike(post._id)} 
                      className={`flex items-center gap-1.5 transition ${isLiked ? 'text-red-500' : 'hover:text-slate-800'}`}
                    >
                      👍 Recommend ({post.likes?.length || 0})
                    </button>

                    <button 
                      onClick={() => handleInterest(post._id)}
                      className="flex items-center gap-1.5 transition hover:text-slate-800"
                    >
                      🤝 Interested
                    </button>

                    <span className="flex items-center gap-1.5">
                      💬 Comment ({post.comments?.length || 0})
                    </span>

                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href)
                        toast.success('Opportunity link copied!')
                      }}
                      className="flex items-center gap-1.5 transition hover:text-slate-800"
                    >
                      📤 Share
                    </button>

                    <button 
                      onClick={() => handleAppreciate(post._id)}
                      className="flex items-center gap-1.5 transition hover:text-slate-800"
                    >
                      ⭐ Appreciate
                    </button>
                  </div>
                </article>
              )
            })}
            {!filteredPosts.length && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-400 font-semibold">
                No feed posts match this category filter.
              </div>
            )}
          </div>

        </div>

        {/* Right sidebar (30%) */}
        <div className="space-y-6">
          
          {/* 1. Upcoming Meeting */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Upcoming Meeting</h4>
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5 space-y-1">
              <p className="text-xs font-extrabold text-slate-800">Weekly Chapter Meeting</p>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">Tomorrow • 7 PM</p>
              <p className="text-[10px] font-semibold text-slate-500">Venue: Business Hall</p>
            </div>
          </section>

          {/* 2. Today's Visitors */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Today's Visitors</h4>
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5 space-y-1">
              <p className="text-xs font-extrabold text-slate-800">Rajesh</p>
              <p className="text-[10px] font-bold text-slate-400">Software Company</p>
              <p className="text-[10px] font-semibold text-slate-500 mt-1">Invited By: Arun Kumar</p>
            </div>
          </section>

          {/* 3. Chapter Announcement Widget */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 bg-[#0d4697]/5 border-blue-100">
            <h4 className="text-xs font-black text-[#0d4697] uppercase tracking-wider flex items-center gap-1.5">
              📢 Chapter Announcement
            </h4>
            <div className="space-y-1.5 text-xs">
              <p className="font-extrabold text-slate-800">Business Meeting</p>
              <p className="text-[10px] font-bold text-slate-500">Saturday • 7 PM</p>
              <p className="text-[10px] font-extrabold text-emerald-700">Dress Code: Business Formal</p>
            </div>
          </section>

          {/* 4. Top Networkers */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Top Networkers</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-slate-800">🥇 Arun Kumar</span>
                <span className="text-[10px] font-bold text-slate-400">32 Referrals</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-slate-800">🥈 Meena</span>
                <span className="text-[10px] font-bold text-slate-400">27 Referrals</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-slate-800">🥉 Kishore</span>
                <span className="text-[10px] font-bold text-slate-400">24 Referrals</span>
              </div>
            </div>
          </section>

          {/* 5. Recent Success Stories */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Recent Success Stories</h4>
            <div className="space-y-3 divide-y divide-slate-100">
              <div className="pt-2 first:pt-0">
                <p className="text-xs font-extrabold text-slate-800">Meena</p>
                <p className="text-[10px] font-bold text-emerald-600 mt-0.5">Closed: {formatCurrency(250000)}</p>
                <p className="text-[10px] font-semibold text-slate-400">through Gloaro Referral</p>
              </div>
              <div className="pt-3">
                <p className="text-xs font-extrabold text-slate-800">Arun</p>
                <p className="text-[10px] font-bold text-[#0d4697] mt-0.5">Generated: {formatCurrency(480000)}</p>
                <p className="text-[10px] font-semibold text-slate-400">Business Referral</p>
              </div>
            </div>
          </section>

          {/* 6. Birthdays */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Birthdays</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Today:</span>
                <span className="font-extrabold text-slate-800">🎂 Kishore Kumar</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tomorrow:</span>
                <span className="font-extrabold text-slate-800">🎂 Meena</span>
              </div>
            </div>
          </section>

          {/* 7. Quick Actions */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Quick Actions</h4>
            <div className="grid gap-2">
              <button
                onClick={() => { setType('business_requirement'); toast.success('Form set to Requirement!') }}
                className="w-full text-left bg-slate-50 hover:bg-slate-100 p-2.5 rounded text-xs font-extrabold text-slate-700 transition border border-slate-150"
              >
                + Post Requirement
              </button>
              <button
                onClick={() => { setType('success_story'); toast.success('Form set to Success Story!') }}
                className="w-full text-left bg-slate-50 hover:bg-slate-100 p-2.5 rounded text-xs font-extrabold text-slate-700 transition border border-slate-150"
              >
                + Share Success Story
              </button>
              <button
                onClick={() => toast.success('Navigate to Chapter -> Visitors tab to invite!')}
                className="w-full text-left bg-slate-50 hover:bg-slate-100 p-2.5 rounded text-xs font-extrabold text-slate-700 transition border border-slate-150"
              >
                + Invite Visitor
              </button>
              <button
                onClick={() => toast.success('Navigate to Chapter -> Visitors tab to register!')}
                className="w-full text-left bg-slate-50 hover:bg-slate-100 p-2.5 rounded text-xs font-extrabold text-slate-700 transition border border-slate-150"
              >
                + Register Visitor
              </button>
              <button
                onClick={() => toast.success('Navigate to Community -> Referrals tab to pass opportunity!')}
                className="w-full text-left bg-slate-50 hover:bg-slate-100 p-2.5 rounded text-xs font-extrabold text-slate-700 transition border border-slate-150"
              >
                + Pass Referral
              </button>
            </div>
          </section>

          {/* 8. Community Stats */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Community Stats</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Members</p>
                <p className="text-lg font-black text-slate-800 mt-0.5">52</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Businesses</p>
                <p className="text-lg font-black text-slate-800 mt-0.5">48</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Visitors This Month</p>
                <p className="text-lg font-black text-slate-800 mt-0.5">16</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Business Closed This Month</p>
                <p className="text-xs font-black text-emerald-600 mt-1 truncate">₹24,50,000</p>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  )
}
