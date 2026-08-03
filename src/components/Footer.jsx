import logo from '../assets/logo.png'
import leastActionLogo from '../assets/least-action-company-logo.png'
import { Link } from 'react-router-dom'

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
    <footer className="border-b-4 border-black bg-[#0b1c40] font-urbanist text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:py-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.9fr_0.9fr_1.15fr] lg:gap-12">
          <div>
            <img src={logo} alt="Gloaro Business Network" className="h-auto w-28 rounded bg-white p-1" />
            <p className="mt-5 max-w-[250px] text-xs leading-5 text-slate-100">Join thousands of professionals and businesses leveraging GLOARO to build connections, generate opportunities, and achieve sustainable growth.</p>
            <div className="mt-5 flex gap-2 text-sm"><a href="#top" aria-label="Facebook" className="grid h-4 w-4 place-items-center rounded-full bg-[#1877f2] text-[10px] font-bold">f</a><a href="#top" aria-label="Instagram" className="grid h-4 w-4 place-items-center rounded-[4px] bg-gradient-to-br from-[#a538b9] via-[#ee4d71] to-[#ffbd58] text-[9px] font-bold">◎</a><a href="#top" aria-label="X" className="grid h-4 w-4 place-items-center text-xs font-bold">𝕏</a><a href="#top" aria-label="YouTube" className="grid h-4 w-4 place-items-center rounded-[4px] bg-red-600 text-[9px]">▶</a></div>
          </div>

          <div><h2 className="mb-5 font-inter text-base font-bold">Quick Links</h2><ul className="space-y-4 text-xs text-slate-100">{links.quick.map(([label, href]) => <li key={label}><a className="hover:text-[#ffad16]" href={href}>{label}</a></li>)}</ul></div>
          <div><h2 className="mb-5 font-inter text-base font-bold">Useful Links</h2><ul className="space-y-4 text-xs text-slate-100">{links.useful.map(([label, href]) => <li key={label}><a className="hover:text-[#ffad16]" href={href}>{label}</a></li>)}</ul></div>

          <div><h2 className="mb-5 font-inter text-base font-bold">Contact Us</h2><div className="space-y-4 text-xs leading-5 text-slate-100"><p className="flex gap-3"><span className="text-base">⌕</span>+91 7200073704</p><p className="flex gap-3"><span className="text-sm">✉</span>info@gloaro.com</p><p className="flex gap-3"><span className="text-base">●</span><span>151 Kamadhenu Nagar 2nd street<br />Neelamagalam Road Kallakurichy - 606202</span></p></div></div>
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-5 text-center text-[11px] font-medium text-slate-400 lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <p>© 2026 GLOARO. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:justify-end">
            <Link className="transition hover:text-[#ffad16]" to="/terms-and-conditions">Terms &amp; Conditions</Link>
            <span className="hidden h-4 w-px bg-white/20 sm:block" />
            <Link className="transition hover:text-[#ffad16]" to="/privacy-policy">Privacy Policy</Link>
            <span className="hidden h-4 w-px bg-white/20 sm:block" />
            <a href="https://www.leastactioncompany.com/" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 text-slate-300 transition hover:text-[#ffad16]">
              <span>Powered by</span>
              <img src={leastActionLogo} alt="Least Action Company" className="h-11 w-auto rounded object-contain transition group-hover:scale-[1.03]" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
