'use client'

import { CommandBarAlpha } from '@/components/command-bar/CommandBarAlpha'
import { ErrBoundary } from '@/components/util/ErrorBoundary'
import { NonSecureAdminRoleOnly } from '@/components/util/NonSecureAdminRoleOnly'

export const AppClientLayout = () => {
  return (
    <>
      <NonSecureAdminRoleOnly>
        <ErrBoundary>
          <CommandBarAlpha />
        </ErrBoundary>
      </NonSecureAdminRoleOnly>
    </>
  )
}
