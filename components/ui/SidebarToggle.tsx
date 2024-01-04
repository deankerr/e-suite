'use client'

import * as Toggle from '@radix-ui/react-toggle'
import { IconButton } from '@radix-ui/themes'
import { SidebarCloseIcon, SidebarIcon, SidebarOpenIcon } from 'lucide-react'

export const SidebarToggleDemo = () => (
  <IconButton variant="ghost" asChild>
    <Toggle.Root
      aria-label="Toggle Sidebar"
      className="sidebar-toggle fixed right-4 top-2 [&_svg:first-child]:data-[state=on]:hidden [&_svg:last-child]:data-[state=off]:hidden"
    >
      <SidebarOpenIcon />
      <SidebarCloseIcon />
    </Toggle.Root>
  </IconButton>
)
