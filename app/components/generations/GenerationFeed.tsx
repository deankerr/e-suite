'use client'

import { api } from '@/convex/_generated/api'
import { Card, ScrollArea } from '@radix-ui/themes'
import { useDebounce } from '@uidotdev/usehooks'
import { usePaginatedQuery, type PaginationStatus } from 'convex/react'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { Spinner } from '../ui/Spinner'
import { Generation } from './Generation'

const initialNumItems = 2
const itemsPerLoad = 6

export const GenerationFeed = ({
  className,
  ...props
}: React.ComponentProps<typeof ScrollArea>) => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.generations.list,
    {},
    { initialNumItems },
  )
  const { ref, inView } = useInView()
  const shouldLoadMore = inView && status === 'CanLoadMore'
  const shouldLoadMore2 = useDebounce(shouldLoadMore, 2000)

  useEffect(() => {
    if (shouldLoadMore && shouldLoadMore2) {
      console.log('load', itemsPerLoad)
      loadMore(itemsPerLoad)
    }
  }, [shouldLoadMore, loadMore, shouldLoadMore2])

  return (
    <ScrollArea className={className} {...props}>
      <div className="space-y-rx-8 overflow-y-auto px-4 pb-28 pt-4">
        {/* {results?.map((gen) => <Generation key={gen.generation._id} {...gen} />)}
        <Loader status={status} loadRef={ref} /> */}
      </div>
      <div className="fixed right-0 top-0 bg-black p-1 text-sm">
        {inView && 'inView'} {results.length} {status}
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
