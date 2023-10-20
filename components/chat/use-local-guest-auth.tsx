import { getLocalStorage } from '@/lib/utils'
import { redirect, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const authKey = 'e/suite-guest-auth-token'
const redirectTo = 'e'

export function useLocalGuestAuth() {
  const keyParam = useSearchParams().get('key')

  useEffect(() => {
    if (keyParam) {
      const local = getLocalStorage()
      if (local) {
        const currentToken = local.getItem(authKey)
        if (keyParam !== currentToken) {
          local.setItem(authKey, keyParam)
          console.log('added token:', keyParam)
        }
      } else console.warn('localStorage not available')
      redirect(redirectTo)
    }
  }, [keyParam])

  const local = getLocalStorage()
  if (!local) return 'no'
  return local.getItem(authKey) ?? 'no'
}
