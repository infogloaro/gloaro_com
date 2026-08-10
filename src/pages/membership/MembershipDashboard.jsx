import { CalendarDays, Download, Gem, Handshake, ShieldCheck, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useApi } from '../../hooks/useApi'
import { membershipApplicationApi } from '../../api/membershipApplication'
import LoadingScreen from '../../components/common/LoadingScreen'

const benefits = [
  ['Member Benefits', 'Access networking benefits, member resources, and priority opportunities.', Gem],
  ['Connect Network', 'Join referral programs and discover trusted member connections.', Handshake],
  ['Events & Meetings', 'Attend curated Gloaro meetings, business events, and community sessions.', CalendarDays],
  ['Verified Access', 'Use your approved membership status across Gloaro partner programs.', ShieldCheck],
]

export default function MembershipDashboard() {
  const { user } = useAuth()
  const application = useApi(membershipApplicationApi.getMyApplication)

  if (application.loading) return <LoadingScreen label="Loading membership dashboard..." />

  const applicationData = application.data || {}
  const applicationStatus = applicationData.status || 'Unavailable'
  const accessStatus = user?.isActive ? 'Active' : user ? 'Inactive' : 'Unavailable'
  const membershipPlan = applicationData.professional?.membershipPlan || applicationData.membership?.plan || 'Unavailable'

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-lg bg-gradient-to-br from-[#0d4697] to-[#082653] p-6 text-white shadow-sm">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#ffbf1a]">Gloaro Membership</p>
        <h1 className="mt-2 text-3xl font-black">Welcome, {user?.name || 'Member'}</h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold text-blue-50">Your membership dashboard is active. Manage benefits, referrals, events, downloads, and support from one place.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/events" className="rounded-md bg-[#ffbf1a] px-4 py-2 text-sm font-extrabold text-[#0b1f3d]">Explore Events</Link>
          <Link to="/customer/referral" className="rounded-md border border-white/30 px-4 py-2 text-sm font-extrabold text-white">Connect Program</Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {benefits.map(([title, description, Icon]) => (
          <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-blue-50 text-[#0d4697]">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-base font-extrabold text-slate-950">{title}</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{description}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-extrabold text-slate-950">Membership Status</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">

            <Status label="Application" value={applicationStatus} />
            <Status label="Access" value={accessStatus} />
            


            <Status label="Membership" value="Executive Member" />

          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-extrabold text-slate-950">Downloads</h2>
          <button type="button" className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-[#0d4697] px-4 py-3 text-sm font-extrabold text-white">
            <Download className="h-4 w-4" />
            Download Member Kit
          </button>
        </section>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-950"><UsersRound className="h-5 w-5 text-[#0d4697]" /> Member Community</h2>
        <p className="mt-2 text-sm font-semibold text-slate-500">Your member events, meetings, referrals, and partner benefits will appear here as the network data grows.</p>
      </section>
    </section>
  )
}

function Status({ label, value }) {
  return (
    <div className="rounded-md bg-slate-50 p-4">
      <p className="text-xs font-extrabold uppercase text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-extrabold text-[#0d4697]">{value}</p>
    </div>
  )
}
