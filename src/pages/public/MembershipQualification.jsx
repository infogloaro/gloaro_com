import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { BriefcaseBusiness, FileUp, ShieldCheck, UsersRound } from 'lucide-react'
import { membershipApplicationApi } from '../../api/membershipApplication'
import { clearMembershipDraft, getMembershipDraft, getMembershipFiles, saveMembershipDraft, setMembershipFile } from '../../utils/membershipOnboarding'

const expectations = [
  ['Professional Conduct', 'Gloaro Network members are expected to maintain the highest levels of professional decorum during all interactions. This includes punctuality for network meetings, respectful communication across all digital channels, and upholding the brand’s prestige in public forums.'],
  ['Networking Commitment', 'Gloaro is a give-first network. Members are expected to dedicate time for one-on-one discovery sessions with fellow members to truly understand their business models and support requirements, fostering deep-rooted professional trust.'],
  ['Business Integrity', 'Honesty and transparency form the bedrock of our ecosystem. Members commit to ethical business practices, honoring all professional agreements made within the network, and disclosing any conflicts of interest that may arise during joint ventures or referrals.'],
  ['Referral Responsibility', 'When referring a fellow member, you are lending your personal credibility. Members must ensure all referrals are vetted and relevant. Conversely, receiving a referral entails a commitment to provide premium, high-priority service to the referred party.'],
  ['Meeting Participation', 'Membership requires active presence. Consistent attendance at weekly executive briefings and quarterly summits is mandatory. Engagement is measured not just by presence, but by the quality of contributions to strategic discussions and workshop sessions.'],
  ['Community Contribution', 'Beyond individual gain, members contribute to the collective intelligence of the network. This involves sharing industry insights, mentoring junior executive members, and participating in the Professional Standards Division’s peer-review processes.'],
]
const companyTypes = ['Private Limited', 'Public Limited', 'LLP', 'Partnership', 'Sole Proprietorship', 'One Person Company', 'Trust', 'Society', 'Section 8 Company', 'Franchise', 'Other']

