import { BarChart3, LayoutDashboard, Package, Search, Settings, ShoppingBag, Store, Users } from 'lucide-react'
import logo from '../../../assets/logo-transparent.webp'
import { catalog, img } from './martAssets'

const nav = [['Dashboard', LayoutDashboard, true], ['Products', Package], ['Orders', ShoppingBag], ['Customers', Users], ['Vendors', Store], ['Analytics', BarChart3], ['Settings', Settings]]
const filters = ['All', 'Groceries', 'Fashion', 'Electronics', 'B2B']

// Browser-style marketplace admin: sidebar, catalog grid with photos,
// stock badges and vendor/order indicators.
export default function MarketplaceDashboardMockup({ className = '' }) {
  return (
    <div className={`overflow-hidden rounded-[4%/5.5%] border border-white/70 bg-white font-work text-[0.5rem] text-[#071a3d] shadow-[0_50px_90px_-30px_rgba(7,26,61,0.45),0_0_0_1px_rgba(7,26,61,0.06)] ${className}`}>
      <div className="flex items-center gap-2 border-b border-slate-100 bg-[#f7f9fd] px-3 py-1.5">
        <span className="flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff6b6b]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#ffd36e]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
        </span>
        <span className="ml-2 flex-1 rounded-full bg-white px-2 py-0.5 font-mono text-[0.45rem] text-slate-400">gloaro.com/mart/dashboard</span>
      </div>
      <div className="flex aspect-[16/10]">
        <aside className="flex w-[24%] flex-col gap-0.5 border-r border-slate-100 bg-[#f7f9fd] p-2">
          <span className="mb-1.5 flex items-center gap-1 font-extrabold text-[0.58rem]">
            <img src={logo} alt="" width="16" height="16" className="h-3 w-3 object-contain" />
            Gloaro Mart
          </span>
          {nav.map(([label, Icon, active]) => (
            <span key={label} className={`flex items-center gap-1.5 rounded-md px-1.5 py-1 font-semibold ${active ? 'bg-[#0b5cff] text-white' : 'text-slate-500'}`}>
              <Icon className="h-2.5 w-2.5" />
              {label}
            </span>
          ))}
          <span className="mt-auto rounded-lg bg-[#071a3d] p-1.5 text-white">
            <span className="block text-[0.42rem] opacity-70">Orders today</span>
            <span className="text-[0.62rem] font-black">342</span>
          </span>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col p-2.5">
          <div className="flex items-center gap-2">
            <span className="flex flex-1 items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-slate-400">
              <Search className="h-2.5 w-2.5" />
              Search products, vendors…
            </span>
            <span className="rounded-full bg-[#17a589]/10 px-1.5 py-0.5 font-bold text-[#17a589]">128 vendors</span>
            <span className="h-4 w-4 rounded-full bg-[linear-gradient(135deg,#ffb000,#ff7a00)]" />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[0.62rem] font-extrabold">Featured Products</span>
            <span className="flex gap-1">
              {filters.map((filter, index) => (
                <span key={filter} className={`rounded-full px-1.5 py-0.5 text-[0.42rem] font-bold ${index === 0 ? 'bg-[#071a3d] text-white' : 'bg-slate-100 text-slate-500'}`}>{filter}</span>
              ))}
            </span>
          </div>
          <div className="mt-1.5 grid flex-1 grid-cols-3 gap-1.5">
            {catalog.map(({ name, price, image, stock }) => (
              <div key={name} className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm">
                <img src={img(image)} alt="" width="240" height="150" loading="lazy" decoding="async" className="min-h-0 w-full flex-1 object-cover" />
                <div className="p-1">
                  <p className="truncate font-bold">{name}</p>
                  <div className="mt-0.5 flex items-center justify-between">
                    <span className="font-black">{price}</span>
                    <span className={`rounded-full px-1 py-px text-[0.38rem] font-bold ${stock === 'In stock' ? 'bg-[#17a589]/10 text-[#17a589]' : 'bg-[#ff7a00]/10 text-[#ff7a00]'}`}>{stock}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
