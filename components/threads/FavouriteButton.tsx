'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'

import { IconButton } from '@/components/ui/Button'
import { useThread, useUpdateThread } from '@/lib/api'

export const FavouriteButton = ({ thread_id }: { thread_id: string }) => {
  const thread = useThread(thread_id)
  const sendUpdateThread = useUpdateThread()

  if (!thread || !thread.userIsViewer) {
    return null
  }

  return (
    <IconButton
      aria-label={thread.favorite ? 'Unfavorite thread' : 'Favorite thread'}
      variant="ghost"
      color={thread.favorite ? 'orange' : 'gray'}
      onClick={() =>
        sendUpdateThread({ threadId: thread._id, fields: { favorite: !thread.favorite } })
      }
    >
      <Icons.Star size={20} weight={thread.favorite ? 'fill' : 'regular'} />
    </IconButton>
  )
}
