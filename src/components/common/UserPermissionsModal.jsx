import { useEffect, useState } from 'react'
import api from '../../api/axios'
import LoadingScreen from '../common/LoadingScreen'
import toast from 'react-hot-toast'
import { CheckSquare, Square, Shield } from 'lucide-react'
import { ROLES } from '../../constants/roleConfig.js'

const ALL_MODULES = [
  "dashboard", "members", "meetings", "attendance", "visitors", "business_wall",
  "referrals", "training", "events", "announcements", "reports", "marketplace",
  ROLES.VENDOR, "products", "services", "payments", "orders", "coupons", "subscriptions",
  "support", "organization", "users", "roles", "permissions", "audit_logs",
  "settings", "notifications", "community", "ai_insights", "calendar",
  "leaderboard", "business_directory", "chat", "tasks", "help_desk",
  "qr_attendance", "digital_membership_card"
];

const ALL_ACTIONS = [
  "view", "create", "edit", "delete", "approve", "reject", "assign", "export",
  "print", "download", "upload", "manage"
];

export default function UserPermissionsModal({ userId, userName, onClose }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // States
  const [callerPerms, setCallerPerms] = useState([])
  const [userPerms, setUserPerms] = useState([])
  const [isSuper, setIsSuper] = useState(false)

  useEffect(() => {
    if (!userId) return

    setLoading(true)
    Promise.all([
      api.get('/permissions/my'),
      api.get(`/permissions/user/${userId}`),
      api.get('/auth/me')
    ])
      .then(([myRes, userRes, meRes]) => {
        setCallerPerms(myRes.data?.data || [])
        setUserPerms(userRes.data?.data?.permissions || [])
        setIsSuper(meRes.data?.data?.user?.role === ROLES.SUPERADMIN)
      })
      .catch(() => {
        toast.error('Failed to load permission registry')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [userId])

  const handleToggle = (moduleName, actionName) => {
    const code = `${moduleName}.${actionName}`
    
    // Inheritance Rule Check
    if (!isSuper && !callerPerms.includes(code)) {
      toast.error(`You cannot assign '${code}' because you do not possess it yourself.`)
      return
    }

    setUserPerms(prev => {
      if (prev.includes(code)) {
        return prev.filter(c => c !== code)
      } else {
        return [...prev, code]
      }
    })
  }

  const handleSave = () => {
    setSaving(true)
    api.post(`/permissions/user/${userId}`, { permissions: userPerms })
      .then(() => {
        toast.success('Permissions saved successfully!')
        onClose()
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to update permissions')
      })
      .finally(() => {
        setSaving(false)
      })
  }

  if (loading) {
    return <LoadingScreen label="Loading permission maps..." />
  }

  return (
    <div className={isSuper ? 'fixed inset-0 z-50 grid place-items-center bg-slate-200/80 p-4 backdrop-blur-sm' : 'fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4'}>
      <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl relative flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <header className="border-b border-slate-100 pb-3 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#0d4697]" />
              Manage Override Permissions: {userName}
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-1">Assign supervisor authorization nodes dynamically. Inherited constraints enforced.</p>
          </div>
          <button onClick={onClose} className="text-xs font-bold text-slate-400 hover:text-slate-600">Close</button>
        </header>

        {/* Permissions Grid */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {ALL_MODULES.map(moduleName => {
            return (
              <div key={moduleName} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <h4 className="text-xs font-black uppercase text-[#0d4697] tracking-wider border-b border-slate-200/60 pb-1">
                  {moduleName.replace(/_/g, ' ')}
                </h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {ALL_ACTIONS.map(actionName => {
                    const code = `${moduleName}.${actionName}`
                    const isChecked = userPerms.includes(code)
                    const canAssign = isSuper || callerPerms.includes(code)

                    return (
                      <button
                        key={actionName}
                        type="button"
                        onClick={() => handleToggle(moduleName, actionName)}
                        className={`flex items-center gap-2 text-xs font-bold text-left px-2 py-1 rounded hover:bg-slate-100 transition ${
                          !canAssign ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                        title={!canAssign ? "You do not possess this permission" : ""}
                      >
                        {isChecked ? (
                          <CheckSquare className="h-4 w-4 text-[#0d4697] shrink-0" />
                        ) : (
                          <Square className="h-4 w-4 text-slate-400 shrink-0" />
                        )}
                        <span className="capitalize">{actionName}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer Actions */}
        <footer className="border-t border-slate-100 pt-4 flex justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-extrabold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-[#0d4697] px-5 py-2 text-xs font-extrabold text-white hover:bg-blue-800 disabled:opacity-50"
          >
            {saving ? 'Saving changes...' : 'Save Permissions'}
          </button>
        </footer>
      </div>
    </div>
  )
}
