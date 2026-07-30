import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { Home, MapPinned, Pencil, User } from 'lucide-react'
import { customerApi } from '../../api/customer'
import LoadingScreen from '../../components/common/LoadingScreen'
import FormField from '../../components/forms/FormField'
import { formatDate } from '../../utils/format'

function SummaryCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-100 text-amber-700">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-black text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  )
}

export function CustomerDashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    customerApi.dashboard()
      .then((response) => setData(response.data?.data || null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingScreen label="Loading customer dashboard..." />

  const summary = data?.summary || {}

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-[linear-gradient(135deg,_#0d4697,_#1d4ed8)] p-8 text-white shadow-xl">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-100">Customer Dashboard</p>
        <h1 className="mt-3 font-playfair text-4xl font-bold">Welcome, {data?.welcomeName || 'Customer'}.</h1>
        <p className="mt-3 max-w-2xl text-sm font-medium text-blue-50">Your account foundation is live. From here you can keep personal details current and maintain your saved delivery addresses.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard icon={MapPinned} label="Saved Addresses" value={summary.addressCount || 0} />
        <SummaryCard icon={Home} label="Default Addresses" value={summary.defaultAddressCount || 0} />
        <SummaryCard icon={User} label="Member Since" value={summary.memberSince ? formatDate(summary.memberSince) : '-'} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-900">Quick Links</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(data?.quickLinks || []).map((link) => (
            <Link key={link.path} to={link.path} className="rounded-2xl border border-slate-200 px-5 py-4 text-sm font-bold text-slate-700 transition hover:border-[#0d4697] hover:text-[#0d4697]">
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export function CustomerProfileFoundationPage() {
  const [loading, setLoading] = useState(true)
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm()

  useEffect(() => {
    customerApi.profile()
      .then((response) => {
        const user = response.data?.data?.user || {}
        reset({
          fullName: user.name || '',
          email: user.email || '',
          mobileNumber: user.phone || '',
        })
      })
      .finally(() => setLoading(false))
  }, [reset])

  const onSubmit = async (values) => {
    await customerApi.updateProfile(values)
    toast.success('Customer profile updated')
  }

  if (loading) return <LoadingScreen label="Loading customer profile..." />

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-black text-slate-900">Customer Profile</h1>
      <p className="mt-1 text-sm font-medium text-slate-500">Update your basic customer information.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <FormField label="Full Name">
          <input {...register('fullName')} className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-[#0d4697]" />
        </FormField>
        <FormField label="Email">
          <input {...register('email')} type="email" className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-[#0d4697]" />
        </FormField>
        <FormField label="Mobile Number">
          <input {...register('mobileNumber')} className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-[#0d4697]" />
        </FormField>
        <button disabled={isSubmitting} className="h-11 rounded-md bg-[#0d4697] px-5 text-sm font-extrabold text-white disabled:opacity-60">
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}

const ADDRESS_FIELDS = [
  { name: 'label', label: 'Label' },
  { name: 'fullName', label: 'Recipient Name' },
  { name: 'phone', label: 'Phone' },
  { name: 'line1', label: 'Address Line 1' },
  { name: 'line2', label: 'Address Line 2' },
  { name: 'landmark', label: 'Landmark' },
  { name: 'city', label: 'City' },
  { name: 'state', label: 'State' },
  { name: 'country', label: 'Country' },
  { name: 'pincode', label: 'Pincode' },
]

export function CustomerAddressesPage() {
  const [loading, setLoading] = useState(true)
  const [addresses, setAddresses] = useState([])
  const [editingAddress, setEditingAddress] = useState(null)
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: { country: 'India' },
  })

  const loadAddresses = async () => {
    const response = await customerApi.addresses()
    const nextAddresses = response.data?.data?.addresses || []
    setAddresses(nextAddresses)
    return nextAddresses
  }

  useEffect(() => {
    loadAddresses().finally(() => setLoading(false))
  }, [])

  const startEdit = (address) => {
    setEditingAddress(address)
    reset({
      label: address.label || '',
      fullName: address.fullName || '',
      phone: address.phone || '',
      line1: address.line1 || '',
      line2: address.line2 || '',
      landmark: address.landmark || '',
      city: address.city || '',
      state: address.state || '',
      country: address.country || 'India',
      pincode: address.pincode || '',
      isDefault: address.isDefault || false,
    })
  }

  const clearForm = () => {
    setEditingAddress(null)
    reset({ country: 'India', isDefault: false })
  }

  const onSubmit = async (values) => {
    if (editingAddress?._id) {
      await customerApi.updateAddress(editingAddress._id, values)
      toast.success('Address updated')
    } else {
      await customerApi.createAddress(values)
      toast.success('Address added')
    }
    await loadAddresses()
    clearForm()
  }

  const onDelete = async (id) => {
    await customerApi.deleteAddress(id)
    toast.success('Address deleted')
    await loadAddresses()
    if (editingAddress?._id === id) clearForm()
  }

  const onSetDefault = async (id) => {
    await customerApi.setDefaultAddress(id)
    toast.success('Default address updated')
    await loadAddresses()
  }

  if (loading) return <LoadingScreen label="Loading addresses..." />

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Address Management</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">Add, edit, delete, and set your default address for future checkout phases.</p>
        </div>
        {addresses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-sm font-semibold text-slate-500">No saved addresses yet.</div>
        ) : (
          addresses.map((address) => (
            <div key={address._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-black text-slate-900">{address.label || 'Address'}</p>
                    {address.isDefault && <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">Default</span>}
                  </div>
                  <p className="mt-1 text-sm font-bold text-slate-700">{address.fullName} | {address.phone}</p>
                </div>
                <div className="flex gap-2">
                  {!address.isDefault && (
                    <button type="button" onClick={() => onSetDefault(address._id)} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-extrabold text-slate-700">
                      Set Default
                    </button>
                  )}
                  <button type="button" onClick={() => startEdit(address)} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-extrabold text-slate-700">
                    <span className="inline-flex items-center gap-1"><Pencil className="h-3.5 w-3.5" /> Edit</span>
                  </button>
                  <button type="button" onClick={() => onDelete(address._id)} className="rounded-md border border-red-200 px-3 py-2 text-xs font-extrabold text-red-600">
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                {[address.line1, address.line2, address.landmark, address.city, address.state, address.country, address.pincode].filter(Boolean).join(', ')}
              </p>
            </div>
          ))
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-900">{editingAddress ? 'Edit Address' : 'Add Address'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
          {ADDRESS_FIELDS.map((field) => (
            <FormField key={field.name} label={field.label}>
              <input {...register(field.name)} className="h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-[#0d4697]" />
            </FormField>
          ))}
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <input type="checkbox" {...register('isDefault')} className="accent-[#0d4697]" />
            Set as default address
          </label>
          <div className="flex gap-3">
            <button disabled={isSubmitting} className="h-11 rounded-md bg-[#0d4697] px-5 text-sm font-extrabold text-white disabled:opacity-60">
              {isSubmitting ? 'Saving...' : editingAddress ? 'Update Address' : 'Add Address'}
            </button>
            {editingAddress && (
              <button type="button" onClick={clearForm} className="h-11 rounded-md border border-slate-200 px-5 text-sm font-extrabold text-slate-700">
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  )
}
