'use client'

import { useMessagesQuery } from '@/components/providers/MessagesQueryProvider'
import { Button } from '@/components/ui/Button'

export const MessageQueryInfo = () => {
  const { messages = [], isLoading, status, loadMore } = useMessagesQuery()
  return (
    <div>
      <Button
        variant="ghost"
        color="gray"
        size="1"
        onClick={() => loadMore(20)}
        loading={isLoading}
      >
        {status} ⋅ {messages.length}
      </Button>
    </div>
  )
}
