import { Link, Navigate, useParams } from 'react-router-dom'
import Seo from '../../components/Seo'
import { solutionSeo } from '../../lib/seoConfig'
import { getBusiness, getThemeKey, isThemeLive } from '../../prototypes/catalog'

export default function BusinessThemesPage() {
  const { businessId } = useParams()
  const business = getBusiness(businessId)
  if (!business) return <Navigate to="/solutions" replace />

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16">
      <Seo {...solutionSeo(business)} />
      <div className="mx-auto max-w-6xl">
        <Link to="/solutions" className="text-sm font-bold text-[#0d4697]">← All businesses</Link>
        <h1 className="mt-4 font-playfair text-4xl font-bold text-slate-900">{business.name}</h1>
        <p className="mt-2 text-slate-600">{business.tagline}</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {business.themes.map((theme) => {
            const live = isThemeLive(business.id, theme.id)
            const key = getThemeKey(business.id, theme.id)
            return (
              <article key={theme.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div
                  className="grid h-48 place-items-center text-sm font-bold uppercase tracking-widest text-white"
                  style={{ background: `linear-gradient(135deg, ${business.accent}, #0b0b0c)` }}
                >
                  {live ? 'Interactive prototype' : 'Coming soon'}
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-bold text-slate-900">{theme.name}</h2>
                  <p className="text-xs text-slate-500">Theme ID: {key}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {live ? (
                      <Link to={`/prototypes/${business.id}/${theme.id}`} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white">
                        Open prototype
                      </Link>
                    ) : (
                      <span className="rounded-full bg-slate-200 px-4 py-2 text-sm font-bold text-slate-500">Prototype in progress</span>
                    )}
                    <Link to={`/contact?theme=${encodeURIComponent(key)}`} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800">
                      Book this theme
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </main>
  )
}
