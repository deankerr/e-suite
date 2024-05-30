import { MessageCard } from '@/components/cards/MessageCard'
import { CommandMenu } from '@/components/thread/CommandMenu'
import { HeaderBar } from '@/components/thread/HeaderBar'
import { InputBar } from '@/components/thread/InputBar'
import { Spinner } from '@/components/ui/Spinner'
import { useThreadContent } from '@/lib/api'
import { cn } from '@/lib/utils'

type ThreadInterfaceProps = {
  threadId: string
  handleCloseThread: () => void
} & React.ComponentProps<'div'>

export const ThreadInterface = ({
  threadId,
  handleCloseThread,
  className,
  ...props
}: ThreadInterfaceProps) => {
  const thread = useThreadContent(threadId)

  return (
    <div {...props} className={cn('flex h-full flex-col overflow-y-auto', className)}>
      <div className="sticky top-0 z-10 h-16 shrink-0 border-b bg-gray-1">
        {thread && (
          <HeaderBar thread={thread} handleCloseThread={handleCloseThread}>
            <CommandMenu thread={thread} />
          </HeaderBar>
        )}
      </div>

      <div className="flex grow flex-col gap-4 p-3">
        {thread ? (
          thread.messages?.map((message) => (
            <MessageCard key={message._id} slug={thread.slug} message={message} />
          ))
        ) : (
          <Spinner className="m-auto" />
        )}
      </div>

      <div className="sticky bottom-0 z-10 min-h-16 border-t bg-gray-1">
        {thread && <InputBar thread={thread} />}
      </div>
    </div>
  )
}
