'use client'

import { Chat } from '@/components/chat/Chat'
import { useChatDeck } from '@/components/chat/useChatDeck'
import { cn } from '@/lib/utils'

export const ChatDeck = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { deck } = useChatDeck()
  return (
    <div
      {...props}
      className={cn(
        'flex h-full w-full snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden px-3 sm:py-3',
        className,
      )}
    >
      {deck.map((slug) => (
        <Chat key={slug} slug={slug} className="flex-[1_0_min(100vw,30rem)] snap-center" />
      ))}
    </div>
  )
}
