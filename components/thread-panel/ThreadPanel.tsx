'use client'

import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import * as Toolbar from '@radix-ui/react-toolbar'
import { AlertDialog, Card, Dialog, DropdownMenu, TextField } from '@radix-ui/themes'
import { useQueryState } from 'nuqs'

import { Composer } from '@/components/composer/Composer'
import { DotsThreeFillX } from '@/components/icons/DotsThreeFillX'
import { SidebarButton } from '@/components/layout/SidebarButton'
import { EmptyPage } from '@/components/pages/EmptyPage'
import { Panel } from '@/components/panel/Panel'
import { TextEditorDialog } from '@/components/text-document-editor/TextEditorDialog'
import { MessageFeed } from '@/components/thread-panel/MessageFeed'
import { ThreadOwner } from '@/components/thread-panel/ThreadOwner'
import { Button, IconButton } from '@/components/ui/Button'
import { AdminOnlyUi } from '@/components/util/AdminOnlyUi'
import { Pre } from '@/components/util/Pre'
import { useDeleteThread, useThreadActions, useThreads, useUpdateThread } from '@/lib/api'

export const ThreadPanel = () => {
  const { thread } = useThreads()
  const threadTitle = thread ? (thread?.title ?? 'Untitled Thread') : ''

  const [viewFilter, setViewFilter] = useQueryState('view')
  const [roleFilter, setRoleFilter] = useQueryState('role')

  const actions = useThreadActions(thread?._id)

  const [showJson, setShowJson] = useState(false)
  const [showEditTitleDialog, setShowEditTitleDialog] = useState(false)
  const [showDeleteThreadDialog, setShowDeleteThreadDialog] = useState(false)

  if (thread === null) {
    return (
      <Panel>
        <EmptyPage />
      </Panel>
    )
  }

  return (
    <Panel>
      <Panel.Header loading={!thread}>
        <SidebarButton />
        <div className="size-4" />
        <Panel.Title>{threadTitle}</Panel.Title>
        <div className="size-4" />
        <ThreadOwner>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <IconButton variant="ghost" color="gray" aria-label="More options" disabled>
                <DotsThreeFillX width={20} height={20} />
              </IconButton>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content variant="soft">
              <DropdownMenu.Item onClick={() => setShowEditTitleDialog(true)}>
                <Icons.Pencil /> Edit title
              </DropdownMenu.Item>

              <DropdownMenu.Item color="red" onClick={() => setShowDeleteThreadDialog(true)}>
                <Icons.Trash />
                Delete thread
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          {/* TODO */}
          <IconButton variant="ghost" color="gray" aria-label="Favorite" disabled>
            <Icons.Star size={20} />
          </IconButton>
        </ThreadOwner>
      </Panel.Header>

      <Panel.Toolbar loading={!thread}>
        <Toolbar.ToggleGroup
          type="single"
          aria-label="View"
          value={viewFilter === 'images' ? 'images' : ''}
          onValueChange={(value) => {
            setViewFilter(value || null)
          }}
          className="pl-1"
        >
          <Toolbar.ToggleItem
            value="images"
            aria-label="View images"
            className="inline-flex size-8 items-center justify-center rounded-md text-grayA-11 hover:bg-grayA-3 data-[state=on]:bg-accentA-4 data-[state=on]:text-accentA-11"
          >
            <Icons.Images size={20} />
          </Toolbar.ToggleItem>
        </Toolbar.ToggleGroup>

        <Toolbar.Separator className="mx-2 h-3/4 w-px bg-grayA-3" />

        <Toolbar.ToggleGroup
          type="single"
          aria-label="Role"
          value={roleFilter || ''}
          onValueChange={(value) => {
            setRoleFilter(value || null)
          }}
        >
          <Toolbar.ToggleItem
            value="user"
            aria-label="View user messages"
            className="inline-flex size-8 items-center justify-center rounded-md text-grayA-11 hover:bg-grayA-3 data-[state=on]:bg-accentA-4 data-[state=on]:text-accentA-11"
          >
            <Icons.User size={20} />
          </Toolbar.ToggleItem>
          <Toolbar.ToggleItem
            value="assistant"
            aria-label="View assistant messages"
            className="inline-flex size-8 items-center justify-center rounded-md text-grayA-11 hover:bg-grayA-3 data-[state=on]:bg-accentA-4 data-[state=on]:text-accentA-11"
          >
            <Icons.Robot size={20} />
          </Toolbar.ToggleItem>
        </Toolbar.ToggleGroup>

        <Toolbar.Separator className="mx-2 h-3/4 w-px bg-grayA-3" />

        <div className="flex-start gap-2">
          <ThreadOwner>
            <Toolbar.Button asChild>
              <TextEditorDialog slug={thread?.slug ?? ''}>
                <Button variant="soft" color="gray" size="1" aria-label="View/edit instructions">
                  Instructions
                </Button>
              </TextEditorDialog>
            </Toolbar.Button>
          </ThreadOwner>

          <AdminOnlyUi>
            <Toolbar.Button asChild>
              <IconButton
                aria-label="Show JSON"
                variant="ghost"
                color={showJson ? undefined : 'gray'}
                onClick={() => setShowJson(!showJson)}
              >
                <Icons.FileJs size={20} />
              </IconButton>
            </Toolbar.Button>
          </AdminOnlyUi>
        </div>
      </Panel.Toolbar>

      <Panel.Content>
        <MessageFeed />
      </Panel.Content>

      {showJson && (
        <Pre className="absolute inset-x-0 inset-y-20 z-20 max-w-[60vw] text-wrap">
          {JSON.stringify(thread, null, 2)}
        </Pre>
      )}

      <Panel.Footer>
        {thread && (
          <ThreadOwner>
            <Composer
              initialResourceKey={thread.latestRunConfig?.resourceKey}
              loading={actions.state !== 'ready'}
              onSend={actions.send}
            />
          </ThreadOwner>
        )}
      </Panel.Footer>

      <EditThreadTitleDialog
        threadId={thread?._id ?? ''}
        currentTitle={threadTitle}
        open={showEditTitleDialog}
        onOpenChange={setShowEditTitleDialog}
      />

      <DeleteThreadDialog
        threadId={thread?._id ?? ''}
        open={showDeleteThreadDialog}
        onOpenChange={setShowDeleteThreadDialog}
      />
    </Panel>
  )
}

