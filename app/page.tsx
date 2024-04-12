'use client'

import { useEffect } from 'react'
import { useConvexAuth } from 'convex/react'
import { useRouter } from 'next/navigation'

import { SunBarLoader } from '@/components/ui/SunBarLoader'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated } = useConvexAuth()

  useEffect(() => {
    if (isAuthenticated) router.replace('/profile')
  }, [isAuthenticated, router])

  return <SunBarLoader hideBars />
}
