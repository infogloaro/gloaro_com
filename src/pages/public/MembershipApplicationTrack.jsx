import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Download, Edit3, Headphones, Search } from 'lucide-react'
import { membershipApplicationApi } from '../../api/membershipApplication'
import { formatDate } from '../../utils/format'

const statusMeta = {
  submitted: { label: 'Under Review', badge: 'Active Review', step: 2 },
  under_review: { label: 'Under Review', badge: 'Active Review', step: 2 },
  approved: { label: 'Final Approval', badge: 'Approved', step: 3 },
  rejected: { label: 'Requires Info', badge: 'Rejected', step: 2 },
}

export default function MembershipApplicationTrack() {
  const location = useLocation()
  const initialApplication = location.state?.application || null
  const [application, setApplication] = useState(initialApplication)
  const [applicationId, setApplicationId] = useState(initialApplication?.applicationNumber || '')
  const [mobileNumber, setMobileNumber] = useState(initialApplication?.personal?.mobileNumber || '')
  const [tracking, setTracking] = useState(false)

  const meta = statusMeta[application?.status] || statusMeta.submitted
  const documentCount = useMemo(() => Object.values(application?.documents || {}).filter(Boolean).length, [application])

  const trackApplication = async () => {
    if (!applicationId || !mobileNumber) {
      toast.error('Enter application ID and mobile number')
      return
    }

    setTracking(true)
    try {
      const response = await membershipApplicationApi.track({ applicationId, mobileNumber })
      setApplication(response.data?.data)
      toast.success('Application status updated')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Application not found')
    } finally {
      setTracking(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#fff9e8] px-4 py-8 text-slate-950">
      <section className="mx-auto max-w-5xl">
        <div className="text-center">
          <h1 className="font-playfair text-4xl font-black text-[#0b469e]">Track Your Application</h1>
          <p className="mt-2 text-sm font-medium text-slate-600">Monitor the progress of your membership, vendor, franchise, or B2B application with real-time updates.</p>
        </div>

        <section className="mt-8 rounded-sm border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <Field label="Application ID" value={applicationId} onChange={setApplicationId} placeholder="GLO-2024-8832" />
            <Field label="Mobile Number" value={mobileNumber} onChange={setMobileNumber} placeholder="+1 (555) 000-0000" />
            <button onClick={trackApplication} disabled={tracking} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#ffab16] px-8 text-xs font-extrabold text-white shadow-sm disabled:opacity-60">
              <Search className="h-3.5 w-3.5" />
              {tracking ? 'Tracking...' : 'Track Application'}
            </button>
          </div>
        </section>

        <section className="mt-8 rounded-sm border border-slate-200 bg-white p-8 shadow-sm">
          <Progress application={application} activeStep={meta.step} documentCount={documentCount} />
          <div className="mt-8 rounded-sm border border-slate-200 p-5">
            <p className="mb-4 text-[11px] font-extrabold uppercase tracking-wide text-[#0b469e]">Status Legend</p>
            <div className="grid gap-4 text-xs font-medium text-slate-700 sm:grid-cols-2 lg:grid-cols-4">
              <Legend color="bg-[#0b469e]" label="Submitted / Verified" />
              <Legend color="bg-[#ffab16]" label="Under Review" />
              <Legend color="bg-[#f97316]" label="Requires Info" />
              <Legend color="bg-emerald-500" label="Approved" />
              <Legend color="bg-red-600" label="Rejected" />
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-sm border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h2 className="font-playfair text-lg font-black text-slate-950">Application Summary</h2>
            <span className="rounded-sm bg-[#0b469e] px-3 py-1 text-[10px] font-extrabold uppercase text-white">{meta.badge}</span>
          </div>
          <div className="grid gap-8 px-6 py-6 md:grid-cols-2">
            <SummaryItem label="Applicant Name" value={application?.personal?.fullName} />
            <SummaryItem label="Application Type" value="Enterprise B2B Membership" />
            <SummaryItem label="Submission Date" value={formatDate(application?.createdAt)} />
            <SummaryItem label="Reference Number" value={application?.applicationNumber} highlight />
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Assigned Reviewer</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-[#0b469e] text-xs font-black text-white">G</div>
                <div>
                  <p className="text-sm font-extrabold text-slate-950">Gloaro Admissions</p>
                  <p className="text-xs font-medium text-slate-500">Membership Review Team</p>
                </div>
              </div>
            </div>
            <SummaryItem label="Current Status" value={meta.label} />
          </div>
        </section>

        <div className="mt-6 space-y-3">
          <button type="button" onClick={() => toast.success('Application PDF will be available after review')} className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#ffab16] text-sm font-extrabold text-white">
            <Download className="h-4 w-4" />
            Download Application PDF
          </button>
          <Link to="/membership-application" className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#0b469e] text-sm font-extrabold text-white">
            <Edit3 className="h-4 w-4" />
            Edit Application
          </Link>
          <Link to="/customer/support" className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-sm font-extrabold text-slate-700">
            <Headphones className="h-4 w-4" />
            Contact Support
          </Link>
        </div>
      </section>
    </main>
  )
}

function Progress({ application, activeStep, documentCount }) {
  const submittedDate = formatDate(application?.createdAt)
  const steps = [
    { title: 'Submitted', note: submittedDate, active: activeStep >= 0 },
    { title: 'Documents Verified', note: documentCount ? `${documentCount} document(s)` : 'Pending', active: documentCount > 0 },
    { title: 'Under Review', note: application?.status === 'rejected' ? 'Requires info' : 'In Progress', active: activeStep >= 2 },
    { title: 'Final Approval', note: application?.status === 'approved' ? 'Approved' : 'Pending', active: activeStep >= 3 },
  ]

  return (
    <div className="relative grid grid-cols-4 gap-2">
      <div className="absolute left-8 right-8 top-4 h-0.5 bg-slate-200" />
      <div className="absolute left-8 top-4 h-0.5 bg-[#0b469e]" style={{ width: `${Math.min(activeStep, 3) * 30}%` }} />
      {steps.map((step, index) => (
        <div key={step.title} className="relative z-10 text-center">
          <div className={`mx-auto grid h-8 w-8 place-items-center rounded-md text-xs font-black ${step.active ? 'bg-[#0b469e] text-white' : 'bg-slate-100 text-slate-400 ring-1 ring-slate-200'}`}>
            {step.active ? '✓' : index + 1}
          </div>
          <p className={`mt-3 text-xs font-extrabold ${step.active ? 'text-slate-950' : 'text-slate-400'}`}>{step.title}</p>
          <p className={`mt-1 text-[11px] font-medium ${index === 2 && step.active ? 'text-[#ffab16]' : 'text-slate-500'}`}>{step.note}</p>
        </div>
      ))}
    </div>
  )
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-[11px] font-extrabold uppercase tracking-wide text-slate-700">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 h-10 w-full rounded-sm border border-slate-200 px-4 text-xs font-semibold outline-none focus:border-[#0b469e]" />
    </label>
  )
}

function Legend({ color, label }) {
  return <span className="inline-flex items-center gap-3"><span className={`h-2.5 w-2.5 rounded-full ${color}`} />{label}</span>
}

function SummaryItem({ label, value, highlight }) {
  return (
    <div>
      <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-2 text-sm font-extrabold ${highlight ? 'text-[#0b469e]' : 'text-slate-950'}`}>{value || 'Not available'}</p>
    </div>
  )
}
