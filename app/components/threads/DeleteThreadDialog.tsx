'use client'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { AlertDialog, Button } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'

export const DeleteThreadDialog = ({
  children,
  id,
  onDelete,
}: {
  children: React.ReactNode
  id?: Id<'threads'>
  onDelete?: () => void
}) => {
  const removeThread = useMutation(api.threads.remove)

  if (!id) return children

  const execute = () => {
    removeThread({ id })
      .then(() => {
        console.log('deleted', id)
        toast.success('Thread deleted.')
        onDelete && onDelete()
      })
      .catch((error) => {
        console.error(error)
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('An unknown error occurred.')
        }
      })
  }

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>{children}</AlertDialog.Trigger>
      <AlertDialog.Content style={{ maxWidth: 450 }}>
        <AlertDialog.Title>Delete thread</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure? This witty yet insightful exchange will be gone forever.
        </AlertDialog.Description>

        <div className="mt-rx-4 flex justify-end gap-rx-3">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action onClick={execute}>
            <Button variant="solid" color="red">
              Delete
            </Button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
