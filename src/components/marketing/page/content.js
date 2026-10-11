import { BarChart3, Megaphone, MessagesSquare, Search, Share2 } from 'lucide-react'

// The ten services, grouped the way a business thinks about them. Each group
// explains what GloAro actually does and what the business receives; no
// results are promised (they depend on scope, budget and platform performance).
export const serviceGroups = [
  {
    id: 'social',
    Icon: Share2,
    accent: '#d6336c',
    label: 'Social media & content',
    title: 'Social media management and content creation',
    summary:
      'We plan a monthly content calendar around your offers, seasons and festivals, then design the posts, edit the Reels and manage your Instagram and Facebook pages so they stay active and on-brand.',
    includes: ['Social media management', 'Instagram & Facebook posts', 'Reels & video management', 'Content creation'],
    deliverables: ['Monthly content calendar for your approval', 'Designed posts, carousels and stories', 'Reels edited from your clips or our shoots', 'Captions, hashtags and scheduling', 'Comment and message monitoring'],
    visual: 'calendar',
  },
  {
    id: 'ads',
    Icon: Megaphone,
    accent: '#1b6fe0',
    label: 'Meta Ads',
    title: 'Meta Ads campaign planning and management',
    summary:
      'We set up and manage Facebook and Instagram ad campaigns: choosing the objective, defining the local audience, preparing creatives, setting the budget you approve and adjusting the campaign as real data comes in.',
    includes: ['Meta Ads planning', 'Audience targeting', 'Ad creatives', 'Budget management'],
    deliverables: ['Campaign objective and audience plan', 'Ad creatives in feed, story and Reel formats', 'Lead forms or WhatsApp click-to-chat setup', 'Budget pacing within the limit you set', 'Regular optimisation based on results'],
    visual: 'ads',
  },
  {
    id: 'search',
    Icon: Search,
    accent: '#188038',
    label: 'SEO & Google Business',
    title: 'Search engine optimisation and Google Business Profile',
    summary:
      'We make your business easier to find when people search nearby: a complete, accurate Google Business Profile, regular profile posts, and on-page SEO so your website pages match what customers search for.',
    includes: ['Search Engine Optimisation', 'Google Business Profile optimisation', 'Local search visibility'],
    deliverables: ['Google Business Profile audit and optimisation', 'Categories, services, photos and hours kept current', 'Profile posts and review-reply guidance', 'On-page SEO for key website pages', 'Search Console setup and monitoring'],
    visual: 'search',
  },
  {
    id: 'leads',
    Icon: MessagesSquare,
    accent: '#00a884',
    label: 'Leads & WhatsApp',
    title: 'Lead generation, landing pages and WhatsApp follow-up',
    summary:
      'Attention only matters if it turns into a conversation. We build focused landing pages and lead forms, connect them to WhatsApp Business with instant replies, and set up follow-up reminders so no enquiry goes cold.',
    includes: ['Lead generation & customer acquisition', 'WhatsApp Business automation', 'Website & landing-page optimisation'],
    deliverables: ['Campaign landing pages and lead forms', 'WhatsApp Business profile, catalogue and quick replies', 'Automated greeting and follow-up messages', 'Lead routing to your team', 'Website improvements that make enquiring easier'],
    visual: 'leads',
  },
  {
    id: 'brand',
    Icon: BarChart3,
    accent: '#CB9015',
    label: 'Brand & reporting',
    title: 'Brand awareness, reputation and performance reporting',
    summary:
      'We keep your brand consistent everywhere customers see you, help you respond to reviews professionally, and share a clear monthly report covering what was published, what it achieved and what we will improve next.',
    includes: ['Brand awareness', 'Online reputation building', 'Performance tracking & reporting'],
    deliverables: ['Consistent brand look across every channel', 'Review monitoring and reply templates', 'Monthly performance report', 'Review call with clear next steps', 'Tracking setup for calls, forms and WhatsApp clicks'],
    visual: 'report',
  },
]

export const workflow = [
  {
    title: 'Understand the business',
    text: 'We learn your industry, customers, service area, goals and current challenges, and review what you already have online.',
    output: 'A short brief we both agree on',
    visual: 'brief',
  },
  {
    title: 'Plan the strategy',
    text: 'We choose the right platforms, content formats and campaign objectives for your goals and budget.',
    output: 'Channel plan, content mix and monthly scope',
    visual: 'plan',
  },
  {
    title: 'Create the content',
    text: 'We prepare posts, Reels, ad creatives and landing pages, and share them with you for approval.',
    output: 'Approved creatives, ready to publish',
    visual: 'create',
  },
  {
    title: 'Launch the campaigns',
    text: 'We publish content and configure the approved campaigns in accounts owned by your business.',
    output: 'Live campaigns with tracking in place',
    visual: 'launch',
  },
  {
    title: 'Generate enquiries',
    text: 'Interested customers are guided to call, fill a form, visit your website or message you on WhatsApp.',
    output: 'Enquiries routed to your team',
    visual: 'enquiries',
  },
  {
    title: 'Measure and optimise',
    text: 'We review the real performance data each month and improve targeting, creatives and pages based on what works.',
    output: 'Monthly report and improvement plan',
    visual: 'measure',
  },
]
