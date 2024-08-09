'use client'

import { useMessagesQuery } from '@/components/providers/MessagesQueryProvider'
import { Button } from '@/components/ui/Button'

export const MessageQueryInfo = () => {
  const { isLoading, status, loadMore } = useMessagesQuery()
  return (
    <div>
      <Button
        variant="soft"
        color="gray"
        size="1"
        onClick={() => loadMore(20)}
        loading={isLoading}
        disabled={status !== 'CanLoadMore'}
      >
        {status === 'CanLoadMore' ? 'Load more' : 'Exhausted'}
      </Button>
    </div>
  )
}
