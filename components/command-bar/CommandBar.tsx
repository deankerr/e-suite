'use client'

import React, { forwardRef } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Button, Theme } from '@radix-ui/themes'
import { Command } from 'cmdk'
import { SearchIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

export const CommandBar = ({
  title = 'no title',
  children,
  ...props
}: {
  title?: string
  children?: React.ReactNode
} & React.ComponentProps<typeof Popover.Root>) => {
  return (
    <Popover.Root {...props}>
      <Popover.Trigger asChild>
        <Button variant="outline" color="gold" aria-label="open menu" className="w-full max-w-96">
          {title}
        </Button>
      </Popover.Trigger>

      <Popover.Portal>
        <Theme>
          <Popover.Content className="w-96 max-w-full">
            <Command
              label="Command Menu"
              className="flex h-full w-full flex-col overflow-hidden rounded-lg border bg-gold-2 shadow-md"
            >
              <div className="flex items-center border-b px-3">
                <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Command.Input
                  className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-10 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Type a command or search..."
                />
              </div>

              <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                <Command.Empty className="py-6 text-center text-sm">
                  No results found.
                </Command.Empty>

                {children}
              </Command.List>
            </Command>
          </Popover.Content>
        </Theme>
      </Popover.Portal>
    </Popover.Root>
  )
}

type CommandGroupProps = { props?: unknown } & React.ComponentProps<typeof Command.Group>

export const CommandGroup = forwardRef<HTMLDivElement, CommandGroupProps>(function CommandGroup(
  { className, ...props },
  forwardedRef,
) {
  return (
    <Command.Group
      {...props}
      className={cn(
        'overflow-hidden p-1 text-gray-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-11',
        className,
      )}
      ref={forwardedRef}
    />
  )
})

type CommandItemProps = React.ComponentProps<typeof Command.Item>

export const CommandItem = forwardRef<HTMLDivElement, CommandItemProps>(function CommandItem(
  { className, ...props },
  forwardedRef,
) {
  return (
    <Command.Item
      {...props}
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-gray-11 outline-none aria-selected:bg-gold-3 aria-selected:text-gray-12 data-[disabled="false"]:pointer-events-auto data-[disabled="true"]:opacity-50',
        className,
      )}
      ref={forwardedRef}
    />
  )
})

type CommandSeparatorProps = React.ComponentProps<typeof Command.Separator>

export const CommandSeparator = forwardRef<HTMLDivElement, CommandSeparatorProps>(
  function CommandSeparator({ className, ...props }, forwardedRef) {
    return (
      <Command.Separator
        {...props}
        className={cn('-mx-1 h-px bg-gray-6', className)}
        ref={forwardedRef}
      />
    )
  },
)
