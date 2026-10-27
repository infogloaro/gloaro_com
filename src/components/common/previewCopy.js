// Per-business copy for the generated website and app previews.
export const COPY = {
  food: { nav: ['Menu', 'Order', 'Offers', 'Visit'], cta: 'Order now', items: ['Starters', 'Mains', 'Desserts', 'Drinks'] },
  education: { nav: ['Courses', 'Admissions', 'Campus', 'Faculty'], cta: 'Apply now', items: ['Science', 'Commerce', 'Arts', 'Sports'] },
  retail: { nav: ['Shop', 'New in', 'Sale', 'Stores'], cta: 'Shop now', items: ['Dresses', 'Shirts', 'Denim', 'Accessories'] },
  pos: { nav: ['Features', 'Pricing', 'Hardware', 'Support'], cta: 'Start free', items: ['Billing', 'Inventory', 'GST reports', 'Payments'] },
  realestate: { nav: ['Projects', 'Rentals', 'Amenities', 'Contact'], cta: 'Book a visit', items: ['2 BHK', '3 BHK', 'Villas', 'Plots'] },
  healthcare: { nav: ['Doctors', 'Specialities', 'Reports', 'Contact'], cta: 'Book appointment', items: ['Cardiology', 'Orthopaedics', 'Paediatrics', 'Diagnostics'] },
  logistics: { nav: ['Track', 'Ship', 'Network', 'Business'], cta: 'Get a quote', items: ['Express', 'Freight', 'Warehousing', 'Same day'] },
  hospitality: { nav: ['Rooms', 'Dining', 'Experiences', 'Offers'], cta: 'Book your stay', items: ['Deluxe', 'Suites', 'Pool villa', 'Spa'] },
  services: { nav: ['Services', 'Team', 'Insights', 'Contact'], cta: 'Book a consultation', items: ['Tax', 'Audit', 'Legal', 'Advisory'] },
  manufacturing: { nav: ['Products', 'Capabilities', 'Quality', 'Careers'], cta: 'Request a quote', items: ['CNC', 'Assembly', 'Textiles', 'Automation'] },
  salon: { nav: ['Services', 'Stylists', 'Packages', 'Gallery'], cta: 'Book a slot', items: ['Hair', 'Skin', 'Spa', 'Bridal'] },
  fitness: { nav: ['Classes', 'Trainers', 'Plans', 'Timings'], cta: 'Join now', items: ['Strength', 'Yoga', 'HIIT', 'Zumba'] },
  pharmacy: { nav: ['Medicines', 'Lab tests', 'Wellness', 'Offers'], cta: 'Upload prescription', items: ['Medicines', 'Vitamins', 'Devices', 'Lab tests'] },
  automobile: { nav: ['Models', 'Service', 'Finance', 'Offers'], cta: 'Book a test drive', items: ['Hatchback', 'Sedan', 'SUV', 'EV'] },
  jewellery: { nav: ['Collections', 'Gold rate', 'Bridal', 'Stores'], cta: 'Explore collection', items: ['Necklaces', 'Rings', 'Bangles', 'Earrings'] },
}
export const SOFTWARE_COPY = { nav: ['Product', 'Features', 'Pricing', 'Docs'], cta: 'Start free trial', items: ['Leads', 'Revenue', 'Tasks', 'Tickets'] }

export const previewCopy = (businessId) => COPY[businessId] || SOFTWARE_COPY
