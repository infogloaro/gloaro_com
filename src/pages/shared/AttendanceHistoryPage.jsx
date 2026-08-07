import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CalendarDays, CheckCircle2, RotateCcw, Search, UserCheck, UserX } from 'lucide-react'
import { attendanceApi } from '../../api/attendance'
import { secretaryApi } from '../../api/secretary'
import { useAuth } from '../../hooks/useAuth'
import EmptyState from '../../components/common/EmptyState'
import LoadingScreen from '../../components/common/LoadingScreen'
import Pagination from '../../components/common/Pagination'
import StatusBadge from '../../components/common/StatusBadge'
import StatCard from '../../components/dashboard/StatCard'

const emptyFilters = {
  search: '',
  status: '',
  event: '',
  date: '',
  startDate: '',
  endDate: '',
  region: '',
  state: '',
  district: '',
  chapter: '',
  role: '',
  member: '',
  secretary: '',
  sort: '',
}

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('en-IN') : '-')
const formatTime = (value) => (value ? new Date(value).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '-')
const fieldClass = 'h-10 min-w-0 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-[#1558b0]'
const normalizeSearch = (value = '') => value.trim().replace(/\s+/g, ' ')
const MEMBER_ROLES = new Set(['customer', 'user', 'vendor'])

export default function AttendanceHistoryPage() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const eventId = searchParams.get('event') || ''
  const [filters, setFilters] = useState(emptyFilters)
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState([])
  const [summary, setSummary] = useState({ totalEvents: 0, present: 0, absent: 0, attendanceRate: 0, today: 0 })
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 })
  const [permissions, setPermissions] = useState({ canMark: false, visibleColumns: [] })
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState('')
  const hasLoadedRef = useRef(false)

  const isMemberAudience = MEMBER_ROLES.has(String(user?.role || '').toLowerCase())

  const load = useCallback(async () => {
    if (!hasLoadedRef.current) setLoading(true)
    try {
      const search = normalizeSearch(filters.search)
      const event = normalizeSearch(filters.event)
      const response = await attendanceApi.list({
        eventId: eventId || undefined,
        page,
        limit: 20,
        search: search || undefined,
        status: filters.status || undefined,
        role: filters.role || undefined,
        event: event || undefined,
        member: filters.member || undefined,
        secretary: filters.secretary || undefined,
        region: filters.region || undefined,
        state: filters.state || undefined,
        district: filters.district || undefined,
        chapter: filters.chapter || undefined,
        startDate: filters.startDate || filters.date || undefined,
        endDate: filters.endDate || filters.date || undefined,
        sort: filters.sort || undefined,
      })

      setRows(response.data?.data || [])
      const hasActiveFilters = Boolean(
        filters.search ||
        filters.status ||
        filters.role ||
        filters.event ||
        filters.member ||
        filters.secretary ||
        filters.startDate ||
        filters.endDate ||
        filters.date ||
        filters.region ||
        filters.state ||
        filters.district ||
        filters.chapter
      )
      if (!hasActiveFilters) setSummary(response.data?.summary || {})
      setPagination(response.data?.pagination || { currentPage: page, totalPages: 1 })
      setPermissions(response.data?.permissions || { canMark: false, visibleColumns: [] })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load attendance history')
    } finally {
      hasLoadedRef.current = true
      setLoading(false)
    }
  }, [
    eventId,
    filters.chapter,
    filters.date,
    filters.district,
    filters.endDate,
    filters.event,
    filters.member,
    filters.region,
    filters.role,
    filters.search,
    filters.secretary,
    filters.sort,
    filters.startDate,
    filters.state,
    filters.status,
    page,
  ])

  useEffect(() => {
    const timer = window.setTimeout(load, filters.search ? 300 : 0)
    return () => window.clearTimeout(timer)
  }, [filters.search, load])

  const setFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }))
    setPage(1)
  }

  const visible = (key) => permissions.visibleColumns?.includes(key)
  const reset = () => {
    setFilters(emptyFilters)
    setPage(1)
  }

  const mark = async (row, status) => {
    setSavingId(row._id)
    try {
      await secretaryApi.markEventAttendance(row.eventId, row._id, { status, attendanceDate: new Date().toISOString() })
      toast.success(`${row.member?.name || 'Member'} marked ${status === 'attended' ? 'present' : 'absent'}`)
      await load()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to mark attendance')
    } finally {
      setSavingId('')
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 pb-8">
      <header className="rounded-2xl border border-blue-900 bg-gradient-to-br from-[#0d4697] to-[#093574] px-6 py-5 text-white shadow-sm">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#ffbf1a]">Meetings & Attendance</p>
        <h2 className="mt-1 text-2xl font-black">Attendance History</h2>
        <p className="mt-1 text-sm font-semibold text-blue-100">Review event attendance, find member records, and mark attendance from one place.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        <StatCard label="Total Events" value={summary.totalEvents || 0} icon={CalendarDays} />
        <StatCard label="Present" value={summary.present || 0} icon={UserCheck} />
        <StatCard label="Absent" value={summary.absent || 0} icon={UserX} />
        <StatCard label="Attendance" value={`${summary.attendanceRate || 0}%`} icon={CheckCircle2} />
        <StatCard label="Today" value={summary.today || 0} icon={CalendarDays} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Filter attendance records</h3>
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-extrabold text-slate-600 transition hover:border-[#1558b0] hover:text-[#1558b0]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear filters
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6">
          <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 transition focus-within:border-[#1558b0] focus-within:ring-2 focus-within:ring-blue-50 lg:col-span-2">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              placeholder="Event, member, secretary..."
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
            />
          </label>
          <select value={filters.status} onChange={(e) => setFilter('status', e.target.value)} className={fieldClass}>
            <option value="">All status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="pending">Pending</option>
          </select>
          {!isMemberAudience && <input value={filters.role} onChange={(e) => setFilter('role', e.target.value)} placeholder="Member role" className={fieldClass} />}
          <input value={filters.event} onChange={(e) => setFilter('event', e.target.value)} placeholder="Event" className={fieldClass} />
          {visible('member') && <input value={filters.member} onChange={(e) => setFilter('member', e.target.value)} placeholder="Member" className={fieldClass} />}
          {!isMemberAudience && visible('secretary') && <input value={filters.secretary} onChange={(e) => setFilter('secretary', e.target.value)} placeholder="Coordinator" className={fieldClass} />}
          <input type="date" value={filters.startDate} onChange={(e) => setFilter('startDate', e.target.value)} className={fieldClass} />
          <input type="date" value={filters.endDate} onChange={(e) => setFilter('endDate', e.target.value)} className={fieldClass} />
          {visible('region') && <input value={filters.region} onChange={(e) => setFilter('region', e.target.value)} placeholder="Region" className={fieldClass} />}
          {visible('state') && <input value={filters.state} onChange={(e) => setFilter('state', e.target.value)} placeholder="State" className={fieldClass} />}
          {visible('district') && <input value={filters.district} onChange={(e) => setFilter('district', e.target.value)} placeholder="District" className={fieldClass} />}
          {visible('chapter') && <input value={filters.chapter} onChange={(e) => setFilter('chapter', e.target.value)} placeholder="Chapter" className={fieldClass} />}
          <select value={filters.sort || 'newest'} onChange={(e) => setFilter('sort', e.target.value)} className={fieldClass}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="event">Event name</option>
            <option value="member">Member name</option>
          </select>
        </div>
      </section>

      {loading ? (
        <LoadingScreen label="Loading attendance history..." />
      ) : rows.length ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1250px] table-auto text-left text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  {visible('event') && <th className="px-4 py-3">Event</th>}
                  {visible('eventDate') && <th className="px-4 py-3">Event Date & Time</th>}
                  {visible('region') && <th className="px-4 py-3">Region</th>}
                  {visible('state') && <th className="px-4 py-3">State</th>}
                  {visible('district') && <th className="px-4 py-3">District</th>}
                  {visible('chapter') && <th className="px-4 py-3">Chapter</th>}
                  {visible('secretary') && <th className="px-4 py-3">Coordinator</th>}
                  {visible('member') && <th className="px-4 py-3">Member</th>}
                  {visible('memberRole') && <th className="px-4 py-3">Role</th>}
                  {visible('attendanceTime') && <th className="px-4 py-3">Attendance Time</th>}
                  {visible('status') && <th className="px-4 py-3">Status</th>}
                  {visible('markedBy') && <th className="px-4 py-3">Marked By</th>}
                  {permissions.canMark && <th className="px-4 py-3">Mark Attendance</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row) => (
                  <tr key={`${row.eventId}-${row._id}`}>
                    {visible('event') && <td className="max-w-[240px] px-4 py-3 font-extrabold text-slate-950"><p className="break-words">{row.eventName}</p></td>}
                    {visible('eventDate') && <td className="whitespace-nowrap px-4 py-3"><p className="font-semibold">{formatDate(row.eventDate)}</p><p className="text-xs text-slate-500">{formatTime(row.startTime)} - {formatTime(row.endTime)}</p></td>}
                    {visible('region') && <td className="px-4 py-3">{row.region || '-'}</td>}
                    {visible('state') && <td className="px-4 py-3">{row.state || '-'}</td>}
                    {visible('district') && <td className="px-4 py-3">{row.district || '-'}</td>}
                    {visible('chapter') && <td className="px-4 py-3">{row.chapter || '-'}</td>}
                    {visible('secretary') && <td className="px-4 py-3">{row.secretary?.name || '-'}</td>}
                    {visible('member') && <td className="px-4 py-3"><p className="font-bold">{row.member?.name || 'Member'}</p><p className="text-xs text-slate-500">{row.member?.memberId || ''}</p></td>}
                    {visible('memberRole') && <td className="px-4 py-3">{row.memberRole || '-'}</td>}
                    {visible('attendanceTime') && <td className="whitespace-nowrap px-4 py-3">{row.attendanceTime ? `${formatDate(row.attendanceTime)} ${formatTime(row.attendanceTime)}` : '-'}</td>}
                    {visible('status') && <td className="px-4 py-3"><StatusBadge value={row.status} /></td>}
                    {visible('markedBy') && <td className="px-4 py-3">{row.markedBy?.name || '-'}</td>}
                    {permissions.canMark && <td className="px-4 py-3"><div className="flex whitespace-nowrap gap-2"><button disabled={savingId === row._id} onClick={() => mark(row, 'attended')} className="rounded-lg border border-emerald-300 px-3 py-2 text-xs font-extrabold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50">Present</button><button disabled={savingId === row._id} onClick={() => mark(row, 'no_show')} className="rounded-lg border border-red-300 px-3 py-2 text-xs font-extrabold text-red-700 transition hover:bg-red-50 disabled:opacity-50">Absent</button></div></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={pagination} onPageChange={setPage} />
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
          <EmptyState
            title={filters.search ? `No results for "${filters.search}"` : 'No attendance history'}
            description={filters.search ? 'Check the spelling or clear the search to view all attendance records.' : 'No records match the current scope and filters.'}
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => setFilter('search', '')}
              className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1558b0] px-4 text-sm font-extrabold text-white transition hover:bg-[#0d4697]"
            >
              <RotateCcw className="h-4 w-4" />
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  )
}
