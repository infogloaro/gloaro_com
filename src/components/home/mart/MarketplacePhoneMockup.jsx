import { Bell, Grid2X2, Home, MapPin, Search, ShoppingCart, User, ChevronDown, Shirt, Sofa, Smartphone, Apple } from 'lucide-react'
import logo from '../../../assets/logo-transparent.webp'
import { img } from './martAssets'

const categories = [
  ['Groceries', Apple, '#ffb000'],
  ['Fashion', Shirt, '#0b5cff'],
  ['Electronics', Smartphone, '#17a589'],
  ['Home & Living', Sofa, '#ff7a00'],
]
const deals = [
  ['Fresh Tomato', '₹49/kg', 'tomatoes'],
  ['Running Shoes', '₹1,299', 'sneakers'],
]
const popular = [
  ['Fruits & Veg', 'oranges'],
  ['Fashion', 'tshirt'],
  ['Electronics', 'earbuds'],
  ['Audio', 'headphones'],
]

// Phone frame with the Gloaro Mart shopping app inside. Everything is real
// markup so it stays crisp at any size; the screen gets a periodic light sweep.
export default function MarketplacePhoneMockup({ className = '' }) {
  return (
    <div className={`relative aspect-[9/19] w-full ${className}`}>
      {/* Device body */}
      <div className="absolute inset-0 rounded-[13%/6.2%] bg-[linear-gradient(160deg,#3a4a66_0%,#0f1a33_45%,#2b3b5c_100%)] shadow-[0_40px_80px_-24px_rgba(7,26,61,0.55),0_0_0_1px_rgba(255,255,255,0.25)_inset]">
        <span aria-hidden="true" className="absolute left-[-1.5%] top-[22%] h-[7%] w-[1.5%] rounded-l-sm bg-[#1b2742]" />
        <span aria-hidden="true" className="absolute left-[-1.5%] top-[31%] h-[7%] w-[1.5%] rounded-l-sm bg-[#1b2742]" />
        <span aria-hidden="true" className="absolute right-[-1.5%] top-[26%] h-[11%] w-[1.5%] rounded-r-sm bg-[#1b2742]" />
      </div>
      {/* Screen */}
      <div className="mart-sweep absolute inset-[2.6%] overflow-hidden rounded-[11%/5.3%] bg-[#f7f9fd] font-work text-[#071a3d]">
        <span aria-hidden="true" className="absolute left-1/2 top-[1.6%] z-20 h-[2.6%] w-[28%] -translate-x-1/2 rounded-full bg-[#0f1a33]" />
        <div className="flex h-full flex-col text-[0.52rem] leading-tight [container-type:inline-size]">
          <div className="flex items-center justify-between px-[7%] pt-[4%] text-[0.55rem] font-bold">
            <span>9:41</span>
            <span className="flex items-center gap-0.5">
              <span className="h-1.5 w-2 rounded-[1px] bg-[#071a3d]" />
              <span className="h-1.5 w-3 rounded-[2px] border border-[#071a3d]" />
            </span>
          </div>
          <div className="mt-[4%] flex items-center justify-between px-[7%]">
            <span className="flex items-center gap-1.5 font-extrabold text-[0.72rem]">
              <img src={logo} alt="" width="20" height="20" className="h-[1.1em] w-[1.1em] object-contain" />
              Gloaro Mart
            </span>
            <Bell className="h-[0.8rem] w-[0.8rem] text-[#0b5cff]" />
          </div>
          <div className="mx-[7%] mt-[4%] flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-slate-400 shadow-sm">
            <Search className="h-[0.7rem] w-[0.7rem]" />
            Search for products, stores…
          </div>
          <div className="mt-[3%] flex items-center gap-1 px-[7%] font-bold text-[#0b5cff]">
            <MapPin className="h-[0.7rem] w-[0.7rem] text-[#ff7a00]" />
            Coimbatore
            <ChevronDown className="h-[0.7rem] w-[0.7rem]" />
          </div>
          <div className="relative mx-[7%] mt-[4%] overflow-hidden rounded-xl shadow-md">
            <img src={img('produce')} alt="" width="560" height="420" decoding="async" className="aspect-[2/1] w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,26,61,0.85)_0%,rgba(7,26,61,0.55)_50%,rgba(7,26,61,0)_100%)]" />
            <div className="absolute inset-0 flex flex-col justify-center p-[6%] text-white">
              <p className="text-[0.7rem] font-extrabold">Fresh Groceries</p>
              <p className="mt-0.5 text-[0.5rem] font-medium opacity-90">Farm fresh to your door</p>
              <span className="mt-1.5 w-max rounded-full bg-[#ffb000] px-2 py-0.5 text-[0.5rem] font-black text-[#071a3d]">Shop now</span>
            </div>
          </div>
          <div className="mt-[4%] grid grid-cols-4 gap-1 px-[7%] text-center text-[0.48rem] font-semibold text-slate-600">
            {categories.map(([label, Icon, color]) => (
              <span key={label} className="flex flex-col items-center gap-1">
                <span className="grid h-[1.9rem] w-[1.9rem] place-items-center rounded-xl bg-white shadow-sm" style={{ color }}>
                  <Icon className="h-[0.95rem] w-[0.95rem]" />
                </span>
                {label}
              </span>
            ))}
          </div>
          <div className="mt-[4%] flex items-center justify-between px-[7%] font-extrabold">
            <span className="text-[0.62rem]">Top Deals</span>
            <span className="text-[0.5rem] text-[#0b5cff]">See all</span>
          </div>
          <div className="mt-[2.5%] grid grid-cols-2 gap-2 px-[7%]">
            {deals.map(([name, price, image]) => (
              <div key={name} className="overflow-hidden rounded-xl bg-white shadow-sm">
                <img src={img(image)} alt="" width="240" height="160" loading="lazy" decoding="async" className="aspect-[3/2] w-full object-cover" />
                <div className="p-1.5">
                  <p className="truncate font-bold">{name}</p>
                  <div className="mt-0.5 flex items-center justify-between">
                    <span className="font-black text-[#071a3d]">{price}</span>
                    <span className="rounded-full bg-[#ffb000] px-1.5 py-0.5 text-[0.45rem] font-black">Add</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-[4%] px-[7%] text-[0.62rem] font-extrabold">Popular Categories</p>
          <div className="mt-[2.5%] grid grid-cols-4 gap-1.5 px-[7%] text-center text-[0.45rem] font-semibold text-slate-600">
            {popular.map(([label, image]) => (
              <span key={label} className="flex flex-col items-center gap-1">
                <img src={img(image)} alt="" width="96" height="96" loading="lazy" decoding="async" className="aspect-square w-full rounded-lg object-cover shadow-sm" />
                {label}
              </span>
            ))}
          </div>
          <div className="mt-auto flex items-center justify-around border-t border-slate-200 bg-white px-[4%] pb-[5%] pt-[3%] text-[0.42rem] font-bold text-slate-500">
            {[['Home', Home, true], ['Categories', Grid2X2], ['Cart', ShoppingCart, false, 1], ['Account', User]].map(([label, Icon, active, badge]) => (
              <span key={label} className={`relative flex flex-col items-center gap-0.5 ${active ? 'text-[#ff7a00]' : ''}`}>
                <Icon className="h-[0.85rem] w-[0.85rem]" />
                {badge && <span className="absolute -right-1 -top-1 grid h-2.5 w-2.5 place-items-center rounded-full bg-[#ff3b30] text-[0.36rem] text-white">{badge}</span>}
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
