'use client'

import { useEffect, useRef } from 'react'
import { ScrollArea } from '@radix-ui/themes'

import { MessageBubble } from '@/components/threads/MessageBubble'
import { MessageInput } from '@/components/threads/MessageInput'
import { useThread } from '@/components/threads/useThread'
import { useVoiceoverPlayer } from '@/components/threads/useVoiceoverPlayer'
import { cn } from '@/lib/utils'

import type { Id } from '@/convex/_generated/dataModel'

type ChatProps = {
  threadId?: Id<'threads'>
}

export const Chat = ({ threadId }: ChatProps) => {
  const { messages, send, threadAtoms } = useThread({
    threadId,
  })

  const scrollRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages])

  useVoiceoverPlayer(messages)

  return (
    <div className="flex grow overflow-hidden bg-gray-1">
      {/* chat */}
      <div className={cn('flex grow')}>
        {/* message feed */}
        <div className={cn('grow')}>
          <ScrollArea className="h-[calc(100%-4rem)]" scrollbars="vertical">
            <div className="flex flex-col items-center gap-3 p-3 md:gap-4 md:p-4" ref={scrollRef}>
              {messages?.map((message) => <MessageBubble message={message} key={message._id} />)}
            </div>
          </ScrollArea>

          {/* input bar */}
          <MessageInput inputAtom={threadAtoms.message} onSend={send} />
        </div>
      </div>
    </div>
  )
}
