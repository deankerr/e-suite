import { useState } from 'react'
import { Label } from '@radix-ui/react-label'
import { AlertDialog, Button, Dialog, TextField } from '@radix-ui/themes'
import { toast } from 'sonner'

import { useRemoveThread, useUpdateThreadTitle } from '@/lib/api'

import type { E_Thread } from '@/convex/shared/types'

type DeleteDialogProps = {
  threadId: string
  onSuccess?: (threadId: string) => void
  onClose?: () => void
} & React.ComponentProps<typeof AlertDialog.Root>

export const DeleteThreadDialog = ({
  threadId,
  onClose,
  onSuccess,
  children,
  ...props
}: DeleteDialogProps) => {
  const remove = useRemoveThread()

  const handleRemove = () => {
    remove({ slug: threadId })
      .then(() => {
        toast.success('Thread deleted.')
        onSuccess?.(threadId)
      })
      .catch((err) => {
        console.error(err)
        toast.error('An error occurred while trying to delete thread.')
      })
  }

  return (
    <AlertDialog.Root {...props} onOpenChange={(open) => !open && onClose?.()}>
      {children && <AlertDialog.Trigger>{children}</AlertDialog.Trigger>}

      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Delete thread</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure? This thread and all of its content will be deleted.
        </AlertDialog.Description>

        <div className="mt-4 gap-3 flex-end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action onClick={handleRemove}>
            <Button variant="solid" color="red">
              Delete
            </Button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}

type UpdateThreadTitleProps = {
  thread: E_Thread
  onSuccess?: (threadId: string) => void
  onClose?: () => void
} & React.ComponentProps<typeof Dialog.Root>

export const UpdateThreadTitleDialog = ({
  thread,
  onSuccess,
  onClose,
  children,
  ...props
}: UpdateThreadTitleProps) => {
  const [title, setTitle] = useState('')
  const update = useUpdateThreadTitle()

  const handleUpdate = () => {
    update({ slug: thread.slug, title })
      .then((threadId) => {
        toast.success('Thread title updated')
        onSuccess?.(threadId)
      })
      .catch((err) => {
        console.error(err)
        toast.error('An error occurred while trying to update thread title')
      })
  }

  return (
    <Dialog.Root
      onOpenChange={(open) => {
        if (open) setTitle(thread.title ?? '')
        if (!open) onClose?.()
      }}
      {...props}
    >
      {children && <Dialog.Trigger>{children}</Dialog.Trigger>}

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Edit title</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Change the title of your thread:
        </Dialog.Description>

        <div className="flex flex-col gap-3">
          <Label className="text-sm font-semibold">
            Title
            <TextField.Root
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter thread title"
            />
          </Label>
        </div>

        <div className="mt-4 gap-3 flex-end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close onClick={handleUpdate}>
            <Button>Save</Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
