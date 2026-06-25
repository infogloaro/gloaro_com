import logo from '../assets/logo.png'

const links = {
  quick: ['Home', 'About Us', 'Services', 'Results', 'Contact Us'],
  useful: ['Membership', 'Events', 'Blog', 'FAQs', 'Terms & Conditions'],
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

          <div><h2 className="mb-5 font-inter text-base font-bold">Quick Links</h2><ul className="space-y-4 text-xs text-slate-100">{links.quick.map((link) => <li key={link}><a className="hover:text-[#ffad16]" href={link === 'Home' ? '#top' : `#${link.toLowerCase().replaceAll(' ', '-')}`}>{link}</a></li>)}</ul></div>
          <div><h2 className="mb-5 font-inter text-base font-bold">Useful Links</h2><ul className="space-y-4 text-xs text-slate-100">{links.useful.map((link) => <li key={link}><a className="hover:text-[#ffad16]" href={`#${link.toLowerCase().replaceAll(' ', '-')}`}>{link}</a></li>)}</ul></div>

          <div><h2 className="mb-5 font-inter text-base font-bold">Contact Us</h2><div className="space-y-4 text-xs leading-5 text-slate-100"><p className="flex gap-3"><span className="text-base">⌕</span>+91 7200073704</p><p className="flex gap-3"><span className="text-sm">✉</span>info@gloaro.com</p><p className="flex gap-3"><span className="text-base">●</span><span>151 Kamadhenu Nagar 2nd street<br />Neelamagalam Road Kallakurichy - 606202</span></p></div><h2 className="mb-4 mt-7 font-inter text-base font-normal">Newsletter</h2><p className="mb-3 text-[10px] leading-4 text-slate-100">Subscribe to our newsletter for updates and<br />latest opportunities.</p><form className="flex max-w-[228px]" onSubmit={(event) => event.preventDefault()}><input aria-label="Email address" placeholder="Enter your email" className="h-9 min-w-0 flex-1 rounded-l-md bg-[#2a3b60] px-3 text-xs text-white outline-none placeholder:text-slate-400" /><button aria-label="Subscribe" className="grid h-9 w-11 place-items-center rounded-r-md bg-[#ff741a] text-lg">➤</button></form></div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-5 text-center text-[11px] font-medium text-slate-500">© 2026 GLOARO. All rights reserved.</div>
      </div>
    </footer>
  )
}
