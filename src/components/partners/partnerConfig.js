// Single source for GLOARO Partnerships copy and every business value that still
// needs management approval. Anything commercial (investment, commission,
// territory rights, support scope, review time) stays `PENDING` until the
// company confirms it — the UI renders PENDING values as amber placeholder chips.
// Franchise and Channel Partner are deliberately kept as separate objects.

export const PENDING = '[Pending management approval]'

export const isPending = (value) => value == null || value === PENDING

// Approved business details. Replace PENDING with the confirmed wording.
export const approved = {
  franchiseInvestment: PENDING,
  franchiseEligibility: PENDING,
  franchiseTerritory: PENDING,
  franchiseSupportScope: PENDING,
  channelCommission: PENDING,
  channelPaymentTerms: PENDING,
  reviewTimeframe: PENDING,
  contactEmail: PENDING,
}

// Set VITE_PARTNERSHIP_API_ENABLED=true only once the backend endpoints exist
// and really persist applications. Until then the forms cannot be submitted.
export const PARTNERSHIP_API_ENABLED = import.meta.env?.VITE_PARTNERSHIP_API_ENABLED === 'true'

export const paths = {
  franchise: {
    key: 'franchise',
    type: 'FRANCHISE',
    name: 'GLOARO Franchise Partner',
    short: 'Franchise',
    href: '/partners/franchise',
    applyHref: '/partners/franchise/apply',
    applyLabel: 'Apply for Franchise',
    exploreLabel: 'Explore Franchise',
    tagline: 'Run your own GLOARO technology business in your area.',
    mood: 'Build and operate',
    points: ['Best for entrepreneurs and business owners', 'You build a local team and customer base', 'You run the business day to day'],
  },
  channel: {
    key: 'channel',
    type: 'CHANNEL_PARTNER',
    name: 'GLOARO Channel Partner',
    short: 'Channel Partner',
    href: '/partners/channel-partner',
    applyHref: '/partners/channel-partner/apply',
    applyLabel: 'Apply as Channel Partner',
    exploreLabel: 'Become a Channel Partner',
    tagline: 'Introduce businesses to GLOARO. We handle delivery.',
    mood: 'Connect and refer',
    points: ['Best for consultants, agencies and freelancers', 'Use the network you already have', 'Designed to work alongside your current work'],
  },
}

// Services the GLOARO site already publishes (see components/tech/serviceContent).
export const services = [
  { id: 'school', name: 'School Management', note: 'Admissions, attendance, fees and parent updates.', demo: true },
  { id: 'hospital', name: 'Hospital Management', note: 'Patients, appointments, billing and pharmacy.', demo: true },
  { id: 'crm', name: 'CRM & ERP', note: 'Leads, sales pipeline, inventory and reports.', demo: true },
  { id: 'web', name: 'Website Development', href: '/tech/website-development' },
  { id: 'mobile', name: 'Mobile Apps', href: '/tech/mobile-app-development' },
  { id: 'custom', name: 'Custom Software', href: '/tech/custom-software-development' },
  { id: 'saas', name: 'SaaS', href: '/tech/saas-development' },
  { id: 'ai', name: 'AI & Automation', href: '/tech/ai-automation' },
  { id: 'uiux', name: 'UI/UX Design', href: '/tech/ui-ux-design' },
  { id: 'cloud', name: 'Cloud & DevOps', href: '/tech/cloud-devops' },
  { id: 'marketing', name: 'Digital Marketing', href: '/tech/digital-marketing' },
]

export const serviceOptions = [
  'School Management',
  'Hospital Management',
  'CRM & ERP',
  'Websites & Mobile Apps',
  'Custom Software & SaaS',
  'AI & Automation',
  'Digital Marketing',
]

export const comparison = [
  ['Your role', 'Run a local GLOARO business', 'Introduce business opportunities'],
  ['Time commitment', 'You run it day to day', 'Flexible, alongside your work'],
  ['Who sells', 'You and your team', 'You introduce, GLOARO takes it forward'],
  ['Who delivers the software', 'GLOARO', 'GLOARO'],
  ['Team needed', 'Yes, a local team', 'No'],
  ['Commercial terms', PENDING, PENDING],
]

export const howItWorks = {
  franchise: [
    ['Apply', 'Tell us about you and your market.'],
    ['Review and discussion', 'Our team reviews your fit and talks it through.'],
    ['Agreement, if approved', 'Terms are set in a signed agreement.'],
    ['Onboarding and launch', 'Set up and open for business.'],
  ],
  channel: [
    ['Apply', 'Share your background and network.'],
    ['Get approved', 'Agree terms and learn the portfolio.'],
    ['Introduce an opportunity', 'Submit a business that needs our solutions.'],
    ['GLOARO takes it forward', 'We review, meet the customer and deliver.'],
  ],
}

