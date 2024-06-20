import { useState } from 'react'
import { DotsThreeVertical, WarningCircle } from '@phosphor-icons/react/dist/ssr'
import { Callout, DropdownMenu, IconButton } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

import { Avatar } from '@/components/message/Avatar'
import { ImageGallery } from '@/components/message/ImageGallery'
import { Markdown } from '@/components/message/Markdown'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Pre } from '@/components/util/Pre'
import { VoiceoverButton } from '@/components/voiceovers/VoiceoverButton'
import { api } from '@/convex/_generated/api'
import { hasActiveJobName } from '@/convex/shared/utils'
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
  const removeVoiceover = useMutation(api.db.voiceover.remove)

  const showChatLoader =
    hasActiveJobName(message.jobs, 'inference/chat-completion') && !message.content
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
        {message.content && (
          <div className="w-fit max-w-full rounded-lg bg-grayA-2 p-2">
            <div className="prose prose-sm prose-stone prose-invert max-w-none prose-pre:p-0">
              <Markdown>{message.content}</Markdown>
            </div>
          </div>
        )}

        {showChatLoader && (
          <div className="w-fit max-w-full rounded-lg bg-grayA-2 p-2">
            <LoadingSpinner variant="ping" className="mx-1 -mb-0.5 mt-0.5 w-5" />
          </div>
        )}

        <ImageGallery message={message} />

        {message.jobs
          .flatMap((job) => job.errors)
          .map(
            (error, i) =>
              error && (
                <Callout.Root key={i} color="red" size="1">
                  <Callout.Icon>
                    <WarningCircle className="size-5" />
                  </Callout.Icon>
                  <Callout.Text className="border-b border-red-6 pb-1">{error.code}</Callout.Text>
                  <Callout.Text>{error.message}</Callout.Text>
                </Callout.Root>
              ),
          )}

        {showJson && <Pre>{JSON.stringify(message, null, 2)}</Pre>}
      </div>

      {/* menu */}
      <div className="shrink-0 pt-1.5 flex-col-start">
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

            {message.voiceover && (
              <DropdownMenu.Item
                color="red"
                onClick={() => void removeVoiceover({ messageId: message._id })}
              >
                Delete Voiceover
              </DropdownMenu.Item>
            )}

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
