'use client'

import { MessageBubble } from '@/components/chat/message-bubble'
import { ChatSession } from '@/components/chat/types'
import { cn } from '@/lib/utils'
import { Engine } from '@prisma/client'
import { useAiChat } from './use-ai-chat'

type ReqStat = 'idle' | 'waiting' | 'streaming'

export function MessageFeed({
  session,
  engine,
  className,
}: { session: ChatSession; engine: Engine } & React.ComponentProps<'div'>) {
  // const requestStatus: ReqStat = 'idle'
  const isStreaming = false
  const isWaiting = false

  const chatHelpers = useAiChat(session, engine)
  return (
    <div className={cn('space-y-4', className)}>
      {chatHelpers.messages.map((m) => (
        <MessageBubble
          variant={m.role}
          content={m.content}
          loading={chatHelpers.messages.at(-1)?.id === m.id && isStreaming}
          key={m.id}
        />
      ))}
      {isWaiting && <MessageBubble variant="assistant" content="" loading={true} />}
    </div>
  )
}
