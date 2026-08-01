import { Bell, ChevronDown, ChevronLeft, Menu, Search, LogOut } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import logo from '../assets/signup_logo.png'
import { communityApi } from '../api/community'
import { notificationApi } from '../api/notification'
import { useAuth } from '../hooks/useAuth'
import { storage } from '../utils/storage'
import { buildAdminRoute } from '../utils/permissions'
import { formatDate } from '../utils/format'
import { resolveNotificationNavigation } from '../utils/notificationRouting'
import NotificationDetailsModal from '../components/common/NotificationDetailsModal'
import { ROLES } from '../constants/roleConfig.js'
import { resolveNavigation, NAVIGATION_MODES } from '../utils/navigationResolver'

export default function DashboardLayout({ navItems = [], title = 'Dashboard' }) {
  const { user, logout, hasSidebar, marketplaceAccess, socket, canAccessPath } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [query, setQuery] = useState('')
  const [openGroups, setOpenGroups] = useState({})
  const [impersonating, setImpersonating] = useState(() => Boolean(sessionStorage.getItem('gloaro_superadmin_session')))
  const [chatUnreadCount, setChatUnreadCount] = useState(0)
  const [notificationUnreadCount, setNotificationUnreadCount] = useState(0)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notificationPreview, setNotificationPreview] = useState([])
  const [notificationLoading, setNotificationLoading] = useState(false)
  const [notificationDetails, setNotificationDetails] = useState(null)
  const [notificationUnavailable, setNotificationUnavailable] = useState(false)

  const hasExplicitNavItems = navItems.length > 0
  const isSuperAdmin = user?.role === ROLES.SUPERADMIN
  const navigation = useMemo(() => resolveNavigation({
    user,
    marketplaceAccess,
    navItems,
  }), [marketplaceAccess, navItems, user])
  const resolvedNavItems = hasExplicitNavItems ? navItems : navigation.items
  const navigationMode = hasExplicitNavItems ? NAVIGATION_MODES.ROLE_BASED : navigation.mode
  const displayTitle = hasExplicitNavItems ? title : (navigation.title === 'Dashboard' ? title : navigation.title)
  const isVendorApplicant = navigationMode === NAVIGATION_MODES.ONLINE_VENDOR_APPLICANT || navigationMode === NAVIGATION_MODES.ONLINE_VENDOR_PENDING
  const isApprovedVendor = navigationMode === NAVIGATION_MODES.ONLINE_VENDOR_APPROVED

  const refreshChatUnreadCount = useCallback(() => {
    if (!user?._id) return
    communityApi.getChatUnreadCount()
      .then((res) => setChatUnreadCount(Number(res.data?.data?.count || 0)))
      .catch(() => {})
  }, [user?._id])

  const refreshNotificationUnreadCount = useCallback(() => {
    if (!user?._id) return
    notificationApi.unreadCount()
      .then((res) => setNotificationUnreadCount(Number(res.data?.data?.count || res.data?.count || 0)))
      .catch(() => {})
  }, [user?._id])

  const loadNotificationPreview = useCallback(() => {
    if (!user?._id) return Promise.resolve()
    setNotificationLoading(true)
    return Promise.all([
      notificationApi.list({ limit: 10, isRead: false }),
      notificationApi.unreadCount(),
    ]).then(([listRes, countRes]) => {
      setNotificationPreview(listRes.data?.data || listRes.data || [])
      setNotificationUnreadCount(Number(countRes.data?.data?.count || countRes.data?.count || 0))
    }).catch(() => {
      toast.error('Unable to load notifications')
    }).finally(() => setNotificationLoading(false))
  }, [user?._id])

  useEffect(() => {
    refreshChatUnreadCount()
    refreshNotificationUnreadCount()
  }, [refreshChatUnreadCount, refreshNotificationUnreadCount, location.pathname])

  useEffect(() => {
    const handleRefresh = () => refreshChatUnreadCount()
    window.addEventListener('gloaro:chat-unread-refresh', handleRefresh)
    return () => window.removeEventListener('gloaro:chat-unread-refresh', handleRefresh)
  }, [refreshChatUnreadCount])

  useEffect(() => {
    const handleRefresh = () => {
      refreshNotificationUnreadCount()
      if (notificationOpen) loadNotificationPreview()
    }
    window.addEventListener('gloaro:notification-unread-refresh', handleRefresh)
    return () => window.removeEventListener('gloaro:notification-unread-refresh', handleRefresh)
  }, [loadNotificationPreview, notificationOpen, refreshNotificationUnreadCount])

  const returnToSuperAdmin = () => {
    const raw = sessionStorage.getItem('gloaro_superadmin_session')
    if (!raw) return
    try {
      const session = JSON.parse(raw)
      storage.setSession(session, false)
      sessionStorage.removeItem('gloaro_superadmin_session')
      setImpersonating(false)
      window.location.href = buildAdminRoute(ROLES.SUPERADMIN, '/admin-management')
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
    let activeNavItems = resolvedNavItems
    let bypassEnabledCheck = false
    if (user?.role) {
      bypassEnabledCheck = true
    }
    if (isVendorApplicant || isApprovedVendor) {
      bypassEnabledCheck = true
    }

    const visibleNavItems = activeNavItems
      .map((item) => {
        if (!item) return null
        if (Array.isArray(item)) return (bypassEnabledCheck || isSidebarItemEnabled(item[0])) ? item : null
        const filteredChildren = [...item.children].filter(([label]) => bypassEnabledCheck || isSidebarItemEnabled(label))
        return filteredChildren.length ? { ...item, children: filteredChildren } : null
      })
      .filter(Boolean)

    if (!value) return visibleNavItems

    return visibleNavItems
      .map((item) => {
        if (!item) return null
        if (Array.isArray(item)) return item[0].toLowerCase().includes(value) ? item : null
        const children = item.children.filter(([label]) => label.toLowerCase().includes(value))
        if (item.label.toLowerCase().includes(value) || children.length) return { ...item, children: children.length ? children : item.children }
        return null
      })
      .filter(Boolean)
  }, [isSidebarItemEnabled, resolvedNavItems, query, user?.role, isVendorApplicant, isApprovedVendor])

  const pageTitle = useMemo(() => {
    for (const item of resolvedNavItems) {
      if (Array.isArray(item) && item[1] === location.pathname) return item[0]
      if (!Array.isArray(item)) {
        const child = item.children.find(([, to]) => to === location.pathname)
        if (child) return child[0]
      }
    }
    return title
  }, [location.pathname, resolvedNavItems, title])

  const chatRoute = useMemo(() => {
    for (const item of resolvedNavItems) {
      if (Array.isArray(item) && item[1]?.endsWith('/chat')) return item[1]
      if (!Array.isArray(item)) {
        const preferred = item.children.find(([label, to]) => label === 'Messages' && to?.endsWith('/chat'))
        if (preferred) return preferred[1]
        const child = item.children.find(([, to]) => to?.endsWith('/chat'))
        if (child) return child[1]
      }
    }
    return '/member/dashboard/chat'
  }, [resolvedNavItems])

  useEffect(() => {
    if (!socket) return undefined

    const handleDirectMessage = ({ message }) => {
      refreshChatUnreadCount()
      const senderId = String(message?.sender?._id || message?.sender || '')
      const activeRecipient = new URLSearchParams(window.location.search).get('recipient')
      if (location.pathname === chatRoute && activeRecipient === senderId) return

      toast.custom((toastItem) => (
        <button
          type="button"
          onClick={() => {
            toast.dismiss(toastItem.id)
            navigate(`${chatRoute}?recipient=${senderId}`)
          }}
          className="rounded-xl border border-blue-100 bg-white px-4 py-3 text-left shadow-lg"
        >
          <p className="text-sm font-black text-slate-900">New message from {message?.sender?.name || 'Member'}</p>
          <p className="mt-1 max-w-72 truncate text-xs font-semibold text-slate-500">"{message?.content || 'Attachment'}"</p>
        </button>
      ))
    }

    socket.on('direct_message', handleDirectMessage)
    socket.on('direct_message_read', refreshChatUnreadCount)
    return () => {
      socket.off('direct_message', handleDirectMessage)
      socket.off('direct_message_read', refreshChatUnreadCount)
    }
  }, [chatRoute, location.pathname, navigate, refreshChatUnreadCount, socket])

  useEffect(() => {
    if (!socket) return undefined

    const handleNotification = () => {
      setNotificationUnreadCount((count) => count + 1)
      if (notificationOpen) loadNotificationPreview()
    }

    socket.on('notification', handleNotification)
    return () => {
      socket.off('notification', handleNotification)
    }
  }, [loadNotificationPreview, notificationOpen, socket])

  const toggleGroup = (label) => {
    setOpenGroups((current) => ({ ...current, [label]: !current[label] }))
  }

  const shouldShowChatBadge = (label, to) => chatUnreadCount > 0 && to?.endsWith('/chat') && ['Messages', 'Chat'].includes(label)
  const shouldShowNotificationBadge = (label, to) => notificationUnreadCount > 0 && (to?.endsWith('/notifications') || label.toLowerCase().includes('notification'))

  const openNotificationCenter = () => {
    setNotificationOpen(false)
    navigate('/notifications')
  }

  const handleMarkAllNotificationsRead = async () => {
    try {
      await notificationApi.readAll()
      setNotificationPreview([])
      setNotificationUnreadCount(0)
      window.dispatchEvent(new Event('gloaro:notification-unread-refresh'))
      toast.success('All notifications marked as read')
    } catch {
      toast.error('Unable to mark notifications as read')
    }
  }

  const handleNotificationClick = async (item) => {
    try {
      if (!item.isRead) {
        await notificationApi.markRead(item._id)
        setNotificationPreview((current) =>
          current.filter((notification) => notification._id !== item._id)
        )
        setNotificationUnreadCount((count) => Math.max(0, count - 1))
        window.dispatchEvent(new Event('gloaro:notification-unread-refresh'))
      }
      setNotificationOpen(false)
      const target = resolveNotificationNavigation(item, user, { canAccessPath })
      if (target.action === 'navigate') {
        if (target.external) window.location.assign(target.path)
        else navigate(target.path)
        return
      }
      setNotificationUnavailable(target.reason === 'unavailable')
      setNotificationDetails({ ...item, isRead: true })
    } catch {
      toast.error('Unable to open notification')
    }
  }

  const CountBadge = ({ count, tone = 'blue' }) => (
    <span className={`ml-auto grid min-h-5 min-w-5 place-items-center rounded-full px-1.5 text-[10px] font-black ${tone === 'amber' ? 'bg-[#ffbf1a] text-slate-950' : 'bg-[#0d4697] text-white'}`}>
      {count > 99 ? '99+' : count}
    </span>
  )

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
            <p className="text-[10px] font-extrabold text-center uppercase tracking-[0.16em] text-[#ffbf1a]">{displayTitle}</p>
          </div>
        </div>
        <button type="button" onClick={() => setCollapsed((value) => !value)} className="hidden h-9 w-9 place-items-center rounded-md border border-white/10 text-slate-300 hover:bg-white/10 lg:grid" aria-label="Collapse menu">
          <ChevronLeft className={`h-4 w-4 transition ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {!collapsed && !isSuperAdmin && (
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
                      <span className="min-w-0 flex-1 truncate">{label}</span>
                      {shouldShowChatBadge(label, to) && <CountBadge count={chatUnreadCount} />}
                      {shouldShowNotificationBadge(label, to) && <CountBadge count={notificationUnreadCount} tone="amber" />}
                    </NavLink>
                  ))}
                </div>}
              </div>
            )
          }

          const [label, to, Icon] = item
          if (to === '__logout__') {
            return (
              <button
                key={label}
                type="button"
                onClick={logout}
                className={`flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-bold ${collapsed ? 'justify-center' : ''} text-slate-300 hover:bg-white/10 hover:text-white`}
              >
                <LogOut className="h-4 w-4" />
                {!collapsed && label}
              </button>
            )
          }
          return (
            <NavLink
              key={label}
              to={to}
              end={['/admin/dashboard', '/super-admin/dashboard', '/vendor', '/membership/dashboard', '/customer/dashboard'].includes(to)}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `flex h-10 items-center gap-3 rounded-md px-3 text-sm font-bold ${collapsed ? 'justify-center' : ''} ${isActive ? 'bg-[#0d4697] text-white shadow-lg shadow-blue-950/30' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
            >
              <Icon className="h-4 w-4" />
              {!collapsed && <span className="min-w-0 flex-1 truncate">{label}</span>}
              {!collapsed && shouldShowChatBadge(label, to) && <CountBadge count={chatUnreadCount} />}
              {!collapsed && shouldShowNotificationBadge(label, to) && <CountBadge count={notificationUnreadCount} tone="amber" />}
            </NavLink>
          )
        })}
      </nav>
      {!collapsed && (
        <footer className="border-t border-white/10 p-4 text-xs font-semibold text-slate-400">
          <p>Gloaro Network</p>
          <p className="mt-1">{displayTitle}</p>
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
              <p className="text-xs font-bold text-slate-500 dark:text-blue-300">{title} / {pageTitle}</p>
              <h1 className="text-lg font-black text-slate-900 dark:text-white">{user?.name || title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationOpen((openState) => !openState)
                  if (!notificationOpen) loadNotificationPreview()
                }}
                className="relative grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                aria-label="Open notifications"
              >
                <Bell className="h-4 w-4" />
                {notificationUnreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-[#ffbf1a] px-1.5 text-[10px] font-black text-slate-950">
                    {notificationUnreadCount > 99 ? '99+' : notificationUnreadCount}
                  </span>
                )}
              </button>
              {notificationOpen && (
                <div className="absolute right-0 top-11 z-40 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                    <p className="text-sm font-black text-slate-900 dark:text-white">Notifications</p>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={handleMarkAllNotificationsRead} className="text-[11px] font-black text-slate-600 hover:text-[#0d4697] dark:text-slate-300">Mark all read</button>
                      <button type="button" onClick={openNotificationCenter} className="text-[11px] font-black text-[#0d4697] dark:text-blue-300">View all</button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto p-2">
                    {notificationLoading ? (
                      <p className="px-3 py-8 text-center text-xs font-bold text-slate-400">Loading notifications...</p>
                    ) : notificationPreview.length ? (
                      notificationPreview.map((item) => (
                        <button
                          key={item._id}
                          type="button"
                          onClick={() => handleNotificationClick(item)}
                          className={`mb-1 flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800 ${
                            item.isRead ? 'bg-white dark:bg-slate-900' : 'bg-blue-50/70 dark:bg-blue-950/30'
                          }`}
                        >
                          <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${item.isRead ? 'bg-slate-300' : 'bg-[#0d4697]'}`} />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-black text-slate-900 dark:text-white">{item.title || 'Notification'}</span>
                            <span className="mt-1 line-clamp-2 block text-[11px] font-semibold leading-4 text-slate-500 dark:text-slate-300">{item.message || item.body}</span>
                            <span className="mt-1 block text-[10px] font-bold text-slate-400">{formatDate(item.createdAt)}</span>
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-8 text-center text-xs font-bold text-slate-400">No notifications found.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {impersonating && <button onClick={returnToSuperAdmin} className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700">Return to Super Admin</button>}
            <button onClick={logout} className="rounded-md bg-[#0d4697] px-4 py-2 text-sm font-bold text-white">Logout</button>
          </div>
        </header>
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
      <NotificationDetailsModal
        open={Boolean(notificationDetails)}
        notification={notificationDetails}
        unavailable={notificationUnavailable}
        onClose={() => {
          setNotificationDetails(null)
          setNotificationUnavailable(false)
        }}
      />
    </main>
  )
}
