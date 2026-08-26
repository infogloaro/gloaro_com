import { useEffect } from 'react'
import { matchPath, useLocation } from 'react-router-dom'

const DEFAULT_SITE_NAME = 'GLOARO'
const DEFAULT_SITE_URL = import.meta.env.VITE_SITE_URL || 'https://www.gloaro.com'
const DEFAULT_DESCRIPTION =
  'GLOARO is a premium business network, marketplace, and membership platform that connects verified entrepreneurs, businesses, and communities for growth.'
const DEFAULT_KEYWORDS =
  'GLOARO, business network, verified members, marketplace, vendor directory, membership platform, B2B networking, business community, entrepreneurship, India'

const structuredUrl = (pathname = '/') => {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  return new URL(normalizedPath, DEFAULT_SITE_URL).toString()
}

const getRouteConfig = (pathname = '/') => {
  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '')

  const noindex = [
    '/login',
    '/signin',
    '/register',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/dashboard',
    '/notifications',
    '/analytics',
    '/cart',
    '/checkout',
    '/orders',
    '/wishlist',
    '/customer',
    '/member',
    '/vendor',
    '/admin',
    '/super-admin',
    '/membership/dashboard',
    '/secretary',
    '/region-director',
    '/state-director',
    '/district-director',
    '/chapter-director',
    '/president',
    '/vice-president',
    '/launch-director',
    '/direct-consultant',
  ]

  const publicRoutes = [
    {
      pattern: '/',
      title: 'GLOARO | Verified Business Network, Marketplace & Membership Platform',
      description: DEFAULT_DESCRIPTION,
      keywords: DEFAULT_KEYWORDS,
      schema: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            name: DEFAULT_SITE_NAME,
            url: DEFAULT_SITE_URL,
            logo: structuredUrl('/logo.png'),
            description: DEFAULT_DESCRIPTION,
            email: 'info@gloaro.com',
          },
          {
            '@type': 'WebSite',
            name: DEFAULT_SITE_NAME,
            url: DEFAULT_SITE_URL,
            description: DEFAULT_DESCRIPTION,
            inLanguage: 'en-IN',
          },
        ],
      },
    },
    {
      pattern: '/about',
      title: 'About GLOARO | Verified Business Network in India',
      description:
        'Learn how GLOARO connects entrepreneurs through verified membership, referrals, business services, marketplace tools, and a professional growth community.',
      keywords: 'about GLOARO, business networking, verified entrepreneurs, membership community, marketplace platform',
    },
    {
      pattern: '/vendors',
      title: 'Vendor Directory | GLOARO',
      description:
        'Discover verified vendors, business profiles, and trusted suppliers across the GLOARO network and marketplace.',
      keywords: 'vendor directory, verified vendors, business suppliers, marketplace listings, GLOARO vendors',
    },
    {
      pattern: '/vendors/:id',
      title: 'Verified Vendor Profile | GLOARO',
      description:
        'View a verified vendor profile, explore business details, and connect with trusted suppliers in the GLOARO network.',
      keywords: 'vendor profile, verified supplier, business listing, B2B supplier, GLOARO vendor',
    },
    {
      pattern: '/products',
      title: 'Marketplace Products | GLOARO',
      description:
        'Browse curated marketplace products from verified businesses and suppliers in the GLOARO ecosystem.',
      keywords: 'marketplace products, verified products, business marketplace, GLOARO products',
    },
    {
      pattern: '/products/:id',
      title: 'Product Detail | GLOARO Marketplace',
      description:
        'Explore detailed product information, pricing, and availability from trusted GLOARO marketplace sellers.',
      keywords: 'product detail, marketplace listing, verified product, business ecommerce, GLOARO',
    },
    {
      pattern: '/services',
      title: 'Business Services | GLOARO',
      description:
        'Explore professional services from verified businesses, consultants, and service providers in the GLOARO network.',
      keywords: 'business services, verified services, consultants, service providers, GLOARO services',
    },
    {
      pattern: '/services/:id',
      title: 'Service Detail | GLOARO',
      description:
        'View service details from trusted GLOARO providers and connect with businesses that match your needs.',
      keywords: 'service detail, verified service provider, business services, GLOARO',
    },
    {
      pattern: '/categories',
      title: 'Business Categories | GLOARO',
      description:
        'Explore business categories and find verified companies, products, and services faster inside GLOARO.',
      keywords: 'business categories, marketplace categories, vendor categories, GLOARO directory',
    },
    {
      pattern: '/nearby',
      title: 'Nearby Businesses | GLOARO',
      description:
        'Find nearby verified businesses and local opportunities through GLOARO’s location-aware discovery experience.',
      keywords: 'nearby businesses, local vendors, business discovery, GLOARO nearby',
    },
    {
      pattern: '/events',
      title: 'Business Events | GLOARO',
      description:
        'Discover networking events, community sessions, workshops, and growth-focused gatherings hosted by GLOARO.',
      keywords: 'business events, networking events, workshops, GLOARO events, community events',
    },
    {
      pattern: '/reviews',
      title: 'Business Reviews | GLOARO',
      description:
        'Read verified business reviews and reputation signals across the GLOARO marketplace and directory.',
      keywords: 'business reviews, verified reviews, marketplace ratings, GLOARO reviews',
    },
    {
      pattern: '/membership-agreement',
      title: 'Membership Agreement | GLOARO',
      description:
        'Review the GLOARO membership agreement and understand the benefits, responsibilities, and platform terms.',
      keywords: 'membership agreement, GLOARO terms, business network agreement',
    },
    {
      pattern: '/membership-application',
      title: 'Membership Application | GLOARO',
      description:
        'Apply for GLOARO membership and join a verified business network built for visibility, referrals, and growth.',
      keywords: 'membership application, join GLOARO, verified business network',
    },
    {
      pattern: '/membership-qualification',
      title: 'Membership Qualification | GLOARO',
      description:
        'Complete the GLOARO membership qualification flow to move forward in the joining process.',
      keywords: 'membership qualification, GLOARO onboarding, join process',
    },
    {
      pattern: '/membership-application/track',
      title: 'Track Membership Application | GLOARO',
      description:
        'Track your GLOARO membership application status and follow each stage of the onboarding journey.',
      keywords: 'track application, membership status, GLOARO onboarding',
    },
    {
      pattern: '/terms-and-conditions',
      title: 'Terms & Conditions | GLOARO',
      description:
        'Read the terms and conditions that govern use of the GLOARO platform, services, and membership ecosystem.',
      keywords: 'terms and conditions, GLOARO legal, platform policy',
    },
    {
      pattern: '/privacy-policy',
      title: 'Privacy Policy | GLOARO',
      description:
        'Understand how GLOARO collects, uses, and protects personal information across the platform.',
      keywords: 'privacy policy, data protection, GLOARO privacy',
    },
    {
      pattern: '/shipping-policy',
      title: 'Shipping Policy | GLOARO',
      description:
        'Review GLOARO shipping, fulfilment, and delivery policies for marketplace orders.',
      keywords: 'shipping policy, delivery policy, fulfilment, GLOARO shipping',
    },
    {
      pattern: '/cancellation-refund-policy',
      title: 'Cancellation & Refund Policy | GLOARO',
      description:
        'See how cancellations, refunds, and returns work on the GLOARO platform.',
      keywords: 'refund policy, cancellation policy, returns, GLOARO orders',
    },
  ]

  const matchedPublicRoute = publicRoutes.find((route) => matchPath({ path: route.pattern, end: true }, normalizedPath))
  if (matchedPublicRoute) {
    return {
      title: matchedPublicRoute.title,
      description: matchedPublicRoute.description,
      keywords: matchedPublicRoute.keywords,
      canonical: structuredUrl(normalizedPath),
      robots: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
      ogType: 'website',
      schema: matchedPublicRoute.schema || {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: matchedPublicRoute.title,
        url: structuredUrl(normalizedPath),
        description: matchedPublicRoute.description,
        isPartOf: {
          '@type': 'WebSite',
          name: DEFAULT_SITE_NAME,
          url: DEFAULT_SITE_URL,
        },
      },
    }
  }

  const isNoIndex = noindex.some((prefix) => normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`))

  return {
    title: `${DEFAULT_SITE_NAME} | Secure Business Network`,
    description: DEFAULT_DESCRIPTION,
    keywords: DEFAULT_KEYWORDS,
    canonical: structuredUrl(normalizedPath),
    robots: isNoIndex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
    ogType: 'website',
  }
}

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
    setMetaTag('meta[property="og:image"]', { property: 'og:image', content: structuredUrl('/logo.png') })
    setMetaTag('meta[property="og:image:alt"]', { property: 'og:image:alt', content: `${DEFAULT_SITE_NAME} logo` })
    setMetaTag('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    setMetaTag('meta[name="twitter:title"]', { name: 'twitter:title', content: config.title })
    setMetaTag('meta[name="twitter:description"]', { name: 'twitter:description', content: config.description })
    setMetaTag('meta[name="twitter:image"]', { name: 'twitter:image', content: structuredUrl('/logo.png') })

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', config.canonical || routeConfig.canonical)

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
