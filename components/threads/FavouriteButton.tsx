'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'

import { useThread } from '@/app/lib/api/threads'
import { IconButton } from '@/components/ui/Button'
import { useUpdateThread } from '@/lib/api'

export const FavouriteButton = ({ thread_id }: { thread_id: string }) => {
  const thread = useThread(thread_id)
  const sendUpdateThread = useUpdateThread()

  if (!thread || !thread.userIsViewer) {
    return null
  }

  return (
    <IconButton
      aria-label={thread.favourite ? 'Unfavourite thread' : 'Favourite thread'}
      variant="ghost"
      color={thread.favourite ? 'orange' : 'gray'}
      onClick={() =>
        sendUpdateThread({ threadId: thread._id, fields: { favourite: !thread.favourite } })
      }
    >
      <Icons.Star size={20} weight={thread.favourite ? 'fill' : 'regular'} />
    </IconButton>
  )
}
