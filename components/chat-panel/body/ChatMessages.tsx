import { MessageCard } from '@/components/cards/message-card/MessageCard'
import { useViewerDetails } from '@/lib/api'
import { cn, getMessageShape } from '@/lib/utils'

import type { Id } from '@/convex/_generated/dataModel'
import type { EThreadWithContent } from '@/convex/shared/structures'

type ChatMessagesProps = { thread: EThreadWithContent } & React.ComponentProps<'div'>

export const ChatMessages = ({ thread, className, ...props }: ChatMessagesProps) => {
  const { user } = useViewerDetails()
  const chatCompletion = thread.config.type === 'chat-completion' ? thread.config : null
  return (
    <div {...props} className={cn('flex h-full flex-col gap-4 p-3', className)}>
      {chatCompletion && user && (
        <MessageCard
          message={getMessageShape({
            _id: '_instructions' as Id<'messages'>,
            threadId: thread._id,
            role: 'system',
            name: 'Instructions',
            content: thread.instructions,
            owner: user,
          })}
        />
      )}

      {thread.messages.map((message) => (
        <MessageCard key={message._id} message={message} />
      ))}
    </div>
  )
}
