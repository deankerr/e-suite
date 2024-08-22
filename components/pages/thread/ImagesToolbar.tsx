'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'

import { SearchField } from '@/components/form/SearchField'
import { SkeletonShimmer } from '@/components/ui/Skeleton'
import { useThread } from '@/lib/api'
import { twx } from '@/lib/utils'

export const ImagesToolbar = ({ thread_id }: { thread_id: string }) => {
  const thread = useThread(thread_id ?? '')

  if (thread === undefined) {
    return (
      <ImagesToolbarWrapper>
        <SkeletonShimmer />
      </ImagesToolbarWrapper>
    )
  }

  if (thread === null) {
    return (
      <ImagesToolbarWrapper>
        <Icons.Question size={20} className="text-grayA-11" />
      </ImagesToolbarWrapper>
    )
  }

  return (
    <ImagesToolbarWrapper>
      <SearchField />
    </ImagesToolbarWrapper>
  )
}

const ImagesToolbarWrapper = twx.div`flex-start h-10 border-b border-gray-5 w-full gap-1 px-1 text-sm`
