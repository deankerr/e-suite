'use client'

import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { DropdownMenu } from '@radix-ui/themes'

import { DotsThreeFillX } from '@/components/icons/DotsThreeFillX'
import { DeleteThreadDialog, EditThreadTitleDialog } from '@/components/pages/thread/dialogs'
import { IconButton } from '@/components/ui/Button'
import { useThreads } from '@/lib/api'

export const ThreadMenu = ({ thread_id }: { thread_id: string }) => {
  const { thread } = useThreads(thread_id)

  const [showEditTitleDialog, setShowEditTitleDialog] = useState(false)
  const [showDeleteThreadDialog, setShowDeleteThreadDialog] = useState(false)

  if (!thread || !thread.userIsViewer) {
    return null
  }

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton variant="ghost" color="gray" aria-label="More options">
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
