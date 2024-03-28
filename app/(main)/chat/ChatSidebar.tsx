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
import { ComboboxDemo } from '@/components/ui/shadcn-ui/ComboboxDemo'
import { ComboboxPopover } from '@/components/ui/shadcn-ui/ComboboxPopover'
import { CommandDialogDemo } from '@/components/ui/shadcn-ui/CommandDialogDemo'
import { Sidebar } from '@/components/ui/Sidebar'
import { cn } from '@/lib/utils'

import type { ThreadHelpers } from '@/components/threads/useThread'

type ChatSidebarProps = {
  threadHelpers: ThreadHelpers
} & React.ComponentProps<'div'>

export const ChatSidebar = forwardRef<HTMLDivElement, ChatSidebarProps>(function ChatSidebar(
  { threadHelpers, className, ...props },
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
      className={cn('bg-gray-1', className)}
      ref={forwardedRef}
    >
      <Tabs.Root defaultValue="settings">
        <Tabs.List className="shrink-0">
          <Tabs.Trigger value="parameters">Parameters</Tabs.Trigger>
          <Tabs.Trigger value="details">Settings</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="parameters" asChild>
          <ScrollArea>
            <div className="mx-auto max-w-80">
              <InferenceParameterControls threadAtoms={threadAtoms} />
            </div>
          </ScrollArea>
        </Tabs.Content>

        <Tabs.Content value="settings" asChild>
          <div className="flex grow flex-col justify-center gap-4 p-4">
            {thread && thread.owner.isViewer ? (
              <>
                <PermissionsCard
                  permissions={thread.permissions}
                  onPermissionsChange={(permissions) => updatePermissions(permissions)}
                />
                <VoiceoverControlsCard />
                <RenameThreadDialog currentTitle={thread?.title} id={thread?._id}>
                  <Button>Rename</Button>
                </RenameThreadDialog>
                <RemoveThreadDialog id={thread._id} onDelete={() => {}}>
                  <Button color="red">Delete Chat</Button>
                </RemoveThreadDialog>
              </>
            ) : null}

            <ComboboxPopover />
            <ComboboxDemo />
            <CommandDialogDemo />
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </Sidebar>
  )
})
