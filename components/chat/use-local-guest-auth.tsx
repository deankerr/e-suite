import { getLocalStorage } from '@/lib/utils'
import { redirect, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export function useLocalGuestAuth(storageKey: string, redirectPath: string) {
  const keyParam = useSearchParams().get('key')

  useEffect(() => {
    if (keyParam) {
      const local = getLocalStorage()
      if (local) {
        const currentToken = local.getItem(storageKey)
        if (keyParam !== currentToken) {
          local.setItem(storageKey, keyParam)
          console.log('added token:', keyParam)
        }
      } else console.warn('localStorage not available')
      redirect(redirectPath)
    }
  }, [keyParam, storageKey, redirectPath])

  const local = getLocalStorage()
  if (!local) return 'no'
  return local.getItem(storageKey) ?? 'no'
}
