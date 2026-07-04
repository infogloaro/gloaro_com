import { Building2, CreditCard, FileText, Package, ShoppingBag, Users } from 'lucide-react'
import { adminApi } from '../../api/admin'
import { reportApi } from '../../api/report'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import StatusBadge from '../../components/common/StatusBadge'
import ChartCard from '../../components/charts/ChartCard'
import StatCard from '../../components/dashboard/StatCard'
import DataTable from '../../components/tables/DataTable'
import { useAuth } from '../../hooks/useAuth'
import { useApi } from '../../hooks/useApi'
import { formatCurrency } from '../../utils/format'

const monthLabel = (item) => `${item._id?.month || ''}/${item._id?.year || ''}`
const statusValue = (value) => Number(value || 0) > 0 ? value : 'Pending'

export default function AdminDashboard() {
  const { hasOperation, hasSection, hasWidget } = useAuth()
  const canView = hasOperation('dashboard', 'view')
  const showOverview = hasSection('dashboard', 'overview')
  const showAnalytics = hasSection('dashboard', 'analytics')
  const showPayments = hasSection('dashboard', 'payments')
  const dashboard = useApi(adminApi.dashboard, [canView], { immediate: canView })
  const analytics = useApi(() => reportApi.analytics({ from: '2025-01-01' }), [canView, showAnalytics], { immediate: canView && showAnalytics })

  if (!canView) return null

  if (dashboard.loading || analytics.loading) return <LoadingSpinner label="Loading admin dashboard" />

  const stats = dashboard.data || {}
  const report = analytics.data || {}
  const applicationStatuses = stats.applicationStatusCounts || {}
  const overviewCards = [
    ['approvals', 'Documents Verified', statusValue(applicationStatuses.documentsVerified), undefined, FileText],
    ['approvals', 'Under Review', statusValue(applicationStatuses.underReview), undefined, FileText],
    ['approvals', 'Final Approval', statusValue(applicationStatuses.finalApproval), undefined, FileText],
    ['members', 'Total Users', stats.totalUsers, `${stats.newUsersToday || 0} today`, Users],
    ['vendors', 'Total Vendors', stats.totalVendors, `${stats.pendingVendors || 0} pending`, Building2],
    ['marketplace', 'Products', stats.productsCount, undefined, Package],
    ['marketplace', 'Services', stats.servicesCount, undefined, ShoppingBag],
    ['reports', 'Revenue', formatCurrency(stats.revenue), undefined, CreditCard],
    ['reports', 'Membership Revenue', formatCurrency(stats.membershipRevenue), undefined, CreditCard],
    ['members', 'Applications', stats.membershipApplicationsCount, `${stats.pendingMembershipApplications || 0} new`, FileText],
    ['vendors', 'Pending Vendors', stats.pendingVendors, undefined, Building2],
    ['vendors', 'Verified Vendors', stats.verifiedVendors, undefined, Building2],
  ].filter(([widget]) => hasWidget(widget))

  return (
    <div className="space-y-6">
      {showOverview && <section className="grid gap-4 md:grid-cols-3">
        {overviewCards.slice(0, 3).map(([, label, value, helper, Icon]) => <StatCard key={label} label={label} value={value} helper={helper} icon={Icon} />)}
      </section>}

      {showOverview && <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewCards.slice(3).map(([, label, value, helper, Icon]) => <StatCard key={label} label={label} value={value} helper={helper} icon={Icon} />)}
      </section>}

      {showAnalytics && <section className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Monthly Revenue" data={(report.monthlyRevenue || []).map((item) => ({ label: monthLabel(item), revenue: item.revenue }))} dataKey="revenue" />
        <ChartCard title="Monthly Users" type="bar" data={(report.monthlyUsers || []).map((item) => ({ label: monthLabel(item), users: item.users }))} dataKey="users" />
        <ChartCard title="Monthly Vendors" type="bar" data={(report.monthlyVendors || []).map((item) => ({ label: monthLabel(item), vendors: item.vendors }))} dataKey="vendors" />
        <ChartCard title="Membership Sales" type="bar" data={(report.membershipSales || []).map((item) => ({ label: item._id, sales: item.sales }))} dataKey="sales" />
      </section>}

      {showPayments && hasWidget('reports') && <DataTable
        columns={[
          { key: 'user', header: 'User', render: (row) => row.user?.name || row.user?.email || 'User' },
          { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.amount, row.currency) },
          { key: 'gateway', header: 'Gateway' },
          { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
        ]}
        rows={stats.recentPayments || []}
      />}
    </div>
  )
}
