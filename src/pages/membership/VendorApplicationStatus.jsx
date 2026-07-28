import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ChevronLeft,
  ArrowRight
} from 'lucide-react'
import api from '../../api/axios'
import LoadingScreen from '../../components/common/LoadingScreen'
import StatusBadge from '../../components/common/StatusBadge'
import { formatDate } from '../../utils/format'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'
import { getEffectiveRegistrationType, getVendorOnboardingRoutes } from '../../utils/onboarding'
import { getDashboardRoute } from '../../utils/permissions'
import { storage } from '../../utils/storage'

export default function VendorApplicationStatus() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [app, setApp] = useState(null)
  const [loading, setLoading] = useState(true)
  const onboardingType = getEffectiveRegistrationType(user, storage.getOnboardingContext()?.registrationType)
  const isVendorOnlineFlow = onboardingType === 'vendor'
  const isVendorRoute = location.pathname.startsWith('/vendor/')
  const vendorRoutes = getVendorOnboardingRoutes(isVendorRoute || isVendorOnlineFlow)
  const applicationPath = vendorRoutes.application
  const statusPath = vendorRoutes.status

  useEffect(() => {
    if (isVendorOnlineFlow && !isVendorRoute) {
      navigate(statusPath, { replace: true })
      return
    }

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
  }, [isVendorOnlineFlow, isVendorRoute, navigate, statusPath])

  const openDocument = async (field) => {
    if (!app?._id) return
    try {
      const response = await api.get(`/vendor-applications/${app._id}/documents/${field}/url`)
      const url = response.data?.data?.url
      if (url) window.open(url, '_blank', 'noopener,noreferrer')
    } catch {
      toast.error('Unable to open document')
    }
  }

  if (loading) {
    return <LoadingScreen label="Loading application tracking..." />
  }

  if (!app) {
    return (
      <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <HelpCircle className="mx-auto h-12 w-12 text-slate-400" />
        <h2 className="mt-4 text-xl font-extrabold text-slate-900">No Vendor Application Found</h2>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          You haven't started your vendor marketplace application yet. Start onboarding now to list your business.
        </p>
        <button
          onClick={() => navigate(applicationPath)}
          className="mt-6 inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#0d4697] px-5 py-2 text-sm font-extrabold text-white hover:bg-blue-800"
        >
          Apply as Vendor
        </button>
      </section>
    )
  }

  const status = String(app.status).toLowerCase()
  const statusLabels = {
    draft: 'Draft',
    pending_vp_review: 'Pending VP Review',
    submitted: 'Waiting for Marketplace Approval',
    forwarded: 'Waiting for Marketplace Approval',
    under_review: 'Under Review',
    approved: 'Approved',
    rejected: 'Rejected',
    rejected_by_vp: 'Rejected by Vice President',
  }
  const currentStatusLabel = statusLabels[status] || app.status
  const decisionOfficer = app.vpReviewedBy || app.reviewedBy || app.forwardedBy || null
  const decisionOfficerRole = app.vpReviewedBy?.role || app.reviewedByRole || decisionOfficer?.role || 'System'
  const decisionDate = app.vpReviewedAt || app.reviewedAt || app.forwardedAt || app.createdAt
  const decisionRemarks = app.vpRemarks || app.adminNotes || ''
  const submittedDate = app.submittedAt || app.createdAt
  const submittedFrom = app.submittedFrom?.replaceAll('_', ' ') || 'Unknown'

  const documents = [
    ['profilePhoto', 'Profile Photo', app.step2?.personal?.profilePhoto],
    ['registrationCertificate', 'Registration Certificate', app.step3?.documents?.registrationCertificate],
    ['gstCertificate', 'GST Certificate', app.step3?.documents?.gstCertificate],
    ['businessLogo', 'Business Logo', app.step3?.documents?.businessLogo],
    ['ownerIdProof', 'Owner ID Proof', app.step3?.documents?.ownerIdProof],
    ['shopPhoto', 'Shop Photo', app.step3?.documents?.shopPhoto],
  ].filter(([, , file]) => file?.url)

  return (
    <section className="space-y-6 mx-auto max-w-6xl">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 bg-white p-5 rounded-xl shadow-sm sm:flex-row sm:items-center">
        <div>
          <button
            onClick={() => navigate(getDashboardRoute(user?.role, user))}
            className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-500 hover:text-[#0d4697] mb-2"
          >
            <ChevronLeft className="h-3 w-3" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-950">Application Status</h1>
            <StatusBadge value={app.status} />
          </div>
          <p className="text-xs font-bold text-slate-400 mt-1">
            Application #: {app.applicationNumber || 'Draft'} • Last updated: {formatDate(app.updatedAt)}
          </p>
        </div>
        
        {status === 'draft' && (
          <button
            onClick={() => navigate(applicationPath)}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-amber-700 shrink-0"
          >
            Resume Draft
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Reviewer Comment Banner */}
      {decisionRemarks && (
        <div className={`p-4 rounded-xl border flex gap-3 ${['rejected', 'rejected_by_vp'].includes(status) ? 'bg-red-50/50 border-red-200' : 'bg-blue-50/50 border-blue-200'}`}>
          {['rejected', 'rejected_by_vp'].includes(status) ? <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" /> : <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />}
          <div>
            <p className="text-sm font-extrabold text-slate-800">
              Reviewer Notes ({decisionOfficer?.name || 'Officer'} - {decisionOfficerRole?.replace('_', ' ') || 'Assigned Officer'})
            </p>
            <p className="text-xs font-semibold text-slate-600 mt-1">{decisionRemarks}</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Left Side: Summary info */}
        <div className="space-y-6">
          {/* Step 2 Details */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-3">Business Information</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCard label="Business Name" value={app.step2?.details?.businessName} />
              <InfoCard label="Category" value={app.step2?.details?.businessCategory?.name} />
              <InfoCard label="Business Type" value={app.step2?.details?.businessType} />
              <InfoCard label="Years of Experience" value={app.step2?.details?.yearsOfExperience} />
              <InfoCard label="Website" value={app.step2?.digitalPresence?.website} />
              <InfoCard label="Business Email" value={app.step2?.digitalPresence?.businessEmail} />
            </div>
            
            <div className="mt-3 grid gap-3">
              <div className="rounded-md bg-slate-50 px-3 py-2">
                <p className="text-[10px] font-extrabold uppercase text-slate-400">Professional Background</p>
                <p className="text-xs font-bold text-slate-700 mt-1 leading-5">{app.step2?.details?.professionalBackground || 'Not added'}</p>
              </div>
            </div>
          </section>

          {/* Credentials Step 3 */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-3">Registration & Tax Credentials</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <InfoCard label="Registration Number" value={app.step3?.credentials?.businessRegistrationNumber} />
              <InfoCard label="GST Number" value={app.step3?.credentials?.gstNumber || 'Not added'} />
              <InfoCard label="PAN Number" value={app.step3?.credentials?.panNumber} />
            </div>
          </section>

          {/* Uploaded Documents */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-3">Uploaded Verification Files</h3>
            {documents.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {documents.map(([key, label, file]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => openDocument(key)}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-left text-xs font-bold text-slate-700 hover:border-[#0d4697]/40 hover:bg-blue-50/50"
                  >
                    <span className="truncate flex-1">
                      <span className="block truncate font-extrabold text-slate-800">{label}</span>
                      <span className="block truncate text-[10px] font-semibold text-slate-400 mt-0.5">{file.originalName || 'View attachment'}</span>
                    </span>
                    <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs font-semibold text-slate-400">No documents uploaded yet.</p>
            )}
          </section>

          {/* References */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-3">Business References</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {(app.step3?.references || []).map((ref, idx) => (
                <div key={idx} className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs">
                  <p className="font-extrabold text-[#0d4697] uppercase tracking-wider mb-2">Reference Contact {idx + 1}</p>
                  <div className="space-y-1.5 font-bold text-slate-700">
                    <p><span className="text-slate-400 font-semibold">Name:</span> {ref.fullName}</p>
                    <p><span className="text-slate-400 font-semibold">Company:</span> {ref.companyName}</p>
                    <p><span className="text-slate-400 font-semibold">Relationship:</span> {ref.relationship}</p>
                    <p><span className="text-slate-400 font-semibold">Phone:</span> {ref.phoneNumber}</p>
                  </div>
                </div>
              ))}
              {!app.step3?.references?.length && <p className="text-xs font-semibold text-slate-400">No references added.</p>}
            </div>
          </section>
        </div>

        {/* Right Side: Timeline & reviewers */}
        <div className="space-y-6">
          {/* Approval details */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-3">Review & Verification Audit</h3>
            <div className="space-y-3.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">Review Status</span>
                <span className="capitalize text-slate-800">{currentStatusLabel}</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">Submitted Date</span>
                <span className="text-slate-800">{status === 'draft' ? 'Not submitted yet' : formatDate(submittedDate)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">Submitted From</span>
                <span className="capitalize text-slate-800">{submittedFrom}</span>
              </div>
              {decisionOfficer && (
                <>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">Decision Officer</span>
                    <span className="text-slate-800">{decisionOfficer?.name || 'Officer'}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">Officer Role</span>
                    <span className="text-slate-800">{decisionOfficerRole?.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">Action Date</span>
                    <span className="text-slate-800">{formatDate(decisionDate)}</span>
                  </div>
                  {decisionRemarks && (
                    <div className="rounded-md bg-slate-50 px-3 py-2">
                      <p className="text-[10px] font-extrabold uppercase text-slate-400">Remarks</p>
                      <p className="mt-1 text-xs font-semibold text-slate-700">{decisionRemarks}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* Workflow history timeline */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4">Approval Timeline</h3>
            <div className="space-y-4 relative pl-4 border-l border-slate-100">
              {(app.workflowHistory || []).map((step, idx) => (
                <div key={idx} className="relative pb-4 last:pb-0">
                  <span className="absolute -left-5.5 top-0.5 h-3 w-3 rounded-full bg-[#0d4697] ring-4 ring-white" />
                  <p className="text-xs font-extrabold text-slate-800 capitalize">{step.action}</p>
                  <p className="text-[10px] font-semibold text-slate-400 mt-1 capitalize">Role: {step.role?.replace('_', ' ')}</p>
                  {step.remarks && <p className="text-[10px] font-medium text-slate-500 mt-0.5">"{step.remarks}"</p>}
                  <p className="text-[9px] font-medium text-slate-400 mt-1">{formatDate(step.timestamp)}</p>
                </div>
              ))}
              {!app.workflowHistory?.length && (
                <p className="text-xs font-semibold text-slate-400">No status actions recorded yet.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-md bg-slate-50 px-3 py-2 text-xs">
      <p className="font-extrabold uppercase text-slate-400">{label}</p>
      <p className="font-extrabold text-slate-800 mt-1">{value || 'Not added'}</p>
    </div>
  )
}
