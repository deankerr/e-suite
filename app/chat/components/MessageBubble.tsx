import { Markdown } from '@/components/Markdown'
import type { ChatMessage } from '../Chat'

const bubbleRolesConfig = {
  user: {
    position: 'items-start',
    border: 'border-info',
    name: 'User',
  },
  assistant: {
    position: 'items-end',
    border: 'border-secondary',
    name: 'Assistant',
  },
  system: {
    position: 'items-center text-center',
    border: 'border-primary',
    name: 'System',
  },
  function: {
    position: 'items-center text-center',
    border: 'border-primary',
    name: 'Function',
  },
} as const

export function MessageBubble({ message }: { message: ChatMessage }) {
  const config = bubbleRolesConfig[message.role]

  return (
    <div className={`flex flex-col ${config.position} py-1`}>
      <div className="w-fit px-1 text-sm">{message.name ?? config.name}</div>
      <div
        className={`w-fit max-w-[90%] rounded-xl border ${config.border} bg-base-100 px-4 py-2 text-base-content`}
      >
        <div className="prose prose-neutral max-w-none">
          <Markdown>{message.content}</Markdown>
        </div>
      </div>
    </div>
  )
}

export function DaisyChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  return (
    <div className={`chat ${isUser ? 'chat-start' : 'chat-end'}`}>
      <div className="chat-header text-transparent">
        {message.name ?? (isUser ? 'User' : 'Assistant')}
      </div>
      <div
        className={`${isUser ? 'border-secondary' : 'border-accent'} chat-bubble border shadow-lg`}
      >
        <Markdown>{message.content}</Markdown>
      </div>
    </div>
  )
}
