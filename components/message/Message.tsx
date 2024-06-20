import { useState } from 'react'
import { DotsThreeVertical } from '@phosphor-icons/react/dist/ssr'
import { DropdownMenu, IconButton } from '@radix-ui/themes'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

import { Avatar } from '@/components/message/Avatar'
import { ImageGallery } from '@/components/message/ImageGallery'
import { Markdown } from '@/components/message/Markdown'
import { VoiceoverButton } from '@/components/message/VoiceoverButton'
import { Pre } from '@/components/util/Pre'
import { cn } from '@/lib/utils'

import type { EMessage } from '@/convex/shared/types'

export const Message = ({
  message,
  timeline = true,
  slug,
  removeMessage,
}: {
  message: EMessage
  timeline?: boolean
  slug?: string
  removeMessage?: (messageId: string) => void
}) => {
  const [showJson, setShowJson] = useState(false)

  return (
    <div className="flex gap-3">
      {/* timeline */}
      <div className="flex shrink-0 justify-center py-2">
        <div className={cn('absolute inset-y-0 w-0.5 bg-grayA-2', !timeline && 'hidden')}></div>

        {/* avatar */}
        <Avatar role={message.role} />
      </div>

      {/* message */}
      <div className="space-y-1 py-2 text-sm">
        {/* title */}
        <div className="space-x-2">
          <span className="font-medium text-gray-11">{message.name ?? message.role}</span>
          <Link
            href={`/c/${slug}/${message.series}`}
            className="text-xs text-gray-11 hover:underline"
          >
            {formatDistanceToNow(new Date(message._creationTime), { addSuffix: true })}
          </Link>
        </div>

        {/* content */}
        <div className="w-fit max-w-full rounded-lg bg-grayA-2 p-2">
          <div className="prose prose-sm prose-stone prose-invert max-w-none prose-pre:p-0">
            <Markdown>{message.content}</Markdown>
          </div>

          <ImageGallery message={message} />
        </div>

        {showJson && <Pre>{JSON.stringify(message, null, 2)}</Pre>}
      </div>

      {/* menu */}
      <div className="shrink-0 flex-col-center">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton variant="ghost" size="1" className="m-0" color="gray">
              <DotsThreeVertical className="size-5" />
            </IconButton>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content variant="soft">
            <DropdownMenu.Item onClick={() => setShowJson(!showJson)}>
              toggle show json
            </DropdownMenu.Item>

            {removeMessage && (
              <DropdownMenu.Item color="red" onClick={() => removeMessage(message._id)}>
                Delete
              </DropdownMenu.Item>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        <VoiceoverButton message={message} />
      </div>
    </div>
  )
}
