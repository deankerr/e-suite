'use client'

import { useIsClient } from '@uidotdev/usehooks'

export const ClientOnly = ({ children }: { children?: React.ReactNode }) => {
  const isClient = useIsClient()
  return isClient ? children : null
}
