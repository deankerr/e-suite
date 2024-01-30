'use client'

import { api } from '@/convex/_generated/api'
import { Card, ScrollArea } from '@radix-ui/themes'
import { usePaginatedQuery, type PaginationStatus } from 'convex/react'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { Generation } from './Shell/Generation'

export const GenerationFeed = () => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.generations.page,
    {},
    { initialNumItems: 3 },
  )
  const { ref, inView } = useInView({ delay: 1000, initialInView: true })

  useEffect(() => {
    if (inView && status === 'CanLoadMore') {
      loadMore(6)
    }
  }, [inView, loadMore, status])

  return (
    <ScrollArea>
      <div className="space-y-rx-8 overflow-y-auto py-rx-8">
        {results?.map((gen) => <Generation key={gen.generation._id} {...gen} />)}

        <Loader status={status} loadRef={ref} />
      </div>
    </ScrollArea>
  )
}

const Loader = ({
  status,
  loadRef,
}: {
  status: PaginationStatus
  loadRef: (node?: Element | null | undefined) => void
}) => {
  const messages: Record<PaginationStatus, string> = {
    LoadingFirstPage: 'Get ready for some wacky images!',
    LoadingMore: "Look out! More zany .webp's are on the way!",
    CanLoadMore: "Look out! More zany .webp's are on the way!",
    Exhausted:
      "Uh-oh, looks like there's no more kooky images left. Why don't you generate some more?",
  }

  return (
    <Card className="mx-auto w-fit" ref={loadRef}>
      {messages[status]}
    </Card>
  )
}
