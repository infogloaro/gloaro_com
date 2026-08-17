import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { reportApi } from '../../api/report'
import LoadingScreen from '../../components/common/LoadingScreen'
import DataTable from '../../components/tables/DataTable'
import { ROLES } from '../../constants/roleConfig'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Handshake, 
  CalendarDays, 
  Clock, 
  Package, 
  BriefcaseBusiness,
  Briefcase,
  Award,
  CalendarCheck,
  CheckSquare,
  Sparkles,
  Trophy,
  Receipt,
  Filter,
  IndianRupee,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts'

export default function AnalyticsPage() {
  const { user, hasModule } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('this_month')
  const [customRange, setCustomRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange, customRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const params = {
        dateRange
      }
      if (dateRange === 'custom') {
        params.from = customRange.from
        params.to = customRange.to
      }
      const response = await reportApi.analytics(params)
      setData(response.data?.data || response.data || {})
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingScreen label="Loading analytics..." />
  }

  const role = user?.role || ''
  const scope = data?.scope || 'me'
  const contextName = data?.contextName || 'My'
  const overview = data?.overview || {}
  const monthlyRevenue = data?.monthlyRevenue || []
  const monthlyUsers = data?.monthlyUsers || []
  const monthlyVendors = data?.monthlyVendors || []
  const myReferralTrend = data?.myReferralTrend || []
  const myBusinessTrend = data?.myBusinessTrend || []
  const recentTransactions = data?.recentTransactions || []
  const recentReferrals = data?.recentReferrals || []
  const topVendors = data?.topVendors || []
  const topCategories = data?.topCategories || []

  // Helper to format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0)
  }

  // Format month label for trends
  const formatMonthLabel = (item) => {
    if (!item?._id) return ''
    return `${item._id.month}/${item._id.year}`
  }

  // Check if chart data actually contains non-zero entries
  const hasChartData = (arr, key) => {
    return arr && arr.length > 0 && arr.some(item => Number(item[key] || 0) > 0)
  }

  // Reusable card for numbers
  const MetricCard = ({ title, value, icon: Icon, description }) => (
    <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
          <h4 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{value}</h4>
        </div>
        <div className="rounded-xl bg-slate-50 p-2.5 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {description && (
        <p className="mt-3 text-xs font-semibold text-slate-400 dark:text-slate-500">
          {description}
        </p>
      )}
    </div>
  )

  // Empty state placeholder
  const EmptyState = ({ title }) => (
    <div className="flex h-56 flex-col items-center justify-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 dark:bg-slate-800/40 dark:border-slate-800 p-6">
      <BarChart3 className="h-8 w-8 text-slate-300 dark:text-slate-700 mb-2" />
      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{title}</p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">No data available for this period.</p>
    </div>
  )

  // Chart Container
  const ChartContainer = ({ title, data = [], dataKey, type = 'line' }) => {
    const isDataAvailable = hasChartData(data, dataKey)
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">{title}</h3>
        <div className="h-72">
          {isDataAvailable ? (
            <ResponsiveContainer width="100%" height="100%">
              {type === 'bar' ? (
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey={dataKey} fill="#1558b0" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey={dataKey} stroke="#1558b0" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 dark:bg-slate-800/40 dark:border-slate-800">
              <BarChart3 className="h-8 w-8 text-slate-300 dark:text-slate-700 mb-2" />
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No data available</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Section wrapper to display conditionally
  const AnalyticsSection = ({ title, children }) => (
    <div className="space-y-4">
      <div className="border-b border-slate-100 pb-2 dark:border-slate-800">
        <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide">{title}</h2>
      </div>
      {children}
    </div>
  )

  const getHeaderTitle = () => {
    if (role === ROLES.SUPERADMIN) return "Organization Analytics";
    if ([ROLES.ADMIN, ROLES.MARKETPLACE_ADMIN, ROLES.TRAINING_ADMIN, ROLES.FINANCE_ADMIN, ROLES.MEMBERSHIP_VERIFICATION_ADMIN, ROLES.CUSTOM_ADMIN].includes(role)) {
      return "Organization Analytics";
    }
    if (scope === 'jurisdiction') return `${contextName} Analytics`;
    if (scope === 'vendor') return "My Business Analytics";
    return "My Performance & Activity";
  }

  const getHeaderSubtitle = () => {
    if (scope === 'me') return `Performance overview for ${contextName}`;
    if (scope === 'vendor') return `Marketplace listing and sales analytics for ${contextName}`;
    return `Jurisdiction-wide metrics and growth trends for ${contextName}`;
  }

  // Calculate dynamic KPI list based on module access & scope
  const isMe = scope === 'me'
  const isVendor = scope === 'vendor'
  const isJurisdiction = scope === 'jurisdiction'

  const kpiCards = []
  
  if (hasModule('referrals')) {
    const val = isMe ? (overview.referrals?.total || 0) : (isVendor ? (overview.marketplace?.inquiries || 0) : (overview.totalReferrals || 0))
    kpiCards.push({ title: 'Total Connects / Referrals', value: val, icon: Handshake })
    if (isMe && overview.business?.total > 0) {
      kpiCards.push({ title: 'Business Opportunities', value: overview.business?.total || 0, icon: Briefcase })
      kpiCards.push({ title: 'Business Won', value: overview.business?.won || 0, icon: Award })
      kpiCards.push({ title: 'Business Earnings', value: formatCurrency(overview.business?.earnings), icon: IndianRupee })
    }
  }
  if (hasModule('marketplace')) {
    if (isMe && overview.marketplace?.products > 0) {
      kpiCards.push({ title: 'Total Products', value: overview.marketplace?.products || 0, icon: Package })
      kpiCards.push({ title: 'Total Services', value: overview.marketplace?.services || 0, icon: BriefcaseBusiness })
    } else if (isVendor) {
      kpiCards.push({ title: 'Total Products', value: overview.marketplace?.products || 0, icon: Package })
      kpiCards.push({ title: 'Total Services', value: overview.marketplace?.services || 0, icon: BriefcaseBusiness })
    } else if (isJurisdiction) {
      kpiCards.push({ title: 'Total Products', value: overview.products || 0, icon: Package })
      kpiCards.push({ title: 'Total Services', value: overview.services || 0, icon: BriefcaseBusiness })
    }
  }
  if (hasModule('orders') || hasModule('marketplace')) {
    const val = isMe ? (overview.marketplace?.orders || 0) : (isVendor ? (overview.marketplace?.orders || 0) : (overview.orders || 0))
    kpiCards.push({ title: 'Total Orders', value: val, icon: ShoppingBag })
  }
  if (hasModule(ROLES.VENDOR) && isJurisdiction) {
    kpiCards.push({ title: 'Total Vendors', value: overview.totalVendors || 0, icon: BriefcaseBusiness })
  }
  if (hasModule('members') && isJurisdiction) {
    kpiCards.push({ title: 'Total Members', value: overview.totalMembers || 0, icon: Users })
  }
  if (hasModule('meetings') || hasModule('attendance')) {
    const val = isMe ? ((overview.meetings?.completed || 0) + (overview.meetings?.scheduled || 0)) : (overview.meetings || 0)
    kpiCards.push({ title: 'Total Meetings', value: val, icon: CalendarDays })
  }
  if (hasModule('attendance')) {
    const val = isMe ? (overview.meetings?.attendanceCount || 0) : (overview.attendance || 0)
    kpiCards.push({ title: 'Total Attendance', value: val, icon: CalendarCheck })
  }
  if (hasModule('training')) {
    const val = isMe ? (overview.training?.sessions || 0) : (overview.training || 0)
    kpiCards.push({ title: 'Total Training Activities', value: val, icon: Sparkles })
  }
  if (hasModule('finance') || hasModule('payments')) {
    const val = isMe ? (overview.revenue?.revenue || 0) : (isVendor ? (overview.marketplace?.revenue || 0) : (overview.totalRevenue || 0))
    kpiCards.push({ title: 'Total Revenue', value: formatCurrency(val), icon: DollarSign })
  }
  if ((hasModule('finance') || hasModule('payments')) && (isVendor || isJurisdiction)) {
    const val = isVendor ? (overview.marketplace?.transactions || 0) : (overview.totalTransactions || 0)
    kpiCards.push({ title: 'Total Transactions', value: val, icon: Receipt })
  }
  if (hasModule('tasks')) {
    const val = isMe ? (overview.tasks?.total || 0) : (isVendor ? (overview.tasks?.total || 0) : (overview.tasks || 0))
    kpiCards.push({ title: 'Total Tasks', value: val, icon: CheckSquare })
  }
  if (hasModule('events')) {
    const val = isMe ? ((overview.events?.created || 0) + (overview.events?.joined || 0)) : (overview.events || 0)
    kpiCards.push({ title: 'Total Events', value: val, icon: CalendarCheck })
  }

  return (
    <section className="space-y-8 p-1">
      {/* Header */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">{getHeaderTitle()}</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{getHeaderSubtitle()}</p>
        </div>

        {/* Date Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white p-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border-0 bg-transparent text-xs font-bold text-slate-700 focus:outline-none focus:ring-0 dark:text-slate-300"
            >
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="this_year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {dateRange === 'custom' && (
            <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <input
                type="date"
                value={customRange.from}
                onChange={(e) => setCustomRange(prev => ({ ...prev, from: e.target.value }))}
                className="rounded-lg border-0 bg-transparent px-2 py-1 text-xs font-bold text-slate-700 focus:outline-none dark:text-slate-300"
              />
              <span className="text-xs font-black text-slate-400">TO</span>
              <input
                type="date"
                value={customRange.to}
                onChange={(e) => setCustomRange(prev => ({ ...prev, to: e.target.value }))}
                className="rounded-lg border-0 bg-transparent px-2 py-1 text-xs font-bold text-slate-700 focus:outline-none dark:text-slate-300"
              />
            </div>
          )}
        </div>
      </div>

      {/* Summary KPI Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.slice(0, 8).map((card, i) => (
          <MetricCard key={i} title={card.title} value={card.value} icon={card.icon} />
        ))}
      </div>

      {/* Detailed sections */}
      
      {/* ---------------------------------------------------- */}
      {/* 1. MEMBER SCOPE SECTIONS */}
      {/* ---------------------------------------------------- */}
      {scope === 'me' && (
        <div className="space-y-8">
          
          {/* Referrals */}
          {hasModule('referrals') && (
            <AnalyticsSection title="My Referral Performance">
              {overview.referrals?.total > 0 ? (
                <div className="space-y-6">
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <MetricCard title="Total Referrals" value={overview.referrals?.total || 0} icon={Handshake} />
                    <MetricCard title="Pending" value={overview.referrals?.pending || 0} icon={Clock} />
                    <MetricCard title="Won" value={overview.referrals?.won || 0} icon={Award} />
                    <MetricCard title="Conversion Rate" value={`${overview.referrals?.conversionRate || 0}%`} icon={TrendingUp} />
                  </div>
                  <div className="grid gap-6 xl:grid-cols-3">
                    <ChartContainer
                      title="My Referral Trend"
                      data={myReferralTrend.map(item => ({ label: formatMonthLabel(item), count: item.count }))}
                      dataKey="count"
                    />
                    <ChartContainer
                      title="My Business Generated Trend"
                      data={myBusinessTrend.map(item => ({ label: formatMonthLabel(item), amount: item.amount }))}
                      dataKey="amount"
                    />
                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">Referral Stage Distribution</h3>
                      <div className="h-64 flex flex-col justify-center gap-4">
                        <div className="flex justify-between border-b border-slate-50 pb-2 dark:border-slate-800">
                          <span className="text-xs font-bold text-slate-500">Contacted</span>
                          <span className="text-xs font-black text-slate-900 dark:text-white">{overview.referrals?.contacted || 0}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-2 dark:border-slate-800">
                          <span className="text-xs font-bold text-slate-500">Meeting Scheduled</span>
                          <span className="text-xs font-black text-slate-900 dark:text-white">{overview.referrals?.meetingScheduled || 0}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-2 dark:border-slate-800">
                          <span className="text-xs font-bold text-slate-500">Negotiation</span>
                          <span className="text-xs font-black text-slate-900 dark:text-white">{overview.referrals?.negotiation || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs font-bold text-slate-500">Won / Lost</span>
                          <span className="text-xs font-black text-emerald-600">
                            {overview.referrals?.won || 0} <span className="text-slate-300 dark:text-slate-700">/</span> {overview.referrals?.lost || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState title="My Referral Activity" />
              )}
            </AnalyticsSection>
          )}

          {/* Business Connect Performance */}
          {hasModule('referrals') && overview.business && (
            <AnalyticsSection title="My Business Connect Performance">
              <div className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <MetricCard title="Business Opportunities" value={overview.business.total || 0} icon={Briefcase} />
                  <MetricCard title="Business Won" value={overview.business.won || 0} icon={Award} />
                  <MetricCard title="Business Earnings" value={formatCurrency(overview.business.earnings)} icon={IndianRupee} />
                  <MetricCard title="Conversion Rate" value={`${overview.business.conversionRate || 0}%`} icon={TrendingUp} />
                </div>
                <div className="grid gap-6 xl:grid-cols-3">
                  <ChartContainer
                    title="Business Created Trend"
                    data={(overview.business.monthlyTrend || []).map(item => ({ label: item.label, count: item.count }))}
                    dataKey="count"
                  />
                  <ChartContainer
                    title="Business Earnings Trend"
                    data={(overview.business.monthlyTrend || []).map(item => ({ label: item.label, amount: item.earnings }))}
                    dataKey="amount"
                  />
                  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">Business Stage Distribution</h3>
                    <div className="h-64 flex flex-col justify-center gap-4">
                      {[
                        ['created', 'Created'],
                        ['contacted', 'Contacted'],
                        ['meeting_scheduled', 'Meeting Scheduled'],
                        ['proposal_sent', 'Proposal Sent'],
                        ['negotiation', 'Negotiation'],
                      ].map(([key, label]) => (
                        <div key={key} className="flex justify-between border-b border-slate-50 pb-2 dark:border-slate-800">
                          <span className="text-xs font-bold text-slate-500">{label}</span>
                          <span className="text-xs font-black text-slate-900 dark:text-white">{overview.business[key] || 0}</span>
                        </div>
                      ))}
                      <div className="flex justify-between">
                        <span className="text-xs font-bold text-slate-500">Won / Lost</span>
                        <span className="text-xs font-black text-emerald-600">
                          {overview.business.won || 0} <span className="text-slate-300 dark:text-slate-700">/</span> {overview.business.lost || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnalyticsSection>
          )}

          {/* Meetings */}
          {hasModule('attendance') && (
            <AnalyticsSection title="My Meetings & Attendance">
              {((overview.meetings?.attended || 0) + (overview.meetings?.scheduled || 0)) > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <MetricCard title="Meetings Attended" value={overview.meetings?.attended || 0} icon={CalendarCheck} />
                  <MetricCard title="Upcoming Meetings" value={overview.meetings?.scheduled || 0} icon={CalendarDays} />
                  <MetricCard title="Meetings Missed" value={overview.meetings?.missed || 0} icon={Clock} />
                  <MetricCard title="Attendance Rate" value={`${overview.meetings?.attendanceRate || 0}%`} icon={TrendingUp} />
                </div>
              ) : (
                <EmptyState title="My Meetings & Attendance" />
              )}
            </AnalyticsSection>
          )}

          {/* Training */}
          {hasModule('training') && (
            <AnalyticsSection title="My Training Performance">
              {overview.training?.sessions > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <MetricCard title="Sessions Assigned" value={overview.training?.sessions || 0} icon={Sparkles} />
                  <MetricCard title="Sessions Completed" value={overview.training?.completed || 0} icon={Award} />
                  <MetricCard title="Completion Rate" value={`${overview.training?.completionRate || 0}%`} icon={TrendingUp} />
                </div>
              ) : (
                <EmptyState title="My Training Activity" />
              )}
            </AnalyticsSection>
          )}

          {/* Tasks */}
          {hasModule('tasks') && (
            <AnalyticsSection title="My Task Performance">
              {overview.tasks?.total > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <MetricCard title="Total Assigned Tasks" value={overview.tasks?.total || 0} icon={CheckSquare} />
                  <MetricCard title="Tasks In Progress" value={overview.tasks?.inProgress || 0} icon={Clock} />
                  <MetricCard title="Tasks Completed" value={overview.tasks?.completed || 0} icon={CheckSquare} />
                  <MetricCard title="Tasks Overdue" value={overview.tasks?.overdue || 0} icon={Clock} />
                </div>
              ) : (
                <EmptyState title="My Task Performance" />
              )}
            </AnalyticsSection>
          )}

          {/* Events */}
          {hasModule('events') && (
            <AnalyticsSection title="My Events">
              {((overview.events?.created || 0) + (overview.events?.joined || 0)) > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <MetricCard title="Events Created" value={overview.events?.created || 0} icon={CalendarDays} />
                  <MetricCard title="Events Joined" value={overview.events?.joined || 0} icon={Users} />
                  <MetricCard title="Upcoming Events" value={overview.events?.upcoming || 0} icon={CalendarCheck} />
                </div>
              ) : (
                <EmptyState title="My Event Activity" />
              )}
            </AnalyticsSection>
          )}

          {/* Revenue */}
          {(hasModule('payments') || hasModule('finance')) && (
            <AnalyticsSection title="My Revenue & Transactions">
              {overview.revenue?.transactionsCount > 0 ? (
                <div className="space-y-6">
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <MetricCard title="My Payments" value={formatCurrency(overview.revenue?.revenue)} icon={DollarSign} />
                    <MetricCard title="Transactions Count" value={overview.revenue?.transactionsCount || 0} icon={Clock} />
                    <MetricCard title="Avg Transaction Value" value={formatCurrency(overview.revenue?.avgTransactionValue)} icon={TrendingUp} />
                  </div>
                  <div className="grid gap-6 lg:grid-cols-2">
                    <DataTable
                      title="Recent Payments"
                      columns={[
                        { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.amount) },
                        { key: 'gateway', header: 'Gateway', render: (row) => row.gateway || 'N/A' },
                        { key: 'type', header: 'Type', render: (row) => row.type || 'N/A' },
                        { key: 'createdAt', header: 'Date', render: (row) => new Date(row.createdAt).toLocaleDateString() }
                      ]}
                      rows={recentTransactions}
                    />
                    <DataTable
                      title="Recent Referrals"
                      columns={[
                        { key: 'code', header: 'Code' },
                        { key: 'type', header: 'Type', render: (row) => row.type || 'signup' },
                        { key: 'status', header: 'Status', render: (row) => row.status || 'pending' },
                        { key: 'createdAt', header: 'Date', render: (row) => new Date(row.createdAt).toLocaleDateString() }
                      ]}
                      rows={recentReferrals}
                    />
                  </div>
                </div>
              ) : (
                <EmptyState title="My Revenue & Transactions" />
              )}
            </AnalyticsSection>
          )}

        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. VENDOR SCOPE SECTIONS */}
      {/* ---------------------------------------------------- */}
      {scope === 'vendor' && (
        <div className="space-y-8">
          {/* Marketplace Listing */}
          {hasModule('marketplace') && (
            <AnalyticsSection title="My Marketplace Performance">
              {overview.marketplace?.orders > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <MetricCard title="Total Orders" value={overview.marketplace?.orders || 0} icon={ShoppingBag} />
                  <MetricCard title="Completed Orders" value={overview.marketplace?.completedOrders || 0} icon={CalendarCheck} />
                  <MetricCard title="Customers" value={overview.marketplace?.customers || 0} icon={Users} />
                  <MetricCard title="Inquiries & Leads" value={overview.marketplace?.inquiries || 0} icon={Handshake} />
                </div>
              ) : (
                <EmptyState title="My Marketplace Activity" />
              )}
            </AnalyticsSection>
          )}

          {/* Tasks */}
          {hasModule('tasks') && (
            <AnalyticsSection title="My Task Performance">
              {overview.tasks?.total > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <MetricCard title="Total Tasks" value={overview.tasks?.total || 0} icon={CheckSquare} />
                  <MetricCard title="Pending Tasks" value={overview.tasks?.pending || 0} icon={Clock} />
                  <MetricCard title="Completed Tasks" value={overview.tasks?.completed || 0} icon={CheckSquare} />
                </div>
              ) : (
                <EmptyState title="My Task Performance" />
              )}
            </AnalyticsSection>
          )}

          {/* Tables */}
          {(recentTransactions.length > 0 || recentReferrals.length > 0) && (
            <div className="grid gap-6 lg:grid-cols-2">
              <DataTable
                title="Recent Sales Payments"
                columns={[
                  { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.amount) },
                  { key: 'user', header: 'Customer', render: (row) => row.user?.name || row.user?.email || 'Customer' },
                  { key: 'createdAt', header: 'Date', render: (row) => new Date(row.createdAt).toLocaleDateString() }
                ]}
                rows={recentTransactions}
              />
              <DataTable
                title="Recent Connects & Inquiries"
                columns={[
                  { key: 'code', header: 'Ref Code' },
                  { key: 'referrer', header: 'Referred By', render: (row) => row.referrer?.name || row.referrer?.email || 'N/A' },
                  { key: 'status', header: 'Status' },
                  { key: 'createdAt', header: 'Date', render: (row) => new Date(row.createdAt).toLocaleDateString() }
                ]}
                rows={recentReferrals}
              />
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. JURISDICTION SCOPE SECTIONS */}
      {/* ---------------------------------------------------- */}
      {scope === 'jurisdiction' && (
        <div className="space-y-8">
          
          {/* Members & Vendors */}
          {(hasModule('members') || hasModule('vendors')) && (
            <AnalyticsSection title="Directory growth & listings">
              <div className="grid gap-6 xl:grid-cols-2">
                <ChartContainer
                  title="Member Registration Trend"
                  data={monthlyUsers.map(item => ({ label: formatMonthLabel(item), count: item.users }))}
                  dataKey="count"
                />
                <ChartContainer
                  title="Vendor Listing Trend"
                  data={monthlyVendors.map(item => ({ label: formatMonthLabel(item), count: item.vendors }))}
                  dataKey="count"
                />
              </div>
            </AnalyticsSection>
          )}

          {/* Revenue */}
          {(hasModule('payments') || hasModule('finance')) && (
            <AnalyticsSection title="Revenue Trends & Reports">
              {overview.totalRevenue > 0 ? (
                <div className="space-y-6">
                  <div className="grid gap-6 xl:grid-cols-1">
                    <ChartContainer
                      title="Monthly Revenue Growth"
                      data={monthlyRevenue.map(item => ({ label: formatMonthLabel(item), revenue: item.revenue }))}
                      dataKey="revenue"
                    />
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <DataTable
                      title="Recent Payments"
                      columns={[
                        { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.amount) },
                        { key: 'user', header: 'User', render: (row) => row.user?.name || row.user?.email || 'N/A' },
                        { key: 'createdAt', header: 'Date', render: (row) => new Date(row.createdAt).toLocaleDateString() }
                      ]}
                      rows={recentTransactions}
                    />
                    <DataTable
                      title="Recent Referrals"
                      columns={[
                        { key: 'code', header: 'Ref Code' },
                        { key: 'referrer', header: 'Referrer', render: (row) => row.referrer?.name || row.referrer?.email || 'N/A' },
                        { key: 'status', header: 'Status' },
                        { key: 'createdAt', header: 'Date', render: (row) => new Date(row.createdAt).toLocaleDateString() }
                      ]}
                      rows={recentReferrals}
                    />
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <DataTable
                      title="Top Performing Vendors"
                      columns={[
                        { key: 'businessName', header: 'Vendor' },
                        { key: 'leads', header: 'Total Leads', render: (row) => row.stats?.totalLeads || 0 },
                        { key: 'views', header: 'Total Views', render: (row) => row.stats?.totalViews || 0 },
                      ]}
                      rows={topVendors}
                    />
                    <DataTable
                      title="Top Categories"
                      columns={[
                        { key: 'name', header: 'Category' },
                        { key: 'vendorCount', header: 'Vendors' }
                      ]}
                      rows={topCategories}
                    />
                  </div>
                </div>
              ) : (
                <EmptyState title="Jurisdiction Revenue & Payments" />
              )}
            </AnalyticsSection>
          )}

        </div>
      )}
    </section>
  )
}
