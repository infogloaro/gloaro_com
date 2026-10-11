import {
  Bot,
  Boxes,
  Briefcase,
  Building2,
  Cloud,
  Code2,
  Cpu,
  Factory,
  Globe,
  GraduationCap,
  Hotel,
  LayoutGrid,
  Megaphone,
  Palette,
  Rocket,
  Server,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Store,
  Workflow,
} from 'lucide-react'
import {
  SiClaude,
  SiCloudflare,
  SiDocker,
  SiFlutter,
  SiGithubactions,
  SiGooglecloud,
  SiGooglegemini,
  SiJavascript,
  SiLangchain,
  SiLaravel,
  SiMysql,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiVercel,
} from 'react-icons/si'
import { FaAws } from 'react-icons/fa'

// `id` picks the interface preview in the services showcase; `accent` tints it.
export const services = [
  { id: 'software', Icon: Code2, accent: '#08224B', title: 'Custom Software Development', short: 'Built around your workflow', description: 'Software engineered around your specific workflows instead of forcing your business into off-the-shelf limits.' },
  { id: 'design', Icon: Palette, accent: '#CB9015', title: 'UI/UX Design', short: 'Interfaces people enjoy', description: 'Wireframes and high-fidelity design systems built for seamless, intuitive user experiences.' },
  { id: 'web', Icon: Globe, accent: '#1b6fe0', title: 'Website Design & Development', short: 'Fast, SEO-ready websites', description: 'Fast, scalable websites built on modern frameworks, designed for performance, conversions and SEO.' },
  { id: 'mobile', Icon: Smartphone, accent: '#17a589', title: 'Mobile Application Development', short: 'iOS & Android apps', description: 'Native and cross-platform apps that bring your business to customers on iOS and Android.' },
  { id: 'saas', Icon: LayoutGrid, accent: '#6c4de6', title: 'SaaS Product Development', short: 'MVP to multi-tenant', description: 'End-to-end SaaS builds, from MVP to scalable multi-tenant product, for startups and growing teams.' },
  { id: 'ai', Icon: Bot, accent: '#CB9015', title: 'AI & Intelligent Automation', short: 'Assistants & smart workflows', description: 'AI-driven features — lead scoring, automated workflows, assistants — built on modern LLM tooling.' },
  { id: 'crm', Icon: Workflow, accent: '#e07b00', title: 'CRM, ERP & Business Automation', short: 'Operations in one place', description: 'CRM, ERP and automation tooling that streamlines operations and customer relationships.' },
  { id: 'cloud', Icon: Cloud, accent: '#0e7490', title: 'Cloud, DevOps & IT Solutions', short: 'Reliable infrastructure', description: 'Cloud architecture, CI/CD pipelines, infrastructure support and IT consulting for reliable scale.' },
  // Featured: wider card on the home grid and its own interactive page.
  { id: 'marketing', Icon: Megaphone, accent: '#d6336c', title: 'Digital Marketing', short: 'Social, ads, SEO & WhatsApp leads', description: 'Social media content, Reels, Meta Ads, SEO, Google Business Profile and WhatsApp follow-ups, planned and managed to turn local attention into enquiries.', featured: true, highlights: ['Social media & Reels', 'Meta Ads', 'SEO & Google Business', 'WhatsApp lead follow-up', 'Monthly reporting'] },
]

export const products = [
  {
    id: 'mart',
    Icon: ShoppingBag,
    title: 'Gloaro Mart',
    eyebrow: 'Marketplace',
    description: 'Our B2B and B2C marketplace connecting customers, vendors, retailers and local businesses on web and mobile.',
    points: ['Multi-vendor catalog & orders', 'Nearby discovery for local shops', 'Web storefront + mobile app'],
    action: 'Explore Gloaro Mart',
    href: '/mart',
    accent: '#ffae13',
  },
  {
    id: 'prototypes',
    Icon: Boxes,
    title: 'Industry Prototypes',
    eyebrow: 'Live demos',
    description: 'Clickable, production-style product prototypes across retail, healthcare, logistics, POS and more — see what your product could become.',
    points: ['Retail, healthcare, logistics, POS', 'Fully interactive, not screenshots', 'Request one tailored to you'],
    action: 'View Prototypes',
    href: '/solutions',
    accent: '#17a589',
  },
  {
    id: 'network',
    Icon: Building2,
    title: 'Gloaro Network',
    eyebrow: 'Community',
    description: 'Our verified business networking ecosystem — membership, connect meetings, franchise and community growth.',
    points: ['Verified member businesses', 'Chapters & connect meetings', 'Referral and franchise growth'],
    action: 'Explore the Network',
    href: '/network',
    accent: '#1b6fe0',
  },
]

