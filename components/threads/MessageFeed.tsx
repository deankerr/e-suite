import { Thread } from '@/convex/threads/threads'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@radix-ui/themes'
import { forwardRef, useEffect, useRef } from 'react'
import { Message } from './Message'

type MessageFeedProps = {
  messages: Thread['messages']
} & React.ComponentProps<typeof ScrollArea>

export const MessageFeed = forwardRef<HTMLDivElement, MessageFeedProps>(function MessageFeed(
  { messages, className, ...props },
  forwardedRef,
) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages.length])

  return (
    <ScrollArea {...props} className={cn('', className)} ref={forwardedRef}>
      <div className="flex flex-col" ref={scrollRef}>
        {messages.map((msg) => (
          <Message key={msg._id} message={msg} />
        ))}
      </div>
    </ScrollArea>
  )
})
