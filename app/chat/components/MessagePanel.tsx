import type { ChatMessage } from '../Chat'
import { ChatBubble, MessageBubble, MessageBubbleSystem } from './MessageBubble'

export function MessagePanel({ messages }: { messages: ChatMessage[] }) {
  return (
    <div
      className="flex-1 overflow-y-auto overflow-x-clip px-4 pb-3"
      onClick={() => console.log('[MessagePanel]', messages)}
    >
      {messages.map((msg, i) =>
        msg.role === 'system' ? (
          <MessageBubbleSystem content={msg.content} key={i} />
        ) : (
          <MessageBubble message={msg} key={i} />
        ),
      )}
    </div>
  )
}
