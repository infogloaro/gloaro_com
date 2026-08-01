export default function StatCard({ label, value, helper, icon: Icon }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-600">{label}</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{value ?? 0}</p>
          {helper && <p className="mt-2 text-xs font-bold text-[#0d4697]">{helper}</p>}
        </div>
        {Icon && <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#eef4ff] text-[#1558b0]"><Icon className="h-5 w-5" /></span>}
      </div>
    </article>
  )
}
