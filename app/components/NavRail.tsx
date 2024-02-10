'use client'

import { cn } from '@/lib/utils'
import { ImageIcon, MessagesSquareIcon } from 'lucide-react'
import NextLink from 'next/link'
import { forwardRef, useState } from 'react'
import { RailUserButton } from './RailUserButton'
import { IconButton } from './ui/IconButton'
import { Logo } from './ui/Logo'

type Props = {}

export const NavRail = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function NavRail({ className, ...props }, forwardedRef) {
    const [isRailExpanded, setIsRailExpanded] = useState(false)

    return (
      <div
        {...props}
        className={cn('flex w-16 shrink-0 flex-col border-r', isRailExpanded && 'w-64', className)}
        ref={forwardedRef}
      >
        <div className="overflow-hidden">
          <IconButton
            variant="ghost"
            className="h-16 w-full"
            onClick={() => setIsRailExpanded(!isRailExpanded)}
          >
            <Logo className="size-10" />
          </IconButton>
        </div>

        <div className="overflow-hidden">
          <IconButton variant="ghost" className="h-14 w-full" asChild>
            <NextLink href="/threads">
              <MessagesSquareIcon className="scale-125 stroke-[1.2]" />
            </NextLink>
          </IconButton>
        </div>

        <div className="overflow-hidden">
          <IconButton variant="ghost" className="h-14 w-full" asChild>
            <NextLink href="/generations">
              <ImageIcon className="scale-125 stroke-[1.2]" />
            </NextLink>
          </IconButton>
        </div>

        <div id="nav-rail-space" className="grow" />

        <div id="nav-rail-footer" className="pb-4">
          <RailUserButton className="h-14" />
        </div>
      </div>
    )
  },
)
