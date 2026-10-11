// GLOARO TECH navigation menu, built from the same service list as the home
// page and the /tech/:slug pages, so a new service appears here automatically.
// Groups follow what a client is trying to do, not technical categories.
import { services } from '../home/homeData'
import { techServiceById } from './serviceContent'

const groupOf = {
  web: 'build',
  mobile: 'build',
  software: 'build',
  saas: 'build',
  marketing: 'grow',
  crm: 'run',
  ai: 'run',
  cloud: 'run',
  design: 'run',
}

export const techGroups = [
  ['build', 'Build'],
  ['run', 'Automate & run'],
]

export const techMenuItems = services
  .map((service) => {
    const page = techServiceById(service.id)
    if (!page) return null
    return {
      id: service.id,
      Icon: service.Icon,
      title: page.name,
      short: service.short,
      href: `/tech/${page.slug}`,
      group: groupOf[service.id] || 'run',
      featured: Boolean(service.featured),
      highlights: service.highlights || [],
    }
  })
  .filter(Boolean)
  // Digital Marketing has its own top-level header link, so it is not repeated here.
  .filter((item) => item.group !== 'grow')
