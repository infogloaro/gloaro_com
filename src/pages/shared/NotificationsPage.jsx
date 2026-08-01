import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { notificationApi } from '../../api/notification'
import LoadingScreen from '../../components/common/LoadingScreen'
import { useAuth } from '../../hooks/useAuth'
import { getCommunityNotificationPath } from '../../utils/communityNotifications'
import {
  AtSign,
  Bell,
  Check,
  CheckCircle2,
  AlertTriangle,
  Info,
  Lock,
  PlusCircle,
  Trash2,
  XCircle,
} from 'lucide-react'
import { formatDate } from '../../utils/format'

export default function NotificationsPage() {
  const { socket, user } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const [listRes, countRes] = await Promise.all([
        notificationApi.list({ limit: 50 }),
        notificationApi.unreadCount(),
      ])
      setNotifications(listRes.data?.data || listRes.data || [])
      setUnreadCount(countRes.data?.data?.count || countRes.data?.count || 0)
    } catch {
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadNotifications()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  // Listen to real-time notifications via Socket.IO
  useEffect(() => {
    if (!socket) return

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev])
      setUnreadCount((prev) => prev + 1)
      toast(() => (
        <span className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-[#0d4697]" />
          <span>{notification.title || notification.message}</span>
        </span>
      ))
    }

    socket.on('notification', handleNewNotification)

    return () => {
      socket.off('notification', handleNewNotification)
    }
  }, [socket])

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markRead(id)
      setNotifications((prev) =>
        prev.map((item) => (item._id === id ? { ...item, isRead: true } : item))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
      window.dispatchEvent(new Event('gloaro:notification-unread-refresh'))
      toast.success('Notification marked as read')
    } catch {
      toast.error('Failed to mark notification as read')
    }
  }

  const handleOpenNotification = async (item) => {
    const targetPath = getCommunityNotificationPath(item, user)
    try {
      if (!item.isRead) {
        await notificationApi.markRead(item._id)
        setNotifications((prev) =>
          prev.map((notification) => (notification._id === item._id ? { ...notification, isRead: true } : notification))
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
        window.dispatchEvent(new Event('gloaro:notification-unread-refresh'))
      }
      if (targetPath) navigate(targetPath)
    } catch {
      toast.error('Failed to open notification')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.readAll()
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })))
      setUnreadCount(0)
      window.dispatchEvent(new Event('gloaro:notification-unread-refresh'))
      toast.success('All notifications marked as read')
    } catch {
      toast.error('Failed to mark all as read')
    }
  }

  const handleDelete = async (id) => {
    try {
      await notificationApi.remove(id)
      setNotifications((prev) => prev.filter((item) => item._id !== id))
      window.dispatchEvent(new Event('gloaro:notification-unread-refresh'))
      toast.success('Notification removed')
    } catch {
      toast.error('Failed to remove notification')
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case 'new_membership':
      case 'user_creation':
        return <PlusCircle className="h-5 w-5 text-blue-600" />
      case 'approval_request':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case 'password_reset':
        return <Lock className="h-5 w-5 text-purple-500" />
      case 'membership_approved':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      case 'membership_rejected':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'community_post':
        return <Bell className="h-5 w-5 text-[#0d4697]" />
      case 'community_mention':
        return <AtSign className="h-5 w-5 text-amber-500" />
      default:
        return <Info className="h-5 w-5 text-slate-500" />
    }
  }

  if (loading) return <LoadingScreen label="Loading Notifications..." />

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/60 bg-white/85 p-6 shadow-sm backdrop-blur">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#0d4697]">
            <Bell className="h-4 w-4" /> Notification Center
          </p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">Your Notifications</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Real-time updates on registrations, status changes, workflow requests, and approvals.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#0d4697] px-4 text-xs font-extrabold text-white hover:bg-blue-800"
          >
            <Check className="h-4 w-4" /> Mark All as Read
          </button>
        )}
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <span className="text-sm font-bold text-slate-800">
            Unread Notifications: <span className="text-[#0d4697]">{unreadCount}</span>
          </span>
        </div>

        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <div
                key={item._id}
                role={getCommunityNotificationPath(item, user) ? 'button' : undefined}
                tabIndex={getCommunityNotificationPath(item, user) ? 0 : undefined}
                onClick={() => {
                  if (getCommunityNotificationPath(item, user)) handleOpenNotification(item)
                }}
                onKeyDown={(event) => {
                  if (!getCommunityNotificationPath(item, user)) return
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    handleOpenNotification(item)
                  }
                }}
                className={`flex items-start justify-between gap-4 rounded-xl border p-4 transition hover:shadow-md ${
                  item.isRead
                    ? 'border-slate-100 bg-white'
                    : 'border-blue-100 bg-blue-50/40'
                } ${getCommunityNotificationPath(item, user) ? 'cursor-pointer' : ''}`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-1 shrink-0">{getIcon(item.type)}</div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-extrabold text-slate-900 truncate">
                      {item.title || 'Notification'}
                    </h4>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      {item.message || item.body}
                    </p>
                    <p className="mt-2 text-[10px] font-bold text-slate-400">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!item.isRead && (
                    <button
                      onClick={(event) => {
                        event.stopPropagation()
                        handleMarkAsRead(item._id)
                      }}
                      className="grid h-8 w-8 place-items-center rounded bg-white text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-[#0d4697]"
                      title="Mark as read"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={(event) => {
                      event.stopPropagation()
                      handleDelete(item._id)
                    }}
                    className="grid h-8 w-8 place-items-center rounded bg-white text-slate-400 border border-slate-200 hover:bg-red-50 hover:text-red-600"
                    title="Delete notification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <Bell className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-sm font-bold text-slate-500">You are all caught up!</p>
              <p className="text-xs font-semibold text-slate-400">No notifications found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
