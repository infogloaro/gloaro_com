import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { spring, transition } from '../../../lib/motion'
import SectionHeading from '../../home/sections/SectionHeading'
import { serviceGroups } from './content'
import { AdsDashboard, ContentCalendar, LeadFlow, ReportMockup, SearchMockup } from './mockups'

const mockups = { calendar: ContentCalendar, ads: AdsDashboard, search: SearchMockup, leads: LeadFlow, report: ReportMockup }

// The five service groups as tabs; each shows what we do, what's delivered
// and a product mockup of the work itself.
export default function ServiceExplorer({ active, onSelect, onPlan }) {
  const index = Math.max(0, serviceGroups.findIndex((g) => g.id === active))
  const group = serviceGroups[index]
  const Mockup = mockups[group.visual]

  const onKeyDown = (event) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
    if (!step) return
    event.preventDefault()
    const next = (index + step + serviceGroups.length) % serviceGroups.length
    onSelect(serviceGroups[next].id)
    document.getElementById(`service-tab-${next}`)?.focus()
  }

  return (
    <section id="marketing-services" className="relative scroll-mt-28 bg-[#f6f9ff] px-5 py-16 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="What we do" title="Ten services, one connected marketing system" highlight="connected">
          Choose a service to see exactly what GloAro does and what your business receives.
        </SectionHeading>

        <div
          role="tablist"
          aria-label="Marketing services"
          onKeyDown={onKeyDown}
          className="-mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:mx-auto lg:w-max lg:rounded-full lg:border lg:border-[#08224B]/10 lg:bg-white lg:p-1.5 lg:shadow-sm"
        >
          {serviceGroups.map(({ id, Icon, label, accent }, i) => {
            const selected = i === index
            return (
              <button
                key={id}
                id={`service-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="service-group-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => onSelect(id)}
                className={`relative isolate flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${selected ? 'text-white' : 'border border-[#08224B]/10 bg-white text-[#08224B] lg:border-0 lg:bg-transparent'}`}
              >
                {selected && <motion.span layoutId="service-group-tab" transition={spring.interactive} className="absolute inset-0 -z-10 rounded-full bg-[#08224B]" />}
                <Icon aria-hidden="true" className="h-4 w-4" style={selected ? undefined : { color: accent }} />
                {label}
              </button>
            )
          })}
        </div>

        <div id="service-group-panel" role="tabpanel" aria-labelledby={`service-tab-${index}`} className="mt-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0, transition: transition.entrance }}
              exit={{ opacity: 0, y: -8, transition: transition.exit }}
              className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]"
            >
              <div>
                <span className="grid h-12 w-12 place-items-center rounded-2xl text-white shadow-lg" style={{ background: group.accent }}>
                  <group.Icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-outfit text-2xl font-semibold tracking-tight text-[#08224B] sm:text-3xl">{group.title}</h3>
                <p className="mt-3 text-base font-medium leading-7 text-slate-600">{group.summary}</p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Services included">
                  {group.includes.map((item) => (
                    <li key={item} className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: `${group.accent}14`, color: group.accent }}>{item}</li>
                  ))}
                </ul>
                <h4 className="mt-7 text-xs font-black uppercase tracking-[0.2em] text-[#08224B]/50">What you receive</h4>
                <ul className="mt-3 space-y-2.5">
                  {group.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm font-semibold text-[#08224B]">
                      <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" style={{ color: group.accent }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => onPlan({ service: group.id })}
                  className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#08224B] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#0d4697]"
                >
                  Discuss this service
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
              <div aria-hidden="true">
                <Mockup />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
