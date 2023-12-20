/* eslint-disable @typescript-eslint/no-unsafe-call */
'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function PrelineScript() {
  const path = usePathname()

  useEffect(() => {
    import('preline/preline')
  }, [])

  useEffect(() => {
    setTimeout(() => {
      // @ts-expect-error nothing suss
      HSStaticMethods.autoInit()
    }, 100)
  }, [path])

  return null
}
