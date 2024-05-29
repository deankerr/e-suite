import * as Popover from '@radix-ui/react-popover'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/Command'

import type { EThreadWithContent } from '@/convex/shared/structures'

type CommandMenuProps = { thread: EThreadWithContent } & React.ComponentProps<typeof Popover.Root>

export const CommandMenu = ({ children, ...props }: CommandMenuProps) => {
  return (
    <Popover.Root
      {...props}
      // open={open}
      // onOpenChange={(open) => {
      //   if (open) setPage('')
      //   setOpen(open)
      // }}
    >
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Content align="center" sideOffset={5} className="w-80">
        <Command>
          <CommandInput />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Actions">
              <CommandItem>Thread item</CommandItem>
              <CommandItem>Thread item2</CommandItem>
              <CommandItem>Thread item3</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </Popover.Content>
    </Popover.Root>
  )
}
