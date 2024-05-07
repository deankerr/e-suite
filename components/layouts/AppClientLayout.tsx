'use client'

import { CommandBarAlpha } from '@/components/command-bar/CommandBarAlpha'
import { ErrBoundary } from '@/components/util/ErrorBoundary'

export const AppClientLayout = () => {
  return (
    <>
      <ErrBoundary>
        <CommandBarAlpha />
      </ErrBoundary>
    </>
  )
}
