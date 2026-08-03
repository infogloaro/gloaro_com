export default function SectionTitle({
  title,
  subtitle,
  description,
  centered = true,
  light = false,
}) {
  return (
    <div className={`${centered ? 'mx-auto text-center' : 'text-left'} mb-6 max-w-4xl`}>
      {subtitle && (
        <span className={`mb-1 block text-sm font-bold uppercase tracking-wider md:mb-2 ${light ? 'text-secondary' : 'text-secondary'}`}>
          {subtitle}
        </span>
      )}
      <h2 className={`text-2xl font-extrabold md:text-4xl lg:text-5xl ${light ? '!text-white' : 'text-primary'}`}>
        {title}
      </h2>
      <div className={`mt-6 h-1 w-20 rounded bg-secondary ${centered ? 'mx-auto' : ''}`} />
      {description && (
        <p className={`mt-4 text-base leading-relaxed md:text-lg ${light ? 'text-white/75' : 'text-slate-600'}`}>
          {description}
        </p>
      )}
    </div>
  )
}
