import { useEffect, useMemo, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'

const fallbackDashboard = {
  totalUsers: 12480,
  totalVendors: 3186,
  pendingVendors: 42,
  activeVendors: 2794,
  newUsersToday: 128,
  newVendorsToday: 18,
}

const fallbackApprovals = [
  { _id: '1', businessName: 'Nexa Cloud Systems', ownerName: 'Arjun Mehta', status: 'pending', address: { city: 'Bengaluru' }, createdAt: '2026-06-25T06:10:00.000Z' },
  { _id: '2', businessName: 'BrightPath Logistics', ownerName: 'Meera Shah', status: 'pending', address: { city: 'Mumbai' }, createdAt: '2026-06-25T04:45:00.000Z' },
  { _id: '3', businessName: 'Urban Legal Desk', ownerName: 'Vikram Rao', status: 'pending', address: { city: 'Chennai' }, createdAt: '2026-06-24T15:20:00.000Z' },
]

const fallbackLeads = [
  ['New', 184, '#1558b0'],
  ['Contacted', 96, '#0f9f6e'],
  ['Proposal', 54, '#d6a744'],
  ['Won', 31, '#16a34a'],
  ['Lost', 17, '#dc2626'],
]

const auditTrail = [
  ['Vendor approved', 'Admin approved Prime Foods listing', '2 min ago'],
  ['Membership updated', 'Gold plan activated for BluePeak Tech', '16 min ago'],
  ['Review moderated', 'Flagged review moved to pending queue', '44 min ago'],
  ['Support assigned', 'Ticket #4821 assigned to operations', '1 hr ago'],
]

const navItems = ['Overview', 'Approvals', 'Vendors', 'Payments', 'Reports']

const Icon = ({ children }) => (
  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#eef4ff] text-[#0d4697]">
    {children}
  </span>
)

const Card = ({ children, className = '' }) => (
  <section className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>
    {children}
  </section>
)

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(fallbackDashboard)
  const [approvals, setApprovals] = useState(fallbackApprovals)
  const [membershipApps, setMembershipApps] = useState([])
  const [activeApprovalTab, setActiveApprovalTab] = useState('vendors')
  const [apiState, setApiState] = useState('demo')

  const token = useMemo(() => (
    localStorage.getItem('gloaro_access_token') || sessionStorage.getItem('gloaro_access_token')
  ), [])

  useEffect(() => {
    if (!token) return

    const headers = { Authorization: `Bearer ${token}` }

    const loadAdminData = async () => {
      try {
        const [dashboardResponse, approvalResponse, membershipResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/dashboard`, { headers, credentials: 'include' }),
          fetch(`${API_BASE_URL}/admin/pending-approvals?type=vendor&limit=5`, { headers, credentials: 'include' }),
          fetch(`${API_BASE_URL}/membership-applications?status=submitted&limit=5`, { headers, credentials: 'include' }),
        ])

        if (!dashboardResponse.ok || !approvalResponse.ok) {
          throw new Error('Admin data is unavailable')
        }

        const dashboardResult = await dashboardResponse.json()
        const approvalResult = await approvalResponse.json()

        let membershipData = []
        if (membershipResponse.ok) {
          const membershipResult = await membershipResponse.json()
          membershipData = membershipResult.data?.data || membershipResult.data || []
        }

        setDashboard({ ...fallbackDashboard, ...dashboardResult.data })
        setApprovals(approvalResult.data || fallbackApprovals)
        setMembershipApps(membershipData)
        setApiState('live')
      } catch {
        setApiState('demo')
        setMembershipApps([])
      }
    }

    loadAdminData()
  }, [token])

  const stats = [
    ['Total Users', dashboard.totalUsers, `+${dashboard.newUsersToday} today`, '👥'],
    ['Total Vendors', dashboard.totalVendors, `+${dashboard.newVendorsToday} today`, '🏢'],
    ['Pending Approvals', dashboard.pendingVendors, 'Needs review', '✓'],
    ['Active Vendors', dashboard.activeVendors, 'Approved listings', '↗'],
  ]

  return (
    <main className="min-h-screen bg-[#f5f7fb] font-urbanist text-[#172033]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-20 items-center border-b border-slate-200 px-6">
          <div>
            <p className="font-playfair text-3xl font-bold text-[#0d4697]">Gloaro</p>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d6a744]">Admin Console</p>
          </div>
        </div>
        <nav className="space-y-1 px-3 py-5">
          {navItems.map((item, index) => (
            <a key={item} href={`#${item.toLowerCase()}`} className={`flex h-11 items-center rounded-md px-3 text-sm font-bold ${index === 0 ? 'bg-[#0d4697] text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-[#0d4697]'}`}>
              {item}
            </a>
          ))}
        </nav>
        <div className="absolute bottom-5 left-3 right-3 rounded-lg border border-[#d6a744]/40 bg-[#fff8e7] p-4">
          <p className="text-sm font-extrabold text-[#172033]">API status</p>
          <p className="mt-1 text-sm font-semibold text-slate-600">{apiState === 'live' ? 'Connected to backend' : 'Using dashboard preview data'}</p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-[#0d4697]">Admin Dashboard</p>
              <h1 className="text-2xl font-extrabold text-[#101827] sm:text-3xl">Platform Control Center</h1>
            </div>
            <div className="flex items-center gap-2">
              <a href="/" className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm">Home</a>
              <a href="/signin" className="rounded-md bg-[#0d4697] px-4 py-2 text-sm font-bold text-white shadow-sm">Sign In</a>
            </div>
          </div>
        </header>

        <div className="px-4 py-5 sm:px-6 lg:px-8">
          <section id="overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(([label, value, note, icon]) => (
              <Card key={label} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-500">{label}</p>
                    <p className="mt-2 text-3xl font-extrabold text-[#101827]">{Number(value || 0).toLocaleString()}</p>
                    <p className="mt-2 text-sm font-bold text-[#0f9f6e]">{note}</p>
                  </div>
                  <Icon>{icon}</Icon>
                </div>
              </Card>
            ))}
          </section>

          <section className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_.9fr]">


            <Card className="p-5">
              <h2 className="text-lg font-extrabold text-[#101827]">Lead Pipeline</h2>
              <p className="text-sm font-semibold text-slate-500">Current lead status distribution</p>
              <div className="mt-5 space-y-4">
                {fallbackLeads.map(([label, count, color]) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm font-bold">
                      <span>{label}</span>
                      <span>{count}</span>
                    </div>
                    <div className="mt-2 h-2 rounded bg-slate-100">
                      <div className="h-2 rounded" style={{ width: `${Math.min(count / 2, 100)}%`, backgroundColor: color }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
            <Card id="approvals" className="overflow-hidden">
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 p-5">
                <div>
                  <h2 className="text-lg font-extrabold text-[#101827]">Pending Approvals Dashboard</h2>
                  <p className="text-sm font-semibold text-slate-500">Review and verify new system submissions</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveApprovalTab('vendors')}
                    className={`rounded-md px-3 py-1.5 text-xs font-extrabold transition ${activeApprovalTab === 'vendors' ? 'bg-[#0d4697] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    Vendors ({approvals.length})
                  </button>
                  <button
                    onClick={() => setActiveApprovalTab('membership')}
                    className={`rounded-md px-3 py-1.5 text-xs font-extrabold transition ${activeApprovalTab === 'membership' ? 'bg-[#0d4697] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    Memberships ({membershipApps.length})
                  </button>
                </div>
              </div>

              {activeApprovalTab === 'vendors' ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[620px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-5 py-3">Business</th>
                        <th className="px-5 py-3">Owner</th>
                        <th className="px-5 py-3">City</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {approvals.map((approval) => (
                        <tr key={approval._id} className="bg-white">
                          <td className="px-5 py-4 font-extrabold text-[#101827]">{approval.businessName || approval.name || 'New Listing'}</td>
                          <td className="px-5 py-4 font-semibold text-slate-600">{approval.ownerName || approval.user?.name || 'Vendor owner'}</td>
                          <td className="px-5 py-4 font-semibold text-slate-600">{approval.address?.city || 'Not added'}</td>
                          <td className="px-5 py-4"><span className="rounded bg-amber-50 px-2 py-1 text-xs font-extrabold text-amber-700">{approval.status || 'pending'}</span></td>
                          <td className="px-5 py-4"><a href="/admin/vendor-approval-workflow" className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-extrabold text-[#0d4697] hover:bg-blue-50 transition">Review</a></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[620px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-5 py-3">Applicant</th>
                        <th className="px-5 py-3">Company</th>
                        <th className="px-5 py-3">Plan</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {membershipApps.length > 0 ? (
                        membershipApps.map((app) => (
                          <tr key={app._id} className="bg-white">
                            <td className="px-5 py-4 font-extrabold text-[#101827]">{app.personal?.fullName || app.submittedBy?.name || 'New Applicant'}</td>
                            <td className="px-5 py-4 font-semibold text-slate-600">{app.professional?.companyName || 'Not specified'}</td>
                            <td className="px-5 py-4 font-semibold text-slate-600">{app.professional?.membershipPlan || app.membership?.plan || 'Silver'}</td>
                            <td className="px-5 py-4"><span className="rounded bg-blue-50 px-2 py-1 text-xs font-extrabold text-blue-700">{app.status || 'submitted'}</span></td>
                            <td className="px-5 py-4"><a href="/admin/applications/membership" className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-extrabold text-[#0d4697] hover:bg-blue-50 transition">Review</a></td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-5 py-8 text-center text-xs font-semibold text-slate-400">
                            No pending membership applications found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            <Card className="p-5">
              <h2 className="text-lg font-extrabold text-[#101827]">Recent Activity</h2>
              <div className="mt-4 space-y-4">
                {auditTrail.map(([title, detail, time]) => (
                  <div key={detail} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#0d4697]" />
                    <div>
                      <p className="font-extrabold text-[#101827]">{title}</p>
                      <p className="text-sm font-semibold text-slate-500">{detail}</p>
                      <p className="mt-1 text-xs font-bold text-slate-400">{time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </div>
      </div>
    </main>
  )
}
