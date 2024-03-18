'use client'

import { PermissionsCard } from '@/app/components/PermissionsCard'
import { Button } from '@/app/components/ui/Button'
import { navbarOpenAtom, sidebarOpenAtom } from '@/components/atoms'
import { InferenceParameterControls } from '@/components/threads/InferenceParameterControls'
import { MessageInput } from '@/components/threads/MessageInput'
import { MessageMenu } from '@/components/threads/MessageMenu'
import { RemoveThreadDialog } from '@/components/threads/RemoveThreadDialog'
import { RenameThreadDialog } from '@/components/threads/RenameThreadDialog'
import { useThread } from '@/components/threads/useThread'
import { LoaderBars } from '@/components/ui/LoaderBars'
import { UIIconButton } from '@/components/ui/UIIconButton'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { Heading, ScrollArea, Tabs, Text } from '@radix-ui/themes'
import { Preloaded } from 'convex/react'
import { useAtom } from 'jotai'
import {
  MessageCircleIcon,
  MoreHorizontalIcon,
  PanelLeftOpenIcon,
  SlidersHorizontalIcon,
  XIcon,
} from 'lucide-react'
import { useEffect, useRef } from 'react'

type ChatProps = {
  preload: Preloaded<typeof api.threads.threads.get>
}

export const Chat = ({ preload }: ChatProps) => {
  const { thread, messages, send, threadAtoms, updatePermissions } = useThread({ preload })

  const title = thread?.title ?? 'New Chat'

  const [navbarIsOpen, setNavbarOpen] = useAtom(navbarOpenAtom)
  const [sidebarIsOpen, setSidebarOpen] = useAtom(sidebarOpenAtom)

  const scrollRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages])
  /*
    useAudio()
    const [_, enqueue] = useEnqueueAudio()
    enqueue(
      messages
        .filter((m) => m.voiceover?.url)
        .map((m) => ({ messageId: m._id, url: m.voiceover?.url ?? '', played: false })),
    )

    const audioPlayer = useGlobalAudioPlayer()
  */

  return (
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
            {title}
          </Heading>

          <div className="grow"></div>

          {/* parameters sidebar button */}
          {!sidebarIsOpen && (
            <UIIconButton label="open parameters sidebar" onClick={() => setSidebarOpen(true)}>
              <SlidersHorizontalIcon />
            </UIIconButton>
          )}
        </div>

        {/* chat feed */}
        <ScrollArea className="h-[calc(100%-3.5rem-3.5rem)]">
          <div className="flex flex-col items-center gap-3 p-6" ref={scrollRef}>
            {messages.map((message) => (
              <div
                key={message._id}
                className={cn(
                  'flex w-full max-w-[80ch] flex-col gap-2 rounded border bg-gray-2 p-4',
                )}
              >
                <div className="flex justify-between">
                  <Heading size="2">{message.role}</Heading>

                  <MessageMenu messageId={message._id}>
                    <UIIconButton icon={MoreHorizontalIcon} label="message menu" size="1" />
                  </MessageMenu>
                </div>

                <div className="prose prose-invert">
                  {message.content.split('\n').map((p, i) => (
                    <Text key={i} as="p">
                      {p}
                    </Text>
                  ))}
                </div>

                {/* pending state */}
                {message.job?.status === 'pending' && <LoaderBars />}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* input */}

        <MessageInput inputAtom={threadAtoms.message} onSend={send} />
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
          <UIIconButton label="close parameters sidebar" onClick={() => setSidebarOpen(false)}>
            <XIcon />
          </UIIconButton>
        </div>

        <div>
          <Tabs.Root defaultValue="parameters">
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
