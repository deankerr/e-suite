import { useMemo, useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { DropdownMenu } from '@radix-ui/themes'
import { RiMoreFill } from '@remixicon/react'
import Link from 'next/link'

import { useDeleteMessage } from '@/app/lib/api/threads'
import { cn } from '@/app/lib/utils'
import { ImageCardNext } from '@/components/images/ImageCardNext'
import { useMarbleProperties } from '@/components/marble-avatar/Marble'
import { Markdown } from '@/components/markdown/Markdown'
import { Pre } from '@/components/markdown/Pre'
import { MessageEditor } from '@/components/message/MessageEditor'
import { IconButton } from '@/components/ui/Button'
import { getMessageName } from '@/convex/shared/helpers'
import { Loader } from '../ui/Loader'
import { TimeSince } from './TimeSince'

import type { EMessage } from '@/convex/types'

export const Message = ({
  message,
  deepLinkUrl,
  hideTimeline = false,
  priority = false,
  withText,
  className,
  ...props
}: {
  message: EMessage
  deepLinkUrl?: string
  hideTimeline?: boolean
  priority?: boolean
  withText?: string
} & React.ComponentProps<'div'>) => {
  const name = getMessageName(message) || message.role
  const text = message.text
  const marbleProps = useMarbleProperties(name)

  const [showJson, setShowJson] = useState(false)
  const [showEditor, setShowEditor] = useState(false)

  const deleteMessage = useDeleteMessage()

  const dropdownMenu = useMemo(
    () =>
      message.userIsViewer ? (
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

            <DropdownMenu.Item onClick={() => setShowEditor(!showEditor)}>
              {showEditor ? 'Cancel Edit' : 'Edit'}
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={() => setShowJson(!showJson)}>Show JSON</DropdownMenu.Item>
            <DropdownMenu.Item
              color="red"
              onClick={() => deleteMessage({ messageId: message._id })}
            >
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      ) : null,
    [
      deleteMessage,
      message.userIsViewer,
      message.threadSlug,
      message.series,
      message._id,
      showEditor,
      showJson,
    ],
  )

  return (
    <div
      {...props}
      className={cn(
        'flex min-h-7 w-full shrink-0 pr-2 @container/message',
        'rounded border border-transparent',
        showEditor && 'border-dashed border-accentA-7 hover:border-accentA-8',
        message.threadSlug === 'streaming' && 'bg-grayA-2',
        className,
      )}
    >
      {/* > timeline */}
      <div className={cn('flex w-4 shrink-0 justify-center', hideTimeline && 'hidden')}>
        <div
          className="absolute inset-y-1 w-px"
          style={{ backgroundColor: marbleProps[0].color }}
        />
      </div>

      {/* > content */}
      <div className="grow">
        <div className="flex-start gap-1">
          {/* => name */}
          <div className="brightness-125 saturate-[.75]" style={{ color: marbleProps[0].color }}>
            {name}
          </div>
          <div className="w-6 text-center text-gray-10">
            <TimeSince time={Math.floor(message._creationTime)} />
          </div>

          {/* => menu */}
          {dropdownMenu}
        </div>

        {!showEditor && text ? (
          <div className="temp-tui-md-root min-h-7 py-1">
            {/* => markdown text */}
            <Markdown text={text} />
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
        {message.threadSlug === 'waiting' && (
          <div className="p-1">
            <Loader type="ping" color={marbleProps[0].color} />
          </div>
        )}

        {/* => json */}
        {showJson && <Pre className="max-w-screen-md">{JSON.stringify(message, null, 2)}</Pre>}
      </div>
    </div>
  )
}
