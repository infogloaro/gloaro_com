import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa'
import { MartLogo, Wave } from './primitives'

const columns = [
  {
    title: 'Product',
    links: [
      ['Customers', '#features'],
      ['Vendors', '#business'],
      ['Mobile App', '#app'],
      ['Web App', '#web-mobile'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['About GLOARO', '/about'],
      ['Contact', '/contact'],
      ['GLOARO Ecosystem', '/'],
    ],
  },
  {
    title: 'Support',
    links: [
      ['Help Center', '/contact'],
      ['FAQs', '/contact'],
      ['Contact Support', '/contact'],
    ],
  },
]

// Same social destinations as the main GLOARO footer.
const socials = [
  [FaFacebookF, 'Facebook', 'https://www.facebook.com/'],
  [FaInstagram, 'Instagram', 'https://www.instagram.com/'],
  [FaLinkedinIn, 'LinkedIn', 'https://www.linkedin.com/'],
  [FaYoutube, 'YouTube', 'https://www.youtube.com/'],
]

function FooterLink({ href, children }) {
  const cls = 'text-sm text-white/65 transition hover:text-[#ffd36e]'
  return href.startsWith('#') ? <a href={href} className={cls}>{children}</a> : <Link to={href} className={cls}>{children}</Link>
}

export default function MartFooter() {
  return (
    <footer className="relative mt-[-1px] text-white">
      <Wave className="h-16 sm:h-24" />
      <div className="relative -mt-px overflow-hidden bg-[#0b2451]">
        <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-[#1b6fe0]/25 blur-[120px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1280px] px-4 pb-10 pt-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_2fr]">
            <div>
              <span className="inline-flex rounded-2xl bg-white px-3 py-2 shadow-lg">
                <MartLogo compact />
              </span>
              <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">
                GLOARO MART is GLOARO&apos;s connected B2B + B2C marketplace — bringing customers, vendors and local businesses together on web and mobile.
              </p>
              <ul className="mt-6 flex gap-2" aria-label="GLOARO on social media">
                {socials.map(([Icon, label, href]) => (
                  <li key={label}>
                    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:-translate-y-0.5 hover:border-[#ffae13]/60 hover:text-[#ffd36e]">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {columns.map((col) => (
                <div key={col.title}>
                  <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#ffd36e]">{col.title}</h3>
                  <ul className="mt-4 space-y-3">
                    {col.links.map(([label, href]) => (
                      <li key={label}><FooterLink href={href}>{label}</FooterLink></li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} GLOARO Pvt Ltd. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link to="/terms-and-conditions" className="transition hover:text-white">Terms</Link>
              <Link to="/privacy-policy" className="transition hover:text-white">Privacy</Link>
              <Link to="/" className="inline-flex items-center gap-1 font-semibold text-white/70 transition hover:text-white">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Back to GLOARO
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
