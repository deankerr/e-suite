'use client'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { AlertDialog, Button } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { forwardRef } from 'react'
import { toast } from 'sonner'

type RemoveThreadDialogProps = { id: Id<'threads'>; onDelete: () => void } & React.ComponentProps<
  typeof AlertDialog.Root
>

export const RemoveThreadDialog = forwardRef<HTMLDivElement, RemoveThreadDialogProps>(
  function RemoveThreadDialog({ id, onDelete, children, ...props }, forwardedRef) {
    const runRemove = useMutation(api.threads.threads.remove)
    const remove = () => {
      runRemove({ id })
        .then((id) => {
          console.log('deleted', id)
          toast.success('Thread deleted.')
          onDelete()
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
      <AlertDialog.Root {...props}>
        <AlertDialog.Trigger>{children}</AlertDialog.Trigger>
        <AlertDialog.Content ref={forwardedRef} className={cn('max-w-sm')}>
          <AlertDialog.Title>Delete thread</AlertDialog.Title>
          <AlertDialog.Description size="2">
            Are you sure? This insightful yet witty exchange will be gone forever.
          </AlertDialog.Description>

          <div className="mt-rx-4 flex justify-end gap-rx-3">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action onClick={remove}>
              <Button variant="solid" color="red">
                Delete
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>
    )
  },
)
