'use client'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { AlertDialog, Button } from '@radix-ui/themes'
import { useMutation } from 'convex/react'

export const DeleteGenerationDialog = ({
  children,
  id,
}: {
  children: React.ReactNode
  id: Id<'generations'>
}) => {
  // const remove = useMutation(api.generations.remove)
  const execute = async () => {
    // await remove({ id })
  }

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>{children}</AlertDialog.Trigger>
      <AlertDialog.Content style={{ maxWidth: 450 }}>
        <AlertDialog.Title>Delete generation</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure? These inspired creations will be gone for all time.
        </AlertDialog.Description>

        <div className="mt-rx-4 flex justify-end gap-rx-3">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action onClick={() => void execute()}>
            <Button variant="solid" color="red">
              Delete
            </Button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
