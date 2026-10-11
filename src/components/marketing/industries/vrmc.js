// Client work, shown with permission. All copy and media come from Vinayaga
// Ready Mix Concrete's own published website (vinayagareadymixconcrete.com);
// no metrics are added. The search uses their brand name (not a ranking claim)
// and the WhatsApp enquiry is an illustrative conversation, labelled as such.
export default {
  id: 'vrmc',
  label: 'Construction & ready-mix',
  status: 'client',
  accent: '#e8501a',
  brand: {
    name: 'Vinayaga Ready Mix Concrete',
    short: 'VRMC',
    location: 'Kallakurichi, Tamil Nadu',
    logo: 'vrmc/logo.jpg',
    site: 'https://vinayagareadymixconcrete.com/',
  },
  pitch: 'Fleet stories, project proof and B2B quote requests from contractors and builders.',
  ideas: ['Mixer-truck and construction-site content', 'Completed-project showcases', 'Local SEO & Google Business Profile', 'B2B enquiries from contractors and builders'],
  whatsapp: 'Hi GloAro, I run a construction / building-materials business and saw the Vinayaga Ready Mix example. I would like to discuss digital marketing.',
  scenes: [
    {
      type: 'social-post',
      step: 'Fleet & brand story',
      image: 'vrmc/fleet-pooja.jpg',
      alt: 'A decorated Vinayaga Ready Mix truck with a team member at the plant',
      caption: 'Our fleet, ready to roll. Ready-mix concrete for residential, commercial and infrastructure projects across Kallakurichi District.',
      tags: ['#ReadyMixConcrete', '#Kallakurichi'],
    },
    {
      type: 'reel',
      step: 'Plant & fleet video',
      video: 'vrmc/truck-reel.mp4',
      poster: 'vrmc/truck-poster.jpg',
      alt: 'A transit mixer truck in front of the concrete batching plant',
      focus: '82% 50%',
      headline: 'Concrete that keeps your project moving.',
      sub: 'M5–M60 grades · Pump support where needed',
      cta: 'Get a quote',
      duration: 10,
    },
    {
      type: 'social-post',
      step: 'Project proof',
      image: 'vrmc/project-poster.webp',
      alt: 'Recently completed commercial buildings in Kallakurichi',
      fit: 'contain',
      caption: 'Recently completed: commercial sites in Kallakurichi, built with VRMC ready-mix.',
      tags: ['#Construction', '#TamilNadu'],
    },
    {
      type: 'search',
      step: 'Google Business Profile',
      query: 'vinayaga ready mix concrete',
      alt: 'Vinayaga Ready Mix Concrete business listing with call and directions buttons',
      category: 'Ready mix concrete supplier',
      hours: 'Kallakurichi · Ulundurpet',
      snippet: 'Reliable ready-mix concrete solutions for residential, commercial and infrastructure projects across Kallakurichi District.',
      url: 'vinayagareadymixconcrete.com',
    },
    {
      type: 'enquiry',
      step: 'Contractor quote request',
      alt: 'A contractor asks Vinayaga Ready Mix for an M25 concrete quote on WhatsApp',
      messages: [
        { from: 'customer', text: 'Hi, I need M25 concrete for a 1,200 sq.ft roof slab. Can you supply this Saturday?' },
        { from: 'business', text: 'Hello! Yes, we supply M5–M60 grades. Please share your site location.' },
        { from: 'customer', type: 'location', text: 'Site location' },
        { from: 'business', text: 'Thank you! Our team will call you with a quote shortly. Pump support is available where needed.' },
      ],
    },
  ],
}
