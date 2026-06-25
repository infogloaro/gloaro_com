import { useState } from 'react'
import logo from '../assets/logo.png'
import networkIcon from '../assets/network_icon.png'
import shopIcon from '../assets/shop_icon.png'
import nearMeIcon from '../assets/nearme_icon.png'
import b2bIcon from '../assets/b2b_icon.png'
import loginIcon from '../assets/login_icon.png'

const SearchIcon = () => <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-none stroke-white stroke-[3.25]"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
const PinIcon = () => <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" /></svg>

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navItems = [[networkIcon, 'Gloaro Network', 'bg-[#0b469e] text-white'], [shopIcon, 'Shop', 'bg-[#ffb20c] text-[#063a85]'], [nearMeIcon, 'Near Me', 'bg-[#ffb20c] text-[#063a85]'], [b2bIcon, 'B2b Marketplace', 'bg-[#ffb20c] text-[#063a85]']]

  return (
    <header className="sticky top-0 z-50 border-t-4 border-black bg-white font-jakarta shadow-sm">
      <div className="mx-auto max-w-[1440px] px-4 py-3 sm:px-7">
        <div className="flex items-center gap-4 xl:gap-5">
          <a href="#top" className="flex w-24 shrink-0 items-center sm:w-28"><img src={logo} alt="Gloaro Business Network" className="h-auto w-full object-contain" /></a>

          <div className="hidden flex-1 items-center gap-3 lg:flex">
            {navItems.map(([icon, label, colors]) => <a key={label} href={label === 'Shop' ? '#directory' : '#membership'} className={`flex h-10 items-center gap-2 whitespace-nowrap rounded-full px-5 text-sm font-medium shadow-sm transition hover:-translate-y-px ${colors}`}><img src={icon} alt="" className="h-4 w-4 object-contain" />{label}</a>)}
          </div>

          <div className="ml-auto hidden items-center gap-4 text-[#0b469e] lg:flex">
            <button aria-label="Account" className="flex items-center gap-1 text-sm font-medium"><img src={loginIcon} alt="" className="h-5 w-5 object-contain" /> Login</button>
            <div className="relative"><button onClick={() => setOpen(!open)} className="flex h-8 items-center gap-2 rounded-md bg-[#0b469e] px-3 text-xs font-medium text-white"><PinIcon />Kallakurichy <span className="border-l border-white/40 pl-2">⌄</span><SearchIcon /></button>{open && <div className="absolute right-0 top-10 w-52 rounded-b-md bg-white p-3 shadow-xl"><p className="mb-2 flex items-center gap-1 text-xs font-medium text-[#f3a900]"><PinIcon /> Kallakurichy</p><input placeholder="Search City..." className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-600 outline-none focus:border-[#0b469e]" /></div>}</div>
          </div>

          <button onClick={() => setOpen(!open)} className="ml-auto rounded-md bg-[#0b469e] px-3 py-2 text-lg text-white lg:hidden" aria-label="Toggle menu">☰</button>
        </div>

        <div className="mt-3 flex items-center gap-3 lg:mt-4">
          <label className="flex h-8 w-full max-w-[420px] items-center gap-3 rounded-lg bg-[#0b469e] px-5 text-white shadow-sm"><SearchIcon /><input className="w-full bg-transparent text-xs outline-none placeholder:text-white" placeholder="Search for Products, Brands and More" /></label>
          <button onClick={() => setOpen(!open)} className="ml-auto flex items-center gap-1 text-xs font-medium text-[#f3a900] lg:hidden"><PinIcon /> Kallakurichy</button>
        </div>
      </div>

      {open && <div className="border-t border-slate-100 bg-white px-5 py-4 lg:hidden"><div className="grid gap-2 sm:grid-cols-2">{navItems.map(([icon, label, colors]) => <a onClick={() => setOpen(false)} key={label} href="#membership" className={`flex items-center rounded-lg px-4 py-3 font-medium ${colors}`}><img src={icon} alt="" className="mr-2 h-4 w-4 object-contain" />{label}</a>)}</div><div className="mt-4 rounded-lg border border-slate-200 p-3"><p className="mb-2 flex items-center gap-1 text-xs font-medium text-[#f3a900]"><PinIcon /> Kallakurichy</p><input placeholder="Search City..." className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none" /></div></div>}
    </header>
  )
}
