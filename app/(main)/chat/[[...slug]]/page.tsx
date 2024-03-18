'use client'

import { PermissionsCard } from '@/app/components/PermissionsCard'
import { Button } from '@/app/components/ui/Button'
import { navbarOpenAtom, sidebarOpenAtom } from '@/components/atoms'
import { InferenceParameterControls } from '@/components/threads/InferenceParameterControls'
import { RemoveThreadDialog } from '@/components/threads/RemoveThreadDialog'
import { RenameThreadDialog } from '@/components/threads/RenameThreadDialog'
import { useThread } from '@/components/threads/useThread'
import { UIIconButton } from '@/components/ui/UIIconButton'
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { Heading, ScrollArea, Tabs } from '@radix-ui/themes'
import { useAtom } from 'jotai'
import {
  ImageIcon,
  MessageCircleIcon,
  PanelLeftOpenIcon,
  SendHorizonalIcon,
  SlidersHorizontalIcon,
  SmileIcon,
  XIcon,
} from 'lucide-react'

export default function ChatPage({ params }: { params: { slug?: [Id<'threads'>] } }) {
  const threadId = params.slug ? params.slug[0] : undefined
  const { thread, messages, threadAtoms, updatePermissions } = useThread({ threadId })

  const [navbarIsOpen, setNavbarOpen] = useAtom(navbarOpenAtom)
  const [sidebarIsOpen, setSidebarOpen] = useAtom(sidebarOpenAtom)

  return (
    // <ErrorBoundary FallbackComponent={FallbackComponent}>
    //   <ThreadShell threadId={threadId} />
    // </ErrorBoundary>
    <>
      <div className="h-full grow overflow-hidden">
        {/* header */}
        <div className="flex h-14 items-center gap-2 border-b px-4">
          {/* open navbar button */}
          {!navbarIsOpen && (
            <UIIconButton
              label="close navigation bar"
              color="gray"
              onClick={() => setNavbarOpen(!navbarIsOpen)}
            >
              <PanelLeftOpenIcon />
            </UIIconButton>
          )}
          <Heading size="3" className="flex items-center gap-1.5">
            <MessageCircleIcon className="size-5" />
            Chat Header
          </Heading>

          <div className="grow"></div>

          {/* parameters sidebar button */}
          {!sidebarIsOpen && (
            <UIIconButton label="open parameters sidebar" onClick={() => setSidebarOpen(true)}>
              <SlidersHorizontalIcon />
            </UIIconButton>
          )}
        </div>

        {/* content */}
        <ScrollArea className="h-[calc(100%-3.5rem-3.5rem)]">
          <div className="flex flex-col items-center gap-2.5 p-3">
            {messages.map((message) => (
              <div key={message._id} className={cn('w-full max-w-[80ch] rounded border p-3')}>
                [{message.role}] {message.content}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* input */}
        <div className="h-14 bg-gray-2">
          <form>
            <label htmlFor="chat" className="sr-only">
              Your message
            </label>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center px-3 py-2">
              <button
                type="button"
                className="text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 inline-flex cursor-pointer justify-center p-2 dark:hover:text-white"
              >
                <ImageIcon className="size-5" />
                <span className="sr-only">Upload image</span>
              </button>
              <button
                type="button"
                className="text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 cursor-pointer p-2 dark:hover:text-white"
              >
                <SmileIcon className="size-5" />
                <span className="sr-only">Add emoji</span>
              </button>
              <textarea
                id="chat"
                rows={1}
                className="rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 mx-4 block w-full border bg-white p-2.5 text-base text-gray-9 "
                placeholder="Your message..."
              ></textarea>
              <button
                type="submit"
                className="text-blue-600 hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600 inline-flex cursor-pointer justify-center rounded-full p-2"
              >
                <SendHorizonalIcon className="size-5" />
                <span className="sr-only">Send message</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* sidebar */}
      <div
        className={cn(
          'right-0 h-full w-80 shrink-0 translate-x-0 border-l',
          !sidebarIsOpen && 'absolute translate-x-full',
        )}
      >
        {/* header */}
        <div className="flex h-14 items-center justify-end border-b px-4">
          {/* <Heading size="2">Sidebar</Heading> */}
          <UIIconButton label="close parameters sidebar" onClick={() => setSidebarOpen(false)}>
            <XIcon />
          </UIIconButton>
        </div>

        <div className="">
          <Tabs.Root defaultValue="details">
            <Tabs.List>
              <Tabs.Trigger value="parameters">Parameters</Tabs.Trigger>
              <Tabs.Trigger value="details">Details</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="parameters">
              <InferenceParameterControls threadAtoms={threadAtoms} />
            </Tabs.Content>

            <Tabs.Content value="details">
              <div className="flex flex-col justify-center gap-4 p-4">
                {thread && thread.owner.isViewer ? (
                  <>
                    <PermissionsCard
                      permissions={thread.permissions}
                      onPermissionsChange={(permissions) => updatePermissions(permissions)}
                    />
                    <RenameThreadDialog currentTitle={thread?.title} id={thread?._id}>
                      <Button>Rename</Button>
                    </RenameThreadDialog>
                    <RemoveThreadDialog id={thread._id} onDelete={() => {}}>
                      <Button color="red">Delete Chat</Button>
                    </RemoveThreadDialog>
                  </>
                ) : null}
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </>
  )
}
