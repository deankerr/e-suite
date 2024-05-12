'use client'

import dynamic from 'next/dynamic'

import { NonSecureAdminRoleOnly } from '@/components/util/NonSecureAdminRoleOnly'

const CommandBar = dynamic(
  () => import('@/components/command-bar/CommandBar').then((m) => m.CommandBar),
  { ssr: false },
)

export const AppClientLayout = () => {
  return (
    <>
      <NonSecureAdminRoleOnly>
        <CommandBar />
      </NonSecureAdminRoleOnly>
    </>
  )
}
