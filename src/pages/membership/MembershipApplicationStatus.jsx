import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  User,
  MapPin,
  Briefcase,
  Users
} from 'lucide-react'
import api from '../../api/axios'
import LoadingScreen from '../../components/common/LoadingScreen'
import StatusBadge from '../../components/common/StatusBadge'
import { formatDate } from '../../utils/format'
import toast from 'react-hot-toast'
import { membershipApplicationApi } from '../../api/membershipApplication'
import { getMemberOnboardingRoutes } from '../../utils/onboarding'

export default function MembershipApplicationStatus() {
  const navigate = useNavigate()
  const [app, setApp] = useState(null)
  const [loading, setLoading] = useState(true)
  const memberRoutes = getMemberOnboardingRoutes(true)

  useEffect(() => {
    setLoading(true)
    membershipApplicationApi.getMyApplication()
      .then((res) => {
        const appData = Array.isArray(res.data?.data) ? res.data.data[0] : res.data?.data
        setApp(appData || null)
      })
      .catch(() => {
        setApp(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!loading && (!app || app.status === 'draft')) {
      navigate(memberRoutes.agreement, { replace: true })
    }
  }, [app, loading, memberRoutes.agreement, navigate])

  const openDocument = async (field) => {
    if (!app?._id) return
    try {
      const response = await api.get(`/membership-applications/${app._id}/documents/${field}/url`)
      const url = response.data?.data?.url
      if (url) window.open(url, '_blank', 'noopener,noreferrer')
    } catch {
      toast.error('Unable to open document')
    }
  }

  if (loading) {
    return <LoadingScreen label="Loading membership application status..." />
  }

  if (!app) {
    return (
      <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <HelpCircle className="mx-auto h-12 w-12 text-slate-400" />
        <h2 className="mt-4 text-xl font-extrabold text-slate-900">No Membership Application Found</h2>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          You haven't started your Gloaro Network membership application yet. Start onboarding now to join the community.
        </p>
        <button
          onClick={() => navigate('/membership-application')}
          className="mt-6 inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#0d4697] px-5 py-2 text-sm font-extrabold text-white hover:bg-blue-800"
        >
          Apply for Membership
        </button>
      </section>
    )
  }

  const status = String(app.status).toLowerCase()
  const sourceLabel = app.source || app.sourceLabel || app.applicationSource || app.applicationSourceLabel || 'Online Member'

  const documentFields = [
    ['profilePhoto', 'Profile Photo', app.documents?.profilePhoto],
    ['registrationCertificate', 'Registration Certificate', app.documents?.registrationCertificate],
    ['gstCertificate', 'GST Certificate', app.documents?.gstCertificate],
    ['companyProfile', 'Company Profile', app.documents?.companyProfile],
    ['visitingCard', 'Visiting Card', app.documents?.visitingCard],
  ].filter(([, , file]) => file?.url)

  // Status step for progress timeline
  const statusMeta = {
    submitted: 2,
    pending_vp_review: 1,
    forwarded: 2,
    approved: 3,
    rejected: 3,
  }
  const activeStep = statusMeta[app.status] ?? 0

  const steps = [
    { title: 'Submitted', active: activeStep >= 0 },
    { title: 'Pending VP Review', active: activeStep >= 1 },
    { title: 'Forwarded', active: activeStep >= 2 },
    { title: 'Final Decision', active: activeStep >= 3 },
  ]

  return (
    <section className="space-y-6 mx-auto max-w-6xl">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 bg-white p-5 rounded-xl shadow-sm sm:flex-row sm:items-center">
        <div>
          <button
            onClick={() => navigate('/member/dashboard')}
            className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-500 hover:text-[#0d4697] mb-2"
          >
            <ChevronLeft className="h-3 w-3" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-950">Membership Application Status</h1>
            <StatusBadge value={app.status} />
          </div>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            Source: <span className="text-slate-800">{sourceLabel}</span>
          </p>
          <p className="text-xs font-bold text-slate-400 mt-1">
            Application #: {app.applicationNumber || 'Draft'} - Submitted: {formatDate(app.createdAt)}
          </p>
        </div>

        {(status === 'rejected' || status === 'changes_requested') && (
          <button
            onClick={() => navigate('/membership-application')}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#0d4697] px-4 py-2 text-xs font-extrabold text-white hover:bg-blue-800 shrink-0"
          >
            Update & Resubmit
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Submitted and Pending Approval Banner */}
      {['pending_vp_review', 'submitted', 'forwarded'].includes(status) && (
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-extrabold text-slate-800">
              Application Awaiting Approval
            </p>
            <p className="text-xs font-semibold text-slate-600 mt-1">
              Your application has been submitted successfully and is awaiting approval.
            </p>
          </div>
        </div>
      )}

      {/* Reviewer Comment Banner */}
      {app.adminNotes && (
        <div className={`p-4 rounded-xl border flex gap-3 ${(status === 'rejected' || status === 'changes_requested') ? 'bg-red-50/50 border-red-200' : 'bg-blue-50/50 border-blue-200'}`}>
          {(status === 'rejected' || status === 'changes_requested') ? <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" /> : <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />}
          <div>
            <p className="text-sm font-extrabold text-slate-800">
              Reviewer Notes
            </p>
            <p className="text-xs font-semibold text-slate-600 mt-1">{app.adminNotes}</p>
          </div>
        </div>
      )}

      {/* Progress Timeline */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-900 mb-6">Workflow Progress</h3>
        <div className="relative grid grid-cols-4 gap-2">
          <div className="absolute left-8 right-8 top-4 h-0.5 bg-slate-200" />
          <div className="absolute left-8 top-4 h-0.5 bg-[#0d4697]" style={{ width: `${Math.min(activeStep, 3) * 30}%` }} />
          {steps.map((step, index) => (
            <div key={step.title} className="relative z-10 text-center">
              <div className={`mx-auto grid h-8 w-8 place-items-center rounded-md text-xs font-black ${step.active ? 'bg-[#0d4697] text-white' : 'bg-slate-100 text-slate-400 ring-1 ring-slate-200'}`}>
                {step.active ? '✓' : index + 1}
              </div>
              <p className={`mt-3 text-xs font-extrabold ${step.active ? 'text-slate-950' : 'text-slate-400'}`}>{step.title}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Left Side: Summary info */}
        <div className="space-y-6">
          {/* Personal Details */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-3 flex items-center gap-1.5"><User className="h-4 w-4 text-[#0d4697]" />Personal Information</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCard label="Full Name" value={app.personal?.fullName} />
              <InfoCard label="Email Address" value={app.personal?.emailAddress} />
              <InfoCard label="Mobile Number" value={app.personal?.mobileNumber} />
              <InfoCard label="Gender" value={app.personal?.gender} />
              <InfoCard label="Date of Birth" value={app.personal?.dateOfBirth} />
            </div>
          </section>

          {/* Address Details */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-3 flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#0d4697]" />Address Details</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCard label="Address Line 1" value={app.address?.line1} />
              <InfoCard label="Address Line 2" value={app.address?.line2} />
              <InfoCard label="City" value={app.address?.city} />
              <InfoCard label="State" value={app.address?.state} />
              <InfoCard label="Pincode" value={app.address?.pincode} />
            </div>
          </section>

          {/* Professional Details */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-3 flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-[#0d4697]" />Professional Information</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCard label="Company Name" value={app.professional?.companyName} />
              <InfoCard label="Designation" value={app.professional?.designation} />
              <InfoCard label="Industry" value={app.professional?.industry} />
              <InfoCard label="Business Type" value={app.professional?.businessType} />
              <InfoCard label="Years of Experience" value={app.professional?.yearsOfExperience} />
              <InfoCard label="Company Website" value={app.professional?.companyWebsite} />
              <InfoCard label="LinkedIn Profile" value={app.professional?.linkedInProfile} />
              <InfoCard label="Business Email" value={app.professional?.businessEmail} />
            </div>
            
            <div className="mt-3 grid gap-3">
              <div className="rounded-md bg-slate-50 px-3 py-2">
                <p className="text-[10px] font-extrabold uppercase text-slate-400">Background Summary</p>
                <p className="text-xs font-bold text-slate-700 mt-1 leading-5">{app.professional?.backgroundSummary || 'Not added'}</p>
              </div>
              <div className="rounded-md bg-slate-50 px-3 py-2">
                <p className="text-[10px] font-extrabold uppercase text-slate-400">Reason for Joining</p>
                <p className="text-xs font-bold text-slate-700 mt-1 leading-5">{app.professional?.joinReason || 'Not added'}</p>
              </div>
            </div>
          </section>

          {/* References */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-3 flex items-center gap-1.5"><Users className="h-4 w-4 text-[#0d4697]" />References</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {app.references?.map((ref, idx) => (
                <div key={idx} className="rounded-xl border border-slate-100 p-4 bg-slate-50/50 space-y-2">
                  <p className="text-xs font-black text-slate-800">Reference #{idx + 1}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <p className="text-slate-400">Name:</p>
                    <p className="font-bold text-slate-700">{ref.fullName || '-'}</p>
                    <p className="text-slate-400">Company:</p>
                    <p className="font-bold text-slate-700">{ref.companyName || '-'}</p>
                    <p className="text-slate-400">Designation:</p>
                    <p className="font-bold text-slate-700">{ref.designation || '-'}</p>
                    <p className="text-slate-400">Phone:</p>
                    <p className="font-bold text-slate-700">{ref.phoneNumber || '-'}</p>
                    <p className="text-slate-400">Email:</p>
                    <p className="font-bold text-slate-700 truncate">{ref.emailAddress || '-'}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Side: Documents & Hierarchy */}
        <div className="space-y-6">
          {/* Documents Section */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-3">Submitted Documents</h3>
            {documentFields.length === 0 ? (
              <p className="text-xs font-semibold text-slate-400">No documents submitted.</p>
            ) : (
              <div className="space-y-2">
                {documentFields.map(([field, label, file]) => (
                  <div key={field} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 bg-slate-50/60 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-slate-700 truncate">{label}</p>
                        <p className="text-[10px] font-bold text-slate-400 truncate">{file.originalName || 'file'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => openDocument(field)}
                      className="inline-flex h-7 items-center gap-1 rounded bg-[#0d4697]/10 px-2.5 text-[10px] font-extrabold text-[#0d4697] hover:bg-[#0d4697]/15 shrink-0"
                    >
                      View
                      <ExternalLink className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Hierarchy Details */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">Assigned Unit Hierarchy</h3>
            <div className="space-y-3">
              <HierarchyItem label="Region" value={app.regionId?.name} />
              <HierarchyItem label="State" value={app.stateId?.name} />
              <HierarchyItem label="District" value={app.districtId?.name} />
              <HierarchyItem label="Unit" value={app.chapterId?.name} />
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50/80 p-3 border border-slate-100/50">
      <p className="text-[9px] font-extrabold uppercase text-slate-400">{label}</p>
      <p className="text-xs font-extrabold text-slate-700 mt-1">{value || '-'}</p>
    </div>
  )
}

function HierarchyItem({ label, value }) {
  return (
    <div className="flex items-center justify-between text-xs font-semibold">
      <span className="text-slate-400">{label}:</span>
      <span className="font-extrabold text-slate-800">{value || 'Not assigned'}</span>
    </div>
  )
}
