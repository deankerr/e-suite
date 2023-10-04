import type { ChatMessageItem } from '../Chat'
import { MessageBubble, SystemBubble } from './MessageBubble'

export function MessagePanel({ messages }: { messages: ChatMessageItem[] }) {
  return (
    <div className="overflow-auto px-2 pb-4">
      {messages.map((msg, i) =>
        msg.role === 'system' ? (
          <SystemBubble content={msg.content} key={i} />
        ) : (
          <MessageBubble message={msg} key={i} />
        ),
      )}
    </div>
  )
}
