'use client'

import { MessageBubble } from '@/components/chat/message-bubble'
import { ChatSession } from '@/components/chat/types'
import { cn } from '@/lib/utils'
import { Engine } from '@prisma/client'
import { Message } from 'ai/react'
import { useAiChat } from './use-ai-chat'

type ReqStat = 'idle' | 'waiting' | 'streaming'

export function MessageFeed({ session, engine }: { session: ChatSession; engine: Engine }) {
  // const requestStatus: ReqStat = 'idle'
  const isStreaming = false
  const isWaiting = false

  const chatHelpers = useAiChat(session, engine)
  return (
    <div
      // ref={contentAreaRef}
      className="grid h-full max-w-3xl grid-rows-[1fr,_auto] border-r shadow-inner"
    >
      {/* Message Feed */}
      <div className={cn('space-y-4 pb-14 pt-2.5')}>
        {chatHelpers.messages.map((m) => (
          <MessageBubble
            variant={m.role}
            content={m.content}
            loading={chatHelpers.messages.at(-1)?.id === m.id && isStreaming}
            key={m.id}
          />
        ))}
        {isWaiting && <MessageBubble variant="assistant" content="" loading={true} />}
        <div></div>
      </div>
    </div>
  )
}

/* 


      
          }
*/
