// Illustrative example: fictional clinic, licensed stock photography (media/CREDITS.md).
// Healthcare marketing stays informational: no outcome claims, no patient images
// or testimonials, and ads follow Meta and Google healthcare policies.
export default {
  id: 'healthcare',
  label: 'Hospitals & healthcare',
  status: 'example',
  accent: '#1aa6b7',
  brand: { name: 'Medinest Clinic', short: 'MC', location: 'Multispeciality clinic' },
  pitch: 'Clear, trustworthy information that helps patients find you and book a visit.',
  ideas: ['Service and department awareness content', 'Facility highlights without patient images', 'Local search & appointment enquiries', 'Privacy-safe, policy-compliant advertising'],
  note: 'Healthcare content avoids outcome claims and patient images, and follows platform health-advertising policies.',
  whatsapp: 'Hi GloAro, I run a hospital / clinic and would like to discuss digital marketing.',
  scenes: [
    {
      type: 'social-post',
      step: 'Facility highlight',
      image: 'healthcare/post.webp',
      alt: 'A clean, modern clinic reception area',
      caption: 'Our new reception is open 🩺 Shorter waiting times and easy appointment booking.',
      tags: ['#Healthcare', '#Clinic'],
    },
    {
      type: 'reel',
      step: 'Department video',
      poster: 'healthcare/reel.webp',
      alt: 'A clean, empty hospital ward with beds',
      headline: 'Meet our in-patient care unit',
      sub: 'Day care · In-patient rooms · 24×7 support',
      cta: 'Book an appointment',
    },
    {
      type: 'search',
      step: 'Local search',
      query: 'clinic near me open now',
      alt: 'Medinest Clinic in local search results with call and directions buttons',
      category: 'Medical clinic',
      hours: 'Open · Closes 9 pm',
      snippet: 'General medicine, paediatrics and diagnostics. Call or message to book an appointment.',
      url: 'medinest.example',
    },
    {
      type: 'enquiry',
      step: 'Appointment request',
      alt: 'A patient requests an appointment slot on WhatsApp, with no medical details shared',
      messages: [
        { from: 'customer', text: 'Hello, I would like to book a general physician appointment for tomorrow.' },
        { from: 'business', text: 'Good morning! Slots are available at 10:30 AM and 5 PM. Which one suits you?' },
        { from: 'customer', text: '10:30 AM please' },
        { from: 'business', text: 'Confirmed for 10:30 AM. Please carry any previous reports. See you tomorrow.' },
      ],
    },
  ],
}
