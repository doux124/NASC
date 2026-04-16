import { useCallback, useRef, useState } from 'react'
import Papa from 'papaparse'

/**
 * Parses a CSV file and returns rows mapped through `transform`.
 * Returns drag-and-drop helpers + a hidden input ref.
 */
export function useCsvUpload({ onLoad, transform = (r) => r }) {
  const [drag, setDrag] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const parse = useCallback(
    (file) => {
      if (!file) return
      setError(null)
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: ({ data, errors }) => {
          if (errors?.length) {
            setError(errors[0].message || 'CSV parse error')
            return
          }
          try {
            onLoad(data.map(transform).filter(Boolean))
          } catch (err) {
            setError(err.message || 'Failed to process CSV')
          }
        },
        error: (err) => setError(err.message || 'Failed to read file'),
      })
    },
    [onLoad, transform]
  )

  const onDragOver = useCallback((e) => {
    e.preventDefault()
    setDrag(true)
  }, [])

  const onDragLeave = useCallback(() => setDrag(false), [])

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      setDrag(false)
      const file = e.dataTransfer.files?.[0]
      if (file) parse(file)
    },
    [parse]
  )

  const openPicker = useCallback(() => inputRef.current?.click(), [])

  const onInputChange = useCallback(
    (e) => {
      const file = e.target.files?.[0]
      if (file) parse(file)
      // allow re-selecting the same file later
      e.target.value = ''
    },
    [parse]
  )

  return {
    drag,
    error,
    inputRef,
    openPicker,
    onDragOver,
    onDragLeave,
    onDrop,
    onInputChange,
  }
}
