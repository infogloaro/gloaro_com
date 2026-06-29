export default function ImageUpload({ label = 'Image', onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <input type="file" accept="image/*" onChange={(event) => onChange?.(event.target.files?.[0])} className="mt-1 block w-full rounded-md border border-slate-200 p-2 text-sm" />
    </label>
  )
}