export const fitQuestions = [
  {
    id: 'office',
    question: 'Do you want to run your own GLOARO office?',
    answers: [
      { label: 'Yes, my own office', lean: 'franchise' },
      { label: 'No, I would rather introduce clients', lean: 'channel' },
    ],
  },
  {
    id: 'time',
    question: 'How do you want to work with GLOARO?',
    answers: [
      { label: 'As my main business', lean: 'franchise' },
      { label: 'Alongside my current work', lean: 'channel' },
    ],
  },
  {
    id: 'bring',
    question: 'What do you already have?',
    answers: [
      { label: 'Time to build a local team', lean: 'franchise' },
      { label: 'A network of business contacts', lean: 'channel' },
    ],
  },
]

export const landingFaqs = [
  ['Can I apply for both?', 'Yes. Each path has its own application, and our team reviews them separately.'],
  ['Do I need a technical background?', 'No. GLOARO builds and delivers the software.'],
  ['What happens after I apply?', 'You get a reference number and our team reviews your application.'],
  ['What does it cost?', PENDING],
]

export const franchise = {
  profiles: [
    ['Entrepreneurs', 'Ready to start and lead a local technology business.'],
    ['Business owners', 'Looking to add technology services to an existing business.'],
    ['Tech professionals', 'Experienced in IT and ready to run their own operation.'],
    ['Local operators', 'Well connected with schools, clinics and businesses nearby.'],
  ],
  gloaroProvides: [
    'Approved product and service portfolio',
    'Software build, delivery and updates',
    'Brand and sales materials',
    'Onboarding and product training',
  ],
  youProvide: [
    'Local business development',
    'Customer relationships and follow-up',
    'Your office set-up and local team',
    'Following GLOARO brand standards',
  ],
  readiness: [
    'I want to run a business as my main work',
    'I have sales or business experience',
    'I can set up a local office and team',
    'I know businesses, schools or clinics in my area',
    'I can plan for the required investment once it is confirmed',
  ],
  journey: [
    ['Explore', 'Read about the model and decide if it fits.'],
    ['Apply', 'Five short steps, saved as you go.'],
    ['Initial review', 'The partnerships team reviews your application.'],
    ['Discussion and due diligence', 'We talk through your market and plans together.'],
    ['Agreement, if approved', 'All terms are set in a signed franchise agreement.'],
    ['Onboarding', 'Product, sales and process onboarding.'],
    ['Business launch', 'You open for business in your area.'],
  ],
  faqs: [
    ['Do I need to write software?', 'No. GLOARO builds and delivers the software. You focus on customers and your local team.'],
    ['Is my territory exclusive?', 'Only if the signed franchise agreement says so. Territory rights are not promised on this page.'],
    ['What investment is required?', PENDING],
    ['How long does review take?', PENDING],
    ['What support will I get?', PENDING],
  ],
}

export const channel = {
  partnerTypes: [
    'IT consultants',
    'Software consultants',
    'Digital agencies',
    'Freelancers',
    'Business consultants',
    'Networking professionals',
    'Accountants and advisors',
  ],
  introduce: [
    ['School Management', 'For schools and colleges'],
    ['Hospital Management', 'For clinics and hospitals'],
    ['CRM & ERP', 'For growing businesses'],
    ['Websites & Mobile Apps', 'For any business going online'],
    ['Custom Software & SaaS', 'For specific workflows'],
    ['Digital Marketing', 'SEO, social and campaigns'],
  ],
  flow: [
    ['You', 'Spot a business need'],
    ['Business prospect', 'Introduce them'],
    ['Qualified opportunity', 'Need, budget, timing'],
    ['GLOARO review', 'We assess fit'],
    ['Customer discussion', 'We meet and propose'],
    ['Outcome', 'Shared with you'],
  ],
  // Rows: who. Columns: Refer / Qualify / Close.
  roles: {
    columns: ['Refer a lead', 'Qualify an opportunity', 'Close the sale'],
    rows: [
      ['You', 'Share contact and need', 'Confirm need, budget, timing', 'Only if permitted by agreement'],
      ['GLOARO', 'Review and contact', 'Proposal and demo', 'Contract and delivery'],
      ['Customer', 'Agrees to be contacted', 'Shares requirements', 'Signs with GLOARO'],
    ],
  },
  trackerRows: [
    ['Example school', 'School Management', 'Under review'],
    ['Example clinic', 'Hospital Management', 'In discussion'],
    ['Example retailer', 'CRM & ERP', 'Proposal'],
  ],
  faqs: [
    ['Do I have to sell?', 'No. You introduce the opportunity. GLOARO handles the proposal, sale and delivery.'],
    ['Can I keep my current job?', 'Yes. The Channel Partner path is designed to work alongside your existing work.'],
    ['How will I know what happened to my referral?', 'The GLOARO team shares progress with you as described in your agreement.'],
    ['How is commission calculated?', PENDING],
    ['When and how are payments made?', PENDING],
  ],
}
