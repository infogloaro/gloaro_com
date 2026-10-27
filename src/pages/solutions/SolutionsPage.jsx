import { Link } from 'react-router-dom'
import { businesses, isThemeLive } from '../../prototypes/catalog'

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-playfair text-4xl font-bold text-[#0d4697] md:text-5xl">Experience what your digital product could become</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Choose your business and explore a fully clickable prototype designed for your industry.</p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => {
            const liveCount = business.themes.filter((t) => isThemeLive(business.id, t.id)).length
            return (
              <Link
                key={business.id}
                to={`/solutions/${business.id}`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-2 w-12 rounded-full" style={{ background: business.accent }} />
                <h2 className="mt-4 text-xl font-bold text-slate-900">{business.name}</h2>
                <p className="mt-1 text-sm text-slate-600">{business.tagline}</p>
                <p className="mt-4 text-xs font-bold uppercase tracking-wide" style={{ color: business.accent }}>
                  {liveCount ? `${liveCount} live prototype${liveCount > 1 ? 's' : ''}` : `${business.themes.length} theme${business.themes.length > 1 ? 's' : ''}`}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
