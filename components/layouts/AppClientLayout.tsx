'use client'

// import { useConvex } from 'convex/react'
import dynamic from 'next/dynamic'

import { NonSecureAdminRoleOnly } from '@/components/util/NonSecureAdminRoleOnly'

const CommandBar = dynamic(
  () => import('@/components/command-bar/CommandBar').then((m) => m.CommandBar),
  { ssr: false },
)

export const AppClientLayout = () => {
  // const convex = useConvex()
  // convex.watchQuery()
  return (
    <>
      <NonSecureAdminRoleOnly>
        <CommandBar />
      </NonSecureAdminRoleOnly>
    </>
  )
}
