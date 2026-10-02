import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { businesses, isThemeLive } from '../../prototypes/catalog'

// Home section: a thumbnail per business website theme. Live themes open the prototype;
// the rest open that business's theme page, where they show as in progress.
export default function ThemesShowcase() {
  return (
    <section id="themes" className="scroll-mt-48 bg-white px-5 py-14 sm:py-16 lg:scroll-mt-52 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-urbanist text-xs font-extrabold uppercase tracking-[0.24em] text-[#ffae13]">Gloaro Themes</p>
            <h2 className="mt-2 font-playfair text-4xl font-semibold italic leading-tight text-[#0d4697] sm:text-5xl">
              Business <span className="text-[#ffae13]">Website Themes</span>
            </h2>
            <p className="mt-3 max-w-xl font-urbanist text-base font-semibold text-slate-600">
              Pick your industry and click a thumbnail to experience the website as a live, clickable prototype.
            </p>
          </div>
          <Link to="/solutions" className="font-urbanist text-sm font-extrabold text-[#0d4697] underline decoration-[#ffae13] decoration-2 underline-offset-4">
            View all solutions →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => {
            const theme = business.themes[0]
            const live = isThemeLive(business.id, theme.id)
            return (
              <Link
                key={business.id}
                to={live ? `/prototypes/${business.id}/${theme.id}` : `/solutions/${business.id}`}
                className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                aria-label={live ? `Open ${business.name} website prototype` : `${business.name} website theme (coming soon)`}
              >
                {/* browser-window frame so the thumbnail reads as a website */}
                <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-100 px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff6159]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-3 flex-1 truncate rounded-md bg-white px-3 py-0.5 text-[11px] font-semibold text-slate-400">
                    {theme.site || `yourbusiness.com`}
                  </span>
                </div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  {theme.thumb ? (
                    <img src={theme.thumb} alt={`${business.name} website thumbnail`} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="grid h-full w-full place-items-center p-6 text-center" style={{ background: `linear-gradient(135deg, ${business.accent}, #0b0b0c)` }}>
                      <span className="font-playfair text-2xl font-semibold italic text-white/90">{business.name}</span>
                    </div>
                  )}
                  <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest ${live ? 'bg-[#ffae13] text-[#0b2a55]' : 'bg-white/85 text-slate-600'}`}>
                    {live ? 'Live prototype' : 'Coming soon'}
                  </span>
                  <span className="absolute inset-0 grid place-items-center bg-[#0d4697]/70 opacity-0 transition duration-300 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-urbanist text-sm font-extrabold text-[#0d4697]">
                      {live ? 'Open website' : 'View theme'} <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                  <div>
                    <h3 className="font-urbanist text-base font-extrabold text-slate-900">{business.name}</h3>
                    <p className="font-urbanist text-xs font-semibold text-slate-500">{business.tagline}</p>
                  </div>
                  <span className="h-2 w-8 shrink-0 rounded-full" style={{ background: business.accent }} />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
