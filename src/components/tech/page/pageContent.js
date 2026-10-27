// Extra copy for the interactive Gloaro Tech pages, keyed by service id.
// `highlight`: the one headline word that gets the gold shimmer.
// `chips`: short capability tags under the hero. `cards`: the two floating
// glass cards beside the 3D scene ([label, value]). `demo`: heading for the
// service's hands-on section. Facts only: no invented client counts or results.

export const pageContent = {
  ai: {
    highlight: 'hours',
    chips: ['LLM assistants', 'Document AI', 'Workflow automation'],
    cards: [['Assistant', 'Grounded in your data'], ['Hand-off', 'To a human when needed']],
    demo: { eyebrow: 'Try it', title: 'Watch an assistant answer from your own data', highlight: 'data', text: 'Ask a sample question. The assistant looks up approved business information, answers, and passes complex requests to your team.' },
  },
  web: {
    highlight: 'enquiries',
    chips: ['Mobile-first', 'SEO-ready', 'Fast Core Web Vitals'],
    // The web showcase scene draws its own annotations; the poster is a
    // rendered still of it for loading and no-WebGL / reduced-motion visitors.
    cards: null,
    poster: '/tech/web-showcase.webp',
    posterFit: 'contain', // transparent still: keep both devices whole on any frame
    demo: { eyebrow: 'Try it', title: 'One website, every screen size', highlight: 'screen', text: 'Switch devices and themes to see how one responsive build adapts, and how page speed checks are part of every release.' },
  },
  mobile: {
    highlight: 'pocket',
    chips: ['Android + iOS', 'One codebase', 'Admin panel included'],
    cards: [['Platforms', 'Android & iOS'], ['Launch', 'Play Store & App Store']],
    demo: { eyebrow: 'Try it', title: 'Tap through a sample ordering app', highlight: 'app', text: 'Browse, add to cart and track an order, the same flow we build for food, retail and delivery businesses.' },
  },
  software: {
    highlight: 'actually',
    chips: ['Your workflow', 'Role-based access', 'Live dashboards'],
    cards: [['Replaces', 'Spreadsheets & paper'], ['Access', 'Per role, with audit trail']],
    demo: { eyebrow: 'Try it', title: 'From messy spreadsheet to a working system', highlight: 'system', text: 'Flip the switch to see the same billing and stock data turned into a structured system with approvals and live totals.' },
  },
  saas: {
    highlight: 'scales',
    chips: ['MVP first', 'Multi-tenant', 'Subscriptions & billing'],
    // The SaaS engine scene draws its own annotations; the poster is a rendered
    // still of it for loading and no-WebGL / reduced-motion visitors.
    cards: null,
    poster: '/tech/saas-engine.webp',
    demo: { eyebrow: 'Try it', title: 'Plans, tenants and usage in one product', highlight: 'product', text: 'Switch pricing plans and add a tenant to see how a well-structured SaaS isolates data and unlocks features per plan.' },
  },
  crm: {
    highlight: 'operations',
    chips: ['Lead pipeline', 'ERP modules', 'WhatsApp automation'],
    cards: [['Follow-ups', 'Sent automatically'], ['Modules', 'Add as you grow']],
    demo: { eyebrow: 'Try it', title: 'Move a lead through the pipeline', highlight: 'pipeline', text: 'Advance a lead stage by stage and watch the automations that fire along the way: reminders, quotations and notifications.' },
  },
  design: {
    highlight: 'easy',
    chips: ['Research & flows', 'Clickable prototypes', 'Design systems'],
    cards: [['Review', 'Before any code'], ['Delivered as', 'Figma + prototype']],
    demo: { eyebrow: 'Try it', title: 'Drag from wireframe to finished screen', highlight: 'screen', text: 'Slide to compare the same screen at the wireframe and high-fidelity stages, then switch the theme the design system drives.' },
  },
  cloud: {
    highlight: 'secure',
    chips: ['CI/CD pipelines', 'Monitoring & alerts', 'Backups & recovery'],
    cards: [['Deploys', 'Automated & tested'], ['Hosting', 'On your own account']],
    demo: { eyebrow: 'Try it', title: 'Ship a release through the pipeline', highlight: 'pipeline', text: 'Run a sample deployment: build, test, deploy and health checks, with a rollback ready if something fails.' },
  },
}
