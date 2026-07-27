import { useEffect, useState } from 'react'
import api from '../../api/axios'

const defaultValue = {
  regionId: '',
  stateId: '',
  districtId: '',
  chapterId: '',
}

export default function OrganizationAssignmentFields({
  value = defaultValue,
  onChange,
  disabled = false,
  title = 'Location & Chapter Assignment',
  description,
  className = '',
  hideHeader = false,
}) {
  const currentValue = { ...defaultValue, ...value }
  const [regions, setRegions] = useState([])
  const [states, setStates] = useState([])
  const [districts, setDistricts] = useState([])
  const [chapters, setChapters] = useState([])

  useEffect(() => {
    let mounted = true
    api.get('/organization/regions')
      .then((res) => {
        if (!mounted) return
        setRegions(res.data?.data?.regions || [])
      })
      .catch(() => {
        if (!mounted) return
        setRegions([])
      })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    let mounted = true
    if (!currentValue.regionId) {
      setStates([])
      return () => {
        mounted = false
      }
    }

    api.get('/organization/states', { params: { regionId: currentValue.regionId } })
      .then((res) => {
        if (!mounted) return
        setStates(res.data?.data?.states || [])
      })
      .catch(() => {
        if (!mounted) return
        setStates([])
      })

    return () => {
      mounted = false
    }
  }, [currentValue.regionId])

  useEffect(() => {
    let mounted = true
    if (!currentValue.stateId) {
      setDistricts([])
      return () => {
        mounted = false
      }
    }

    api.get('/organization/districts', { params: { stateId: currentValue.stateId } })
      .then((res) => {
        if (!mounted) return
        setDistricts(res.data?.data?.districts || [])
      })
      .catch(() => {
        if (!mounted) return
        setDistricts([])
      })

    return () => {
      mounted = false
    }
  }, [currentValue.stateId])

  useEffect(() => {
    let mounted = true
    if (!currentValue.districtId) {
      setChapters([])
      return () => {
        mounted = false
      }
    }

    api.get('/organization/chapters', { params: { districtId: currentValue.districtId } })
      .then((res) => {
        if (!mounted) return
        setChapters(res.data?.data?.chapters || [])
      })
      .catch(() => {
        if (!mounted) return
        setChapters([])
      })

    return () => {
      mounted = false
    }
  }, [currentValue.districtId])

  const setLocation = (next) => {
    if (typeof onChange === 'function') {
      onChange(next)
    }
  }

  const content = (
    <div className={`space-y-4 ${className}`}>
      {!hideHeader && (
        <div className="border-b border-slate-100 pb-2">
          <h2 className="font-playfair text-xl font-black text-[#0d4697] flex items-center gap-2">
            {title}
          </h2>
        </div>
      )}
      {description ? <p className="text-xs font-semibold text-slate-500 leading-5">{description}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          label="Region *"
          value={currentValue.regionId}
          onChange={(regionId) => setLocation({ regionId, stateId: '', districtId: '', chapterId: '' })}
          placeholder="Select Region"
          options={regions.map((region) => ({ label: region.name, value: region._id }))}
          disabled={disabled}
        />
        <SelectField
          label="State *"
          value={currentValue.stateId}
          onChange={(stateId) => setLocation({ regionId: currentValue.regionId, stateId, districtId: '', chapterId: '' })}
          placeholder="Select State"
          options={states.map((state) => ({ label: state.name, value: state._id }))}
          disabled={disabled || !currentValue.regionId}
        />
        <SelectField
          label="District *"
          value={currentValue.districtId}
          onChange={(districtId) => setLocation({ regionId: currentValue.regionId, stateId: currentValue.stateId, districtId, chapterId: '' })}
          placeholder="Select District"
          options={districts.map((district) => ({ label: district.name, value: district._id }))}
          disabled={disabled || !currentValue.stateId}
        />
        <SelectField
          label="Chapter *"
          value={currentValue.chapterId}
          onChange={(chapterId) => setLocation({ regionId: currentValue.regionId, stateId: currentValue.stateId, districtId: currentValue.districtId, chapterId })}
          placeholder="Select Chapter"
          options={chapters.map((chapter) => ({ label: chapter.name, value: chapter._id }))}
          disabled={disabled || !currentValue.districtId}
          className="md:col-span-2"
        />
      </div>
    </div>
  )

  if (hideHeader) return content

  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      {content}
    </section>
  )
}

function SelectField({ label, placeholder, value, onChange, options = [], disabled = false, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-black text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="mt-1 h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-xs font-medium text-slate-500 outline-none focus:border-[#0d469e] disabled:opacity-50"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  )
}
