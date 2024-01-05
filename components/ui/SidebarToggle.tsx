'use client'

import { cn } from '@/lib/utils'
import * as Toggle from '@radix-ui/react-toggle'
import { IconButton } from '@radix-ui/themes'
import { SidebarCloseIcon, SidebarIcon, SidebarOpenIcon } from 'lucide-react'

export const SidebarToggleDemo = ({ className }: { className?: TailwindClass }) => (
  <IconButton variant="soft" asChild>
    <Toggle.Root
      aria-label="Toggle Sidebar"
      className={cn(
        'sidebar-toggle [&_svg:first-child]:data-[state=on]:hidden [&_svg:last-child]:data-[state=off]:hidden',
        className,
      )}
    >
      <SidebarOpenIcon />
      <SidebarCloseIcon />
    </Toggle.Root>
  </IconButton>
)
