const aboutData = {
  overview: [
    'GLOARO Digital Network is built as a verified business ecosystem where entrepreneurs, professionals, and growth-focused teams can connect through trust, referrals, and structured collaboration.',
    'Our platform combines networking, community participation, digital visibility, and business support so members can build lasting relationships and unlock qualified opportunities inside one unified network.',
    'From local chapter activity to wider district and digital growth programs, GLOARO is designed to help businesses grow with confidence, clarity, and shared momentum.',
  ],
  vision: 'To become India\'s most trusted digital business ecosystem where every entrepreneur can connect, collaborate, and grow together.',
  mission: 'To empower verified business owners and professionals with structured networking, trusted referrals, digital growth services, technology solutions, training, and leadership opportunities that create measurable business outcomes.',
  coreValues: [
    {
      icon: 'shield',
      title: 'Trust & Verification',
      description: 'Every connection begins with a verified business profile and a community built on credibility.',
    },
    {
      icon: 'trending-up',
      title: 'Sustainable Growth',
      description: 'We focus on long-term business momentum, not short-term visibility alone.',
    },
    {
      icon: 'zap',
      title: 'Fast Opportunities',
      description: 'Members can quickly discover referrals, partnerships, and business conversations that matter.',
    },
    {
      icon: 'check-circle',
      title: 'Accountability',
      description: 'Structured meetings and community standards keep participation meaningful and consistent.',
    },
    {
      icon: 'award',
      title: 'Recognition',
      description: 'We celebrate contribution, leadership, and achievement across the network.',
    },
    {
      icon: 'users',
      title: 'Collaboration',
      description: 'Business growth becomes stronger when members actively support one another.',
    },
    {
      icon: 'star',
      title: 'Premium Experience',
      description: 'From digital support to marketplace visibility, the ecosystem is designed for quality.',
    },
    {
      icon: 'globe',
      title: 'Global Mindset',
      description: 'The roadmap includes regional, national, and international business expansion.',
    },
  ],
  founderMessage: {
    title: 'A Message from the Founder',
    paragraphs: [
      'Our vision is to unite entrepreneurs, technology, referrals, leadership, and innovation under one powerful platform that enables every member to grow with confidence.',
      'Every meeting, every referral, every partnership, and every success story strengthens our community. Together, we are creating a business ecosystem built on trust, collaboration, and shared growth.',
      'As we expand across India, we invite every entrepreneur to become part of this journey and contribute to building a stronger, more connected business future.',
    ],
    quote: 'Together, We Give. We Grow. We Win Together.',
    signature: 'Founder, Gloaro Digital Network',
  },
  leadershipMessage: {
    title: 'Message from the Leadership Team',
    paragraphs: [
      'At GLOARO Digital Network, leadership means creating opportunities for others to succeed.',
      'As we expand across India and beyond, we remain dedicated to delivering value to every member, franchise partner, business owner, and stakeholder who joins the GLOARO ecosystem.',
      'Together, we are building a future where businesses connect with purpose, grow with confidence, and lead with integrity.',
    ],
  },
}

const servicesData = {
  title: 'Professional Services That Drive Business Growth',
  introduction: 'Explore the range of business, networking, technology, and growth services offered through the GLOARO Digital Network ecosystem.',
  services: [
    {
      icon: 'handshake',
      title: 'Business Referrals',
      description: 'Verified, trust-based referral engine that helps members generate quality business opportunities through structured networking and long-term professional relationships.',
    },
    {
      icon: 'users',
      title: 'B2B Networking',
      description: 'Connect with verified entrepreneurs, business owners, and industry professionals through structured B2B networking that fosters meaningful collaborations, strategic partnerships, and long-term business opportunities.',
    },
    {
      icon: 'mentorship',
      title: 'Business Mentorship',
      description: 'Gain guidance from experienced business leaders and industry experts through mentorship programs designed to accelerate business growth, strengthen leadership skills, and support informed decision-making.',
    },
    {
      icon: 'training',
      title: 'Workshops & Training',
      description: 'Participate in business training sessions, community learning programs, and industry events designed to support continuous professional and business development.',
    },
    {
      icon: 'events',
      title: 'Events',
      description: 'Join structured referral meetings, business expos, trade events, networking programs, and industry gatherings that create valuable business connections.',
    },
    {
      icon: 'promotion',
      title: 'Digital Promotion',
      description: 'Enhance your business visibility through digital marketing support, social media promotion, business listings, website support, and mobile application services.',
    },
    // {
    //   icon: 'consulting',
    //   title: 'Consulting',
    //   description: 'Get practical guidance on strategy, growth planning, and digital presence to help your business scale.',
    // },
  ],
}

const whyChooseData = {
  title: 'A complete ecosystem for verified business growth.',
  description: 'GLOARO brings networking, referrals, digital services, events, leadership, and marketplace visibility together so members can grow through one connected platform.',
  strengths: [
    {
      title: 'Trust-Based Membership',
      description: 'A verified, trusted community of serious business professionals',
    },
    {
      title: 'Verified Business Community',
      description: 'Only credible, authenticated businesses participate in the network',
    },
    {
      title: 'Digital & Physical Networking',
      description: 'Blended approach combining online platforms with in-person chapter meetings',
    },
    {
      title: 'Leadership Ecosystem',
      description: 'A structured multi-tier leadership model driving accountability at every level',
    },
    {
      title: 'Marketplace Integration',
      description: 'GLOARO Mart and B2B tools embedded directly into the member journey',
    },
    {
      title: 'Franchise Scalability',
      description: 'Entrepreneur-centric model enabling rapid, sustainable nationwide growth',
    },
  ],
  investment: {
    fee: 30000,
    gst: 5400,
    includes: [
      'Referral Network',
      'Business Meetings',
      'Training',
      'Community',
      'Digital Support',
      'Business Promotion',
    ],
  },
}

const clone = (value) => JSON.parse(JSON.stringify(value))

export const fetchAboutData = async () => clone(aboutData)

export const fetchServicesData = async () => clone(servicesData)

export const fetchWhyChooseData = async () => clone(whyChooseData)
