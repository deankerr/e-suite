import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Code, DropdownMenu } from '@radix-ui/themes'
import Link from 'next/link'
import { toast } from 'sonner'

import { useDeleteMessage, useRun } from '@/app/lib/api/threads'
import { IconButton } from '../ui/Button'
import { Loader } from '../ui/Loader'
import { useMessageContext } from './MessageProvider'
import { TimeSince } from './TimeSince'

import type { EMessage } from '@/convex/types'

export const MessageHeader = () => {
  const {
    message,
    isEditing,
    showJson,
    setShowJson,
    setIsEditing,
    viewerCanEdit,
    textStyle,
    setTextStyle,
  } = useMessageContext()

  const deleteMessage = useDeleteMessage()
  const handleDeleteMessage = () => {
    deleteMessage({ messageId: message._id })
      .then(() => {
        toast.success('Message deleted')
      })
      .catch((error) => {
        toast.error('Failed to delete message')
        console.error('Error deleting message:', error)
      })
  }

  const color = getRoleColor(message.role)
  const name = getName(message)
  const hasSVG = message.text?.includes('```svg\n<svg')

  const runId = message.kvMetadata['esuite:run:hint'] ? message.runId : undefined
  const run = useRun(runId)

  return (
    <div className="flex h-12 shrink-0 items-center gap-1 border-b border-grayA-3 bg-grayA-2 p-2.5">
      <div className="flex-start gap-2">
        <Code color={color} className="whitespace-pre px-1.5 uppercase" size="3">
          {message.role}
        </Code>
        <div className="font-medium text-gray-11">{name}</div>
      </div>

      <div className="grow" />
      {hasSVG && (
        <Link href={`/drawing/${message._id}`} target="_blank">
          <IconButton variant="ghost" size="1" aria-label="Open SVG">
            <Icons.Graph size={18} />
          </IconButton>
        </Link>
      )}

      <div className="flex-center font-mono text-gray-10">
        <TimeSince time={Math.floor(message._creationTime)} />
      </div>

      <IconButton
        variant="ghost"
        color="gray"
        size="1"
        aria-label="Copy message"
        onClick={() => navigator.clipboard.writeText(message.text ?? '')}
        disabled={!message.text}
      >
        <Icons.Copy size={18} />
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

      {viewerCanEdit && (
        <IconButton
          variant="ghost"
          color={isEditing ? 'orange' : 'gray'}
          size="1"
          aria-label="Edit"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Icons.Pencil size={18} />
        </IconButton>
      )}

      {viewerCanEdit && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton variant="ghost" color="gray" size="1" aria-label="Delete">
              <Icons.Trash size={18} />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content variant="soft" size="1">
            <DropdownMenu.Item color="red" onClick={handleDeleteMessage}>
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )}

      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton variant="ghost" color="gray" size="1" aria-label="More">
            <Icons.DotsThree size={18} className="scale-150" weight="bold" />
          </IconButton>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content variant="soft">
          <Link href={`/chats/${message.threadSlug}/${message.series}`}>
            <DropdownMenu.Item>
              <Icons.Share /> Link
            </DropdownMenu.Item>
          </Link>
          <DropdownMenu.Item
            onClick={() => {
              navigator.clipboard.writeText(message._id)
            }}
          >
            <Icons.Copy /> Copy message ID
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => setShowJson(!showJson)}>
            <Icons.Code />
            Show JSON
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <div className="flex-center w-5">
        {run?.status === 'done' ? (
          <Icons.Check className="text-green-11" />
        ) : run?.status === 'failed' ? (
          <Icons.WarningOctagon className="text-red-11" />
        ) : run ? (
          <Loader type="ping" color="orange" size={40} />
        ) : (
          <Icons.Dot />
        )}
      </div>
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
