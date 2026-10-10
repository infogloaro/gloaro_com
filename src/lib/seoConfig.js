// Single source of truth for per-route SEO. Used in the browser by <Seo /> and at
// build time by scripts/prerender-seo.mjs, so keep it free of React/DOM code.
import { matchPath } from 'react-router-dom'

export const DEFAULT_SITE_NAME = 'GLOARO'
export const DEFAULT_SITE_URL = import.meta.env?.VITE_SITE_URL || 'https://www.gloaro.com'
const DEFAULT_DESCRIPTION =
  'GLOARO is a premium business network, marketplace, and membership platform that connects verified entrepreneurs, businesses, and communities for growth.'
const DEFAULT_KEYWORDS =
  'GLOARO, business network, verified members, marketplace, vendor directory, membership platform, B2B networking, business community, entrepreneurship, India'

export const structuredUrl = (pathname = '/') => {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  return new URL(normalizedPath, DEFAULT_SITE_URL).toString()
}

// 1200×630 social share banner (WhatsApp, LinkedIn, Facebook, X).
export const OG_IMAGE = { url: structuredUrl('/og-image.png'), width: 1200, height: 630, alt: 'GLOARO Pvt Ltd logo' }

export const PHONES = ['+91-7200073704', '+91-7200537071']

// Company details for JSON-LD. Keep in sync with the footer (address) and contact numbers.
// Add real social profile URLs to `sameAs` once available.
export const ORGANIZATION = {
  '@type': 'LocalBusiness',
  '@id': structuredUrl('/#organization'),
  name: DEFAULT_SITE_NAME,
  legalName: 'Gloaro Private Limited',
  url: structuredUrl('/'),
  logo: structuredUrl('/logo.png'),
  image: OG_IMAGE.url,
  description: 'GLOARO builds custom software, websites, mobile apps, SaaS products and AI solutions for growing businesses, and runs Gloaro Mart and the Gloaro Network.',
  email: 'info@gloaro.com',
  telephone: PHONES[0],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'SF No. 101/2B, Esai Towers, Salem Main Road, Near Bypass, Emapper',
    addressLocality: 'Kallakurichi',
    addressRegion: 'Tamil Nadu',
    postalCode: '606202',
    addressCountry: 'IN',
  },
  areaServed: { '@type': 'Country', name: 'India' },
  contactPoint: PHONES.map((telephone) => ({
    '@type': 'ContactPoint',
    telephone,
    email: 'info@gloaro.com',
    contactType: 'customer support',
    areaServed: 'IN',
    availableLanguage: ['English', 'Tamil'],
  })),
}

// Gloaro Tech service page under /tech/:slug (service comes from components/tech/serviceContent).
export const techServiceSeo = (service) => {
  const url = structuredUrl(`/tech/${service.slug}`)
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    canonical: `/tech/${service.slug}`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${url}#service`,
          name: service.name,
          serviceType: service.name,
          description: service.metaDescription,
          url,
          provider: { '@id': ORGANIZATION['@id'] },
          areaServed: [
            { '@type': 'State', name: 'Tamil Nadu' },
            { '@type': 'Country', name: 'India' },
          ],
        },
        {
          '@type': 'FAQPage',
          mainEntity: service.faqs.map(([question, answer]) => ({
            '@type': 'Question',
            name: question,
            acceptedAnswer: { '@type': 'Answer', text: answer },
          })),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: DEFAULT_SITE_NAME, item: structuredUrl('/') },
            { '@type': 'ListItem', position: 2, name: service.name, item: url },
          ],
        },
        ORGANIZATION,
      ],
    },
  }
}

// Per-industry page under /solutions/:businessId (business comes from prototypes/catalog).
export const solutionSeo = (business) => ({
  title: `${business.name} Website & App Development | GLOARO`,
  description: `${business.tagline}. Explore live ${business.name.toLowerCase()} website and app prototypes by GLOARO Tech, then get a custom build for your business.`,
  canonical: `/solutions/${business.id}`,
})

// The marketplace currently holds seed/demo vendors and products only. Keep its
// listing pages out of search until real vendors are live, then flip to true.
export const MARKETPLACE_INDEXABLE = false
const marketplacePaths = ['/vendors', '/products', '/services', '/categories', '/nearby']

export const noindex = [
  ...(MARKETPLACE_INDEXABLE ? [] : marketplacePaths),
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
  // Demo sites and utility steps: keep them out of search results.
  '/prototypes',
  '/membership-qualification',
  '/membership-application/track',
  '/membership-applications',
]

