import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  AtSign,
  CalendarDays,
  Filter,
  Heart,
  Image,
  MessageSquare,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  Trash2,
  UsersRound,
  X,
} from 'lucide-react'
import { communityApi } from '../../../api/community'
import LoadingScreen from '../../../components/common/LoadingScreen'
import { useAuth } from '../../../hooks/useAuth'
import { formatDate } from '../../../utils/format'
import { ROLES } from '../../../constants/roleConfig'

const postTypes = [
  ['business_requirement', 'Requirement'],
  ['business_opportunity', 'Opportunity'],
  ['business_promotion', 'Business Promotion'],
  ['looking_for', 'Looking For'],
  ['offer_deal', 'Offer / Deal'],
  ['achievement', 'Achievement'],
  ['success_story', 'Success Story'],
  ['event', 'Event'],
  ['announcement', 'Announcement'],
]

const businessPostTypes = new Set(['business_promotion', 'looking_for', 'offer_deal'])

const businessTargetOptions = [
  ['business', 'Business'],
  ['product', 'Product'],
  ['service', 'Service'],
]

const reactionTypes = [
  ['like', 'Like'],
  ['celebrate', 'Celebrate'],
  ['support', 'Support'],
  ['insightful', 'Insightful'],
]

const visibilityOptions = [
  ['chapter', 'Chapter'],
  ['district', 'District'],
  ['state', 'State'],
  ['region', 'Region'],
  ['global', 'Gloaro Network'],
]

const postDeleteRoles = new Set(['admin', 'superadmin'])

const getAuthorInitial = (author) => author?.name?.charAt(0)?.toUpperCase() || 'M'

const canDeletePost = (post, user) => {
  const authorId = post.author?._id || post.author
  return String(authorId || '') === String(user?._id || '') || postDeleteRoles.has(user?.role)
}

const getReactionCounts = (reactions = []) => reactionTypes.reduce((counts, [key]) => {
  const userIds = new Set(
    reactions
      .filter((reaction) => reaction.type === key)
      .map((reaction) => String(reaction.user?._id || reaction.user))
      .filter(Boolean)
  )

  return { ...counts, [key]: userIds.size }
}, {})

const getMyReactions = (post, user) => new Set(
  (post.reactions || [])
    .filter((reaction) => String(reaction.user?._id || reaction.user) === String(user?._id))
    .map((reaction) => reaction.type)
)

const getOrgName = (organization, key, suffix = '') => {
  const name = organization?.[key]?.name
  if (!name) return ''
  return suffix && !name.toLowerCase().includes(suffix.toLowerCase()) ? `${name} ${suffix}` : name
}

const getAuthorMetadataLine = (author, createdAt) => {
  const org = author?.organization || {}
  const chapter = getOrgName(org, 'chapter', 'Chapter')
  const district = getOrgName(org, 'district', 'District')
  const state = getOrgName(org, 'state')
  const region = getOrgName(org, 'region', 'Region')

  return [author?.role || 'Member', chapter, district, state, region, formatDate(createdAt)].filter(Boolean).join(' • ')
}

const extractMentionIds = (text, members) => {
  const value = text.toLowerCase()
  return members
    .filter((member) => member.name && value.includes(`@${member.name.toLowerCase()}`))
    .map((member) => member._id)
}

const appendMention = (text, member) => text.replace(/@([\w\s.-]*)$/, `@${member.name} `)

const getActiveMentionQuery = (text) => {
  const match = text.match(/@([\w\s.-]*)$/)
  return match ? match[1].trim() : null
}

const formatMentionHierarchy = (member) => [member.chapterName, member.districtName, member.stateName, member.regionName].filter(Boolean).join(' • ')

const mentionStillPresent = (content, member) => String(content || '').toLowerCase().includes(`@${String(member?.name || '').toLowerCase()}`)

