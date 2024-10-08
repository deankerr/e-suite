'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'

import { useThread, useUpdateThread } from '@/app/lib/api/threads'
import { IconButton } from '@/components/ui/Button'

export const FavouriteButton = ({ threadId }: { threadId: string }) => {
  const thread = useThread(threadId)
  const sendUpdateThread = useUpdateThread()

  if (!thread || !thread.user.isViewer) {
    return null
  }

  return (
    <IconButton
      aria-label={thread.favourite ? 'Unfavourite thread' : 'Favourite thread'}
      variant="ghost"
      color={thread.favourite ? 'orange' : 'gray'}
      onClick={() =>
        sendUpdateThread({
          threadId: thread._id,
          favourite: !thread.favourite,
        })
      }
    >
      <Icons.Star size={20} weight={thread.favourite ? 'fill' : 'regular'} />
    </IconButton>
  )
}
