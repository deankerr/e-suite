'use client'

import { CommandBar } from '@/components/command-bar/CommandBar'
import { ErrBoundary } from '@/components/util/ErrorBoundary'
import { NonSecureAdminRoleOnly } from '@/components/util/NonSecureAdminRoleOnly'

export const AppClientLayout = () => {
  return (
    <>
      <NonSecureAdminRoleOnly>
        <ErrBoundary>
          <CommandBar />
        </ErrBoundary>
      </NonSecureAdminRoleOnly>
    </>
  )
}
