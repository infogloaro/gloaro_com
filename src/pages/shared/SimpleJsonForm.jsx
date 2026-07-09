import { useForm } from 'react-hook-form'
import FormField from '../../components/forms/FormField'

export default function SimpleJsonForm({ initialValues = {}, fields, onSubmit }) {
  const defaultValues = { ...initialValues }
  fields.forEach((field) => {
    if (field.type === 'file') {
      delete defaultValues[field.name]
    }
  })

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({ defaultValues })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((field) => (
        <FormField key={field.name} label={field.label || field.name}>
          {field.type === 'textarea' ? (
            <textarea {...register(field.name, field.rules)} rows={4} className="w-full rounded-md border border-slate-300 bg-white text-black px-3 py-2 outline-none focus:border-[#0d4697]" />
          ) : field.type === 'select' ? (
            <select {...register(field.name, field.rules)} className="h-11 w-full rounded-md border border-slate-300 bg-white text-black px-3 outline-none focus:border-[#0d4697]">
              {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          ) : field.type === 'file' ? (
            <div className="space-y-2">
              <input
                type="file"
                {...register(field.name, field.rules)}
                accept={field.accept || 'image/*'}
                multiple={field.multiple}
                className="w-full text-xs font-semibold text-slate-500 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-extrabold file:bg-blue-50 file:text-[#0d4697] hover:file:bg-blue-100 cursor-pointer"
              />
              {((initialValues[field.name] && Array.isArray(initialValues[field.name])) || (initialValues.gallery && Array.isArray(initialValues.gallery))) && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {(initialValues[field.name] || initialValues.gallery || []).map((img, idx) => {
                    const url = img?.url || img
                    if (!url) return null
                    return (
                      <div key={idx} className="h-16 w-16 rounded-md overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                        <img src={url} alt="existing preview" className="h-full w-full object-cover" />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            <input {...register(field.name, field.rules)} type={field.type || 'text'} className="h-11 w-full rounded-md border border-slate-300 bg-white text-black px-3 outline-none focus:border-[#0d4697]" />
          )}
        </FormField>
      ))}
      <button disabled={isSubmitting} className="h-11 rounded-md bg-[#0d4697] px-5 text-sm font-extrabold text-white disabled:opacity-60">Save</button>
    </form>
  )
}