export default function MembershipQualification() {
  const navigate = useNavigate()
  const draft = getMembershipDraft()
  const [credentials, setCredentials] = useState(draft.credentials || {})
  const [references, setReferences] = useState(draft.references || [{}, {}])
  const [selectedFiles, setSelectedFiles] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const updateCredentials = (field, value) => {
    setCredentials((current) => {
      const next = { ...current, [field]: value }
      saveMembershipDraft('credentials', next)
      return next
    })
  }

  const updateReference = (index, field, value) => {
    setReferences((current) => {
      const next = [...current]
      next[index] = { ...(next[index] || {}), [field]: value }
      const draftData = getMembershipDraft()
      localStorage.setItem('gloaro_membership_onboarding', JSON.stringify({ ...draftData, references: next }))
      return next
    })
  }

  const submitApplication = async () => {
    setSubmitting(true)
    try {
      const payload = { ...getMembershipDraft(), credentials, references, step: 3 }
      const formData = new FormData()
      formData.append('data', JSON.stringify(payload))
      Object.entries(getMembershipFiles()).forEach(([field, file]) => {
        if (file) formData.append(field, file)
      })
      const response = await membershipApplicationApi.submit(formData)
      const application = response.data?.data
      clearMembershipDraft()
      toast.success('Membership application submitted')
      navigate('/membership-application/track', { state: { application } })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#fff9e8] px-4 py-8 font-playfair text-slate-950">
      <section className="mx-auto max-w-4xl">
        <div className="text-center">
          <h1 className="text-4xl font-black leading-tight text-[#0b469e]">Professional Credentials &<br /><span className="text-[#ff9f00]">Membership</span> Qualification</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-5 text-slate-600">Help us understand your professional background, business credibility, and commitment to the Gloaro Network community.</p>
        </div>

        <form className="mt-6 space-y-5" onSubmit={(event) => event.preventDefault()}>
          <section className="rounded-md border border-slate-200 bg-white px-5 py-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-950"><BriefcaseBusiness className="h-4 w-4 text-[#0b469e]" />Business Credentials</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Business Registration Number" value={credentials.businessRegistrationNumber || ''} onChange={(value) => updateCredentials('businessRegistrationNumber', value)} />
              <Field label="GST Number (Optional)" value={credentials.gstNumber || ''} onChange={(value) => updateCredentials('gstNumber', value)} />
              <Field label="PAN Number" value={credentials.panNumber || ''} onChange={(value) => updateCredentials('panNumber', value)} />
              <SelectField label="Company Type" value={credentials.companyType || ''} onChange={(value) => updateCredentials('companyType', value)} placeholder="Select Company Type" options={companyTypes} />
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              {[
                ['registrationCertificate', 'Registration Certificate'],
                ['gstCertificate', 'GST Certificate'],
                ['companyProfile', 'Company Profile'],
                ['visitingCard', 'Visiting Card'],
              ].map(([field, label]) => <UploadBox key={field} label={label} selectedName={selectedFiles[field]} onSelect={(file) => {
                setMembershipFile(field, file)
                setSelectedFiles((current) => ({ ...current, [field]: file?.name || '' }))
              }} />)}
            </div>
          </section>

          <section className="rounded-md border border-slate-200 bg-white px-5 py-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-950"><UsersRound className="h-4 w-4 text-[#0b469e]" />Business References</h2>
            <div className="mb-4 rounded-md bg-[#f1f2ff] px-3 py-2 text-xs font-semibold text-slate-600">
              References may be contacted during membership verification to validate professional integrity and business standing.
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <ReferenceFields title="Reference Contact 1" value={references[0] || {}} onChange={(field, value) => updateReference(0, field, value)} />
              <ReferenceFields title="Reference Contact 2" value={references[1] || {}} onChange={(field, value) => updateReference(1, field, value)} />
            </div>
          </section>

          <section className="rounded-md border border-slate-200 bg-white px-5 py-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-950"><ShieldCheck className="h-4 w-4 text-[#0b469e]" />Professional Standards & Expectations</h2>
            <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
              {expectations.map(([title, description]) => (
                <article key={title}>
                  <h3 className="text-sm font-black text-slate-950">{title}</h3>
                  <p className="mt-1 text-xs font-medium leading-5 text-slate-600">{description}</p>
                </article>
              ))}
            </div>
          </section>
        </form>

        <div className="mt-7 flex justify-center gap-3">
          <button type="button" onClick={() => toast.success('Application saved')} className="rounded-md bg-[#ffbf1a] px-6 py-3 text-xs font-extrabold text-[#0b1f3d]">Save & Complete Later</button>
          <Link to="/membership-application" className="rounded-md border border-slate-300 bg-white px-6 py-3 text-xs font-extrabold text-slate-700">Step Back</Link>
          <button type="button" onClick={submitApplication} disabled={submitting} className="rounded-md bg-[#0b469e] px-7 py-3 text-xs font-extrabold text-white disabled:opacity-60">{submitting ? 'Submitting...' : 'Submit Membership Application'}</button>
        </div>
      </section>
    </main>
  )
}

function Field({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-xs font-black text-slate-700">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 h-9 w-full rounded-md border border-slate-300 px-3 text-xs font-medium outline-none focus:border-[#0b469e]" />
    </label>
  )
}

function SelectField({ label, placeholder, value, onChange, options = [placeholder] }) {
  return (
    <label className="block">
      <span className="text-xs font-black text-slate-700">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-xs font-medium text-slate-500 outline-none focus:border-[#0b469e]">
        <option value="">{placeholder}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  )
}

function UploadBox({ label, selectedName, onSelect }) {
  return (
    <label className={`grid min-h-20 cursor-pointer place-items-center rounded-md border border-dashed bg-white px-3 text-center text-xs font-black ${selectedName ? 'border-[#0b469e] text-[#0b469e]' : 'border-slate-300 text-slate-700'}`}>
      <span>
        <FileUp className="mx-auto mb-1 h-4 w-4 text-slate-400" />
        {label}
        {selectedName && <span className="mt-1 block max-w-[140px] truncate text-[10px] font-semibold text-slate-500">{selectedName}</span>}
        <input type="file" accept="image/*,.pdf" className="hidden" onChange={(event) => onSelect(event.target.files?.[0])} />
      </span>
    </label>
  )
}

function ReferenceFields({ title, value, onChange }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-black uppercase tracking-[0.08em] text-[#0b469e]">{title}</h3>
      <div className="space-y-3">
        {[
          ['fullName', 'Full Name'],
          ['companyName', 'Company Name'],
          ['designation', 'Designation'],
          ['phoneNumber', 'Phone Number'],
          ['emailAddress', 'Email Address'],
        ].map(([field, placeholder]) => (
          <input key={field} value={value[field] || ''} onChange={(event) => onChange(field, event.target.value)} placeholder={placeholder} className="h-9 w-full rounded-md border border-slate-300 px-3 text-xs font-medium outline-none focus:border-[#0b469e]" />
        ))}
      </div>
    </div>
  )
}
