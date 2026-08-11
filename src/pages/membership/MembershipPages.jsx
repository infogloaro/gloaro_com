import { CalendarDays, CheckCircle2, Gift, Handshake, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatusBadge from '../../components/common/StatusBadge'
import SimpleJsonForm from '../shared/SimpleJsonForm'
import ResourceListPage from '../shared/ResourceListPage'
import NotificationsPage from '../shared/NotificationsPage'
import ProfilePage from '../shared/ProfilePage'
import { customerApi } from '../../api/customer'
import { formatDate } from '../../utils/format'
import { useApi } from '../../hooks/useApi'

const benefitCards = [
  {
    title: 'Exclusive Member Access',
    description: 'Use approved member access for Gloaro meetings, partner programs, benefits, and business opportunities.',
    icon: ShieldCheck,
  },
  {
    title: 'Connect Growth',
    description: 'Share your referral code, track member introductions, and grow through trusted business connections.',
    icon: Handshake,
  },
  {
    title: 'Events & Community',
    description: 'Discover membership meetings, business expos, workshops, and curated networking sessions.',
    icon: CalendarDays,
  },
  {
    title: 'Business Visibility',
    description: 'Improve your presence across the Gloaro ecosystem with network promotion and profile visibility.',
    icon: Sparkles,
  },
]

const programSteps = [
  'Monthly networking meetings',
  'Connect program participation',
  'Member-only event access',
  'Business promotion opportunities',
  'Priority support for membership queries',
]

export function MembershipBenefitsPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0d4697]">Membership Benefits</p>
        <h1 className="mt-2 font-playfair text-3xl font-black text-slate-950">Your Gloaro member advantages</h1>
        <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
          Access the resources, events, referrals, and verified network support available to approved Gloaro members.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {benefitCards.map(({ title, description, icon: Icon }) => (
          <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid h-11 w-11 place-items-center rounded-md bg-blue-50 text-[#0d4697]">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-base font-extrabold text-slate-950">{title}</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{description}</p>
          </article>
        ))}
      </div>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-playfair text-2xl font-black text-slate-950">Member Program</h2>
          <div className="mt-5 space-y-3">
            {programSteps.map((step) => (
              <div key={step} className="flex items-center gap-3 rounded-md border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                {step}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-[#0b469e] p-5 text-white shadow-sm">
          <Gift className="h-8 w-8 text-[#ffbf1a]" />
          <h2 className="mt-4 font-playfair text-2xl font-black">Ready to grow?</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-blue-50">Join events, share referrals, and explore benefits from the membership dashboard.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/membership/events" className="rounded-md bg-[#ffbf1a] px-4 py-2 text-sm font-extrabold text-[#0b1f3d]">View Events</Link>
            <Link to="/membership/referral" className="rounded-md border border-white/30 px-4 py-2 text-sm font-extrabold text-white">Connect</Link>
          </div>
        </div>
      </section>
    </section>
  )
}

export function MembershipEventsPage() {
  return (
    <ResourceListPage
      title="Membership Events"
      description="Upcoming meetings, expos, and networking sessions for members."
      fetcher={(params) => customerApi.events({ ...params, upcoming: true })}
      columns={[
        { key: 'title', header: 'Event' },
        { key: 'type', header: 'Type' },
        { key: 'startDate', header: 'Starts', render: (row) => formatDate(row.startDate) },
        { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
      ]}
    />
  )
}

export function MembershipReferralPage() {
  const code = useApi(customerApi.referralCode)
  const stats = useApi(customerApi.referralStats)

  return (
    <section className="space-y-5">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-950">Membership Connect</h1>
        <p className="mt-1 text-sm font-semibold text-slate-500">Share your referral code and track your network growth.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[0.8fr_1fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid h-11 w-11 place-items-center rounded-md bg-blue-50 text-[#0d4697]">
            <Handshake className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm font-bold text-slate-500">Your referral code</p>
          <p className="mt-2 break-all text-3xl font-extrabold text-[#0d4697]">{code.data?.referralCode || code.data?.code || 'Loading'}</p>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-extrabold text-slate-950">Connect Summary</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Metric label="Total Connects" value={stats.data?.totalConnects || stats.data?.total || 0} />
            <Metric label="Approved" value={stats.data?.approved || 0} />
            <Metric label="Rewards" value={stats.data?.rewards || stats.data?.rewardAmount || 0} />
          </div>
        </section>
      </div>

      <ResourceListPage
        title="Connect History"
        description="Your recent referral activity."
        fetcher={customerApi.referrals}
        columns={[
          { key: 'referredUser', header: 'Referred User', render: (row) => row.referredUser?.name || row.name || row.email || '-' },
          { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status || 'pending'} /> },
          { key: 'createdAt', header: 'Created', render: (row) => formatDate(row.createdAt) },
        ]}
      />
    </section>
  )
}

export function MembershipNotificationsPage() {
  return <NotificationsPage />
}

export function MembershipProfilePage() {
  return <ProfilePage />
}

export function MembershipSupportPage() {
  return (
    <ResourceListPage
      title="Membership Support"
      description="Raise and track support tickets related to your membership."
      fetcher={customerApi.support}
      createAction={customerApi.createTicket}
      columns={[
        { key: 'ticketNumber', header: 'Ticket' },
        { key: 'subject', header: 'Subject' },
        { key: 'category', header: 'Category' },
        { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
      ]}
      renderForm={(props) => (
        <SimpleJsonForm
          {...props}
          fields={[
            { name: 'subject' },
            { name: 'description', type: 'textarea' },
            { name: 'category', type: 'select', options: ['membership', 'payment', 'events', 'referral', 'technical'].map((value) => ({ value, label: value })) },
            { name: 'priority', type: 'select', options: ['low', 'medium', 'high', 'critical'].map((value) => ({ value, label: value })) },
          ]}
        />
      )}
    />
  )
}

function Metric({ label, value }) {
  return (
    <div className="rounded-md bg-slate-50 p-4">
      <p className="text-xs font-extrabold uppercase text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-extrabold text-slate-950">{value}</p>
    </div>
  )
}
