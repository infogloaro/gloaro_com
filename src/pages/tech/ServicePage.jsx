import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ChevronDown, PhoneCall } from 'lucide-react'
import Seo from '../../components/Seo'
import { Reveal } from '../../components/common/ScrollReveal'
import { processSteps, services } from '../../components/home/homeData'
import { getTechService, techServices } from '../../components/tech/serviceContent'
import { techServiceSeo } from '../../lib/seoConfig'

const NAVY = '#08224B'

// Gloaro Tech service landing page: /tech/:slug. Content lives in serviceContent.js.
export default function ServicePage() {
  const { slug } = useParams()
  const service = getTechService(slug)
  if (!service) return <Navigate to="/" replace />

  const { Icon, accent } = services.find((s) => s.id === service.id) || services[0]
  const related = techServices.filter((s) => s.slug !== service.slug)

  return (
    <main className="overflow-x-clip bg-white">
      <Seo {...techServiceSeo(service)} />

      {/* Hero */}
      <section className="relative bg-[#fdf9e9] px-5 py-14 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-slate-500">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link to="/" className="hover:text-[#0d4697]">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link to="/#services" className="hover:text-[#0d4697]">Services</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-[#0d4697]">{service.name}</li>
            </ol>
          </nav>

          <div className="mt-6 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl text-white shadow-lg" style={{ background: accent }}>
              <Icon className="h-6 w-6" />
            </span>
            <span className="text-xs font-black uppercase tracking-[0.24em] text-[#0d4697]">{service.name}</span>
          </div>

          <h1 className="mt-5 max-w-4xl font-outfit text-4xl font-semibold leading-tight tracking-tight sm:text-5xl" style={{ color: NAVY }}>
            {service.headline}
          </h1>
          <p className="mt-5 max-w-3xl font-work text-base font-medium leading-7 text-slate-600 sm:text-lg">{service.intro}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-[#08224B] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#0d4697]"
            >
              Get a free quote
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="tel:+917200073704"
              className="inline-flex items-center gap-2 rounded-full border border-[#08224B]/15 bg-white px-6 py-3 text-sm font-bold text-[#08224B] transition hover:border-[#CB9015]"
            >
              <PhoneCall className="h-4 w-4 text-[#CB9015]" /> +91 72000 73704
            </a>
          </div>
        </div>
      </section>

      {/* What we build */}
      <section className="px-5 py-16 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-outfit text-3xl font-semibold tracking-tight text-[#0d4697]">What we build</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {service.deliverables.map(([title, text], i) => (
              <Reveal key={title} delay={i * 60} className="rounded-2xl border border-[#08224B]/10 bg-white p-5 shadow-[0_10px_26px_rgba(8,34,75,0.06)]">
                <h3 className="flex items-start gap-2 text-base font-extrabold" style={{ color: NAVY }}>
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" style={{ color: accent }} />
                  {title}
                </h3>
                <p className="mt-2 pl-7 text-sm font-medium leading-6 text-slate-600">{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for + tech */}
      <section className="bg-slate-50 px-5 py-16 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-outfit text-2xl font-semibold tracking-tight text-[#0d4697]">Who it’s for</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {service.audiences.map((item) => (
                <li key={item} className="rounded-full border border-[#08224B]/10 bg-white px-4 py-2 text-sm font-semibold text-[#08224B]">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-outfit text-2xl font-semibold tracking-tight text-[#0d4697]">Technologies we use</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {service.tech.map((item) => (
                <li key={item} className="rounded-full bg-[#08224B] px-4 py-2 text-sm font-semibold text-white">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="px-5 py-16 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-outfit text-3xl font-semibold tracking-tight text-[#0d4697]">How we work</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map(([num, title, text]) => (
              <li key={num} className="rounded-2xl border border-[#08224B]/10 p-5">
                <span className="font-outfit text-sm font-bold text-[#CB9015]">{num}</span>
                <h3 className="mt-1 text-sm font-extrabold" style={{ color: NAVY }}>{title}</h3>
                <p className="mt-1 text-xs font-medium leading-5 text-slate-600">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#fdf9e9] px-5 py-16 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-outfit text-3xl font-semibold tracking-tight text-[#0d4697]">Frequently asked questions</h2>
          <div className="mt-8 space-y-3">
            {service.faqs.map(([question, answer]) => (
              <details key={question} className="group rounded-2xl border border-[#08224B]/10 bg-white p-5 open:shadow-md">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold" style={{ color: NAVY }}>
                  {question}
                  <ChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related services + CTA */}
      <section className="px-5 py-16 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-outfit text-2xl font-semibold tracking-tight text-[#0d4697]">Other services</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  to={`/tech/${item.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-[#08224B]/10 px-4 py-3 text-sm font-bold text-[#08224B] transition hover:border-[#CB9015]"
                >
                  {item.name}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-14 rounded-[28px] bg-[#08224B] px-6 py-10 text-center text-white sm:px-10">
            <h2 className="font-outfit text-2xl font-semibold sm:text-3xl">Tell us what you want to build</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm font-medium text-white/75 sm:text-base">
              GLOARO is based in Kallakurichi, Tamil Nadu, and works with businesses across India. Share your requirement and we’ll get back with a clear scope.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="rounded-full bg-[#ffae13] px-6 py-3 text-sm font-bold text-[#08142b] transition hover:bg-[#ffd36e]">
                Get a free quote
              </Link>
              <a href="tel:+917200073704" className="rounded-full border border-white/25 px-6 py-3 text-sm font-bold transition hover:border-[#ffae13]">
                Call +91 72000 73704
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