export const industries = [
  { Icon: Store, title: 'Retail', accent: '#ff7a45', description: 'Storefronts, inventory and POS that keep online and in-store sales in sync, with CRM to bring customers back.', services: ['E-commerce', 'Inventory & POS', 'CRM & automation', 'Web development'], prototypeId: 'retail' },
  { Icon: Factory, title: 'Manufacturing', accent: '#1b6fe0', description: 'Automation and custom software that replace spreadsheets on the shop floor and connect sales to production.', services: ['Business automation', 'Custom software', 'CRM & automation', 'Cloud & IT'] },
  { Icon: Building2, title: 'Real Estate', accent: '#17a589', description: 'Lead capture, listing sites and CRM pipelines that follow a buyer from first enquiry to handover.', services: ['CRM & automation', 'Web development', 'Mobile apps', 'Cloud & IT'], prototypeId: 'realestate' },
  { Icon: Hotel, title: 'Hospitality', accent: '#e0407a', description: 'Booking-ready websites, guest apps and back-office tools for hotels, resorts and travel businesses.', services: ['Web development', 'Mobile apps', 'CRM & automation', 'Cloud & IT'], prototypeId: 'hospitality' },
  { Icon: Rocket, title: 'Startups', accent: '#7c5cff', description: 'MVPs scoped tightly, shipped fast and built on architecture that survives the next funding round.', services: ['MVP development', 'Web & mobile apps', 'SaaS architecture', 'Cloud & IT'] },
  { Icon: Briefcase, title: 'SMEs', accent: '#ffae13', description: 'Practical tools for growing teams: a better website, a working CRM and automation for the repetitive work.', services: ['CRM & automation', 'Web development', 'Cloud & IT', 'Business consulting'] },
  { Icon: GraduationCap, title: 'Corporate', accent: '#0d4697', description: 'Internal platforms for HR, workflows and reporting, integrated with the systems you already run.', services: ['Software development', 'HR & workflow systems', 'CRM & automation', 'Cloud & IT'] },
]

export const techStack = [
  ['Frontend', [['React', SiReact, '#61dafb'], ['Next.js', SiNextdotjs, '#ffffff'], ['JavaScript', SiJavascript, '#f7df1e'], ['Tailwind CSS', SiTailwindcss, '#38bdf8']]],
  ['Backend', [['Node.js', SiNodedotjs, '#5fa04e'], ['NestJS', SiNestjs, '#e0234e'], ['Laravel', SiLaravel, '#ff2d20']]],
  ['AI & Automation', [['Claude', SiClaude, '#d97757'], ['Google Gemini', SiGooglegemini, '#8e75ff'], ['LangChain', SiLangchain, '#7fc8a9'], ['Python', SiPython, '#ffd43b']]],
  ['Mobile', [['Flutter', SiFlutter, '#54c5f8'], ['React Native', SiReact, '#61dafb']]],
  ['Database', [['PostgreSQL', SiPostgresql, '#699eca'], ['MySQL', SiMysql, '#4479a1'], ['Supabase', SiSupabase, '#3ecf8e']]],
  ['Cloud & DevOps', [['Vercel', SiVercel, '#ffffff'], ['AWS', FaAws, '#ff9900'], ['Google Cloud', SiGooglecloud, '#4285f4'], ['Cloudflare', SiCloudflare, '#f38020'], ['Docker', SiDocker, '#2496ed'], ['GitHub Actions', SiGithubactions, '#2088ff']]],
]

export const allTech = techStack.flatMap(([, items]) => items)

export const processSteps = [
  ['01', 'Requirement Analysis', 'Understanding business goals, users and technical constraints.'],
  ['02', 'Planning', 'Mapping architecture, timelines and measurable milestones.'],
  ['03', 'UI/UX Design', 'Wireframes and high-fidelity designs for seamless interactions.'],
  ['04', 'Development', 'Clean, scalable code reviewed and tested in structured sprints.'],
  ['05', 'Testing', 'Stress-testing across devices and browsers before production.'],
  ['06', 'Deployment', 'Zero-downtime pipelines with monitoring and rollback safety.'],
  ['07', 'Maintenance', 'Post-launch performance monitoring and ongoing support.'],
]

export const whyChoose = [
  [Sparkles, 'Customer-Focused Solutions', 'Every build starts with your workflow, not a template.', 'photo-1542744173-8e7e53415bb0'],
  [Cpu, 'Innovative Technology', 'Modern frameworks and AI tooling applied where they genuinely help.', 'photo-1518770660439-4636190af475'],
  [LayoutGrid, 'Scalable Platforms', 'Architecture designed to grow with your business, not against it.', 'photo-1551288049-bebda4e38f71'],
  [Globe, 'Professional Networking Ecosystem', 'Backed by the Gloaro Network of verified entrepreneurs and partners.', 'photo-1517245386807-bb43f82c33c4'],
  [ShieldCheck, 'Reliable Service & Quality Standards', 'Structured sprints, testing and monitoring on every project.', 'photo-1461749280684-dccba630e2f6'],
  [Server, 'Trust & Transparency', 'Clear scoping, clear timelines, clear communication.', 'photo-1450101499163-c8848c66ca85'],
]

export const heroStats = [
  [String(services.length), 'Core services'],
  [String(industries.length), 'Industries served'],
  [String(processSteps.length), 'Step delivery process'],
  [`${allTech.length}+`, 'Technologies'],
]

export const serviceRotator = ['Websites', 'Mobile Apps', 'SaaS', 'AI Automation']
