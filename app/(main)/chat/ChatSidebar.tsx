'use client'

import { PermissionsCard } from '@/app/components/PermissionsCard'
import { Button } from '@/app/components/ui/Button'
import { Label } from '@/app/components/ui/Label'
import { useAppStore } from '@/components/providers/AppStoreProvider'
import { InferenceParameterControls } from '@/components/threads/InferenceParameterControls'
import { RemoveThreadDialog } from '@/components/threads/RemoveThreadDialog'
import { RenameThreadDialog } from '@/components/threads/RenameThreadDialog'
import { ThreadHelpers } from '@/components/threads/useThread'
import { Sidebar2 } from '@/components/ui/Sidebar2'
import { cn } from '@/lib/utils'
import { ScrollArea, Switch, Tabs } from '@radix-ui/themes'
import { forwardRef } from 'react'

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
    <Sidebar2
      {...props}
      right
      open={sidebarOpen}
      onOpenChange={updateSidebarOpen}
      className={cn('bg-gray-1', className)}
      ref={forwardedRef}
    >
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
                  // checked={voPlayer.autoplay}
                  // onCheckedChange={voPlayer.setAutoplay}
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
    </Sidebar2>
  )
})
