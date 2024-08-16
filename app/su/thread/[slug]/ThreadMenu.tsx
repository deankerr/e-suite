'use client'

import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { AlertDialog, Dialog, DropdownMenu, TextField } from '@radix-ui/themes'

import { DotsThreeFillX } from '@/components/icons/DotsThreeFillX'
import { Button, IconButton } from '@/components/ui/Button'
import { useDeleteThread, useThreads, useUpdateThread } from '@/lib/api'

export const ThreadMenu = ({ slug }: { slug: string }) => {
  const { thread } = useThreads(slug)
  const [showEditTitleDialog, setShowEditTitleDialog] = useState(false)
  const [showDeleteThreadDialog, setShowDeleteThreadDialog] = useState(false)

  if (!thread) {
    return null
  }

  return (
    <>
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

      <EditThreadTitleDialog
        threadId={thread._id}
        currentTitle={thread.title ?? ''}
        open={showEditTitleDialog}
        onOpenChange={setShowEditTitleDialog}
      />

      <DeleteThreadDialog
        threadId={thread._id}
        open={showDeleteThreadDialog}
        onOpenChange={setShowDeleteThreadDialog}
      />
    </>
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
