'use client'

import { useEffect } from 'react'
import { RedirectToSignIn, SignedOut } from '@clerk/nextjs'
import { useConvexAuth } from 'convex/react'
import { useRouter } from 'next/navigation'

import { SunBarLoader } from '@/components/ui/SunBarLoader'

export default function HomePage() {
  const { isAuthenticated } = useConvexAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard')
  }, [isAuthenticated, router])

  return (
    <>
      <SunBarLoader hideBars />
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
