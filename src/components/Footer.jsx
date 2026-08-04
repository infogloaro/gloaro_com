import logo from '../assets/logo.png'
import leastActionLogo from '../assets/least-action-company-logo.png'
import { Link } from 'react-router-dom'
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react'

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
    <footer className="relative isolate overflow-hidden border-t border-white/10 bg-[linear-gradient(180deg,#06162f_0%,#0b1c40_45%,#08142b_100%)] font-urbanist text-white">
      <div aria-hidden="true" className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#ffae13]/10 blur-3xl" />
      <div aria-hidden="true" className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#0d4697]/20 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,174,19,0.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_32%)]" />

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.18fr_0.82fr] lg:gap-10">
          <div className="rounded-[34px] border border-white/10 bg-white/8 p-6 shadow-[0_24px_70px_rgba(2,8,23,0.22)] backdrop-blur-sm sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#ffd36e]">
                  GLOARO BUSINESS NETWORK
                </div>
                <img src={logo} alt="Gloaro Business Network" className="mt-5 h-auto w-32 rounded-2xl bg-white p-2 shadow-[0_16px_34px_rgba(0,0,0,0.16)]" />
                <p className="mt-5 max-w-[540px] text-sm leading-7 text-white/78 sm:text-base">
                  Join thousands of professionals and businesses leveraging GLOARO to build connections, generate opportunities, and achieve sustainable growth.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    ['Verified network', '#fff3d0'],
                    ['Business growth', '#e6f0ff'],
                    ['Premium support', '#e9fbef'],
                  ].map(([label, bg]) => (
                    <span key={label} className="rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#08142b]" style={{ backgroundColor: bg }}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <a href="#top" className="inline-flex items-center gap-2 self-start rounded-full bg-[linear-gradient(135deg,#ffae13,#ffd36e)] px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#08142b] shadow-[0_14px_30px_rgba(255,174,19,0.22)] transition duration-300 hover:-translate-y-0.5">
                Back to top
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/10 text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#1877f2]">
                <span className="text-sm font-black">f</span>
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/10 text-white transition duration-300 hover:-translate-y-0.5 hover:bg-gradient-to-br hover:from-[#a538b9] hover:via-[#ee4d71] hover:to-[#ffbd58]">
                <span className="text-sm font-black">◎</span>
              </a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/10 text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#0a66c2]">
                <span className="text-xs font-black">in</span>
              </a>
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/10 text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#ff0000]">
                <span className="text-[10px] font-black">▶</span>
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[28px] border border-white/10 bg-white/8 p-6 shadow-[0_18px_50px_rgba(2,8,23,0.16)] backdrop-blur-sm">
              <h2 className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-[#ffd36e]">Quick Links</h2>
              <ul className="space-y-3 text-sm text-slate-100">
                {links.quick.map(([label, href]) => (
                  <li key={label}>
                    <a className="group inline-flex items-center gap-2 transition duration-300 hover:translate-x-1 hover:text-[#ffd36e]" href={href}>
                      <span className="grid h-5 w-5 place-items-center rounded-full border border-white/10 bg-white/10 text-[10px] transition group-hover:bg-[#ffae13] group-hover:text-[#08142b]">›</span>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/8 p-6 shadow-[0_18px_50px_rgba(2,8,23,0.16)] backdrop-blur-sm">
              <h2 className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-[#ffd36e]">Useful Links</h2>
              <ul className="space-y-3 text-sm text-slate-100">
                {links.useful.map(([label, href]) => (
                  <li key={label}>
                    <a className="group inline-flex items-center gap-2 transition duration-300 hover:translate-x-1 hover:text-[#ffd36e]" href={href}>
                      <span className="grid h-5 w-5 place-items-center rounded-full border border-white/10 bg-white/10 text-[10px] transition group-hover:bg-[#ffae13] group-hover:text-[#08142b]">›</span>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/8 p-6 shadow-[0_18px_50px_rgba(2,8,23,0.16)] backdrop-blur-sm sm:col-span-2 lg:col-span-1">
              <h2 className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-[#ffd36e]">Contact Us</h2>
              <div className="space-y-4 text-sm leading-6 text-slate-100">
                <a href="tel:+917200073704" className="flex items-start gap-3 transition hover:text-[#ffd36e]">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#ffae13]" />
                  <span>+91 7200073704</span>
                </a>
                <a href="mailto:info@gloaro.com" className="flex items-start gap-3 transition hover:text-[#ffd36e]">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#ffae13]" />
                  <span>info@gloaro.com</span>
                </a>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#ffae13]" />
                  <span>151 Kamadhenu Nagar 2nd street<br />Neelamagalam Road Kallakurichy - 606202</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[28px] border border-white/10 bg-black/15 px-5 py-5 shadow-[0_14px_40px_rgba(2,8,23,0.18)] backdrop-blur-sm">
          <div className="flex flex-col gap-4 text-center text-xs font-medium text-slate-300 lg:flex-row lg:items-center lg:justify-between lg:text-left">
            <p>© 2026 GLOARO. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:justify-end">
              <Link className="transition hover:text-[#ffd36e]" to="/terms-and-conditions">Terms &amp; Conditions</Link>
              <span className="hidden h-4 w-px bg-white/15 sm:block" />
              <Link className="transition hover:text-[#ffd36e]" to="/privacy-policy">Privacy Policy</Link>
              <span className="hidden h-4 w-px bg-white/15 sm:block" />
              <a href="https://www.leastactioncompany.com/" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 text-slate-300 transition hover:text-[#ffd36e]">
                <span>Powered by</span>
                <img src={leastActionLogo} alt="Least Action Company" className="h-10 w-auto rounded bg-white/90 p-1 object-contain transition group-hover:scale-[1.03]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
