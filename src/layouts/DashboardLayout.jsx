import { ChevronDown, ChevronLeft, Menu, Moon, Search, Sun, LayoutDashboard, Users, FileBarChart, Settings, CreditCard, Building2, MapPinned, CalendarDays, FileText, Volume2, Handshake, Ticket, Clock, Bell, User, Package, Star, ToggleLeft, ShoppingBag, BriefcaseBusiness, Heart, PlusCircle, TrendingUp, ClipboardList } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/signup_logo.png'
import { useAuth } from '../hooks/useAuth'
import { storage } from '../utils/storage'

export default function DashboardLayout({ navItems = [], title = 'Dashboard' }) {
  const { user, logout, hasSidebar } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [query, setQuery] = useState('')
  const [openGroups, setOpenGroups] = useState({})
  const [impersonating, setImpersonating] = useState(() => Boolean(sessionStorage.getItem('gloaro_superadmin_session')))
  const [dark, setDark] = useState(() => localStorage.getItem('gloaro_theme') === 'dark')
  const isSuperAdmin = user?.role === 'superadmin'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('gloaro_theme', dark ? 'dark' : 'light')
  }, [dark])

  const returnToSuperAdmin = () => {
    const raw = sessionStorage.getItem('gloaro_superadmin_session')
    if (!raw) return
    try {
      const session = JSON.parse(raw)
      storage.setSession(session, false)
      sessionStorage.removeItem('gloaro_superadmin_session')
      setImpersonating(false)
      window.location.href = '/admin/admin-management'
    } catch {
      sessionStorage.removeItem('gloaro_superadmin_session')
      setImpersonating(false)
    }
  }

  const isSidebarItemEnabled = useCallback((label) => {
    const superAdminOnly = new Set([
      'Admin Management',
      'Roles',
      'Permissions',
      'Feature Management',
      'Dashboard Config',
      'Module Config',
      'Workflow Settings',
      'Workflow Engine',
      'System Logs',
    ])
    if (!isSuperAdmin && superAdminOnly.has(label)) return false

    return hasSidebar(label)
  }, [hasSidebar, isSuperAdmin])

  const ROLE_NAV_ITEMS = useMemo(() => ({
    admin: [
      ['Dashboard', '/admin', LayoutDashboard],
      {
        label: 'Organization Master',
        icon: Building2,
        children: [
          ['Regions', '/admin/locations', MapPinned],
        ],
      },
      ['Region Directors', '/admin/users', Users],
      ['Vendor Approvals', '/admin/applications/vendor', CreditCard],
      ['Approved Vendors', '/admin/approved-vendors', Building2],
      ['Reports', '/admin/reports', FileBarChart],
      ['Settings', '/admin/settings', Settings]
    ],
    region_director: [
      ['Dashboard', '/region-director/dashboard', LayoutDashboard],
      {
        label: 'Organization Master',
        icon: Building2,
        children: [
          ['States', '/region-director/locations', MapPinned],
        ],
      },
      ['State Directors', '/region-director/state-directors', Users],
      ['Memberships', '/region-director/memberships', CreditCard],
      ['Approved Vendors', '/region-director/approved-vendors', Building2],
      ['Reports', '/region-director/reports', FileBarChart]
    ],
    state_director: [
      ['Dashboard', '/state-director/dashboard', LayoutDashboard],
      {
        label: 'Organization Master',
        icon: Building2,
        children: [
          ['Districts', '/state-director/districts', MapPinned],
        ],
      },
      ['District Directors', '/state-director/district-directors', Users],
      ['Memberships', '/state-director/memberships', CreditCard],
      ['Approved Vendors', '/admin/approved-vendors', Building2],
      ['Reports', '/state-director/reports', FileBarChart]
    ],
    district_director: [
      ['Dashboard', '/district-director/dashboard', LayoutDashboard],
      {
        label: 'Organization Master',
        icon: Building2,
        children: [
          ['Chapters', '/district-director/chapters', MapPinned],
        ],
      },
      ['Executive Directors', '/district-director/executive-directors', Users],
      ['Memberships', '/district-director/memberships', CreditCard],
      ['Approved Vendors', '/admin/approved-vendors', Building2],
      ['Reports', '/district-director/reports', FileBarChart]
    ],
    executive_director: [
      ['Dashboard', '/chapter-director/dashboard', LayoutDashboard],
      ['President', '/chapter-director/president', Users],
      ['Members', '/chapter-director/members', Users],
      ['Memberships', '/chapter-director/memberships', CreditCard],
      ['Launch Directors', '/chapter-director/launch-directors', Users],
      ['Membership Approvals', '/chapter-director/memberships', CreditCard],
      ['Vendor Approvals', '/admin/applications/vendor', CreditCard],
      ['Approved Vendors', '/admin/approved-vendors', Building2],
      ['Reports', '/chapter-director/reports', FileBarChart],
      ['Settings', '/chapter-director/settings', Settings]
    ],
    launch_director: [
      ['Dashboard', '/admin', LayoutDashboard],
      ['Direct Consultants', '/admin/users', Users],
      ['Approved Vendors', '/admin/approved-vendors', Building2],
      ['Memberships', '/admin/memberships', CreditCard]
    ],
    direct_consultant: [
      ['Dashboard', '/admin', LayoutDashboard],
      ['Chapter Presidents', '/admin/users', Users],
      ['Membership Approvals', '/admin/applications/membership', CreditCard],
      ['Approved Vendors', '/admin/approved-vendors', Building2]
    ],
    chapter_president: [
      ['Dashboard', '/president/dashboard', LayoutDashboard],
      ['Vice Presidents', '/president/vice-presidents', Users],
      ['Approved Vendors', '/admin/approved-vendors', Building2],
      ['Reports', '/president/reports', FileBarChart]
    ],
    vice_president: [
      ['Dashboard', '/vice-president/dashboard', LayoutDashboard],
      ['Chapter', '/member/dashboard', Building2],
      ['Members', '/vice-president/members', Users],
      ['Member Registration', '/vice-president/register-member', Users],
      ['Secretaries', '/vice-president/secretaries', Users],
      ['Meetings', '/member/dashboard', CalendarDays],
      ['Attendance', '/member/dashboard', FileText],
      ['Business Wall', '/member/dashboard', Volume2],
      ['Referrals', '/member/dashboard', Handshake],
      ['Visitors', '/member/dashboard', Ticket],
      ['One-to-Ones', '/member/dashboard', Clock],
      ['Approved Vendors', '/admin/approved-vendors', Building2],
      ['Announcements', '/member/dashboard', Bell],
      ['Reports', '/vice-president/reports', FileBarChart],
      ['Profile', '/profile', User],
      ['Settings', '/vice-president/settings', Settings]
    ],
    secretary: [
      ['Dashboard', '/secretary/dashboard', LayoutDashboard],
      ['Members', '/secretary/members', Users],
      ['Attendance', '/secretary/attendance', CalendarDays],
      ['Meetings', '/secretary/minutes', FileText],
      ['Approved Vendors', '/admin/approved-vendors', Building2],
      ['Reports', '/secretary/reports', FileBarChart]
    ]
  }), []);

  const filteredNav = useMemo(() => {
    const value = query.trim().toLowerCase()
    let activeNavItems = navItems
    let bypassEnabledCheck = false

    if (user?.role && ROLE_NAV_ITEMS[user.role]) {
      activeNavItems = ROLE_NAV_ITEMS[user.role]
      bypassEnabledCheck = true
    }

    const isApprovedVendor = user?.role === 'vendor' || user?.vendorProfile?.status === 'approved';

    const visibleNavItems = activeNavItems
      .map((item) => {
        if (Array.isArray(item)) return (bypassEnabledCheck || isSidebarItemEnabled(item[0])) ? item : null
        
        let children = [...item.children];

        if (item.label === 'Marketplace') {
          if (isApprovedVendor) {
            children = [
              ['Dashboard', '/member/dashboard/vendor-analytics', LayoutDashboard],
              ['My Business', '/member/dashboard/my-business', Building2],
              ['Products', '/member/dashboard/products', Package],
              ['Services', '/member/dashboard/services', BriefcaseBusiness],
              ['Leads', '/member/dashboard/leads', TrendingUp],
              ['Orders', '/member/dashboard/orders', ShoppingBag],
              ['Reviews', '/member/dashboard/reviews', Star],
              ['Payments', '/member/dashboard/payments', CreditCard],
              ['Subscription', '/member/dashboard/subscription', ToggleLeft],
              ['Analytics', '/member/dashboard/vendor-analytics', FileBarChart]
            ];
          } else {
            children = [
              ['Products', '/products', ShoppingBag],
              ['Services', '/services', BriefcaseBusiness],
              ['Vendors', '/vendors', Users],
              ['Become a Vendor', '/member/vendor-application', PlusCircle],
              ['My Vendor Application', '/member/vendor-application', FileText],
              ['Application Status', '/member/vendor-application-status', ClipboardList],
              ['Wishlist', '/customer/wishlist', Heart],
              ['Orders', '/customer/wishlist', ShoppingBag],
            ];
          }
        }

        const isMarketplaceGroup = item.label === 'Marketplace';
        const isMemberConsole = title === 'Member Console' || location.pathname.includes('/member');
        const filteredChildren = children.filter(([label]) => 
          bypassEnabledCheck || 
          (isApprovedVendor && isMarketplaceGroup) || 
          isMemberConsole ||
          isSidebarItemEnabled(label)
        )
        return filteredChildren.length ? { ...item, children: filteredChildren } : null
      })
      .filter(Boolean)

    if (!value) return visibleNavItems

    return visibleNavItems
      .map((item) => {
        if (Array.isArray(item)) return item[0].toLowerCase().includes(value) ? item : null
        const children = item.children.filter(([label]) => label.toLowerCase().includes(value))
        if (item.label.toLowerCase().includes(value) || children.length) return { ...item, children: children.length ? children : item.children }
        return null
      })
      .filter(Boolean)
  }, [isSidebarItemEnabled, navItems, query, user?.role, ROLE_NAV_ITEMS, user?.vendorProfile?.status])

  const pageTitle = useMemo(() => {
    for (const item of navItems) {
      if (Array.isArray(item) && item[1] === location.pathname) return item[0]
      if (!Array.isArray(item)) {
        const child = item.children.find(([, to]) => to === location.pathname)
        if (child) return child[0]
      }
    }
    return title
  }, [location.pathname, navItems, title])

  const toggleGroup = (label) => {
    setOpenGroups((current) => ({ ...current, [label]: !current[label] }))
  }

  const Sidebar = (
    <aside className="flex h-full flex-col border-r border-slate-900 bg-[#07111f] text-white shadow-2xl">
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        <div className={collapsed ? 'hidden' : 'block'}>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg p-1 shadow-sm">
              <img src={logo} alt="Gloaro" className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="font-playfair text-2xl font-bold leading-none text-white">Gloaro</p>
            </div>
          </div>
          <div className="mt-1 flex w-full justify-center text-center">
            <p className="text-[10px] font-extrabold text-center uppercase tracking-[0.16em] text-[#ffbf1a]">{title}</p>
          </div>
        </div>
        <button type="button" onClick={() => setCollapsed((value) => !value)} className="hidden h-9 w-9 place-items-center rounded-md border border-white/10 text-slate-300 hover:bg-white/10 lg:grid" aria-label="Collapse menu">
          <ChevronLeft className={`h-4 w-4 transition ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {!collapsed && (
        <div className="p-3">
          <label className="flex h-10 items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 text-sm text-slate-300">
            <Search className="h-4 w-4" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search menu" className="w-full bg-transparent font-semibold outline-none placeholder:text-slate-500" />
          </label>
        </div>
      )}

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
        {filteredNav.map((item) => {
          if (!Array.isArray(item)) {
            const Icon = item.icon
            const isExpanded = collapsed ? false : openGroups[item.label] ?? item.children.some(([, to]) => to === location.pathname)
            return (
              <div key={item.label} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleGroup(item.label)}
                  className={`flex h-10 w-full items-center gap-3 rounded-md bg-white/10 px-3 text-sm font-bold text-white transition hover:bg-white/15 ${collapsed ? 'justify-center' : ''}`}
                  aria-expanded={isExpanded}
                >
                  <Icon className="h-4 w-4" />
                  {!collapsed && <span className="flex-1">{item.label}</span>}
                  {!collapsed && <ChevronDown className={`h-4 w-4 transition ${isExpanded ? 'rotate-180' : ''}`} />}
                </button>
                {!collapsed && isExpanded && <div className="space-y-1 pl-4">
                  {item.children.map(([label, to, ChildIcon]) => (
                    <NavLink
                      key={label}
                      to={to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) => `flex h-9 items-center gap-3 rounded-md px-3 text-sm font-bold ${isActive ? 'bg-[#0d4697] text-white shadow-lg shadow-blue-950/30' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
                    >
                      <ChildIcon className="h-3.5 w-3.5" />
                      {label}
                    </NavLink>
                  ))}
                </div>}
              </div>
            )
          }

          const [label, to, Icon] = item
          return (
            <NavLink
              key={label}
              to={to}
              end={['/admin', '/vendor', '/membership/dashboard'].includes(to)}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `flex h-10 items-center gap-3 rounded-md px-3 text-sm font-bold ${collapsed ? 'justify-center' : ''} ${isActive ? 'bg-[#0d4697] text-white shadow-lg shadow-blue-950/30' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
            >
              <Icon className="h-4 w-4" />
              {!collapsed && label}
            </NavLink>
          )
        })}
      </nav>
      {!collapsed && (
        <footer className="border-t border-white/10 p-4 text-xs font-semibold text-slate-400">
          <p>Gloaro Network</p>
          <p className="mt-1">Enterprise Admin Console</p>
        </footer>
      )}
    </aside>
  )

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className={`fixed inset-y-0 left-0 z-30 hidden transition-[width] lg:block ${collapsed ? 'w-20' : 'w-72'}`}>{Sidebar}</div>
      {open && <div className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden" onClick={() => setOpen(false)}><div className="h-full w-72" onClick={(event) => event.stopPropagation()}>{Sidebar}</div></div>}
      <div className={`transition-[padding] ${collapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 lg:hidden dark:border-slate-800" aria-label="Open menu"><Menu className="h-4 w-4" /></button>
            <div>
              <p className="text-xs font-bold text-slate-500">{title} / {pageTitle}</p>
              <h1 className="text-lg font-extrabold">{user?.name || title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setDark((value) => !value)} className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 dark:border-slate-800" aria-label="Toggle theme">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {impersonating && <button onClick={returnToSuperAdmin} className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700">Return to Super Admin</button>}
            <button onClick={logout} className="rounded-md bg-[#0d4697] px-4 py-2 text-sm font-bold text-white">Logout</button>
          </div>
        </header>
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
    </main>
  )
}
