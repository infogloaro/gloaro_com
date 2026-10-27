import { Navigate, useParams } from 'react-router-dom'
import Seo from '../../components/Seo'
import { processSteps, services } from '../../components/home/homeData'
import { getTechService, techServices } from '../../components/tech/serviceContent'
import { pageContent } from '../../components/tech/page/pageContent'
import { Capabilities, Faq, ProcessTimeline, RelatedCta, StackBand, TechHero } from '../../components/tech/page/Sections'
import ServiceDemo from '../../components/tech/page/ServiceDemo'
import { techServiceSeo } from '../../lib/seoConfig'

const serviceStyle = (id) => services.find((s) => s.id === id) || services[0]

// Gloaro Tech service landing page: /tech/:slug. Copy lives in serviceContent.js
// (SEO-safe plain data) and page/pageContent.js; each service gets its own 3D
// hero scene and hands-on demo.
export default function ServicePage() {
  const { slug } = useParams()
  const service = getTechService(slug)
  if (!service) return <Navigate to="/" replace />

  const { Icon, accent } = serviceStyle(service.id)
  const content = pageContent[service.id]
  const related = techServices.filter((s) => s.slug !== service.slug)

  return (
    <main className="overflow-x-clip bg-white">
      <Seo {...techServiceSeo(service)} />
      <TechHero key={service.id} service={service} accent={accent} Icon={Icon} content={content} />
      <ServiceDemo key={`demo-${service.id}`} id={service.id} accent={accent} demo={content.demo} />
      <Capabilities service={service} accent={accent} />
      <StackBand service={service} accent={accent} />
      <ProcessTimeline steps={processSteps} accent={accent} />
      <Faq key={`faq-${service.id}`} faqs={service.faqs} accent={accent} />
      <RelatedCta related={related} iconFor={serviceStyle} />
    </main>
  )
}
