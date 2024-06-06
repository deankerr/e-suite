'use client'

import { useState } from 'react'
import { Dialog, IconButton, Inset } from '@radix-ui/themes'
import { formatDistanceToNow } from 'date-fns'
import { ImagePlusIcon, MenuIcon, MessageSquarePlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
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
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useUserThreadsList } from '@/lib/api2'

type CommandMenuProps = {
  asDialog?: boolean
}

export const CommandMenu = ({ asDialog = true }: CommandMenuProps) => {
  const [open, setOpen] = useState(false)
  useKey(
    (e) => e.key === 'j' && e.metaKey,
    () => setOpen(!open),
  )
  const router = useRouter()
  const goto = (path: string) => {
    router.push(`${path}`)
    setOpen(false)
  }

  const threads = useUserThreadsList()

  const menu = (
    <Command className="border-none [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList className="max-h-[80svh]">
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
          <CommandItem onSelect={() => goto('/c')}>
            <MessageSquarePlusIcon className="mr-2 size-4" />
            Multi Chats
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />
        <CommandGroup heading="Threads">
          {threads.data?.map((thread) => (
            <CommandItem
              key={thread._id}
              value={thread.title ?? 'new thread ' + thread.slug}
              className="gap-2"
              onSelect={() => goto(`/c/${thread.slug}`)}
            >
              <div className="grow truncate">{thread.title ?? 'new thread'}</div>
              <div className="shrink-0 text-xs text-gray-11">
                {formatDistanceToNow(new Date(thread.latestActivityTime), { addSuffix: true })}
              </div>
            </CommandItem>
          ))}
          {threads.isPending && <LoadingSpinner />}
        </CommandGroup>
      </CommandList>
    </Command>
  )

  return asDialog ? (
    <CommandDialog open={open} onOpenChange={setOpen}>
      {menu}
    </CommandDialog>
  ) : (
    menu
  )
}

const CommandDialog = ({ children, ...props }: React.ComponentProps<typeof Dialog.Root>) => {
  return (
    <Dialog.Root {...props}>
      <Dialog.Trigger>
        <IconButton variant="ghost">
          <MenuIcon />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content aria-describedby={undefined}>
        <Dialog.Title className="sr-only">Global Command Menu</Dialog.Title>

        <Inset>{children}</Inset>
      </Dialog.Content>
    </Dialog.Root>
  )
}
