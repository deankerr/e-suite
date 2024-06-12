'use client'

import { UserButton } from '@clerk/nextjs'
import { Dialog, IconButton, Inset } from '@radix-ui/themes'
import { formatDistanceToNow } from 'date-fns'
import { useAtom } from 'jotai'
import { ImagePlusIcon, MenuIcon, MessageSquarePlusIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useKey } from 'react-use'

import { useChatDeck } from '@/components/chat/useChatDeck'
import { AppLogoTitle } from '@/components/ui/AppLogoTitle'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/Command'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { commandMenuOpenAtom } from '@/lib/atoms'
import { useUserThreadsList } from '@/lib/queries'

type CommandMenuProps = {
  asDialog?: boolean
}

export const CommandMenu = ({ asDialog = true }: CommandMenuProps) => {
  const [open, setOpen] = useAtom(commandMenuOpenAtom)
  useKey(
    (e) => e.key === 'k' && e.metaKey,
    () => setOpen(!open),
  )

  const isChatDeckMode = usePathname().endsWith('/c')
  const { deck, add } = useChatDeck()
  const router = useRouter()
  const goto = (path: string) => {
    router.push(`${path}`)
    setOpen(false)
  }

  const threads = useUserThreadsList()
  const threadsAvailable = (threads.data ?? []).filter((thread) =>
    isChatDeckMode ? !deck.some((slug) => thread.slug === slug) : true,
  )

  const menu = (
    <Command className="border-none [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5">
      {/* <CommandInput placeholder="Type a command or search..." /> */}
      <CommandList className="h-[400px] max-h-[80lvh]">
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup>
          <CommandItem
            onSelect={() => {
              add()
              goto('/c')
            }}
          >
            <MessageSquarePlusIcon className="mr-2 size-4" />
            Start new Chat
          </CommandItem>
          <CommandItem>
            <ImagePlusIcon className="mr-2 size-4" />
            Start new Generation
          </CommandItem>
          <CommandItem onSelect={() => goto('/c')}>
            <MessageSquarePlusIcon className="mr-2 size-4" />
            Chat Deck
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />
        <CommandGroup heading="Threads">
          {threadsAvailable.map((thread) => (
            <CommandItem
              key={thread._id}
              value={thread.title ?? 'new thread ' + thread.slug}
              className="h-11 gap-2"
              onSelect={() => {
                if (isChatDeckMode) add(thread.slug)
                else goto(`/c/${thread.slug}`)
                setOpen(false)
              }}
            >
              <div className="grow truncate">{thread.title ?? 'new thread'}</div>
              <div className="max-w-16 shrink-0 text-right text-xs text-gray-10">
                {formatDistanceToNow(new Date(thread.updatedAtTime), { addSuffix: true })}
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
        <IconButton variant="ghost" className="shrink-0">
          <MenuIcon />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content aria-describedby={undefined}>
        <Dialog.Title className="sr-only">Command Menu</Dialog.Title>

        <Inset side="top" className="p-3">
          <div className="pt-0.5 flex-between">
            <AppLogoTitle />

            <UserButton />
          </div>
        </Inset>

        <Inset side="bottom">{children}</Inset>
      </Dialog.Content>
    </Dialog.Root>
  )
}
