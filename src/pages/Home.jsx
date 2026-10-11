import { lazy, Suspense } from 'react'
import Seo from '../components/Seo'
import Hero from '../components/home/Hero'
import { allTech } from '../components/home/homeData'
import { Marquee } from '../components/motion/Ambient'
import { useHashScroll } from '../hooks/useHashScroll'

// Everything below the fold is split into its own chunk so the hero paints first.
const ServicesSection = lazy(() => import('../components/home/sections/ServicesSection'))
const JourneySection = lazy(() => import('../components/home/sections/JourneySection'))
const ProductsSection = lazy(() => import('../components/home/sections/ProductsSection'))
const WorkSection = lazy(() => import('../components/home/sections/WorkSection'))
const IndustriesSection = lazy(() => import('../components/home/sections/IndustriesSection'))
const TechSection = lazy(() => import('../components/home/sections/TechSection'))
const ShowcaseSection = lazy(() => import('../components/home/sections/ShowcaseSection'))
const ProcessSection = lazy(() => import('../components/home/sections/ProcessSection'))
const WhySection = lazy(() => import('../components/home/sections/WhySection'))
const TestimonialSection = lazy(() => import('../components/home/sections/TestimonialSection'))
const CtaSection = lazy(() => import('../components/home/sections/CtaSection'))

// Reserves roughly the section's height while its chunk loads.
function Deferred({ children, minHeight = '100vh' }) {
  return <Suspense fallback={<div aria-hidden="true" style={{ minHeight }} />}>{children}</Suspense>
}

export default function Home() {
  useHashScroll()

  return (
    <main id="top" className="overflow-x-clip bg-white">
      <Seo
        title="GLOARO Tech | Custom Software, Web, Mobile & AI Development"
        description="GLOARO builds custom software, websites, mobile apps, SaaS products, CRM/ERP automation and AI solutions for growing businesses — plus Gloaro Mart and the Gloaro Network."
        keywords="GLOARO Tech, custom software development, website development, mobile app development, SaaS development, CRM ERP automation, UI UX design, AI automation, cloud DevOps, Gloaro Mart"
        canonical="/"
        schema={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Organization',
              name: 'GLOARO',
              url: 'https://www.gloaro.com',
              logo: 'https://www.gloaro.com/logo.png',
              description: 'GLOARO builds custom software, websites, mobile apps, SaaS products and AI solutions for growing businesses.',
              email: 'info@gloaro.com',
            },
            {
              '@type': 'WebSite',
              name: 'GLOARO',
              url: 'https://www.gloaro.com',
              inLanguage: 'en-IN',
            },
          ],
        }}
      />

      <Hero />

      <section aria-label="Technologies we work with" className="mt-10 border-y border-[#0d4697]/10 bg-white py-5">
        <Marquee
          items={allTech}
          priority={2}
          renderItem={([name, Icon, color]) => (
            <span className="flex items-center gap-2.5 px-6 font-work text-xs font-extrabold uppercase tracking-[0.2em] text-[#0d4697]/70 sm:text-sm">
              <Icon aria-hidden="true" className="h-5 w-5" style={{ color: color === '#ffffff' ? '#0b2451' : color }} />
              {name}
            </span>
          )}
        />
      </section>

      <Deferred><ServicesSection /></Deferred>
      <Deferred><WorkSection /></Deferred>
      <Deferred><JourneySection /></Deferred>
      <Deferred><ProductsSection /></Deferred>
      <Deferred minHeight="70vh"><IndustriesSection /></Deferred>
      <Deferred><TechSection /></Deferred>
      <Deferred><ShowcaseSection /></Deferred>
      <Deferred><ProcessSection /></Deferred>
      <Deferred minHeight="70vh"><WhySection /></Deferred>
      <Deferred><TestimonialSection /></Deferred>
      <Deferred><CtaSection /></Deferred>
    </main>
  )
}
