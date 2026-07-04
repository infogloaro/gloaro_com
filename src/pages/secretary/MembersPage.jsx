import { useState, useEffect, useMemo, useCallback } from 'react'
import { secretaryApi } from '../../api/secretary'
import StatusBadge from '../../components/common/StatusBadge'
import SearchBar from '../../components/common/SearchBar'
import StatCard from '../../components/dashboard/StatCard'
import DataTable from '../../components/tables/DataTable'
import { formatDate, getList, getPagination } from '../../utils/format'
import { Users } from 'lucide-react'

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'phone', header: 'Phone', render: (row) => row.phone || 'Not provided' },
  { key: 'isActive', header: 'Status', render: (row) => <StatusBadge value={row.isActive ? 'active' : 'suspended'} /> },
  { key: 'createdAt', header: 'Joined Date', render: (row) => formatDate(row.createdAt) }
]

export default function MembersPage() {
  const [payload, setPayload] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const params = useMemo(() => ({
    page,
    limit: 10,
    search: search || undefined,
    status: status || undefined
  }), [page, search, status])

  // TODO: When the Chapter Management module is implemented,
  // scope all member queries and summary statistics using req.user.chapterId
  // so each Secretary only accesses members, meetings, attendance, documents,
  // and reports belonging to their assigned chapter.
  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await secretaryApi.members(params)
      setPayload(response.data)
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    const timer = window.setTimeout(() => load(), 0)
    return () => window.clearTimeout(timer)
  }, [load])

  const rows = getList(payload)
  const pagination = getPagination(payload)
  const summary = payload?.summary || { totalMembers: 0, activeMembers: 0, inactiveMembers: 0 }

  return (
    <section className="space-y-6">
      {/* Title & Filter Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">Member Roster</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">View and filter chapter member profiles directory.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <SearchBar 
            value={search} 
            onChange={(value) => { setSearch(value); setPage(1) }} 
            placeholder="Search roster" 
          />
          <select 
            value={status} 
            onChange={(e) => { setStatus(e.target.value); setPage(1) }} 
            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800"
          >
            <option value="">Filter by Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Members" value={summary.totalMembers} icon={Users} />
        <StatCard label="Active Members" value={summary.activeMembers} icon={Users} />
        <StatCard label="Inactive Members" value={summary.inactiveMembers} icon={Users} />
      </div>

      {/* Roster Listing Grid Table */}
      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        pagination={pagination}
        onPageChange={setPage}
      />
    </section>
  )
}