const EditThreadTitleDialog = ({
  threadId,
  currentTitle,
  children,
  ...props
}: {
  threadId: string
  currentTitle: string
} & React.ComponentProps<typeof Dialog.Root>) => {
  const sendUpdateThread = useUpdateThread()
  const [title, setTitle] = useState(currentTitle)
  return (
    <Dialog.Root {...props}>
      {children ? <Dialog.Trigger>{children}</Dialog.Trigger> : null}

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Edit title</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Make changes to your thread.
        </Dialog.Description>

        <div className="flex flex-col gap-3">
          <label>
            Title
            <TextField.Root
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your new title"
            />
          </label>
        </div>

        <div className="flex-end mt-4 gap-2">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button onClick={() => sendUpdateThread({ threadId, fields: { title } })}>Save</Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

const DeleteThreadDialog = ({
  threadId,
  children,
  ...props
}: {
  threadId: string
} & React.ComponentProps<typeof AlertDialog.Root>) => {
  const sendDeleteThread = useDeleteThread()

  return (
    <AlertDialog.Root {...props}>
      {children ? <AlertDialog.Trigger>{children}</AlertDialog.Trigger> : null}

      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Delete Thread</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure? This thread will be gone forever.
        </AlertDialog.Description>

        <div className="flex-end mt-4 gap-2">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red" onClick={() => sendDeleteThread({ threadId })}>
              Delete
            </Button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
