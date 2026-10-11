import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SplitWords } from '../../components/motion/Text'
import ScrollStory from '../../components/partners/ScrollStory'
import { twoRoadsStory } from '../../components/partners/stories/twoRoadsStory'
import { ApplyButton, FaqAccordion, Reveal, Section, SectionHeading, WhatsAppLink } from '../../components/partners/PartnerUI'
import { ComparisonTable, FitPicker, HowItWorks, PathCards, ServicesShowcase } from '../../components/partners/LandingSections'
import { landingFaqs, paths } from '../../components/partners/partnerConfig'
import { trackPartnerEvent } from '../../lib/partnerAnalytics'
import { ease } from '../../lib/motion'

const rise = (delay) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.entrance, delay } },
})

export default function PartnersLanding() {
  return (
    <main className="font-work">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#061A3A] px-4 pb-20 pt-16 text-white sm:px-6 lg:px-8 lg:pb-24 lg:pt-24">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#1558B0]/30 blur-[120px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -left-40 h-[420px] w-[420px] rounded-full bg-[#F5A900]/10 blur-[120px]" />
        <div className="relative mx-auto max-w-6xl">
          <motion.p {...rise(0)} className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F5A900]">GLOARO Partnerships</motion.p>
          <SplitWords
            as="h1"
            trigger="mount"
            text="Build your business with GLOARO."
            highlight="GLOARO"
            underline
            className="mt-4 max-w-4xl font-outfit text-4xl font-semibold leading-[1.08] sm:text-6xl lg:text-7xl"
          />
          <motion.p {...rise(0.5)} className="mt-6 max-w-2xl text-lg leading-8 text-[#DCE4F0]">
            Two ways to grow with us: run an approved GLOARO franchise, or connect businesses with our technology as a Channel Partner. Pick the path that fits how you work.
          </motion.p>
          <motion.div {...rise(0.65)} className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to={paths.franchise.href}
              onClick={() => trackPartnerEvent('path_card_clicked', { path: 'franchise', location: 'hero' })}
              className="inline-flex min-h-14 items-center rounded-full bg-[#F5A900] px-8 font-outfit text-base font-semibold text-[#061A3A] transition-colors hover:bg-[#FFBE2E] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Explore Franchise Opportunities
            </Link>
            <Link
              to={paths.channel.href}
              onClick={() => trackPartnerEvent('path_card_clicked', { path: 'channel', location: 'hero' })}
              className="inline-flex min-h-14 items-center rounded-full border border-white/30 px-8 font-outfit text-base font-semibold text-white transition-colors hover:border-[#7FA6DC] hover:bg-white/5 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#F5A900]"
            >
              Become a Channel Partner
            </Link>
          </motion.div>
          <motion.a
            {...rise(0.8)}
            href="#two-roads-story-anchor"
            className="mt-10 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#B8C5D9] hover:text-white"
          >
            <ArrowDown aria-hidden="true" className="h-4 w-4 animate-bounce motion-reduce:animate-none" /> Scroll to see how each path works
          </motion.a>
        </div>
      </section>

      <span id="two-roads-story-anchor" className="block scroll-mt-24" />
      <ScrollStory story={twoRoadsStory} theme="dark" />

      <Section id="paths" tone="surface">
        <SectionHeading eyebrow="Choose your path" title="Two partnerships. Clearly different." intro="Each application takes 5 short steps and is reviewed by the GLOARO partnerships team." />
        <div className="mt-10"><PathCards /></div>
      </Section>

      <Section id="find-your-fit" tone="light">
        <SectionHeading eyebrow="Not sure yet?" title="Find your fit in three taps." intro="Answer three quick questions and we will point you to the path that matches how you want to work." />
        <div className="mt-10"><FitPicker /></div>
      </Section>

      <Section id="compare" tone="surface">
        <SectionHeading eyebrow="Side by side" title="How the two paths compare." />
        <div className="mt-10"><ComparisonTable /></div>
      </Section>

      <Section id="what-you-offer" tone="light">
        <SectionHeading eyebrow="What you will offer" title="One technology portfolio, two ways to bring it to market." intro="Product screens are illustrative previews. The final list of services each partner can offer is confirmed during review." />
        <div className="mt-10"><ServicesShowcase /></div>
      </Section>

      <Section id="how-it-works" tone="surface">
        <SectionHeading eyebrow="How each path works" title="From application to working together." />
        <div className="mt-10"><HowItWorks /></div>
      </Section>

      <Section id="faq" tone="light">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <SectionHeading eyebrow="Questions" title="Good to know before you apply." />
          <Reveal><FaqAccordion items={landingFaqs} idPrefix="partners-faq" /></Reveal>
        </div>
      </Section>

      {/* Final split CTA */}
      <section className="grid font-work md:grid-cols-2">
        <div className="bg-[#061A3A] px-6 py-16 text-white sm:px-10 lg:px-16">
          <Reveal className="ml-auto max-w-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F5A900]">Build and operate</p>
            <h2 className="mt-3 font-outfit text-3xl font-semibold">Ready to run a GLOARO franchise?</h2>
            <p className="mt-3 text-[#B8C5D9]">Five short steps. Your answers are saved on this device as you go.</p>
            <div className="mt-7"><ApplyButton pathKey="franchise" size="lg" location="final_cta" /></div>
          </Reveal>
        </div>
        <div className="bg-[#1558B0] px-6 py-16 text-white sm:px-10 lg:px-16">
          <Reveal className="max-w-lg" delay={0.1}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#DCE8F8]">Connect and refer</p>
            <h2 className="mt-3 font-outfit text-3xl font-semibold">Ready to introduce businesses?</h2>
            <p className="mt-3 text-[#DCE8F8]">Five short steps. Your answers are saved on this device as you go.</p>
            <div className="mt-7">
              <Link
                to={paths.channel.applyHref}
                onClick={() => trackPartnerEvent('apply_clicked', { path: 'channel', location: 'final_cta' })}
                className="inline-flex min-h-14 items-center rounded-full bg-white px-8 font-outfit text-base font-semibold text-[#0B2451] transition-colors hover:bg-[#EAF2FD] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#F5A900]"
              >
                {paths.channel.applyLabel}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
      <div className="flex justify-center bg-[#0B2451] px-4 py-8">
        <WhatsAppLink dark location="landing_footer" label="Not ready yet? Talk to us on WhatsApp" message="Hi GLOARO, I would like to know more about your partnership programmes." />
      </div>
    </main>
  )
}