export const publicRoutes = [
  {
    pattern: '/',
    title: 'GLOARO Tech | Custom Software, Web, Mobile & AI Development',
    description:
      'GLOARO builds custom software, websites, mobile apps, SaaS products, CRM/ERP automation and AI solutions for growing businesses — plus Gloaro Mart and the Gloaro Network.',
    keywords:
      'GLOARO Tech, custom software development, website development, mobile app development, SaaS development, CRM ERP automation, UI UX design, AI automation, cloud DevOps, Gloaro Mart',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        ORGANIZATION,
        {
          '@type': 'WebSite',
          '@id': structuredUrl('/#website'),
          name: DEFAULT_SITE_NAME,
          url: structuredUrl('/'),
          inLanguage: 'en-IN',
          publisher: { '@id': ORGANIZATION['@id'] },
        },
      ],
    },
  },
  {
    pattern: '/network',
    title: 'Gloaro Network | Verified Business Network, Membership & Franchise',
    description: DEFAULT_DESCRIPTION,
    keywords: DEFAULT_KEYWORDS,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': structuredUrl('/network#webpage'),
          name: 'Gloaro Network',
          url: structuredUrl('/network'),
          description: DEFAULT_DESCRIPTION,
          inLanguage: 'en-IN',
          isPartOf: { '@type': 'WebSite', name: DEFAULT_SITE_NAME, url: DEFAULT_SITE_URL },
        },
      ],
    },
  },
  {
    pattern: '/mart',
    title: 'GLOARO MART | B2B & B2C Digital Marketplace',
    description:
      'GLOARO MART is a B2B and B2C marketplace connecting customers, vendors, retailers and local businesses. Shop nearby stores, search smarter, and sell online on web and mobile.',
    keywords: 'GLOARO MART, B2B marketplace, B2C marketplace, multi-vendor marketplace, local vendors, online store for businesses, India',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': structuredUrl('/mart#webpage'),
          name: 'GLOARO MART | B2B & B2C Digital Marketplace',
          url: structuredUrl('/mart'),
          description:
            'GLOARO MART is a B2B and B2C marketplace connecting customers, vendors, retailers and local businesses on web and mobile.',
          inLanguage: 'en-IN',
          isPartOf: { '@type': 'WebSite', name: DEFAULT_SITE_NAME, url: DEFAULT_SITE_URL },
          about: { '@id': structuredUrl('/mart#store') },
        },
        {
          '@type': 'OnlineStore',
          '@id': structuredUrl('/mart#store'),
          name: 'GLOARO MART',
          url: structuredUrl('/mart'),
          logo: structuredUrl('/logo.png'),
          description: 'A multi-vendor B2B and B2C marketplace by GLOARO.',
          parentOrganization: { '@type': 'Organization', name: DEFAULT_SITE_NAME, url: DEFAULT_SITE_URL },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: DEFAULT_SITE_NAME, item: DEFAULT_SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'GLOARO MART', item: structuredUrl('/mart') },
          ],
        },
      ],
    },
  },
  {
    pattern: '/solutions',
    title: 'Industry Website & App Solutions | GLOARO Tech',
    description:
      'Explore interactive website and app prototypes for restaurants, retail, healthcare, real estate, logistics, POS billing and more — and see what GLOARO can build for your business.',
    keywords: 'industry software solutions, restaurant website, hospital management software, real estate website, POS billing software, logistics app, GLOARO Tech',
  },
  {
    pattern: '/contact',
    title: 'Contact GLOARO | Get a Quote for Your Website, App or Software',
    description:
      'Tell GLOARO about your business and get a quote for a custom website, mobile app, SaaS product or business software. Our team will get back to you.',
    keywords: 'contact GLOARO, software development quote, website development quote, app development company India',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'ContactPage', url: structuredUrl('/contact'), inLanguage: 'en-IN', about: { '@id': ORGANIZATION['@id'] } },
        ORGANIZATION,
      ],
    },
  },
  {
    pattern: '/about',
    title: 'About GLOARO | Verified Business Network in India',
    description:
      'Learn how GLOARO connects entrepreneurs through verified membership, referrals, business services, marketplace tools, and a professional growth community.',
    keywords: 'about GLOARO, business networking, verified entrepreneurs, membership community, marketplace platform',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'AboutPage', url: structuredUrl('/about'), inLanguage: 'en-IN', about: { '@id': ORGANIZATION['@id'] } },
        ORGANIZATION,
      ],
    },
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

export const getRouteConfig = (pathname = '/') => {
  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '')
  const isNoIndex = noindex.some((prefix) => normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`))

  const matchedPublicRoute = publicRoutes.find((route) => matchPath({ path: route.pattern, end: true }, normalizedPath))
  if (matchedPublicRoute) {
    return {
      title: matchedPublicRoute.title,
      description: matchedPublicRoute.description,
      keywords: matchedPublicRoute.keywords,
      canonical: structuredUrl(normalizedPath),
      robots: isNoIndex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
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

  return {
    title: `${DEFAULT_SITE_NAME} | Secure Business Network`,
    description: DEFAULT_DESCRIPTION,
    keywords: DEFAULT_KEYWORDS,
    canonical: structuredUrl(normalizedPath),
    robots: isNoIndex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
    ogType: 'website',
  }
}
