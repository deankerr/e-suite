'use client'

import { Button, Dialog, Inset } from '@radix-ui/themes'
import { useAtom } from 'jotai'
import { ImageIcon, ImagePlusIcon, MessageSquarePlusIcon, MessagesSquareIcon } from 'lucide-react'
import { useKey } from 'react-use'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/Command'
import { useListThreads } from '@/lib/api'
import { globalMenuOpenAtom, threadDeckIdsAtom } from '@/lib/atoms'

type GlobalCommandMenuProps = {
  props?: unknown
}

export const GlobalCommandMenu = ({}: GlobalCommandMenuProps) => {
  const [open, setOpen] = useAtom(globalMenuOpenAtom)
  useKey(
    (e) => e.key === 'k' && e.metaKey,
    () => setOpen(!open),
  )
  const [threadDeckIds, setThreadDeckIds] = useAtom(threadDeckIdsAtom)
  const threads = useListThreads()

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command className="border-none [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup>
            <CommandItem>
              <MessageSquarePlusIcon className="mr-2 size-4" />
              Start new Chat
            </CommandItem>
            <CommandItem>
              <ImagePlusIcon className="mr-2 size-4" />
              Start new Generation
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading="Threads">
            {threads
              ?.filter((thread) => !threadDeckIds.includes(thread.slug))
              .map((thread) => (
                <CommandItem
                  key={thread.slug}
                  value={thread.title ?? 'new thread ' + thread.slug}
                  onSelect={() => {
                    setThreadDeckIds((ids) => [...ids, thread.slug])
                    setOpen(false)
                  }}
                >
                  {thread.active.type.includes('image') ? (
                    <ImageIcon className="mr-2 size-4" />
                  ) : (
                    <MessagesSquareIcon className="mr-2 size-4" />
                  )}
                  {thread.title ?? 'new thread'}
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}

export const CommandDialog = ({ children, ...props }: React.ComponentProps<typeof Dialog.Root>) => {
  return (
    <Dialog.Root {...props}>
      <Dialog.Trigger>
        <Button variant="outline" size="1">
          Menu
        </Button>
      </Dialog.Trigger>
      <Dialog.Content aria-describedby={undefined}>
        <Dialog.Title className="sr-only">Global Command Menu</Dialog.Title>

        <Inset>{children}</Inset>
      </Dialog.Content>
    </Dialog.Root>
  )
}
