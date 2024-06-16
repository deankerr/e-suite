'use client'

import { useChatDeck } from '@/components/chat-deck/useChatDeck'
import { Chat } from '@/components/chat/Chat'
import { cn } from '@/lib/utils'

export const ChatDeck = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { deck, remove } = useChatDeck()
  return (
    <div
      {...props}
      className={cn(
        'flex h-full w-full snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden p-2',
        className,
      )}
    >
      {deck.map((slug) => (
        <div key={slug} className="w-full">
          <Chat slug={slug} onClose={() => remove(slug)} />
        </div>
      ))}
    </div>
  )
}

// className="flex-[1_0_min(100vw,40rem)] snap-center"
