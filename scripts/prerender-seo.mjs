// Post-build step: writes one HTML file per public route with that route's title,
// description, canonical, Open Graph/Twitter tags and JSON-LD baked into <head>,
// so crawlers and link-preview bots (WhatsApp, LinkedIn, Facebook) that don't run
// JavaScript still see the right metadata. Also regenerates dist/sitemap.xml.
//
// The body is untouched: React still renders the page client-side, and <Seo />
// updates these same tags on navigation. Vercel serves dist/<route>.html at
// /<route> via `cleanUrls`; anything else falls back to index.html.
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

// Load the same modules the app uses (catalog imports images, so go through Vite).
const vite = await createServer({ root, logLevel: 'error', server: { middlewareMode: true }, appType: 'custom' })
let seo, catalog, tech
try {
  seo = await vite.ssrLoadModule('/src/lib/seoConfig.js')
  catalog = await vite.ssrLoadModule('/src/prototypes/catalog.js')
  tech = await vite.ssrLoadModule('/src/components/tech/serviceContent.js')
} finally {
  await vite.close()
}
const { DEFAULT_SITE_NAME, OG_IMAGE, getRouteConfig, publicRoutes, solutionSeo, structuredUrl, techServiceSeo } = seo

const escapeHtml = (value = '') =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Static public routes, plus one page per industry under /solutions.
const pages = publicRoutes
  .filter((route) => !route.pattern.includes(':'))
  .map((route) => ({ path: route.pattern, config: getRouteConfig(route.pattern) }))

for (const business of catalog.businesses) {
  const path = `/solutions/${business.id}`
  const { title, description } = solutionSeo(business)
  const base = getRouteConfig(path)
  pages.push({
    path,
    config: {
      ...base,
      title,
      description,
      schema: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: title,
        url: structuredUrl(path),
        description,
        isPartOf: { '@type': 'WebSite', name: DEFAULT_SITE_NAME, url: structuredUrl('/') },
      },
    },
  })
}

// Gloaro Tech service pages.
for (const service of tech.techServices) {
  const { canonical, ...rest } = techServiceSeo(service)
  pages.push({ path: canonical, config: { ...getRouteConfig(canonical), ...rest, canonical: structuredUrl(canonical) } })
}

const headTags = (config) => {
  const tags = [
    `<title>${escapeHtml(config.title)}</title>`,
    `<meta name="description" content="${escapeHtml(config.description)}" />`,
    `<meta name="robots" content="${escapeHtml(config.robots)}" />`,
    `<link rel="canonical" href="${escapeHtml(config.canonical)}" />`,
    `<meta property="og:site_name" content="${DEFAULT_SITE_NAME}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:type" content="${escapeHtml(config.ogType || 'website')}" />`,
    `<meta property="og:title" content="${escapeHtml(config.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(config.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(config.canonical)}" />`,
    `<meta property="og:image" content="${OG_IMAGE.url}" />`,
    `<meta property="og:image:width" content="${OG_IMAGE.width}" />`,
    `<meta property="og:image:height" content="${OG_IMAGE.height}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(OG_IMAGE.alt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(config.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(config.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE.url}" />`,
  ]
  if (config.schema) {
    // `<` escaped so a value can never close the script tag early.
    const json = JSON.stringify(config.schema).replace(/</g, '\\u003c')
    tags.push(`<script type="application/ld+json" data-seo="structured-data">${json}</script>`)
  }
  return tags.map((tag) => `    ${tag}`).join('\n')
}

// Strip the template's own SEO tags, then insert the route's tags before </head>.
const template = (await readFile(join(dist, 'index.html'), 'utf8'))
  .replace(/\s*<title>[\s\S]*?<\/title>/, '')
  .replace(/\s*<meta\s+(?:name|property)="(?:description|keywords|robots|og:[^"]+|twitter:[^"]+)"[^>]*>/g, '')
  .replace(/\s*<link\s+rel="canonical"[^>]*>/, '')

if (!template.includes('</head>')) throw new Error('prerender-seo: dist/index.html has no </head>')

const render = (config) => template.replace('</head>', `${headTags(config)}\n  </head>`)

for (const { path, config } of pages) {
  const file = path === '/' ? join(dist, 'index.html') : join(dist, `${path.slice(1)}.html`)
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, render(config))
}

// Sitemap: every prerendered page that isn't noindex.
const lastmod = new Date().toISOString().slice(0, 10)
const urls = pages
  .filter(({ config }) => !config.robots.startsWith('noindex'))
  .map(({ config }) => `  <url>\n    <loc>${escapeHtml(config.canonical)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
await writeFile(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
)

console.log(`prerender-seo: wrote ${pages.length} pages, ${urls.length} sitemap URLs`)
