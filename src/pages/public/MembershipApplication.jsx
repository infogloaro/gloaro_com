import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { BriefcaseBusiness, Building2, Camera, Globe2, MapPin, UserRound } from 'lucide-react'
import api from '../../api/axios'
import { useAuth } from '../../hooks/useAuth'
import { getMembershipDraft, saveMembershipDraft, setMembershipFile } from '../../utils/membershipOnboarding'
import LoadingScreen from '../../components/common/LoadingScreen'
import { ROLES } from '../../constants/roleConfig.js'

const expertise = ['Technology', 'Finance', 'Real Estate', 'Education', 'Marketing', 'Healthcare', 'Design', 'Manufacturing']
const industries = ['Technology', 'Finance', 'Real Estate', 'Education', 'Healthcare', 'Retail', 'Manufacturing', 'Construction', 'Hospitality', 'Legal Services', 'Marketing', 'Transportation']
const businessTypes = ['B2B Enterprise', 'B2C Business', 'D2C Brand', 'Startup', 'SME', 'Private Limited', 'LLP', 'Partnership', 'Sole Proprietorship', 'Franchise', 'Consultancy', 'Non Profit']

export default function MembershipApplication() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const draft = getMembershipDraft()
  const [personal, setPersonal] = useState(draft.personal || {})
  const [address, setAddress] = useState(draft.address || {})
  const [professional, setProfessional] = useState(draft.professional || { expertise: [] })
  const [loading, setLoading] = useState(true)
  const [savingDraft, setSavingDraft] = useState(false)
  const mobileDigits = String(personal.mobileNumber || '').replace(/\D/g, '')
  const mobileInvalid = Boolean(personal.mobileNumber) && (mobileDigits.length < 10 || mobileDigits.length > 15)

  const [regions, setRegions] = useState([])
  const [states, setStates] = useState([])
  const [districts, setDistricts] = useState([])
  const [chapters, setChapters] = useState([])

  const [selectedRegion, setSelectedRegion] = useState(draft.regionId || '')
  const [selectedState, setSelectedState] = useState(draft.stateId || '')
  const [selectedDistrict, setSelectedDistrict] = useState(draft.districtId || '')
  const [selectedChapter, setSelectedChapter] = useState(draft.chapterId || '')

  const isVicePresident = user?.role === ROLES.VICE_PRESIDENT
  const userOrg = user?.meta?.adminProfile?.organization || {}

  // 1. Fetch Regions & Existing Application Status
  useEffect(() => {
    api.get('/organization/regions')
      .then(res => {
        setRegions(res.data?.data?.regions || [])
      })
      .catch(() => {})

    // Redirect official roles who shouldn't apply
    if (user && ![ROLES.CUSTOMER, ROLES.USER, ROLES.VENDOR].includes(user.role)) {
      const roleDashboardMap = {
        [ROLES.VICE_PRESIDENT]: '/vice-president/dashboard',
        [ROLES.SECRETARY]: '/secretary/dashboard',
        [ROLES.CHAPTER_PRESIDENT]: '/president/dashboard',
        [ROLES.ADMIN]: '/admin',
        [ROLES.SUPERADMIN]: '/admin',
      }
      navigate(roleDashboardMap[user.role] || '/')
      return
    }

    const token = localStorage.getItem('gloaro_access_token') || sessionStorage.getItem('gloaro_access_token')
    if (!token) {
      setLoading(false)
      return
    }

    api.get('/membership-applications/my-application', { silent: true })
      .then(res => {
        const app = res.data?.data
        if (app) {
          if (!['draft', 'rejected', 'changes_requested'].includes(app.status)) {
            navigate('/member/membership-application-status')
            return
          }
          const loadedDraft = {
            personal: app.personal || {},
            address: app.address || {},
            professional: app.professional || {},
            regionId: app.regionId || '',
            stateId: app.stateId || '',
            districtId: app.districtId || '',
            chapterId: app.chapterId || '',
            credentials: app.credentials || {},
            references: app.references || [{}, {}],
            referralCode: app.referralCode || ''
          }
          localStorage.setItem('gloaro_membership_onboarding', JSON.stringify(loadedDraft))
          setPersonal(loadedDraft.personal)
          setAddress(loadedDraft.address)
          setProfessional(loadedDraft.professional)
          setSelectedRegion(loadedDraft.regionId)
          setSelectedState(loadedDraft.stateId)
          setSelectedDistrict(loadedDraft.districtId)
          setSelectedChapter(loadedDraft.chapterId)
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleSaveDraft = async (e) => {
    e?.preventDefault()
    setSavingDraft(true)
    try {
      const payload = {
        personal,
        address,
        professional,
        regionId: selectedRegion,
        stateId: selectedState,
        districtId: selectedDistrict,
        chapterId: selectedChapter,
        status: 'draft'
      }
      
      const formData = new FormData()
      formData.append('data', JSON.stringify(payload))
      
      await api.post('/membership-applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      // Update local storage too
      const current = getMembershipDraft()
      localStorage.setItem('gloaro_membership_onboarding', JSON.stringify({
        ...current,
        personal,
        address,
        professional,
        regionId: selectedRegion,
        stateId: selectedState,
        districtId: selectedDistrict,
        chapterId: selectedChapter
      }))

      toast.success('Application draft saved successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save draft application')
    } finally {
      setSavingDraft(false)
    }
  }

  // Auto-fill from Vice President details
  useEffect(() => {
    if (isVicePresident) {
      if (userOrg.region) {
        setSelectedRegion(userOrg.region)
        updateLocationDraft('regionId', userOrg.region)
      }
      if (userOrg.state) {
        setSelectedState(userOrg.state)
        updateLocationDraft('stateId', userOrg.state)
      }
      if (userOrg.district) {
        setSelectedDistrict(userOrg.district)
        updateLocationDraft('districtId', userOrg.district)
      }
      if (userOrg.chapter) {
        setSelectedChapter(userOrg.chapter)
        updateLocationDraft('chapterId', userOrg.chapter)
      }
    }
  }, [user, isVicePresident])

  // 2. Fetch States
  useEffect(() => {
    const rId = isVicePresident ? userOrg.region : selectedRegion
    if (!rId) {
      setStates([])
      return
    }
    api.get('/organization/states', { params: { regionId: rId } })
      .then(res => {
        setStates(res.data?.data?.states || [])
      })
      .catch(() => {})
  }, [selectedRegion, isVicePresident, userOrg.region])

  // 3. Fetch Districts
  useEffect(() => {
    const sId = isVicePresident ? userOrg.state : selectedState
    if (!sId) {
      setDistricts([])
      return
    }
    api.get('/organization/districts', { params: { stateId: sId } })
      .then(res => {
        setDistricts(res.data?.data?.districts || [])
      })
      .catch(() => {})
  }, [selectedState, isVicePresident, userOrg.state])

  // 4. Fetch Chapters
  useEffect(() => {
    const dId = isVicePresident ? userOrg.district : selectedDistrict
    if (!dId) {
      setChapters([])
      return
    }
    api.get('/organization/chapters', { params: { districtId: dId } })
      .then(res => {
        setChapters(res.data?.data?.chapters || [])
      })
      .catch(() => {})
  }, [selectedDistrict, isVicePresident, userOrg.district])

  const updateLocationDraft = (field, value) => {
    const draftData = getMembershipDraft()
    const next = { ...draftData, [field]: value }
    localStorage.setItem('gloaro_membership_onboarding', JSON.stringify(next))
  }

  const handleRegionChange = (val) => {
    setSelectedRegion(val)
    setSelectedState('')
    setSelectedDistrict('')
    setSelectedChapter('')
    setStates([])
    setDistricts([])
    setChapters([])
    
    updateLocationDraft('regionId', val)
    updateLocationDraft('stateId', '')
    updateLocationDraft('districtId', '')
    updateLocationDraft('chapterId', '')
  }

  const handleStateChange = (val) => {
    setSelectedState(val)
    setSelectedDistrict('')
    setSelectedChapter('')
    setDistricts([])
    setChapters([])

    updateLocationDraft('stateId', val)
    updateLocationDraft('districtId', '')
    updateLocationDraft('chapterId', '')
  }

  const handleDistrictChange = (val) => {
    setSelectedDistrict(val)
    setSelectedChapter('')
    setChapters([])

    updateLocationDraft('districtId', val)
    updateLocationDraft('chapterId', '')
  }

  const handleChapterChange = (val) => {
    setSelectedChapter(val)
    updateLocationDraft('chapterId', val)
  }

  const updateSection = (section, setter) => (field, value) => {
    setter((current) => {
      const next = { ...current, [field]: value }
      saveMembershipDraft(section, next)
      return next
    })
  }
  const updatePersonal = updateSection('personal', setPersonal)
  const updateAddress = updateSection('address', setAddress)
  const updateProfessional = updateSection('professional', setProfessional)

  const toggleExpertise = (item) => {
    setProfessional((current) => {
      const selected = new Set(current.expertise || [])
      if (selected.has(item)) selected.delete(item)
      else selected.add(item)
      const next = { ...current, expertise: Array.from(selected) }
      saveMembershipDraft('professional', next)
      return next
    })
  }

  if (loading) {
    return <LoadingScreen label="Resuming your application..." />
  }

  return (
    <main className="min-h-screen bg-[#fff9e8] px-4 py-4 font-playfair text-slate-950">
      <section className="mx-auto max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-black leading-none text-[#0b469e]">Join <span className="text-[#ff9f00]">GLOARO</span> Network</h1>
          <p className="mt-1 text-xs font-medium text-slate-600">Establish your professional identity within the Gloaro ecosystem</p>
        </div>

        <form className="mt-5 rounded-md border border-slate-200 bg-white px-6 py-5 shadow-sm" onSubmit={(event) => event.preventDefault()}>
          <ApplicationSection icon={UserRound} title="Personal Information">
            <div className="mb-5 flex items-center gap-4">
              <label className="grid h-16 w-16 cursor-pointer place-items-center rounded-full bg-slate-100 text-slate-400">
                <Camera className="h-5 w-5" />
                <input type="file" accept="image/*" className="hidden" onChange={(event) => setMembershipFile('profilePhoto', event.target.files?.[0])} />
              </label>
              <div>
                <p className="text-sm font-black text-slate-900">Profile Photo</p>
                <p className="text-xs font-medium text-slate-500">JPG, PNG, or GIF. Max 5MB.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full Name" value={personal.fullName || ''} onChange={(value) => updatePersonal('fullName', value)} placeholder="e.g. Alan Alexander" />
              <Field label="Date of Birth" type="date" value={personal.dateOfBirth || ''} onChange={(value) => updatePersonal('dateOfBirth', value)} />
              <SelectField label="Gender" value={personal.gender || ''} onChange={(value) => updatePersonal('gender', value)} placeholder="Select Gender" options={['Male', 'Female', 'Other']} />
              <Field label="Mobile Number" type="tel" value={personal.mobileNumber || ''} onChange={(value) => updatePersonal('mobileNumber', value.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, ''))} placeholder="+91 9876543210" pattern="^\\+?\\d{10,15}$" inputMode="tel" error={mobileInvalid ? 'Enter a valid mobile number with 10 to 15 digits.' : ''} />
              <Field label="Email Address" value={personal.emailAddress || ''} onChange={(value) => updatePersonal('emailAddress', value)} placeholder="alexander@gloaro.net" className="md:col-span-2" />
            </div>
          </ApplicationSection>

          <ApplicationSection icon={MapPin} title="Address Information">
            <div className="grid gap-4">
              <Field label="Address Line 1" value={address.line1 || ''} onChange={(value) => updateAddress('line1', value)} placeholder="Street name and number" />
              <Field label="Address Line 2 (Optional)" value={address.line2 || ''} onChange={(value) => updateAddress('line2', value)} placeholder="Suite, floor, or landmark" />
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="City" value={address.city || ''} onChange={(value) => updateAddress('city', value)} placeholder="New York" />
                <Field label="State" value={address.state || ''} onChange={(value) => updateAddress('state', value)} placeholder="NY" />
                <Field label="Pincode" value={address.pincode || ''} onChange={(value) => updateAddress('pincode', value)} placeholder="10001" />
              </div>
            </div>
          </ApplicationSection>

          <ApplicationSection icon={MapPin} title="Location & Chapter Assignment">
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Region *"
                value={selectedRegion}
                onChange={handleRegionChange}
                placeholder="Select Region"
                options={regions.map(r => ({ label: r.name, value: r._id }))}
                disabled={isVicePresident}
              />
              <SelectField
                label="State *"
                value={selectedState}
                onChange={handleStateChange}
                placeholder="Select State"
                options={states.map(s => ({ label: s.name, value: s._id }))}
                disabled={isVicePresident || !selectedRegion}
              />
              <SelectField
                label="District *"
                value={selectedDistrict}
                onChange={handleDistrictChange}
                placeholder="Select District"
                options={districts.map(d => ({ label: d.name, value: d._id }))}
                disabled={isVicePresident || !selectedState}
              />
              <SelectField
                label="Chapter *"
                value={selectedChapter}
                onChange={handleChapterChange}
                placeholder="Select Chapter"
                options={chapters.map(c => ({ label: c.name, value: c._id }))}
                disabled={isVicePresident || !selectedDistrict}
                className="md:col-span-2"
              />
            </div>
          </ApplicationSection>

          <ApplicationSection icon={BriefcaseBusiness} title="Professional Details">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Company Name" value={professional.companyName || ''} onChange={(value) => updateProfessional('companyName', value)} placeholder="Gloaro Venture Group" />
              <Field label="Designation" value={professional.designation || ''} onChange={(value) => updateProfessional('designation', value)} placeholder="Managing Partner" />
              <SelectField label="Industry Category" value={professional.industry || ''} onChange={(value) => updateProfessional('industry', value)} placeholder="Select Industry Category" options={industries} />
              <SelectField label="Business Type" value={professional.businessType || ''} onChange={(value) => updateProfessional('businessType', value)} placeholder="Select Business Type" options={businessTypes} />
              <Field label="Years of Experience" value={professional.yearsOfExperience || ''} onChange={(value) => updateProfessional('yearsOfExperience', value)} placeholder="12" className="md:col-span-2" />
              <TextArea label="Professional Background Summary" value={professional.backgroundSummary || ''} onChange={(value) => updateProfessional('backgroundSummary', value)} placeholder="Briefly describe your career journey and key achievements..." />
              <TextArea label="Why do you want to join Gloaro Network?" value={professional.joinReason || ''} onChange={(value) => updateProfessional('joinReason', value)} placeholder="What value do you seek and what value can you provide to the network?" />
            </div>
          </ApplicationSection>

          <ApplicationSection icon={Building2} title="Areas of Expertise">
            <p className="mb-2 text-xs font-black text-slate-700">Areas of Expertise *</p>
            <div className="flex flex-wrap gap-2">
              {expertise.map((item) => (
                <label key={item} className="inline-flex items-center gap-2 rounded-full bg-[#f1f2fb] px-3 py-1.5 text-xs font-semibold text-slate-700">
                  <input type="checkbox" checked={(professional.expertise || []).includes(item)} onChange={() => toggleExpertise(item)} className="h-3.5 w-3.5 accent-[#0b469e]" />
                  {item}
                </label>
              ))}
            </div>
          </ApplicationSection>

          <ApplicationSection icon={Globe2} title="Digital Presence">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Company Website" value={professional.companyWebsite || ''} onChange={(value) => updateProfessional('companyWebsite', value)} placeholder="https://www.company.com" className="md:col-span-2" />
              <Field label="LinkedIn Profile" value={professional.linkedInProfile || ''} onChange={(value) => updateProfessional('linkedInProfile', value)} placeholder="linkedin.com/in/username" />
              <Field label="Business Email" value={professional.businessEmail || ''} onChange={(value) => updateProfessional('businessEmail', value)} placeholder="mail@company.com" />
            </div>
          </ApplicationSection>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={handleSaveDraft} disabled={savingDraft} className="rounded-md border border-slate-300 bg-white px-5 py-2.5 text-xs font-extrabold text-slate-700 disabled:opacity-60">
            {savingDraft ? 'Saving Draft...' : 'Save Draft'}
          </button>
          <div className="flex gap-3">
            <Link to="/membership-agreement" className="rounded-md bg-[#ffbf1a] px-5 py-2.5 text-xs font-extrabold text-[#0b1f3d]">Step Back</Link>
            <Link to="/membership-qualification" className="rounded-md bg-[#0b469e] px-5 py-2.5 text-xs font-extrabold text-white">Next Step →</Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function ApplicationSection({ icon: Icon, title, children }) {
  return (
    <section className="border-b border-slate-200 py-5 first:pt-0 last:border-b-0 last:pb-0">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-950">
        <Icon className="h-4 w-4 text-[#0b469e]" />
        {title}
      </h2>
      {children}
    </section>
  )
}

function Field({ label, placeholder, type = 'text', value, onChange, className = '', pattern, inputMode, error }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-black text-slate-700">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} pattern={pattern} inputMode={inputMode} className={`mt-1 h-9 w-full rounded-md border px-3 text-xs font-medium outline-none focus:border-[#0b469e] ${error ? 'border-red-400' : 'border-slate-300'}`} />
      {error && <span className="mt-1 block text-xs font-semibold text-red-600">{error}</span>}
    </label>
  )
}

function SelectField({ label, placeholder, value, onChange, options = [placeholder], disabled, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-black text-slate-700">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} className="mt-1 h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-xs font-medium text-slate-500 outline-none focus:border-[#0b469e] disabled:opacity-50">
        <option value="">{placeholder}</option>
        {options.map((option) => {
          const optVal = typeof option === 'object' ? option.value : option;
          const optLbl = typeof option === 'object' ? option.label : option;
          return <option key={optVal} value={optVal}>{optLbl}</option>;
        })}
      </select>
    </label>
  )
}

function TextArea({ label, placeholder, value, onChange }) {
  return (
    <label className="block md:col-span-2">
      <span className="text-xs font-black text-slate-700">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-1 min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-xs font-medium outline-none focus:border-[#0b469e]" />
    </label>
  )
}
