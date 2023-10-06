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
      <div className="px-1 text-sm">{message.name ?? config.name}</div>
      <div
        className={`rounded-xl border ${config.border} max-w-[90vw] bg-base-100 px-4 py-2 text-base-content `}
      >
        <div className="prose prose-neutral">
          <Markdown>{message.content}</Markdown>
        </div>
      </div>
    </div>
  )
}
