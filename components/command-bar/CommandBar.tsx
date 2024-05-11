'use client'

import { CommandBarShell } from '@/components/command-bar/bar/CommandBarShell'
import { CommandBarDebug } from '@/components/command-bar/CommandBarDebug'
import { ErrBoundary } from '@/components/util/ErrorBoundary'

export const CommandBar = () => {
  return (
    <ErrBoundary>
      <CommandBarShell />
      <CommandBarDebug />
    </ErrBoundary>
  )
}
