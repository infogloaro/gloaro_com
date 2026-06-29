import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'Search' }) {
  return (
    <label className="flex h-10 min-w-0 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-slate-500 shadow-sm">
      <Search className="h-4 w-4 shrink-0" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
      />
    </label>
  )
}
