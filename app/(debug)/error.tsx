'use client'

import { useEffect } from 'react'

import { SunBarLoader } from '@/components/ui/SunBarLoader'

export default function Error({
  error,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return <SunBarLoader />
}
