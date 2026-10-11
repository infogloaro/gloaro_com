import { useCallback, useState } from 'react'
import { ChevronDown, Mail, MessageCircle, Phone } from 'lucide-react'
import Seo from '../../components/Seo'
import SectionHeading from '../../components/home/sections/SectionHeading'
import Hero from '../../components/marketing/page/Hero'
import ServiceExplorer from '../../components/marketing/page/ServiceExplorer'
import IndustryShowcase from '../../components/marketing/page/IndustryShowcase'
import Workflow from '../../components/marketing/page/Workflow'
import EnquiryForm from '../../components/marketing/page/EnquiryForm'
import { serviceGroups } from '../../components/marketing/page/content'
import { techServiceById } from '../../components/tech/serviceContent'
import { whatsappLink } from '../../lib/contact'
import { PHONES, techServiceSeo } from '../../lib/seoConfig'
import { useHashScroll } from '../../hooks/useHashScroll'

const service = techServiceById('marketing')

// Lenis (desktop smooth scroll) owns scrolling when it's active.
function scrollToId(id) {
  const target = document.getElementById(id)
  if (!target) return
  if (window.__lenis) window.__lenis.scrollTo(target, { offset: -100 })
  else target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// /tech/digital-marketing — routed ahead of the generic /tech/:slug page.
export default function DigitalMarketingPage() {
  useHashScroll()
  const [activeGroup, setActiveGroup] = useState(serviceGroups[0].id)
  const [preset, setPreset] = useState(null)

  // Every "plan / discuss" CTA lands on the enquiry form, pre-filled with
  // whatever the visitor was looking at.
  const plan = useCallback((details) => {
    setPreset({ ...details, at: Date.now() })
    scrollToId('enquiry')
  }, [])
  const explore = useCallback((id) => {
    setActiveGroup(id)
    scrollToId('marketing-services')
  }, [])

  return (
    <main className="overflow-x-clip bg-white">
      <Seo {...techServiceSeo(service)} />
      <Hero onPlan={plan} onExplore={explore} />
      <ServiceExplorer active={activeGroup} onSelect={setActiveGroup} onPlan={plan} />
      <IndustryShowcase onPlan={plan} />
      <Workflow onPlan={plan} />

      <section id="faq" className="scroll-mt-28 bg-white px-5 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="Questions" title="Straight answers before you start" highlight="Straight" />
          <div className="mt-10 divide-y divide-[#08224B]/10 rounded-3xl border border-[#08224B]/10 bg-white shadow-[0_18px_40px_-24px_rgba(8,34,75,0.3)]">
            {service.faqs.map(([question, answer]) => (
              <details key={question} className="group px-5 py-4 sm:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-[#08224B] [&::-webkit-details-marker]:hidden">
                  {question}
                  <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 text-[#CB9015] transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm font-medium leading-7 text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="enquiry" className="relative isolate scroll-mt-24 overflow-hidden bg-[#061633] px-5 py-16 text-white sm:py-24 lg:px-8">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_15%_20%,rgba(255,174,19,0.16),transparent_55%),radial-gradient(ellipse_at_90%_80%,rgba(214,51,108,0.2),transparent_55%)]" />
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-white/90">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ffae13]" />Contact GloAro
            </p>
            <h2 className="mt-5 font-outfit text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Tell us about your business</h2>
            <p className="mt-4 text-base font-medium leading-7 text-white/70">
              Share a few details and we’ll come back with ideas for your industry and a clear proposal: what we’ll do each month, what it costs and how we’ll report on it.
            </p>
            <ol className="mt-8 space-y-4">
              {['We reply to your enquiry on WhatsApp', 'A short call to understand your goals and customers', 'A written proposal with scope, deliverables and fee'].map((text, i) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#ffae13] text-xs font-black text-[#061633]">{i + 1}</span>
                  <span className="pt-0.5 text-sm font-semibold text-white/85">{text}</span>
                </li>
              ))}
            </ol>
            <div className="mt-9 space-y-3 text-sm font-semibold">
              <a href={whatsappLink('Hi GloAro, I would like to discuss digital marketing for my business.')} target="_blank" rel="noopener noreferrer" className="flex w-max items-center gap-3 text-white/85 hover:text-white">
                <MessageCircle aria-hidden="true" className="h-5 w-5 text-[#25D366]" />Chat on WhatsApp
              </a>
              <a href={`tel:${PHONES[0].replace(/-/g, '')}`} className="flex w-max items-center gap-3 text-white/85 hover:text-white">
                <Phone aria-hidden="true" className="h-5 w-5 text-[#ffae13]" />{PHONES[0].replace('-', ' ')}
              </a>
              <a href="mailto:info@gloaro.com" className="flex w-max items-center gap-3 text-white/85 hover:text-white">
                <Mail aria-hidden="true" className="h-5 w-5 text-[#ffae13]" />info@gloaro.com
              </a>
            </div>
          </div>
          <EnquiryForm preset={preset} />
        </div>
        <p className="mx-auto mt-14 max-w-3xl text-center text-[11px] font-medium leading-5 text-white/40">
          Example photography from Unsplash (Unsplash License). Vinayaga Ready Mix Concrete images belong to the client and are used with permission.
        </p>
      </section>
    </main>
  )
}
