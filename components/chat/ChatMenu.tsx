'use client'

import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { DropdownMenu } from '@radix-ui/themes'
import { usePathname, useRouter } from 'next/navigation'

import { DeleteThreadDialog, EditThreadTitleDialog } from '@/components/chat/dialogs'
import { DotsThreeFillX } from '@/components/icons/DotsThreeFillX'
import { IconButton } from '@/components/ui/Button'
import { useThread } from '@/lib/api'

export const ChatMenu = ({ threadId }: { threadId: string }) => {
  const thread = useThread(threadId)
  const pathname = usePathname()
  const router = useRouter()
  const route = pathname.split('/')[1]

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
          {route === 'images' ? (
            <DropdownMenu.Item onClick={() => router.push(`/chat/${thread.slug}`)}>
              <Icons.Chat /> Chat view
            </DropdownMenu.Item>
          ) : route === 'chat' ? (
            <DropdownMenu.Item onClick={() => router.push(`/images/${thread.slug}`)}>
              <Icons.ImagesSquare /> Image view
            </DropdownMenu.Item>
          ) : null}

          <DropdownMenu.Item onClick={() => setShowEditTitleDialog(true)}>
            <Icons.Pencil /> Edit title
          </DropdownMenu.Item>

          <DropdownMenu.Item color="red" onClick={() => setShowDeleteThreadDialog(true)}>
            <Icons.Trash /> Delete thread
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
