import { useEffect, useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ArrowDownUp,
  Banknote,
  Download,
  FileText,
  Printer,
  ReceiptText,
  Search,
  Store,
  Trophy,
  UserRound,
  Users,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { scorecardApi } from '../../api/scorecard'

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const numberFormat = new Intl.NumberFormat('en-IN')

const today = new Date()
const defaultStartDate = new Date(today.getFullYear(), today.getMonth() - 11, 1).toISOString().slice(0, 10)
const defaultEndDate = today.toISOString().slice(0, 10)

const revenueColumns = [
  ['membershipRevenue', 'Membership Revenue'],
  ['vendorRevenue', 'Vendor Revenue'],
  ['totalEarned', 'Total Earned'],
]

const emptyData = {
  cards: {},
  charts: {},
  topEarners: [],
  pagination: { page: 1, limit: 10, total: 0, pages: 1 },
  filters: { roles: [] },
}

function money(value) {
  return currency.format(Number(value || 0))
}

function compactMoney(value) {
  const numeric = Number(value || 0)
  if (numeric >= 10000000) return `${currency.format(numeric / 10000000)} Cr`
  if (numeric >= 100000) return `${currency.format(numeric / 100000)} L`
  return money(numeric)
}

function ChartPanel({ title, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <h2 className="text-sm font-black text-slate-950">{title}</h2>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0d4697] bg-blue-50 px-2 py-0.5 rounded sm:hidden">Swipe graph →</span>
      </div>
      <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50/60 p-2 shadow-inner overflow-hidden">
        <div className="h-72 w-full overflow-x-auto overflow-y-hidden [scrollbar-width:thin] touch-pan-x">
          {children}
        </div>
      </div>
    </section>
  )
}

function Card({ label, value, helper, icon: Icon }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase text-slate-500">{label}</p>
          <p className="mt-2 break-words text-2xl font-black text-slate-950">{value}</p>
          {helper ? <p className="mt-1 text-xs font-bold text-[#1558b0]">{helper}</p> : null}
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#eef4ff] text-[#1558b0]">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </article>
  )
}

