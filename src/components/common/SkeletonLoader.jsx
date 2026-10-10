export default function SkeletonLoader({ rows = 4 }) {
  return (
    <div className="space-y-3" aria-busy="true">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="skeleton-shimmer h-14 rounded-md bg-slate-100" />
      ))}
    </div>
  )
}
