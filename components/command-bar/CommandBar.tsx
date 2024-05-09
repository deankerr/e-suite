'use client'

import { CommandBarPanels } from '@/components/command-bar/bar/CommandBarPanels'
import { CommandBarRail } from '@/components/command-bar/bar/CommandBarRail'
import { CommandBarShell } from '@/components/command-bar/bar/CommandBarShell'
import { CmbrDebug } from '@/components/command-bar/CmbrDebug'
import { ErrBoundary } from '@/components/util/ErrorBoundary'

export const CommandBar = () => {
  return (
    <ErrBoundary>
      <CommandBarShell rail={<CommandBarRail />} panels={<CommandBarPanels />} />
      <CmbrDebug />
    </ErrBoundary>
  )
}
