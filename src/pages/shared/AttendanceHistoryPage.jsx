import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CalendarDays, CheckCircle2, MapPinned, RotateCcw, Search, UserCheck, UserX } from 'lucide-react'
import api from '../../api/axios'
import { attendanceApi } from '../../api/attendance'
import { secretaryApi } from '../../api/secretary'
import EmptyState from '../../components/common/EmptyState'
import LoadingScreen from '../../components/common/LoadingScreen'
import Pagination from '../../components/common/Pagination'
import StatusBadge from '../../components/common/StatusBadge'
import StatCard from '../../components/dashboard/StatCard'

const emptyFilters = { search: '', status: '', event: '', date: '', region: '' }
const formatDate = (value) => (value ? new Date(value).toLocaleDateString('en-IN') : '-')
const formatTime = (value) => (value ? new Date(value).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '-')
const fieldClass = 'h-10 min-w-0 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-[#1558b0]'

const normalizeSearch = (value = '') => value.trim().replace(/\s+/g, ' ')

export default function AttendanceHistoryPage() {
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
  const [locations, setLocations] = useState([])
  const [loadingLocations, setLoadingLocations] = useState(true)

  useEffect(() => {
    let active = true

    api.get('/organization/locations')
      .then((response) => {
        if (!active) return
        setLocations(response.data?.data?.locations || [])
      })
      .catch((error) => {
        console.error('Unable to load attendance location filters', error)
        if (active) setLocations([])
      })
      .finally(() => {
        if (active) setLoadingLocations(false)
      })

    return () => {
      active = false
    }
  }, [])

  const regionOptions = useMemo(
    () => locations
      .filter((location) => location.type === 'region')
      .map((location) => ({
        value: location.code || location.name || location._id,
        label: location.name || location.code || 'Region',
      })),
    [locations],
  )

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const search = normalizeSearch(filters.search)
      const event = normalizeSearch(filters.event)
      const response = await attendanceApi.list({
        eventId: eventId || undefined,
        page,
        limit: 20,
        search: search || undefined,
        status: filters.status || undefined,
        event: event || undefined,
        region: filters.region || undefined,
        startDate: filters.date || undefined,
        endDate: filters.date || undefined,
      })

      setRows(response.data?.data || [])
      setSummary(response.data?.summary || {})
      setPagination(response.data?.pagination || { currentPage: page, totalPages: 1 })
      setPermissions(response.data?.permissions || { canMark: false, visibleColumns: [] })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load attendance history')
    } finally {
      setLoading(false)
    }
  }, [eventId, filters.date, filters.event, filters.region, filters.search, filters.status, page])

  useEffect(() => {
    const timer = window.setTimeout(load, 200)
    return () => window.clearTimeout(timer)
  }, [load])

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
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-extrabold text-slate-950">Attendance History</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">Central event attendance audit and history.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Events" value={summary.totalEvents || 0} icon={CalendarDays} />
        <StatCard label="Present" value={summary.present || 0} icon={UserCheck} />
        <StatCard label="Absent" value={summary.absent || 0} icon={UserX} />
        <StatCard label="Attendance %" value={`${summary.attendanceRate || 0}%`} icon={CheckCircle2} />
        <StatCard label="Today" value={summary.today || 0} icon={CalendarDays} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-5">
          <label className="flex h-10 items-center gap-2 rounded-md border border-slate-300 px-3 lg:col-span-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={filters.search}
              onChange={(event) => setFilter('search', event.target.value)}
              placeholder="Search event, member, secretary..."
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
            />
          </label>

          <select value={filters.status} onChange={(event) => setFilter('status', event.target.value)} className={fieldClass}>
            <option value="">All status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="pending">Pending</option>
          </select>

          <input type="date" value={filters.date} onChange={(event) => setFilter('date', event.target.value)} className={fieldClass} />

          <label className="flex h-10 items-center gap-2 rounded-md border border-slate-300 px-3">
            <MapPinned className="h-4 w-4 text-slate-400" />
            <select
              value={filters.region}
              onChange={(event) => setFilter('region', event.target.value)}
              disabled={loadingLocations}
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none disabled:cursor-not-allowed disabled:text-slate-400"
            >
              <option value="">{loadingLocations ? 'Loading regions...' : 'All Regions'}</option>
              {regionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <input
            value={filters.event}
            onChange={(event) => setFilter('event', event.target.value)}
            placeholder="Event"
            className={fieldClass}
          />

          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 px-3 text-sm font-extrabold text-slate-700"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </section>

      {loading ? (
        <LoadingScreen label="Loading attendance history..." />
      ) : rows.length ? (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                {visible('event') && <th className="px-4 py-3">Event</th>}
                {visible('eventDate') && <th className="px-4 py-3">Event Date & Time</th>}
                {visible('region') && <th className="px-4 py-3">Region</th>}
                {visible('state') && <th className="px-4 py-3">State</th>}
                {visible('district') && <th className="px-4 py-3">District</th>}
                {visible('chapter') && <th className="px-4 py-3">Chapter</th>}
                {visible('secretary') && <th className="px-4 py-3">Secretary</th>}
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
                  {visible('event') && <td className="px-4 py-3 font-extrabold text-slate-950">{row.eventName}</td>}
                  {visible('eventDate') && (
                    <td className="px-4 py-3">
                      <p className="font-semibold">{formatDate(row.eventDate)}</p>
                      <p className="text-xs text-slate-500">{formatTime(row.startTime)} - {formatTime(row.endTime)}</p>
                    </td>
                  )}
                  {visible('region') && <td className="px-4 py-3">{row.region || '-'}</td>}
                  {visible('state') && <td className="px-4 py-3">{row.state || '-'}</td>}
                  {visible('district') && <td className="px-4 py-3">{row.district || '-'}</td>}
                  {visible('chapter') && <td className="px-4 py-3">{row.chapter || '-'}</td>}
                  {visible('secretary') && <td className="px-4 py-3">{row.secretary?.name || '-'}</td>}
                  {visible('member') && (
                    <td className="px-4 py-3">
                      <p className="font-bold">{row.member?.name || 'Member'}</p>
                      <p className="text-xs text-slate-500">{row.member?.memberId || ''}</p>
                    </td>
                  )}
                  {visible('memberRole') && <td className="px-4 py-3">{row.memberRole || '-'}</td>}
                  {visible('attendanceTime') && <td className="px-4 py-3">{row.attendanceTime ? `${formatDate(row.attendanceTime)} ${formatTime(row.attendanceTime)}` : '-'}</td>}
                  {visible('status') && <td className="px-4 py-3"><StatusBadge value={row.status} /></td>}
                  {visible('markedBy') && <td className="px-4 py-3">{row.markedBy?.name || '-'}</td>}
                  {permissions.canMark && (
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          disabled={savingId === row._id}
                          onClick={() => mark(row, 'attended')}
                          className="rounded-md border border-emerald-300 px-3 py-1.5 text-xs font-extrabold text-emerald-700 disabled:opacity-50"
                        >
                          Present
                        </button>
                        <button
                          disabled={savingId === row._id}
                          onClick={() => mark(row, 'no_show')}
                          className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-extrabold text-red-700 disabled:opacity-50"
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination pagination={pagination} onPageChange={setPage} />
        </div>
      ) : (
        <EmptyState title="No attendance history" description="No records match the current scope and filters." />
      )}
    </div>
  )
}
