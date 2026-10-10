// Long-form content for the Gloaro Tech service pages at /tech/:slug.
// Keyed by the service `id` in components/home/homeData.js. Plain data only (no
// JSX/icons) so scripts/prerender-seo.mjs can load it at build time.
//
// Keep claims factual: no invented client counts, prices or guarantees.

export const techServices = [
  {
    id: 'web',
    slug: 'website-development',
    name: 'Website Design & Development',
    metaTitle: 'Website Development Company in Tamil Nadu | GLOARO Tech',
    metaDescription:
      'GLOARO designs and builds fast, mobile-first, SEO-ready business websites and e-commerce stores for companies across Tamil Nadu and India. Get a free quote.',
    headline: 'Business websites that load fast, rank well and bring in enquiries',
    intro:
      'Your website is usually the first conversation a customer has with your business. GLOARO designs and builds websites on modern frameworks so they load quickly on mobile networks, are structured for search engines from day one, and make it easy for visitors to call, enquire or buy.',
    deliverables: [
      ['Corporate & business websites', 'Company profile, services, team and contact pages with a clear path to enquiry.'],
      ['E-commerce stores', 'Product catalogue, cart, online payments, order tracking and an admin panel to manage it all.'],
      ['Landing pages', 'Focused pages for campaigns and ads, built to convert visitors into leads.'],
      ['Technical SEO built in', 'Clean URLs, page titles, structured data, sitemaps and fast Core Web Vitals.'],
      ['CMS & admin panel', 'Update text, images, products and blog posts yourself without touching code.'],
      ['Redesign & migration', 'Modernise an existing site while keeping your search rankings and URLs intact.'],
    ],
    audiences: ['Retail shops & showrooms', 'Manufacturers & exporters', 'Clinics & hospitals', 'Schools & colleges', 'Real estate builders', 'Startups & SMEs'],
    tech: ['React', 'Next.js', 'Tailwind CSS', 'Node.js', 'Laravel', 'Vercel', 'Cloudflare'],
    faqs: [
      ['How long does it take to build a business website?', 'It depends on the number of pages and features. After a short requirement discussion we share a fixed scope and timeline before any work begins, so you know exactly what will be delivered and when.'],
      ['Will my website work well on mobile phones?', 'Yes. Every site is designed mobile-first and tested across phones, tablets and desktops, because most visitors in India browse on mobile.'],
      ['Is SEO included?', 'Technical SEO is built into every site: page titles and descriptions, structured data, sitemaps, clean URLs and fast loading. Ongoing content and link building can be planned separately.'],
      ['Can I update the website myself?', 'Yes. We can include an admin panel or CMS so you can edit content, images, products and blog posts without a developer.'],
      ['Do you work with businesses outside Tamil Nadu?', 'Yes. GLOARO is based in Kallakurichi, Tamil Nadu, and works with businesses across India through online meetings and shared project tracking.'],
    ],
  },
  {
    id: 'mobile',
    slug: 'mobile-app-development',
    name: 'Mobile App Development',
    metaTitle: 'Mobile App Development Company in Tamil Nadu | Android & iOS | GLOARO',
    metaDescription:
      'GLOARO builds Android and iOS mobile apps with Flutter and React Native — customer apps, delivery apps, booking apps and business apps for companies across India.',
    headline: 'Android and iOS apps that put your business in your customers’ pocket',
    intro:
      'A well-built app keeps customers coming back: they can order, book, track and pay in a few taps. GLOARO builds cross-platform mobile apps with Flutter and React Native, so one codebase runs on both Android and iOS, with an admin panel and backend to run the business side.',
    deliverables: [
      ['Customer & ordering apps', 'Catalogue, cart, payments, order tracking and push notifications.'],
      ['Booking & appointment apps', 'Slots, reminders and payments for clinics, salons, services and hospitality.'],
      ['Delivery & field-staff apps', 'Live location, route lists, proof of delivery and status updates.'],
      ['Business & internal apps', 'Attendance, sales tracking, inventory and approvals for your team on the go.'],
      ['Admin panel & backend', 'A web dashboard and API to manage users, content, orders and reports.'],
      ['Play Store & App Store launch', 'Store listings, release builds and publishing support.'],
    ],
    audiences: ['Restaurants & food brands', 'Retail & e-commerce', 'Logistics & delivery', 'Healthcare providers', 'Education', 'Service businesses'],
    tech: ['Flutter', 'React Native', 'Node.js', 'NestJS', 'PostgreSQL', 'Supabase', 'Google Cloud'],
    faqs: [
      ['Do you build for both Android and iOS?', 'Yes. We use Flutter or React Native so a single codebase runs on both platforms, which keeps development and maintenance cost lower than building two separate apps.'],
      ['Will I get an admin panel to manage the app?', 'Yes. Most apps include a web-based admin panel to manage users, orders, content and reports.'],
      ['Can you publish the app on the Play Store and App Store?', 'Yes. We prepare release builds and help publish under your own developer accounts so the app belongs to your business.'],
      ['Can you add features after launch?', 'Yes. We plan apps so new features can be added in later phases, and offer post-launch maintenance and support.'],
    ],
  },
  {
    id: 'software',
    slug: 'custom-software-development',
    name: 'Custom Software Development',
    metaTitle: 'Custom Software Development Company in India | GLOARO Tech',
    metaDescription:
      'Custom business software built around your workflow — billing, inventory, HR, operations and reporting systems for SMEs, manufacturers and growing companies in India.',
    headline: 'Software built around how your business actually works',
    intro:
      'Off-the-shelf tools force your team to work around their limits; spreadsheets break as you grow. GLOARO builds custom software that matches your exact workflow — from billing and inventory to approvals and reporting — and connects the systems you already use.',
    deliverables: [
      ['Workflow & operations systems', 'Replace spreadsheets and paper with a system that matches your process.'],
      ['Billing, inventory & POS', 'GST-ready billing, stock tracking and multi-branch counters.'],
      ['HR, attendance & payroll tools', 'Staff records, attendance, leave and payroll inputs in one place.'],
      ['Dashboards & reports', 'Live numbers for owners and managers instead of month-end surprises.'],
      ['Integrations', 'Connect payment gateways, SMS/WhatsApp, accounting and existing software.'],
      ['Role-based access', 'Each team member sees only what they need, with an audit trail.'],
    ],
    audiences: ['Manufacturers', 'Distributors & wholesalers', 'Retail chains', 'Service companies', 'Educational institutions', 'Corporate teams'],
    tech: ['React', 'Node.js', 'NestJS', 'Laravel', 'Python', 'PostgreSQL', 'MySQL', 'Docker'],
    faqs: [
      ['Why choose custom software over ready-made tools?', 'Ready-made tools suit generic needs. When your process is specific, custom software removes manual workarounds, fits your team’s way of working and grows with the business.'],
      ['Who owns the source code?', 'Ownership terms are agreed in writing before the project starts. Discuss your requirement with us and we will explain the options clearly.'],
      ['Can the software work across multiple branches?', 'Yes. Systems can be built as web applications accessible from any branch, with role-based access and central reporting.'],
      ['Do you provide support after delivery?', 'Yes. We offer maintenance, monitoring and enhancement support after the system goes live.'],
    ],
  },
  {
    id: 'saas',
    slug: 'saas-development',
    name: 'SaaS Product Development',
    metaTitle: 'SaaS Product Development Company in India | MVP to Scale | GLOARO',
    metaDescription:
      'GLOARO helps founders build SaaS products — from a focused MVP to a scalable multi-tenant platform with subscriptions, admin and analytics.',
    headline: 'From idea to MVP to a SaaS product that scales',
    intro:
      'Building a SaaS product means getting to market quickly without painting yourself into a corner. GLOARO scopes a focused MVP, ships it fast, and builds it on an architecture — multi-tenancy, subscriptions, roles and analytics — that can grow with your customer base.',
    deliverables: [
      ['MVP scoping & build', 'Identify the core features that prove the idea and ship them first.'],
      ['Multi-tenant architecture', 'Each customer’s data isolated, with shared infrastructure that scales.'],
      ['Subscriptions & billing', 'Plans, trials, payment gateway integration and invoices.'],
      ['Admin & customer dashboards', 'Manage tenants, users, usage and settings.'],
      ['Analytics & reporting', 'Track activation, usage and revenue.'],
      ['Cloud deployment & CI/CD', 'Automated testing and releases with monitoring.'],
    ],
    audiences: ['Startup founders', 'Businesses productising an internal tool', 'Agencies launching a product', 'Domain experts with a software idea'],
    tech: ['Next.js', 'React', 'NestJS', 'Node.js', 'PostgreSQL', 'Supabase', 'AWS', 'Docker', 'GitHub Actions'],
    faqs: [
      ['What is an MVP and why start there?', 'An MVP (minimum viable product) is the smallest version of your product that real customers can use. Starting there gets you feedback and revenue sooner and reduces the risk of building features nobody needs.'],
      ['Can the MVP grow into a full product?', 'Yes. We build the MVP on an architecture designed to scale, so later phases extend it instead of rewriting it.'],
      ['Do you handle hosting and deployment?', 'Yes. We set up cloud hosting, automated deployments and monitoring, on your own cloud account where preferred.'],
    ],
  },
  {
    id: 'crm',
    slug: 'crm-erp-development',
    name: 'CRM, ERP & Business Automation',
    metaTitle: 'CRM & ERP Software Development in India | Business Automation | GLOARO',
    metaDescription:
      'Custom CRM, ERP and business automation software — leads, sales pipeline, inventory, purchase, accounts and WhatsApp/SMS automation in one system.',
    headline: 'One system for leads, sales, operations and follow-ups',
    intro:
      'When leads sit in WhatsApp chats, stock lives in a spreadsheet and follow-ups depend on memory, growth gets expensive. GLOARO builds CRM and ERP systems tailored to your business, and automates the repetitive work so your team can focus on customers.',
    deliverables: [
      ['Lead & sales CRM', 'Capture leads from your website and ads, assign them, and track every follow-up.'],
      ['ERP modules', 'Purchase, inventory, production, sales and accounts connected in one place.'],
      ['WhatsApp, SMS & email automation', 'Reminders, quotations, payment follow-ups and notifications sent automatically.'],
      ['Customer & vendor portals', 'Let customers and suppliers check orders, invoices and status themselves.'],
      ['Reports & dashboards', 'Sales funnel, collections, stock and team performance at a glance.'],
      ['Data migration', 'Move existing data from spreadsheets or old software.'],
    ],
    audiences: ['Real estate', 'Manufacturing', 'Distribution & trading', 'Education & coaching', 'Healthcare', 'Service businesses'],
    tech: ['React', 'Node.js', 'NestJS', 'Laravel', 'PostgreSQL', 'MySQL', 'Python'],
    faqs: [
      ['Why build a custom CRM instead of using an existing one?', 'Existing CRMs are general-purpose and charge per user. A custom CRM matches your exact sales process and integrates with your other systems, without per-seat licence costs growing with your team.'],
      ['Can it send WhatsApp messages automatically?', 'Yes. We can integrate WhatsApp Business API, SMS and email for reminders, quotations and notifications.'],
      ['Can we start with CRM and add ERP modules later?', 'Yes. Systems are built in modules so you can start with what matters most and add more over time.'],
    ],
  },
  {
    id: 'ai',
    slug: 'ai-automation',
    name: 'AI & Intelligent Automation',
    metaTitle: 'AI Automation & Chatbot Development for Businesses | GLOARO Tech',
    metaDescription:
      'Practical AI for businesses — AI chatbots and assistants, lead scoring, document processing and workflow automation built with modern LLMs.',
    headline: 'Practical AI that saves your team hours every week',
    intro:
      'AI is most useful when it removes real, repetitive work. GLOARO builds AI features into your website, software and workflows — assistants that answer customer questions, tools that read and sort documents, and automations that move data between systems — using modern large language models.',
    deliverables: [
      ['AI chatbots & assistants', 'Answer customer questions on your website or WhatsApp using your own business information.'],
      ['Lead qualification & scoring', 'Prioritise enquiries so your sales team calls the right people first.'],
      ['Document processing', 'Extract data from invoices, forms and PDFs into your systems.'],
      ['Workflow automation', 'Connect your tools and automate multi-step processes.'],
      ['Internal knowledge assistants', 'Let staff search policies, manuals and records in plain language.'],
      ['AI features in existing software', 'Add summaries, smart search and suggestions to products you already run.'],
    ],
    audiences: ['Customer support teams', 'Sales teams', 'Operations & back office', 'SaaS products', 'Education', 'Healthcare administration'],
    tech: ['Claude', 'Google Gemini', 'LangChain', 'Python', 'Node.js', 'PostgreSQL'],
    faqs: [
      ['Is AI suitable for a small business?', 'Often, yes. Simple automations such as answering common questions or extracting invoice data can save hours each week. We start by identifying where AI genuinely helps before building anything.'],
      ['Will the chatbot give wrong answers?', 'We ground assistants in your own approved business information, set clear limits on what they answer, and hand over to a human when needed.'],
      ['Is our data safe?', 'We design AI features with data access controls and use providers whose terms suit business data. We will discuss data handling for your specific use case before starting.'],
    ],
  },
  {
    id: 'design',
    slug: 'ui-ux-design',
    name: 'UI/UX Design',
    metaTitle: 'UI/UX Design Services for Websites & Apps | GLOARO Tech',
    metaDescription:
      'UI/UX design for websites, mobile apps and SaaS products — user research, wireframes, high-fidelity designs, prototypes and design systems.',
    headline: 'Interfaces that are clear, consistent and easy to use',
    intro:
      'Good design is how users decide whether to trust your product. GLOARO’s design process turns your requirements into wireframes, high-fidelity screens and clickable prototypes you can test before development starts — so what gets built is what your users actually need.',
    deliverables: [
      ['User research & flows', 'Understand who your users are and map the journeys they take.'],
      ['Wireframes', 'Low-fidelity layouts to agree structure before visual design.'],
      ['High-fidelity UI design', 'Polished screens for web and mobile in your brand style.'],
      ['Clickable prototypes', 'Test the experience with real users before writing code.'],
      ['Design systems', 'Reusable components and guidelines that keep products consistent.'],
      ['UX audits', 'Review an existing product and fix what is confusing users.'],
    ],
    audiences: ['Startups', 'SaaS products', 'E-commerce', 'Enterprise software', 'Mobile apps'],
    tech: ['Figma', 'Design systems', 'Prototyping', 'Accessibility (WCAG)'],
    faqs: [
      ['Can you design only, without development?', 'Yes. We can deliver designs and prototypes for your own team to build, or take the project through to development.'],
      ['Will I see the design before development begins?', 'Yes. You review wireframes and clickable prototypes and approve them before development starts.'],
      ['Do you redesign existing apps and websites?', 'Yes. We can audit your current product and redesign it to improve usability and conversions.'],
    ],
  },
  {
    id: 'cloud',
    slug: 'cloud-devops',
    name: 'Cloud, DevOps & IT Solutions',
    metaTitle: 'Cloud & DevOps Services in India | AWS, Google Cloud | GLOARO Tech',
    metaDescription:
      'Cloud hosting, migration, CI/CD pipelines, monitoring and IT support on AWS, Google Cloud, Vercel and Cloudflare for reliable, secure applications.',
    headline: 'Reliable, secure infrastructure for your applications',
    intro:
      'Downtime and slow servers cost customers. GLOARO sets up and manages cloud infrastructure that keeps your websites and applications fast, secure and available — with automated deployments, backups and monitoring so problems are caught before your customers notice.',
    deliverables: [
      ['Cloud setup & migration', 'Move applications to AWS, Google Cloud or modern hosting platforms.'],
      ['CI/CD pipelines', 'Automated testing and deployment for every release.'],
      ['Monitoring & alerts', 'Uptime, performance and error monitoring with alerts.'],
      ['Backups & disaster recovery', 'Scheduled backups and a tested plan to restore.'],
      ['Security hardening', 'SSL, firewalls, access control and dependency updates.'],
      ['IT consulting', 'Advice on tools, infrastructure and cost optimisation.'],
    ],
    audiences: ['SaaS companies', 'E-commerce businesses', 'Growing SMEs', 'Teams with legacy servers'],
    tech: ['AWS', 'Google Cloud', 'Vercel', 'Cloudflare', 'Docker', 'GitHub Actions'],
    faqs: [
      ['Can you move our existing application to the cloud?', 'Yes. We plan migrations to minimise downtime and keep your data safe during the move.'],
      ['Will the infrastructure be in our own account?', 'We recommend hosting on accounts owned by your business, and can set this up for you.'],
      ['Do you provide ongoing support?', 'Yes. We offer monitoring, maintenance and support plans after setup.'],
    ],
  },
]

export const getTechService = (slug) => techServices.find((service) => service.slug === slug) || null
export const techServiceById = (id) => techServices.find((service) => service.id === id) || null
