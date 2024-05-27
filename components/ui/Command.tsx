import { forwardRef } from 'react'
import { Command as Cmdk } from 'cmdk'
import { SearchIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

type CommandProps = { props?: unknown } & React.ComponentProps<typeof Cmdk>

export const Command = ({ children, className, ...props }: CommandProps) => {
  return (
    <Cmdk
      label="Command Menu"
      {...props}
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-md border border-grayA-8 bg-gray-2',
        className,
      )}
    >
      <div className="flex items-center border-b px-3">
        <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <Cmdk.Input
          className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-10 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Type a command or search..."
        />
      </div>

      <Cmdk.List className="h-[--cmdk-list-height] max-h-[300px] overflow-y-auto overflow-x-hidden transition-[height_100ms_ease]">
        <Cmdk.Empty className="py-6 text-center text-sm">No results found.</Cmdk.Empty>

        {children}
      </Cmdk.List>
    </Cmdk>
  )
}

export const CommandGroup = forwardRef<HTMLDivElement, React.ComponentProps<typeof Cmdk.Group>>(
  function CommandGroup({ className, ...props }, forwardedRef) {
    return (
      <Cmdk.Group
        {...props}
        className={cn(
          'overflow-hidden p-1 text-gray-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-11',
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

export const CommandItem = forwardRef<HTMLDivElement, React.ComponentProps<typeof Cmdk.Item>>(
  function CommandItem({ className, ...props }, forwardedRef) {
    return (
      <Cmdk.Item
        {...props}
        className={cn(
          'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-gray-11 outline-none aria-selected:bg-gold-3 aria-selected:text-gray-12 data-[disabled="false"]:pointer-events-auto data-[disabled="true"]:opacity-50',
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

export const CommandSeparator = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Cmdk.Separator>
>(function CommandSeparator({ className, ...props }, forwardedRef) {
  return (
    <Cmdk.Separator
      {...props}
      className={cn('-mx-1 h-px bg-gray-6', className)}
      ref={forwardedRef}
    />
  )
})
