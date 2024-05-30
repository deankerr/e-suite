'use client'

import { useEffect, useState } from 'react'
import { Dialog, Inset } from '@radix-ui/themes'
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
import { useListViewerThreads } from '@/lib/api'
import { threadDeckAtoms, threadDeckSplitAtom } from '@/lib/atoms'

import type { api } from '@/convex/_generated/api'
import type { Preloaded } from 'convex/react'

type GlobalCommandMenuProps = {
  preloadedList: Preloaded<typeof api.threads.query.listViewerThreads>
}

export const GlobalCommandMenu = ({ preloadedList }: GlobalCommandMenuProps) => {
  const [open, setOpen] = useState(true)
  useKey(
    (e) => e.key === 'k' && e.metaKey,
    () => setOpen(!open),
  )

  const { threads } = useListViewerThreads(preloadedList)
  const [threadDeck, setThreadDeck] = useAtom(threadDeckAtoms)
  const [, dispatch] = useAtom(threadDeckSplitAtom)

  useEffect(() => {
    setThreadDeck((prev) =>
      prev.map((p) => {
        const index = threads.findIndex((t) => t._id === p._id)
        return index === -1 ? p : threads[index]!
      }),
    )
  }, [setThreadDeck, threads])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Content aria-describedby={undefined}>
        <Dialog.Title className="sr-only">Global Command Menu</Dialog.Title>

        <Inset>
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
                  .filter((thread) => !threadDeck.find(({ slug }) => slug === thread.slug))
                  .map((thread) => (
                    <CommandItem
                      key={thread.slug}
                      value={thread.title ?? 'new thread ' + thread.slug}
                      onSelect={() => {
                        dispatch({ type: 'insert', value: thread })
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
        </Inset>
      </Dialog.Content>
    </Dialog.Root>
  )
}
