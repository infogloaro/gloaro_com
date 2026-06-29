export default function StatCard({ label, value, helper, icon: Icon }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-950 dark:text-white">{value ?? 0}</p>
          {helper && <p className="mt-2 text-sm font-bold text-emerald-600">{helper}</p>}
        </div>
        {Icon && <span className="grid h-10 w-10 place-items-center rounded-md bg-[#eef4ff] text-[#1558b0]"><Icon className="h-5 w-5" /></span>}
      </div>
    </article>
  )
}
