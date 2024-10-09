import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Code } from '@radix-ui/themes'

import { IconButton } from '../ui/Button'
import { useMessageContext } from './MessageProvider'
import { TimeSince } from './TimeSince'

import type { EMessage } from '@/convex/types'

export const MessageHeader = () => {
  const { message, isEditing, showJson, setIsEditing, setShowJson, textStyle, setTextStyle } =
    useMessageContext()

  if (!message) return null

  const color = getRoleColor(message.role)
  const name = getName(message)

  return (
    <div className="flex h-12 items-center gap-1 border-b border-grayA-3 bg-grayA-2 p-2.5">
      <div className="flex-start gap-2">
        <Code color={color} className="whitespace-pre px-1.5 uppercase" size="3">
          {message.role}
        </Code>
        <div className="font-medium text-gray-11">{name}</div>
      </div>

      <div className="grow" />

      <IconButton
        variant="ghost"
        color={showJson ? 'orange' : 'gray'}
        size="1"
        aria-label="Show JSON"
        onClick={() => setShowJson(!showJson)}
      >
        <Icons.Code size={18} />
      </IconButton>

      <IconButton
        variant="ghost"
        color={textStyle === 'markdown' ? 'orange' : 'gray'}
        size="1"
        aria-label="Toggle Markdown view"
        onClick={() => setTextStyle(textStyle === 'markdown' ? 'monospace' : 'markdown')}
      >
        <Icons.MarkdownLogo size={18} />
      </IconButton>

      <IconButton
        variant="ghost"
        color={isEditing ? 'orange' : 'gray'}
        size="1"
        aria-label="Edit"
        onClick={() => setIsEditing(!isEditing)}
      >
        <Icons.Pencil size={18} />
      </IconButton>

      <div className="flex-center font-mono text-gray-10">
        <TimeSince time={Math.floor(message._creationTime)} />
      </div>

      <IconButton variant="ghost" color="gray" size="1" aria-label="More">
        <Icons.DotsThree size={18} />
      </IconButton>

      <IconButton variant="ghost" color="gray" size="1" aria-label="Copy message">
        <Icons.Copy size={18} />
      </IconButton>

      <IconButton variant="ghost" color="gray" size="1" aria-label="Delete">
        <Icons.Trash size={18} />
      </IconButton>
    </div>
  )
}

function getRoleColor(role: string) {
  if (role === 'user') return 'grass'
  if (role === 'assistant') return 'orange'
  return 'gray'
}

function getName(message: EMessage) {
  if (message.name) return message.name

  if (message.role === 'assistant') {
    return message.kvMetadata['esuite:run:model-name']
  }
}
