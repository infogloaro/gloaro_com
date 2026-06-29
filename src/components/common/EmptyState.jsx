import { Inbox } from 'lucide-react'

export default function EmptyState({ title = 'No records found', description = 'There is no data to show right now.' }) {
  return (
    <div className="grid min-h-52 place-items-center rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
      <div>
        <Inbox className="mx-auto h-9 w-9 text-slate-400" />
        <h3 className="mt-3 text-base font-extrabold text-slate-800">{title}</h3>
        <p className="mt-1 text-sm font-medium text-slate-500">{description}</p>
      </div>
    </div>
  )
}
