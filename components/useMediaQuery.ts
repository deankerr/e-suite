import { useCallback, useSyncExternalStore } from 'react'

export const useMediaQuery = (query: string, defaultValue = false) => {
  const subscribe = useCallback(
    (callback: () => void) => {
      const matchMedia = window.matchMedia(query)

      matchMedia.addEventListener('change', callback)
      return () => {
        matchMedia.removeEventListener('change', callback)
      }
    },
    [query],
  )

  const getSnapshot = () => {
    return window.matchMedia(query).matches
  }

  const getServerSnapshot = () => defaultValue

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
