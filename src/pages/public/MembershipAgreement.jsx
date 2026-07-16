import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Briefcase, Check, CheckCircle2, ChevronDown, Clock3, FileText, RefreshCw, ShieldCheck } from 'lucide-react'
import { getMembershipDraft, saveMembershipDraft } from '../../utils/membershipOnboarding'
import { useAuth } from '../../hooks/useAuth'
import api from '../../api/axios'

const principles = [
  ['Professional Integrity', 'Members shall conduct all business affairs with the highest level of professional integrity. This includes honesty in representation of credentials, transparency in venture insights, and upholding the reputation of the Gloaro ecosystem in all public and private interactions.'],
  ['Honesty in Business', 'Members commit to truthful communication regarding business performance, market data, and investment opportunities. Deliberate misrepresentation or omission of material facts is grounds for immediate membership revocation.'],
  ['Confidentiality & Discretion', 'The network thrives on the secure exchange of proprietary information. Members must protect the intellectual property and private data of all other members as they would their own.'],
]

const terms = [
  ['1. Obligations of the Member', 'The Member agrees to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. The Member is responsible for maintaining the confidentiality of their account credentials.'],
  ['2. Fees and Payments', 'Annual membership fees are non-refundable after the first 30 days of the membership term. All fees are processed via secure encrypted gateways. Failure to pay within 15 days of the renewal date will result in temporary suspension of network access.'],
  ['3. Privacy and Data Usage', 'Gloaro Network complies with GDPR and CCPA regulations. Member data is used solely for the purpose of network matchmaking, security verification, and platform improvement. We do not sell member contact information to third-party marketing firms.'],
  ['4. Limitation of Liability', 'Gloaro Network shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues arising from participation in the network.'],
]

const detailedTerms = [
  ['1. Introduction & Acceptance', ['By becoming a member of Gloaro, you agree to comply with the terms, conditions, policies, and professional standards described in this agreement.', 'Continued use of membership benefits, events, referrals, services, and network resources confirms ongoing acceptance of these terms.']],
  ['2. Membership Eligibility', ['Membership is open to individuals, entrepreneurs, professionals, and business representatives who meet Gloaro membership criteria.', 'Applicants must provide accurate, complete, and verifiable registration details.', 'Gloaro reserves the right to approve, reject, or review membership applications based on network standards.']],
  ['3. Member Information Accuracy', ['Members are responsible for ensuring all submitted information is accurate and updated.', 'Business details, contact information, category, address, and profile documents must be maintained truthfully.', 'Gloaro may request additional verification at any stage.']],
  ['4. Membership Responsibilities', ['Members must maintain ethical business conduct and professional communication.', 'Members shall not misuse network contacts, referrals, leads, or event access.', 'Members are expected to respect other members, customers, and platform users.']],
  ['5. Code of Professional Conduct', ['Members must act honestly, transparently, and responsibly.', 'Members shall not engage in fraudulent, misleading, abusive, or harmful conduct.', 'Any violation may lead to suspension or termination of membership.']],
  ['6. Confidentiality & Privacy', ['Members may receive confidential business, referral, or customer information through the network.', 'Such information must not be shared, sold, copied, or used for unauthorized purposes.', 'Members must protect private data with reasonable care.']],
  ['7. Referral & Business Opportunity Guidelines', ['Referrals must be shared in good faith and with accurate context.', 'Members should not guarantee results unless such guarantees are contractually supported.', 'Gloaro does not guarantee revenue, conversion, or business outcomes from referrals.']],
  ['8. Networking & Relationship Building', ['Members are encouraged to participate respectfully in meetings, events, and community programs.', 'Collaboration must remain professional and mutually beneficial.', 'Disputes between members should be reported through appropriate support channels.']],
  ['9. Non-Discrimination Policy', ['Gloaro promotes an inclusive professional network.', 'Members must not discriminate against others based on race, religion, gender, nationality, disability, caste, age, or business background.', 'Violation may result in disciplinary action.']],
  ['10. Conflict Resolution', ['Members should attempt to resolve business disputes professionally.', 'Gloaro may facilitate communication where appropriate but is not responsible for private business agreements.', 'Legal disputes remain the responsibility of the involved parties.']],
  ['11. Use of Gloaro Brand & Resources', ['Members may use approved Gloaro badges, references, and materials responsibly.', 'Unauthorized use of logos, documents, marketing material, or platform content is prohibited.', 'Gloaro may revoke brand usage privileges at any time.']],
  ['12. Platform Usage', ['Members agree not to misuse Gloaro systems, dashboards, and communication tools.', 'Automated scraping, spam, unauthorized access, or harmful technical activity is prohibited.', 'Gloaro may monitor usage for security and service quality.']],
  ['13. Membership Fees & Payments', ['Membership fees must be paid according to selected plans and renewal terms.', 'Fees are non-refundable unless required by law or explicitly stated in writing.', 'Payment failure may result in suspension of membership benefits.']],
  ['14. Business Responsibility Disclaimer', ['Gloaro does not directly control or guarantee member products, services, prices, delivery, or customer outcomes.', 'Members remain responsible for their own business commitments, quality, compliance, and customer service.']],
  ['15. Conflict of Interest', ['Members must disclose conflicts of interest where relevant.', 'Members should not misuse privileged information for unfair advantage.', 'Gloaro may review conflict concerns at its discretion.']],
  ['16. Membership Suspension & Termination', ['Gloaro reserves the right to suspend or terminate membership for misconduct, policy violations, false information, non-payment, or behavior harmful to the network.', 'Membership benefits may stop immediately upon suspension or termination.']],
  ['17. Exit From Membership', ['Members may choose to exit membership by submitting a written request.', 'Pending dues, disputes, or obligations must be settled before final closure.', 'No refund is guaranteed unless stated in plan terms.']],
  ['18. Policy Changes', ['Gloaro may update this agreement, policies, or operational rules from time to time.', 'Members will be informed of material changes through reasonable channels.', 'Continued membership after updates constitutes acceptance.']],
  ['19. Limitation of Liability', ['Gloaro shall not be liable for indirect, incidental, special, punitive, or consequential losses from business dealings, events, referrals, platform usage, or member interactions.', 'Members participate in business opportunities at their own discretion and risk.']],
  ['20. Agreement Acceptance', ['By signing digitally, the member confirms that they have read, understood, and accepted this agreement.', 'The member agrees to follow all Gloaro values, policies, and professional standards.', 'This agreement is binding from the date of acceptance.']],
]

