import { ChevronDown, Menu, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function DashboardLayout({ navItems = [], title = 'Dashboard' }) {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem('gloaro_theme') === 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('gloaro_theme', dark ? 'dark' : 'light')
  }, [dark])

  const Sidebar = (
    <aside className="h-full border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="flex h-16 items-center border-b border-slate-200 px-5 dark:border-slate-800">
        <div>
          <p className="font-playfair text-2xl font-bold text-[#0d4697]">Gloaro</p>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#d6a744]">{title}</p>
        </div>
      </div>
      <nav className="space-y-1 p-3">
        {navItems.map((item) => {
          if (!Array.isArray(item)) {
            const Icon = item.icon
            return (
              <div key={item.label} className="space-y-1">
                <div className="flex h-10 items-center gap-3 rounded-md bg-[#0d4697] px-3 text-sm font-bold text-white">
                  <Icon className="h-4 w-4" />
                  <span className="flex-1">{item.label}</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
                <div className="space-y-1 pl-4">
                  {item.children.map(([label, to, ChildIcon]) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) => `flex h-9 items-center gap-3 rounded-md px-3 text-sm font-bold ${isActive ? 'bg-blue-50 text-[#0d4697] dark:bg-slate-900 dark:text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'}`}
                    >
                      <ChildIcon className="h-3.5 w-3.5" />
                      {label}
                    </NavLink>
                  ))}
                </div>
              </div>
            )
          }

          const [label, to, Icon] = item
          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin' || to === '/vendor'}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `flex h-10 items-center gap-3 rounded-md px-3 text-sm font-bold ${isActive ? 'bg-[#0d4697] text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'}`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">{Sidebar}</div>
      {open && <div className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden" onClick={() => setOpen(false)}><div className="h-full w-72" onClick={(event) => event.stopPropagation()}>{Sidebar}</div></div>}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 lg:hidden dark:border-slate-800" aria-label="Open menu"><Menu className="h-4 w-4" /></button>
            <div>
              <p className="text-sm font-bold text-slate-500">Welcome</p>
              <h1 className="text-lg font-extrabold">{user?.name || title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setDark((value) => !value)} className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 dark:border-slate-800" aria-label="Toggle theme">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
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
