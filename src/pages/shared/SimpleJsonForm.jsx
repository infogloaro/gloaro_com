import { useFieldArray, useForm } from 'react-hook-form'
import FormField from '../../components/forms/FormField'

export default function SimpleJsonForm({ initialValues = {}, fields, onSubmit }) {
  const defaultValues = { ...initialValues }
  fields.forEach((field) => {
    if (field.type === 'file') {
      delete defaultValues[field.name]
    }
  })

  const { register, control, handleSubmit, formState: { isSubmitting } } = useForm({ defaultValues })
  const assignmentField = fields.find((field) => field.type === 'assignment-list')
  const assignmentArray = useFieldArray({ control, name: assignmentField?.name || '__unusedAssignments' })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((field) => (
        <FormField key={field.name} label={field.label || field.name}>
          {field.type === 'textarea' ? (
            <div className="space-y-2"><textarea {...register(field.name, field.rules)} rows={4} className="w-full rounded-md border border-slate-300 bg-white text-black px-3 py-2 outline-none focus:border-[#0d4697]" />{field.name === 'metadata.dailyTaskUpdate' && <button type="submit" className="rounded-md bg-[#0d4697] px-4 py-2 text-xs font-extrabold text-white hover:bg-blue-800">Submit</button>}</div>
          ) : field.type === 'assignment-list' ? (
            <div className="space-y-3">
              {assignmentArray.fields.map((item, index) => (
                <div key={item.id} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input {...register(`${field.name}.${index}.name`)} placeholder={`Assignment ${index + 1} name`} className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-black outline-none focus:border-[#0d4697]" />
                    <input {...register(`${field.name}.${index}.link`)} type="url" placeholder="Assignment link" className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-black outline-none focus:border-[#0d4697]" />
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <button type="button" onClick={() => assignmentArray.remove(index)} className="text-xs font-bold text-red-600">Remove assignment</button>
                    <button type="submit" className="rounded-md bg-[#0d4697] px-3 py-1.5 text-xs font-extrabold text-white hover:bg-blue-800">Submit</button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => assignmentArray.append({ name: `Assignment ${assignmentArray.fields.length + 1}`, link: '' })} className="rounded-md border border-[#0d4697] px-3 py-2 text-xs font-extrabold text-[#0d4697]">+ Add assignment</button>
            </div>
          ) : field.type === 'multiselect' ? (
            <div className="max-h-44 space-y-2 overflow-y-auto rounded-md border border-slate-300 bg-white p-3">
              {field.options.map((option) => (
                <label key={option.value} className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700">
                  <input type="checkbox" value={option.value} {...register(field.name, field.rules)} className="h-4 w-4 accent-[#0d4697]" />
                  <span>{option.label}</span>
                </label>
              ))}
              {!field.options.length && <p className="text-xs font-semibold text-slate-500">No members available.</p>}
            </div>
          ) : field.type === 'select' ? (
            <select multiple={field.multiple} {...register(field.name, field.rules)} className={`${field.multiple ? 'min-h-28 py-2' : 'h-11'} w-full rounded-md border border-slate-300 bg-white text-black px-3 outline-none focus:border-[#0d4697]`}>
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
