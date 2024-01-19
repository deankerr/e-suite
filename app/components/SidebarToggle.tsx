'use client'

import { cn } from '@/lib/utils'
import * as Toggle from '@radix-ui/react-toggle'
import { IconButton } from '@radix-ui/themes'
import { SidebarCloseIcon, SidebarOpenIcon } from 'lucide-react'

export const SidebarToggleButton = ({ className }: { className?: TailwindClass }) => (
  <IconButton variant="ghost" asChild>
    <Toggle.Root
      aria-label="Toggle Sidebar"
      className={cn(
        '[&_svg:first-child]:data-[state=on]:hidden [&_svg:last-child]:data-[state=off]:hidden',
        className,
      )}
    >
      <SidebarOpenIcon />
      <SidebarCloseIcon />
    </Toggle.Root>
  </IconButton>
)
