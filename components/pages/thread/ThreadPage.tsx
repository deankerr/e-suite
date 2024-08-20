'use client'

import { twc } from 'react-twc'

import { FavouriteButton } from '@/components/pages/thread/FavouriteButton'
import { ThreadMenu } from '@/components/pages/thread/ThreadMenu'
import { useThread } from '@/lib/api'

export const ThreadPage = twc.div`flex h-full w-full flex-col overflow-hidden border-gray-5 bg-gray-1 md:rounded-md md:border`

export const ThreadHeaderWrapper = twc.div`flex-start h-10 shrink-0 overflow-hidden border-b border-gray-5 px-1 font-medium`

export const ThreadHeader = ({ thread_id }: { thread_id: string }) => {
  const thread = useThread(thread_id)

  if (thread === null) return <ThreadHeaderWrapper />

  if (thread === undefined) {
    return <ThreadHeaderWrapper>loading</ThreadHeaderWrapper>
  }

  return (
    <ThreadHeaderWrapper>
      <div className="size-4" />
      <h1 className="truncate px-1 text-sm font-medium">{thread.title ?? 'Untitled Thread'}</h1>

      <ThreadMenu thread_id={thread_id} />
      <FavouriteButton thread_id={thread_id} />
    </ThreadHeaderWrapper>
  )
}
