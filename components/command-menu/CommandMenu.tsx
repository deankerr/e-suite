'use client'

import { Chat, ImagesSquare, List } from '@phosphor-icons/react/dist/ssr'
import { Dialog, IconButton, Inset } from '@radix-ui/themes'
import { useKeyboardEvent } from '@react-hookz/web'
import { formatDistanceToNow } from 'date-fns'
import { useAtom } from 'jotai'
import { ImagePlusIcon, MessageSquarePlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { UserButtons } from '@/components/layout/UserButtons'
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
import { useUserThreadsList, useViewerDetails } from '@/lib/queries'

export const CommandMenu = (props: { button?: React.ReactNode }) => {
  const [open, setOpen] = useAtom(commandMenuOpenAtom)

  useKeyboardEvent('k', (e) => {
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault()
      setOpen(!open)
    }
  })

  const router = useRouter()
  const goto = (path: string) => {
    router.push(`${path}`)
    setOpen(false)
  }

  const { user } = useViewerDetails()
  const threads = useUserThreadsList()
  const threadsAvailable = threads ?? []

  return (
    <CommandDialog button={props.button} open={open} onOpenChange={setOpen}>
      <Command className="border-none [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5">
        {/* <CommandInput placeholder="Type a command or search..." /> */}
        <CommandList className="h-[400px] max-h-[80lvh]">
          <CommandEmpty>No results found.</CommandEmpty>

          {!user && <CommandItem disabled>Log in to start using e/suite</CommandItem>}

          {user && (
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  goto('/chat')
                }}
              >
                <MessageSquarePlusIcon className="mr-2 size-4" />
                Start new Chat
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  goto('/generate')
                }}
              >
                <ImagePlusIcon className="mr-2 size-4" />
                Start new Generation
              </CommandItem>
            </CommandGroup>
          )}

          <CommandSeparator />
          {threadsAvailable.length > 0 && (
            <CommandGroup heading="Threads">
              {threadsAvailable.map((thread) => (
                <CommandItem
                  key={thread._id}
                  value={thread.title ?? 'new thread ' + thread.slug}
                  // className="h-11"
                  onSelect={() => {
                    goto(`/c/${thread.slug}`)
                    setOpen(false)
                  }}
                >
                  <div className="w-full space-y-0.5">
                    <div className="flex w-full">
                      <div className="shrink-0 pr-1">
                        {thread.model?.type === 'chat' ? <Chat /> : <ImagesSquare />}
                      </div>
                      <div className="grow truncate">{thread.title ?? 'Untitled'}</div>
                      <div className="shrink-0 pl-1 text-right text-xs text-gray-10">
                        {formatDistanceToNow(new Date(thread.updatedAtTime), { addSuffix: true })
                          .replace('about', '')
                          .trim()}
                      </div>
                    </div>
                    <div className="gap-1 text-xs text-gray-11 flex-start">
                      {thread.model?.name}
                    </div>
                  </div>
                </CommandItem>
              ))}
              {!threads && <LoadingSpinner />}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}

const CommandDialog = ({
  button,
  children,
  ...props
}: { button?: React.ReactNode } & React.ComponentProps<typeof Dialog.Root>) => {
  return (
    <Dialog.Root {...props}>
      <Dialog.Trigger>
        {button ?? (
          <IconButton variant="ghost" className="shrink-0">
            <List className="size-6" />
          </IconButton>
        )}
      </Dialog.Trigger>
      <Dialog.Content aria-describedby={undefined}>
        <Dialog.Title className="sr-only">Command Menu</Dialog.Title>

        <Inset side="top" className="p-3">
          <div className="pt-0.5 flex-between">
            <AppLogoTitle />
            <UserButtons />
          </div>
        </Inset>

        <Inset side="bottom">{children}</Inset>
      </Dialog.Content>
    </Dialog.Root>
  )
}
