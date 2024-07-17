'use client'

import { List } from '@phosphor-icons/react/dist/ssr'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Dialog, IconButton, Inset } from '@radix-ui/themes'
import { useKeyboardEvent } from '@react-hookz/web'
import { useAtom } from 'jotai'

import { AppLogoName } from '@/components/ui/AppLogoName'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/Command'
import { commandShellOpenAtom } from '@/lib/atoms'
import { cn } from '@/lib/utils'

const groupStyle =
  '[&_[cmdk-group-heading]]:px-1 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2'

const inputStyle = '[&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12'

const itemStyle =
  '[&_[cmdk-item]]:px-4 [&_[cmdk-item]]:py-2.5 [&_[cmdk-item]]:opacity-90 aria-selected:[&_[cmdk-item]]:opacity-100 [&_[cmdk-item]_svg]:size-4 aria-selected:[&_[cmdk-item]]:bg-grayA-3 aria-selected:[&_[cmdk-item]]:text-white [&_[cmdk-item]]:gap-4 [&_[cmdk-item]]:rounded'

export const CommandShell = (props: { button?: React.ReactNode }) => {
  const [open, setOpen] = useAtom(commandShellOpenAtom)

  useKeyboardEvent('k', (e) => {
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault()
      setOpen(!open)
    }
  })

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        {props.button ?? (
          <IconButton variant="ghost" className="shrink-0">
            <List className="size-6" />
          </IconButton>
        )}
      </Dialog.Trigger>
      <Dialog.Content aria-describedby={undefined}>
        <Dialog.Title className="sr-only">Command Menu</Dialog.Title>

        <Inset side="top" className="border-b border-grayA-3 px-2.5 py-2">
          <AppLogoName />
        </Inset>

        <Inset side="bottom">
          {/* # Menu */}
          <Command className={cn('border-none bg-gray-2', itemStyle, groupStyle, inputStyle)}>
            <CommandInput
              placeholder="Type a command or search..."
              className="border-b border-grayA-3"
            />
            <CommandList className="h-[400px] max-h-[80lvh]">
              <CommandEmpty>No results found.</CommandEmpty>

              <CommandGroup heading="Threads">
                <CommandItem>
                  <Icons.Plus />
                  Create new thread
                  <CommandShortcut>⌘N</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <Icons.MagnifyingGlass />
                  Search threads...
                </CommandItem>
                <CommandItem>
                  <Icons.Chat />
                  Conversations with e
                </CommandItem>
                <CommandItem>
                  <Icons.Chat />
                  Who am I?
                </CommandItem>
                <CommandItem>
                  <Icons.Chat />
                  How to change a tyre
                </CommandItem>
                <CommandItem>
                  <Icons.Chat />
                  React useMemo
                </CommandItem>
              </CommandGroup>

              <CommandGroup heading="Generations">
                <CommandItem>
                  <Icons.Plus />
                  Create new generation
                </CommandItem>
                <CommandItem>
                  <Icons.MagnifyingGlass />
                  Search generations...
                </CommandItem>
                <CommandItem>
                  <Icons.ImageSquare />
                  SD3: Medium
                </CommandItem>
                <CommandItem>
                  <Icons.ImageSquare />
                  Pixart Generations
                </CommandItem>
                <CommandItem>
                  <Icons.ImageSquare />
                  Anime Babes
                </CommandItem>
              </CommandGroup>

              <CommandGroup heading="Settings">
                <CommandItem>
                  <Icons.User />
                  Profile
                </CommandItem>
                <CommandItem>
                  <Icons.Gear />
                  Preferences
                </CommandItem>
                <CommandItem>
                  <Icons.SignOut />
                  Log out
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </Inset>
      </Dialog.Content>
    </Dialog.Root>
  )
}
