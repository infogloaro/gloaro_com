import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  FileText,
  User,
  Building2,
  MapPin,
  Globe,
  Upload,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  UsersRound,
  ArrowRight,
  ShieldAlert,
  ArrowLeft,
  Clock
} from 'lucide-react'
import api from '../../api/axios'
import { submitForm } from '../../lib/submitForm'
import LoadingScreen from '../../components/common/LoadingScreen'
import { customerApi } from '../../api/customer'
import toast from 'react-hot-toast'
import StatusBadge from '../../components/common/StatusBadge'
import OrganizationAssignmentFields from '../../components/forms/OrganizationAssignmentFields'
import { useAuth } from '../../hooks/useAuth'
import { getEffectiveRegistrationType, getVendorOnboardingRoutes } from '../../utils/onboarding'
import { storage } from '../../utils/storage'

const BUSINESS_TYPES = ['Private Limited', 'Partnership', 'Sole Proprietorship', 'LLP', 'One Person Company', 'Other']

export default function VendorApplicationForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState([])
  const [step, setStep] = useState(1)
  const onboardingType = getEffectiveRegistrationType(user, storage.getOnboardingContext()?.registrationType)
  const isVendorOnlineFlow = onboardingType === 'vendor'
  const isVendorRoute = location.pathname.startsWith('/vendor/')
  const vendorRoutes = getVendorOnboardingRoutes(isVendorRoute || isVendorOnlineFlow)
  const applicationPath = vendorRoutes.application
  const statusPath = vendorRoutes.status

  // Current Application details
  const [appId, setAppId] = useState(null)
  const [isAlreadyApproved, setIsAlreadyApproved] = useState(false)
  const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false)
  const [app, setApp] = useState(null)
  
  // Step 1: Agreements
  const [step1, setStep1] = useState({
    vendorResponsibilities: false,
    marketplaceStandards: false,
    commissionPaymentTerms: false,
    productServiceGuidelines: false,
    privacyPolicy: false,
    termsConditions: false,
    finalDeclaration: false,
    fullName: '',
    signature: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
  })



  // Step 2: Personal & Business Info
  const [step2, setStep2] = useState({
    personal: {
      fullName: '',
      dateOfBirth: '',
      gender: '',
      mobileNumber: '',
      email: '',
    },
    address: {
      line1: '',
      line2: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
    },
    details: {
      businessName: '',
      businessCategory: '',
      businessType: 'Private Limited',
      yearsOfExperience: '',
      professionalBackground: '',
      whyJoinGloaro: '',
    },
    digitalPresence: {
      website: '',
      googleBusinessProfile: '',
      instagram: '',
      businessEmail: '',
    },
  })
  const [organization, setOrganization] = useState({
    regionId: '',
    stateId: '',
    districtId: '',
    chapterId: '',
  })

  // Step 3: Verification
  const [step3, setStep3] = useState({
    credentials: {
      businessRegistrationNumber: '',
      gstNumber: '',
      panNumber: '',
      businessType: 'Private Limited',
    },
    references: [
      { fullName: '', companyName: '', relationship: '', phoneNumber: '', emailAddress: '' },
      { fullName: '', companyName: '', relationship: '', phoneNumber: '', emailAddress: '' },
    ],
    vendorPoliciesAccepted: false,
  })

  // Uploaded files
  const [files, setFiles] = useState({
    profilePhoto: null,
    registrationCertificate: null,
    gstCertificate: null,
    businessLogo: null,
    ownerIdProof: null,
    shopPhoto: null,
  })

  // Load existing application & category options
  useEffect(() => {
    if (isVendorOnlineFlow && !isVendorRoute) {
      navigate(applicationPath, { replace: true })
      return
    }

    const initLoad = async () => {
      try {
        setLoading(true)
        // 1. Fetch categories
        const catRes = await customerApi.categories({ limit: 100 })
        setCategories(catRes.data?.data || catRes.data || [])

        // 2. Fetch my vendor application
        const appRes = await api.get('/vendor-applications/my-application')
        const application = appRes.data?.data
        if (application) {
          setApp(application)
          setAppId(application._id)
          setStep(application.step || 1)
          if (application.status === 'approved') {
            setIsAlreadyApproved(true)
            setLoading(false)
            return
          } else if (['pending_vp_review', 'submitted', 'under_review'].includes(application.status)) {
            setIsAlreadySubmitted(true)
            setLoading(false)
            return
          } else if (application.status !== 'draft') {
            // Already submitted (other statuses, e.g., rejected) - redirect to status page
            navigate(statusPath, { replace: true })
            return
          }

          // Populate step 1
          if (application.step1) {
            setStep1({
              ...step1,
              ...application.step1,
            })
          }

          // Populate step 2
          if (application.step2) {
            setStep2({
              personal: { ...step2.personal, ...application.step2.personal },
              address: { ...step2.address, ...application.step2.address },
              details: {
                ...step2.details,
                ...application.step2.details,
                businessCategory: application.step2.details?.businessCategory?._id || application.step2.details?.businessCategory || '',
              },
              digitalPresence: { ...step2.digitalPresence, ...application.step2.digitalPresence },
            })
          }
          setOrganization({
            regionId: application.regionId || '',
            stateId: application.stateId || '',
            districtId: application.districtId || '',
            chapterId: application.chapterId || '',
          })

          // Populate step 3
          if (application.step3) {
            setStep3({
              credentials: { ...step3.credentials, ...application.step3.credentials },
              references: application.step3.references?.length === 2 ? application.step3.references : step3.references,
              vendorPoliciesAccepted: application.step3.vendorPoliciesAccepted || false,
            })
          }
        }
      } catch (err) {
        // No application exists - that's fine, proceed with clean form
        console.log('No existing application found, starting new wizard.')
      } finally {
        setLoading(false)
      }
    }
    initLoad()
  }, [applicationPath, isVendorOnlineFlow, isVendorRoute, navigate, statusPath])

  const handleFileChange = (field, e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFiles((prev) => ({ ...prev, [field]: file }))
    }
  }

  const buildFormData = () => {
    const formData = new FormData()
    const cleanedStep2 = {
      ...step2,
      details: {
        ...step2.details,
        businessCategory: step2.details.businessCategory || null,
      },
    }
    formData.append('data', JSON.stringify({
      step,
      step1,
      step2: cleanedStep2,
      step3,
      regionId: organization.regionId || null,
      stateId: organization.stateId || null,
      districtId: organization.districtId || null,
      chapterId: organization.chapterId || null,
    }))

    // Append file binaries
    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file)
      }
    })

    return formData
  }

  const saveDraft = async (showToast = true) => {
    setSaving(true)
    try {
      const data = buildFormData()
      const res = await api.post('/vendor-applications/my-application', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.data?.data?._id) {
        setAppId(res.data.data._id)
      }
      if (showToast) toast.success('Draft saved successfully!')
      return true
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save draft.')
      return false
    } finally {
      setSaving(false)
    }
  }

  const handleNext = async () => {
    // Validate current step before proceeding
    if (step === 1) {
      const allChecked = step1.vendorResponsibilities && step1.marketplaceStandards &&
                         step1.commissionPaymentTerms && step1.productServiceGuidelines &&
                         step1.privacyPolicy && step1.termsConditions && step1.finalDeclaration
      if (!allChecked) {
        toast.error('Please accept all vendor policies and declarations.')
        return
      }
      if (!step1.fullName || !step1.signature) {
        toast.error('Signature fields are required.')
        return
      }
    }

    if (step === 2) {
      if (!step2.personal.fullName || !step2.personal.mobileNumber || !step2.personal.email) {
        toast.error('Please fill in all personal contact details.')
        return
      }
      if (!step2.address.line1 || !step2.address.city || !step2.address.pincode) {
        toast.error('Please fill in business address details.')
        return
      }
      if (!step2.details.businessName || !step2.details.businessCategory) {
        toast.error('Please select business name and category.')
        return
      }
      if (!organization.regionId || !organization.stateId || !organization.districtId || !organization.chapterId) {
        toast.error('Please select Region, State, District, and Chapter.')
        return
      }
    }

    // Save and increment step
    const success = await saveDraft(false)
    if (success) {
      setStep((prev) => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async () => {
    // Step 3 final validations
    if (!step3.credentials.businessRegistrationNumber || !step3.credentials.panNumber) {
      toast.error('Business Registration and PAN Number are required.')
      return
    }
    
    // Check if files exist (either already uploaded or selected now)
    const hasRegCert = files.registrationCertificate || appId // Re-use draft if already created
    const hasPan = files.ownerIdProof || appId
    const hasShop = files.shopPhoto || appId

    if (!hasRegCert || !hasPan || !hasShop) {
      toast.error('Please upload required verification documents (Registration certificate, ID proof, Shop photo).')
      return
    }

    // Validate references
    const ref1 = step3.references[0]
    const ref2 = step3.references[1]
    if (!ref1.fullName || !ref1.phoneNumber || !ref2.fullName || !ref2.phoneNumber) {
      toast.error('Please add details for both Reference Contacts.')
      return
    }

    if (!step3.vendorPoliciesAccepted) {
      toast.error('Please accept vendor policies agreement.')
      return
    }

    setSaving(true)
    try {
      const data = buildFormData()
      await api.post('/vendor-applications/my-application/submit', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      submitForm('Vendor application', {
        Name: step2.personal.fullName,
        Mobile: step2.personal.mobileNumber,
        Email: step2.personal.email,
        Business: step2.details.businessName,
        Category: step2.details.businessCategory,
      })
      toast.success('Application submitted successfully!')
      navigate(statusPath, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingScreen label="Setting up onboarding portal..." />
  }

  if (isAlreadyApproved) {
    return (
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full p-3 shadow-inner bg-emerald-50 dark:bg-emerald-950/30">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          
          <h2 className="mt-6 text-2xl font-black text-slate-900 dark:text-white">
            Application Approved
          </h2>
          
          <p className="mt-4 text-sm font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
            You are already approved as a verified vendor in the Gloaro Network!
          </p>

          <div className="mt-6 inline-flex flex-col items-center justify-center gap-2 rounded-xl bg-slate-50 border border-slate-100 p-4 w-full dark:bg-slate-950 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 text-center max-w-sm">
              Your vendor profile is active. You can list products, manage orders, and edit your shop configuration from your dashboard.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/member/products')}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-[#0d4697] px-6 py-2.5 text-sm font-extrabold text-white hover:bg-blue-800 transition duration-150 ease-in-out shadow-md"
            >
              Manage Products
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate(statusPath)}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-extrabold text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-750 transition duration-150 ease-in-out shadow-sm"
            >
              View Application Details
            </button>
          </div>
        </section>
      </div>
    )
  }

  if (isAlreadySubmitted) {
    return (
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full p-3 shadow-inner bg-blue-50 dark:bg-blue-950/30">
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
          
          <h2 className="mt-6 text-2xl font-black text-slate-900 dark:text-white">
            Application Submitted
          </h2>
          
          <p className="mt-4 text-sm font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
            Your vendor application has already been submitted and is currently awaiting review.
          </p>

          <div className="mt-6 inline-flex flex-col items-center justify-center gap-2 rounded-xl bg-slate-50 border border-slate-100 p-4 w-full dark:bg-slate-950 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Current Status:
              </span>
              <StatusBadge value={app ? app.status : 'Submitted'} />
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 text-center max-w-sm mt-1">
              The Unit Vice Chairman is reviewing your credentials. You will be notified once the decision is finalized.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(statusPath)}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-[#0d4697] px-6 py-2.5 text-sm font-extrabold text-white hover:bg-blue-800 transition duration-150 ease-in-out shadow-md"
            >
              Track Application Status
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('/member/dashboard')}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-extrabold text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-750 transition duration-150 ease-in-out shadow-sm"
            >
              Go to Dashboard
            </button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Wizard Header bar */}
      <header className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0d4697]">
            Onboarding Portfolio
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Become a GLOARO Vendor</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">List your business and reach customers through Gloaro.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-400">STEP {step} OF 3</span>
          <div className="flex gap-1">
            {[1, 2, 3].map((s) => (
              <span key={s} className={`h-2.5 w-10 rounded-full transition-all duration-300 ${s <= step ? 'bg-[#0d4697]' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>
      </header>

      {/* STEP 1: Agreement & Policies */}
      {step === 1 && (
        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <h2 className="font-playfair text-xl font-black text-[#0d4697] border-b border-slate-100 pb-2 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Vendor Agreement & Marketplace Policies
            </h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 text-xs font-semibold text-slate-600 leading-6">
              <PolicySection title="1. Vendor Responsibilities" content="Vendors are responsible for providing authentic business listings, details, and products. Fulfill orders and services within agreed timelines." />
              <PolicySection title="2. Marketplace Standards" content="Maintain professional ethics, avoid fraudulent reviews or listings, and ensure customer satisfaction to retain vendor authorization status." />
              <PolicySection title="3. Commission & Payment Terms" content="Commission structures and transaction terms are handled dynamically as agreed upon. Service settlements are processed according to Gloaro terms." />
              <PolicySection title="4. Product & Service Guidelines" content="All listings must be genuine, legally compliant, and match professional standards. Counterfeit listings will result in prompt deactivation." />
            </div>

            <div className="border-t border-slate-100 pt-5 space-y-3">
              <Checkbox label="I accept all Vendor Responsibilities and requirements" checked={step1.vendorResponsibilities} onChange={(checked) => setStep1(p => ({ ...p, vendorResponsibilities: checked }))} />
              <Checkbox label="I agree to follow the Marketplace Standards" checked={step1.marketplaceStandards} onChange={(checked) => setStep1(p => ({ ...p, marketplaceStandards: checked }))} />
              <Checkbox label="I accept Commission and dynamic Payment Terms" checked={step1.commissionPaymentTerms} onChange={(checked) => setStep1(p => ({ ...p, commissionPaymentTerms: checked }))} />
              <Checkbox label="I agree to follow Product and Service Guidelines" checked={step1.productServiceGuidelines} onChange={(checked) => setStep1(p => ({ ...p, productServiceGuidelines: checked }))} />
              <Checkbox label="I accept Gloaro Privacy Policy & GDPR clauses" checked={step1.privacyPolicy} onChange={(checked) => setStep1(p => ({ ...p, privacyPolicy: checked }))} />
              <Checkbox label="I agree to general Marketplace Terms & Conditions" checked={step1.termsConditions} onChange={(checked) => setStep1(p => ({ ...p, termsConditions: checked }))} />
              <Checkbox label="Final Declaration: All details supplied in this wizard are true and correct" checked={step1.finalDeclaration} onChange={(checked) => setStep1(p => ({ ...p, finalDeclaration: checked }))} />
            </div>
          </section>

          {/* Electronic Signature details */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">Electronic Signature Declaration</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Full Legal Name</label>
                <input
                  type="text"
                  value={step1.fullName}
                  onChange={(e) => {
                    const val = e.target.value
                    setStep1(p => ({ ...p, fullName: val }))
                  }}
                  className="h-10 w-full rounded-md border border-slate-300 px-3 text-xs text-slate-900 outline-none focus:border-[#0d4697]"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Digital Signature Text</label>
                <input
                  type="text"
                  value={step1.signature}
                  onChange={(e) => {
                    const val = e.target.value
                    setStep1(p => ({ ...p, signature: val }))
                  }}
                  className="h-10 w-full rounded-md border border-slate-300 px-3 text-xs text-slate-900 font-playfair italic outline-none focus:border-[#0d4697]"
                  placeholder="Type signature initials"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Signing Date</label>
                <input
                  type="date"
                  value={step1.date}
                  onChange={(e) => {
                    const val = e.target.value
                    setStep1(p => ({ ...p, date: val }))
                  }}
                  className="h-10 w-full rounded-md border border-slate-300 px-3 text-xs text-slate-900 outline-none focus:border-[#0d4697]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Location</label>
                <input
                  type="text"
                  value={step1.location}
                  onChange={(e) => {
                    const val = e.target.value
                    setStep1(p => ({ ...p, location: val }))
                  }}
                  className="h-10 w-full rounded-md border border-slate-300 px-3 text-xs text-slate-900 outline-none focus:border-[#0d4697]"
                  placeholder="Signing location"
                />
              </div>
            </div>
          </section>
        </div>
      )}

      {/* STEP 2: Personal & Business Information */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Personal Info */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-playfair text-xl font-black text-[#0d4697] border-b border-slate-100 pb-2 flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </h2>
            
            {/* Profile Photo upload */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="grid h-16 w-16 place-items-center rounded-xl bg-slate-100 border border-dashed border-slate-300 text-slate-400 shrink-0">
                {files.profilePhoto ? (
                  <img src={URL.createObjectURL(files.profilePhoto)} alt="Avatar Preview" className="h-full w-full rounded-xl object-cover" />
                ) : (
                  <Upload className="h-6 w-6" />
                )}
              </div>
              <div className="space-y-1 flex-1">
                <label className="text-xs font-bold text-slate-700">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('profilePhoto', e)}
                  className="mt-1 block w-full text-xs font-semibold text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-extrabold file:bg-blue-50 file:text-[#0d4697] hover:file:bg-blue-100"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput label="Full Name" value={step2.personal.fullName} onChange={(val) => setStep2(p => ({ ...p, personal: { ...p.personal, fullName: val } }))} />
              <FormInput label="Date of Birth" type="date" value={step2.personal.dateOfBirth} onChange={(val) => setStep2(p => ({ ...p, personal: { ...p.personal, dateOfBirth: val } }))} />
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Gender</label>
                <select
                  value={step2.personal.gender}
                  onChange={(e) => setStep2(p => ({ ...p, personal: { ...p.personal, gender: e.target.value } }))}
                  className="h-10 w-full rounded-md border border-slate-300 px-3 text-xs text-slate-900 outline-none focus:border-[#0d4697]"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <FormInput label="Mobile Number" value={step2.personal.mobileNumber} onChange={(val) => setStep2(p => ({ ...p, personal: { ...p.personal, mobileNumber: val } }))} />
              <div className="space-y-1 sm:col-span-2">
                <FormInput label="Email Address" type="email" value={step2.personal.email} onChange={(val) => setStep2(p => ({ ...p, personal: { ...p.personal, email: val } }))} />
              </div>
            </div>
          </section>

          {/* Address Details */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-playfair text-xl font-black text-[#0d4697] border-b border-slate-100 pb-2 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Business Address Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <FormInput label="Business Address Line 1" value={step2.address.line1} onChange={(val) => setStep2(p => ({ ...p, address: { ...p.address, line1: val } }))} />
              </div>
              <div className="sm:col-span-3">
                <FormInput label="Business Address Line 2 (Optional)" value={step2.address.line2} onChange={(val) => setStep2(p => ({ ...p, address: { ...p.address, line2: val } }))} />
              </div>
              <div className="sm:col-span-3">
                <FormInput label="Business Landmark (Optional)" value={step2.address.landmark} onChange={(val) => setStep2(p => ({ ...p, address: { ...p.address, landmark: val } }))} />
              </div>
              <FormInput label="City" value={step2.address.city} onChange={(val) => setStep2(p => ({ ...p, address: { ...p.address, city: val } }))} />
              <FormInput label="State" value={step2.address.state} onChange={(val) => setStep2(p => ({ ...p, address: { ...p.address, state: val } }))} />
              <FormInput label="Pincode" value={step2.address.pincode} onChange={(val) => setStep2(p => ({ ...p, address: { ...p.address, pincode: val } }))} />
            </div>
          </section>

          <OrganizationAssignmentFields
            value={organization}
            onChange={(next) => setOrganization(next)}
            title="Organization Assignment"
            description="Select the hierarchy that your vendor application should be attached to."
          />

          {/* Business Details */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-playfair text-xl font-black text-[#0d4697] border-b border-slate-100 pb-2 flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Business Details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormInput label="Business Name" value={step2.details.businessName} onChange={(val) => setStep2(p => ({ ...p, details: { ...p.details, businessName: val } }))} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Category</label>
                <select
                  value={step2.details.businessCategory}
                  onChange={(e) => setStep2(p => ({ ...p, details: { ...p.details, businessCategory: e.target.value } }))}
                  className="h-10 w-full rounded-md border border-slate-300 px-3 text-xs text-slate-900 outline-none focus:border-[#0d4697]"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Business Type</label>
                <select
                  value={step2.details.businessType}
                  onChange={(e) => setStep2(p => ({ ...p, details: { ...p.details, businessType: e.target.value } }))}
                  className="h-10 w-full rounded-md border border-slate-300 px-3 text-xs text-slate-900 outline-none focus:border-[#0d4697]"
                >
                  {BUSINESS_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <FormInput label="Years of Experience" type="number" value={step2.details.yearsOfExperience} onChange={(val) => setStep2(p => ({ ...p, details: { ...p.details, yearsOfExperience: val } }))} />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-500">Professional Background Summary</label>
                <textarea
                  value={step2.details.professionalBackground}
                  onChange={(e) => setStep2(p => ({ ...p, details: { ...p.details, professionalBackground: e.target.value } }))}
                  rows={4}
                  className="w-full rounded-md border border-slate-300 p-3 text-xs text-slate-900 outline-none focus:border-[#0d4697]"
                  placeholder="Tell us about your products or services..."
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-500">Why do you want to join GLOARO Marketplace?</label>
                <textarea
                  value={step2.details.whyJoinGloaro}
                  onChange={(e) => setStep2(p => ({ ...p, details: { ...p.details, whyJoinGloaro: e.target.value } }))}
                  rows={4}
                  className="w-full rounded-md border border-slate-300 p-3 text-xs text-slate-900 outline-none focus:border-[#0d4697]"
                  placeholder="What value do you seek and what value can you provide?"
                />
              </div>
            </div>
          </section>

          {/* Digital Presence */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-playfair text-xl font-black text-[#0d4697] border-b border-slate-100 pb-2 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Digital Business Presence
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput label="Company Website" value={step2.digitalPresence.website} onChange={(val) => setStep2(p => ({ ...p, digitalPresence: { ...p.digitalPresence, website: val } }))} />
              <FormInput label="Google Business Profile URL" value={step2.digitalPresence.googleBusinessProfile} onChange={(val) => setStep2(p => ({ ...p, digitalPresence: { ...p.digitalPresence, googleBusinessProfile: val } }))} />
              <FormInput label="Instagram Profile URL" value={step2.digitalPresence.instagram} onChange={(val) => setStep2(p => ({ ...p, digitalPresence: { ...p.digitalPresence, instagram: val } }))} />
              <FormInput label="Business Email" type="email" value={step2.digitalPresence.businessEmail} onChange={(val) => setStep2(p => ({ ...p, digitalPresence: { ...p.digitalPresence, businessEmail: val } }))} />
            </div>
          </section>
        </div>
      )}

      {/* STEP 3: Business Verification & Uploads */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Credentials */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-playfair text-xl font-black text-[#0d4697] border-b border-slate-100 pb-2 flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Business Credentials
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput label="Business Registration Number" value={step3.credentials.businessRegistrationNumber} onChange={(val) => setStep3(p => ({ ...p, credentials: { ...p.credentials, businessRegistrationNumber: val } }))} />
              <FormInput label="GST Number (Optional)" value={step3.credentials.gstNumber} onChange={(val) => setStep3(p => ({ ...p, credentials: { ...p.credentials, gstNumber: val } }))} />
              <FormInput label="PAN Number" value={step3.credentials.panNumber} onChange={(val) => setStep3(p => ({ ...p, credentials: { ...p.credentials, panNumber: val } }))} />
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Business Type</label>
                <select
                  value={step3.credentials.businessType}
                  onChange={(e) => setStep3(p => ({ ...p, credentials: { ...p.credentials, businessType: e.target.value } }))}
                  className="h-10 w-full rounded-md border border-slate-300 px-3 text-xs text-slate-900 outline-none focus:border-[#0d4697]"
                >
                  {BUSINESS_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* File Upload Grid */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">Business Verification Documents</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <FileUploadField label="Registration Certificate (PDF/Image)" file={files.registrationCertificate} onChange={(e) => handleFileChange('registrationCertificate', e)} />
              <FileUploadField label="GST Certificate (Optional, PDF/Image)" file={files.gstCertificate} onChange={(e) => handleFileChange('gstCertificate', e)} />
              <FileUploadField label="Business Logo (Image)" file={files.businessLogo} onChange={(e) => handleFileChange('businessLogo', e)} />
              <FileUploadField label="Owner ID Proof (PAN/Aadhaar, PDF/Image)" file={files.ownerIdProof} onChange={(e) => handleFileChange('ownerIdProof', e)} />
              <FileUploadField label="Shop / Office Photo (Image)" file={files.shopPhoto} onChange={(e) => handleFileChange('shopPhoto', e)} />
            </div>
          </section>

          {/* Business References */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">Business Partner References</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Reference 1 */}
              <div className="space-y-3 rounded-lg border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-[#0d4697]">Reference Contact 1</p>
                <FormInput label="Full Name" value={step3.references[0].fullName} onChange={(val) => {
                  const refs = [...step3.references]
                  refs[0].fullName = val
                  setStep3(p => ({ ...p, references: refs }))
                }} />
                <FormInput label="Company Name" value={step3.references[0].companyName} onChange={(val) => {
                  const refs = [...step3.references]
                  refs[0].companyName = val
                  setStep3(p => ({ ...p, references: refs }))
                }} />
                <FormInput label="Relationship" value={step3.references[0].relationship} onChange={(val) => {
                  const refs = [...step3.references]
                  refs[0].relationship = val
                  setStep3(p => ({ ...p, references: refs }))
                }} />
                <FormInput label="Phone Number" value={step3.references[0].phoneNumber} onChange={(val) => {
                  const refs = [...step3.references]
                  refs[0].phoneNumber = val
                  setStep3(p => ({ ...p, references: refs }))
                }} />
                <FormInput label="Email Address" type="email" value={step3.references[0].emailAddress} onChange={(val) => {
                  const refs = [...step3.references]
                  refs[0].emailAddress = val
                  setStep3(p => ({ ...p, references: refs }))
                }} />
              </div>

              {/* Reference 2 */}
              <div className="space-y-3 rounded-lg border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-[#0d4697]">Reference Contact 2</p>
                <FormInput label="Full Name" value={step3.references[1].fullName} onChange={(val) => {
                  const refs = [...step3.references]
                  refs[1].fullName = val
                  setStep3(p => ({ ...p, references: refs }))
                }} />
                <FormInput label="Company Name" value={step3.references[1].companyName} onChange={(val) => {
                  const refs = [...step3.references]
                  refs[1].companyName = val
                  setStep3(p => ({ ...p, references: refs }))
                }} />
                <FormInput label="Relationship" value={step3.references[1].relationship} onChange={(val) => {
                  const refs = [...step3.references]
                  refs[1].relationship = val
                  setStep3(p => ({ ...p, references: refs }))
                }} />
                <FormInput label="Phone Number" value={step3.references[1].phoneNumber} onChange={(val) => {
                  const refs = [...step3.references]
                  refs[1].phoneNumber = val
                  setStep3(p => ({ ...p, references: refs }))
                }} />
                <FormInput label="Email Address" type="email" value={step3.references[1].emailAddress} onChange={(val) => {
                  const refs = [...step3.references]
                  refs[1].emailAddress = val
                  setStep3(p => ({ ...p, references: refs }))
                }} />
              </div>
            </div>
          </section>

          {/* Vendor Policies Checkbox */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">Marketplace Vendor Policies</h3>
            <div className="rounded-lg bg-slate-50 p-4 text-xs font-semibold text-slate-500 leading-5">
              <p>By submitting this application, you agree to comply with GLOARO marketplace standards, pricing rules, and verification requirements. False information may result in automatic rejection.</p>
            </div>
            <Checkbox label="I accept and agree to all Marketplace Vendor Policies" checked={step3.vendorPoliciesAccepted} onChange={(checked) => setStep3(p => ({ ...p, vendorPoliciesAccepted: checked }))} />
          </section>
        </div>
      )}

      {/* Buttons */}
      <footer className="flex flex-col justify-between sm:flex-row gap-3 pt-4 border-t border-slate-200">
        <div className="flex gap-2">
          {step > 1 && (
            <button
              disabled={saving}
              onClick={() => setStep((p) => p - 1)}
              className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-5 text-sm font-extrabold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>
          )}
          <button
            disabled={saving}
            onClick={() => saveDraft(true)}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-extrabold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Save Draft
          </button>
        </div>

        <div>
          {step < 3 ? (
            <button
              disabled={saving}
              onClick={handleNext}
              className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-[#0d4697] px-6 text-sm font-extrabold text-white hover:bg-blue-800 disabled:opacity-60 w-full sm:w-auto"
            >
              Next Step
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              disabled={saving}
              onClick={handleSubmit}
              className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-emerald-600 px-6 text-sm font-extrabold text-white hover:bg-emerald-700 disabled:opacity-60 w-full sm:w-auto"
            >
              <CheckCircle2 className="h-4 w-4" />
              Submit Application
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}

function PolicySection({ title, content }) {
  return (
    <div className="space-y-1">
      <h4 className="font-extrabold text-slate-800">{title}</h4>
      <p className="leading-relaxed">{content}</p>
    </div>
  )
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0d4697] focus:ring-blue-500"
      />
      <span className="text-xs font-extrabold text-slate-700">{label}</span>
    </label>
  )
}

function FormInput({ label, type = 'text', value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-slate-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-md border border-slate-300 px-3 text-xs text-slate-900 outline-none focus:border-[#0d4697]"
      />
    </div>
  )
}

function FileUploadField({ label, file, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-slate-500">{label}</label>
      <div className="relative flex h-10 w-full items-center justify-between rounded-md border border-slate-300 px-3 bg-white">
        <span className="truncate text-xs font-semibold text-slate-500 pr-4">
          {file ? file.name : 'No file selected'}
        </span>
        <label className="grid h-full place-items-center px-3 border-l border-slate-300 hover:bg-slate-50 cursor-pointer shrink-0">
          <Upload className="h-4 w-4 text-slate-400" />
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={onChange}
            className="hidden"
          />
        </label>
      </div>
    </div>
  )
}
