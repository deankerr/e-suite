'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { twc } from 'react-twc'

import { FavouriteButton } from '@/components/pages/thread/FavouriteButton'
import { ThreadMenu } from '@/components/pages/thread/ThreadMenu'
import { SkeletonShimmer } from '@/components/ui/Skeleton'
import { useImage, useThread } from '@/lib/api'

export const ThreadPage = twc.div`flex h-full w-full flex-col overflow-hidden border-gray-5 bg-gray-1 md:rounded-md md:border`

export const ThreadHeaderWrapper = twc.div`flex-start h-10 shrink-0 overflow-hidden border-b border-gray-5 px-1 font-medium`

export const ThreadHeader = ({
  thread_id,
  image_id,
}: {
  thread_id?: string
  image_id?: string
}) => {
  const image = useImage(image_id)
  const thread = useThread(thread_id ?? image?.threadId ?? '')

  if (thread === undefined) {
    return (
      <ThreadHeaderWrapper>
        <SkeletonShimmer />
      </ThreadHeaderWrapper>
    )
  }

  if (thread === null) {
    return (
      <ThreadHeaderWrapper>
        <Icons.Question size={20} className="text-grayA-11" />
      </ThreadHeaderWrapper>
    )
  }

  return (
    <ThreadHeaderWrapper>
      <div className="size-4" />
      <h1 className="truncate px-1 text-sm font-medium">{thread.title ?? 'Untitled Thread'}</h1>

      <ThreadMenu thread_id={thread.slug} />
      <FavouriteButton thread_id={thread.slug} />
    </ThreadHeaderWrapper>
  )
}
