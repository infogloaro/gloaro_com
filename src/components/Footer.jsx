import logo from '../assets/logo.png'
import leastActionLogo from '../assets/least-action-company-logo.png'
import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

const links = {
  quick: [
    ['Home', '#top'],
    ['Why Gloaro', '#why-gloaro'],
    ['Business Categories', '#business-categories'],
    ['Features', '#features'],
    ['Success Stories', '#testimonials'],
  ],
  useful: [
    ['Membership', '/register'],
    ['About', '/about'],
    ['Events', '/#events'],
    ['Shop', '/products'],
    ['Services', '/services'],
  ],
}

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-white/10 bg-[linear-gradient(180deg,#040e20_0%,#091b3e_50%,#051128_100%)] font-urbanist text-white">
      {/* Background Ambient Glow Effects */}
      <div aria-hidden="true" className="absolute -left-28 top-0 h-80 w-80 rounded-full bg-[#ffae13]/10 blur-[120px]" />
      <div aria-hidden="true" className="absolute -right-24 bottom-0 h-[350px] w-[350px] rounded-full bg-[#0d4697]/25 blur-[140px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,174,19,0.1),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(13,70,151,0.18),transparent_40%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
            {/* Column 1: Brand & Overview (5 Cols) */}
            <div className="flex flex-col justify-between space-y-5 lg:col-span-5">
              <div>
                <div>
                  <img
                    src={logo}
                    alt="Gloaro Business Network"
                    className="h-auto w-32 rounded-xl bg-white p-2 shadow-md transition duration-300 hover:scale-[1.02]"
                  />
                </div>

                <p className="mt-3.5 max-w-md text-xs leading-6 text-slate-300/90 sm:text-sm sm:leading-6 font-medium">
                  Join thousands of professionals and businesses leveraging GLOARO to build connections, generate opportunities, and achieve sustainable growth.
                </p>
              </div>

              {/* Social Icons */}
              <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-white transition duration-300 hover:-translate-y-0.5 hover:border-transparent hover:bg-[#1877f2]"
                >
                  <span className="text-xs font-black">f</span>
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-white transition duration-300 hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-br hover:from-[#a538b9] hover:via-[#ee4d71] hover:to-[#ffbd58]"
                >
                  <span className="text-xs font-black">◎</span>
                </a>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-white transition duration-300 hover:-translate-y-0.5 hover:border-transparent hover:bg-[#0a66c2]"
                >
                  <span className="text-[11px] font-black">in</span>
                </a>
                <a
                  href="https://www.youtube.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-white transition duration-300 hover:-translate-y-0.5 hover:border-transparent hover:bg-[#ff0000]"
                >
                  <span className="text-[9px] font-black">▶</span>
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links (2 Cols) */}
            <div className="lg:col-span-2">
              <h2 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#ffd36e]">
                Quick Links
              </h2>
              <ul className="space-y-2 text-xs font-medium text-slate-300 sm:text-sm">
                {links.quick.map(([label, href]) => (
                  <li key={label}>
                    <a
                      className="group inline-flex items-center gap-2 transition duration-200 hover:translate-x-1 hover:text-[#ffd36e]"
                      href={href}
                    >
                      <span className="grid h-4 w-4 place-items-center rounded-full border border-white/10 bg-white/10 text-[8px] transition duration-200 group-hover:border-[#ffae13] group-hover:bg-[#ffae13] group-hover:text-[#08142b]">
                        ›
                      </span>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Useful Links (2 Cols) */}
            <div className="lg:col-span-2">
              <h2 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#ffd36e]">
                Useful Links
              </h2>
              <ul className="space-y-2 text-xs font-medium text-slate-300 sm:text-sm">
                {links.useful.map(([label, href]) => (
                  <li key={label}>
                    <a
                      className="group inline-flex items-center gap-2 transition duration-200 hover:translate-x-1 hover:text-[#ffd36e]"
                      href={href}
                    >
                      <span className="grid h-4 w-4 place-items-center rounded-full border border-white/10 bg-white/10 text-[8px] transition duration-200 group-hover:border-[#ffae13] group-hover:bg-[#ffae13] group-hover:text-[#08142b]">
                        ›
                      </span>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact Us (3 Cols) */}
            <div className="lg:col-span-3">
              <h2 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#ffd36e]">
                Contact Us
              </h2>
              <div className="space-y-3 text-xs font-medium leading-relaxed text-slate-300 sm:text-sm">
                <a
                  href="tel:+917200073704"
                  className="group flex items-start gap-2.5 transition duration-200 hover:text-[#ffd36e]"
                >
                  <div className="mt-0.5 grid h-6.5 w-6.5 shrink-0 place-items-center rounded-md border border-white/10 bg-white/5 transition duration-200 group-hover:border-[#ffae13]/40 group-hover:bg-[#ffae13]/10">
                    <Phone className="h-3 w-3 text-[#ffae13]" />
                  </div>
                  <span>+91 7200073704</span>
                </a>

                <a
                  href="mailto:info@gloaro.com"
                  className="group flex items-start gap-2.5 transition duration-200 hover:text-[#ffd36e]"
                >
                  <div className="mt-0.5 grid h-6.5 w-6.5 shrink-0 place-items-center rounded-md border border-white/10 bg-white/5 transition duration-200 group-hover:border-[#ffae13]/40 group-hover:bg-[#ffae13]/10">
                    <Mail className="h-3 w-3 text-[#ffae13]" />
                  </div>
                  <span>info@gloaro.com</span>
                </a>

                <div className="group flex items-start gap-2.5">
                  <div className="mt-0.5 grid h-6.5 w-6.5 shrink-0 place-items-center rounded-md border border-white/10 bg-white/5">
                    <MapPin className="h-3 w-3 text-[#ffae13]" />
                  </div>
                  <span>
                    151 Kamadhenu Nagar 2nd street
                    <br />
                    Neelamagalam Road Kallakurichy - 606202
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="mt-8 border-t border-white/10 pt-5">
            <div className="flex flex-col gap-3 text-center text-xs font-medium text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <p>© 2026 GLOARO. All rights reserved.</p>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-end">
                <Link className="transition duration-200 hover:text-[#ffd36e]" to="/terms-and-conditions">
                  Terms &amp; Conditions
                </Link>
                <span className="hidden h-3.5 w-px bg-white/15 sm:block" />
                <Link className="transition duration-200 hover:text-[#ffd36e]" to="/privacy-policy">
                  Privacy Policy
                </Link>
                <span className="hidden h-3.5 w-px bg-white/15 sm:block" />
                <a
                  href="https://www.leastactioncompany.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-slate-400 transition duration-200 hover:text-[#ffd36e]"
                >
                  <span>Powered by</span>
                  <img
                    src={leastActionLogo}
                    alt="Least Action Company"
                    className="h-10 sm:h-11 w-auto object-contain transition duration-300 group-hover:scale-105"
                  />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
