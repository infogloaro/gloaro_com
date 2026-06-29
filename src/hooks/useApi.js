import { useCallback, useEffect, useRef, useState } from 'react'

export function useApi(request, deps = [], options = {}) {
  const [data, setData] = useState(options.initialData ?? null)
  const [loading, setLoading] = useState(Boolean(options.immediate ?? true))
  const [error, setError] = useState(null)
  const requestRef = useRef(request)
  const depKey = JSON.stringify(deps)

  useEffect(() => {
    requestRef.current = request
  }, [request])

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const response = await requestRef.current(...args)
      const payload = response.data
      setData(payload.data ?? payload)
      return payload
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (options.immediate === false) return
    const timer = window.setTimeout(() => execute(), 0)
    return () => window.clearTimeout(timer)
  }, [execute, options.immediate, depKey])

  return { data, loading, error, execute, setData }
}
