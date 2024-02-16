'use client'

import { cn } from '@/lib/utils'
import { BeakerIcon, ImageIcon, MessagesSquareIcon } from 'lucide-react'
import NextLink from 'next/link'
import { forwardRef } from 'react'
import { RailUserButton } from './RailUserButton'
import { IconButton } from './ui/IconButton'
import { Logo } from './ui/Logo'

type Props = {}

export const NavRail = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function NavRail({ className, ...props }, forwardedRef) {
    return (
      <div
        {...props}
        id="nav-rail"
        className={cn('flex w-10 shrink-0 flex-col border-r sm:w-16', className)}
        ref={forwardedRef}
      >
        <div className="overflow-hidden">
          <IconButton variant="ghost" className="h-16 w-full" asChild>
            <NextLink href="/">
              <Logo className="size-8 sm:size-10" />
            </NextLink>
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

        <div className="overflow-hidden">
          <IconButton variant="ghost" className="h-12 w-full sm:h-14" asChild>
            <NextLink href="/beta/thread/m17968tyj6hdg6g8ktbd7avzz56khqk4">
              <BeakerIcon className="stroke-[1.2] sm:scale-125" />
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
