import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Bell, Check, Eye, MailOpen, Mail, Search, Trash2 } from 'lucide-react'
import { notificationApi } from '../../api/notification'
import LoadingScreen from '../../components/common/LoadingScreen'
import Pagination from '../../components/common/Pagination'
import NotificationDetailsModal from '../../components/common/NotificationDetailsModal'
import { useAuth } from '../../hooks/useAuth'
import { resolveNotificationNavigation } from '../../utils/notificationRouting'
import { formatDate } from '../../utils/format'

const tabs = [
  { key: 'all', label: 'All', isRead: '' },
  { key: 'unread', label: 'Unread', isRead: 'false' },
  { key: 'read', label: 'Read', isRead: 'true' },
]

const statCards = [
  ['total', 'Total Notifications'],
  ['unread', 'Unread'],
  ['read', 'Read'],
  ['highPriority', 'High Priority'],
  ['today', "Today's Notifications"],
]

export default function NotificationsPage({ systemView = false }) {
  const { socket, user, canAccessPath } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [stats, setStats] = useState({ total: 0, unread: 0, read: 0, highPriority: 0, today: 0 })
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 })
  const [notificationDetails, setNotificationDetails] = useState(null)
  const [notificationUnavailable, setNotificationUnavailable] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priority: '',
    isRead: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10,
  })

  const loadNotifications = useCallback(async () => {
    setLoading(true)
    try {
      const [listRes, countRes] = await Promise.all([
        systemView ? notificationApi.systemList(filters) : notificationApi.list(filters),
        systemView ? Promise.resolve({ data: { data: { count: 0 } } }) : notificationApi.unreadCount(),
      ])
      const payload = listRes.data || {}
      setNotifications(payload.allNotifications || payload.data || [])
      setStats(payload.stats || { total: 0, unread: 0, read: 0, highPriority: 0, today: 0 })
      setPagination(payload.pagination || { currentPage: filters.page, totalPages: 1 })
      setUnreadCount(Number(countRes.data?.data?.count || countRes.data?.count || payload.stats?.unread || 0))
    } catch {
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }, [filters, systemView])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadNotifications()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [loadNotifications])

  useEffect(() => {
    if (!socket || systemView) return undefined

    const handleNewNotification = (notification) => {
      if (filters.isRead === 'true') return
      setNotifications((prev) => [notification, ...prev])
      setUnreadCount((prev) => prev + 1)
      setStats((prev) => ({
        ...prev,
        total: prev.total + 1,
        unread: prev.unread + 1,
        today: prev.today + 1,
        highPriority: notification.priority === 'high' ? prev.highPriority + 1 : prev.highPriority,
      }))
      toast(notification.title || notification.message || 'New notification')
    }

    socket.on('notification', handleNewNotification)
    return () => {
      socket.off('notification', handleNewNotification)
    }
  }, [filters.isRead, socket, systemView])

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value, page: key === 'page' ? value : 1 }))
  }

  const setTab = (tab) => {
    setFilters((current) => ({ ...current, isRead: tab.isRead, page: 1 }))
  }

  const refreshAfterMutation = async () => {
    await loadNotifications()
    window.dispatchEvent(new Event('gloaro:notification-unread-refresh'))
  }

  const markAsRead = async (id) => {
    await notificationApi.markRead(id)
    await refreshAfterMutation()
  }

  const markAsUnread = async (id) => {
    await notificationApi.markUnread(id)
    await refreshAfterMutation()
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.readAll()
      await refreshAfterMutation()
      toast.success('All notifications marked as read')
    } catch {
      toast.error('Failed to mark all as read')
    }
  }

  const handleDelete = async (id) => {
    try {
      await notificationApi.remove(id)
      await refreshAfterMutation()
      toast.success('Notification deleted')
    } catch {
      toast.error('Failed to delete notification')
    }
  }

  const handleOpenNotification = async (item) => {
    try {
      if (!item.isRead) {
        await notificationApi.markRead(item._id)
        window.dispatchEvent(new Event('gloaro:notification-unread-refresh'))
      }
      const target = resolveNotificationNavigation(item, user, { canAccessPath })
      if (target.action === 'navigate') {
        if (target.external) window.location.assign(target.path)
        else navigate(target.path)
        return
      }
      await loadNotifications()
      setNotificationUnavailable(target.reason === 'unavailable')
      setNotificationDetails({ ...item, isRead: true, readAt: item.readAt || new Date().toISOString() })
    } catch {
      toast.error('Failed to open notification')
    }
  }

  const activeTab = tabs.find((tab) => tab.isRead === filters.isRead)?.key || 'all'

  if (loading) return <LoadingScreen label="Loading notification history..." />

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#0d4697]">
            <Bell className="h-4 w-4" /> Communication
          </p>
          <h1 className="mt-2 text-2xl font-black text-slate-950">{systemView ? 'System Notifications' : 'Notifications'}</h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">Complete notification history with read status, priority, and delivery context.</p>
        </div>
        {!systemView && unreadCount > 0 && (
          <button type="button" onClick={handleMarkAllAsRead} className="inline-flex items-center gap-2 rounded-lg bg-[#0d4697] px-4 py-2 text-sm font-black text-white hover:bg-blue-800">
            <Check className="h-4 w-4" /> Mark All Read
          </button>
        )}
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map(([key, label]) => (
          <article key={key} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-black uppercase text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-black text-slate-950">{stats[key] || 0}</p>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setTab(tab)}
                className={`rounded-md px-4 py-2 text-sm font-black transition ${activeTab === tab.key ? 'bg-[#0d4697] text-white shadow-sm' : 'text-slate-600 hover:bg-white'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="grid gap-2 md:grid-cols-5">
            <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700">
              <Search className="h-4 w-4 text-slate-400" />
              <input value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} className="min-w-0 flex-1 outline-none" placeholder="Search" />
            </label>
            <select value={filters.category} onChange={(event) => updateFilter('category', event.target.value)} className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700">
              <option value="">Category</option>
              {['personal', 'role', 'hierarchy', 'community', 'broadcast', 'system'].map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
            <select value={filters.priority} onChange={(event) => updateFilter('priority', event.target.value)} className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700">
              <option value="">Priority</option>
              {['low', 'normal', 'high'].map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
            <input type="date" value={filters.startDate} onChange={(event) => updateFilter('startDate', event.target.value)} className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700" />
            <input type="date" value={filters.endDate} onChange={(event) => updateFilter('endDate', event.target.value)} className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700" />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-[1050px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                {['', 'Title', 'Message', 'Category', 'Priority', 'Received Date', 'Read Date', 'Action'].map((head) => (
                  <th key={head || 'status'} className="px-4 py-3 font-black">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {notifications.map((item) => (
                <tr key={item._id} className="bg-white hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <span className={`block h-2.5 w-2.5 rounded-full ${item.isRead ? 'bg-slate-300' : 'bg-[#0d4697]'}`} />
                  </td>
                  <td className={`px-4 py-3 ${item.isRead ? 'font-semibold text-slate-700' : 'font-black text-slate-950'}`}>{item.title || 'Notification'}</td>
                  <td className="max-w-sm px-4 py-3 font-medium text-slate-600">{item.message || item.body || '-'}</td>
                  <td className="px-4 py-3 font-bold text-slate-600">{item.category || 'personal'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-black ${item.priority === 'high' ? 'bg-red-50 text-red-700' : item.priority === 'low' ? 'bg-slate-100 text-slate-600' : 'bg-blue-50 text-[#0d4697]'}`}>{item.priority || 'normal'}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-600">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-3 font-medium text-slate-600">{item.readAt ? formatDate(item.readAt) : '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => handleOpenNotification(item)} className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-white px-2.5 py-1.5 text-xs font-black text-[#0d4697] hover:bg-blue-50"><Eye className="h-3.5 w-3.5" /> Open</button>
                      {!systemView && item.isRead && <button type="button" onClick={() => markAsUnread(item._id)} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-black text-slate-600 hover:bg-slate-50"><Mail className="h-3.5 w-3.5" /> Mark Unread</button>}
                      {!systemView && !item.isRead && <button type="button" onClick={() => markAsRead(item._id)} className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-white px-2.5 py-1.5 text-xs font-black text-emerald-700 hover:bg-emerald-50"><MailOpen className="h-3.5 w-3.5" /> Mark Read</button>}
                      <button type="button" onClick={() => { setNotificationUnavailable(false); setNotificationDetails(item) }} className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-black text-slate-600 hover:bg-slate-50">Details</button>
                      {!systemView && <button type="button" onClick={() => handleDelete(item._id)} className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-2.5 py-1.5 text-xs font-black text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /> Delete</button>}
                    </div>
                  </td>
                </tr>
              ))}
              {!notifications.length && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Bell className="mx-auto h-10 w-10 text-slate-300" />
                    <p className="mt-3 text-sm font-bold text-slate-500">No notifications found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <Pagination pagination={pagination} onPageChange={(page) => updateFilter('page', page)} />
        )}
      </section>

      <NotificationDetailsModal
        open={Boolean(notificationDetails)}
        notification={notificationDetails}
        unavailable={notificationUnavailable}
        onClose={() => {
          setNotificationDetails(null)
          setNotificationUnavailable(false)
        }}
      />
    </div>
  )
}
