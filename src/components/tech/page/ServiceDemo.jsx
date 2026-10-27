import { lazy, Suspense } from 'react'
import SectionHeading from '../../home/sections/SectionHeading'

// Hands-on section for each service. Each demo is its own lazily loaded module
// in ./demos, receives `{ accent }`, and must work at 375px and with reduced motion.
const demos = {
  ai: lazy(() => import('./demos/AiDemo')),
  web: lazy(() => import('./demos/WebDemo')),
  mobile: lazy(() => import('./demos/MobileDemo')),
  software: lazy(() => import('./demos/SoftwareDemo')),
  saas: lazy(() => import('./demos/SaasDemo')),
  crm: lazy(() => import('./demos/CrmDemo')),
  design: lazy(() => import('./demos/DesignDemo')),
  cloud: lazy(() => import('./demos/CloudDemo')),
}

export default function ServiceDemo({ id, accent, demo }) {
  const Demo = demos[id]
  if (!Demo || !demo) return null
  return (
    <section id="demo" className="relative overflow-x-clip bg-[linear-gradient(180deg,#f5f8ff,#ffffff)] px-5 py-16 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={demo.eyebrow} title={demo.title} highlight={demo.highlight}>{demo.text}</SectionHeading>
        <div className="mt-10 sm:mt-12">
          <Suspense fallback={<div className="h-[460px] animate-pulse rounded-[28px] bg-slate-100" />}>
            <Demo accent={accent} />
          </Suspense>
        </div>
        <p className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Illustrative demo with sample data</p>
      </div>
    </section>
  )
}
