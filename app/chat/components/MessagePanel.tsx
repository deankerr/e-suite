import type { ChatMessage } from '../Chat'
import { MessageBubble } from './MessageBubble'

export function MessagePanel({ messages }: { messages: ChatMessage[] }) {
  return (
    <div
      className="flex-1 overflow-y-auto overflow-x-clip px-3 pb-3"
      onClick={() => console.log('[MessagePanel]', messages)}
    >
      {messages.map((msg, i) => (
        <MessageBubble message={msg} key={i} />
      ))}
    </div>
  )
}
