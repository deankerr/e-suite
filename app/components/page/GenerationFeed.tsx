'use client'

import { api } from '@/convex/_generated/api'
import { Card, ScrollArea } from '@radix-ui/themes'
import { usePaginatedQuery, type PaginationStatus } from 'convex/react'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { Generation } from '../Shell/Generation'
import { Spinner } from '../ui/Spinner'

export const GenerationFeed = ({
  className,
  ...props
}: React.ComponentProps<typeof ScrollArea>) => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.generations.page,
    {},
    { initialNumItems: 3 },
  )
  const { ref, inView } = useInView({ delay: 3000 })

  useEffect(() => {
    if (inView && status === 'CanLoadMore') {
      loadMore(6)
    }
  }, [inView, loadMore, status])

  return (
    <ScrollArea className={className} {...props}>
      <div className="space-y-rx-8 overflow-y-auto px-4 pb-28 pt-4">
        {results?.map((gen) => <Generation key={gen.generation._id} {...gen} />)}
        {/* <Loader status={status} loadRef={ref} /> */}
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
  const messages: Record<PaginationStatus, React.ReactNode> = {
    LoadingFirstPage: (
      <div className="flex items-center gap-2">
        {'Here come some wacky AI images!'} <Spinner />
      </div>
    ),
    LoadingMore: (
      <div className="flex items-center gap-2">
        {"Look out! More zany .webp's are on the way!"} <Spinner />
      </div>
    ),
    CanLoadMore: (
      <div className="flex items-center gap-2">
        {"Look out! More zany .webp's are on the way!"} <Spinner />
      </div>
    ),
    Exhausted:
      "Uh-oh, looks like there's no more kooky images left. Why don't you generate some more?",
  }

  return (
    <Card className="mx-auto w-fit" ref={loadRef}>
      {messages[status]}
    </Card>
  )
}
