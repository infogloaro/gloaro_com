import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, ShieldAlert, Clock, ArrowRight, FileText, HelpCircle } from 'lucide-react'
import api from '../../api/axios'
import LoadingScreen from '../../components/common/LoadingScreen'
import StatusBadge from '../../components/common/StatusBadge'
import { VendorProductsPage } from '../vendor/VendorPages'

export default function MemberProductsPage() {
  const navigate = useNavigate()
  const [app, setApp] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get('/vendor-applications/my-application')
      .then((res) => {
        setApp(res.data?.data || null)
      })
      .catch(() => {
        setApp(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <LoadingScreen label="Verifying vendor marketplace credentials..." />
  }

  const isApproved = app && String(app.status).toLowerCase() === 'approved'

  if (isApproved) {
    return <VendorProductsPage />
  }

  // Render unapproved / pending warning page
  const status = app ? String(app.status).toLowerCase() : 'not_applied'

  const statusConfig = {
    draft: {
      label: 'Draft',
      Icon: FileText,
      iconColorClass: 'text-amber-600 bg-amber-50',
      description: 'Your vendor application is still in draft mode. Please finish and submit your application for review.',
    },
    pending_vp_review: {
      label: 'Pending VP Review',
      Icon: Clock,
      iconColorClass: 'text-indigo-600 bg-indigo-50',
      description: 'Your vendor application is waiting for Vice President pre-screening before marketplace approval begins.',
    },
    submitted: {
      label: 'Waiting for Marketplace Approval',
      Icon: Clock,
      iconColorClass: 'text-blue-600 bg-blue-50',
      description: 'Your vendor application has been forwarded from Vice President review and is awaiting the existing marketplace approval workflow.',
    },
    forwarded: {
      label: 'Waiting for Marketplace Approval',
      Icon: Clock,
      iconColorClass: 'text-blue-600 bg-blue-50',
      description: 'Your vendor application has been forwarded from Vice President review and is awaiting the existing marketplace approval workflow.',
    },
    rejected_by_vp: {
      label: 'Rejected by VP',
      Icon: ShieldAlert,
      iconColorClass: 'text-red-600 bg-red-50',
      description: 'Your vendor application was rejected during Vice President pre-screening. Please review the application status for notes.',
    },
    under_review: {
      label: 'Under Review',
      Icon: Clock,
      iconColorClass: 'text-indigo-600 bg-indigo-50',
      description: 'Your vendor application is currently in the marketplace approval workflow after Vice President pre-screening.',
    },
    rejected: {
      label: 'Rejected',
      Icon: ShieldAlert,
      iconColorClass: 'text-red-600 bg-red-50',
      description: 'Your vendor application was rejected. Please view the application status to check reviewer comments, and update/resubmit.',
    },
  }
  const currentStatus = statusConfig[status] || {
    label: 'Not Applied',
    Icon: HelpCircle,
    iconColorClass: 'text-slate-500 bg-slate-100',
    description: "You haven't submitted a vendor marketplace application yet. Apply now to get started.",
  }
  const StatusIcon = currentStatus.Icon

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full p-3 shadow-inner bg-amber-50 dark:bg-amber-950/30">
          <Lock className="h-8 w-8 text-amber-500" />
        </div>
        
        <h2 className="mt-6 text-2xl font-black text-slate-900 dark:text-white">
          Vendor Approval Required
        </h2>
        
        <p className="mt-4 text-sm font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
          To manage product listings in the Gloaro Network marketplace, your vendor account must first be approved through the Vice President pre-screening and marketplace approval workflow.
        </p>

        {app && (
          <div className="mt-6 inline-flex flex-col items-center justify-center gap-2 rounded-xl bg-slate-50 border border-slate-100 p-4 w-full dark:bg-slate-950 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Application Status:
              </span>
              <StatusBadge value={app.status} />
            </div>
            <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ${currentStatus.iconColorClass}`}>
              <StatusIcon className="h-3.5 w-3.5" />
              {currentStatus.label}
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 text-center max-w-sm mt-1">
              {currentStatus.description}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          {app ? (
            <button
              onClick={() => navigate('/member/vendor-application-status')}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-[#0d4697] px-6 py-2.5 text-sm font-extrabold text-white hover:bg-blue-800 transition duration-150 ease-in-out shadow-md"
            >
              Track Application Status
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => navigate('/member/vendor-application')}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-[#0d4697] px-6 py-2.5 text-sm font-extrabold text-white hover:bg-blue-800 transition duration-150 ease-in-out shadow-md"
            >
              Apply as Vendor
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </section>
    </div>
  )
}
