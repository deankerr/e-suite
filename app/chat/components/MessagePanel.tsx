import type { ChatMessage } from '../Chat'
import { MessageBubble, SystemBubble } from './MessageBubble'

export function MessagePanel({ messages }: { messages: ChatMessage[] }) {
  return (
    <div
      className="flex-1 overflow-scroll px-3 pb-3"
      onClick={() => console.log('[MessagePanel]', messages)}
    >
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
