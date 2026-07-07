import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CreditCard,
  MapPin,
  Package,
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
import { useApi } from '../../hooks/useApi'
import { formatCurrency, formatDate } from '../../utils/format'

export default function VendorDashboard() {
  const { data, loading, error } = useApi(vendorApi.dashboard)
  if (loading) return <LoadingScreen label="Loading vendor dashboard..." />
  if (error?.response?.status === 404 || !data) return <VendorSetupState />

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
            <Link to="/vendor/membership" className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#ffb20c] px-4 py-2 text-sm font-extrabold text-[#0b1f3d]">Manage Plan <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <VendorMetric label="Products" value={stats.productsCount} icon={Package} to="/vendor/products" />
        <VendorMetric label="Services" value={stats.servicesCount} icon={BriefcaseBusiness} to="/vendor/services" />
        <VendorMetric label="Open Leads" value={stats.pendingLeads} helper={`${stats.totalLeads || 0} total leads`} icon={Ticket} to="/vendor/leads" />
        <VendorMetric label="Revenue" value={formatCurrency(stats.monthlyRevenue)} helper="This month" icon={Wallet} to="/vendor/payments" />
        <VendorMetric label="Rating" value={Number(stats.avgRating || 0).toFixed(1)} helper={`${stats.totalReviews || 0} reviews`} icon={Star} to="/vendor/reviews" />
        <VendorMetric label="Unread" value={stats.unreadNotifications} helper="Notifications" icon={Bell} to="/vendor/notifications" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-950">Lead Inbox</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">Latest customer enquiries for your business.</p>
            </div>
            <Link to="/vendor/leads" className="text-sm font-extrabold text-[#0d4697]">View all</Link>
          </div>
          <div className="mt-4">
            <DataTable
              columns={[
                { key: 'name', header: 'Customer' },
                { key: 'phone', header: 'Phone' },
                { key: 'subject', header: 'Subject' },
                { key: 'createdAt', header: 'Received', render: (row) => formatDate(row.createdAt) },
                { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
              ]}
              rows={data.recentLeads || []}
            />
          </div>
        </div>

        <div className="space-y-5">
          <QuickActions />
          <RecentPayments payments={data.recentPayments || []} />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <VendorPanel title="Business Verification" icon={Building2} action="Update Profile" to="/vendor/profile">
          <p className="text-sm font-semibold text-slate-600">Keep your business profile, documents, address, and map location updated for better marketplace visibility.</p>
        </VendorPanel>
        <VendorPanel title="Catalog Health" icon={Package} action="Add Product" to="/vendor/products">
          <p className="text-sm font-semibold text-slate-600">Add products with price, inventory, images, and categories so nearby customers can discover your store.</p>
        </VendorPanel>
        <VendorPanel title="Service Bookings" icon={CalendarClock} action="Add Service" to="/vendor/services">
          <p className="text-sm font-semibold text-slate-600">List services, pricing, service areas, and availability to receive more qualified enquiries.</p>
        </VendorPanel>
      </section>
    </div>
  )
}

function VendorSetupState() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-[#0b1f3d] p-6 text-white shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ffb20c]">Vendor Dashboard</p>
        <h1 className="mt-2 text-3xl font-black">Create your business profile</h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold text-slate-200">Your vendor login is working, but this account does not have a business profile yet. Create the profile first, then products, services, leads, payments, and reviews will appear here.</p>
        <Link to="/vendor/profile" className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#ffb20c] px-5 py-3 text-sm font-extrabold text-[#0b1f3d]">Set Up Business Profile <ArrowRight className="h-4 w-4" /></Link>
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
      <p className="mt-1 text-2xl font-black text-slate-950">{value ?? 0}</p>
      {helper && <p className="mt-1 text-xs font-bold text-slate-400">{helper}</p>}
    </Link>
  )
}

function QuickActions() {
  const actions = [
    ['Add Product', '/vendor/products', Package],
    ['Add Service', '/vendor/services', BriefcaseBusiness],
    ['Check Leads', '/vendor/leads', Ticket],
    ['Payments', '/vendor/payments', CreditCard],
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

function RecentPayments({ payments }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-950">Recent Payments</h2>
        <Link to="/vendor/payments" className="text-sm font-extrabold text-[#0d4697]">View</Link>
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
