import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CreditCard,
  MapPin,
  Package,
  ShoppingBag,
  Plus,
  Star,
  Ticket,
  Wallet,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { vendorApi } from '../../api/vendor'
import EmptyState from '../../components/common/EmptyState'
import LoadingScreen from '../../components/common/LoadingScreen'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/tables/DataTable'
import { useAuth } from '../../hooks/useAuth'
import { useApi } from '../../hooks/useApi'
import { formatCurrency, formatDate } from '../../utils/format'
import JurisdictionCard from '../../components/common/JurisdictionCard'
import { getAccountClassification, getDashboardRoute } from '../../utils/permissions'

export default function VendorDashboard() {
  const { user } = useAuth()
  const { data, loading, error } = useApi(vendorApi.dashboard)
  const account = getAccountClassification(user)
  const isStandaloneVendor = account.isOnlineVendor
  const dashboardBase = getDashboardRoute(user?.role, user)
  const routeFor = (vendorPath, memberPath = vendorPath) => `${dashboardBase}${isStandaloneVendor ? vendorPath : memberPath}`

  if (loading) return <LoadingScreen label="Loading vendor dashboard..." />
  if (error?.response?.status === 404 || !data) return <VendorSetupState routeFor={routeFor} />

  const vendor = data.vendor || {}
  const stats = data.stats || {}
  const membership = data.membership || vendor.membership || {}
  const address = [vendor.address?.street, vendor.address?.city, vendor.address?.state, vendor.address?.pincode].filter(Boolean).join(', ')

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg bg-[#0b1f3d] text-white shadow-sm">
        <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <img src={vendor.logo?.url || '/logo.png'} alt="" className="h-16 w-16 rounded-lg border border-white/20 bg-white object-contain p-1" />
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#ffb20c]">Vendor Dashboard</p>
                <h1 className="mt-1 text-2xl font-black sm:text-3xl">{vendor.businessName || 'Your Business'}</h1>
                <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-200"><MapPin className="h-4 w-4" />{address || 'Complete your business address'}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <StatusBadge value={vendor.status || 'pending'} />
              <StatusBadge value={vendor.isVerified ? 'verified' : 'verification pending'} />
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-extrabold capitalize text-white">{membership.plan || 'free'} plan</span>
            </div>
          </div>

          <div className="rounded-lg border border-white/15 bg-white/10 p-4">
            <p className="text-sm font-bold text-slate-200">Membership Status</p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-2xl font-black capitalize">{membership.plan || 'free'}</p>
                <p className="mt-1 text-xs font-semibold text-slate-200">Expires {formatDate(membership.endDate)}</p>
              </div>
              <StatusBadge value={membership.status || (membership.isActive ? 'active' : 'pending')} />
            </div>
            <Link to={routeFor('/membership', '/subscription')} className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#ffb20c] px-4 py-2 text-sm font-extrabold text-[#0b1f3d]">Manage Plan <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <JurisdictionCard />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <VendorMetric label="Products" value={stats.productsCount} icon={Package} to={routeFor('/products')} />
        <VendorMetric label="Services" value={stats.servicesCount} icon={BriefcaseBusiness} to={routeFor('/services')} />
        <VendorMetric label="Orders" value={stats.pendingOrders || stats.ordersCount || 0} helper={`${stats.totalOrders || 0} total orders`} icon={ShoppingBag} to={routeFor('/orders')} />
        <VendorMetric label="Leads" value={stats.pendingLeads} helper={`${stats.totalLeads || 0} total leads`} icon={Ticket} to={routeFor('/leads')} />
        <VendorMetric label="Reviews" value={Number(stats.avgRating || 0).toFixed(1)} helper={`${stats.totalReviews || 0} reviews`} icon={Star} to={routeFor('/reviews')} />
        <VendorMetric label="Payments" value={formatCurrency(stats.monthlyRevenue)} helper="This month" icon={Wallet} to={routeFor('/payments')} />
        <VendorMetric label="Analytics" value={stats.totalViews || 0} helper="Profile views" icon={BarChart3} to={routeFor('/analytics', '/vendor-analytics')} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-950">Recent Orders</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">Latest customer purchases for your business.</p>
            </div>
            <Link to={routeFor('/orders')} className="text-sm font-extrabold text-[#0d4697]">View all</Link>
          </div>
          <div className="mt-4">
            <DataTable
              columns={[
                { key: 'orderNumber', header: 'Order #', render: (row) => row.orderNumber || row._id },
                { key: 'customer', header: 'Customer', render: (row) => row.customerSnapshot?.name || row.user?.name || 'Guest' },
                { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.total, row.currency) },
                { key: 'createdAt', header: 'Placed', render: (row) => formatDate(row.createdAt) },
                { key: 'paymentStatus', header: 'Payment', render: (row) => <StatusBadge value={row.paymentStatus} /> },
                { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
              ]}
              rows={data.recentOrders || []}
            />
          </div>
        </div>

        <div className="space-y-5">
          <QuickActions isStandaloneVendor={isStandaloneVendor} />
          <RecentPayments payments={data.recentPayments || []} routeFor={routeFor} />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <VendorPanel title="Business Verification" icon={Building2} action="Update Profile" to={routeFor('/profile', '/my-business')}>
          <p className="text-sm font-semibold text-slate-600">Keep your business profile, documents, address, and map location updated for better marketplace visibility.</p>
        </VendorPanel>
        <VendorPanel title="Business Categories" icon={Plus} action="Manage Categories" to={routeFor('/business-categories')}>
          <p className="text-sm font-semibold text-slate-600">Request new approved business categories, check review status, and resubmit rejected requests from one place.</p>
        </VendorPanel>
        <VendorPanel title="Catalog Health" icon={Package} action="Add Product" to={routeFor('/products')}>
          <p className="text-sm font-semibold text-slate-600">Add products with price, inventory, images, and categories so nearby customers can discover your store.</p>
        </VendorPanel>
        <VendorPanel title="Service Bookings" icon={CalendarClock} action="Add Service" to={routeFor('/services')}>
          <p className="text-sm font-semibold text-slate-600">List services, pricing, service areas, and availability to receive more qualified enquiries.</p>
        </VendorPanel>
      </section>
    </div>
  )
}

