import { X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { ROLES } from '../../constants/roleConfig.js'

export default function Modal({ open, title, children, onClose, maxWidth = 'max-w-2xl' }) {
  const { user } = useAuth()
  const isSuperAdmin = user?.role === ROLES.SUPERADMIN
  if (!open) return null
  return (
    <div className={isSuperAdmin ? 'fixed inset-0 z-50 grid place-items-center bg-slate-200/80 p-4 backdrop-blur-sm' : 'fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4'}>
      <div className={`max-h-[90vh] w-full ${maxWidth} overflow-auto rounded-lg bg-white shadow-xl`}>
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
<button
  type="button"
  onClick={onClose}
  className="grid h-9 w-9 place-items-center rounded-full border border-slate-300 bg-white hover:bg-slate-100"
>
  <X className="h-5 w-5 text-slate-900" />
</button>        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
