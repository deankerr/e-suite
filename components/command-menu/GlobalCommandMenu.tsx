'use client'

import { Dialog, IconButton, Inset } from '@radix-ui/themes'
import { useAtom } from 'jotai'
import {
  ImageIcon,
  ImagePlusIcon,
  MenuIcon,
  MessageSquarePlusIcon,
  MessagesSquareIcon,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useKey } from 'react-use'
import { toast } from 'sonner'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/Command'
import { useCreateThread, useListThreads } from '@/lib/api'
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

  const router = useRouter()
  const isSingleThreadPage = usePathname().startsWith('/thread')

  const [threadDeckIds, setThreadDeckIds] = useAtom(threadDeckIdsAtom)
  const threads = useListThreads()
  const unopenedThreads = threads?.filter((thread) => !threadDeckIds.includes(thread.slug)) ?? []

  const createThread = useCreateThread()
  const handleCreateThread = (type: 'chat' | 'image') => {
    createThread({ default: type })
      .then((slug) => {
        if (isSingleThreadPage) {
          router.push(`/thread/${slug}`)
        } else {
          setThreadDeckIds((ids) => [...ids, slug])
        }
        setOpen(false)
      })
      .catch((err) => {
        console.error(err)
        toast.error('An error occurred')
      })
  }

  const handleOpenThread = (slug: string) => {
    if (isSingleThreadPage) {
      router.push(`/thread/${slug}`)
    } else {
      setThreadDeckIds((ids) => [...ids, slug])
    }
    setOpen(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command className="border-none [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup>
            <CommandItem onSelect={() => handleCreateThread('chat')}>
              <MessageSquarePlusIcon className="mr-2 size-4" />
              Start new Chat
            </CommandItem>
            <CommandItem onSelect={() => handleCreateThread('image')}>
              <ImagePlusIcon className="mr-2 size-4" />
              Start new Generation
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />
          {unopenedThreads.length > 0 && (
            <CommandGroup heading="Threads">
              {unopenedThreads.map((thread) => (
                <CommandItem
                  key={thread.slug}
                  value={thread.title ?? 'new thread ' + thread.slug}
                  onSelect={() => handleOpenThread(thread.slug)}
                >
                  {thread.config.type.includes('image') ? (
                    <ImageIcon className="mr-2 size-4" />
                  ) : (
                    <MessagesSquareIcon className="mr-2 size-4" />
                  )}
                  {thread.title ?? 'new thread'}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}

export const CommandDialog = ({ children, ...props }: React.ComponentProps<typeof Dialog.Root>) => {
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
