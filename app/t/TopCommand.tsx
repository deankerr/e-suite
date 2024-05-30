'use client'

import { forwardRef, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Button, Theme } from '@radix-ui/themes'
import { Command as Cmdk } from 'cmdk'
import { SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useThreadStack } from '@/app/t/[[...slug]]/hooks'
import { useCreateThread, useListViewerThreads } from '@/lib/api'
import { cn } from '@/lib/utils'

import type { api } from '@/convex/_generated/api'
import type { Preloaded } from 'convex/react'

type TopCommandProps = { preloadedList: Preloaded<typeof api.threads.query.listViewerThreads> }

export const TopCommand = ({ preloadedList }: TopCommandProps) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { stack, add, remove } = useThreadStack()

  const { threads } = useListViewerThreads(preloadedList)

  const createThread = useCreateThread()
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button variant="outline" color="gold">
          TopCommand 🛩️
        </Button>
      </Popover.Trigger>

      <Popover.Portal>
        <Theme>
          <Popover.Content align="center" sideOffset={5}>
            <Cmdk
              label="Model Combobox"
              className={cn(
                'flex h-full w-full flex-col overflow-hidden rounded-md border bg-gray-1',
              )}
            >
              <div className="flex items-center border-b px-3">
                <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Cmdk.Input
                  className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-10 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Search..."
                />
              </div>

              <Cmdk.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                <Cmdk.Empty className="py-6 text-center text-sm">No results found.</Cmdk.Empty>

                <CItem
                  onSelect={() => {
                    createThread({})
                      .then((id) => add(id))
                      .catch((err) => {
                        if (err instanceof Error) toast.error(err.message)
                        else toast.error('Unknown error')
                      })
                  }}
                >
                  Create Chat
                </CItem>

                <CItem
                  onSelect={() => {
                    createThread({})
                      .then((id) => add(id))
                      .catch((err) => {
                        if (err instanceof Error) toast.error(err.message)
                        else toast.error('Unknown error')
                      })
                  }}
                >
                  Create Image
                </CItem>

                <CGroup heading="Add to stack">
                  {threads
                    .filter((thread) => !stack.includes(thread.slug))
                    .map((thread) => (
                      <CItem
                        key={thread._id}
                        value={thread.slug}
                        onSelect={(value) => {
                          add(value)
                          setOpen(false)
                        }}
                      >
                        {thread.title}
                      </CItem>
                    ))}
                </CGroup>

                <CGroup heading="Remove from stack">
                  {threads
                    .filter((thread) => stack.includes(thread.slug))
                    .map((thread) => (
                      <CItem
                        key={thread.slug}
                        value={thread.slug}
                        onSelect={(value) => {
                          remove(value)
                          setOpen(false)
                        }}
                      >
                        {thread.title}
                      </CItem>
                    ))}
                </CGroup>
                <CItem
                  onSelect={() => {
                    router.replace('/multi')
                    setOpen(false)
                  }}
                >
                  clear
                </CItem>
              </Cmdk.List>
            </Cmdk>
          </Popover.Content>
        </Theme>
      </Popover.Portal>
    </Popover.Root>
  )
}

export const CItem = forwardRef<HTMLDivElement, React.ComponentProps<typeof Cmdk.Item>>(
  function CItem({ className, ...props }, forwardedRef) {
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

export const CGroup = forwardRef<HTMLDivElement, React.ComponentProps<typeof Cmdk.Group>>(
  function CGroup({ className, ...props }, forwardedRef) {
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
