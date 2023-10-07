import { Markdown } from '@/components/Markdown'
import type { ChatMessage } from './Chat'

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
    name: 'Prompt',
  },
  function: {
    position: 'items-center text-center',
    border: 'border-primary',
    name: 'Function',
  },
} as const

export function MessageBubble({ message }: { message: Partial<ChatMessage> }) {
  const config = bubbleRolesConfig[message.role ?? 'system']
  const loadingIcon = (
    <span className="not-prose loading loading-ring loading-md align-middle"></span>
  )

  return (
    <div className={`flex flex-col ${config.position} py-1`}>
      <div className="px-1 text-sm">
        {message.name ?? config.name}
        {/* <span className="text-xs opacity-50"> {message.id}</span> */}
      </div>
      <div
        className={`rounded-xl border ${config.border} max-w-[90vw] bg-base-100 px-4 py-2 text-base-content `}
      >
        <div className="prose prose-neutral">
          {message.content ? <Markdown>{message.content}</Markdown> : loadingIcon}
        </div>
      </div>
    </div>
  )
}
