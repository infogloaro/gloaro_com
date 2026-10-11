import { Fragment, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { useAmbient } from '../../hooks/useMotionEnv'
import { spring, variants, viewportOnce } from '../../lib/motion'
import ScrollStory from '../../components/partners/ScrollStory'
import { channelStory } from '../../components/partners/stories/channelStory'
import {
  ApplyButton,
  CtaBand,
  DemoBadge,
  FaqAccordion,
  GhostLink,
  PathSwitcher,
  Reveal,
  Section,
  SectionHeading,
  Value,
} from '../../components/partners/PartnerUI'
import { approved, channel } from '../../components/partners/partnerConfig'

const sections = [
  ['channel-story', 'How referrals work'],
  ['who-does-what', 'Who does what'],
  ['tracking', 'Tracking'],
  ['faq', 'FAQ'],
]

const statusTone = {
  'Under review': 'bg-[#EAF2FD] text-[#0B2451]',
  'In discussion': 'bg-[#FFF4D6] text-[#6B4200]',
  Proposal: 'bg-[#DCF2E6] text-[#14593A]',
}

// Hero visual: the referral chain, with a pulse travelling from you to the outcome.
function ReferralChain() {
  const ref = useRef(null)
  const running = useAmbient(ref, { priority: 2 })
  const count = channel.flow.length
  return (
    <div ref={ref} className="relative rounded-[28px] border border-[#D9E1EC] bg-white p-6 shadow-[0_30px_70px_rgba(21,88,176,0.14)] sm:p-8">
      <span aria-hidden="true" className="absolute bottom-12 left-[47px] top-12 w-[3px] rounded-full bg-[#D9E1EC] sm:left-[55px]" />
      {running && (
        <motion.span
          aria-hidden="true"
          className="absolute left-[42px] h-[13px] w-[13px] rounded-full bg-[#F28C00] shadow-[0_0_0_6px_rgba(242,140,0,0.18)] sm:left-[50px]"
          initial={{ top: '8%' }}
          animate={{ top: ['8%', '88%'] }}
          transition={{ duration: 4.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.8 }}
        />
      )}
      <motion.ol className="relative space-y-4" initial="hidden" animate="show" variants={variants.container(0.1, 0.25)}>
        {channel.flow.map(([title, text], index) => (
          <motion.li key={title} variants={variants.fadeUp} className="flex items-center gap-4">
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full font-outfit text-sm font-semibold sm:h-12 sm:w-12 ${index === 0 ? 'bg-[#F28C00] text-[#061A3A]' : index === count - 1 ? 'bg-[#1B7A4A] text-white' : 'bg-[#1558B0] text-white'}`}>
              {index === 0 ? 'You' : index + 1}
            </span>
            <div className="min-w-0 flex-1 rounded-2xl bg-[#F4F8FE] px-4 py-3">
              <p className="font-outfit font-semibold text-[#0B2451]">{title}</p>
              <p className="text-sm text-[#4A5874]">{text}</p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  )
}

// Refer / Qualify / Close × You / GLOARO / Customer, revealed column by column.
function RolesTable() {
  const reduce = useReducedMotion()
  const { columns, rows } = channel.roles
  const cell = (column) => ({
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : 0.15 + column * 0.35 } },
  })
  return (
    <motion.div role="region" aria-label="Who does what table" tabIndex={0} className="overflow-x-auto rounded-3xl border border-[#D9E1EC] bg-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-[#F5A900]" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }}>
      <table className="w-full min-w-[680px] border-collapse text-left">
        <caption className="sr-only">Who does what at each stage of a referral</caption>
        <thead>
          <tr>
            <th scope="col" className="w-[18%] px-5 py-4"><span className="sr-only">Who</span></th>
            {columns.map((column, index) => (
              <motion.th key={column} scope="col" variants={cell(index)} className="bg-[#EAF2FD] px-5 py-4 font-outfit text-base font-semibold text-[#0B2451]">
                <span className="mr-2 inline-grid h-7 w-7 place-items-center rounded-full bg-[#1558B0] text-xs text-white">{index + 1}</span>
                {column}
              </motion.th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([who, ...cells]) => (
            <tr key={who} className="border-t border-[#EEF2F7]">
              <th scope="row" className={`px-5 py-4 font-outfit font-semibold ${who === 'You' ? 'text-[#9A4F00]' : 'text-[#0B2451]'}`}>{who}</th>
              {cells.map((text, index) => (
                <motion.td key={text} variants={cell(index)} className="px-5 py-4 text-[15px] text-[#14213D]">{text}</motion.td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  )
}

// Illustrative tracker: example rows only, no live data.
function TrackerPreview() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[#D9E1EC] bg-white shadow-[0_24px_60px_rgba(21,88,176,0.1)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEF2F7] px-6 py-4">
        <p className="font-outfit text-lg font-semibold text-[#0B2451]">My opportunities</p>
        <DemoBadge />
      </div>
      <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_112px] gap-x-4 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#4A5874]">
        <span>Prospect</span><span>Solution</span><span className="text-right">Status</span>
      </div>
      <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={variants.container(0.15, 0.1)}>
        {channel.trackerRows.map(([prospect, solution, status]) => (
          <motion.div
            key={prospect}
            variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: spring.surface } }}
            className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_112px] items-center gap-x-4 border-t border-[#EEF2F7] px-6 py-4"
          >
            <span className="truncate font-medium text-[#14213D]">{prospect}</span>
            <span className="truncate text-sm text-[#4A5874]">{solution}</span>
            <motion.span
              variants={{ hidden: { scale: 0.7, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { ...spring.interactive, delay: 0.25 } } }}
              className={`justify-self-end rounded-full px-3 py-1 text-xs font-semibold ${statusTone[status]}`}
            >
              {status}
            </motion.span>
          </motion.div>
        ))}
      </motion.div>
      <p className="border-t border-[#EEF2F7] bg-[#F7F9FC] px-6 py-3 text-xs text-[#4A5874]">Illustrative mockup with example data. A partner tracking portal is not live yet.</p>
    </div>
  )
}

export default function ChannelPartnerPage() {
  return (
    <main className="font-work">
      <PathSwitcher active="channel" sections={sections} />

      <section className="relative overflow-hidden bg-[#F4F8FE] px-4 pb-20 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-24 h-[480px] w-[480px] rounded-full bg-[#1558B0]/12 blur-[110px]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1558B0]">GLOARO Channel Partner</p>
            <h1 className="mt-4 font-outfit text-4xl font-semibold leading-[1.08] text-[#0B2451] sm:text-6xl">Connect businesses with technology that moves them forward.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#4A5874]">
              You know businesses that need better software. Introduce them to GLOARO and we take it from there: discovery, proposal and delivery.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ApplyButton pathKey="channel" size="lg" location="hero" />
              <GhostLink to="#channel-story">See how referrals work</GhostLink>
            </div>
          </Reveal>
          <ReferralChain />
        </div>
      </section>

      <span id="channel-story" className="block scroll-mt-36" />
      <ScrollStory story={channelStory} theme="light" cta={<ApplyButton pathKey="channel" size="lg" location="story_end" />} />

      <Section id="who" tone="light">
        <SectionHeading eyebrow="Who makes a great partner" title="People who already advise businesses." intro="If business owners ask you about technology problems, you are a natural fit." />
        <motion.ul className="mt-8 flex flex-wrap gap-3" initial="hidden" whileInView="show" viewport={viewportOnce} variants={variants.container(0.06)}>
          {channel.partnerTypes.map((type) => (
            <motion.li
              key={type}
              variants={{ hidden: { opacity: 0, scale: 0.8, y: 10 }, show: { opacity: 1, scale: 1, y: 0, transition: spring.interactive } }}
              whileHover={{ y: -3 }}
              className="rounded-full border border-[#B8D3F5] bg-[#F4F8FE] px-5 py-3 font-medium text-[#0B2451]"
            >
              {type}
            </motion.li>
          ))}
        </motion.ul>
      </Section>

      <Section id="introduce" tone="sky">
        <SectionHeading eyebrow="What you can introduce" title="Solutions your contacts already ask about." intro="The final list partners may introduce is confirmed in the Channel Partner agreement." />
        <motion.div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" initial="hidden" whileInView="show" viewport={viewportOnce} variants={variants.container(0.08)}>
          {channel.introduce.map(([name, text]) => (
            <motion.div key={name} variants={variants.fadeUp} whileHover={{ y: -5 }} transition={spring.interactive} className="rounded-3xl border border-[#D9E1EC] bg-white p-6">
              <span aria-hidden="true" className="block h-1.5 w-10 rounded-full bg-[#1558B0]" />
              <h3 className="mt-4 font-outfit text-xl font-semibold text-[#0B2451]">{name}</h3>
              <p className="mt-1 text-sm text-[#4A5874]">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      <Section id="who-does-what" tone="light">
        <SectionHeading eyebrow="Who does what" title="Referring, qualifying and closing are different jobs." intro="You refer and help qualify. GLOARO closes and delivers. Whether you take part in closing depends on your signed agreement." />
        <div className="mt-10"><RolesTable /></div>
        <Reveal className="mt-8 flex flex-col gap-4 rounded-3xl border border-[#F2D27A] bg-[#FFFBF0] p-6 sm:flex-row sm:items-start">
          <FileText aria-hidden="true" className="h-6 w-6 shrink-0 text-[#C26A00]" />
          <div className="text-[15px] leading-7 text-[#14213D]">
            <p><strong>Commercial terms.</strong> Referral eligibility, any commission and how it is paid are set only in the signed Channel Partner agreement.</p>
            <dl className="mt-3 grid gap-2 sm:grid-cols-[auto_1fr] sm:gap-x-4">
              {[
                ['Commission', approved.channelCommission],
                ['Payment terms', approved.channelPaymentTerms],
              ].map(([term, value]) => (
                <Fragment key={term}>
                  <dt className="font-semibold">{term}</dt>
                  <dd className="m-0"><Value value={value} /></dd>
                </Fragment>
              ))}
            </dl>
          </div>
        </Reveal>
      </Section>

      <Section id="tracking" tone="sky">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Tracking" title="See where every introduction stands." intro="This is how opportunity progress could be shared with approved partners. The screen is an illustration, not a live portal." />
            <div className="mt-8"><ApplyButton pathKey="channel" location="tracking" /></div>
          </div>
          <TrackerPreview />
        </div>
      </Section>

      <Section id="faq" tone="light">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <SectionHeading eyebrow="Channel Partner questions" title="What partners usually ask first." />
          <Reveal><FaqAccordion items={channel.faqs} idPrefix="channel-faq" /></Reveal>
        </div>
      </Section>

      <CtaBand pathKey="channel" title="Turn your network into opportunities." text="Five short steps. Your answers are saved on this device as you go." />
    </main>
  )
}
