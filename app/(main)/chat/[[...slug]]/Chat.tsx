'use client'

import { PermissionsCard } from '@/app/components/PermissionsCard'
import { Button } from '@/app/components/ui/Button'
import { Label } from '@/app/components/ui/Label'
import { navbarOpenAtom, sidebarOpenAtom } from '@/components/atoms'
import { InferenceParameterControls } from '@/components/threads/InferenceParameterControls'
import { MessageBubble } from '@/components/threads/MessageBubble'
import { MessageInput } from '@/components/threads/MessageInput'
import { RemoveThreadDialog } from '@/components/threads/RemoveThreadDialog'
import { RenameThreadDialog } from '@/components/threads/RenameThreadDialog'
import { useThread } from '@/components/threads/useThread'
import { useVoiceoverPlayer } from '@/components/threads/useVoiceoverPlayer'
import { Sidebar } from '@/components/ui/Sidebar'
import { UIIconButton } from '@/components/ui/UIIconButton'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { Heading, ScrollArea, Switch, Tabs } from '@radix-ui/themes'
import { Preloaded } from 'convex/react'
import { useAtom } from 'jotai'
import { MenuIcon, MessageSquareIcon, SlidersHorizontalIcon, XIcon } from 'lucide-react'
import { useEffect, useRef } from 'react'

type ChatProps = {
  preload: Preloaded<typeof api.threads.threads.get>
}

export const Chat = ({ preload }: ChatProps) => {
  const { thread, messages, send, threadAtoms, updatePermissions } = useThread({
    preload,
  })

  const title = thread?.title ?? 'New Chat'

  const [navbarIsOpen, setNavbarOpen] = useAtom(navbarOpenAtom)
  const [sidebarIsOpen, setSidebarOpen] = useAtom(sidebarOpenAtom)

  const scrollRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages])

  const voPlayer = useVoiceoverPlayer(messages)

  return (
    <>
      <div className="flex h-full grow flex-col overflow-hidden">
        {/* header */}
        <div className="flex-between h-14 shrink-0 border-b border-gold-5 bg-gray-1 px-3 sm:gap-2">
          {/* open navbar button */}
          {!navbarIsOpen && (
            <UIIconButton
              label="open navigation bar"
              className="sm:hidden"
              onClick={() => setNavbarOpen(!navbarIsOpen)}
            >
              <MenuIcon className="size-7" />
            </UIIconButton>
          )}

          {/* title */}
          <Heading size="3" className="flex-center sm:flex-start grow gap-2.5 truncate">
            <MessageSquareIcon className="size-5" />
            {title}
          </Heading>

          {/* sidebar button */}
          <UIIconButton
            label="toggle parameters sidebar"
            onClick={() => setSidebarOpen(!sidebarIsOpen)}
          >
            {sidebarIsOpen ? <XIcon /> : <SlidersHorizontalIcon />}
          </UIIconButton>
        </div>

        {/* content area */}
        <div className="flex grow overflow-hidden bg-gold-1">
          {/* chat */}
          <div className={cn('flex grow', sidebarIsOpen ? 'md:mr-80' : '')}>
            {/* message feed */}
            <div className={cn('grow', sidebarIsOpen ? '' : 'border-r')}>
              <ScrollArea className="h-[calc(100%-4rem)]" scrollbars="vertical">
                <div
                  className="flex flex-col items-center gap-3 p-3 md:gap-4 md:p-4"
                  ref={scrollRef}
                >
                  {messages.map((message) => (
                    <MessageBubble voPlayer={voPlayer} message={message} key={message._id} />
                  ))}
                </div>
              </ScrollArea>

              {/* input bar */}
              <MessageInput inputAtom={threadAtoms.message} onSend={send} />
            </div>
          </div>

          {/* sidebar */}
          <Sidebar side="right" open={sidebarIsOpen} onOpenChange={setSidebarOpen}>
            <Tabs.Root defaultValue="parameters">
              <Tabs.List className="shrink-0">
                <Tabs.Trigger value="parameters">Parameters</Tabs.Trigger>
                <Tabs.Trigger value="details">Details</Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="parameters" asChild>
                <ScrollArea>
                  <div className="mx-auto max-w-80">
                    <InferenceParameterControls threadAtoms={threadAtoms} />
                  </div>
                </ScrollArea>
              </Tabs.Content>

              <Tabs.Content value="details" asChild>
                <div className="flex grow flex-col justify-center gap-4 p-4">
                  <div className="px-1">
                    {/* audio */}
                    <div className="flex-between gap-2">
                      <Label htmlFor="autoplay" className="text-sm font-medium">
                        Play new voiceovers
                      </Label>
                      <Switch
                        id="autoplay"
                        size="1"
                        checked={voPlayer.autoplay}
                        onCheckedChange={voPlayer.setAutoplay}
                      />
                    </div>
                  </div>

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
          </Sidebar>
        </div>
      </div>
    </>
  )
}
