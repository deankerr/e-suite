'use client'

import { CommandBarPanels } from '@/components/command-bar/bar/CommandBarPanels'
import { CommandBarRail } from '@/components/command-bar/bar/CommandBarRail'
import { CommandBarShell } from '@/components/command-bar/bar/CommandBarShell'
import { CommandBarDebug } from '@/components/command-bar/CommandBarDebug'
import { ErrBoundary } from '@/components/util/ErrorBoundary'

export const CommandBar = () => {
  return (
    <ErrBoundary>
      <CommandBarShell rail={<CommandBarRail />} panels={<CommandBarPanels />} />
      <CommandBarDebug />
    </ErrBoundary>
  )
}
