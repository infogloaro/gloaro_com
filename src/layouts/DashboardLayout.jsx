import { ChevronDown, ChevronLeft, Menu, Moon, Search, Sun } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
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

  const filteredNav = useMemo(() => {
    const value = query.trim().toLowerCase()
    const visibleNavItems = navItems
      .map((item) => {
        if (Array.isArray(item)) return isSidebarItemEnabled(item[0]) ? item : null
        const children = item.children.filter(([label]) => isSidebarItemEnabled(label))
        return children.length ? { ...item, children } : null
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
  }, [isSidebarItemEnabled, navItems, query])

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
          <p className="font-playfair text-2xl font-bold text-white">Gloaro</p>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#ffbf1a]">{title}</p>
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
                      key={to}
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
              key={to}
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
