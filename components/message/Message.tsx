import { useMemo, useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { DropdownMenu } from '@radix-ui/themes'
import { RiMoreFill } from '@remixicon/react'
import Link from 'next/link'

import { useDeleteMessage, useMessageTextStream } from '@/app/lib/api/threads'
import { useViewer } from '@/app/lib/api/users'
import { cn } from '@/app/lib/utils'
import { ImageCardNext } from '@/components/images/ImageCardNext'
import { Markdown } from '@/components/markdown/Markdown'
import { Pre } from '@/components/markdown/Pre'
import { MessageEditor } from '@/components/message/MessageEditor'
import { IconButton } from '@/components/ui/Button'
import { getMessageName } from '@/convex/shared/helpers'
import { Loader } from '../ui/Loader'
import { TimeSince } from './TimeSince'

import type { EMessage } from '@/convex/types'

function getKV(kvMetadata: Record<string, string> | undefined, key: string) {
  return kvMetadata?.[`esuite:${key}`]
}

const accentColors: Record<string, string> = {
  assistant: '#d86518',
  system: '#ffc53d', // amber-9
  user: '#29a383', // mint-9
  tool: '#46a758', // grass-9
}

const accentColorFallback = '#29a383' // jade-9

export const Message = ({
  message,
  hideTimeline = false,
}: {
  message: EMessage
  hideTimeline?: boolean
}) => {
  const { role, kvMetadata: kv } = message

  const modelId = getKV(kv, 'run:model-id')
  const modelName = getKV(kv, 'run:model-name')
  const assistantName = message.name ?? modelName ?? modelId ?? 'Assistant'

  const name = role === 'assistant' ? assistantName : getMessageName(message) || message.role

  const accentColor = accentColors[role] ?? accentColorFallback

  const [showJson, setShowJson] = useState(false)
  const [showEditor, setShowEditor] = useState(false)

  const deleteMessage = useDeleteMessage()

  const runId = getKV(kv, 'run:hint') ? message.runId : undefined
  const textStream = useMessageTextStream(runId)
  const text = message.text ?? textStream
  const showRunIndicator = runId && text === undefined

  const { isViewer } = useViewer(message.userId)
  const hasSVG = text && text.includes('```svg\n<svg')

  const dropdownMenu = useMemo(
    () => (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton variant="ghost" size="1" color="gray" aria-label="More">
            <RiMoreFill size={20} />
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
          <DropdownMenu.Item onClick={() => setShowJson(!showJson)}>Show JSON</DropdownMenu.Item>

          {isViewer && (
            <>
              <DropdownMenu.Item onClick={() => setShowEditor(!showEditor)}>
                {showEditor ? 'Cancel Edit' : 'Edit'}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                color="red"
                onClick={() => deleteMessage({ messageId: message._id })}
              >
                Delete
              </DropdownMenu.Item>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    ),
    [
      message.threadSlug,
      message.series,
      message._id,
      isViewer,
      showEditor,
      showJson,
      deleteMessage,
    ],
  )

  return (
    <div
      className={cn(
        'flex min-h-7 w-full shrink-0 pr-2 @container/message',
        'rounded border border-transparent',
        showEditor && 'border-dashed border-accentA-7 hover:border-accentA-8',
      )}
      style={{ contain: 'paint' }}
    >
      {/* > timeline */}
      <div className={cn('flex w-4 shrink-0 justify-center', hideTimeline && 'hidden')}>
        <div className="absolute inset-y-1 w-px" style={{ backgroundColor: accentColor }} />
      </div>

      {/* > content */}
      <div className="grow">
        <div className="flex-start gap-1">
          {/* => name */}
          <div className="brightness-125 saturate-[.75]" style={{ color: accentColor }}>
            {name}
          </div>
          <div className="w-6 text-center text-gray-10">
            <TimeSince time={Math.floor(message._creationTime)} />
          </div>

          {/* => menu */}
          {dropdownMenu}

          {hasSVG && (
            <Link href={`/drawing/${message._id}`} target="_blank">
              <IconButton variant="ghost" color="gray" size="1" aria-label="Open SVG">
                <Icons.Graph size={18} />
              </IconButton>
            </Link>
          )}
        </div>

        {!showEditor && text ? (
          <div className="markdown-root min-h-7 py-1">
            {/* => markdown text */}
            <Markdown>{text}</Markdown>
          </div>
        ) : null}

        {/* => editor */}
        {showEditor && (
          <MessageEditor message={message} onClose={() => setShowEditor(false)} className="pb-2" />
        )}

        {/* => images  */}
        {message.images?.length ? (
          <div className="flex flex-wrap gap-2">
            {message.images.map((image) => (
              <div key={image._id}>
                <ImageCardNext image={image} sizes="(max-width: 410px) 20rem" />
              </div>
            ))}
          </div>
        ) : null}

        {/* => loading ping  */}
        {showRunIndicator && (
          <div className="p-1">
            <Loader type="ping" color={accentColor} />
          </div>
        )}

        {/* => json */}
        {showJson && <Pre className="max-w-screen-md">{JSON.stringify(message, null, 2)}</Pre>}
      </div>
    </div>
  )
}
