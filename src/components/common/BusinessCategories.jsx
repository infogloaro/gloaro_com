const serviceItems = [
  'Membership',
  'Connects',
  'Events',
  'Meetings',
  'Mobile App',
  'Analytics',
  'Franchise',
  'B2B solutions',
  'Digital Marketing',
  'Resources',
]

export default function BusinessCategories({ className = '' }) {
  return (
    <section id="business-categories" className={`relative isolate overflow-hidden bg-[linear-gradient(180deg,#0d4697_0%,#0a357c_100%)] px-5 py-14 sm:py-16 lg:px-8 lg:py-20 ${className}`}>
      <div aria-hidden="true" className="absolute -left-20 top-8 h-56 w-56 rounded-full bg-[#ffae13]/12 blur-3xl" />
      <div aria-hidden="true" className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-white/8 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,174,19,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
          <div className="rounded-[34px] border border-white/10 bg-white/8 p-6 text-white shadow-[0_24px_70px_rgba(2,8,23,0.2)] backdrop-blur-sm sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#ffd36e]">
              Explore categories
            </div>
            <h2 className="mt-5 font-playfair text-4xl font-semibold italic leading-[0.92] sm:text-5xl lg:text-[58px]">
              <span className="text-[#ffae13]">Business</span> Categories
            </h2>
            <p className="mt-5 max-w-xl font-urbanist text-base font-medium leading-7 text-white/78 sm:text-lg">
              Explore business opportunities across the Gloaro network, from networking and referrals to digital growth, services, and expansion.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                ['Networking', 'Build trusted relationships'],
                ['Growth', 'Scale with the right tools'],
                ['Visibility', 'Showcase your business'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4">
                  <p className="text-sm font-extrabold text-white">{title}</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-white/70">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[34px] border border-white/10 bg-white/10 p-4 shadow-[0_24px_70px_rgba(2,8,23,0.2)] backdrop-blur-sm sm:p-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {serviceItems.map((service, index) => (
                <div
                  key={service}
                  className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.08))] px-5 py-4 text-white shadow-[inset_0_1px_12px_rgba(255,255,255,.08)] transition duration-300 hover:-translate-y-1 hover:border-[#ffae13]/35 hover:bg-white/16"
                >
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,transparent,#ffae13,transparent)] opacity-60" />
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ffd36e]">Category 0{index + 1}</p>
                      <p className={`mt-2 font-playfair text-xl font-semibold italic leading-tight ${service === 'B2B solutions' || service === 'Digital Marketing' ? 'max-w-[140px]' : ''}`}>
                        {service}
                      </p>
                    </div>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/10 text-lg font-black text-white transition duration-300 group-hover:translate-x-1 group-hover:bg-[#ffae13] group-hover:text-[#081a43]">
                      →
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-white/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ffae13]" />
                    Premium network category
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
