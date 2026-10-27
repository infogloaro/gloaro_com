import { Link, Navigate, useParams } from 'react-router-dom'
import Seo from '../../components/Seo'
import { solutionSeo } from '../../lib/seoConfig'
import ThemePreview from '../../components/common/ThemePreview'
import { getBusiness, getThemeKey, isThemeLive, previewVariant } from '../../prototypes/catalog'

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
          {business.themes.map((theme, index) => {
            const live = isThemeLive(business.id, theme.id)
            const key = getThemeKey(business.id, theme.id)
            return (
              <article key={theme.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="relative aspect-[16/10] border-b border-slate-200" style={{ background: `linear-gradient(135deg, ${business.accent}, #0b0b0c)` }}>
                  {theme.thumb
                    ? <img src={theme.thumb} alt={`${theme.name} theme`} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
                    : <ThemePreview business={business} theme={theme} variant={previewVariant(business.id, index)} className="h-full w-full" />}
                  {live && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-800">
                      Interactive prototype
                    </span>
                  )}
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
