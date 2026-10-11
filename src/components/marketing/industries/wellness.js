// Illustrative example: fictional wellness coach, licensed stock photography (media/CREDITS.md).
// No health, weight-loss or income claims, and no third-party brand names.
export default {
  id: 'wellness',
  label: 'Wellness & nutrition',
  status: 'example',
  accent: '#4c8c2b',
  brand: { name: 'Vitalroot Wellness', short: 'VR', location: 'Wellness club' },
  pitch: 'Community-led content that grows your club and keeps members engaged.',
  ideas: ['Lifestyle & wellness campaign creatives', 'Product or service awareness content', 'Monthly social media content planning', 'Compliant claims, authorised brand assets only'],
  note: 'We only use brand assets you are authorised to use, and never publish medical, weight-loss or income claims.',
  whatsapp: 'Hi GloAro, I run a nutrition / wellness business and would like to discuss digital marketing.',
  scenes: [
    {
      type: 'social-post',
      step: 'Community post',
      image: 'wellness/post.webp',
      alt: 'A colourful salad bowl with vegetables and chickpeas',
      caption: 'Colour on your plate 🌿 Join our 7-day healthy habits challenge.',
      tags: ['#HealthyHabits', '#Wellness'],
    },
    {
      type: 'reel',
      step: 'Coaching video',
      poster: 'wellness/reel.webp',
      alt: 'A person stretching at sunrise by the sea',
      headline: 'Small habits, every day',
      sub: 'Coaching · Meal planning · Community',
      cta: 'Join the challenge',
    },
    {
      type: 'search',
      step: 'Local search',
      query: 'wellness coach near me',
      alt: 'Vitalroot Wellness in local search results with call and directions buttons',
      category: 'Wellness centre',
      hours: 'Open · Closes 8 pm',
      snippet: 'Morning sessions, habit coaching and meal-planning support. Message to join this week’s group.',
      url: 'vitalroot.example',
    },
    {
      type: 'enquiry',
      step: 'Member enquiry',
      alt: 'A prospective member asks to join the 7-day challenge on WhatsApp',
      messages: [
        { from: 'customer', text: 'Hi, saw your 7-day challenge post. How do I join?' },
        { from: 'business', text: 'Welcome! It is a guided habits programme with daily check-ins. Shall I add you to this week’s group?' },
        { from: 'customer', text: 'Yes, add me 🙌' },
        { from: 'business', text: 'Done! Day 1 tips arrive tomorrow at 7 AM.' },
      ],
    },
  ],
}
