'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

import { NavSheet } from '@/app/NavRail'
import { FavouriteButton } from '@/components/pages/thread/FavouriteButton'
import { ThreadMenu } from '@/components/pages/thread/ThreadMenu'
import { IconButton } from '@/components/ui/Button'
import { SkeletonShimmer } from '@/components/ui/Skeleton'
import { useImage, useThread } from '@/lib/api'
import { getThreadPath } from '@/lib/helpers'
import { twx } from '@/lib/utils'

export const ThreadPage = twx.div`flex h-full w-full flex-col overflow-hidden border-gray-5 bg-gray-1 md:rounded-md md:border`

export const ThreadHeaderWrapper = twx.div`flex-start h-10 shrink-0 overflow-hidden border-b border-gray-5 px-1 font-medium`

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
      <NavSheet>
        <IconButton variant="ghost" aria-label="Open navigation sheet" className="md:hidden">
          <Icons.List size={20} />
        </IconButton>
      </NavSheet>
      <div className="hidden size-4 md:block" />

      <h1 className="truncate px-1 text-sm font-medium">
        <Link
          href={getThreadPath({ slug: thread.slug, type: thread.latestRunConfig?.type })}
          className="underline-offset-4 hover:underline"
        >
          {thread.title ?? 'Untitled Thread'}
        </Link>
      </h1>

      <ThreadMenu thread_id={thread.slug} />
      <FavouriteButton thread_id={thread.slug} />
      <div className="grow" />
    </ThreadHeaderWrapper>
  )
}
