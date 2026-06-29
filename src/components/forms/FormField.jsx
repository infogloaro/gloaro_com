export default function FormField({ label, error, children }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-xs font-bold text-red-600">{error}</p>}
    </label>
  )
}
