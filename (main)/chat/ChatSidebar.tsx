'use client'

import { forwardRef } from 'react'
import { ScrollArea, Tabs } from '@radix-ui/themes'

import { useAppStore } from '@/components/providers/AppStoreProvider'
import { InferenceParameterControls } from '@/components/threads/InferenceParameterControls'
import { RemoveThreadDialog } from '@/components/threads/RemoveThreadDialog'
import { RenameThreadDialog } from '@/components/threads/RenameThreadDialog'
import { VoiceoverControlsCard } from '@/components/threads/VoiceoverControlsCard'
import { Button } from '@/components/ui/Button'
import { PermissionsCard } from '@/components/ui/PermissionsCard'
import { Sidebar } from '@/components/ui/Sidebar'

import type { ThreadHelpers } from '@/components/threads/useThread'

type ChatSidebarProps = {
  threadHelpers: ThreadHelpers
} & React.ComponentProps<'div'>

export const ChatSidebar = forwardRef<HTMLDivElement, ChatSidebarProps>(function ChatSidebar(
  { threadHelpers, ...props },
  forwardedRef,
) {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen)
  const updateSidebarOpen = useAppStore((state) => state.updateSidebarOpen)

  const { thread, threadAtoms, updatePermissions } = threadHelpers

  return (
    <Sidebar
      {...props}
      right
      open={sidebarOpen}
      onOpenChange={updateSidebarOpen}
      ref={forwardedRef}
    >
      <Tabs.Root defaultValue="settings" className="flex h-full flex-col overflow-hidden">
        <Tabs.List className="shrink-0">
          <Tabs.Trigger value="parameters">Parameters</Tabs.Trigger>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="parameters" asChild>
          <ScrollArea className="grow">
            <div className="mx-auto max-w-80">
              <InferenceParameterControls threadAtoms={threadAtoms} />
            </div>
          </ScrollArea>
        </Tabs.Content>

        <Tabs.Content value="settings" asChild>
          <ScrollArea className="grow">
            <div className="flex max-w-80 flex-col gap-4 overflow-hidden p-4">
              {thread && thread.owner.isViewer ? (
                <>
                  <PermissionsCard
                    permissions={thread.permissions}
                    onPermissionsChange={(permissions) => updatePermissions(permissions)}
                  />
                  <VoiceoverControlsCard thread={thread} />
                  <RenameThreadDialog currentTitle={thread?.title} id={thread?._id}>
                    <Button>Rename</Button>
                  </RenameThreadDialog>
                  <RemoveThreadDialog id={thread._id} onDelete={() => {}}>
                    <Button color="red">Delete Chat</Button>
                  </RemoveThreadDialog>
                </>
              ) : null}
            </div>
          </ScrollArea>
        </Tabs.Content>
      </Tabs.Root>
    </Sidebar>
  )
})
