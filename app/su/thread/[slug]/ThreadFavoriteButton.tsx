'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'

import { IconButton } from '@/components/ui/Button'
import { useThreads, useUpdateThread } from '@/lib/api'

export const ThreadFavoriteButton = ({ slug }: { slug: string }) => {
  const { thread } = useThreads(slug)
  const sendUpdateThread = useUpdateThread()

  if (!thread) {
    return null
  }

  const favorite = thread.favorite ?? false

  return (
    <IconButton
      aria-label={favorite ? 'Unfavorite thread' : 'Favorite thread'}
      variant="ghost"
      color={favorite ? 'orange' : 'gray'}
      onClick={() => sendUpdateThread({ threadId: thread._id, fields: { favorite: !favorite } })}
    >
      <Icons.Star size={20} weight={favorite ? 'fill' : 'regular'} />
    </IconButton>
  )
}
