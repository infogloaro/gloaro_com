import { Building2, CreditCard, FileText, Package, ShoppingBag, Users } from 'lucide-react'
import { adminApi } from '../../api/admin'
import { reportApi } from '../../api/report'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import StatusBadge from '../../components/common/StatusBadge'
import ChartCard from '../../components/charts/ChartCard'
import StatCard from '../../components/dashboard/StatCard'
import DataTable from '../../components/tables/DataTable'
import { useApi } from '../../hooks/useApi'
import { formatCurrency } from '../../utils/format'

const monthLabel = (item) => `${item._id?.month || ''}/${item._id?.year || ''}`

export default function AdminDashboard() {
  const dashboard = useApi(adminApi.dashboard)
  const analytics = useApi(() => reportApi.analytics({ from: '2025-01-01' }))

  if (dashboard.loading || analytics.loading) return <LoadingSpinner label="Loading admin dashboard" />

  const stats = dashboard.data || {}
  const report = analytics.data || {}

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users" value={stats.totalUsers} helper={`${stats.newUsersToday || 0} today`} icon={Users} />
        <StatCard label="Total Vendors" value={stats.totalVendors} helper={`${stats.pendingVendors || 0} pending`} icon={Building2} />
        <StatCard label="Products" value={stats.productsCount} icon={Package} />
        <StatCard label="Services" value={stats.servicesCount} icon={ShoppingBag} />
        <StatCard label="Revenue" value={formatCurrency(stats.revenue)} icon={CreditCard} />
        <StatCard label="Membership Revenue" value={formatCurrency(stats.membershipRevenue)} icon={CreditCard} />
        <StatCard label="Applications" value={stats.membershipApplicationsCount} helper={`${stats.pendingMembershipApplications || 0} new`} icon={FileText} />
        <StatCard label="Pending Vendors" value={stats.pendingVendors} icon={Building2} />
        <StatCard label="Verified Vendors" value={stats.verifiedVendors} icon={Building2} />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Monthly Revenue" data={(report.monthlyRevenue || []).map((item) => ({ label: monthLabel(item), revenue: item.revenue }))} dataKey="revenue" />
        <ChartCard title="Monthly Users" type="bar" data={(report.monthlyUsers || []).map((item) => ({ label: monthLabel(item), users: item.users }))} dataKey="users" />
        <ChartCard title="Monthly Vendors" type="bar" data={(report.monthlyVendors || []).map((item) => ({ label: monthLabel(item), vendors: item.vendors }))} dataKey="vendors" />
        <ChartCard title="Membership Sales" type="bar" data={(report.membershipSales || []).map((item) => ({ label: item._id, sales: item.sales }))} dataKey="sales" />
      </section>

      <DataTable
        columns={[
          { key: 'user', header: 'User', render: (row) => row.user?.name || row.user?.email || 'User' },
          { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.amount, row.currency) },
          { key: 'gateway', header: 'Gateway' },
          { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
        ]}
        rows={stats.recentPayments || []}
      />
    </div>
  )
}
