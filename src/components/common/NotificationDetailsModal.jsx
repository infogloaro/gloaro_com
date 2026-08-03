import Modal from './Modal'
import { formatDate } from '../../utils/format'

export default function NotificationDetailsModal({ notification, open, onClose, unavailable = false }) {
  if (!notification) return null

  return (
    <Modal open={open} title={notification.title || 'Notification'} onClose={onClose}>
      <div className="space-y-4">
        {unavailable && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
            This item is no longer available.
          </div>
        )}
        <p className="text-sm font-semibold leading-6 text-slate-600">{notification.message || notification.body || 'No message available.'}</p>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-black uppercase text-slate-400">Type</dt>
            <dd className="mt-1 font-bold text-slate-800">{notification.type || 'notification'}</dd>
          </div>
          <div>
            <dt className="text-xs font-black uppercase text-slate-400">Priority</dt>
            <dd className="mt-1 font-bold text-slate-800">{notification.priority || 'normal'}</dd>
          </div>
          <div>
            <dt className="text-xs font-black uppercase text-slate-400">Category</dt>
            <dd className="mt-1 font-bold text-slate-800">{notification.category || 'personal'}</dd>
          </div>
          <div>
            <dt className="text-xs font-black uppercase text-slate-400">Received</dt>
            <dd className="mt-1 font-bold text-slate-800">{formatDate(notification.createdAt)}</dd>
          </div>
        </dl>
      </div>
    </Modal>
  )
}
