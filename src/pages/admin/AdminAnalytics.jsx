import { reportApi } from '../../api/report'
import LoadingScreen from '../../components/common/LoadingScreen'
import ChartCard from '../../components/charts/ChartCard'
import DataTable from '../../components/tables/DataTable'
import { useAuth } from '../../hooks/useAuth'
import { useApi } from '../../hooks/useApi'

const label = (item) => `${item._id?.month}/${item._id?.year}`

export default function AdminAnalytics() {
  const { hasSection, hasOperation } = useAuth()
  const canView = hasSection('reports', 'analytics') && hasOperation('reports', 'view')
  const { data, loading } = useApi(() => reportApi.analytics({ from: '2025-01-01' }), [canView], { immediate: canView })
  if (!canView) return null
  if (loading) return <LoadingScreen label="Loading analytics..." />
  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Monthly Revenue" data={(data.monthlyRevenue || []).map((item) => ({ label: label(item), revenue: item.revenue }))} dataKey="revenue" />
        <ChartCard title="Membership Sales" type="bar" data={(data.membershipSales || []).map((item) => ({ label: item._id, sales: item.sales }))} dataKey="sales" />
      </div>
      <DataTable title="Top Vendors" columns={[{ key: 'businessName', header: 'Vendor' }, { key: 'leads', header: 'Leads', render: (row) => row.stats?.totalLeads || 0 }, { key: 'views', header: 'Views', render: (row) => row.stats?.totalViews || 0 }]} rows={data.topVendors || []} />
      <DataTable columns={[{ key: 'name', header: 'Category' }, { key: 'vendorCount', header: 'Vendors' }]} rows={data.topCategories || []} />
    </div>
  )
}
