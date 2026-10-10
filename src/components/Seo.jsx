import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { DEFAULT_SITE_NAME, DEFAULT_SITE_URL, OG_IMAGE, getRouteConfig } from '../lib/seoConfig'

const setMetaTag = (selector, attributes) => {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }
  Object.entries(attributes).forEach(([key, value]) => {
    if (value != null) element.setAttribute(key, value)
  })
  return element
}

export default function Seo({
  title,
  description,
  canonical,
  keywords,
  robots,
  schema,
  ogType,
} = {}) {
  const { pathname } = useLocation()

  useEffect(() => {
    const routeConfig = getRouteConfig(pathname)
    const config = {
      ...routeConfig,
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(keywords ? { keywords } : {}),
      ...(robots ? { robots } : {}),
      ...(schema ? { schema } : {}),
      ...(ogType ? { ogType } : {}),
      ...(canonical ? { canonical: new URL(canonical, DEFAULT_SITE_URL).toString() } : {}),
    }

    document.title = config.title

    setMetaTag('meta[name="description"]', { name: 'description', content: config.description })
    setMetaTag('meta[name="keywords"]', { name: 'keywords', content: config.keywords })
    setMetaTag('meta[name="robots"]', { name: 'robots', content: config.robots })
    setMetaTag('meta[name="author"]', { name: 'author', content: DEFAULT_SITE_NAME })
    setMetaTag('meta[name="application-name"]', { name: 'application-name', content: DEFAULT_SITE_NAME })
    setMetaTag('meta[name="apple-mobile-web-app-title"]', { name: 'apple-mobile-web-app-title', content: DEFAULT_SITE_NAME })
    setMetaTag('meta[property="og:site_name"]', { property: 'og:site_name', content: DEFAULT_SITE_NAME })
    setMetaTag('meta[property="og:title"]', { property: 'og:title', content: config.title })
    setMetaTag('meta[property="og:description"]', { property: 'og:description', content: config.description })
    setMetaTag('meta[property="og:url"]', { property: 'og:url', content: config.canonical })
    setMetaTag('meta[property="og:type"]', { property: 'og:type', content: config.ogType || 'website' })
    setMetaTag('meta[property="og:image"]', { property: 'og:image', content: OG_IMAGE.url })
    setMetaTag('meta[property="og:image:width"]', { property: 'og:image:width', content: String(OG_IMAGE.width) })
    setMetaTag('meta[property="og:image:height"]', { property: 'og:image:height', content: String(OG_IMAGE.height) })
    setMetaTag('meta[property="og:image:alt"]', { property: 'og:image:alt', content: OG_IMAGE.alt })
    setMetaTag('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    setMetaTag('meta[name="twitter:title"]', { name: 'twitter:title', content: config.title })
    setMetaTag('meta[name="twitter:description"]', { name: 'twitter:description', content: config.description })
    setMetaTag('meta[name="twitter:image"]', { name: 'twitter:image', content: OG_IMAGE.url })

    let canonicalLink = document.head.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', config.canonical || routeConfig.canonical)

    const existingSchema = document.head.querySelector('script[data-seo="structured-data"]')
    if (existingSchema) existingSchema.remove()
    if (config.schema) {
      const schemaScript = document.createElement('script')
      schemaScript.type = 'application/ld+json'
      schemaScript.setAttribute('data-seo', 'structured-data')
      schemaScript.textContent = JSON.stringify(config.schema)
      document.head.appendChild(schemaScript)
    }
  }, [pathname])

  return null
}
