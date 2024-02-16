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
        id="nav-rail"
        className={cn(
          'flex w-10 shrink-0 flex-col border-r sm:w-16',
          isRailExpanded && 'w-64',
          className,
        )}
        ref={forwardedRef}
      >
        <div className="overflow-hidden">
          <IconButton
            variant="ghost"
            className="h-16 w-full"
            onClick={() => setIsRailExpanded(!isRailExpanded)}
          >
            <Logo className="size-8 sm:size-10" />
          </IconButton>
        </div>

        <div className="overflow-hidden">
          <IconButton variant="ghost" className="h-12 w-full sm:h-14" asChild>
            <NextLink href="/threads">
              <MessagesSquareIcon className="stroke-[1.2] sm:scale-125" />
            </NextLink>
          </IconButton>
        </div>

        <div className="overflow-hidden">
          <IconButton variant="ghost" className="h-12 w-full sm:h-14" asChild>
            <NextLink href="/generations">
              <ImageIcon className="stroke-[1.2] sm:scale-125" />
            </NextLink>
          </IconButton>
        </div>

        <div id="nav-rail-space" className="grow" />

        <div id="nav-rail-footer" className="pb-4">
          <RailUserButton className="h-12 sm:h-14" />
        </div>
      </div>
    )
  },
)
