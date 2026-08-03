export default function SectionWrapper({ id, bg = 'bg-white', className = '', children }) {
  return (
    <section id={id} className={`${bg} scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 md:py-20 ${className}`.trim()}>
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  )
}