const steps = ['Personal Info', 'Business Info', 'Documents', 'References', 'Policies']

export default function MembershipAgreement() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showTermsDetails, setShowTermsDetails] = useState(false)

  // Redirect official roles who shouldn't apply, and redirect submitted applicants
  useEffect(() => {
    if (user && !['customer', 'user', 'vendor'].includes(user.role)) {
      const roleDashboardMap = {
        vice_president: '/vice-president/dashboard',
        secretary: '/secretary/dashboard',
        chapter_president: '/president/dashboard',
        admin: '/admin',
        superadmin: '/admin',
      }
      navigate(roleDashboardMap[user.role] || '/')
      return
    }

    const token = localStorage.getItem('gloaro_access_token') || sessionStorage.getItem('gloaro_access_token')
    if (token) {
      api.get('/membership-applications/my-application', { silent: true })
        .then(res => {
          const app = res.data?.data
          if (app && app.status !== 'draft') {
            navigate('/member/membership-application-status')
          }
        })
        .catch(() => {})
    }
  }, [user, navigate])

  const draft = getMembershipDraft()
  const initialAgreement = { ...(draft.agreement || {}) }
  if (initialAgreement.legalName === 'John D. Executive') initialAgreement.legalName = ''
  if (initialAgreement.digitalSignature === 'John D. Executive') initialAgreement.digitalSignature = ''
  if (initialAgreement.signatureDate === 'October 24, 2024') initialAgreement.signatureDate = ''
  if (initialAgreement.signatureLocation === 'London, UK') initialAgreement.signatureLocation = ''
  const [agreement, setAgreement] = useState({
    legalName: '',
    digitalSignature: '',
    signatureDate: '',
    signatureLocation: '',
    ...initialAgreement,
  })

  const [acceptedDeclarations, setAcceptedDeclarations] = useState(draft.agreement?.declarationsAccepted || [])

  const policiesComplete = acceptedDeclarations.length === 5 && 
    agreement.legalName?.trim() && 
    agreement.digitalSignature?.trim() && 
    agreement.signatureDate && 
    agreement.signatureLocation?.trim();

  const updateAgreement = (field, value) => {
    setAgreement((current) => {
      const next = { ...current, [field]: value }
      saveMembershipDraft('agreement', next)
      return next
    })
  }

  const saveAgreementStep = () => {
    saveMembershipDraft('agreement', {
      ...agreement,
      declarationsAccepted: acceptedDeclarations,
      acceptedTermsAt: new Date().toISOString(),
    })
  }

  const handleNextStep = (e) => {
    e?.preventDefault()
    try {
      saveAgreementStep()
    } catch (err) {
      console.error('Save agreement draft error:', err)
    }
    navigate('/membership-application')
  }

  if (showTermsDetails) return <TermsDetailPage onBack={() => setShowTermsDetails(false)} />

  return (
    <main className="min-h-screen bg-[#fff9e8] px-4 py-8 font-playfair text-slate-950">
      <section className="mx-auto max-w-4xl">
        <div className="text-center">
          <div className="mb-2 flex items-center justify-center gap-3">
            <span className="text-sm font-semibold text-slate-700">Onboarding Portfolio</span>
            <span className="rounded-full bg-[#dbe8ff] px-4 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#0b469e]">Step 1 of 3</span>
          </div>
          <p className="text-left text-xs font-bold uppercase tracking-[0.22em] text-[#0b469e]">Official Document GL-2026-01</p>
          <h1 className="mx-auto mt-5 max-w-3xl font-playfair text-3xl font-black leading-[1.12] text-[#0b469e] sm:text-5xl">
            Membership <span className="text-[#ff9f00]">Agreement</span> &<br />Professional Standards
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base font-medium leading-6 text-slate-700 sm:text-lg">Please review all requirements, policies, standards, and declarations before submitting your application. This agreement constitutes a binding legal contract between you and the Gloaro Network.</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-5 text-xs font-extrabold text-slate-700">
            <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4" />Estimated Reading Time: 12 mins</span>
            <span className="inline-flex items-center gap-2"><RefreshCw className="h-4 w-4" />Last Updated: Oct 2026</span>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <CodeOfEthicsCard />

          <MembershipPoliciesCard />

          <TermsConditionsCard onViewMore={() => setShowTermsDetails(true)} />

          <FinalDeclarationCard acceptedDeclarations={acceptedDeclarations} onToggle={setAcceptedDeclarations} updateAgreement={updateAgreement} />

          <ElectronicSignatureCard agreement={agreement} onChange={updateAgreement} policiesComplete={policiesComplete} />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <a href="/" className="rounded-md border border-slate-300 bg-white px-5 py-2.5 text-xs font-extrabold text-slate-700">Save Draft</a>
          <div className="flex gap-3">
            <a href="#top" className="rounded-md bg-[#ffbf1a] px-5 py-2.5 text-xs font-extrabold text-[#0b1f3d]">Step Back</a>
            <button type="button" onClick={handleNextStep} className="rounded-md bg-[#0b469e] px-5 py-2.5 text-xs font-extrabold text-white">Next Step →</button>
          </div>
        </div>
      </section>
    </main>
  )
}