function StructuredContent({ post }) {
  const lines = String(post.content || '').split('\n').map((line) => line.trim()).filter(Boolean)
  const heading = lines.find((line) => /^\*\*.*\*\*$/.test(line) && !line.includes(':'))?.replaceAll('*', '')
  const fields = lines
    .filter((line) => line.startsWith('*'))
    .map((line) => {
      const cleaned = line.replace(/^\*\s*/, '').replaceAll('**', '')
      const [label, ...rest] = cleaned.split(':')
      return [label?.trim(), rest.join(':').trim()]
    })
    .filter(([label, value]) => label && value)
  const body = lines
    .filter((line) => !line.startsWith('*') && !/^\*\*.*\*\*$/.test(line))
    .join('\n')

  if (!heading && !fields.length) {
    return <p className="whitespace-pre-wrap text-sm font-semibold leading-6 text-slate-700">{post.content}</p>
  }

  return (
    <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
      {heading && <h4 className="text-sm font-black text-[#0d4697]">{heading}</h4>}
      {body && <p className="whitespace-pre-wrap text-sm font-semibold leading-6 text-slate-700">{body}</p>}
      {!!fields.length && (
        <div className="grid gap-2 border-t border-slate-200 pt-3 sm:grid-cols-3">
          {fields.map(([label, value]) => (
            <div key={label}>
              <p className="text-[10px] font-black uppercase tracking-[0.08em] text-slate-400">{label}</p>
              <p className="mt-1 text-xs font-extrabold text-slate-700">{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CommunitySearch({ search, onSearch, searching }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <Search className="h-5 w-5 shrink-0 text-slate-400" />
      <input
        value={search}
        onChange={(event) => onSearch(event.target.value)}
        placeholder="Search posts, people, roles, chapters, districts, states, regions..."
        className="w-full bg-transparent text-sm font-semibold text-slate-800 caret-[#0d4697] outline-none placeholder:text-slate-400"
      />
      {searching && <span aria-label="Searching" className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-slate-200 border-t-[#0d4697]" />}
      {search && !searching && (
        <button type="button" onClick={() => onSearch('')} aria-label="Clear search" className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

function CommunityFilters({ scope, type, visibility, dealStatus, filters, locations, loadingLocations, onTypeChange, onVisibilityChange, onDealStatusChange, onFilterChange, onClear }) {
  const hasActiveFilters = Boolean(type || visibility || dealStatus || filters.region || filters.state || filters.district || filters.chapter)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-slate-400">
          <Filter className="h-4 w-4" />
          Filters
        </span>
        <select value={type} onChange={(event) => onTypeChange(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-extrabold text-slate-600 outline-none focus:border-[#0d4697]">
          <option value="">All Posts</option>
          {postTypes.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
        {type === 'offer_deal' && (
          <select value={dealStatus} onChange={(event) => onDealStatusChange(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-extrabold text-slate-600 outline-none focus:border-[#0d4697]">
            <option value="">All Deals</option>
            <option value="active">Active Deals</option>
            <option value="expired">Expired Deals</option>
          </select>
        )}
        {scope === 'network' && (
          <>
            <select value={visibility} onChange={(event) => onVisibilityChange(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-extrabold text-slate-600 outline-none focus:border-[#0d4697]">
              <option value="">All Visibility</option>
              {visibilityOptions.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
            <select value={filters.region} onChange={(event) => onFilterChange('region', event.target.value)} disabled={loadingLocations.regions} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-extrabold text-slate-600 outline-none focus:border-[#0d4697] disabled:opacity-50">
              <option value="">{loadingLocations.regions ? 'Loading regions...' : 'All Regions'}</option>
              {!loadingLocations.regions && locations.regions.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
            </select>
            <select value={filters.state} onChange={(event) => onFilterChange('state', event.target.value)} disabled={!filters.region || loadingLocations.states} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-extrabold text-slate-600 outline-none focus:border-[#0d4697] disabled:opacity-50">
              <option value="">{loadingLocations.states ? 'Loading states...' : (filters.region && !locations.states.length ? 'No states available' : 'All States')}</option>
              {!loadingLocations.states && locations.states.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
            </select>
            <select value={filters.district} onChange={(event) => onFilterChange('district', event.target.value)} disabled={!filters.state || loadingLocations.districts} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-extrabold text-slate-600 outline-none focus:border-[#0d4697] disabled:opacity-50">
              <option value="">{loadingLocations.districts ? 'Loading districts...' : (filters.state && !locations.districts.length ? 'No districts available' : 'All Districts')}</option>
              {!loadingLocations.districts && locations.districts.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
            </select>
            <select value={filters.chapter} onChange={(event) => onFilterChange('chapter', event.target.value)} disabled={!filters.district || loadingLocations.chapters} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-extrabold text-slate-600 outline-none focus:border-[#0d4697] disabled:opacity-50">
              <option value="">{loadingLocations.chapters ? 'Loading chapters...' : (filters.district && !locations.chapters.length ? 'No chapters available' : 'All Chapters')}</option>
              {!loadingLocations.chapters && locations.chapters.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
            </select>
          </>
        )}
        <button
          type="button"
          onClick={onClear}
          disabled={!hasActiveFilters}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-extrabold text-slate-600 transition hover:border-[#0d4697] hover:text-[#0d4697] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear Filters
        </button>
      </div>
    </section>
  )
}

function PostMedia({ media = [] }) {
  if (!media.length) return null

  return (
    <div className={`grid gap-2 ${media.length > 1 ? 'sm:grid-cols-2' : ''}`}>
      {media.map((item, index) => (
        <div key={`${item.url}-${index}`} className="flex max-h-[320px] w-full items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 md:max-h-[380px] lg:max-h-[450px]">
          <img
            src={item.url}
            alt={item.caption || `Community post media ${index + 1}`}
            className="h-auto max-h-[320px] max-w-full object-contain md:max-h-[380px] lg:max-h-[450px]"
          />
        </div>
      ))}
    </div>
  )
}

function BusinessPostInfo({ post }) {
  if (!businessPostTypes.has(post.type)) return null

  const business = post.businessProfile
  const target = post.businessPost?.target
  const targetLabel = businessTargetOptions.find(([key]) => key === target)?.[1]
  const validUntil = post.offer?.validUntil ? formatDate(post.offer.validUntil) : ''
  const expired = Boolean(post.offer?.isExpired)

  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-slate-900">{business?.businessName || (post.type === 'looking_for' ? 'Business Requirement' : 'Business Profile')}</p>
          <p className="mt-0.5 text-xs font-bold text-slate-500">
            {[business?.category?.name, targetLabel].filter(Boolean).join(' • ') || 'Gloaro Business Wall'}
          </p>
        </div>
        {post.type === 'offer_deal' && (
          <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase ${expired ? 'border-red-100 bg-red-50 text-red-700' : 'border-emerald-100 bg-emerald-50 text-emerald-700'}`}>
            {expired ? 'Expired' : 'Active'}{validUntil ? ` • Valid till ${validUntil}` : ''}
          </span>
        )}
      </div>
    </div>
  )
}

function PostComposer({ scope, onCreated, chapterId, chapterName }) {
  const [content, setContent] = useState('')
  const [type, setType] = useState('announcement')
  const [visibility, setVisibility] = useState(scope === 'chapter' ? 'chapter' : 'global')
  const [businessTarget, setBusinessTarget] = useState('business')
  const [offerValidUntil, setOfferValidUntil] = useState('')
  const [media, setMedia] = useState([])
  const [publishing, setPublishing] = useState(false)
  const [mentionResults, setMentionResults] = useState([])
  const [mentionPagination, setMentionPagination] = useState({ page: 1, totalPages: 1 })
  const [mentionLoading, setMentionLoading] = useState(false)
  const [selectedMentions, setSelectedMentions] = useState([])
  const activeMentionQuery = getActiveMentionQuery(content)
  const mentionDropdownOpen = activeMentionQuery !== null
  const isBusinessPost = businessPostTypes.has(type)
  const composerPlaceholder = type === 'business_promotion'
    ? 'Promote your business, product, or service...'
    : type === 'looking_for'
      ? 'What business support are you looking for?'
      : type === 'offer_deal'
        ? 'Share your offer details...'
        : scope === 'chapter' ? `Share an update with ${chapterName ? `${chapterName} chapter` : 'your chapter'}...` : 'Share an update across the Gloaro network...'

  const handleFiles = (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return
    setMedia((current) => [...current, ...files])
    event.target.value = ''
  }

  useEffect(() => {
    if (activeMentionQuery === null) {
      return undefined
    }

    let mounted = true
    const timer = setTimeout(() => {
      setMentionLoading(true)
      communityApi.getMentions({ scope, chapter: scope === 'chapter' ? chapterId : undefined, search: activeMentionQuery, page: 1, limit: 20 })
        .then((response) => {
          if (!mounted) return
          setMentionResults(response.data?.data || [])
          setMentionPagination(response.data?.pagination || { page: 1, totalPages: 1 })
        })
        .catch(() => {
          if (mounted) toast.error('Unable to load mention suggestions')
        })
        .finally(() => {
          if (mounted) setMentionLoading(false)
        })
    }, 220)

    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [activeMentionQuery, scope, chapterId])

  const loadMoreMentions = () => {
    if (mentionLoading || mentionPagination.page >= mentionPagination.totalPages) return
    const nextPage = mentionPagination.page + 1
    setMentionLoading(true)
    communityApi.getMentions({ scope, chapter: scope === 'chapter' ? chapterId : undefined, search: activeMentionQuery || '', page: nextPage, limit: 20 })
      .then((response) => {
        setMentionResults((current) => [...current, ...(response.data?.data || [])])
        setMentionPagination(response.data?.pagination || { page: nextPage, totalPages: nextPage })
      })
      .catch(() => toast.error('Unable to load more mentions'))
      .finally(() => setMentionLoading(false))
  }

  const selectMention = (member) => {
    setContent((value) => appendMention(value, member))
    setSelectedMentions((current) => {
      if (current.some((item) => String(item._id) === String(member._id))) return current
      return [...current, member]
    })
    setMentionResults([])
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!content.trim() && !media.length) return

    setPublishing(true)
    const form = new FormData()
    form.append('scope', scope)
    form.append('type', type)
    form.append('visibility', scope === 'chapter' ? 'chapter' : visibility)
    form.append('content', content.trim())
    form.append('mentions', JSON.stringify(selectedMentions.filter((member) => mentionStillPresent(content, member)).map((member) => member._id)))
    if (scope === 'chapter' && chapterId) form.append('chapterId', chapterId)
    if (isBusinessPost) form.append('businessTarget', businessTarget)
    if (type === 'offer_deal' && offerValidUntil) form.append('offerValidUntil', offerValidUntil)
    media.forEach((file) => form.append('media', file))

    communityApi.createPost(form)
      .then(() => {
        toast.success(scope === 'chapter' ? 'Posted to Chapter Community' : 'Posted to Gloaro Network')
        setContent('')
        setMedia([])
        setBusinessTarget('business')
        setOfferValidUntil('')
        setSelectedMentions([])
        setMentionResults([])
        onCreated()
      })
      .catch(() => toast.error('Unable to publish post'))
      .finally(() => setPublishing(false))
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder={composerPlaceholder}
          rows={3}
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 caret-[#0d4697] outline-none placeholder:text-slate-400 focus:border-[#0d4697]"
        />
        {!!media.length && (
          <div className="flex flex-wrap gap-2">
            {media.map((item, index) => (
              <span key={`${item.name}-${index}`} className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#0d4697]">
                <Image className="h-3.5 w-3.5" />
                {item.name || `Image ${index + 1}`}
                <button type="button" onClick={() => setMedia((current) => current.filter((_, i) => i !== index))} aria-label="Remove image">
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <select value={type} onChange={(event) => setType(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-extrabold text-slate-600 outline-none">
              {postTypes.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
            {isBusinessPost && (
              <select value={businessTarget} onChange={(event) => setBusinessTarget(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-extrabold text-slate-600 outline-none">
                {businessTargetOptions.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            )}
            {type === 'offer_deal' && (
              <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-extrabold text-slate-600">
                <CalendarDays className="h-4 w-4" />
                <input type="date" value={offerValidUntil} onChange={(event) => setOfferValidUntil(event.target.value)} className="bg-transparent text-xs font-extrabold text-slate-700 outline-none" />
              </label>
            )}
            {scope === 'network' && (
              <select value={visibility} onChange={(event) => setVisibility(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-extrabold text-slate-600 outline-none">
                {visibilityOptions.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            )}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-extrabold text-slate-600">
              <Image className="h-4 w-4" />
              Photos
              <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
            </label>
            <span className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-bold text-slate-400">
              <AtSign className="h-4 w-4" />
              Type @Name to mention
            </span>
          </div>
          <button type="submit" disabled={publishing || (!content.trim() && !media.length)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0d4697] px-5 py-2 text-xs font-extrabold text-white transition hover:bg-blue-800 disabled:opacity-50">
            <Send className="h-4 w-4" />
            {publishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
        {mentionDropdownOpen && (
          <div className="max-h-72 overflow-y-auto rounded-xl border border-amber-100 bg-amber-50 p-2 shadow-sm">
            {mentionLoading && !mentionResults.length && (
              <p className="px-3 py-3 text-xs font-bold text-slate-500">Loading members...</p>
            )}
            {!mentionLoading && !mentionResults.length && (
              <p className="px-3 py-3 text-xs font-bold text-slate-500">No members found.</p>
            )}
            {mentionResults.map((member) => {
              const hierarchy = formatMentionHierarchy(member)
              return (
                <button key={member._id} type="button" onClick={() => selectMention(member)} className="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-white">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-xs font-black text-[#0d4697]">{getAuthorInitial(member)}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-black text-slate-900">{member.name}</span>
                    <span className="block truncate text-[11px] font-bold text-slate-600">{member.role || 'Member'}</span>
                    {hierarchy && <span className="mt-0.5 block truncate text-[10px] font-semibold text-slate-500">{hierarchy}</span>}
                  </span>
                </button>
              )
            })}
            {mentionPagination.page < mentionPagination.totalPages && (
              <button type="button" onClick={loadMoreMentions} disabled={mentionLoading} className="mt-1 w-full rounded-lg bg-white px-3 py-2 text-xs font-black text-[#0d4697] disabled:opacity-50">
                {mentionLoading ? 'Loading...' : 'Load more'}
              </button>
            )}
          </div>
        )}
      </form>
    </section>
  )
}

function ReactionBar({ post, myReactions, onReact }) {
  const counts = getReactionCounts(post.reactions || [])
  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-xs font-extrabold text-slate-500">
      {reactionTypes.map(([key, label]) => {
        const isActive = myReactions.has(key)

        return (
          <button key={key} onClick={() => onReact(key)} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition ${isActive ? 'bg-red-50 text-red-600' : 'hover:bg-slate-50 hover:text-slate-800'}`}>
            <Heart className={`h-4 w-4 ${isActive ? 'fill-current' : ''}`} />
            {label} ({counts[key] || 0})
          </button>
        )
      })}
      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5">
        <MessageSquare className="h-4 w-4" />
        {post.comments?.length || 0}
      </span>
    </div>
  )
}

function CommentItem({ comment, onReply }) {
  const [reply, setReply] = useState('')
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="flex items-start gap-2">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-[10px] font-black text-[#0d4697]">{getAuthorInitial(comment.author)}</span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-black text-slate-900">{comment.author?.name || 'Member'}</p>
          <p className="mt-1 whitespace-pre-wrap text-xs font-semibold leading-5 text-slate-700">{comment.content}</p>
          <button type="button" onClick={() => setOpen((value) => !value)} className="mt-1 text-[11px] font-black text-[#0d4697]">Reply</button>
        </div>
      </div>
      {!!comment.replies?.length && (
        <div className="ml-9 mt-3 space-y-2">
          {comment.replies.map((item) => (
            <div key={item._id || item.createdAt} className="rounded-lg bg-white p-2">
              <p className="text-[10px] font-black text-slate-800">{item.author?.name || 'Member'}</p>
              <p className="mt-1 text-xs font-semibold text-slate-600">{item.content}</p>
            </div>
          ))}
        </div>
      )}
      {open && (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (!reply.trim()) return
            onReply(comment._id, reply)
            setReply('')
            setOpen(false)
          }}
          className="ml-9 mt-3 flex gap-2"
        >
          <input value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write a reply..." className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 caret-[#0d4697] outline-none placeholder:text-slate-400 focus:border-[#0d4697]" />
          <button className="rounded-lg bg-[#0d4697] px-3 py-2 text-xs font-black text-white">Send</button>
        </form>
      )}
    </div>
  )
}

function CommentsSection({ post, members, onComment }) {
  const [content, setContent] = useState('')

  return (
    <div className="space-y-3">
      {post.comments?.map((comment) => (
        <CommentItem key={comment._id || comment.createdAt} comment={comment} onReply={(parentCommentId, reply) => onComment(reply, parentCommentId)} />
      ))}
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (!content.trim()) return
          onComment(content, null, extractMentionIds(content, members))
          setContent('')
        }}
        className="flex gap-2"
      >
        <input value={content} onChange={(event) => setContent(event.target.value)} placeholder="Comment or mention @Name..." className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 caret-[#0d4697] outline-none placeholder:text-slate-400 focus:border-[#0d4697]" />
        <button className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-black text-white">Post</button>
      </form>
    </div>
  )
}

function PostCard({ post, user, members, onRefresh, highlighted }) {
  const [showComments, setShowComments] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const myReactions = getMyReactions(post, user)
  const typeLabel = postTypes.find(([key]) => key === post.type)?.[1] || 'Update'
  const authorMetadata = getAuthorMetadataLine(post.author, post.createdAt)
  const showDelete = canDeletePost(post, user)

  const handleReact = (reaction) => {
    communityApi.likePost(post._id, { reaction })
      .then(onRefresh)
      .catch(() => toast.error('Unable to update reaction'))
  }

  const handleComment = (content, parentCommentId, mentions = []) => {
    communityApi.commentPost(post._id, { content, parentCommentId, mentions })
      .then(onRefresh)
      .catch(() => toast.error('Unable to add comment'))
  }

  const handleDelete = () => {
    if (!window.confirm('Delete this post? This action cannot be undone.')) return

    setDeleting(true)
    communityApi.deletePost(post._id)
      .then(() => {
        toast.success('Post deleted')
        return onRefresh()
      })
      .catch(() => toast.error('Unable to delete post'))
      .finally(() => setDeleting(false))
  }

  return (
    <article
      id={`community-post-${post._id}`}
      className={`space-y-4 rounded-2xl border bg-white p-5 shadow-sm transition ${
        highlighted ? 'border-[#ffbf1a] ring-2 ring-[#ffbf1a]/40' : 'border-slate-200'
      }`}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {post.author?.avatar?.url ? (
            <img src={post.author.avatar.url} alt={post.author.name || 'Post author'} className="h-11 w-11 shrink-0 rounded-full object-cover" />
          ) : (
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blue-50 text-sm font-black text-[#0d4697]">{getAuthorInitial(post.author)}</span>
          )}
          <div className="min-w-0">
            <h3 className="truncate text-sm font-black leading-tight text-slate-900">{post.author?.name || 'Unknown Member'}</h3>
            {authorMetadata && (
              <p className="mt-1 text-[11px] font-bold leading-snug text-slate-500 sm:truncate">
                {authorMetadata}
              </p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#0d4697]">{typeLabel}</span>
          {showDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              title="Delete post"
              aria-label="Delete post"
              className="grid h-8 w-8 place-items-center rounded-full border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>
      <BusinessPostInfo post={post} />
      <StructuredContent post={post} />
      {!!post.mentions?.length && (
        <div className="flex flex-wrap gap-2">
          {post.mentions.map((member) => <span key={member._id} className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-black text-[#b56a00]">@{member.name}</span>)}
        </div>
      )}
      <PostMedia media={post.media} />
      <ReactionBar post={post} myReactions={myReactions} onReact={handleReact} />
      <button onClick={() => setShowComments((value) => !value)} className="inline-flex items-center gap-2 text-xs font-black text-[#0d4697]">
        <MessageSquare className="h-4 w-4" />
        {showComments ? 'Hide comments' : 'View comments and replies'}
      </button>
      {showComments && <CommentsSection post={post} members={members} onComment={handleComment} />}
    </article>
  )
}

function CommunityFeed({ posts, user, members, onRefresh, searchActive, highlightedPostId }) {
  if (!posts.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm font-semibold text-slate-400">
        {searchActive ? 'No matching community posts found.' : 'No community posts found.'}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          user={user}
          members={members}
          onRefresh={onRefresh}
          highlighted={String(post._id) === String(highlightedPostId || '')}
        />
      ))}
    </div>
  )
}

function MemberDiscovery({ members, scope, search }) {
  const chatPath = window.location.pathname
    .replace(/\/network$/, '/chat')
    .replace(/\/wall$/, '/chat')
    .replace(/\/dashboard\/network$/, '/dashboard/chat')
    .replace(/\/dashboard\/wall$/, '/dashboard/chat')

  const uniqueMembers = useMemo(() => {
    const seen = new Set()
    return members.filter((m) => {
      if (seen.has(m._id)) return false
      seen.add(m._id)
      return true
    })
  }, [members])

  return (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-5">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="shrink-0 border-b border-slate-100 px-5 py-4">
          <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
            <UsersRound className="h-4 w-4 text-[#0d4697]" />
            {scope === 'chapter' ? 'Chapter Members' : 'Network Discovery'}
            <span className="ml-auto rounded-full bg-blue-50 px-2 py-1 text-[10px] font-black text-[#0d4697]">{uniqueMembers.length}</span>
          </h3>
          {search && <p className="mt-2 truncate text-[11px] font-semibold text-slate-500">Matches for “{search}”</p>}
        </div>
        <div className="max-h-[520px] space-y-2 overflow-y-auto p-3 [scrollbar-gutter:stable]">
          {uniqueMembers.map((member) => {
            const hierarchy = [member.chapterName, member.districtName, member.stateName, member.regionName].filter(Boolean).join(' \u2022 ')
            return (
              <div key={member._id} className="grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-transparent bg-slate-50 p-3 transition hover:border-blue-100 hover:bg-blue-50/50">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-xs font-black text-[#0d4697] shadow-sm">{getAuthorInitial(member)}</span>
                <div className="min-w-0">
                  <p className="break-words text-sm font-black leading-5 text-slate-900">{member.name}</p>
                  <p className="mt-0.5 break-words text-[11px] font-bold leading-4 text-slate-500">{member.businessName || member.role || 'Member'}</p>
                  {hierarchy && (
                    <p className="mt-1 break-words text-[10px] font-semibold leading-4 text-slate-400">{hierarchy}</p>
                  )}
                </div>
                <Link to={`${chatPath}?recipient=${member._id}`} className="self-center rounded-lg bg-blue-50 px-3 py-2 text-[10px] font-black text-[#0d4697] transition hover:bg-[#0d4697] hover:text-white">Message</Link>
              </div>
            )
          })}
          {!uniqueMembers.length && <p className="text-xs font-semibold text-slate-400">No members found.</p>}
        </div>
      </section>
      <section className="shrink-0 rounded-2xl border border-blue-100 bg-[#0d4697] p-5 text-white shadow-sm">
        <Sparkles className="h-5 w-5 text-[#ffbf1a]" />
        <h3 className="mt-3 text-sm font-black">{scope === 'chapter' ? 'Chapter Community' : 'Gloaro Network'}</h3>
        <p className="mt-2 text-xs font-semibold leading-5 text-blue-100">
          {scope === 'chapter'
            ? 'Collaborate with members from your chapter through posts, comments, mentions, photos, and messages.'
            : 'Discover members and business conversations across chapters, districts, states, and regions.'}
        </p>
      </section>
    </aside>
  )
}

export default function CommunityPage({ scope = 'chapter' }) {
  const { user } = useAuth()
  const location = useLocation()
  const isGlobalAdmin = [ROLES.SUPERADMIN, ROLES.ADMIN].includes(user?.role)
  const [posts, setPosts] = useState([])
  const [members, setMembers] = useState([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [type, setType] = useState('')
  const [visibility, setVisibility] = useState('')
  const [dealStatus, setDealStatus] = useState('')
  const [filters, setFilters] = useState({ chapter: '', district: '', state: '', region: '' })
  const [locations, setLocations] = useState({ regions: [], states: [], districts: [], chapters: [] })
  const [loadingLocations, setLoadingLocations] = useState({ regions: false, states: false, districts: false, chapters: false })
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 })
  const [refreshKey, setRefreshKey] = useState(0)
  const [chapters, setChapters] = useState([])
  const [chaptersLoaded, setChaptersLoaded] = useState(false)
  const [selectedChapterId, setSelectedChapterId] = useState('')
  const [chapterOverview, setChapterOverview] = useState(null)
  const abortRef = useRef(null)
  const highlightedPostId = useMemo(() => new URLSearchParams(location.search).get('post'), [location.search])

  const selectedChapter = chapters.find((chapter) => String(chapter._id) === String(selectedChapterId)) || null
  const chapterFilterValue = isGlobalAdmin && scope === 'chapter' ? (selectedChapterId || undefined) : (filters.chapter || undefined)
  const loadingChapters = scope === 'chapter' && isGlobalAdmin && !chaptersLoaded

  const title = scope === 'chapter' ? 'Chapter Community' : 'Gloaro Network'
  const subtitle = scope === 'chapter'
    ? `Create posts, share photos, comment, reply, mention, and connect with members in ${selectedChapter ? `${selectedChapter.name} chapter` : 'your chapter'}.`
    : 'Communicate and discover members across chapters, districts, states, and regions.'

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 350)
    return () => clearTimeout(timer)
  }, [search])

  const query = useMemo(() => ({
    scope,
    search: debouncedSearch || undefined,
    type: type || undefined,
    visibility: visibility || undefined,
    dealStatus: type === 'offer_deal' ? dealStatus || undefined : undefined,
    chapter: chapterFilterValue,
    district: filters.district || undefined,
    state: filters.state || undefined,
    region: filters.region || undefined,
    page,
    limit: 10,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [scope, debouncedSearch, type, visibility, dealStatus, filters, page, refreshKey, chapterFilterValue])

  const fetchCommunity = useCallback(() => {
    if (isGlobalAdmin && scope === 'chapter' && !selectedChapterId) {
      setSearching(false)
      return Promise.resolve()
    }
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const isLoadMore = page > 1

    if (!isLoadMore) setSearching(true)

    const membersPromise = isGlobalAdmin && scope === 'chapter'
      ? communityApi.getChapterMembers(selectedChapterId, { search: debouncedSearch || undefined }, { signal: controller.signal, silent: true })
      : communityApi.getDirectory({ scope, search: debouncedSearch, ...filters }, { signal: controller.signal, silent: true })

    return Promise.all([
      communityApi.getPosts(query, { signal: controller.signal, silent: true }),
      membersPromise,
    ]).then(([postRes, directoryRes]) => {
      const newPosts = postRes.data?.data || []
      const pag = postRes.data?.pagination
      setPosts((current) => isLoadMore ? [...current, ...newPosts] : newPosts)
      if (pag) setPagination(pag)
      if (!isLoadMore) setMembers(directoryRes.data?.data || [])
    }).catch((err) => {
      if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') return
      toast.error('Unable to load community')
    }).finally(() => {
      if (!controller.signal.aborted) setSearching(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, query, scope, debouncedSearch, page, refreshKey, isGlobalAdmin, selectedChapterId])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        await fetchCommunity()
      } finally {
        if (!cancelled) setInitialLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [fetchCommunity])

  useEffect(() => {
    if (scope !== 'chapter' || !isGlobalAdmin) return
    let mounted = true
    communityApi.getChapterList()
      .then((response) => {
        if (!mounted) return
        const list = response.data?.data || []
        setChapters(list)
        setSelectedChapterId((current) => current || list[0]?._id || '')
      })
      .catch(() => {
        if (mounted) toast.error('Unable to load chapters')
      })
      .finally(() => {
        if (mounted) setChaptersLoaded(true)
      })
    return () => { mounted = false }
  }, [scope, isGlobalAdmin])

  useEffect(() => {
    if (scope !== 'chapter' || !isGlobalAdmin || !selectedChapterId) return
    let mounted = true
    communityApi.getChapterCommunity(selectedChapterId)
      .then((response) => {
        if (mounted) setChapterOverview(response.data?.data || null)
      })
      .catch(() => {
        if (mounted) setChapterOverview(null)
      })
    return () => { mounted = false }
  }, [scope, isGlobalAdmin, selectedChapterId])

  useEffect(() => {
    if (!highlightedPostId || !posts.length) return
    const element = document.getElementById(`community-post-${highlightedPostId}`)
    if (!element) return
    const timer = window.setTimeout(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
    return () => window.clearTimeout(timer)
  }, [highlightedPostId, posts])

  useEffect(() => {
    if (scope !== 'network') return
    let mounted = true
    setLoadingLocations((c) => ({ ...c, regions: true }))
    communityApi.getRegions(scope)
      .then((response) => {
        if (mounted) setLocations((current) => ({ ...current, regions: response.data?.data?.regions || [] }))
      })
      .catch(() => toast.error('Unable to load regions'))
      .finally(() => { if (mounted) setLoadingLocations((c) => ({ ...c, regions: false })) })
    return () => { mounted = false }
  }, [scope])

  useEffect(() => {
    if (scope !== 'network') return
    if (!filters.region) return
    let mounted = true
    setLoadingLocations((c) => ({ ...c, states: true }))
    setLocations((current) => ({ ...current, states: [], districts: [], chapters: [] }))
    communityApi.getStates(filters.region, scope)
      .then((response) => {
        if (mounted) setLocations((current) => ({ ...current, states: response.data?.data?.states || [] }))
      })
      .catch(() => toast.error('Unable to load states'))
      .finally(() => { if (mounted) setLoadingLocations((c) => ({ ...c, states: false })) })
    return () => { mounted = false }
  }, [filters.region, scope])

  useEffect(() => {
    if (scope !== 'network') return
    if (!filters.state) return
    let mounted = true
    setLoadingLocations((c) => ({ ...c, districts: true }))
    setLocations((current) => ({ ...current, districts: [], chapters: [] }))
    communityApi.getDistricts(filters.state, scope)
      .then((response) => {
        if (mounted) setLocations((current) => ({ ...current, districts: response.data?.data?.districts || [] }))
      })
      .catch(() => toast.error('Unable to load districts'))
      .finally(() => { if (mounted) setLoadingLocations((c) => ({ ...c, districts: false })) })
    return () => { mounted = false }
  }, [filters.state, scope])

  useEffect(() => {
    if (scope !== 'network') return
    if (!filters.district) return
    let mounted = true
    setLoadingLocations((c) => ({ ...c, chapters: true }))
    setLocations((current) => ({ ...current, chapters: [] }))
    communityApi.getChapters(filters.district, scope)
      .then((response) => {
        if (mounted) setLocations((current) => ({ ...current, chapters: response.data?.data?.chapters || [] }))
      })
      .catch(() => toast.error('Unable to load chapters'))
      .finally(() => { if (mounted) setLoadingLocations((c) => ({ ...c, chapters: false })) })
    return () => { mounted = false }
  }, [filters.district, scope])

  if (initialLoading) return <LoadingScreen label={`Loading ${title}...`} />

  if (scope === 'chapter' && isGlobalAdmin && !selectedChapterId) {
    return <LoadingScreen label={loadingChapters ? 'Loading chapters...' : 'Select a chapter...'} />
  }

  const handleChapterChange = (chapterId) => {
    setSelectedChapterId(chapterId)
    setChapterOverview(null)
    setPage(1)
    setType('')
    setVisibility('')
    setDealStatus('')
    setSearch('')
    setDebouncedSearch('')
    setFilters({ chapter: '', district: '', state: '', region: '' })
    setPosts([])
    setMembers([])
    setPagination({ page: 1, limit: 10, total: 0, totalPages: 1 })
    setRefreshKey((k) => k + 1)
  }

  const handleFilterChange = (key, value) => {
    setPage(1)
    if (key === 'region') {
      setFilters((current) => ({ ...current, region: value, state: '', district: '', chapter: '' }))
      setLocations((current) => ({ ...current, states: [], districts: [], chapters: [] }))
      return
    }
    if (key === 'state') {
      setFilters((current) => ({ ...current, state: value, district: '', chapter: '' }))
      setLocations((current) => ({ ...current, districts: [], chapters: [] }))
      return
    }
    if (key === 'district') {
      setFilters((current) => ({ ...current, district: value, chapter: '' }))
      setLocations((current) => ({ ...current, chapters: [] }))
      return
    }
    setFilters((current) => ({ ...current, [key]: value }))
  }

  const hasMore = pagination.page < pagination.totalPages

  return (
    <div className="space-y-6 pb-8">
      <section className="rounded-2xl border border-blue-900 bg-gradient-to-br from-[#0d4697] to-[#093574] p-7 text-white shadow-sm">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#ffbf1a]">Community Communication</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-blue-100">{subtitle}</p>
        {isGlobalAdmin && scope === 'chapter' && (
          <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <label htmlFor="chapter-selector" className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#ffbf1a]">
                Chapter
              </label>
              <select
                id="chapter-selector"
                value={selectedChapterId}
                onChange={(event) => handleChapterChange(event.target.value)}
                disabled={loadingChapters || !chapters.length}
                className="min-w-[220px] cursor-pointer rounded-lg border border-white/25 bg-white px-4 py-2.5 text-sm font-black text-slate-900 outline-none transition focus:border-[#ffbf1a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingChapters && <option value="">Loading chapters...</option>}
                {!loadingChapters && !chapters.length && <option value="">No active chapters</option>}
                {chapters.map((chapter) => (
                  <option key={chapter._id} value={chapter._id}>{chapter.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue-200">Members</p>
                <p className="mt-1 text-2xl font-black leading-none text-white">{chapterOverview?.membersCount ?? '—'}</p>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue-200">Posts</p>
                <p className="mt-1 text-2xl font-black leading-none text-white">{chapterOverview?.postsCount ?? '—'}</p>
              </div>
            </div>
          </div>
        )}
      </section>
      <CommunitySearch search={search} onSearch={setSearch} searching={searching} />
      <CommunityFilters
        scope={scope}
        type={type}
        visibility={visibility}
        dealStatus={dealStatus}
        filters={filters}
        locations={locations}
        loadingLocations={loadingLocations}
        onTypeChange={(v) => { setPage(1); setType(v); if (v !== 'offer_deal') setDealStatus('') }}
        onVisibilityChange={(v) => { setPage(1); setVisibility(v) }}
        onDealStatusChange={(v) => { setPage(1); setDealStatus(v) }}
        onFilterChange={handleFilterChange}
        onClear={() => {
          setPage(1)
          setType('')
          setVisibility('')
          setDealStatus('')
          setFilters({ chapter: '', district: '', state: '', region: '' })
          setLocations((current) => ({ ...current, states: [], districts: [], chapters: [] }))
        }}
      />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(410px,450px)]">
        <main className="min-w-0 space-y-5">
          <PostComposer scope={scope} chapterId={selectedChapterId || undefined} chapterName={selectedChapter?.name} onCreated={() => { setPage(1); setRefreshKey((k) => k + 1) }} />
          {searching && (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white py-3 text-xs font-bold text-slate-400">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-[#0d4697]" />
              Searching...
            </div>
          )}
          <CommunityFeed posts={posts} user={user} members={members} onRefresh={() => { setPage(1); setRefreshKey((k) => k + 1) }} searchActive={!!debouncedSearch} highlightedPostId={highlightedPostId} />
          {hasMore && !searching && (
            <button
              onClick={() => setPage((p) => p + 1)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 text-sm font-extrabold text-[#0d4697] shadow-sm transition hover:bg-slate-50"
            >
              Load more posts
            </button>
          )}
        </main>
        <MemberDiscovery members={members} scope={scope} search={debouncedSearch} />
      </div>
    </div>
  )
}
