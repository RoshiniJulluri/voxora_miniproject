import { useState, useCallback } from 'react'

/**
 * Generic async-operation hook.
 * Returns { data, loading, error, execute }
 *
 * @param {Function} asyncFn  - The async function to execute
 */
export function useAsync(asyncFn) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true)
      setError(null)
      const result = await asyncFn(...args)
      setData(result)
      return result
    } catch (err) {
      setError(err.message || 'An unexpected error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }, [asyncFn])

  const reset = () => { setData(null); setError(null) }

  return { data, loading, error, execute, reset }
}
