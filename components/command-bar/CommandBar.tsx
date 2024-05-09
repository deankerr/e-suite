'use client'

import { CommandBarPanels } from '@/components/command-bar/bar/CommandBarPanels'
import { CommandBarRail } from '@/components/command-bar/bar/CommandBarRail'
import { CommandBarShell } from '@/components/command-bar/bar/CommandBarShell'

export const CommandBar = () => {
  return <CommandBarShell rail={<CommandBarRail />} panels={<CommandBarPanels />} />
}
