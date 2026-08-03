const serviceItems = [
  'Membership', 'Referrals', 'Events', 'Meetings', 'Mobile App',
  'Analytics', 'Franchise', 'B2B solutions', 'Digital Marketing', 'Resources',
]

const loginLink = (type, redirect) => `/login?type=${type}&redirect=${encodeURIComponent(redirect)}`

export default function BusinessCategories({ className = '' }) {
  return (
    <section id="business-categories" className={`bg-[#0d4697] px-5 py-12 sm:py-16 lg:px-8 lg:py-12 ${className}`}>
      <div className="mx-auto max-w-7xl">
        <div className="text-center text-white">
          <h2 className="font-playfair text-4xl font-semibold italic sm:text-5xl">
            <span className="mr-3 align-middle text-xl not-italic sm:mr-6">—</span>
            <span className="text-[#ffae13]">Business</span> Categories
            <span className="ml-3 align-middle text-xl not-italic sm:ml-6">—</span>
          </h2>
          <p className="mt-1 font-urbanist text-base font-medium sm:text-lg">
            Explore business opportunities across the Gloaro network
          </p>
        </div>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-6 lg:gap-y-5">
          {serviceItems.map((service) => (
            <div
              key={service}
              className="flex min-h-20 items-center justify-between rounded-2xl border border-white/25 bg-white/15 px-7 font-playfair text-xl font-semibold italic text-white shadow-[inset_0_1px_12px_rgba(255,255,255,.12)]"
            >
              <span className={service === 'B2B solutions' || service === 'Digital Marketing' ? 'max-w-[88px] leading-5' : ''}>{service}</span>
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-sm not-italic text-[#0d4697]">›</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
