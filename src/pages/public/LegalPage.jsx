import { useEffect } from 'react'
import { ArrowLeft, FileText, Mail, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

const termsSections = [
  ['1. About GLOARO', 'GLOARO provides business networking, memberships, digital services, franchise opportunities, e-commerce, training, and business solutions.'],
  ['2. Eligibility', 'Users must be at least 18 years old and provide accurate information.'],
  ['3. User Accounts', 'Users are responsible for account security and all account activities.'],
  ['4. Membership', 'Membership benefits are subject to company policies and do not guarantee referrals or profits.'],
  ['5. Payments', 'Fees are generally non-refundable unless agreed otherwise in writing.'],
  ['6. Intellectual Property', 'All website content, logos, trademarks, software, and materials belong to GLOARO PVT LTD.'],
  ['7. Acceptable Use', 'Users must not misuse the platform or engage in illegal activities.'],
  ['8. Limitation of Liability', 'GLOARO is not liable for indirect or consequential losses arising from use of the platform.'],
  ['9. Governing Law', 'These terms are governed by the laws of India. Jurisdiction: Chennai, Tamil Nadu.'],
]

const privacySections = [
  ['Information We Collect', 'We collect names, email addresses, phone numbers, company details, business profiles, IP addresses, device details, cookies, and analytics.'],
  ['How We Use Information', 'We use information to provide services, manage memberships, process payments, improve services, and communicate with users.'],
  ['Business Directory', 'Business profile information may be visible to registered members for networking.'],
  ['Cookies', 'We use cookies to improve the user experience.'],
  ['Information Sharing', 'We do not sell personal data. We may share data with service providers or where legally required.'],
  ['Data Security', 'We use reasonable safeguards to protect user information.'],
  ['Your Rights', 'Users may request access, correction, deletion, or account closure, subject to applicable law.'],
  ['Policy Updates', 'We may update this Privacy Policy from time to time.'],
]

const content = {
  terms: {
    title: 'Terms & Conditions',
    introduction: 'Welcome to GLOARO PVT LTD. By using our website and services, you agree to these Terms & Conditions.',
    sections: termsSections,
  },
  privacy: {
    title: 'Privacy Policy',
    introduction: 'This Privacy Policy explains what information GLOARO PVT LTD collects and how we use, share, and protect it.',
    sections: privacySections,
  },
}

export default function LegalPage({ type }) {
  const page = content[type]

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [type])

  return (
    <main className="bg-[#f8fafc] px-4 py-10 font-urbanist text-slate-700 sm:px-8 sm:py-14 lg:py-16">
      <article className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
        <header className="border-b border-slate-200 px-6 py-10 text-center sm:px-12 sm:py-14">
          <span className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-[#e58b00]">
            <FileText aria-hidden="true" size={24} />
          </span>
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-[#d17b00]">GLOARO PVT LTD</p>
          <h1 className="font-playfair text-3xl font-black text-slate-950 sm:text-5xl">{page.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{page.introduction}</p>
        </header>

        <div className="px-6 py-10 sm:px-12 sm:py-12">
          <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
            {page.sections.map(([heading, description]) => (
              <section className="border-l-2 border-amber-300 pl-5" key={heading}>
                <h2 className="mb-2 text-lg font-extrabold text-slate-950">{heading}</h2>
                <p className="text-[15px] leading-7 text-slate-600">{description}</p>
              </section>
            ))}
          </div>

          <section className="mt-12 rounded-2xl border border-amber-200 bg-amber-50/60 p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-slate-950">Have a question?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Contact our team for assistance regarding this policy.</p>
            <div className="mt-5 flex flex-col gap-4 text-sm font-bold text-slate-800 sm:flex-row sm:flex-wrap sm:gap-7">
              <a className="inline-flex items-center gap-2 transition hover:text-[#c87500]" href="mailto:info@gloaro.com"><Mail aria-hidden="true" size={18} />info@gloaro.com</a>
              <a className="inline-flex items-center gap-2 transition hover:text-[#c87500]" href="tel:+917200238737"><Phone aria-hidden="true" size={18} />+91 72002 38737</a>
              <a className="transition hover:text-[#c87500]" href="https://www.gloaro.com">www.gloaro.com</a>
            </div>
          </section>

          <div className="mt-9 border-t border-slate-200 pt-7">
            <Link className="inline-flex items-center gap-2 font-extrabold text-slate-800 transition hover:text-[#c87500]" to="/#top">
              <ArrowLeft aria-hidden="true" size={18} /> Back to home
            </Link>
          </div>
        </div>
      </article>
    </main>
  )
}