function CodeOfEthicsCard() {
  return (
    <section className="rounded-lg border border-slate-300 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4 pb-5">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef2ff] text-[#0b469e]">
          <Briefcase className="h-5 w-5" />
        </span>
        <h2 className="font-playfair text-xl font-black text-slate-950">Gloaro Code of Ethics</h2>
      </div>

      <div className="border-t border-slate-200 pt-5">
        <div className="space-y-5">
          {principles.map(([title, description], index) => (
            <article key={title} className="rounded-lg border border-slate-200 bg-white px-6 py-6 shadow-sm">
              <div className="grid gap-3 sm:grid-cols-[42px_1fr]">
                <p className="pt-1 text-xs font-black text-[#9bb7e8]">{index + 1}.0</p>
                <div>
                  <h3 className="text-base font-extrabold text-slate-950">{title}</h3>
                  <p className="mt-2 text-xs font-medium leading-5 text-slate-600">{description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function MembershipPoliciesCard() {
  return (
    <section className="rounded-lg border border-slate-300 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-4 border-b border-slate-200 px-1 pb-4">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef2ff] text-[#0b469e]">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <h2 className="font-playfair text-xl font-black text-slate-950">Membership Policies</h2>
      </div>

      <div className="mt-5 space-y-3">
        <PolicyRow title="Eligibility & Acceptance" open>
          <p>Membership is reserved for individuals with proven executive leadership (VP level or higher) or verified founders of ventures with &gt;$2M ARR. Applications are reviewed by the Gloaro Admissions Board within 14 business days.</p>
          <ul className="mt-3 list-none space-y-1 pl-4">
            <li>Verification of professional background via LinkedIn and 3rd party services.</li>
            <li>KYC (Know Your Customer) compliance is mandatory.</li>
            <li>Review of past ethical standing in professional associations.</li>
          </ul>
        </PolicyRow>
        <PolicyRow title="Renewal & Maintenance" />
        <PolicyRow title="Suspension & Termination" />
      </div>
    </section>
  )
}

function TermsConditionsCard({ onViewMore }) {
  return (
    <section className="rounded-lg border border-slate-300 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-1 pb-4">
        <div className="flex items-center gap-4">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef2ff] text-[#0b469e]">
            <FileText className="h-5 w-5" />
          </span>
          <h2 className="font-playfair text-xl font-black text-slate-950">Terms & Conditions</h2>
        </div>
        <button onClick={onViewMore} className="font-playfair text-base font-black text-[#0b469e]">View More</button>
      </div>

      <div className="mt-5 max-h-[342px] overflow-hidden rounded-lg border border-slate-200 bg-white px-5 py-5 shadow-sm">
        <div className="space-y-5">
          {terms.map(([title, description]) => (
            <article key={title}>
              <h3 className="text-sm font-extrabold text-slate-950">{title}</h3>
              <p className="mt-1 text-xs font-medium leading-5 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function TermsDetailPage({ onBack }) {
  return (
    <main className="min-h-screen bg-[#fff9e8] px-4 py-8 font-playfair text-slate-950">
      <section className="mx-auto max-w-4xl">
        <div className="rounded-lg border border-slate-300 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-1 pb-4">
            <div className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-[#eef2ff] text-[#0b469e]">
                <FileText className="h-4 w-4" />
              </span>
              <h1 className="font-playfair text-lg font-black text-slate-950">Terms & Conditions</h1>
            </div>
            <button onClick={onBack} className="text-xs font-extrabold text-[#0b469e]">View Less</button>
          </div>

          <div className="px-4 py-5">
            <div className="space-y-5">
              {detailedTerms.map(([title, bullets]) => (
                <article key={title}>
                  <h2 className="text-sm font-extrabold text-slate-950">{title}</h2>
                  <ul className="mt-1 space-y-1 text-xs font-medium leading-5 text-slate-600">
                    {bullets.map((item) => <li key={item}>• {item}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button onClick={onBack} className="rounded-md bg-[#0b469e] px-6 py-2.5 text-xs font-extrabold text-white">← Back to Previous page</button>
        </div>
      </section>
    </main>
  )
}

function FinalDeclarationCard({ acceptedDeclarations, onToggle, updateAgreement }) {
  const declarations = [
    'I declare that all information provided in my membership application is true and correct to the best of my knowledge.',
    'I have read, understood, and agree to abide by the Gloaro Code of Ethics in all professional conduct.',
    'I acknowledge the confidential nature of the network and agree not to disclose proprietary insights gained here in.',
    'I agree to the Terms & Conditions and the annual membership fee schedule as outlined.',
    'I understand that any breach of these standards may lead to immediate termination of my membership.',
  ]

  const keys = [
    'information_true',
    'code_of_ethics',
    'confidentiality',
    'terms_and_fee',
    'termination',
  ]

  const handleToggle = (key) => {
    onToggle((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      updateAgreement('declarationsAccepted', next)
      return next
    })
  }

  return (
    <section className="rounded-lg bg-[#fff9e8] p-3">
      <div className="flex items-center gap-3 border-b border-[#efe5c8] pb-4">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-[#e6ebff] text-[#0b469e]">
          <CheckCircle2 className="h-4 w-4" />
        </span>
        <h2 className="font-playfair text-xl font-black text-slate-950">Final Member Declaration</h2>
      </div>

      <div className="mt-5 space-y-3">
        {declarations.map((text, idx) => {
          const key = keys[idx]
          return (
            <label key={text} className="flex items-center gap-3 rounded-md border border-[#eee6cf] bg-white px-3 py-3 text-xs font-medium text-slate-800 shadow-sm cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedDeclarations.includes(key)}
                onChange={() => handleToggle(key)}
                className="h-4 w-4 rounded border-slate-300 accent-[#0b469e]"
              />
              <span>{text}</span>
            </label>
          )
        })}
      </div>
    </section>
  )
}

function ElectronicSignatureCard({ agreement, onChange, policiesComplete }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/10 sm:p-8">
      <h2 className="font-playfair text-2xl font-black text-slate-950">Electronic Signature</h2>

      <div className="mt-6 grid gap-x-8 gap-y-6 md:grid-cols-2">
        <SignatureField label="Full Legal Name" value={agreement.legalName || ''} onChange={(value) => onChange('legalName', value)} placeholder="Enter your full legal name" />
        <SignatureField label="Digital Signature" value={agreement.digitalSignature || ''} onChange={(value) => onChange('digitalSignature', value)} placeholder="Type your name" helper="Type your name to sign electronically" script />
        <SignatureField label="Date" type="date" value={agreement.signatureDate || ''} onChange={(value) => onChange('signatureDate', value)} />
        <SignatureField label="Location" value={agreement.signatureLocation || ''} onChange={(value) => onChange('signatureLocation', value)} placeholder="Enter your city, country" />
      </div>

      <div className="mt-7 rounded-md border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium leading-5 text-slate-700">
        <span className="font-black">Legal Notice:</span> By typing your name above and clicking "Submit Membership Application", you are providing an electronic signature that is as legally binding as a physical signature. You confirm your intent to sign this document and agree to be bound by its terms.
      </div>

      <div className="mt-8 rounded-lg bg-[#ececfa] px-6 py-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-black uppercase tracking-[0.08em] text-slate-950">Application Review Summary</h3>
          <div className="rounded-full bg-[#0755d5] px-8 py-1 text-sm font-black text-white">
            {policiesComplete ? '100% Ready' : '85% Complete'}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-5 gap-3">
          {steps.map((step, index) => {
            const complete = index < 4 || (index === 4 && policiesComplete)
            return (
              <div key={step} className="text-center">
                <div className={`mx-auto grid h-9 w-9 place-items-center rounded-full ${complete ? 'bg-[#084aa7] text-white' : 'bg-[#ffd319] text-slate-950'}`}>
                  {complete ? <Check className="h-5 w-5" /> : <span className="text-lg leading-none">☹</span>}
                </div>
                <p className="mt-2 text-sm font-black text-slate-950">{step}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function SignatureField({ label, type = 'text', value, onChange, placeholder, helper, script }) {
  return (
    <label className="block">
      <span className="text-xl font-black text-slate-700">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={`mt-2 h-12 w-full rounded-md border border-[#e1def3] bg-[#f7f5ff] px-4 text-base text-slate-600 outline-none focus:border-[#0b469e] ${script ? 'font-playfair italic' : ''}`} />
      {helper && <span className="mt-2 block text-sm italic text-slate-600">{helper}</span>}
    </label>
  )
}

function PolicyRow({ title, open, children }) {
  return (
    <details open={open} className="group rounded-lg border border-slate-200 bg-white px-4 py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-extrabold text-slate-950 [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-950 transition group-open:rotate-180" />
      </summary>
      {children && <div className="mt-3 text-xs font-medium leading-5 text-slate-600">{children}</div>}
    </details>
  )
}