function VendorSetupState({ routeFor = () => '' }) {
    return (
      <div className="space-y-6">
        <section className="rounded-lg bg-[#0b1f3d] p-6 text-white shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ffb20c]">Vendor Dashboard</p>
          <h1 className="mt-2 text-3xl font-black">Create your business profile</h1>
          <p className="mt-2 max-w-2xl text-sm font-semibold text-slate-200">Your vendor login is working, but this account does not have a business profile yet. Create the profile first, then products, services, leads, payments, and reviews will appear here.</p>
          <Link to={routeFor('/profile', '/my-business')} className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#ffb20c] px-5 py-3 text-sm font-extrabold text-[#0b1f3d]">Set Up Business Profile <ArrowRight className="h-4 w-4" /></Link>
        </section>

        <EmptyState
          title="Vendor profile not found"
          description="After profile creation and admin approval, this dashboard will show your vendor metrics, leads, products, services, payments, and membership status."
        />
      </div>
    )
  }

  function VendorMetric({ label, value, helper, icon: Icon, to }) {
    return (
      <Link to={to} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-center justify-between gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-[#0d4697]/10 text-[#0d4697]"><Icon className="h-5 w-5" /></span>
          <ArrowRight className="h-4 w-4 text-slate-300" />
        </div>
        <p className="mt-4 text-sm font-extrabold text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-black text-slate-950">{displayValue(value)}</p>
        {helper && <p className="mt-1 text-xs font-bold text-slate-400">{helper}</p>}
      </Link>
    )
  }

function QuickActions({ isStandaloneVendor }) {
    const actions = isStandaloneVendor
      ? [
          ['Add Product', '/vendor/products', Package],
          ['Add Service', '/vendor/services', BriefcaseBusiness],
          ['Business Categories', '/vendor/business-categories', Plus],
          ['Check Leads', '/vendor/leads', Ticket],
          ['Payments', '/vendor/payments', CreditCard],
        ]
      : [
          ['Add Product', '/products', Package],
          ['Add Service', '/services', BriefcaseBusiness],
          ['Business Categories', '/business-categories', Plus],
          ['Check Leads', '/leads', Ticket],
          ['Payments', '/payments', CreditCard],
        ]

    return (
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-950">Quick Actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          {actions.map(([label, to, Icon]) => (
            <Link key={to} to={to} className="flex items-center justify-between rounded-md border border-slate-200 px-4 py-3 text-sm font-extrabold text-slate-700 hover:border-[#0d4697] hover:text-[#0d4697]">
              <span className="flex items-center gap-2"><Icon className="h-4 w-4" />{label}</span>
              <Plus className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </div>
    )
  }

function RecentPayments({ payments, routeFor }) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-950">Recent Payments</h2>
        <Link to={routeFor('/payments')} className="text-sm font-extrabold text-[#0d4697]">View</Link>
      </div>
      <div className="mt-4 space-y-3">
        {payments.length ? payments.map((payment) => (
          <div key={payment._id || payment.id} className="flex items-center justify-between gap-3 rounded-md bg-slate-50 p-3">
            <div>
              <p className="text-sm font-extrabold text-slate-900">{formatCurrency(payment.amount, payment.currency)}</p>
              <p className="text-xs font-semibold text-slate-500">{payment.type || payment.gateway} • {formatDate(payment.paidAt || payment.createdAt)}</p>
            </div>
            <StatusBadge value={payment.status} />
          </div>
        )) : <p className="rounded-md bg-slate-50 p-4 text-sm font-semibold text-slate-500">No payments yet.</p>}
      </div>
    </div>
  )
}

function VendorPanel({ title, icon: Icon, action, to, children }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <span className="grid h-10 w-10 place-items-center rounded-md bg-[#ffb20c]/20 text-[#0d4697]"><Icon className="h-5 w-5" /></span>
      <h2 className="mt-4 text-lg font-extrabold text-slate-950">{title}</h2>
      <div className="mt-2">{children}</div>
      <Link to={to} className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-[#0d4697]">{action} <ArrowRight className="h-4 w-4" /></Link>
    </div>
  )
}

function displayValue(value) {
  if (value === null || value === undefined || value === '') return '0'
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return String(value.length)
  if (typeof value === 'object') {
    return String(
      value.orderNumber ||
      value.title ||
      value.name ||
      value.label ||
      value.value ||
      value._id ||
      value.id ||
      '0'
    )
  }
  return String(value)
}
