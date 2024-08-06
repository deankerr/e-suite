import { type UsePaginatedQueryResult } from 'convex/react'

import { Button } from '@/components/ui/Button'
import { Orbit } from '@/components/ui/Ldrs'

export const LoadMoreButton = ({
  query,
  ...props
}: { query: UsePaginatedQueryResult<any> } & React.ComponentProps<typeof Button>) => {
  const { status, isLoading, loadMore } = query

  if (status === 'Exhausted' || status === 'LoadingFirstPage') return null
  return (
    <Button {...props} disabled={isLoading} onClick={() => loadMore(20)}>
      {isLoading ? <Orbit size={24} /> : 'Load More'}
    </Button>
  )
}