export default function EnterpriseScorecardPage() {
  const [filters, setFilters] = useState({
    searchName: '',
    searchOfficialId: '',
    role: '',
    startDate: defaultStartDate,
    endDate: defaultEndDate,
    sortBy: 'totalEarned',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  })
  const [data, setData] = useState(emptyData)
  const [searchNameInput, setSearchNameInput] = useState('')
  const [searchOfficialIdInput, setSearchOfficialIdInput] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((current) => {
        if (current.searchName === searchNameInput && current.searchOfficialId === searchOfficialIdInput) return current
        return { ...current, searchName: searchNameInput, searchOfficialId: searchOfficialIdInput, page: 1 }
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [searchNameInput, searchOfficialIdInput])

  useEffect(() => {
    let cancelled = false
    scorecardApi.enterprise(filters)
      .then((response) => {
        if (!cancelled) setData(response.data?.data || emptyData)
      })
      .catch(() => {
        if (!cancelled) setData(emptyData)
      })
    return () => {
      cancelled = true
    }
  }, [filters])

  const cards = data.cards || {}
  const charts = data.charts || {}
  const rows = data.topEarners || []
  const pagination = data.pagination || emptyData.pagination
  const roles = data.filters?.roles || []

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value, page: key === 'page' ? value : 1 }))
  }

  const toggleSort = (key) => {
    setFilters((current) => ({
      ...current,
      sortBy: key,
      sortOrder: current.sortBy === key && current.sortOrder === 'desc' ? 'asc' : 'desc',
      page: 1,
    }))
  }

  const visibleRange = useMemo(() => {
    const from = pagination.total ? (pagination.page - 1) * pagination.limit + 1 : 0
    const to = Math.min(pagination.page * pagination.limit, pagination.total)
    return `${from}-${to} of ${pagination.total}`
  }, [pagination])

  const exportRows = async () => {
    const response = await scorecardApi.enterprise({ ...filters, page: 1, limit: 1000 })
    return response.data?.data?.topEarners || []
  }

  const exportExcel = async () => {
    try {
      const exportData = await exportRows()
      const header = ['Rank', 'Official ID', 'Name', 'Role', 'Members Added', 'Vendors Added', 'Membership Revenue', 'Vendor Revenue', 'Total Earned']
      const lines = [
        header.join(','),
        ...exportData.map((row) => [
          row.rank,
          row.officialId,
          row.name,
          row.roleLabel,
          row.membersAdded,
          row.vendorsAdded,
          row.membershipRevenue,
          row.vendorRevenue,
          row.totalEarned,
        ].map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')),
      ]
      const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'enterprise-scorecard.csv'
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Unable to export scorecard')
    }
  }

  const exportPdf = async () => {
    const exportData = await exportRows()
    const popup = window.open('', '_blank')
    if (!popup) {
      toast.error('Enable popups to export PDF')
      return
    }
    popup.document.write(`
      <html>
        <head><title>Enterprise Scorecard</title></head>
        <body>
          <h1>Enterprise Scorecard</h1>
          <table border="1" cellspacing="0" cellpadding="6">
            <thead><tr><th>Rank</th><th>Official ID</th><th>Name</th><th>Role</th><th>Members Added</th><th>Vendors Added</th><th>Membership Revenue</th><th>Vendor Revenue</th><th>Total Earned</th></tr></thead>
            <tbody>${exportData.map((row) => `<tr><td>${row.rank}</td><td>${row.officialId}</td><td>${row.name}</td><td>${row.roleLabel}</td><td>${row.membersAdded}</td><td>${row.vendorsAdded}</td><td>${money(row.membershipRevenue)}</td><td>${money(row.vendorRevenue)}</td><td>${money(row.totalEarned)}</td></tr>`).join('')}</tbody>
          </table>
        </body>
      </html>
    `)
    popup.document.close()
    popup.print()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-[#1558b0]">Organization-Wide Performance</p>
          <h1 className="text-2xl font-black text-slate-950">Enterprise Scorecard</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => handleExport('excel')} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50">
            <Download className="h-4 w-4" /> Excel
          </button>
          <button onClick={() => handleExport('pdf')} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50">
            <FileText className="h-4 w-4" /> PDF
          </button>
        </div>
      </div>

      <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
        <label className="text-xs font-black uppercase text-slate-500">
          Name
          <input type="text" placeholder="Search name" value={searchNameInput} onChange={(e) => setSearchNameInput(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none" />
        </label>
        <label className="text-xs font-black uppercase text-slate-500">
          Official ID
          <input type="text" placeholder="Search ID" value={searchOfficialIdInput} onChange={(e) => setSearchOfficialIdInput(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none" />
        </label>
        <label className="text-xs font-black uppercase text-slate-500">
          Role
          <select value={filters.role} onChange={(event) => updateFilter('role', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none">
            {roles.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
          </select>
        </label>
        <label className="text-xs font-black uppercase text-slate-500">
          Start
          <input type="date" value={filters.startDate} onChange={(event) => updateFilter('startDate', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none" />
        </label>
        <label className="text-xs font-black uppercase text-slate-500">
          End
          <input type="date" value={filters.endDate} onChange={(event) => updateFilter('endDate', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none" />
        </label>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card label="Total Revenue Generated" value={compactMoney(cards.totalRevenueGenerated)} icon={Banknote} />
        <Card label="Total Membership Revenue" value={compactMoney(cards.totalMembershipRevenue)} icon={Users} />
        <Card label="Total Vendor Revenue" value={compactMoney(cards.totalVendorRevenue)} icon={Store} />
        <Card label="Total Members" value={numberFormat.format(cards.totalMembers || 0)} icon={Users} />
        <Card label="Total Vendors" value={numberFormat.format(cards.totalVendors || 0)} icon={Store} />
        <Card label="Total Transactions" value={numberFormat.format(cards.totalTransactions || 0)} icon={ReceiptText} />
        <Card label="Highest Earner" value={cards.highestEarner?.name || '-'} helper={cards.highestEarner ? money(cards.highestEarner.totalEarned) : ''} icon={Trophy} />
        <Card label="Average Revenue per User" value={compactMoney(cards.averageRevenuePerUser)} icon={UserRound} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartPanel title="Revenue by Role">
          <div className="h-full min-w-[620px] sm:min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.revenueByRole || []} margin={{ bottom: 25, left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="roleLabel" interval={0} angle={-35} textAnchor="end" height={80} tick={{ fontSize: 11, fontWeight: 700 }} />
                <YAxis tickFormatter={compactMoney} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => money(value)} />
                <Bar dataKey="revenue" fill="#1558b0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
        <ChartPanel title="Monthly Revenue Trend">
          <div className="h-full min-w-[450px] sm:min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.monthlyRevenueTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={compactMoney} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => money(value)} />
                <Line type="monotone" dataKey="totalRevenue" stroke="#1558b0" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
        <ChartPanel title="Membership Revenue vs Vendor Revenue">
          <div className="h-full min-w-[450px] sm:min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.membershipVsVendorRevenue || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={compactMoney} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => money(value)} />
                <Area type="monotone" dataKey="membershipRevenue" stroke="#1558b0" fill="#bfdbfe" />
                <Area type="monotone" dataKey="vendorRevenue" stroke="#0f766e" fill="#99f6e4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
        <ChartPanel title="Top 10 Earners">
          <div className="h-full min-w-[400px] sm:min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.topEarners || []} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tickFormatter={compactMoney} tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => money(value)} />
                <Bar dataKey="totalEarned" fill="#1558b0" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
        <ChartPanel title="Top 10 Members Added">
          <div className="h-full min-w-[450px] sm:min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.topMembersAdded || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="membersAdded" fill="#0f766e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
        <ChartPanel title="Top 10 Vendors Added">
          <div className="h-full min-w-[450px] sm:min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.topVendorsAdded || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="vendorsAdded" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4">
          <h2 className="text-sm font-black text-slate-950">Top Earners</h2>
          <span className="text-xs font-bold text-slate-500">{visibleRange}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                {['Rank', 'Official ID', 'Name', 'Role', 'Members Added', 'Vendors Added'].map((head) => <th key={head} className="px-4 py-3 text-left font-black">{head}</th>)}
                {revenueColumns.map(([key, label]) => (
                  <th key={key} className="px-4 py-3 text-left font-black">
                    <button type="button" onClick={() => toggleSort(key)} className="inline-flex items-center gap-1">
                      {label}<ArrowDownUp className="h-3.5 w-3.5" />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-black text-slate-900">{row.rank}</td>
                  <td className="px-4 py-3 font-bold text-slate-600">{row.officialId}</td>
                  <td className="px-4 py-3 font-black text-slate-900">{row.name}</td>
                  <td className="px-4 py-3 text-slate-600">{row.roleLabel}</td>
                  <td className="px-4 py-3 text-slate-600">{numberFormat.format(row.membersAdded || 0)}</td>
                  <td className="px-4 py-3 text-slate-600">{numberFormat.format(row.vendorsAdded || 0)}</td>
                  <td className="px-4 py-3 font-bold text-slate-700">{money(row.membershipRevenue)}</td>
                  <td className="px-4 py-3 font-bold text-slate-700">{money(row.vendorRevenue)}</td>
                  <td className="px-4 py-3 font-black text-slate-950">{money(row.totalEarned)}</td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-sm font-bold text-slate-500">No scorecard data found.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <select value={filters.limit} onChange={(event) => updateFilter('limit', Number(event.target.value))} className="w-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-extrabold text-slate-900 shadow-sm outline-none focus:border-[#0d4697]">
              {[10, 25, 50].map((limit) => <option key={limit} value={limit} className="bg-white text-slate-900 font-bold">{limit} rows</option>)}
            </select>
            <span className="text-xs font-extrabold text-slate-600">Showing {visibleRange}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-extrabold text-slate-700">Page {pagination.page} of {pagination.pages}</span>
            <div className="flex items-center gap-2">
              <button type="button" disabled={pagination.page <= 1} onClick={() => updateFilter('page', pagination.page - 1)} className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-black text-slate-800 shadow-sm transition hover:border-[#0d4697] hover:bg-[#0d4697] hover:text-white disabled:cursor-not-allowed disabled:opacity-50">Previous</button>
              <button type="button" disabled={pagination.page >= pagination.pages} onClick={() => updateFilter('page', pagination.page + 1)} className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-black text-slate-800 shadow-sm transition hover:border-[#0d4697] hover:bg-[#0d4697] hover:text-white disabled:cursor-not-allowed disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
