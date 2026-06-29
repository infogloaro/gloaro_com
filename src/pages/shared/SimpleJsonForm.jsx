import { useForm } from 'react-hook-form'
import FormField from '../../components/forms/FormField'

export default function SimpleJsonForm({ initialValues = {}, fields, onSubmit }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({ defaultValues: initialValues || {} })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((field) => (
        <FormField key={field.name} label={field.label || field.name}>
          {field.type === 'textarea' ? (
            <textarea {...register(field.name, field.rules)} rows={4} className="w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-[#0d4697]" />
          ) : field.type === 'select' ? (
            <select {...register(field.name, field.rules)} className="h-11 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-[#0d4697]">
              {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          ) : (
            <input {...register(field.name, field.rules)} type={field.type || 'text'} className="h-11 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-[#0d4697]" />
          )}
        </FormField>
      ))}
      <button disabled={isSubmitting} className="h-11 rounded-md bg-[#0d4697] px-5 text-sm font-extrabold text-white disabled:opacity-60">Save</button>
    </form>
  )
}
