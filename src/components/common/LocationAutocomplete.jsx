import { useEffect, useMemo, useRef, useState } from 'react'

const MY_LOCATION = { _id: '', name: 'My Location', label: 'My Location' }

function LocationAutocomplete({ options = [], value = '', onChange, loading = false }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(MY_LOCATION.label)
  const [activeIndex, setActiveIndex] = useState(-1)
  const rootRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const selected = useMemo(
    () => (value ? options.find((option) => String(option._id) === String(value)) : null),
    [options, value],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((option) =>
      [option.name, option.districtName, option.stateName]
        .filter(Boolean)
        .some((part) => part.toLowerCase().includes(q)),
    )
  }, [query, options])

  const items = useMemo(() => {
    if (query.trim()) return filtered
    return [MY_LOCATION, ...filtered]
  }, [query, filtered])

  const displayText = selected ? selected.label : MY_LOCATION.label
  const displayTextRef = useRef(displayText)

  useEffect(() => {
    displayTextRef.current = displayText
  }, [displayText])

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [open])

  useEffect(() => {
    const onMouseDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false)
        setQuery(displayTextRef.current)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  useEffect(() => {
    if (!open) return
    const node = listRef.current?.querySelector(`[data-index="${activeIndex}"]`)
    node?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  const selectItem = (item) => {
    onChange(item ? item._id : '')
    setQuery(item ? item.label : MY_LOCATION.label)
    setOpen(false)
  }

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!open) {
          setOpen(true)
          setActiveIndex(-1)
          return
        }
        setActiveIndex((index) => (index + 1) % items.length)
        break
      case 'ArrowUp':
        event.preventDefault()
        if (!open) return
        setActiveIndex((index) => (index - 1 + items.length) % items.length)
        break
      case 'Enter':
        event.preventDefault()
        if (!open) {
          setOpen(true)
          return
        }
        if (items.length === 0) return
        selectItem(items[activeIndex >= 0 ? activeIndex : 0])
        break
      case 'Escape':
        event.preventDefault()
        setOpen(false)
        setQuery(displayText)
        break
      default:
        break
    }
  }

  return (
    <div ref={rootRef} className="relative w-full sm:w-80">
      <input
        id="nearby-location-select"
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls="nearby-location-listbox"
        aria-autocomplete="list"
        aria-activedescendant={open && activeIndex >= 0 ? `nearby-location-option-${activeIndex}` : undefined}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setActiveIndex(-1)
          if (!open) setOpen(true)
        }}
        onFocus={(event) => {
          setOpen(true)
          event.target.select()
        }}
        onClick={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search chapter, district or state..."
        className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none focus:border-[#0d4697]"
      />
      {open && (
        <ul
          id="nearby-location-listbox"
          ref={listRef}
          role="listbox"
          className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg"
        >
          {loading && options.length === 0 ? (
            <li className="px-3 py-2 text-sm font-semibold text-slate-500">Loading locations...</li>
          ) : items.length === 0 ? (
            <li className="px-3 py-2 text-sm font-semibold text-slate-500">No locations found</li>
          ) : (
            items.map((item, index) => (
              <li
                key={item._id || 'my-location'}
                id={`nearby-location-option-${index}`}
                role="option"
                aria-selected={activeIndex === index}
                data-index={index}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectItem(item)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`cursor-pointer px-3 py-2 text-sm font-semibold ${activeIndex === index ? 'bg-[#0d4697] text-white' : 'text-slate-700'}`}
              >
                {item._id === '' ? '📍 My Location' : item.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}

export default LocationAutocomplete
