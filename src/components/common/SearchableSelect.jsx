import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'

export default function SearchableSelect({
  options = [],
  displayOptions,
  value = '',
  onChange,
  placeholder = 'Search or select',
  searchPlaceholder = 'Search',
  noOptionsMessage = 'No matching options',
  disabled = false,
  renderOptionMeta,
}) {
  const rootRef = useRef(null)
  const inputRef = useRef(null)
  const listboxId = useRef(`searchable-select-${Math.random().toString(36).slice(2, 9)}`)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const selectedOption = useMemo(
    () => options.find((option) => String(option.value) === String(value)) || null,
    [options, value]
  )

  useEffect(() => {
    if (!open) {
      setQuery(selectedOption?.label || '')
    }
  }, [open, selectedOption?.label])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOptions = useMemo(() => {
    const sourceOptions = Array.isArray(displayOptions) ? displayOptions : options
    const term = query.trim().toLowerCase()
    if (!term) return sourceOptions
    return sourceOptions.filter((option) => String(option.label || '').toLowerCase().includes(term))
  }, [displayOptions, options, query])

  useEffect(() => {
    if (!open) return
    setActiveIndex(filteredOptions.length ? 0 : -1)
  }, [filteredOptions, open])

  const commitSelection = (option) => {
    if (!option) return
    onChange?.(option.value)
    setQuery(option.label)
    setOpen(false)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  const handleKeyDown = (event) => {
    if (disabled) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((current) => (filteredOptions.length ? (current + 1) % filteredOptions.length : -1))
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((current) => (filteredOptions.length ? (current - 1 + filteredOptions.length) % filteredOptions.length : -1))
      return
    }

    if (event.key === 'Enter') {
      if (open && filteredOptions[activeIndex]) {
        event.preventDefault()
        commitSelection(filteredOptions[activeIndex])
      }
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      setQuery(selectedOption?.label || '')
      return
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <label className="block">
        <span className="text-sm font-extrabold text-slate-900">{placeholder}</span>
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            ref={inputRef}
            value={open ? query : (selectedOption?.label || query)}
            onChange={(event) => {
              setQuery(event.target.value)
              setOpen(true)
            }}
            onFocus={() => {
              if (disabled) return
              setOpen(true)
              setQuery(selectedOption?.label || query)
            }}
            onKeyDown={handleKeyDown}
            placeholder={searchPlaceholder}
            disabled={disabled}
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId.current}
            aria-autocomplete="list"
            aria-activedescendant={open && activeIndex >= 0 ? `${listboxId.current}-option-${activeIndex}` : undefined}
            className="h-11 w-full rounded-md border border-slate-200 bg-white pl-10 pr-20 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#0d4697] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          />
          <div className="absolute inset-y-0 right-0 flex items-center gap-1 px-3 text-slate-400">
            {value && !disabled && (
              <button
                type="button"
                onClick={() => {
                  onChange?.('')
                  setQuery('')
                  setOpen(false)
                  requestAnimationFrame(() => inputRef.current?.focus())
                }}
                className="rounded p-1 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Clear selection"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => !disabled && setOpen((current) => !current)}
              className="rounded p-1 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label={open ? 'Close options' : 'Open options'}
              disabled={disabled}
            >
              <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </label>

      {open && !disabled && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">
          <ul id={listboxId.current} role="listbox" className="max-h-64 overflow-auto py-1">
            {filteredOptions.length ? (
              filteredOptions.map((option, index) => {
                const isSelected = String(option.value) === String(value)
                const isActive = index === activeIndex
                return (
                  <li
                    key={option.value}
                    id={`${listboxId.current}-option-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(event) => {
                      event.preventDefault()
                      commitSelection(option)
                    }}
                    className={`cursor-pointer px-3 py-2 text-sm transition ${
                      isActive ? 'bg-[#0d4697] text-white' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold">{option.label}</p>
                        {renderOptionMeta?.(option) && (
                          <p className={`mt-1 text-xs font-semibold ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                            {renderOptionMeta(option)}
                          </p>
                        )}
                      </div>
                      {isSelected && <span className={`shrink-0 text-[10px] font-extrabold uppercase tracking-wide ${isActive ? 'text-white/80' : 'text-[#0d4697]'}`}>Selected</span>}
                    </div>
                  </li>
                )
              })
            ) : (
              <li className="px-3 py-4 text-sm font-semibold text-slate-500">{noOptionsMessage}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
