import { ThreadInputBar } from '@/app/t/[[...slug]]/thread-view/ThreadInputBar'
import { ThreadView } from '@/app/t/[[...slug]]/thread-view/ThreadView'
import { ThreadViewBar } from '@/app/t/[[...slug]]/thread-view/ThreadViewBar'
import { useThreadContent } from '@/lib/api'
import { cn } from '@/lib/utils'

type ThreadContainerProps = { threadId?: string } & React.ComponentProps<'div'>

export const ThreadContainer = ({ threadId, className, ...props }: ThreadContainerProps) => {
  const thread = useThreadContent(threadId)

  return (
    <div
      {...props}
      className={cn('mx-auto flex flex-[1_0_min(100vw,24rem)] flex-col overflow-y-auto', className)}
    >
      <div className="sticky top-0 z-10 h-16 shrink-0 border-b bg-gray-1">
        {thread && <ThreadViewBar thread={thread} />}
      </div>

      {thread && <ThreadView thread={thread} />}

      <div className="sticky bottom-0 z-10 border-t bg-gray-1">
        {thread && <ThreadInputBar thread={thread} />}
      </div>
    </div>
  )
}
