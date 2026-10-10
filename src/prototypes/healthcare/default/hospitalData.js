import {
  Activity,
  Baby,
  ClipboardPlus,
  Droplets,
  Heart,
  HeartPulse,
  Microscope,
  Stethoscope,
  Syringe,
} from 'lucide-react'

export const doctors = [
  { name: 'Dr. Ananya Iyer', specialty: 'Cardiology', image: 'photo-1559839734-2b71ea197ec2', experience: '18 years experience' },
  { name: 'Dr. Arjun Menon', specialty: 'Orthopaedics', image: 'photo-1612349317150-e413f6a5b16d', experience: '15 years experience' },
  { name: 'Dr. Meera Krishnan', specialty: 'Paediatrics', image: 'photo-1594824476967-48c8b964273f', experience: '12 years experience' },
  { name: 'Dr. Rohan Desai', specialty: 'Neurology', image: 'photo-1622253692010-333f2da6031d', experience: '20 years experience' },
  { name: 'Dr. Kavya Nair', specialty: 'Obstetrics & gynaecology', image: 'photo-1584515933487-779824d29309', experience: '14 years experience' },
  { name: 'Dr. Vikram Rao', specialty: 'General medicine', image: 'photo-1622902046580-2b47f47f5471', experience: '16 years experience' },
]

export const testimonials = [
  { quote: 'From the first call to discharge, every step felt thought through. The cardiology team explained everything in plain language and never rushed us.', name: 'Priya Subramaniam', context: 'Cardiology patient, Anna Nagar', rating: 5 },
  { quote: 'Our daughter was nervous about her procedure, and the paediatric nurses made her feel safe before we even met the doctor. That kind of care stays with you.', name: 'Karthik & Divya Raman', context: 'Paediatrics, parent of patient', rating: 5 },
  { quote: 'I travelled from Coimbatore for a second opinion on my knee. The orthopaedic team coordinated my scans and consultation in a single visit.', name: 'Suresh Pillai', context: 'Orthopaedics patient', rating: 5 },
]

export const insurancePartners = [
  'Star Health', 'HDFC Ergo', 'ICICI Lombard', 'Niva Bupa', 'Care Health', 'CGHS empanelled',
]

export const specialties = [
  { icon: HeartPulse, name: 'Cardiology', text: 'Heart health, cardiac diagnostics and advanced treatment.' },
  { icon: Activity, name: 'Orthopaedics', text: 'Joint, bone and mobility care to help you move forward.' },
  { icon: Baby, name: 'Paediatrics', text: 'Gentle, complete healthcare for infants, children and teens.' },
  { icon: Heart, name: 'Obstetrics & gynaecology', text: 'Respectful care for women through every stage of life.' },
  { icon: Microscope, name: 'Neurology', text: 'Specialist diagnosis and treatment for conditions of the brain and nerves.' },
  { icon: Stethoscope, name: 'General medicine', text: 'Preventive health, routine consultations and ongoing care.' },
  { icon: Activity, name: 'Diabetes & endocrinology', text: 'Ongoing support for diabetes, thyroid health and hormonal conditions.' },
  { icon: Droplets, name: 'Kidney care', text: 'Specialist support for kidney health, diagnosis and treatment planning.' },
  { icon: Syringe, name: 'Surgical care', text: 'Coordinated surgical expertise with support before and after your procedure.' },
  { icon: ClipboardPlus, name: 'Diagnostics', text: 'Imaging and lab services to help your care team find answers.' },
]
